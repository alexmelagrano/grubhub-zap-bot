# Grubhub API wrapper

Simple Grubhub search API to power a Zapier workflow for a hackathon, deployed to a Heroku server. It can run without providing any creds/tokens if you search with lat/long coordinates instead of addresses, otherwise you need a Google API key (more on that below).

Premise was to tie into the [Donut](https://www.donut.com/) bot in Slack, so coworkers could offer to send each other coffee/donuts for their now virtual "Donut dates" as we call them. That being said, the workflow could be triggered by anyone at any time, and search for any type of food.

| Sender prompting the recipient | Recipient providing an address | Sender picking a restaurant |
| --- | --- | --- |
| ![prompt](https://imgur.com/VFUxxfr.png) | ![address](https://i.imgur.com/t1j9xM9.png) | ![results](https://i.imgur.com/DuwS3sX.png) |


### How this works
Grubhub doesn't have an official API, so I've wrapped a single GET request borrowed from their webapp inside here to serve as my datasource.

Initially I attempted using this [grubhub-api](https://www.npmjs.com/package/grubhub-api) package, though it ended up being non-functional. The next step was mocking requests in Postman, then setting up this "proxy server" of sorts.

Grubhub uses bearer tokens for client authentication, and appears to generate new tokens on ~15-60min intervals (haven't exactly validated this timeframe). To get around this, there's a puppeteer "cron job" of sorts that updates the token stored in the process vars every 5min.

Address > lat/long coordinates is handled by Google's Geocoding API.


### API documentation

| Type | Path | Params | Description |
| --- | --- | --- | --- |
| `GET` | `/nearby_restaurants` | `address`: encoded string<br/>`latitude`: string<br/>`longitude`: string<br/>`food`: encoded string **(optional)** | Fetches the top 5 restaurants near the provided address, can <br/>be filtered by the optional "food" param.<br/><br/>Will 404 if either an address or lat/long coordinates are not provided. |


### Running this API
1. Clone this repo, make whatever tweaks you need to
2. Create a Heroku app
3. Install the puppeteer buildpack
4. Deploy this repo to your app
5. *(Optional)* Add a config var for `GOOGLE_LOCATION_API_KEY` and add your API key; make sure it [has access to the Geocoder API](https://developers.google.com/maps/documentation/geocoding/get-api-key), and is [associated with a billing plan](https://support.google.com/googleapi/answer/6158867?hl=en)

Without the Google API key, the app will still be able to fetch restaurant data but will 404 unless you to provide lat/long coordinates.

Given the general fragility of the Grubhub bearer token setup and the fact that this API is unauthenticated, this is certainly a hackathon/side-project focused API and in no way can support large amounts of traffic without those Grubhub tokens becoming banned before they refresh. That being said, it wouldn't be too difficult to shorten the refresh cycle and/or run multiple of these servers in parallel on a load balancer...


### Tools/repos used

- `puppeteer` - see [NPM listing](https://www.npmjs.com/package/puppeteer)
- [puppeteer buildpack](https://elements.heroku.com/buildpacks/jontewks/puppeteer-heroku-buildpack) for Heroku by jontewks
- `node-geocoder` - see [NPM listing](https://www.npmjs.com/package/node-geocoder/v/3.22.0)
- [Google Geocoding API](https://developers.google.com/maps/documentation/geocoding/overview)
- (non-functional) `grubhub-api` - [NPM listing](https://www.npmjs.com/package/grubhub-api)

Happy hacking :)
