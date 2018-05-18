'use strict';

var render = require('./render'),
    route = require('koa-route'),
    blog = require('./../service/blog.js'),
    logger = require('koa-logger'),
    views = require('co-views'),
    parse = require('co-body'),
    koa = require('koa'),
    app = new koa();

const d121Results = require('./../db/icD121.js').getData(),
      vgg13Results = require('./../db/icVgg13.js').getData(),
      vgg16Results = require('./../db/icVgg16.js').getData(),

var posts = blog.getPosts();

app.use(logger());

let list = async function list(ctx) {
  ctx.body = await render('list', {posts: posts});
};

let add = async function add(ctx) {
  ctx.body = await render('new');
};

let firstDl = async function firstDl(ctx) {
  ctx.body = await render('first-dl')
}

let getFirstDlPrediction = async function getFirstDlPrediction(ctx, arch, img) {
  if(arch === 'densenet121' && img) {
    ctx.body = d121Results[img];
  } else if(arch === 'vgg13' && img) {
    ctx.body = vgg13Results[img];
  } else if(arch === 'vgg16' && img) {
    ctx.body = vgg16Results[img];
  } else {
    ctx.body = {};
  }
}

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
app.use(route.get('/actions/dl1', firstDl));
app.use(route.get('/actions/dl1/:arch/:img', getFirstDlPrediction));

module.exports = app;
