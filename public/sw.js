importScripts('bower_components/sw-toolbox/sw-toolbox.js');

const VERSION = '1.0';
const CACHENAME = 'vendhan-io';

//Uncomment to enable Service worker caching
toolbox.precache([
]);

self.addEventListener('install', event => event.waitUntil(self.skipWaiting()));
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));

//Uncomment to enable Service worker caching

// toolbox.router.get('/(.*)', self.toolbox.fastest, {
//     'networkTimeoutSeconds': 2,
//     'cache': {
//       'name': CACHENAME +VERSION
//     }
// });

// toolbox.router.get(/external-site.DOT.COM/, self.toolbox.fastest, {
//   'cache': {
//     'name': CACHENAME +VERSION
//   }
// });
