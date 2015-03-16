var controlEvents = new EventSource("/sharedcontrols");
var player = document.getElementById("player");

controlEvents.addEventListener("control",  function(e) {
    if (e.data === "play") {
        player.play();
    } else if (e.data === "pause") {
        player.pause();
    }
});