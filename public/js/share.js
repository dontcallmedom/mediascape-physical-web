/*document.getElementById("share").addEventListener("click", function(ev) {
  navigator.mediascapeBroadcastURL("http://first:3000/c");
});*/

setTimeout(function() {
  navigator.mediascapeStartSession("http://myapp:3000/c");
}, 1000);
