var express = require('express')
var path = require('path')
var router = express.Router()
var authenticate = require('./../modules/helpers/authenticate.js')
var handler = require('./../modules/getFileListModule')

router.get('/', function (req, res) {
  res.send("OK")
})

router.get('/filelist', authenticate, handler)

module.exports = router
