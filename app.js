var http = require('http');
var express = require('express');
var jsonServer = require('json-server');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var app = express();
var httpServer = http.createServer(app);

const blog = require('./server/service/blog.js');

app.set('trust proxy', 1);


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
	res.sendfile('index.html', { root: "public" } );
});


var jsonDataRoutes = require('./server/routes/json-data.js')();

const posts = blog.getPosts();

app.get('/api/posts/:id', (req, res, next) => {
	var requestedPost;
	posts.every(function(post) {
		if(post.id == req.params.id) {
			requestedPost = post;
			return false;
		}
		return true;
	});
	if(!requestedPost) {
		var err = new Error('Not Found');
		err.status = 404;
		next(err);
	};
	res.send(requestedPost);
})

app.use(['/api', '/api'], jsonServer.router(jsonDataRoutes));

app.get('/favicon.ico', function (req, res) {
	res.send('favicon.ico');
});


// catch 404 and forward to error handler
app.use(function(err, req, res, next) {
  console.error(err.stack);
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

app.use(function(err, req, res, next) {
	if (!res.headersSent) {
		res.status(err.status || 500);
		res.send({
			message: err.message,
			error: {}
		});
	}
});

app.name = "vendhan_io";
app.jsonSpaces = 2;

httpServer.listen(process.env.PORT || 3000, function () {
	console.log ('Server started on port: ' + httpServer.address().port);
});

module.exports = app;
