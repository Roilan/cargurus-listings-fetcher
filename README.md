# [wip] cargurus listings fetcher

This is a tool to fetch all the listings from cargurus.com for a particular car make/model (`selectedEntity/carCode`) by zip code and distance from that zip code. It's mainly to solve the problem of not knowing when a listing is posted and having to manually scan through every so often.

**Note:** `selectedEntity` seems to be an internal id for cargurus. The only id (in example below) I have currently is for an Mitsubishi Evo X.

## How to run it / Example
You can run it with the following node command. It uses env variables for the zip, distance (in miles) and carCode (or selectedEntity).

`zip=10001 distance=100 carCode=d423 node example.js`

## Cargurus API body

The API properties below are what you can pass into the Cargurus API request. At the moment only the following are supported:

<pre>
  zip
  distance
  selectedEntity
  transmission
</pre>

All other properties available:
<pre>
  address
  latitude
  longitude
  entitySelectingHelper.selectedEntity2
  minPrice
  maxPrice
  minMileage
  maxMileage
  bodyTypeGroup
  serviceProvider
  page
  filterBySourcesString
  filterFeaturedBySourcesString
  displayFeaturedListings=true&
  searchSeoPageType
  inventorySearchWidgetType
  allYearsForTrimName
  daysOnMarketMin
  daysOnMarketMax
  vehicleDamageCategoriesRaw
  minCo2Emission
  maxCo2Emission
  vatOnly
  minEngineDisplacement
  maxEngineDisplacement
  minMpg
  maxMpg
  minEnginePower
  maxEnginePower
  isRecentSearchView
</pre>