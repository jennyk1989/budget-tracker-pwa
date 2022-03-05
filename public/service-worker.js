const APP_PREFIX = 'BudgetApp-';
const VERSION = 'version-1'
const CACHE_NAME = APP_PREFIX + VERSION;
// define which files to cache (with relative paths):
const FILES_TO_CACHE = [
    './index.html',
    './css/styles.css',
    './js/idb.js',
    './js/index.js',
    './icons/icon-128x128.png',
    './icons/icon-144x144.png',
    './icons/icon-152x152.png',
    './icons/icon-192x192.png',
    './icons/icon-384x384.png',
    './icons/icon-512x512.png',
    './icons/icon-72x72.png',
    './icons/icon-96x96.png'
];

// respond with cached resources when fetch request received
self.addEventListener('fetch', function(e) {
    console.log('fetch request: ' + e.request.url);
    // use respondWith() method to provide a response to the fetch event
    e.respondWith(
        // use .match() to detemine if resource already exists in caches
        caches.match(e.request).then(function(request) {
            // if cache/resources available, respond to fetch with cache
            if (request) { 
                console.log('responding with cache : ' + e.request.url)
                return request;
            } else { // if no cache, resource retrieved normally (from online)
                console.log('file is not cached, fetching : ' + e.request.url)
                return fetch(e.request);
            };
        })
    );
});

