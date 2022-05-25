
const express = require('express');
let bodyParser = require('body-parser');
const cors = require('cors');
const dns = require('node:dns');
const app = express();

function hasValue(obj, key, value) {
  return obj[key] === value;
}

// Basic Configuration
const port = process.env.PORT || 3000;
var urlArray = [];
var shortURL = 1;
app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.use(bodyParser.urlencoded({extended: false}));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.route('/api/shorturl/:shortened_url?')
  .post((req, res) => {
    let urlObj = {"original_url": req.body.url, "short_url": shortURL}
    dns.lookup(req.body.url, (err) => {
      if(err.code === "ENOTFOUND") {
        res.send(urlObj);
        urlArray.push(urlObj);
        shortURL++;
    } else {
        res.send({error: "Invalid URL 1"});
    }
  })
})
  .get((req, res) => {
    if (!urlArray.some((urls) => hasValue(urls,"short-url", req.body.shortened_url))) {
      res.json({error: "Invalid URL 2"})
    } else {
      res.redirect(urlArray[urlArray.findIndex((url) => (url["short-url"] === req.body.shortened_url))]["original_url"])
    }
  });


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
