const { getFork } = require('../controllers/ForkController');

function ForkRoute(app){
    app.route('/Fork/search')
        .get(getFork)
}

module.exports = ForkRoute;
