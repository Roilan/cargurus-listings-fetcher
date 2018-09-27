const fetch = require('node-fetch');
const FormData = require('form-data');
const fs = require('fs');
const { promisify } = require('util');

const { zip, distance, carCode } = process.env;
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const listingBaseUrl = 'https://www.cargurus.com/Cars/inventorylisting/viewDetailsFilterViewInventoryListing.action?#listing=';
const apiUrl = 'https://www.cargurus.com/Cars/inventorylisting/ajaxFetchSubsetInventoryListing.action?sourceContext=carGurusHomePageModel';
const fileName = 'saved-listings.json';

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

const apiOptions = {
  credentials: 'include',
  headers: {},
  body: form,
  method: 'POST',
  mode: 'cors'
};

function formatListing(listing) {
  const {
    id,
    mainPictureUrl: pictureUrl,
    price,
    mileageString: mileage,
    priceString,
    serviceProviderName: dealer,
    sellerCity: dealerCity,
    hasAccidents,
    frameDamaged,
    carYear: year,
    vehicleIdentifier: vin,
    ownerCount,
    daysOnMarket: daysListed,
    savingsRecommendation: recommendation,
  } = listing;

  return {
    url: listingBaseUrl + id,
    pictureUrl,
    price,
    priceString,
    mileage,
    dealer: {
      name: dealer || 'N/A',
      city: dealerCity,
      isPrivateSeller: !Boolean(dealer),
    },
    hasAccidents: hasAccidents || frameDamaged,
    year,
    vin,
    daysListed,
    recommendation
  }
}

fetch(apiUrl, apiOptions)
  .then(d => d.json())
  .then(async (data) => {
    const listings = data.listings && data.listings.filter(listing => (
      listing.transmission === 'M' &&
      !listing.noPhotos
    )).map(formatListing);

    if (data.alternateSearch || !listings || listings.length === 0) {
      console.log('no listings found...');
      return;
    }

    let listingsInFile;

    try {
      listingsInFile = await readFile(fileName, 'utf8');
      listingsInFile = JSON.parse(listingsInFile);
    } catch (e) {
      console.log('no file found...');
    }


    // compare/format data here and return data to save
    // console.log('DATA:', listings)
    // console.log('DATA FILE:::', listingsInFile);

    return [
      {
        zip,
        lastUpdated: Date.now(),
        listings
      }
    ];
  })
  .then(data => writeFile(fileName, JSON.stringify(data)))
  .catch(error => console.log('ERROR:', error));
