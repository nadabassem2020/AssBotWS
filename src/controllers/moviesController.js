const https = require('https');

function latestMovies(req, res, err) {
    let apiKey = '6067e85bb930d633b5429eb320066130';
    //https://api.themoviedb.org/3/trending/all/day?api_key=<<api_key>>&language=en-US
    var url = 'https://api.themoviedb.org/3/trending/all/day?api_key='+ apiKey;
  
    https.get(url, function(response){
        var body = '';
        response.on('data', function(chunk){
            body += chunk;
        });
        response.on('end', function(){
            try {
                var jsonObj = JSON.parse(body);
                var output = [{
                        title: jsonObj.results[0]['title'],
                        vote_count: jsonObj.results[0]['vote_count'],
                        date: jsonObj.results[0]['release_date'],
                        language: jsonObj.results[0]['original_language'],
                    },{
                        title: jsonObj['results'][1]['title'],
                        vote_count: jsonObj['results'][1]['vote_count'],
                        date: jsonObj['results'][1]['release_date'],
                        language: jsonObj['results'][1]['original_language'],
                    }];
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

/////////////////////////////////////////////////////////////////
function recommendationsMovies(req, res, err) {
    let apiKey = '6067e85bb930d633b5429eb320066130';
    let movieId = req.query.id;
    //https://api.themoviedb.org/3/movie/443791/recommendations?api_key=6067e85bb930d633b5429eb320066130&language=en-US&page=1
    var url = 'https://api.themoviedb.org/3/movie/'+movieId+'/recommendations?api_key='+ apiKey;
  
    https.get(url, function(response){
        var body = '';
        response.on('data', function(chunk){
            body += chunk;
            
        });
        response.on('end', function(){
            try {
                var jsonObj = JSON.parse(body);
                var output = [{
                        title: jsonObj.results[0]['title'],
                        vote_count: jsonObj.results[0]['vote_count'],
                        date: jsonObj.results[0]['release_date'],
                        language: jsonObj.results[0]['original_language'],
                    },{
                        title: jsonObj['results'][1]['title'],
                        vote_count: jsonObj['results'][1]['vote_count'],
                        date: jsonObj['results'][1]['release_date'],
                        language: jsonObj['results'][1]['original_language'],
                    }];
                res.json(output);
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

module.exports = { latestMovies , recommendationsMovies };