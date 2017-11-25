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
            <button type="button" className="btn btn-primary"
              onClick={this.props.handleopen.bind(this, this.props.id)}>
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

  }
  componentWillMount() {
    self = this
    $.ajax({
      type: "GET",
      url: "files",
      dataType: "JSON",
      success: (data) => self.setState(data)
    })
  }

  handleDelete(fileid) {
    alert("del" + fileid)
  }

  handleOpen(fileid) {
    alert("open" + fileid)
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
          <div className="col-sm-4">
            <button type="button" id="btnaddfile" className="btn btn-success">
              <span className="glyphicon glyphicon-plus"></span> Add file
            </button>
          </div>
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
