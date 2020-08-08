//This file reads from the database and then send a request to the APIs then sends the response to a JSON file apiresp.json
const express = require('express');
const newsRoute = require('./src/routes/newsRoute');
const moviesRoute = require('./src/routes/moviesRoute');
const curerencyRoute = require('./src/routes/currencyRoute');
const weatherRoute = require('./src/routes/weatherRoute');
const musicRoute = require('./src/routes/musicRoute');
const foodCalories = require('./src/routes/foodCalorieRoute');
const googleTranslate = require('./src/routes/googleTranslateRoute');
const airportSearch = require('./src/routes/airportSearchRoute');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var neo4j = require('neo4j-driver');
var http = require("http");
var Parse = require('parse');
var URL = require('url');
var fs = require('fs');


// Initialize app
const port = 3000;
var app = express();


//view engine 
app.set('views', path.join(__dirname, "views"));
app.set('view engine', 'ejs');

// Middleware to handle json data 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

var driver = neo4j.driver('bolt://localhost:11002', neo4j.auth.basic('neo4j', 'password'));
var session = driver.session();
var nodeType = 'parameter';
var labelArr = [];
var featureArr = [];


class Output {
    constructor(answer) {
        this.API_answer = answer;
    }
}
session
    .run('Match(n {type: $type}) Return n', { type: nodeType })
    .then(function(result) {
        result.records.forEach(function(record, feature) {
            labelArr.push({
                label: record._fields[0].labels
            });

            featureArr.push({
                feature: record._fields[0].properties.feature
            })
        })

        labelArr.forEach(function(label) {
            console.log(label);
        })



    })
    .then(function(feature) {
        if (featureArr[0]['feature'] == 'music') {
            try {
                return music_feature(labelArr, featureArr);
            } catch {
                console.log('We dont have enough data about the artist');

            }
        } else if (featureArr[0]['feature'] == 'calorie') {
            try {
                return (calorie_feature(labelArr, featureArr));
            } catch {
                console.log('we dont have enough data about this food');

            }
        } else if (featureArr[0]['feature'] == 'translate') {
            try {
                return (translate_feature(labelArr, featureArr));
            } catch {
                console.log('we dont have enough data about this language');

            }
        } else if (featureArr[0]['feature'] == 'airport') {
            try {
                return (airport_feature(labelArr, featureArr));
            } catch {
                console.log('we dont have enough data about this language');

            }
        }

        // else if (featureArr[0]['feature'] == 'music'){

        // }

        labelArr = []
        featureArr = []

    })

.catch(function(err) {
    console.log("error in reading the Database " + err);
    process.exit(1)

});

function parse_music(Object) {

    try {
        random_track_index = Math.floor(Math.random() * Object['data'].length + 1);
        console.log(Object['data'][random_track_index]['title']);
        console.log(Object['data'][random_track_index]['link']);

    } catch {
        console.log('Sorry, e cant find enough data for the artist');
    }

    var obj = {
        name: '',
        url: ''
    };

    obj.name = Object['data'][random_track_index]['title'];
    obj.url = Object['data'][random_track_index]['link'];
    var data = JSON.stringify(obj);

    fs.writeFileSync('apiresp.json', data, finished);

    function finished(err) {
        console.log('ALL SET');
    }
}

function music_feature(labelArr, featureArr) {
    // Asuming that our service is running on https://www.ourservice.com
    // This is how we can access our music-search feature in any node.js app
    // Url as in documentation file 
    var par = labelArr[0]['label'][0];

    var url = `http://localhost:3000/music/search?q=${par}`.replace(/\s/g, '');
    http.get(url, function(response) {
        var body = '';
        response.on('data', function(chunk) {
            body += chunk;
        });
        response.on('end', function() {
            var jsonObj = JSON.parse(body);
            parse_music(jsonObj);
            process.exit(1)

            // Now data is ready in json obj use it whatever you want
        });
    }).on('error', function(e) {
        console.log("error in API: ", e);
        process.exit(1)
    });
}

function parse_calorie(Object) {

    try {
        random_food_index = Math.floor(Math.random() * Object.length + 1);

        console.log(Object[random_food_index]['id']);

    } catch {
        console.log('Sorry, e cant find enough data for the food');
    }

    var obj = {
        energyCal: 0,
        suger: 0,
        fat_sat: 0,
        carbs: 0,
        protien: 0,
        vitD: 0,
        cholestrol: 0,
        iron: 0,
        sodium: 0,
        pottassium: 0,
        vit_c: 0
    };

    obj.energyCal = Object[random_food_index]['energy_kcal'];
    obj.suger = Object[random_food_index]['sugar_tot'];
    obj.fat_sat = Object[random_food_index]['fa_sat'];
    obj.carbs = Object[random_food_index]['carbohydrt'];
    obj.protien = Object[random_food_index]['protien'];
    obj.vitD = Object[random_food_index]['vit_d'];
    obj.cholestrol = Object[random_food_index]['cholestrl'];
    obj.iron = Object[random_food_index]['iron'];
    obj.sodium = Object[random_food_index]['sodium'];
    obj.pottassium = Object[random_food_index]['potassium'];
    obj.vit_c = Object[random_food_index]['vit_c'];

    var data = JSON.stringify(obj);

    fs.writeFileSync('apiresp.json', data, finished);

    function finished(err) {
        console.log('ALL SET');
    }
}

function calorie_feature(labelArr, featureArr) {
    // Asuming that our service is running on https://www.ourservice.com
    // This is how we can access our music-search feature in any node.js app
    // Url as in documentation file 
    var par = labelArr[0]['label'][0];

    // http://localhost:3000/foodCalorie/search?q="text

    var url = `http://localhost:3000/foodCalorie/search?q=${par}`.replace(/\s/g, '');
    http.get(url, function(response) {
        var body = '';
        response.on('data', function(chunk) {
            body += chunk;
        });
        response.on('end', function() {
            var jsonObj = JSON.parse(body);
            parse_calorie(jsonObj);
            process.exit(1)

            // Now data is ready in json obj use it whatever you want
        });
    }).on('error', function(e) {
        console.log("error in API: ", e);
        process.exit(1)
    });
}

function airport_feature(labelArr, featureArr) {
    // Asuming that our service is running on https://www.ourservice.com
    // This is how we can access our music-search feature in any node.js app
    // Url as in documentation file 
    var par = labelArr[0]['label'][0];

    // http://localhost:3000/foodCalorie/search?q="text

    var url = `http://localhost:3000/airportSearch/search?q=${par}`.replace(/\s/g, '');
    http.get(url, function(response) {
        var body = '';
        response.on('data', function(chunk) {
            body += chunk;
        });
        response.on('end', function() {
            var jsonObj = JSON.parse(body);
            parse_airport(jsonObj);
            process.exit(1)

            // Now data is ready in json obj use it whatever you want
        });
    }).on('error', function(e) {
        console.log("error in API: ", e);
        process.exit(1)
    });
}

function parse_airport(Object) {

    console.log(Object);
    // try {
    //     random_track_index = Math.floor(Math.random() * Object['data'].length + 1);
    //     console.log(Object['data'][random_track_index]['title']);
    //     console.log(Object['data'][random_track_index]['link']);

    // } catch {
    //     console.log('Sorry, e cant find enough data for the artist');
    // }

    // var obj = {
    //     name: '',
    //     url: ''
    // };

    // obj.name = Object['data'][random_track_index]['title'];
    // obj.url = Object['data'][random_track_index]['link'];
    // var data = JSON.stringify(obj);

    // fs.writeFileSync('apiresp.json', data, finished);

    // function finished(err) {
    //     console.log('ALL SET');
    // }
}


function parse_translate(Object) {
    // console.log(Object['data']['translations'][0]['translatedText']);

    try {
        console.log(Object['data']['translations'][0]['translatedText']);
        // random_track_index = Math.floor(Math.random() * Object['data'].length + 1);
        // console.log(Object['data'][random_track_index]['title']);
        // console.log(Object['data'][random_track_index]['link']);

    } catch {
        console.log('Sorry, e cant find enough data for the language');
    }

    var obj = {
        translation: ''
    };

    obj.translation = Object['data']['translations'][0]['translatedText']
    var data = JSON.stringify(obj);

    fs.writeFileSync('apiresp.json', data, finished);

    function finished(err) {
        console.log('ALL SET');
    }
}

function translate_feature(labelArr, featureArr) {
    console.log(labelArr);

    var par1 = labelArr[0]['label'][0];
    var par2 = labelArr[1]['label'][0];

    var url = `http://localhost:3000/googleTranslate/trans?q=${par2}&target=${par1}`.replace(/\s/g, '');
    http.get(url, function(response) {
        var body = '';
        response.on('data', function(chunk) {
            body += chunk;
        });
        response.on('end', function() {
            var jsonObj = JSON.parse(body);
            parse_translate(jsonObj);
            process.exit(1)

            // Now data is ready in json obj use it whatever you want
        });
    }).on('error', function(e) {
        console.log("error in API: ", e);
        process.exit(1)
    });

    function parse_corona(Object) {

        try {
            random_track_index = Math.floor(Math.random() * Object['data'].length + 1);
            console.log(Object['data'][random_track_index]['title']);
            console.log(Object['data'][random_track_index]['link']);

        } catch {
            console.log('Sorry, e cant find enough data for the artist');
        }

        var obj = {
            name: '',
            url: ''
        };

        obj.name = Object['data'][random_track_index]['title'];
        obj.url = Object['data'][random_track_index]['link'];
        var data = JSON.stringify(obj);

        fs.writeFileSync('apiresp.json', data, finished);

        function finished(err) {
            console.log('ALL SET');
        }
    }

    function corona_feature(labelArr, featureArr) {
        // Asuming that our service is running on https://www.ourservice.com
        // This is how we can access our music-search feature in any node.js app
        // Url as in documentation file 
        var par = labelArr[0]['label'][0];

        var url = `http://localhost:3000/coronavirusStatistics/search?q="=${par}`.replace(/\s/g, '');
        http.get(url, function(response) {
            var body = '';
            response.on('data', function(chunk) {
                body += chunk;
            });
            response.on('end', function() {
                var jsonObj = JSON.parse(body);
                parse_corona(jsonObj);
                process.exit(1)

                // Now data is ready in json obj use it whatever you want
            });
        }).on('error', function(e) {
            console.log("error in API: ", e);
            process.exit(1)
        });
    }

    app.listen(3000);
    console.log('Server Stater on port 3000');
    module.exports = app;

    // Service Routes
    newsRoute(app);
    moviesRoute(app);
    curerencyRoute(app);
    weatherRoute(app);
    musicRoute(app);
    foodCalories(app);
    googleTranslate(app);
    airportSearch(app);
