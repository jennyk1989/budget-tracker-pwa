// indexedDB for adding offline functionality
let db; //db stores connected db obj when connection to db complete

// first open (connect to) db; syntax -> request = indexedDB.open(db name, version)
const request = indexedDB.open('budgetdb', 1);

// call returns openRequest obj & we listen for events on it (success, error & upgrade needed)


// this event triggers when the db doesn't yet exist(during initiazliation) & will create 'new_budget' object store
request.onupgradeneeded = function(e) {
    //target = element that triggered the event 
    const db = e.target.result; //stores reference to db
    //use createObjectStore to create 'new_budget' object store (table) to store new transaction data
    db.createObjectStore('new_budget', { autoIncrement: true }); //want autoincrementing index for each new set of data inserted
};

// once db successfully created:
request.onsuccess = function(e) {
    // db already declared now with onupgradeneeded so const not needed
    db = e.target.result;
    // if online, upload the data
    if(navigator.onLine) {
        uploadBudget();
    }
};

//error handling
request.onerror = function(e) {
    //log error in console
    console.log(e.target.errorCode);
};

//fx for saving budget when offline
function saveRecord(record) {
    // to start a transaction: db.transaction(store[,type])
    // open new transaction w/ db + give read and write permissions ('readwrite'):
    const transaction = db.transaction(['new_budget'], 'readwrite');
    // object store = indexeddb's version of a table
    const budgetObjectStore = transaction.objectStore('new_budget');
    // use add method to add the transaction object store:
    budgetObjectStore.add(record);
};

function uploadBudget(){
    const transaction = db.transaction(['new_budget'], 'readwrite');
    // access the pending 'new_budget' object store
    const budgetObjectStore = transaction.objectStore('new_budget');
    // use getAll() method to retrieve data for object store and set it to variable getAll
    const getAll = budgetObjectStore.getAll();
    // this event will execute after getAll() method successfully completes
    getAll.onsuccess = function() {
        // if data present in the store (length > 0), send it to api server
        if(getAll.result.length > 0) {
            fetch('api/transaction', {
                method: 'POST',
                body: JSON.stringify(getAll.result), // result property of getAll = array of data retrieved from object store
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            })
            .then(res => res.json())
            //with successful server interaction (online and data uploaded), we can clear the stored data
            .then(serverResponse => {
                if(serverResponse.message) {
                    throw new Error(serverResponse);
                }
                const transaction = db.transaction(['new_budget'], 'readwrite');
                const budgetObjectStore = transaction.objectStore('new_budget')
                //clear the data in the object store
                budgetObjectStore.clear();
            })
            .catch(err => console.log(err));
        };
    };
};
// execute uploadBudget fx when back online
window.addEventListener('online', uploadBudget);