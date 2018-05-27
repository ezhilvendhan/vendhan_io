(function(){
  Polymer({
    is: 'post-view',
    properties: {
      title: String,
      datetime: String,
      body: String
    },
    _displayPost(event) {
      this.post = event.detail.response;
      if(!this.post) {
        window.location.href = '/';
      }
      this.title = this.post.title;
      this.datetime = this.post.datetime;
      this.body = this.post.body;
      this.hasUrl = this.post.url ? true : false;
      this.$.spinner.active = false;
    },
    ready() {
      const postArr = window.location.hash.split("#/posts/");
      if(postArr.length) {
        this.postId = postArr[1];
      } else {
        window.location.href = '/';
      }
      this.$.getPost.url=`/api/posts/${this.postId}`;
      this.$.getPost.generateRequest();
    },
    attached() {
      this.attachDisqus();
    },
    attachDisqus() {
      if(window.DISQUS) {
        window.DISQUS.reset({
          reload: true,
          config: function () {  
            this.page.identifier = this.postId;  
            this.page.url = window.location.href;
          }
        });
        return;
      }
      var disqus_shortname = 'vendhan';
      
      (function() {
        var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
        dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
        (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
      })();
      (function () {
        var s = document.createElement('script'); s.async = true;
        s.type = 'text/javascript';
        s.src = '//' + disqus_shortname + '.disqus.com/count.js';
        (document.getElementsByTagName('HEAD')[0] || document.getElementsByTagName('BODY')[0]).appendChild(s);
      }());
    }
  });
})();
