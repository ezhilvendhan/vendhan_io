'user strict';

var Koa = require('koa'),
    route = require('koa-route'),
    serve = require('koa-static'),
    mount = require('koa-mount'),
    app = new Koa(),
    blog = require('./lib/controller/blog');

app.name = "vendhan_io";
app.jsonSpaces = 2;

app.use(serve(__dirname + '/public'));
app.use(mount('/', blog));
let port = process.env.PORT || 3000;
app.listen(port);
console.log("Listening on port : " + port);
