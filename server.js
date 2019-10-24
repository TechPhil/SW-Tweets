const express = require("express");
const app = express();

app.use(express.static("public"));

const listener = app.listen(process.env.PORT, function() {
  console.log("Listening on port " + listener.address().port)
})

//TWITTER

var latestTweets = require('latest-tweets')
latestTweets('sw_help',function(null,tweets))