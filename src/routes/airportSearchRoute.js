const { airportSearchByName } = require('../controllers/airportSearchController');

function airportSearchRoute(app){
    app.route('/airportSearch/search')
        .get(airportSearchByName)
}

module.exports = airportSearchRoute;