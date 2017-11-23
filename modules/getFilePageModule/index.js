var Promise = require("bluebird")
var fs = require("fs")
var configs = require("./../../config.js")
var responsemaker = require("./../helpers/makeresponse.js")
var path = require("path")
var python = require("python-shell")

module.exports = function(req, res) {
  var urlelements = req.url.split("/")
  var pageid = urlelements[urlelements.length - 1]
  var fileid = urlelements[urlelements.length - 2]

  return new Promise(function (resolve, reject) {
    fs.readFile(configs.fileinfopath, function (err, data) {
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
                args: [path.join(configs.filesdir, fileid, pageid) + ".csv"]
              }
          python.run('readcsv.py', options, function (err, result) {
            if (err) reject(err)
            else {
              resolve(result)
            }
          })
        })
        .then(function (result) {
          return responsemaker.success(res, { message: result} )
        })
        break
      default:
        Promise.reject()
    }
  })
  .catch(function (e) {
      return responsemaker.error(res, 500, { message : "internal error" })
  })
}
