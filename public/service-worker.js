const APP_PREFIX = 'BudgetApp-';
const VERSION = 'version-1'
const CACHE_NAME = APP_PREFIX + VERSION;
// define which files to cache (with relative paths):
const FILES_TO_CACHE = [
    './index.html',
    './css/styles.css',
    './js/idb.js',
    './js/index.js',
    '../models/transaction.js',
    '../routes/api.js',
    '../server.js'
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