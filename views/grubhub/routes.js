const GrubhubService = require('./service')

exports.config = app => {
    app.get('/nearby_restaurants', [
        GrubhubService.fetchNearby
    ])
}
