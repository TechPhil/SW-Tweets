window.onload = updateText(); //On load, check for latest updates
setInterval(updateText, 10000); //Check every 10 seconds

function updateText() { //Check response.txt for updates
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
  var obj = JSON.parse(text);
  console.log(obj);
  console.log(obj[0].full_text);
  console.log(obj[0].created_at);
  document.getElementById("responsetxt").innerHTML = obj[0].full_text;
  document.getElementById("responsetime").innerHTML = obj[0].created_at.slice(
    0,
    -11
  );
  if (obj[0].in_reply_to_status_id) {
    console.log("IN REPLY");
    document.getElementById("replydiv").style.display = "block";
    var replytext = loadFile("reply.txt");
    var replyobj = JSON.parse(replytext);
    document.getElementById("replytext").innerHTML =
      "In reply to tweet from @" +
      replyobj.user.screen_name +
      " - " +
      replyobj.full_text;
  } else {
    document.getElementById("replydiv").style.display = "none";
  }
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
