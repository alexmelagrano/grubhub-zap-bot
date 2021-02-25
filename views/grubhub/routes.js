const GrubhubService = require('./service')

exports.config = function (app) {
    app.get('/nearby_restaurants', [
        GrubhubService.fetchNearby
    ])
}
