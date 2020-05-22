const { foodCalorie } = require('../controllers/foodCalorieController');

function foodCalorieRoute(app){
    app.route('/foodCalorie/search')
        .get(foodCalorie)
}

module.exports = foodCalorieRoute;