// indexedDB for adding offline functionality
let db; //db stores connected db obj when connection to db complete

// request acts as an event listener when connection to db is opened
const request = indexedDB.open('budgetdb', 1); //indexedDB.open() opens connection to db

// event will emit first time code is ran & will create 'new_transaction' object store
request.onupgradeneeded = function(e) {
    const db = e.target.result;
    //use createObjectStore to create 'new_transaction' object to store the new transaction data
    db.createObjectStore('new_transaction', { autoIncrement: true}); //want autoincrementing index for each new set of data inserted
};

// once db successfully created:
request.onsuccess = function(e) {
    db = e.target.result;
    if(navigator.onLine) {
        uploadTransaction();
    }
};