var Promise = require("bluebird")
var fs = require("fs-extra")
var configs = require("./../../config.js")
var responsemaker = require("./../helpers/makeresponse.js")
var path = require("path")
var python = require("python-shell")

module.exports = function (req, res) {
  var urlelements = req.url.split("/")
  var fileid = urlelements[urlelements.length - 1]

  return new Promise(function (resolve, reject) {
    fs.readFile(path.join(configs.filesdir, "info.json"), function (err, data) {
      if (err) reject(err)
      else resolve(data)
    })
  })
  .then(function (data) {
    var info = JSON.parse(data)
    var array = info.files.filter(
      function (element) {
        return element.id === fileid
      })

    switch (array.length) {
      case 0:
        return responsemaker.error(res, 404, { message : "file not found" })
        break
      case 1:
        return new Promise(function (resolve, reject) {
          var options = {
                mode: "json",
                scriptPath: configs.scriptdir,
                args: [
                  path.join(configs.filesdir, fileid),
                  array[0].pagenumber,
                  path.join(configs.downloadir, fileid)
                ]
              }
          python.run("concatcsv.py", options, function (err, result) {
            if (err) reject(err)
            else resolve(result)
          })
        })
        .then(function (result) {
          // send file to browser
          return new Promise(function (resolve, reject) {
            res.status(200).download(
              path.join(configs.downloadir, fileid),
              array[0].name,
              function (err) {

                if (err) reject(err)
                else resolve(path.join(configs.downloadir, fileid))
              }
            )
          })
        })
        break
      default:
        Promise.reject()
    }
  })
  .then(
    function (filepath) {
      // Delete temp file
      return new Promise(function (resolve, reject) {
        fs.remove(filepath, function (err) {
          if (err) reject(err)
          else resolve()
        })
      })
    },
    function (err) {
      return responsemaker.error(res, 500, { message : "internal error" })
    }
  )
  .catch(function (err) {
    console.log(err)
  })
}
