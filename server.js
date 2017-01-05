var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");

var app = express();
app.use(express.static(__dirname));
app.use(bodyParser.json());

app.get('/', function(req, res, next) {
	res.sendFile('index.html')
});

  // Initialize the app.
app.listen(process.env.PORT || 3001, function () {
  console.log("App now running on port");
});