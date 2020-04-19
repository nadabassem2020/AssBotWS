const https = require('https');

function convertCurrency(req, res, err) {
    let apiKey = 'aaea9a723edcdc47ef4b',
        fromCurrency = req.query.from.toUpperCase(),
        toCurrency = req.query.to.toUpperCase(),
        amount = req.query.amount,
        query = fromCurrency + '_' + toCurrency;
  
    var url = 'https://free.currconv.com/api/v7/convert?q='+ query + '&compact=ultra&apiKey=' + apiKey;
    //https://free.currconv.com/api/v7/convert?q=usd_egp&compact=ultra&apiKey=aaea9a723edcdc47ef4b

    https.get(url, function(response){
        var body = '';
  
        response.on('data', function(chunk){
            body += chunk;
        });
  
        response.on('end', function(){
            try {
              var jsonObj = JSON.parse(body);
              var val = jsonObj[query];
              // Val = 15.75
              if (val) {
                var total = val * amount;
                res.json(total);
              } else {
                var err = new Error("Value not found for " + query);
                console.log(err);
                res.json(err);
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
}

module.exports = {convertCurrency};