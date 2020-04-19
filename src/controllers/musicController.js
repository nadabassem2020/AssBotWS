var https = require("https");

function getTrack(req,res, err) {
  var text = req.query.q;
  var options = {
    "method": "GET",
    "hostname": "deezerdevs-deezer.p.rapidapi.com",
    "port": null,
    "path": "/search?q="+text+"",
    "headers": {
      "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
      "x-rapidapi-key": "3a838069damshc76e686f8396114p159690jsn32dc6e59ce20"
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

module.exports = {getTrack};