var https = require("https");

function currentTemp(req,res, err) {
    let apiKey = '755e7f82a2cb13a116f5a0e398054c5e',
        lat = req.query.lat,
        long = req.query.long,
        url = 'https://api.darksky.net/forecast/'+apiKey+'/'+lat+','+long;
    https.get(url, function(response){
        var body = '';
        response.on('data', function(chunk){
            body += chunk;
        });
        response.on('end', function(){
            try {
              var jsonObj = JSON.parse(body);
              if (jsonObj) {
                /*var output = {
                  lat: jsonObj['latitude'],
                  long: jsonObj['longitude'],
                  zone: jsonObj['timezone'],
                  temp: jsonObj['currently']['temperature']
                };*/
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

module.exports = {currentTemp};