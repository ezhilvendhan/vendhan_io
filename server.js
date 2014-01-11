'user strict';

var koa = require('koa'),
    route = require('koa-route'),
    app = koa(),
    blog = require('./lib/controller/blog')


app.name = "vendhan"
exports.NODE_DEV = "development"
app.jsonSpaces = 2

app.use(route.get('/', blog.list))
app.use(route.post('/post', blog.create))
//app.use(route.get('/post/new', blog.add))
app.use(route.get('/post/:id', blog.show))

app.listen(3000)
console.log("Listening at 3000")


