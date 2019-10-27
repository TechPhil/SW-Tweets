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
  //screen_name: "techphilyt",
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
  isnewTweet(tweetid, tweetobj);
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
function getDict() {
  console.log("getting dict");
  var dict;
  fs.readFile("public/searchterms.txt", "utf-8", function(err, data) {
    if (!err) {
      console.log("no error in file read");
      console.log("data - "+data);
      dict = JSON.parse(data);
      console.log("dict - "+dict);
    } else {
      console.log("err - "+err);
    }
  });
  console.log(dict)
  return dict;
  console.log("after fs");
}

function isnewTweet(id, obj) {
  console.log("new tweet id - "+id);
  var newdict = getDict();
  console.log("new dict -"+newdict);
  newTweetCheck(newdict, id, obj);
}

function newTweetCheck(dict, id, obj) {
  console.log(dict.latest_id);
  console.log(id);
  if (id != dict.latest_id) {
    console.log("ids different");
    dict.latest_id = id;
    idsdifferent(dict, obj);
  } else {
    console.log("ids same");
  }
  var dicttext = JSON.stringify(dict);
  fs.writeFile("public/searchterms.txt", dicttext);
}

function idsdifferent(dict, obj) {
  var tweettext = obj[0].full_text;
  var hasdelay = tweettext.toLowerCase().includes("delay");
  var haslate = tweettext.toLowerCase().includes("late");
  var hascancel = tweettext.toLowerCase().includes("cancel");
  console.log(
    "Status - Delay: " +
      hasdelay +
      " Late: " +
      haslate +
      " Cancel: " +
      hascancel
  );
  if (hasdelay) {
    dict.delay = dict.delay + 1;
    console.log("Delay count now " + dict.delay);
  }
  if (haslate) {
    dict.late = dict.late + 1;
    console.log("Late count now " + dict.late);
  }
  if (hascancel) {
    dict.cancel = dict.cancel + 1;
    console.log("Cancel count now " + dict.cancel);
  }
}
setInterval(function() {
  var date = new Date();
  if (date.getHours() == 0 && date.getMinutes() == 0) {
    resetCounts();
  }
}, 60000);

function resetCounts() {
  var dict = getDict();
  dict.delay = 0;
  dict.late = 0;
  dict.cancel = 0;
}
