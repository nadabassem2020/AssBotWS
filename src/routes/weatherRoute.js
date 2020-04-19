const { currentTemp } = require('../controllers/weatherController');

function weatherRoute(app){
    app.route('/weather/currenttemp')
        .get(currentTemp)
}

module.exports = weatherRoute;