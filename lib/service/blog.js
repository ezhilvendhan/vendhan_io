'use strict'

var md = require('marked'),
    fs = require('fs'),
    cfg = require('./../config/config.js'),
    jsonFm = require('json-front-matter').parse,
    mdOpts = {
      renderer: new md.Renderer(),
      breaks: true,
      highlight: function highlight(code) {
        return require('highlight.js').highlightAuto(code).value;
      }
    };

md.setOptions(mdOpts)

exports.getPosts = function getPosts() {
  var posts = [],
      files,
      filePath,
      data;
  files = fs.readdirSync(cfg.POSTS_DIR)
  console.log(files)
  if(files) {
    files.forEach(function(fileName, idx) {
      filePath = cfg.POSTS_DIR+fileName;
      data = fs.readFileSync(filePath, 'utf-8')
      if(data) {
        posts.push(parsePost(data, idx))
      } else {
        console.error('Failed to read file: ', filePath)
      }
    })
  } else {
    console.error('Failed to read dir: ', cfg.POSTS_DIR)
  }
  return posts.sort(function compare(post1, post2) {
    if(post1.date > post2.date) return -1;
    if(post1.date < post2.date) return 1;
    return 0;
  })
}

function parsePost(data, id) {
  var post = {},
      parsed = jsonFm(data)
  post = parsed.attributes
  post.body = md(parsed.body)
  //post.id = id
  return post
}
