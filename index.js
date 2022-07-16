require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');

const Database = require('./dbconfig');
// Basic Configuration
const port = process.env.PORT || 3000;
//const urlRegex = new RegExp(/https?:\/\/(www\.)?[a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([a-zA-Z0-9()@:%_\+.~#?&\/=]*)/g);
const urlRegex = new RegExp(/http(s)?:\/\/.(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/public', express.static(`${process.cwd()}/public`));

const UrlModel = require('./models/url.model');

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', function(req, res, next) {
  //const originalUrl = req.params.url;
  const originalUrl = req.body.url;
  if(!originalUrl.match(urlRegex)){
    res.json({ error: 'invalid url' });
  }else{
    UrlModel.find({ originalUrl : originalUrl}, function(err, foundUrl){
      if(foundUrl && foundUrl.length != 0){
        res.json({ original_url: foundUrl[0].originalUrl, short_url : Number(foundUrl[0].shortUrl) });
      }else{
        let newUrlModel = new UrlModel({
          originalUrl : originalUrl
        });
        newUrlModel.save(function(err, newUrl){
          if(!err){
            res.json({ original_url: originalUrl, short_url : Number(newUrl.shortUrl) });
          }else{
            console.log(err);
          }
        })
      }
    });
  }
});

app.get('/api/shorturl/:url?', function(req, res) {
  const shortUrl = req.params.url;
  UrlModel.findOne({shortUrl : shortUrl}, function(err, url){
    if(url){
      res.redirect(url.originalUrl);
    }else{
      res.json({ error: 'invalid url' });
    }
  });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
