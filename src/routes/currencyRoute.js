const { convertCurrency } = require('../controllers/currencyController');

function currencyRoute(app){
    app.route('/currency')
        .get(convertCurrency)
}

module.exports = currencyRoute;