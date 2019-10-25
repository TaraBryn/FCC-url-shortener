'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');

var cors = require('cors');

var app = express();

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
  URL.find({url: req.body.url}, function(urlErr, urlData){
    if (urlErr) 
      res.json({error: urlErr});
    else if(urlData.length > 0) 
      res.json({original_url: req.body.url, short_url: urlData[0].index});
    else
      URL.find({name: /.*/}, function(allErr, allData){
        if (allErr) res.json({error: allErr});
        else {
          var index = allData.length;
          var urlDoc = new URL({index, url: req.body.url});
          urlDoc.save(function(saveErr, data){
          if (saveErr) 
            res.json({error: saveErr});
          else 
            res.json({original_url: req.body.url, short_url: data.index});
          });
        }
      });
  });
});

app.get('/api/shorturl/:index', function(req, res){
  URL.find({index: req.params.index}, function(err, data){
    if (err) res.json
  });
});

app.listen(port, function () {
  console.log('Node.js listening ...');
});