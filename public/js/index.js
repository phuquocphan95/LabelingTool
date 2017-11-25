class TableRow extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <tr>
        <td>{this.props.filename}</td>
        <td>{this.props.postnumber}</td>
        <td>
          <div className="col-sm-4">
            <button type="button" className="btn btn-danger"
              onClick={this.props.handledelete.bind(this, this.props.id)}>
              <span className="glyphicon glyphicon-trash"></span>
            </button>
          </div>
          <div className="col-sm-4">
            <button type="button" className="btn btn-success"
              onClick={this.props.handleopen.bind(this, this.props.id, this.props.postnumber)}>
              <span className="glyphicon glyphicon-folder-open"></span>
            </button>
          </div>
        </td>
      </tr>
    )
  }
}

class FileManager extends React.Component {
  constructor(props) {
    super(props)
    this.state = {files : []}
    this.handleAddFile = this.handleAddFile.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    this.handleOpen = this.handleOpen.bind(this)
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
    var self = this
    var r = confirm("Are you sure?")

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

  handleOpen(fileid, pagenumber) {
    ReactDOM.render(<LabelManager fileid={fileid} pagenumber={pagenumber}/>,
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
    var self = this
    var rowlist = this.state.files.map(
      function (file) {
        return (
          <TableRow
            filename={file.name}
            id={file.id}
            postnumber={file.pagenumber}
            handledelete={self.handleDelete}
            handleopen={self.handleOpen}/>
        )
      }
    )

    return (
      <div className="col-sm-10 col-sm-offset-1">
        <div className="row">
          <div className="col-sm-3">
            <button type="button" id="btnAddFile" className="btn btn-primary"
            onClick={(function () {$("#hiddenFileChooser").click()}).bind(this)}>
              <span className="glyphicon glyphicon-plus"></span> Add file
            </button>
          </div>
          <input type="file" id="hiddenFileChooser" accept=".csv"
          onChange={this.handleAddFile}/>
        </div>
        <div className="row">
          <div className="col-sm-12">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>File name</th>
                  <th>Post number</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rowlist}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }
}

ReactDOM.render(<FileManager />, document.getElementById("root"))
