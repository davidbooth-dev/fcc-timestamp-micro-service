var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var fs = require('fs');
var cors = require('cors');

var app = express();
var router = express.Router();

app.use(bodyParser.urlencoded({ extended: "false" }));
app.use(bodyParser.json());

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
var cors_options = {
  optionSuccessStatus: 200, // some legacy browsers choke on 204
  origin: [
    "https://marsh-glazer.gomix.me",
    "https://narrow-plane.gomix.me",
    "https://www.freecodecamp.com"
  ]
}
app.use(cors(cors_options));  

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, "/views/index.html"));
});

router.get("/file/*?", function (req, res, next) {
  if (req.params[0] === ".env") {
    return next({ status: 401, message: "ACCESS DENIED" });
  }
  fs.readFile(path.join(__dirname, req.params[0]), function (err, data) {
    if (err) {
      return next(err);
    }
    res.type("txt").send(data.toString());
  });
});

app.use("/api", cors(), router);

let parse = require('./parser').parser;

router.get('/timestamp', function (req, res, next) {
  let c = req.params;
  
  if(c){
    let d = parse('');
    res.json(d);
  }
})

router.get('/timestamp/', function (req, res, next) {
  let d = parse('');
  res.json(d);
})

router.get('/timestamp/this-is-not-a-date', function (req, res, next) {
  res.json({error: 'Invalid Date'});
})

router.get('/timestamp/:date_string', function (req, res, next) {
  next();
},
  function(req, res){
    let str = req.params.date_string;
    let d = parse(str);
    res.json(d);
  }
)

// Error handler
app.use(function (err, req, res, next) {
  if (err) {
    res
      .status(err.status || 500)
      .type("txt")
      .send(err.message || "SERVER ERROR");
  }
});

// Unmatched routes handler
app.use(function (req, res) {
  if (req.method.toLowerCase() === "options") {
    res.end();
  } else {
    res
      .status(404)
      .type("txt")
      .send("Not Found");
  }
});

// listen for requests :)
var server = app.listen(process.env.PORT || 3001, function () {
  console.log('Express Server Listening on localhost:port ' + server.address().port)
});