var https = require("https");
var qs = require("querystring");

function TranslateDetect(req, res, err) {
	var query = req.query.q;
	var options = {
		"method": "POST",
		"hostname": "google-translate1.p.rapidapi.com",
		"port": null,
		"path": "/language/translate/v2/detect",
		"headers": {
			"x-rapidapi-host": "google-translate1.p.rapidapi.com",
			"x-rapidapi-key": "3a838069damshc76e686f8396114p159690jsn32dc6e59ce20",
			"accept-encoding": "application/gzip",
			"content-type": "application/x-www-form-urlencoded",
			"useQueryString": true
		}
	};

	var reques = https.request(options, function(response){
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
		reques.write(qs.stringify({q: query}));
		reques.end();
};

//----------------------------- 
function googleTranslateLanguage(req, res, err) {
 
	var options = {
		"method": "GET",
		"hostname": "google-translate1.p.rapidapi.com",
		"port": null,
		"path": "/language/translate/v2/languages",
		"headers": {
			"x-rapidapi-host": "google-translate1.p.rapidapi.com",
			"x-rapidapi-key": "3a838069damshc76e686f8396114p159690jsn32dc6e59ce20",
			"accept-encoding": "application/gzip",
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

//----------------------------------
function googleTranslate(req, res, err) {
	var query = req.query.q;
	var target = req.query.target;
	var options = {
		"method": "POST",
		"hostname": "google-translate1.p.rapidapi.com",
		"port": null,
		"path": "/language/translate/v2",
		"headers": {
			"x-rapidapi-host": "google-translate1.p.rapidapi.com",
			"x-rapidapi-key": "3a838069damshc76e686f8396114p159690jsn32dc6e59ce20",
			"accept-encoding": "application/gzip",
			"content-type": "application/x-www-form-urlencoded",
			"useQueryString": true
		}
	};

	var reques = https.request(options, function(response){
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
	  reques.write(qs.stringify({q: query, target: target}));
	  reques.end();  
};

module.exports = {TranslateDetect , googleTranslateLanguage ,googleTranslate};