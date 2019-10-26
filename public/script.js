/* If you're feeling fancy you can add interactivity 
    to your site with Javascript */

// prints "hi" in the browser's dev tools console
console.log("hi");

window.onload = function() {
  console.log("doing shiz");
  var responsetext = document.getElementById("responsefile").innerHTML
  document.getElementById("responsetxt").innerHTML = responsetext;
};

function loadFile(filepath){
  var result = null;
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET")
}