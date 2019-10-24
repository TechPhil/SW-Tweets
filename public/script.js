/* If you're feeling fancy you can add interactivity 
    to your site with Javascript */

// prints "hi" in the browser's dev tools console
console.log("hi");

const fs = require('fs');
setTimeout(function(){
  var text = fs.readFileSync("response.txt");
document.getElementById("responsetext").innerHTML = "text";
},1000)

