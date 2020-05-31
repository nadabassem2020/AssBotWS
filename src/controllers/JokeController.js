var https = require("https");

function getJoke(req,res, err) {
  var text = req.query.q;
  var options = {
    "method": "GET",
    "hostname": "joke3.p.rapidapi.com",
    "port": null,
    "path": "/v1/joke",
    "headers": {
      "x-rapidapi-host": "joke3.p.rapidapi.com",
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

module.exports = {getJoke};