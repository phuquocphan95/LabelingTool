var Promise = require("bluebird")
var fs = require("fs-extra")
var configs = require("./../../config.js")
var responsemaker = require("./../helpers/makeresponse.js")
var path = require("path")

module.exports = function(req, res) {
  return new Promise(function (resolve, reject) {
    fs.readFile(path.join(configs.filesdir, "info.json"), function (err, data) {
      if (err) reject(err)
      else resolve(data)
    })
  })
  .then(
    function(data) {
      return responsemaker.success(res, JSON.parse(data))
    })
  .catch(
    function (e) {
      return responsemaker.error(res, 500, { message : "internal error" })
    })
}
