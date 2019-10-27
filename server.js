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
  count: 1,
  tweet_mode: "extended"
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
  fs.writeFile("public/response.txt", response.body);
  var tweetobj = JSON.parse(response.body);
  if(tweetobj[0].in_reply_to_status_id){
    console.log("Replying");
    console.log(tweetobj[0].in_reply_to_status_id);
    var params ={
      id: tweetobj[0].in_reply_to_status_id_str,
      tweet_mode: "extended"
    };
    T.get("statuses/show", params, function(err, data, response){
      if (!err){
        //Do things
        fs.writeFile("public/reply.txt",response.body);
      } else{
        console.log(err);
      }
    })
  } else{
    fs.WriteFile("public/reply.txt","Not in reply to any tweet.");
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