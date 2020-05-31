var https = require("https");

function freeDownloader(req,res, err) {
  var options = {
    "method": "GET",
    "hostname": "free-mp3-mp4-youtube.p.rapidapi.com",
    "port": null,
    "path": "/3UTTdgO4FgE/MP3/spinner/2196f3/100/box-button/2196f3/tiny-button/Download/FFFFFF/yes/FFFFFF/none",
    "headers": {
      "x-rapidapi-host": "free-mp3-mp4-youtube.p.rapidapi.com",
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

module.exports = {freeDownloader};