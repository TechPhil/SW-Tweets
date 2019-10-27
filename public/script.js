window.onload = updateText(); //On load, check for latest updates
setInterval(updateText, 10000); //Check every 10 seconds

function updateText() {
  //Check response.txt for updates
  updateCounts();
  var responsetext = loadFile("response.txt"); //Load response.txt
  document.getElementById("responsetxt").innerHTML = responsetext; //Placeholder - set element to contain raw response.
  jsonobjmake(responsetext); //Make text into JSON object for easy manipulation
}

//Make GET Requests to text files - server-client comms
function loadFile(filepath) {
  var result = null;
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", filepath, false);
  xmlhttp.send();
  if (xmlhttp.status == 200) {
    result = xmlhttp.responseText;
  }
  return result;
}

function jsonobjmake(text) {
  //Parses JSON text into an object for easy handling.
  var obj = JSON.parse(text); //Parse into object
  console.log(obj); //Log object in console for debug
  console.log(obj[0].full_text); //Log tweet body into console
  console.log(obj[0].created_at); //Log tweet timestamp into console.
  document.getElementById("responsetxt").innerHTML = obj[0].full_text; //Places tweet body on screen
  document.getElementById("responsetime").innerHTML = obj[0].created_at.slice(
    0,
    -11
  ); //Cut last 11 characters off timestamp, then place on page.
  if (obj[0].in_reply_to_status_id) {
    //Check if tweet is replying to a different tweet
    inReply();
  } else {
    document.getElementById("replydiv").style.display = "none"; //Hide reply elements
  }
}

function inReply() {
  document.getElementById("replydiv").style.display = "block"; //Make reply elements visible
  var replytext = loadFile("reply.txt"); //Load reply tweet data
  var replyobj = JSON.parse(replytext); //Parse into object
  document.getElementById("replytext").innerHTML =
    "In reply to tweet from @" +
    replyobj.user.screen_name +
    " - " +
    replyobj.full_text; //Set element to display correct text.
}


const searchList = document.getElementById("search");
const searchForm = document.forms[0];
const searchInput = searchForm.elements["search"];

const appendNewSearch = function(search) {
  const newSearchItem = document.createElement("li");
  newSearchItem.innerHTML = search;
  searchList.appendChild(newSearchItem);
};

//searchterms.forEach(function(search) {
//appendNewSearch(search);
//});

searchForm.onsubmit = function(event) {
  event.preventDefault();

  const data = { search: searchInput.value };

  fetch("/editSearch", {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" }
  })
    .then(response => response.json())
    .then(data => {
      console.log(JSON.stringify(data));

      appendNewSearch(data.search);

      searchInput.value = "";
      searchInput.focus();
    });
};

function updateCounts(){
  var dcount = document.getElementById("delayno");
  var lcount = document.getElementById("lateno");
  var ccount = document.getElementById("cancelno");
  var dictfile = loadFile("searchterms.txt");
  var obj = JSON.parse(dictfile);
  dcount.innerHTML = obj.delay;
  lcount.innerHTML = obj.late;
  ccount.innerHTML = obj.cancel;
}
