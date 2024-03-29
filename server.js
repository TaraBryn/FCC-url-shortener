'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var dns = require('dns');

var cors = require('cors');

var app = express();

app.use(function(req, res, next){
  console.log(`${req.method} ${req.path} - ${req.ip}`);
  next();
})

app.use(bodyParser.urlencoded({extended: false}));

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
 mongoose.connect(process.env.MONGO_URI, {useUnifiedTopology: true, useNewUrlParser: true});

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

  
// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

const Schema = mongoose.Schema;
const urlSchema = new Schema({
  index: {type: Number, required: true},
  url: {type: String, required: true}
});
const URL = mongoose.model('url', urlSchema)

app.post('/api/shorturl/new', function(req, res){
  //test for invalid url
  var invalidUrl = {error: 'invalid URL'};
  var url = req.body.url;
  var urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
  console.log('test');
  if (!urlRegex.test(url)) return res.json(invalidUrl);
  var urlStripper = /(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}/
  var strippedUrl = url.match(urlStripper)[0];
  console.log(strippedUrl);
  var dnsFailed;
  (dns.lookup(strippedUrl, function(err) {if (err) dnsFailed = true;}));
  console.log(dnsFailed);
  //find or create and return url index
  URL.find({url}, function(urlError, urlData){
    if (urlError) return res.json({urlError});
    if (urlData.length > 0) return res.json({original_url: url, short_url: urlData[0].index});
    URL.find({}, function(allError, allData){
      if (allError) return res.json(allError);
      var index = allData.length;
      var urlDoc = new URL({index, url});
      urlDoc.save(function(saveError, saveData){
        if (saveError) return res.json({saveError});
        res.json({original_url: url, short_url: saveData.index});
      });
    });
  });
});

app.get('/api/shorturl/:index', function(req, res){
  URL.find({}, function(error, data){
    if (error) return res.json({error});
    var index;
    try{
      index = parseInt(req.params.index)
    }
    catch(e){
      return res.json({'error': e})
    }
    if (index > data.length-1 || index < 0) return res.json({error: 'no short url found for give input'});
    return res.redirect(data[index].url);
  });
});

app.get('/api/test-urls/:url', function(req, res){
  dns.lookup(req.params.url, function(error, address, family){
    if(error) return res.json({error});
    return res.json({address, family})
  })
})

app.listen(port, function () {
  console.log('Node.js listening ...');
});