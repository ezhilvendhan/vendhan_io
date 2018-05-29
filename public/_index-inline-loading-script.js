// Below is a fast app loading script
// The script async & lazy-loads webcomponents-lite polyfill
// then checks for Polymer element
// then removes #splash div to reveal application UI in #app
(function() {

  // Wait for async loading of elements.html bundle
  var onWebComponentsLoaded = function() {
    var mainElementLink = document.querySelector('#main-element-import');
    if (mainElementLink.import && mainElementLink.import.readyState === 'complete') {
      onMainElementLoaded();
    } else {
      mainElementLink.addEventListener('load', onMainElementLoaded);
    }
  };

  // Remove #splash div and 'loading' class from body
  var onMainElementLoaded = function() {
    var themeSwitcher = document.querySelector("#themeSwitcher");
    if(themeSwitcher) {
      themeSwitcher.addEventListener('change', function(e) {
        var theme = e.target.checked ? "dark-theme" : "light-theme";
        document.querySelector("#mainBlock").classList.remove("dark-theme");
        document.querySelector("#mainBlock").classList.remove("light-theme");
        document.querySelector("#mainBlock").classList.add(theme);
        
      })
    }
  };

  // load webcomponents polyfills
  if ('registerElement' in document && 'import' in document.createElement('link') && 'content' in
    document.createElement('template')) {
    // browser has web components, no need to load webcomponents polyfill
    onWebComponentsLoaded();
  } else {
    // polyfill web components
    var polyfill = document.createElement('script');
    polyfill.async = true;
    polyfill.src = '../../bower_components/webcomponentsjs/webcomponents-lite.min.js';
    polyfill.onload = onWebComponentsLoaded;
    document.head.appendChild(polyfill);
  }

}());
