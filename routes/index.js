var express = require('express')
var path = require('path')
var router = express.Router()

router.get('/', function (req, res) {
  res.send("OK")
})

module.exports = router
