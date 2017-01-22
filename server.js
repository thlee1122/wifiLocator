var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");

var app = express();
app.use(express.static(__dirname));
app.use(bodyParser.json());


app.use(function(req, res, next) {
	if(req.headers['x-forwarded-proto'] === 'https') {
		console.log('middleware xhttp');
		res.redirect('https://' + req.hostname + req.url);
	} else {
		next();
	}
});

app.get('/', function(req, res, next) {
	res.sendFile('index.html');
});

app.get('/about', function(req, res, next) {
	res.sendFile('About.html', { root: __dirname });
})


  // Initialize the app.
app.listen(process.env.PORT || 3001, function () {
  console.log("App now running on port");
});