const https = require("https");

function topHeadLines(req, res, err) {
    let apiKey = '1c9b1fb41e5c487b808555707424d48b';
    let countery = 'us';

    var url = 'https://newsapi.org/v2/top-headlines?country='+countery+'&apiKey=' + apiKey;
    //https://newsapi.org/v2/top-headlines?country=us&apiKey=1c9b1fb41e5c487b808555707424d48b

    https.get(url, function(response){
        var body = '';
        response.on('data', function(chunk){
            body += chunk;
        });
        response.on('end', function(){
            try {
                var jsonObj = JSON.parse(body);
                res.json(jsonObj);
            } catch(e) {
                console.log("Parse error: ", e);
                res.json(e);
            }
        });
    }).on('error', function(e){
          console.log("Got an error: ", e);
          res.json(e);

    });
}

// https://newsapi.org/sources El a5tasarat
function sportsNews(req, res, err){
    let apiKey = '1c9b1fb41e5c487b808555707424d48b';
    let countery = req.query.country;

    var url = 'https://newsapi.org/v2/top-headlines?country=' +countery+'&category=sports&apiKey=' + apiKey;
    //https://newsapi.org/v2/top-headlines?country=us&apiKey=1c9b1fb41e5c487b808555707424d48b

    https.get(url, function(response){
        var body = '';
        response.on('data', function(chunk){
            body += chunk;
        });
        response.on('end', function(){
            try {
                var jsonObj = JSON.parse(body);
                res.json(jsonObj);
            } catch(e) {
                console.log("Parse error: ", e);
                res.json(e);
            }
        });
    }).on('error', function(e){
          console.log("Got an error: ", e);
          res.json(e);
    });
}

module.exports = {topHeadLines, sportsNews};
