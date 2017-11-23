var Promise = require("bluebird")
var readfile = Promise.promisify(require("fs-extra").readFile)
var writefile = Promise.promisify(require("fs-extra").writeFile)
var removefile = Promise.promisify(require("fs-extra").remove)
var configs = require("./../../config.js")
var responsemaker = require("./../helpers/makeresponse.js")

module.exports = function(req, res) {
  var urlelements = req.url.split("/")
  var pageid = urlelements[urlelements.length - 1]
  var fileid = urlelements[urlelements.length - 2]

  return readfile(configs.fileinfopath)
  .then()
}
