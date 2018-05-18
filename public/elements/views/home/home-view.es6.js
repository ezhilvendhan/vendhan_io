(function(){
  Polymer({
    is: 'home-view',
    properties: {
      posts: {
        type: Array,
        value() {
          return [];
        }
      }
    },
    ready: function(){
    },
    _listPosts(data) {
      this.posts = data.detail.response;
    },
    _renderPost(e) {
      this.fire('load-post', e.model.item);
    }
  });
})()
