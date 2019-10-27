const express = require("express"); //Load express module
const app = express(); //Identify the app

app.use(express.static("public")); //Assign the directory to serve

const listener = app.listen(process.env.PORT, function() {
  //Ensure server can receive connections. process.ENV.PORT is assigned by Glitch.
  console.log("Listening on port " + listener.address().port);
});

//FS TEST
const fs = require("fs"); //Load fs module

//TWITTER
var Twitter = require("twitter"); //Load Twitter Module
var T = new Twitter({
  //Define Twitter Client using secrets in process.env
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

var params = {
  //Set parameters of twitter request.
  screen_name: "sw_help",
  count: 1,
  tweet_mode: "extended"
};

function getUpdate() {
  //Function to contact Twitter API and get latest tweet from @SW_Help (replies included)
  T.get("statuses/user_timeline", params, function(err, data, response) {
    if (!err) {
      //If nothing goes wrong, then
      sendTweetToClient(response); //Fun
    } else {
      console.log(err);
    }
  });
}

function sendTweetToClient(response) {
  //Function to enable s-c comms for @SW_Help Tweet
  fs.writeFile("public/response.txt", response.body); //Write the JSON data to the file response.txt for the client to parse.
  parseTweetforReply(response.body); //Check for reply status
}
function parseTweetforReply(respbody) {
  //Function to check for reply status and act accordingly
  var tweetobj = JSON.parse(respbody); //Parse from JSON String to object.
  if (tweetobj[0].in_reply_to_status_id) {
    //If tweet is replying to another tweet
    tweethasreply(tweetobj); //Run function
  } else {
    fs.writeFile("public/reply.txt", "Not in reply to any tweet.");
  }
  var tweetid = tweetobj[0].id_str;
  isnewTweet(tweetid);
}

function tweethasreply(tweetobj) {
  //Called if @SW_Help is replying to another user.
  //Set parameters for Twitter API Call
  var params = {
    //Set id parameter to ID of original tweet
    id: tweetobj[0].in_reply_to_status_id_str,
    tweet_mode: "extended" //Ensure that full tweet is returned
  };
  T.get("statuses/show", params, function(err, data, response) {
    if (!err) {
      //If there are no errors
      fs.writeFile("public/reply.txt", response.body); //Write the JSON data to the file reply.txt for the client to parse.
    } else {
      console.log(err); //Else, log the error.
    }
  });
}

//Deals with client-to-server transmission
var bodyParser = require("body-parser"); //Import body-parser library
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// receives data from our form on the client, edits the string, and passes the edited string back to the client
app.post("/addDelay", function(request, response) {
  const search = request.body.search;
  console.log(search);

  const editedSearch = `edited-${search}`;
  response.send({ search: editedSearch });
});
app.post("/addLate", function(request, response) {
  const search = request.body.search;
  console.log(search);

  const editedSearch = `edited-${search}`;
  response.send({ search: editedSearch });
});

//Run functions
getUpdate(); //Start function on page-load.
setInterval(getUpdate, 10000); //cause the getUpdate function to run every 10 seconds.




function isnewTweet(tweetid){
  console.log(tweetid)
  var dict = fetch("public/searchterms.txt")
  console.log(dict)
}