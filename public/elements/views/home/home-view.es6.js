(function(){
  Polymer({
    is: 'home-view',
    properties: {
      posts: {
        type: Array,
        value() {
          return [];
        },
        computed: '_parse(elementData)'
      }
    },
    _parse(elementData) {
      this.$.spinner.active = false;
      return JSON.parse(elementData);
    },
    _renderPost(e) {
      this.fire('load-post', e.model.item);
    }
  });
})()
