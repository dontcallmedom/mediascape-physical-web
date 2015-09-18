var express = require("express"),
    app = express(),
    http = require('http').Server(app),
    beacon;
var bodyParser = require('body-parser');
var EventEmitter = require('events').EventEmitter;
var emitter = new EventEmitter();


app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

emitter.setMaxListeners(0);

// This implements quickly the shared control logic
// this would be done using SharedState or SharedMotion in a real mediascape app
app.post('/sharedcontrols', function(req, res) {
    emitter.emit("control", req.body.action);
    res.end();
});

app.get('/sharedcontrols', function(req, res) {
    res.setHeader("Content-Type", 'text/event-stream');
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.writeHead(200);
    // avoid timeout
    setInterval(function() { res.write(":\n"); }, 30000);
    emitter.on("control", function(action) {
	res.write("event: control\n");
        res.write("data: " + action + "\n\n");
    });
});


app.get('/c', function(req, res) {
    res.redirect('/control.html');
});

// this is the back-end for the pseudo JavaScript API to broadcast URL
app.post('/api/beacon', function(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    if (req.body.action === "start") {
        beacon = require('eddystone-beacon');
        beacon.advertiseUrl(req.body.url);
        res.end();
    } else if (req.body.action === "stop") {
        beacon = undefined;
        res.end();
    }
});


http.listen(3000, function() {
    console.log('listening on *:3000');
});
