const { TranslateDetect , googleTranslateLanguage ,googleTranslate } = require('../controllers/googleTranslateController');

function googleTranslateRoute(app){
    app.route('/googleTranslate/detect')
        .get(TranslateDetect)

    app.route('/googleTranslate/langs')
        .get(googleTranslateLanguage)

    app.route('/googleTranslate/trans')
        .get(googleTranslate)
}

module.exports = googleTranslateRoute;