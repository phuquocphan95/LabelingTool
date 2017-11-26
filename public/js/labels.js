class LabelRows extends React.Component {
  constructor (props) {
    super(props)
  }
  render () {
    return (
      <tr>
        <td>{this.props.token}</td>
        <td>
          <form>
            <label className="radio-inline">
              <input type="radio" name="optradio"
              defaultChecked={this.props.label == "B-NAME"}
              onClick={this.props.onupdate.bind(this, this.props.index, "B-NAME")}
              />B-NAME
            </label>
            <label className="radio-inline">
              <input type="radio" name="optradio"
              defaultChecked={this.props.label == "I-NAME"}
              onClick={this.props.onupdate.bind(this, this.props.index, "I-NAME")}
              />I-NAME
            </label>
            <label className="radio-inline">
              <input type="radio" name="optradio"
              defaultChecked={this.props.label == "B-AGE"}
              onClick={this.props.onupdate.bind(this, this.props.index, "B-AGE")}
              />B-AGE
            </label>
            <label className="radio-inline">
              <input type="radio" name="optradio"
              defaultChecked={this.props.label == "I-AGE"}
              onClick={this.props.onupdate.bind(this, this.props.index, "I-AGE")}
              />I-AGE
            </label>
            <label className="radio-inline">
              <input type="radio" name="optradio"
              defaultChecked={this.props.label == "O"}
              onClick={this.props.onupdate.bind(this, this.props.index, "O")}
              />O
            </label>
          </form>
        </td>
      </tr>
    )
  }
}

class TokenTable extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    var self = this
    var rowlist = this.props.message.map(
      (message, index) =>
      <LabelRows
        token={message.token}
        label={message.label}
        index={index}
        onupdate={self.props.onupdate}/>
    )
    return (
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Token</th>
            <th>Label</th>
          </tr>
        </thead>
        <tbody>
          {rowlist}
        </tbody>
      </table>
    )
  }
}

class Pagination extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    return (
      <div>1,2,3</div>
    )
  }
}

class LabelManager extends React.Component {
  constructor (props) {
    super(props)
    this.onPageChange = this.onPageChange.bind(this)
    this.onUpdate = this.onUpdate.bind(this)
    this.onDownload = this.onDownload.bind(this)
    this.labels = []
    this.props.pageid = 1
    this.state = {
      message : [],
    }
  }

  componentWillMount() {
    var self = this
    $.ajax({
      type: "GET",
      url: "files/" + self.props.fileid + "/" + "1",
      dataType: "JSON",
      success: (data) => {
        self.labels = data.message.map((message) => message.label)
        self.setState({
          message : data.message,
        })
      }
    })
  }

  onPageChange (pageid) {

  }

  onUpdate (index, label) {
    var self = this
    this.labels[index] = label
    var labelstring = this.labels.join()
    $.ajax({
      type: "PUT",
      url: "files/" + self.props.fileid + "/" + self.props.pageid,
      dataType: "JSON",
      data: {
        labels: labelstring
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
              text: "File or page not found",
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

  onDownload () {
    window.location.href = "files/" + this.props.fileid
  }

  render () {
    var rowlist = this.state.message.map(
      (message, index) =>
      <LabelRows token={message.token} label={message.label} index={index}/>
    )
    return (
      <div className="col-sm-10 col-sm-offset-1">
        <div className="row">
          <div className="col-sm-12">
            <h1>{this.props.filename}</h1>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-3">
            <button type="button" id="btnDownload" className="btn btn-primary"
              onClick={this.onDownload}>
              <span className="glyphicon glyphicon-download-alt"></span> Download
            </button>
          </div>
        </div>
        <div className="row">
          <Pagination/>
        </div>
        <div className="row">
          <div className="col-sm-12">
            <TokenTable
              message={this.state.message}
              onupdate={this.onUpdate}/>
          </div>
        </div>
      </div>
    )
  }
}
