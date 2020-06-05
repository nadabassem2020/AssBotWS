const { Calculator } = require('../controllers/CalculatorController');

function CalculatorRoute(app){
    app.route('/calculator/search')
        .get(Calculator)
}

module.exports = CalculatorRoute;
