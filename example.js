const fetchListings = require('./index');

fetchListings()
  .then(listing => console.log('listings:', listing))
  .catch(error => console.error('error:', error));