/* If you're feeling fancy you can add interactivity 
    to your site with Javascript */

// prints "hi" in the browser's dev tools console
console.log("hi");

window.onload = function() {
  console.log("doing shiz");
  var responsetext = loadFile("response.txt")
  document.getElementById("responsetxt").innerHTML = responsetext;
  jsonobjmake(responsetext)
};

function loadFile(filepath){
  var result = null;
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", filepath, false);
  xmlhttp.send();
  if (xmlhttp.status==200){
    result = xmlhttp.responseText;
  }
  return result;
}

function jsonobjmake(text){
  var obj = JSON.parse(text)
  console.log(obj)
  console.log(obj[0].full_text)
  document.getElementById("responsetxt").innerHTML = obj[0].full_text;
}