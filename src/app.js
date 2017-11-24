var Promise = require("bluebird")
var express = require("express")
var routes  = require("../routes")
var argv    = require("optimist").argv
var app     = express()
var cors    = require("cors")
var path    = require("path")
var bodyParser = require("body-parser")
var methodOverride = require("method-override")
var configs = require("../config")
var fs = require("fs-extra")
var fileinfodir = path.join(configs.filesdir, "info.json")

if (!fs.existsSync(fileinfodir)) {
  var info = {
    filenumber : 0,
    files: []
  }
  fs.writeFile(fileinfodir, JSON.stringify(info), function (err) {
      if (err) console.log("Can't create " + fileinfodir)
    }
  )
}

app.set("port", {
  port: argv.p || 7770
})
app.set("view engine", "jsx");
app.engine("jsx", require("express-react-views").createEngine())
app.use(cors())
app.use("/public", express.static(path.join(__dirname, "./../public")))
app.use("/views", express.static(path.join(__dirname, "./../views")))
app.use(express.query())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(methodOverride())
app.use("/", routes)
module.exports = app
