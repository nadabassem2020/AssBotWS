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
            music_feature(labelArr, featureArr);
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
    random_track_index = Math.floor(Math.random() * Object['data'].length + 1);
    console.log(Object['data'][random_track_index]['title']);
    console.log(Object['data'][random_track_index]['link']);
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