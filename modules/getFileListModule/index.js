var Promise = require('bluebird')
var readFile = Promise.promisify(require('fs').readFile)
var configs = require('./../../config.js')
var responsemaker = require('./../helpers/makeresponse.js')

module.exports = function(req, res) {
  return readFile(configs.fileinfopath)
  .then(
    function(data) {
      return responsemaker.success(res, JSON.parse(data))
    },
    function (e) {
      return responsemaker.error(res, 500, "Internal Error")
    }
  )
}
