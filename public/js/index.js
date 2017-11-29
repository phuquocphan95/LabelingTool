class TableRow extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    var statuscom = null
    var deldisable = false
    var opendisable = false
    switch (this.props.status) {
      case 0:
        statuscom = <i>Error</i>
        opendisable = true
        break;
      case 1:
        statuscom = <i>Processing</i>
        deldisable = true
        opendisable = true
        break;
      case 2:
        statuscom = <i>Ready</i>
        break;
      default:
        deldisable = true
        opendisable = true
        statuscom = <i>Undefined</i>
        break;
    }
    return (
      <tr>
        <td>{this.props.filename}</td>
        <td>{this.props.postnumber}</td>
        <td>{statuscom}</td>
        <td>
          <div className="col-sm-4">
            <button type="button" className="btn btn-danger"
              onClick={this.props.handledelete.bind(this, this.props.id)}
              disabled={deldisable}>
              <span className="glyphicon glyphicon-trash"></span>
            </button>
          </div>
          <div className="col-sm-4">
            <button type="button" className="btn btn-success"
                onClick={
                this.props.handleopen.bind(
                  this,
                  this.props.id,
                  this.props.postnumber,
                  this.props.filename
                )}
                disabled={opendisable}
                >
              <span className="glyphicon glyphicon-folder-open"></span>
            </button>
          </div>
        </td>
      </tr>
    )
  }
}

class FileTable extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    var self = this
    var rowlist = this.props.files.map(
      function (file) {
        return (
          <TableRow
            filename={file.name}
            id={file.id}
            postnumber={file.pagenumber}
            status={file.status}
            handledelete={self.props.handledelete}
            handleopen={self.props.handleopen}/>
        )
      }
    )
    return (
      <table className="table table-striped">
        <thead>
          <tr>
            <th>File name</th>
            <th>Post number</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rowlist}
        </tbody>
      </table>
    )
  }
}

class FileManager extends React.Component {
  constructor(props) {
    super(props)
    this.state = {files : []}
    this.handleAddFile = this.handleAddFile.bind(this)
    this.handleOpen = this.handleOpen.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
  }

  componentWillMount() {
    var self = this
    $.ajax({
      type: "GET",
      url: "files",
      dataType: "JSON",
      success: (data) => self.setState(data)
    })
  }

  handleDelete(fileid) {
    var r = confirm("Are you sure?")
    var self = this
    if (r == true)
    {
      $.ajax({
        type: "DELETE",
        url: "files/" + fileid,
        dataType: "JSON",
        success: function (data) {
          new PNotify({
            title: "Success",
            text: "Successfully delete file",
            type: "success",
            stack : false,
            delay: 1000
          })
          self.setState(data)
        },
        error: function (xhr, ajaxOptions, thrownError) {
          switch (xhr.status) {
            case 500:
              new PNotify({
                title: "Error",
                text: "Internal server error",
                type: "error",
                stack : false,
                delay: 1000
              })
              break;
            case 404:
              new PNotify({
                title: "Error",
                text: "File not found",
                type: "error",
                stack : false,
                delay: 1000
              })
              break;
            default:
              new PNotify({
                title: "Error",
                text: "Error code " + xhr.status,
                type: "error",
                stack : false,
                delay: 1000
              })
          }
        }
      })
    }
  }

  handleOpen(fileid, pagenumber, filename) {
    ReactDOM.render(<LabelManager
      fileid={fileid}
      pagenumber={pagenumber}
      filename={filename}/>,
      document.getElementById("root"))
  }

  handleAddFile() {
    var self = this
    var data = new FormData();
    data.append( "file", $( "#hiddenFileChooser" )[0].files[0] );
    $.ajax({
          url: "/files",
          type: "POST",
          data: data,
          contentType: false,
          processData: false,
          success: function (data, textStatus, xhr) {
            new PNotify({
              title: "Success",
              text: "Successfully adding new file",
              type: "success",
              stack : false,
              delay: 1000
            })
            $("#hiddenFileChooser").val("")
            self.setState(data)
          },
          error: function (xhr, ajaxOptions, thrownError) {
            switch (xhr.status) {
              case 500:
                new PNotify({
                  title: "Error",
                  text: "Internal server error please check your file format",
                  type: "error",
                  stack : false,
                  delay: 1000
                })
                break;
              default:
                new PNotify({
                  title: "Error",
                  text: "Error code " + xhr.status,
                  type: "error",
                  stack : false,
                  delay: 1000
                })
            }
          }
    })
  }

  render() {
    return (
      <div className="col-sm-10 col-sm-offset-1">
        <div className="row">
          <div className="col-sm-3">
            <button type="button" id="btnAddFile" className="btn btn-primary"
            onClick={(function () {$("#hiddenFileChooser").click()}).bind(this)}>
              <span className="glyphicon glyphicon-plus"></span> Add file
            </button>
          </div>
          <div className="col-sm-3">
            <button type="button" id="btnRefresh" className="btn btn-success"
            onClick={(function () {location.reload()}).bind(this)}>
              <span className="glyphicon glyphicon-refresh"></span> Refresh
            </button>
          </div>
        </div>
        <div className="row">
          <input type="file" id="hiddenFileChooser" accept=".csv" onChange={this.handleAddFile}/>
        </div>
        <div className="row">
          <div className="col-sm-12">
            <FileTable
                      handleopen={this.handleOpen}
                      handledelete={this.handleDelete}
                      files={this.state.files}/>
          </div>
        </div>
      </div>
    )
  }
}

ReactDOM.render(<FileManager />, document.getElementById("root"))
