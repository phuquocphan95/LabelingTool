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
              />B-NAME
            </label>
            <label className="radio-inline">
              <input type="radio" name="optradio"
              defaultChecked={this.props.label == "I-NAME"}
              />I-NAME
            </label>
            <label className="radio-inline">
              <input type="radio" name="optradio"
              defaultChecked={this.props.label == "B-AGE"}
              />B-AGE
            </label>
            <label className="radio-inline">
              <input type="radio" name="optradio"
              defaultChecked={this.props.label == "I-AGE"}
              />I-AGE
            </label>
            <label className="radio-inline">
              <input type="radio" name="optradio"
              defaultChecked={this.props.label == "O"}
              />O
            </label>
          </form>
        </td>
      </tr>
    )
  }
}

class LabelManager extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      pageid : 1,
      message : [],
      labels : []
    }
  }

  componentWillMount() {
    self = this
    $.ajax({
      type: "GET",
      url: "files/" + self.props.fileid + "/" + "1",
      dataType: "JSON",
      success: (data) => {
        var labels = data.message.map((message) => message.label)
        self.setState({
          pageid : 1,
          message : data.message,
          labels : labels
        })
      }
    })
  }

  render () {
    var rowlist = this.state.message.map(
      (message) => <LabelRows token={message.token} label={message.label}/>
    )
    return (
      <div className="col-sm-10 col-sm-offset-1">
        <div className="row">
          <div className="col-sm-3">
            <button type="button" id="btnCommit" className="btn btn-success">Commit</button>
          </div>
          <div className="col-sm-3">
            <button type="button" id="btnCommit" className="btn btn-primary">
              <span className="glyphicon glyphicon-download-alt"></span> Download
            </button>
          </div>
        </div>
        <div className="row">
        </div>
        <div className="row">
          <div className="col-sm-12">
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
          </div>
        </div>
      </div>
    )
  }
}
