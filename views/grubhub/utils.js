const NodeGeocoder = require('node-geocoder')

exports.resolveLocation = async (req) => {
  let lat = process.env.LATITUDE
  let long = process.env.LONGITUDE

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
