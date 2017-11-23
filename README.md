1. Get file list:
input:
  GET /files
output:
  success:
  status code: 200
  {
    filenumber: <file number>,
    files: [
    {
      id: <file id>,
      name: <file name>,
      pagenumber : <pagenumber>
    },
    {
      id: <file id>,
      name: <file name>,
      pagenumber : <pagenumber>
    }
      ...
    ]
  }

  fail:
  status code: 500
  {
    message: "internal error"
  }

2. Delete a file
input:
  DELETE /files/:fileid
output:
  success:
  status code: 200
  {
    message: "Success"
  }
  fail:
  status code: 404
  {
    message: "file not found"
  }

  status code: 500
  {
    message: "internal error"
  }

3. Read file Page
input:
  GET /files/:fileid/:pageid
   1 <= pageid <= pagenumber
output:
success:
status code: 200
{
  message: [
  {
   token : <token>,
   label : <label>
  },
  {
   token : <token>,
   label : <label>
  },
  ...
  {
   token : <token>,
   label : <label>
  }
  ]
}
fail:
status code: 404 (when file isn't exist or pageid not found)
{
  message: "file not found"
}
status code: 500
{
  message: "internal error"
}
