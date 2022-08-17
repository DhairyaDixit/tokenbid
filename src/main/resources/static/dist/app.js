/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module) => {

// Utility function to perform an HTTPRequest, returns a promise with an HTTPResponse
async function sendRequest(method, path, body) {
  return await fetch(
    new Request(path, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
  );
}

// Add data to database
async function addUser(user) {
  return await sendRequest('POST', '/users/add', user);
}

async function loginUser(user) {
  return await sendRequest('POST', '/users/login', user);
}

async function addItem(item) {
  return await sendRequest('POST', '/items/add', item);
}

async function addAuction(auction) {
  return await sendRequest('POST', '/auctions/add', auction);
}

async function addBid(bid) {
  return await sendRequest('POST', '/bids/add', bid);
}

// Get data from the database
async function getUser(userId) {
  const response = await sendRequest('GET', '/users/' + userId);
  if (!response.ok) return null;
  return response.json();
}

async function getItem(itemId) {
  const response = await sendRequest('GET', '/items/' + itemId);
  if (!response.ok) return null;
  return response.json();
}

async function getAuction(auctionId) {
  const response = await sendRequest('GET', '/auctions/' + auctionId);
  if (!response.ok) return null;
  return response.json();
}

async function getBid(bidId) {
  const response = await sendRequest('GET', '/bids/' + bidId);
  if (!response.ok) return null;
  return response.json();
}

async function getItemsByCategory(category) {
  // TODO add endpoint to query by category
}

async function getAllItems() {
  const response = await sendRequest('GET', '/items/all');
  if (!response.ok) return null;
  return response.json();
}

// Update data on database
async function updateUser(user) {
  console.log(user);
  return await sendRequest('PUT', '/users/' + user.userId, user);
}

async function updateItem(item) {
  return await sendRequest('PUT', '/items/' + item.itemId, item);
}

async function updateAuction(auction) {
  return await sendRequest('PUT', '/auctions/' + auction.auctionId, auction);
}

async function updateBid(bid) {
  return await sendRequest('PUT', '/bids/' + bid.bidId, bid);
}

module.exports = {
  addUser,
  loginUser,
  addItem,
  addAuction,
  addBid,
  getUser,
  getItem,
  getAuction,
  getBid,
  getItemsByCategory,
  getAllItems,
  updateUser,
  updateItem,
  updateAuction,
  updateBid,
};


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
const fetchRequests = __webpack_require__(1);
const addUser = fetchRequests.addUser;
const loginUser = fetchRequests.loginUser;
const addItem = fetchRequests.addItem;
const addAuction = fetchRequests.addAuction;
const addBid = fetchRequests.addBid;
const getUser = fetchRequests.getUser;
const getItem = fetchRequests.getItem;
const getAuction = fetchRequests.getAuction;
const getBid = fetchRequests.getBid;
const getItemsByCategory = fetchRequests.getItemsByCategory;
const getAllItems = fetchRequests.getAllItems;
const updateUser = fetchRequests.updateUser;
const updateItem = fetchRequests.updateItem;
const updateAuction = fetchRequests.updateAuction;
const updateBid = fetchRequests.updateBid;

/////////////////////////////////////////////////////////////////////////////
// Event listeners, TODO change names when forms are added, add input validation
/////////////////////////////////////////////////////////////////////////////

const registerForm = document.getElementById('register-form');
if (registerForm) {
  registerForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    // Get the form values
    const data = new FormData(e.target);
    let user = {};
    user.firstName = data.get('firstName');
    user.lastName = data.get('lastName');
    user.username = data.get('username');
    user.email = data.get('email');
    user.password = data.get('password');
    user.tokens = 0;

    // Add new user to database
    let response = await addUser(user);
    if (response.ok) {
      console.log('User added!');
      window.location.href = '/login.html';
    } else if (response.status === 409) {
      let body = await response.text();
      alert(body);
    } else {
      console.log('Failed to add user');
    }
  });
}

const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    // Get the form values
    const data = new FormData(e.target);
    let user = {};
    user.username = data.get('username');
    user.password = data.get('password');
    console.log(user);

    // Add new user to database
    let response = await loginUser(user);
    console.log(response);

    if (response.ok) {
      console.log('User logged in!');
      window.location.href = '/explore.html';
    } else {
      console.log('Failed to log in user');
    }
  });
}

const itemForm = document.getElementById('item-form');
if (itemForm) {
  itemForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    // Get the form values
    const data = new FormData(e.target);

    let item = {};
    item.userId = 1; // TODO: get userID from session
    item.title = data.get('title');
    item.description = data.get('description');
    item.category = data.get('category');

    // Add new item to database and image to S3 bucket
    let response = await addItem(item);
    if (response.ok) {
      console.log('Item added!');
    } else {
      console.log('Failed to add item');
    }

    //let image = data.get('image');
    //await addImage(image);
  });
}

const auctionForm = document.getElementById('auction-form');
if (auctionForm) {
  auctionForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    // Get the form values
    const data = new FormData(e.target);
    let hours = Number(data.get('length')); // auction length in hours
    let start = new Date().getTime();
    let end = start + 1000 * 60 * 60 * hours;
    let auction = {};
    auction.itemId = data.get('itemId');
    auction.startingBid = data.get('startingBid');
    auction.startTime = new Date(start).toJSON();
    auction.endTime = new Date(end).toJSON();

    // Add new auction to database
    let response = await addAuction(auction);
    if (response.ok) {
      console.log('Auction added!');

      // TODO: Start a timer if auction was successfully added
    } else {
      console.log('Failed to add auction');
    }
  });
}

const bidForm = document.getElementById('bid-form');
if (bidForm) {
  bidForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    // Get the form values
    const data = new FormData(e.target);
    let bid = {};
    bid.userId = 1; // TODO: get userId from session
    bid.auctionId = data.get('auctionId'); // TODO: get auctionId from URL
    bid.bid = data.get('bid');

    // Add new bid to database
    let response = await addBid(bid);
    if (response.ok) {
      console.log('Bid added!');
    } else if (response.status === 409) {
      let body = await response.text();
      alert(body);
    } else {
      console.log('Failed to add bid');
    }
  });
}

})();

/******/ })()
;