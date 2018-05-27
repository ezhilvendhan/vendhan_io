(function() {
  Polymer({
    is: 'app-view',
    properties: {

      active: {
        type: Boolean,
        value: false
      },

      preload: {
        type: Boolean,
        value: false
      },

      loadAsync: {
        type: Boolean,
        value: false
      },

      status: {
        type: String,
        value: 'unloaded',
        notify: true,
        reflectToAttribute: true,
        observer: '_statusChanged'
      },

      _elementTagName: {
        type: String,
        computed: '_computeElementTagName(elementHref)',
        observer: '_elementTagNameUpdated'
      },

      elementHref: {
        type: String
      },

      display: {
        type: String,
        value: "block"
      },

      elementData: {
        type: Object,
        value: function() { return {}; }
      },
      _importLink: {
        type: Object,
        value: function() { return {}; }
      }
    },
    observers: [
      '_checkStatus(status, active, preload, display, _elementTagName)',
    ],
    _element: null,
    _onUnloaded: function() {
      if (this.active || this.preload) {
        this._loadElement();
      }
    },
    _isElementRegistered: function(elementId) {
      var list = Polymer.telemetry.registrations;
      list.forEach((element)=> {
        if (element.is === elementId) {
          return true;
        }
      })
      return false;
    },
    _onLoading: function() {
    },
    _onLoaded: function() {
      if (this.active) {
        this._attachElement();
      }
    },
    _onAttached: function() {
      var newStatus = this.active ? 'shown' : 'hidden';
      this.set('status', newStatus);
    },
    _onShown: function() {
      if (this.active) {
        this._element.style.display = this.display;
      } else {
        this.set('status', 'hidden');
      }
    },
    _onHidden: function() {
      if (!this.active) {
        this._element.style.display = 'none';
      } else {
        this.set('status', 'shown');
      }
    },

    _getStateFunction: function(status) {
      var stateFunctions = {
        'unloaded': this._onUnloaded,
        'loading': this._onLoading,
        'loaded': this._onLoaded,
        'attached': this._onAttached,
        'shown': this._onShown,
        'hidden': this._onHidden
      };
      return stateFunctions[status];
    },
    _checkStatus: function() {
      if(this.status === 'hidden') {
        this._resetView();
      }
      this._getStateFunction(this.status).apply(this);
    },
    _attachElement: function() {
      this._element = document.createElement(this._elementTagName);
      this._element.id = this._elementTagName + '-' + new Date().getTime();
      this._element.setAttribute('element-data', JSON.stringify(this.elementData));
      Polymer.dom(this.root).appendChild(this._element);
      this.set('status', 'attached');
    },
    _loadElement: function() {
      this.set('status', 'loading');
      var that = this;
      if(this._isElementRegistered(this._elementTagName)){
        that.set('status', 'loaded');
      } else {
        this._importLink = this.importHref(this.elementHref, function(e) {
          if (Object.getOwnPropertyNames(that._importLink).length == 0) {
            that.set('status', 'loaded');
          } else {
            var modulesLoaded = Polymer.dom(that._importLink.import).querySelectorAll('dom-module');
            let moduleFound = false;
            modulesLoaded.forEach(function(ele) {
              if(ele.id === that._elementTagName) {
                moduleFound = true;
              }
            });
            if (moduleFound) {
              that.set('status', 'loaded');
            } else {
              console.log('Error: dom-module of imported element does not match element tag name');
              that.set('status', 'failed');
            }
          }
        }, function(error) {
          this.set('status', 'failed');
        }, this.loadAsync);
      }
    },
    _computeElementTagName: function() {
      var filenameRegex = /(?=([\w-]+)\.\w{3,4}$).+/;
      var match;
      if ((match = filenameRegex.exec(this.elementHref)) !== null) {
        if (match.index === filenameRegex.lastIndex) {
          filenameRegex.lastIndex++;
        }
      }
      return match[1];
    },
    _elementTagNameUpdated: function(current, previous) {
      if(typeof previous !== 'undefined') {
        this._resetView();
      }
    },
    _resetView: function() {
      this._removeAllElements();
      this.set('_importLink', {});
      this.set('status', 'unloaded');
    },
    _removeAllElements: function() {
      var nodes = Polymer.dom(this.root).children;
      var that = this;
      nodes.forEach((node, idx) => {
        Polymer.dom(that.root).removeChild(node);
      });
    },

    _statusChanged: function() {
      if (this._element) {
        this.fire('app-view-status-changed',
            { status: this.status },
            { node: this._element, bubbles: false });
      }
    }
  });
})();