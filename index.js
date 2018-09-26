const fetch = require('node-fetch');
const FormData = require('form-data');
const { zip, distance, carCode } = process.env;

if (!zip || !distance || !carCode) {
  console.error('missing required variable...');
  process.exit(1);
}

const form = new FormData();
const formProperties = {
  zip,
  distance,
  selectedEntity: carCode,
};

Object.keys(formProperties).forEach((key) => {
  form.append(key, formProperties[key]);
});

const apiUrl = 'https://www.cargurus.com/Cars/inventorylisting/ajaxFetchSubsetInventoryListing.action?sourceContext=carGurusHomePageModel';
const apiOptions = {
  credentials: 'include',
  headers: {},
  body: form,
  method: 'POST',
  mode: 'cors'
};

fetch(apiUrl, apiOptions)
  .then(d => d.json())
  .then(data => console.log('DATA:', data.listings[0], data.listings && data.listings.length, Object.keys(data)))
  .catch(error => console.log('ERROR:', error));
