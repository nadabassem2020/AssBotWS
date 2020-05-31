const { coronavirusStatistics } = require('../controllers/coronavirusStatisticsController');

function coronavirusStatisticsRoute(app){
    app.route('/coronavirusStatistics/search')
        .get(coronavirusStatistics)
}

module.exports = coronavirusStatisticsRoute;
