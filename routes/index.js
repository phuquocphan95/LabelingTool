var express = require("express")
var path = require("path")
var router = express.Router()
var authenticate = require("./../modules/helpers/authenticate.js")
var getfilelisthandler = require("./../modules/getFileListModule")
var deletefilehandler = require("./../modules/deleteFileModule")
var getfilepagehandler = require("./../modules/getFilePageModule")
var postfilehandler = require("./../modules/postFileModule")
var getfilehandler = require("./../modules/getFileModule")

router.get("/", function (req, res) {
  res.send("OK")
})

router.get("/files", authenticate, getfilelisthandler)
router.delete("/files/:fileid", authenticate, deletefilehandler)
router.get("/files/:fileid/:pageid", authenticate, getfilepagehandler)
router.post("/files", authenticate, postfilehandler)
router.get("/files/:fileid", authenticate, getfilehandler)

module.exports = router
