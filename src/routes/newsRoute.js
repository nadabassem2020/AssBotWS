const {topHeadLines, sportsNews} = require('../controllers/newsController');

function newsRoute(app){
    app.route('/news')
        .get(topHeadLines); // Request type get

    app.route('/news/sports')
        .get(sportsNews); // Request type get
}

module.exports = newsRoute;