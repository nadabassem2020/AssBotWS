const { getJoke } = require('../controllers/JokeController');

function JokeRoute(app){
    app.route('/Joke/search')
        .get(getJoke)
}

module.exports = JokeRoute;
