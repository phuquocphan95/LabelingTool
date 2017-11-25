var React = require('react')

class Index extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <html>
        <head>
          <meta charSet="utf-8"/>
          <title>File Manager</title>
          <link rel="stylesheet" href="public/libs/bootstrap/css/bootstrap.min.css"/>
          <link rel="stylesheet" href="public/css/index.css"/>
          <script type="text/javascript" src="public/libs/jquery/js/jquery.min.js"></script>
          <script type="text/javascript" src="public/libs/bootstrap/js/bootstrap.min.js"></script>
        </head>
        <body>
          <div id="root"></div>
          <script src="public/libs/react/js/babel.min.js"></script>
          <script src="public/libs/react/js/react.min.js"></script>
          <script src="public/libs/react/js/react-dom.js"></script>
          <script type="text/jsx" src="public/js/index.js"></script>
        </body>
      </html>
    )
  }
}

export default Index
