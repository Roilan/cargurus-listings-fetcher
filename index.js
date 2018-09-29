const fetch = require('node-fetch');
const FormData = require('form-data');

const { zip, distance, carCode, transmission } = process.env;
const listingBaseUrl = 'https://www.cargurus.com/Cars/inventorylisting/viewDetailsFilterViewInventoryListing.action?#listing=';
const apiUrl = 'https://www.cargurus.com/Cars/inventorylisting/ajaxFetchSubsetInventoryListing.action?sourceContext=carGurusHomePageModel';

if (!zip || !distance || !carCode) {
  console.error('Missing required variable(s). `zip`, `distance`, and `carCode` is required');
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
    transmission,
  } = listing;

  return {
    id,
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
    recommendation,
    transmission,
  };
}

const fetchListings = () => fetch(apiUrl, apiOptions)
  .then(d => d.json())
  .then(async (data) => {
    const listings = data.listings && data.listings.filter((listing) => {
      if (transmission === 'M' || transmission === 'A') {
        return listing.transmission === transmission;
      }

      return true;
    }).map(formatListing);

    if (data.alternateSearch || !listings || listings.length === 0) {
      console.log('no listings found...');
      return [];
    }

    return listings;
  });

module.exports = fetchListings;
