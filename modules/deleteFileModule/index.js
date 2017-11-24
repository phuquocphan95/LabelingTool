var Promise = require("bluebird")
var fs = require("fs-extra")
var configs = require("./../../config.js")
var responsemaker = require("./../helpers/makeresponse.js")
var path = require("path")

module.exports = function(req, res) {
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
        break;
      case 1:

        info = {
          "filenumber" : info.filenumber - 1,
          "files" : info.files.filter(function (element) {
            return element.id !== fileid
          })
        }

        return new Promise(function (resolve, reject) {
          // update info file
          fs.writeFile(path.join(configs.filesdir, "info.json"), JSON.stringify(info),
          function (err) {
            if (err) reject(err)
            else resolve(array[0].id)
          })
        })
        .then(function (fileid) {
          // delete folder
          return new Promise(function (resolve, reject) {
            fs.remove(path.join(configs.filesdir, fileid), function (err) {
              if (err) reject(err)
              else resolve()
            })
          })
          .then(function () {
            return responsemaker.success(res, { message : "success" })
          })
        })
        break;
      default:
        return Promise.reject()
    }
  })
  .catch(function (e) {
      return responsemaker.error(res, 500, { message : "internal error" })
  })
}
