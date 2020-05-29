const { worldClock } = require('../controllers/worldClockController');

function worldClockRoute(app){
    app.route('/worldClock/search')
        .get(worldClock)
}

module.exports = worldClockRoute;
