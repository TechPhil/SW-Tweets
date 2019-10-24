const express = require("express");
const app = express();

app.use(express.static("public"));

const listener = app.listen(process.env.PORT, function() {
  console.log("Listening on port " + listener.address().port);
});

//TWITTER
var Twitter = require("twitter");
var T = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

var params = {
  q: "from:sw_help",
  count: 1,
  result_type: "recent",
  lang: "en"
};

T.get("search/tweets", params, function(err, data, response) {
  if (!err) {
    //do stuff
    console.log(data);
    console.log(response);
  } else {
    console.log(err);
  }
});
