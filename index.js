const fetch = require('node-fetch');

const apiUrl = 'https://www.cargurus.com/Cars/inventorylisting/ajaxFetchSubsetInventoryListing.action?sourceContext=carGurusHomePageModel';


const apiOptions = {
  credentials: 'include',
  headers: {},
  method: 'POST',
  mode: 'cors'
};

fetch(apiUrl, apiOptions)
  .then(d => d.json())
  .then(data => console.log('DATA:', data))
  .catch(error => console.log('ERROR:', error));
