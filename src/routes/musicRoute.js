const { getTrack } = require('../controllers/musicController');

function musicRoute(app){
    app.route('/music/search')
        .get(getTrack)
}

module.exports = musicRoute;