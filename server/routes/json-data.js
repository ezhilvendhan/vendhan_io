var path = require("path");
const blog = require('./../service/blog.js');

module.exports = function() {
  const routes = {};

  const posts = blog.getPosts().map((obj)=> {
    return {
      "category": obj.category,
      "date": obj.date,
      "dateText": obj.dateText,
      "id": obj.id,
      "tags": obj.tags,
      "title": obj.title,
      "url": obj.url
    }
  });
  routes["posts"] = posts;

  const d121Results = require(path.resolve(__dirname, '../data/ic-d121.json'));
  routes["ic-d121"] = d121Results;

  const vgg13Results = require(path.resolve(__dirname, '../data/ic-vgg13.json'));
  routes["ic-vgg13"] = vgg13Results;

  const vgg16Results = require(path.resolve(__dirname, '../data/ic-vgg16.json'));
  routes["ic-vgg16"] = vgg16Results;

  return routes;
};
