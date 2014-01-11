'use strict';

var render = require('./render'),
    blog = require('./../service/blog.js'),
    logger = require('koa-logger'),
    views = require('co-views'),
    parse = require('co-body'),
    koa = require('koa'),
    app = koa();

var posts = blog.getPosts()

app.use(logger())

exports.list = function *list() {
  this.body = yield render('list', {posts: posts})
}

exports.add = function *add() {
  this.body = yield render('new')
}

exports.show = function *show(id) {
  var post = posts[id]
  if(!post) this.throw(404, 'invalid post id')
  this.body = yield render('show', {post: post})
}

exports.create = function *create() {
  //do stuff
}
