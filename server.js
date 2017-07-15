'user strict';

var Koa = require('koa'),
    route = require('koa-route'),
    serve = require('koa-static'),
    app = new Koa(),
    blog = require('./lib/controller/blog')

app.name = "vendhan_io"
app.jsonSpaces = 2

app.use(serve(__dirname + '/public'))

app.use(route.get('/', blog.list))
app.use(route.post('/post', blog.create))
//app.use(route.get('/post/new', blog.add))
app.use(route.get('/post/:id', blog.show))

app.listen(process.env.PORT || 3000)
