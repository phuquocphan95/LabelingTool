1. Get file list:
input:
  GET /filelist
output:
  success:
  status code: 200
  {
    filenumber: <file number>,
    files: [
    {
      id: <file id>,
      name: <file name>
    },
    {
      id: <file id>,
      name: <file name>
    }
      ...
    ]
  }
  fail:
  status code: 500
