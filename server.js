var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");

var app = express();
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

  // Initialize the app.
app.listen(process.env.PORT || 3000, function () {
  console.log("App now running on port");
  });
});