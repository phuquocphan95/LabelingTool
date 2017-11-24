var Promise = require("bluebird")
var fs = require("fs-extra")
var configs = require("./../../config.js")
var responsemaker = require("./../helpers/makeresponse.js")
var path = require("path")
var python = require("python-shell")
var formidable = require("formidable")
var python = require("python-shell")

module.exports = function (req, res) {
  var form = new formidable.IncomingForm({
        uploadDir: configs.tmpdir,
        keepExtensions: false
      })

  return new Promise(function (resolve, reject) {
    form.parse(req, function (err, fields, files) {
      if (err) reject(err)
      else resolve(files.file)
    })
  })
  .then(function (file) {
    var filepath = file.path
    var filepatharr = filepath.split("/")
    var fileid = filepatharr[filepatharr.length - 1]
    var fileoriginalname = file.name
    var uploadeddir = path.join(configs.filesdir, fileid)

    return new Promise(function (resolve, reject) {
      // create empty new dir for new files
      fs.ensureDir(uploadeddir, function (err) {
        if (err) reject(err)
        else resolve(uploadeddir)
      })
    })
    .then(function (uploadeddir) {
      // tokenize csv file using python
      return new Promise(function (resolve, reject) {
        var options = {
              mode: "json",
              scriptPath: configs.scriptdir,
              args: [filepath, uploadeddir]
            }
        python.run('resolvecsv.py', options, function (err, result) {
          if (err) reject(err)
          else resolve(result)
        })
      })
    })
    .then(function (result) {
      // update info.json
      return new Promise(function (resolve, reject) {
        fs.readFile(path.join(configs.filesdir, "info.json"), function (err, data) {
          if (err) reject(err)
          else resolve(data)
        })
      })
      .then(function (data) {
        var info = JSON.parse(data)
        var newfileinfo = {
          id : fileid,
          name : fileoriginalname,
          pagenumber: result[0].postnumber
        }
        var newinfo = {
          filenumber : info.filenumber + 1,
          files : info.files.concat([newfileinfo])
        }

        return new Promise(function (resolve, reject) {
          fs.writeFile(path.join(configs.filesdir, "info.json"),
            JSON.stringify(newinfo),
            function (err) {
              if (err) reject(err)
              else resolve(newinfo)
            })
        })
        .then(function (newinfo) {
          responsemaker.success(res, newinfo)
          return filepath
        })
      })
    })
  })
  .then(
    function (path) { return path },
    function (err) {
      return responsemaker.error(res, 500, { message : "internal error" })
    }
  )
  .then(function (filepath) {
    // Delete temp file
    return new Promise(function (resolve, reject) {
      fs.remove(filepath, function (err) {
        if (err) reject(err)
        else resolve()
      })
    })
  })
  .catch(function (err) {
    console.log(err)
  })
}
