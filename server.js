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

function geteUrl(url)
{
  var search = URL.find({url});
  if (search.length > 0)
    window.open(`https://tarabryn-url-shortener.glitch.me/api/shorturl/${search[0].url}`);
  else {
    search = URL.find({name: /.*/});
    var index = search.length;
    var urlDoc = new URL({index, url});
  }
  
}

app.listen(port, function () {
  console.log('Node.js listening ...');
});