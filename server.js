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

/*function geteUrl(url)
{
  URL.find({url}, function(err, urlData){
    if (err) return console.log(err);
    if (urlData.length > 0)
      window.open(`https://tarabryn-url-shortener.glitch.me/api/shorturl/new/${urlData[0].url}`);
    else
      URL.find({name: /.*-/}, function(err2, allData){
        if (err2) return console.log(err2);
        var index = allData.length;
        var urlDoc = new URL({index, url});
        urlDoc.save(function(err3, data){
          if (err3) return console.log(err3);
        });
        window.open
      });
  });
  /*var search = URL.find({url});
  if (search.length > 0)
    window.open(`https://tarabryn-url-shortener.glitch.me/api/shorturl/${search[0].url}`);
  else {
    search = URL.find({name: /.*-/});
    var index = search.length;
    var urlDoc = new URL({index, url});
  }*/
//}

app.listen(port, function () {
  console.log('Node.js listening ...');
});