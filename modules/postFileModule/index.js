var Promise = require("bluebird")
var fs = require("fs-extra")
var configs = require("./../../config.js")
var responsemaker = require("./../helpers/makeresponse.js")
var path = require("path")
var python = require("python-shell")
var formidable = require("formidable")
var python = require("python-shell")

module.exports = function (req, res) {

  var form = new formidable.IncomingForm({
        uploadDir: configs.uploaddir,
        keepExtensions: false
      })

  return new Promise(function (resolve, reject) {
    form.parse(req, function (err, fields, files) {
      if (err) reject(err)
      else resolve(files.file)
    })
  })
  .then(createFolder)
  .then(readInformation)
  .then(function (arguments) {
    var uploadinfo = arguments.uploadinfo
    var info = arguments.info
    var newfileinfo = {
      id : uploadinfo.fileid,
      name : uploadinfo.fileoriginalname,
      pagenumber: 0,
      status: 1 // 0: error, 1: processing, 2: ready
    }
    var newinfo = {
      filenumber : info.filenumber + 1,
      files : info.files.concat([newfileinfo])
    }
    return updateInformation(
      {
        uploadinfo : uploadinfo,
        info : newinfo
      }
    )
    .then(function () {
      responsemaker.success(res, newinfo)
      return (
        {
          uploadinfo : uploadinfo,
          info : newinfo
        }
      )
    })
  })
  .then(
    executePython,
    function (err) {
      return Promise.reject(responsemaker.error(res, 500))
    }
  )
  .then (function (arguments) {
    var info = arguments.info
    var uploadinfo = arguments.uploadinfo
    var filepath = uploadinfo.filepath
    var uploadeddir = uploadinfo.uploadeddir
    var fileid = uploadinfo.fileid
    var fileoriginalname = uploadinfo.fileoriginalname
    var newfileinfo = {
      id : fileid,
      name : fileoriginalname,
      pagenumber: arguments.result.postnumber,
      status: 2 // 0: error, 1: processing, 2: ready
    }
    var newinfo = {
      filenumber : info.filenumber,
      files : info.files.map(function (file) {
        if (file.id == fileid) return newfileinfo
        else return file
      })
    }
    console.log(newinfo.files)
    return updateInformation(
      {
        info : newinfo,
        uploadinfo : uploadinfo
      }
    )
  })
  .catch(function (err) {console.log(err)})
}

function createFolder(file) {
  /*create folder*/
  var filepath = file.path
  var filepatharr = filepath.split("/")
  var fileid = filepatharr[filepatharr.length - 1]
  var fileoriginalname = file.name
  var uploadeddir = path.join(configs.filesdir, fileid)
  var uploadinfo = {
    filepath : filepath,
    fileid : fileid,
    fileoriginalname : fileoriginalname,
    uploadeddir : uploadeddir
  }
  return new Promise(function (resolve, reject) {
    // create empty new dir for new files
    fs.ensureDir(uploadeddir, function (err) {
      if (err) reject(err)
      else resolve(uploadinfo)
    })
  })
}

function readInformation(uploadinfo) {
  /*read information*/
  return new Promise(function (resolve, reject) {
    fs.readFile(path.join(configs.filesdir, "info.json"), function (err, data) {
      if (err) reject(err)
      else resolve({
        info : JSON.parse(data),
        uploadinfo : uploadinfo
      })
    })
  })
}

function updateInformation(arguments) {
  /*update info*/
  var info = arguments.info
  var uploadinfo = arguments.uploadinfo

  return new Promise(function (resolve, reject) {
    fs.writeFile(path.join(configs.filesdir, "info.json"), JSON.stringify(info),
      function (err) {
        if (err) reject(err)
        else resolve({
          info : info,
          uploadinfo : uploadinfo
        })
      })
  })
}

function executePython(arguments) {
  /*execute python*/
  var info = arguments.info
  var uploadinfo = arguments.uploadinfo
  var filepath = uploadinfo.filepath
  var uploadeddir = uploadinfo.uploadeddir
  var fileid = uploadinfo.fileid
  var fileoriginalname = uploadinfo.fileoriginalname

  return new Promise(function (resolve, reject) {
    var options = {
          mode: "json",
          scriptPath: configs.scriptdir,
          args: [filepath, uploadeddir]
        }
    python.run('resolvecsv.py', options, function (err, result) {
      if (err) reject(err)
      else resolve({
        info : info,
        uploadinfo : uploadinfo,
        result : result[0]
      })
    })
  })
  .catch (function (err) {
    /*update file status to error*/
    console.log(err)
    var newfileinfo = {
      id : fileid,
      name : fileoriginalname,
      pagenumber: 0,
      status: 1 // 0: error, 1: processing, 2: ready
    }
    var newinfo = {
      filenumber : info.filenumber,
      files : info.files.map(function (file) {
        if (file.id == fileid) return newfileinfo
        else return file
      })
    }
    return updateInformation(
      {
        info : info,
        uploadinfo : uploadinfo,
        newinfo : newinfo
      }
    )
    .then(function () {return Promise.reject()})
  })
}
