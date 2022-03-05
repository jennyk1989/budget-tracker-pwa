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

