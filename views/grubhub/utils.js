const NodeGeocoder = require('node-geocoder')
const puppeteer = require('puppeteer')
const Constants = require('./constants')

exports.resolveLocation = async (req) => {
  let lat = null
  let long = null

  if (req.query.longitude && req.query.latitude) {
    lat = req.query.latitude
    long = req.query.longitude
  } else if (req.query.address) {
    try {
      const geocoder = NodeGeocoder({
        provider: 'google',
        apiKey: process.env.GOOGLE_LOCATION_API_KEY,
        formatter: null
      })

      const response = await geocoder.geocode(req.query.address)
      
      lat = response[0].latitude
      long = response[0].longitude
    } catch(e) {
      console.log(e)
    }
  }

  return { lat, long }
}

exports.refreshBearerToken = async () => {
  let stillSearching = true
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] })
  const page = await browser.newPage()

  await page.setRequestInterception(true)

  page.on("request", req => {
    if (stillSearching && req.url().startsWith('https://api-gtm.grubhub.com/restaurants/search')) {
      const maybeBearerToken = req.headers().authorization && req.headers().authorization.replace('Bearer ', '')

      if (!!maybeBearerToken) {
        process.env.BEARER_TOKEN = maybeBearerToken
        console.log('successfully updated grubhub bearer token')
        
        stillSearching = false
      }
    }
    req.continue()
  });

  // New Grubhub search for a random food item in Boston, MA to avoid tripping up their captcha stuff
  const food = Constants.BREAKFAST_KEYWORDS[Math.round(Math.random() * (Constants.BREAKFAST_KEYWORDS.length - 1))]
  await page.goto(`https://www.grubhub.com/search?orderMethod=delivery&locationMode=DELIVERY&facetSet=umamiV2&pageSize=20&hideHateos=true&searchMetrics=true&queryText=${food}&latitude=42.36008071&longitude=-71.05888367&geohash=drt2zp2mrgru&facet=open_now%3Atrue&includeOffers=true&sortSetId=umamiv3&sponsoredSize=3&countOmittingTimes=true`, {
    waitUntil: 'networkidle0',
  })

  await browser.close()
}
