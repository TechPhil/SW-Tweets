const express = require("express"); //Load express module
const app = express(); //Identify the app

app.use(express.static("public")); //Assign the directory to serve

const listener = app.listen(process.env.PORT, function() { //Ensure server can receive connections. process.ENV.PORT is assigned by Glitch.
  console.log("Listening on port " + listener.address().port);
});

//FS TEST
const fs = require("fs"); //Load fs module

//TWITTER
var Twitter = require("twitter"); //Load Twitter Module
var T = new Twitter({ //Define Twitter Client using secrets in process.env
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

var params = { //Set parameters of twitter request.
  screen_name: "sw_help",
  count: 1,
  tweet_mode: "extended"
};

function getUpdate() { //Function to contact Twitter API and get latest tweet from @SW_Help (replies included)
  T.get("statuses/user_timeline", params, function(err, data, response) {
    if (!err) { //If nothing goes wrong, then
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
  fs.writeFile("public/response.txt", response.body);
  var tweetobj = JSON.parse(response.body);
  if(tweetobj[0].in_reply_to_status_id){
    tweethasreply(tweetobj);
  } else{
    fs.writeFile("public/reply.txt","Not in reply to any tweet.");
  }
  
}


var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// receives data from our form on the client, edits the string, and passes the edited string back to the client
app.post('/editSearch', function(request, response) {
  const search = request.body.search;
  console.log(search);
  
  const editedSearch = `edited-${search}`;
  response.send({ search: editedSearch})
});

function tweethasreply(tweetobj){
  //Set parameters for Twitter API Call
    var params ={
      //Set id parameter to ID of original tweet
      id: tweetobj[0].in_reply_to_status_id_str,
      tweet_mode: "extended" //Ensure that full tweet is returned
    };
    T.get("statuses/show", params, function(err, data, response){
      if (!err){ //If there are no errors
        fs.writeFile("public/reply.txt",response.body); //Write the JSON data to the file reply.txt for the client to parse.
      } else{
        console.log(err); //Else, log the error.
      }
    })
}