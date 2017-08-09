'use strict';

var render = require('./render'),
    route = require('koa-route'),
    blog = require('./../service/blog.js'),
    logger = require('koa-logger'),
    views = require('co-views'),
    parse = require('co-body'),
    koa = require('koa'),
    app = new koa();

var posts = blog.getPosts();

app.use(logger());

let list = async function list(ctx) {
  ctx.body = await render('list', {posts: posts});
};

let add = async function add(ctx) {
  ctx.body = await render('new');
};

let show = async function show(ctx, id) {
  var requestedPost;
  posts.every(function(post) {
    if(post.id == id) {
      requestedPost = post;
      return false;
    }
    return true;
  });
  if(!requestedPost) this.throw(404, 'invalid post id');
  ctx.body = await render('show', {post: requestedPost});
};

let create = async function create() {
  //do stuff
};

app.use(route.get('/', list));
app.use(route.post('/post', create));
//app.use(route.get('/post/new', blog.add))
app.use(route.get('/post/:id', show));

module.exports = app;
