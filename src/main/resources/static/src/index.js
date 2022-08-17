const fetchRequests = require('./fetchRequests');
const s3 = require('./s3');
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
const getAllActiveAuctions = fetchRequests.getAllActiveAuctions;
const getHighestBid = fetchRequests.getHighestBid;
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

    if (data.get('title') === '' || data.get('description') === '') {
      alert('Please fill out all fields');
      return;
    }

    let item = {};
    item.userId = 1; // TODO: get userID from session
    item.title = data.get('title');
    item.description = data.get('description');
    item.category = data.get('category');

    const image = document.getElementById('image').files[0];

    if (image === undefined) {
      alert('Please upload an image');
      return;
    }

    // Create a random image name
    const randomImageName =
      'image-' + Math.floor(Math.random() * 1000000) + '.png';

    // Get secured url to upload image to S3
    const url = await s3.generateUploadUrl(randomImageName);

    // Add image to S3 and item to database
    let uploadImageResponse = await s3.uploadImage(url, image);

    if (uploadImageResponse.ok) {
      item.imageUrl = url.split('?')[0];
    } else {
      console.log('Failed to upload image');
    }

    let response = await addItem(item);
    if (response.ok) {
      console.log('Item added!');
      window.location.href = '/explore.html';
    } else {
      console.log('Failed to add item');
    }
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

    // Array of url query parameters
    const urlParams = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams, prop) => searchParams.get(prop),
    });

    // Get the form values
    const data = new FormData(e.target);
    let bid = {};
    bid.userId = 1; // TODO: get userId from session
    bid.auctionId = urlParams.auctionId;
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

async function populateItemsContainer(itemsContainer) {
      // Get current ongoing auctions
      let auctions = await getAllActiveAuctions();
      let items = [];
  
      // Get information for each item in an ongoing auction
      for (let i = 0; i < auctions.length; i++) {
        let item = await getItem(auctions[i].itemId);
        if (item) {
          item.auctionId = auctions[i].auctionId;
          items.push(item);
        }
      }
  
      // Add each item to the items container
      itemsContainer.textContent = "";  // remove all children
      for (let i = 0; i < items.length; i++) {
        let item = items[i];
        let card = this.document.createElement('div');
        card.classList.add('gallery');
  
        let imgEle = this.document.createElement('img');
        // TODO add item's image
        card.appendChild(imgEle);
        
        let titleEle = this.document.createElement('p');
        titleEle.textContent = item.title;
        card.appendChild(titleEle);
  
        let descEle = this.document.createElement('p');
        descEle.textContent = item.description;
        card.appendChild(descEle);
  
        let categoryEle = this.document.createElement('p');
        categoryEle.textContent = 'Category: ' + item.category;
        card.appendChild(categoryEle);
  
        let viewEle = this.document.createElement('button');
        viewEle.textContent = 'View';
        viewEle.addEventListener('click', () => {
          this.window.location.href = '/auction.html?auctionId=' + item.auctionId;
        });
        card.appendChild(viewEle);
        itemsContainer.appendChild(card);
      }
  
      console.log(auctions);
      console.log(items);
}

async function displayAuctionDetails(auctionId, detailContainer) {
  detailContainer.textContent = ""; // remove all children

  const auction = await getAuction(auctionId);
  if (!auction) return;
  const item = await getItem(auction.itemId);
  if (!item) return;
  const highestBid = await getHighestBid(auctionId);
  console.log(highestBid);

  let imgEle = document.createElement('img');
  // TODO add item's image
  detailContainer.appendChild(imgEle);

  let titleEle = document.createElement('div');
  titleEle.classList.add('desc');
  titleEle.textContent = item.title;
  detailContainer.appendChild(titleEle);

  let descEle = document.createElement('div');
  descEle.classList.add('desc');
  descEle.textContent = item.description;
  detailContainer.appendChild(descEle);

  let currentBidEle = document.createElement('div');
  currentBidEle.classList.add('desc');
  let bid = highestBid ? highestBid.bid : auction.startingBid;
  currentBidEle.textContent = 'Current Bid: ' + bid + ' tokens';
  detailContainer.appendChild(currentBidEle);
}

window.addEventListener('DOMContentLoaded', async function(e) {
  // Array of url query parameters
  const urlParams = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });

  // On explore.html display current items for auction
  const itemsContainer = this.document.getElementById('items-container');
  if (itemsContainer) populateItemsContainer(itemsContainer);

  // On auction.html display auction details
  const detailContainer = this.document.getElementById('item-detail-container');
  if (detailContainer) displayAuctionDetails(urlParams.auctionId, detailContainer);


  

});