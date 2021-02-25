const axios = require('axios')
const GrubhubConstants = require('./constants')

exports.fetchNearby = (req, res) => {
  // TODO: create a headless setup to get fresh auth creds regularly & on-demand. Seems like they
  // cycle on a fairly predictable basis, wouldn't be too hard to set up a recursive callback on
  // this fetch with an aside to refresh the token if it 401's.
  const bearerToken = process.env.BEARER_TOKEN
  const cookie = process.env.GRUBHUB_COOKIE

  if (!bearerToken) {
    return res.json({
      status: 500,
      message: 'No Grubhub token present.'
    })
  }
  
  if (!req.query.address) {
    return res.json({
      status: 404,
      message: 'No address provided.'
    })
  }
  
  // TODO: replace temp .env values for ones based on the provided address.
  const lat = process.env.LATITUDE
  const long = process.env.LONGITUDE
  const food = req.query.food
  const isLookingForBreakfast = GrubhubConstants.BREAKFAST_KEYWORDS.includes(food)

  const fetchConfig = {
    method: 'get',
    url: `https://api-gtm.grubhub.com/restaurants/search?orderMethod=delivery&locationMode=DELIVERY&facetSet=umamiV2&pageSize=40&hideHateos=true&searchMetrics=true&queryText=${food}&location=POINT(${long}%20${lat})&sortSetId=umamiV2&sponsoredSize=3&countOmittingTimes=true&pageNum=1`,
    headers: { 
      'Authorization': `Bearer ${bearerToken}`,
      'Cookie': cookie
    }
  }

  try {
    axios(fetchConfig)
      .then(({ data }) => {
        console.log('looking for restaurants offering: ' + food)
        const searchResults = data.search_result.results

        const cleanedResults = searchResults.reduce((acc, restaurantItem) => {
          if (acc.length <= 5) {
            const isChain = !!restaurantItem.chain_id
            let cuisinesMatch = true
            
            // Grubhub's results for these items suck
            if (isLookingForBreakfast) {
              cuisinesMatch = restaurantItem.cuisines.some(cuisine => 
                GrubhubConstants.VALID_BREAKFAST_CUISINES.includes(cuisine)
              )
            }

            if (!isChain && cuisinesMatch) {
              acc.push({
                name: restaurantItem.name,
                logo: restaurantItem.logo,
                rating: restaurantItem.ratings.actual_rating_value.toFixed(2),
                distanceFromAddress: restaurantItem.distance_from_location,
                deliveryTimeEstimate: 
                  restaurantItem.delivery_time_estimate + restaurantItem.pickup_time_estimate,
                grubhubLink: `https://www.grubhub.com/restaurant/${restaurantItem.restaurant_id}`
              })
            }
          }

          return acc
        }, [])
        
        return res.json({
          status: 200,
          data: cleanedResults
        })
      })
      .catch(e => {
        console.log(e)
        return res.json({
            status: 500,
            message: `Failed to get data from grubhub; ${e.message}`
        })
      })
  } catch(e) {
    console.log(e)
    return res.json({
        status: 500,
        message: `An error occurred.; ${e.message}`
    })
  }
};
