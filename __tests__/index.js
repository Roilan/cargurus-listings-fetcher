process.env.zip = 10001;
process.env.distance = 100;
process.env.carCode = 'd123';

const mockListings = [
  {
    id: 1,
    mainPictureUrl: 'pictureUrl',
    price: 1000,
    mileageString: '1000',
    priceString: '1000',
    serviceProviderName: 'foobar',
    sellerCity: 'ny, ny',
    hasAccidents: false,
    frameDamaged: false,
    carYear: 2011,
    vehicleIdentifier: '123',
    ownerCount: 1,
    daysOnMarket: 1,
    savingsRecommendation: 'great',
    transmission: 'M',
  },
  {
    id: 2,
    mainPictureUrl: 'pictureUrl',
    price: 1000,
    mileageString: '1000',
    priceString: '1000',
    serviceProviderName: 'foobar',
    sellerCity: 'ny, ny',
    hasAccidents: false,
    frameDamaged: false,
    carYear: 2011,
    vehicleIdentifier: '123',
    ownerCount: 1,
    daysOnMarket: 1,
    savingsRecommendation: 'great',
    transmission: 'A',
  },
];

describe('fetchListings', () => {
  afterEach(() => {
    jest.resetModules();
  });

  test('has correct url/options', async () => {
    let url;
    let options;

    jest.mock('node-fetch', () => (apiUrl, apiOptions) => {
      url = apiUrl;
      options = apiOptions;

      return Promise.resolve({
        json: () => Promise.resolve({}),
      });
    });
    const fetchListings = require('../index');
    const data = await fetchListings();

    expect(data).toEqual([]);
    expect(url).toBe('https://www.cargurus.com/Cars/inventorylisting/ajaxFetchSubsetInventoryListing.action?sourceContext=carGurusHomePageModel');
    expect(options).toBeTruthy();
  });

  test('returns empty on alternativeSearch', async () => {
    jest.mock('node-fetch', () => (apiUrl, apiOptions) => {
      return Promise.resolve({
        json: () => Promise.resolve({
          alternativeSearch: [],
        }),
      });
    });
    const fetchListings = require('../index');
    const data = await fetchListings();

    expect(data).toEqual([]);
  });

  test('returns correct data on transmission filter', async () => {
    process.env.transmission = 'M';

    jest.mock('node-fetch', () => (apiUrl, apiOptions) => {
      return Promise.resolve({
        json: () => Promise.resolve({
          listings: mockListings
        }),
      });
    });
    const fetchListings = require('../index');
    const data = await fetchListings();

    const expected = {
      id: 1,
      daysListed: 1,
      dealer: {
        city: 'ny, ny',
        isPrivateSeller: false,
        name: 'foobar',
      },
      hasAccidents: false,
      mileage: '1000',
      pictureUrl: 'pictureUrl',
      price: 1000,
      priceString: '1000',
      recommendation: 'great',
      transmission: 'M',
      url: 'https://www.cargurus.com/Cars/inventorylisting/viewDetailsFilterViewInventoryListing.action?#listing=1',
      vin: '123',
      year: 2011,
    };

    expect(data).toEqual([expected]);
  });

  test('returns correct data on without transmission filter', async () => {
    process.env.transmission = null;

    jest.mock('node-fetch', () => (apiUrl, apiOptions) => {
      return Promise.resolve({
        json: () => Promise.resolve({
          listings: mockListings
        }),
      });
    });
    const fetchListings = require('../index');
    const data = await fetchListings();

    const expected = [
      {
        id: 1,
        daysListed: 1,
        dealer: {
          city: 'ny, ny',
          isPrivateSeller: false,
          name: 'foobar',
        },
        hasAccidents: false,
        mileage: '1000',
        pictureUrl: 'pictureUrl',
        price: 1000,
        priceString: '1000',
        recommendation: 'great',
        transmission: 'M',
        url: 'https://www.cargurus.com/Cars/inventorylisting/viewDetailsFilterViewInventoryListing.action?#listing=1',
        vin: '123',
        year: 2011,
      },
      {
        id: 2,
        daysListed: 1,
        dealer: {
          city: 'ny, ny',
          isPrivateSeller: false,
          name: 'foobar',
        },
        hasAccidents: false,
        mileage: '1000',
        pictureUrl: 'pictureUrl',
        price: 1000,
        priceString: '1000',
        recommendation: 'great',
        transmission: 'A',
        url: 'https://www.cargurus.com/Cars/inventorylisting/viewDetailsFilterViewInventoryListing.action?#listing=2',
        vin: '123',
        year: 2011,
      },
    ];

    expect(data).toEqual(expected);
  });
});