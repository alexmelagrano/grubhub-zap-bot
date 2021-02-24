var Search = require('grubhub-api').Search


exports.fetchNearby = (req, res) => {
  if (!req.query.address) {
    res.status(404).send({ message: 'No address provided' })
    return
  }
  
  var search = new Search(req.query.address)
  console.log(search)
 
  search.run({perPage: 5, page: 1}, function(err, results) {
    if (err) {
      console.log(err)
      res.status(500).send({ err })
    } else {
      results.forEach(function(restaurant) {
        console.log(
          "Restaurant %s is %d miles away, has a rating of %d",
          restaurant.name, restaurant.distance, restaurant.grubhubRating
        );
      });
      res.status(200).send({ data: results })
    }
  });
};
