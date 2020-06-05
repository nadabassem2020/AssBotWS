var https = require("https");

function getFork(req,res, err) {
  var text = req.query.q;
  var options = {
    "method": "GET",
    "hostname": "thefork.p.rapidapi.com",
    "port": null,
    "path": "/restaurants/list?pageNumber=1&queryPlaceValueCoordinatesLongitude=9.189982&pageSize=10&queryPlaceValueCoordinatesLatitude=45.4642035&queryPlaceValueCityId=348156",
    "headers": {
      "x-rapidapi-host": "thefork.p.rapidapi.com",
      "x-rapidapi-key": "3a838069damshc76e686f8396114p159690jsn32dc6e59ce20",
      "useQueryString": true
    }
  };
  https.get(options, function(response){
    var body = '';
    response.on('data', function(chunk){
        body += chunk;
    });
    response.on('end', function(){
        try {
          var jsonObj = JSON.parse(body);
          if (jsonObj) {
            res.json(jsonObj);
          }
        } catch(e) {
          console.log("Parse error: ", e);
          res.json(e);
        }
    });
  }).on('error', function(e){
      console.log("Got an error: ", e);
      res.json(e);
  });
};

module.exports = {getFork};