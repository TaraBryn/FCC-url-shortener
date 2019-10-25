'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

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
  URL.find({url: req.body.url}, function(urlError, urlData){
    if (urlError) return res.json({urlError});
    if (urlData.length > 0) return res.json({original_url: req.body.url, short_url: urlData[0].index});
    URL.find({}, function(allError, allData){
      if (allError) return res.json(allError);
      var index = allData.length;
      var urlDoc = new URL({index, url: req.body.url});
      urlDoc.dave(function(saveError, saveData){
        if (saveError) return res.json({saveError});
        res.json({original_url: req.body.url, short_url: saveData.index});
      });
    });
  });
});

app.get('/api/shorturl/:index', function(req, res){
  URL.find({index: req.params.index}, function(err, data){
    //if (err) res.json({error: })
  });
});

app.listen(port, function () {
  console.log('Node.js listening ...');
});