class LabelRows extends React.Component {
  constructor (props) {
    super(props)
  }
  onChecked (label) {
    this.props.label = label
    this.props.onupdate(this.props.index, label)
    this.setState({})
  }
  render () {
    return (
      <tr>
        <td>{this.props.token}</td>
        <td>{this.props.pos}</td>
        <td>
          <form>
            <label className="radio-inline">
              <input type="radio" name="optradio"
              checked={this.props.label == "B-NAME"}
              onChange={this.onChecked.bind(this, "B-NAME")}
              />B-NAME
            </label>
            <label className="radio-inline">
              <input type="radio" name="optradio"
              checked={this.props.label == "I-NAME"}
              onChange={this.onChecked.bind(this, "I-NAME")}
              />I-NAME
            </label>
            <label className="radio-inline">
              <input type="radio" name="optradio"
              checked={this.props.label == "B-AGE"}
              onChange={this.onChecked.bind(this, "B-AGE")}
              />B-AGE
            </label>
            <label className="radio-inline">
              <input type="radio" name="optradio"
              checked={this.props.label == "I-AGE"}
              onChange={this.onChecked.bind(this, "I-AGE")}
              />I-AGE
            </label>
            <label className="radio-inline">
              <input type="radio" name="optradio"
              checked={this.props.label == "O"}
              onChange={this.onChecked.bind(this, "O")}
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
        pos={message.pos}
        index={index}
        onupdate={self.props.onupdate}/>
    )
    return (
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Token</th>
            <th>POS</th>
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
    var pages = []
    var firstpage = this.props.pageid - this.props.halfpagebarsize
    var lastpage  = this.props.pageid + this.props.halfpagebarsize
    var redundancefirst = 1 - firstpage
    var redundancelast = lastpage - this.props.pagenumber

    if (redundancefirst > 0)
    {
      lastpage = lastpage + redundancefirst
      lastpage = (lastpage < this.props.pagenumber + 1) ? lastpage : this.props.pagenumber
      firstpage = 1
    }
    else
    {
      if (redundancelast > 0)
      {
        firstpage = firstpage - redundancelast
        firstpage = (firstpage > 0) ? firstpage : 1
        lastpage = this.props.pagenumber
      }
    }


    if (firstpage > 1)
    {
      pages.push(
        <li onClick={this.props.onpagechange.bind(this, 1)}><a href="#">first</a></li>
      )
    }
    else
    {
      pages.push(
        <li className="disabled"><a href="#">first</a></li>
      )
    }

    for (var i =firstpage; i < lastpage + 1; i++)
    {

      if (i == this.props.pageid)
      {
        pages.push(
          <li className="active"><a href="#">{i}</a></li>
        )
      }
      else
      {
        pages.push(
          <li
          onClick = {this.props.onpagechange.bind(this, i)}
          ><a href="#">{i}</a></li>
        )
      }
    }

    if (lastpage < this.props.pagenumber)
    {
      pages.push(
        <li onClick={this.props.onpagechange.bind(this, this.props.pagenumber)}><a href="#">last</a></li>
      )
    }
    else
    {
      pages.push(
        <li className="disabled"><a href="#">last</a></li>
      )
    }

    return (
        <ul className="pagination">
            {pages}
        </ul>
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
    this.state = {
      message : [],
      pageid: 1
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
          pageid : 1
        })
      }
    })
  }

  onPageChange (pageid) {
    var self = this
    $.ajax({
      type: "GET",
      url: "files/" + self.props.fileid + "/" + pageid,
      dataType: "JSON",
      success: function (data) {
        self.labels = data.message.map((message) => message.label)
        self.setState({
          message : data.message,
          pageid: pageid
        })
      }
      ,
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

  onUpdate (index, label) {
    var self = this
    this.labels[index] = label
    var labelstring = this.labels.join()
    $.ajax({
      type: "PUT",
      url: "files/" + self.props.fileid + "/" + self.state.pageid,
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
          <div className="col-sm-12">
            <Pagination
            onpagechange={this.onPageChange}
            pagenumber={this.props.pagenumber}
            pageid={this.state.pageid}
            halfpagebarsize={2}/>
          </div>
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
