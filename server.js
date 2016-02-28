var express = require('express');
var app = express();
var hbs = require('hbs');
var html = require('html');
// var env=(process.env.api_key || require('../env'));
var bodyParser = require('body-parser');
var request = require('request');
// var map = require('./map.js');


var port= 8000;

var aptDATA = require('./apts_400.json');
var metroStationDATA = require('./Metro_Stations_Regional.json');

app.set('view engine', 'html');
app.engine('html', require('hbs').__express);
app.listen(port);
console.log("app is listening at " + port);


app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", function(req, res){
  res.render("test.html");
});

app.get("/apts_400", function(req, res){
 res.json(aptDATA);
});

app.get("/Metro_Stations_Regional", function(req, res){
  res.json(metroStationDATA);
});

app.get("/map", function(req, res){
  res.send(map);
});

app.post("/uber", function(req, res){

  // requestObj.=req.body.start_latitude;
  // req.body.start_longitude;
  // req.body.end_latitude;
  // req.body.end_longitude;

  var querystring = {
    start_latitude: req.body.start_latitude,
    start_longitude: req.body.start_longitude,
    end_latitude: req.body.end_latitude,
    end_longitude: req.body.end_longitude
  };
  var options = {
    url: 'https://api.uber.com/v1/estimates/price',
    headers: {
      'Authorization': 'Token FzWnNUf9-7mbIs-ntXotCvUt76bz47YgyYxOIKXS'
    },
    qs: querystring
  };

  console.log(options);
  function fetchData(error, response, body) {
    //console.log(response);
    if (!error && response.statusCode == 200) {
      var info = body;
      res.send(info);
      console.log(info);
    }
  }

request(options, fetchData);
  //
  // res.set("Authorization", "Token FzWnNUf9-7mbIs-ntXotCvUt76bz47YgyYxOIKXS");
  //
  // request("https://api.uber.com/v1/ESTIMATES/PRICE?start_latitude="+req.body.start_latitude+"&start_longitude="+req.body.start_longitude+"&end_latitude="+req.body.end_latitude+"&end_longitude="+req.body.end_longitude, function(error, response, body){
  //   var estimates = JSON.parse(body).result;
  //   res.send(estimates);
  //   response.send(estimates);
  // });

});



// function fetchData(req, res){
//   res.set("Authorization", "Token FzWnNUf9-7mbIs-ntXotCvUt76bz47YgyYxOIKXS");
//   request("https://api.uber.com/v1/ESTIMATES/PRICE?start_latitude=&start_longitude=&end_latitude=37.7759792&end_longitude=-122.41823", function(error, response, body){
//     if(!error && response.statusCode ==200){
//       var estimates=JSON.parse(body).results;
//       res.json(estimates);
//     }
//   });
// };
