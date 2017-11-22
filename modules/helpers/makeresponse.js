exports.error = function(res, code, message) {
  return res.status(code).send(message)
}

exports.success = function(res, message) {
  return res.status(200).send(message)
}
