const express = require("express");
const app = express();

app.use(express.static("public"));

const listener = app.listen(process.env.PORT, function() {
  console.log("Listening on port " + listener.address().port);
});

//FS TEST
const fs = require("fs");

//TWITTER
var Twitter = require("twitter");
var T = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

var params = {
  screen_name: "sw_help",
  count: 1
};

function getUpdate() {
  T.get("statuses/user_timeline", params, function(err, data, response) {
    if (!err) {
      //do stuff
      dothingshere(response);
    } else {
      console.log(err);
    }
  });
}
getUpdate();
setInterval(getUpdate, 10000);
function dothingshere(response) {
  console.log("dothingshere called");
  var responseobj = response;
  var responsestring = JSON.stringify(response.body);
  fs.writeFile("public/response.txt", responsestring);
}
