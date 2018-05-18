(function () {
  Polymer({
    is: 'vendhan-io',

    properties: {
      routesActive: {
        type: Boolean,
        value: false
      },

      activeUrl: {
        type: String,
        value: '/elements/views/home/home-view.html'
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
      }
    },

    _routeChanged: function (newRoute) {},

    _loadPost(e) {
      this.id = e.detail.id;
      this.datetime = e.detail.dateText;
      this.body = e.detail.body;
      this.hideList = true;
      this.hidePost = false;
    }

  });
})()