const { latestMovies ,recommendationsMovies} = require('../controllers/moviesController');

function moviesRoute(app){
    app.route('/movies')
        .get(latestMovies);
    app.route('/movies/recommendations')
        .get(recommendationsMovies);
}

module.exports = moviesRoute;