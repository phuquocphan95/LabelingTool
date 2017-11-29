exports.error = function(res, code, message = "") {
  res.status(code).send(message)
  return message
}

exports.success = function(res, message) {
  res.status(200).send(message)
  return message
}
