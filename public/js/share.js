/*document.getElementById("share").addEventListener("click", function(ev) {
  navigator.mediascapeBroadcastURL("http://first:3000/c");
});*/

setTimeout(function() {
    var pSession =navigator.mediascapePresentation.startSession("http://myapp:3000/c");
    console.log(pSession);
}, 1000);
