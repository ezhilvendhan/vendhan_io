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
      },

      theme: {
        type: String, 
        value: "dark"
      }
    },

    observers: ['_routeChanged(_route)'],

    ready() {
      this._checkForDefaultRoute();
      const themeSwitcher = document.querySelector("#themeSwitcher");
      if(themeSwitcher) {
        themeSwitcher.addEventListener('change', (e)=> {
          this.theme = e.target.checked ? "dark" : "light";
        })
      }
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
      const _arr = newRoute.path.split('#');
      if(_arr.length > 1) {
        this.async(()=> {
          const elt = document.querySelector(`#${_arr[1]}`);
          elt && elt.scrollIntoView();
        }, 100);
      }
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