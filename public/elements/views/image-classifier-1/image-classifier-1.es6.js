(function(){
  Polymer({
    is: 'image-classifier-1',
    properties: {
      flowers: {
        type: Array,
        value() {
          return [];
        }
      },
      models: {
        type: Array,
        value() {
          return [{
            "label": "DenseNet 121",
            "value": "0"
          }, {
            "label": "VGG 13",
            "value": "1"
          }, {
            "label": "VGG 16",
            "value": "2"
          }];
        }
      },
      topK: {
        type: Array,
        value() {
          return [];
        }
      },
      _showResults: false
    },
    _reloadFlowers() {
      this.$.getAllImages.generateRequest();
    },
    _renderImages(data) {
      this.flowers = data.detail.response;
      this.$.spinner.active = false;
    },
    hasResult(result){
      return result ? true : false;
    },
    _submit() {
      if(this.$.flowersList.selected === undefined 
          || this.$.model.selected === undefined) {
        return;
      }
      this.$.getPrediction.body = {
        "img": this.flowers[this.$.flowersList.selected].name,
        "model": this.models[this.$.model.selected].value
      };
      this.$.getPrediction.generateRequest();
    },
    _displayResult(data) {
      this.result = data.detail.response;
      this._showResults = true;
    },
    attached() {
      this.attachDisqus();
    },
    attachDisqus() {
      if(window.DISQUS) {
        window.DISQUS.reset({
          reload: true,
          config: function () {  
            this.page.identifier = "ic1";  
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
