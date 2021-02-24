const GrubhubController = require('./controller')

exports.config = function (app) {
    app.get('/nearby_restaurants', [
        GrubhubController.fetchNearby
    ])
}
