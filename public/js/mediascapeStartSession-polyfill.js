navigator.mediascapeStartSession = function(url) {
    if (confirm("Do you want to share this app with nearby devices?")) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "http://localhost:3000/api/beacon");
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send("action=start&url=" + encodeURIComponent(url));
    }

    return {stop: function () {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "http://localhost:3000/api/beacon");
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send("action=stop");
    }};
};
