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
const argv = require('minimist')(process.argv.slice(2));
const root = argv.dev ? 'public' : 'dist/public';

app.set('trust proxy', 1);


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, root)));

app.get('/', function(req, res){
	res.sendfile('index.html', { root: root } );
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
});

const d121Data = require(path.resolve(__dirname, 'server/data/ic-d121.json'));
const vgg13Data = require(path.resolve(__dirname, 'server/data/ic-vgg13.json'));
const vgg16Data = require(path.resolve(__dirname, 'server/data/ic-vgg16.json'));
const catData = require(path.resolve(__dirname, 'server/data/ic-cat.json'));

const imagesForIc1 = ((map) => {
	let images = [];
	const prefix = "/resources/flowers";
	let val,
			count = 0;
	for(key in map) {
		val = map[key].image.replace("../aipnd-project/flowers/test", prefix);
		images.push({
			"source": val,
			"order": ++count,
			"name": key.split(".")[0]
		});
	}
	return images;
})(d121Data);

app.get('/api/data/ic1-images', (req, res, next) => {
	let results = [];
	for(let idx = 0; idx < 10; idx++) {
		const item = Math.floor(Math.random() * (imagesForIc1.length));
		results.push(imagesForIc1[item])
	}
	res.send(results);
});

app.post('/api/actions/ic1/predict', (req, res, next) => {
	let results;
	const img = req.body.img,
				model = req.body.model;
	if(model < 0 || model > 2 || !img) {
		let err = new Error('Not Found');
		err.status = 404;
		next(err);
	}
	const data = [d121Data, vgg13Data, vgg16Data][model];
	if(data) {
		const _res = data[img+".jpg"];
		const _cat = _res.image.split(`/${img}`)[0].split("/").pop();
		result = {
			"expected": catData[_cat],
			"actual": _res.result,
			"confidence": _res.confidence,
			"topK": [
				{"name": _res.topk_classes[0], "value": _res.topk_probs[0]},
				{"name": _res.topk_classes[1], "value": _res.topk_probs[1]},
				{"name": _res.topk_classes[2], "value": _res.topk_probs[2]}
			]
		};
	}
	res.send(result);
});

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
