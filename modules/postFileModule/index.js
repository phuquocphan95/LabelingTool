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
        uploadDir: configs.uploaddir,
        keepExtensions: false
      })

  return new Promise(function (resolve, reject) {
    form.parse(req, function (err, fields, files) {
      if (err) reject(err)
      else resolve(files.file)
    })
  })
  .then(createFolder)
  .then(function (uploadinfo) {
    var newfileinfo = {
      id : uploadinfo.fileid,
      name : uploadinfo.fileoriginalname,
      pagenumber: 0,
      status: 1 // 0: error, 1: processing, 2: ready
    }
    return updateInformation(newfileinfo)
    .then(function (newdata) {
      return responsemaker.success(res, newdata)
    })
    .then(function (newdata) {
      return uploadinfo
    })
  })
  .then(
    executePython,
    function (err) {
      return Promise.reject(responsemaker.error(res, 500))
    }
  )
  .then (function (arguments) {
    var uploadinfo = arguments.uploadinfo
    var filepath = uploadinfo.filepath
    var uploadeddir = uploadinfo.uploadeddir
    var fileid = uploadinfo.fileid
    var fileoriginalname = uploadinfo.fileoriginalname
    var newfileinfo = {
      id : fileid,
      name : fileoriginalname,
      pagenumber: arguments.result.postnumber,
      status: 2 // 0: error, 1: processing, 2: ready
    }
    return updateInformation(newfileinfo)
  })
  .catch(function (err) {console.log(err)})
}

function createFolder(file) {
  /*create folder*/
  var filepath = file.path
  var filepatharr = filepath.split("/")
  var fileid = filepatharr[filepatharr.length - 1]
  var fileoriginalname = file.name
  var uploadeddir = path.join(configs.filesdir, fileid)
  var uploadinfo = {
    filepath : filepath,
    fileid : fileid,
    fileoriginalname : fileoriginalname,
    uploadeddir : uploadeddir
  }
  return new Promise(function (resolve, reject) {
    // create empty new dir for new files
    fs.ensureDir(uploadeddir, function (err) {
      if (err) reject(err)
      else resolve(uploadinfo)
    })
  })
}

function updateInformation(newfileinfo) {
  /*update info*/
  return new Promise(function (resolve, reject) {
    fs.readFile(path.join(configs.filesdir, "info.json"), function (err, data) {
      if (err) reject(err)
      else resolve(JSON.parse(data))
    })
  })
  .then(function (data) {
    var filterresult = data.files.filter((file) => file.id == newfileinfo.id)
    var newdata = {}

    if (filterresult.length == 0)
    {
      // add new file
      newdata = {
        filenumber : data.filenumber + 1,
        files : data.files.concat(newfileinfo)
      }
    }
    else
    {
      // update information
      newdata = {
        filenumber : data.filenumber,
        files : data.files.map(function (file) {
          if (file.id == newfileinfo.id) return newfileinfo
          else return file
        })
      }
    }
    return new Promise(function (resolve, reject) {
      fs.writeFile(path.join(configs.filesdir, "info.json"), JSON.stringify(newdata),
        function (err) {
          if (err) reject(err)
          else resolve(newdata)
        }
      )
    })
  })
}

function executePython(uploadinfo) {
  /*execute python*/
  var filepath = uploadinfo.filepath
  var uploadeddir = uploadinfo.uploadeddir
  var fileid = uploadinfo.fileid
  var fileoriginalname = uploadinfo.fileoriginalname

  return new Promise(function (resolve, reject) {
    var options = {
          mode: "json",
          scriptPath: configs.scriptdir,
          args: [filepath, uploadeddir]
        }
    python.run('resolvecsv.py', options, function (err, result) {
      if (err) reject(err)
      else resolve({
        uploadinfo : uploadinfo,
        result : result[0]
      })
    })
  })
  .catch (function (err) {
    /*update file status to error*/
    var newfileinfo = {
      id : fileid,
      name : fileoriginalname,
      pagenumber: 0,
      status: 0 // 0: error, 1: processing, 2: ready
    }

    return updateInformation(newfileinfo)
    .then(function () {return Promise.reject()})
  })
}
