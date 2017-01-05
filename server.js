var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");

var app = express();
app.use(express.static(__dirname));
app.use(bodyParser.json());


// app.use(function(req, res, next) {
// 	if(req.headers['x-forwarded-proto'] === 'http') {
// 		res.redirect('http://' + req.hostname + req.url);
// 	} else {
// 		next();
// 	}
// });


var forceSsl = function (req, res, next) {
    if (req.headers['x-forwarded-proto'] !== 'https') {
        return res.redirect(['https://', req.get('Host'), req.url].join(''));
    }
    return next();
 };

app.configure(function () {

    if (env === 'production') {
        app.use(forceSsl);
    }
    // other configurations etc for express go here...
}

app.get('/', function(req, res, next) {
	res.sendFile('index.html')
});

  // Initialize the app.
app.listen(process.env.PORT || 3001, function () {
  console.log("App now running on port");
});