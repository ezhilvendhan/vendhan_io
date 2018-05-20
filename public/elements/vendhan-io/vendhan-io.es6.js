(function () {
  Polymer({
    is: 'vendhan-io',

    properties: {
      routesActive: {
        type: Boolean,
        value: false
      },

      footerLinks: {
        type: Array,
        value: function () {
          return []
        }
      },

      hideList: {
        type: Boolean,
        value: false
      },

      hidePost: {
        type: Boolean,
        value: true
      },

      posts: {
        type: Array,
        value() {
          return [];
        }
      },

      postId: {
        type: String
      }
    },

    observers: ['_routeChanged(_route)'],

    ready: function () {
      this._checkForDefaultRoute();
    },

    _checkForDefaultRoute: function () {
      var l = window.location;
      if ((l.hash === "#/" || l.hash === "") && l.pathname === "/") {
        l.hash = "/home";
      } else {
        this._setPostId(l.hash);
      }
    },

    _setPostId(hash) {
      const postArr = hash.split("#/posts/");
      if(postArr.length) {
        this.postId = postArr[1];
      }
    },

    _routeChanged(newRoute) {
      this._setPostId(window.location.hash);
    },

    _listPosts(data) {
      this.posts = data.detail.response;
      this.postId = this.posts[this.posts.length-1].id;
    },

    _loadPost(e) {
      this.id = e.detail.id;
      this.datetime = e.detail.dateText;
      this.body = e.detail.body;
      this.hideList = true;
      this.hidePost = false;
    }

  });
})()