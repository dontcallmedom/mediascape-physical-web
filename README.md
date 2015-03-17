# Physical Web for Media Service Discovery

The [MediaScape Project](http://mediascapeproject.eu/) aims at enabling the seamless development of Web applications that span several devices, with a particular focus on rich media applications.

The [use cases it targets](http://mediascapeproject.eu/files/D2.1.pdf) include situations where a user watches a media on one screen and wants to add another device to that user experience.

This requires the ability for the application running on the first device to communicate with the second device. Because the MediaScape project builds on the Web, the natural mean of enrolling this second device in the user experience is through sharing a URL that represents the state of the app.

While the MediaScape project is exploring the whole space of device and service discovery to enable this type of enrolment, this repository explores what role the [Physical Web project](http://google.github.io/physical-web/) can play in this.

The Physical Web project enables sharing URLs principally over Bluetooth LE — it also describes URL sharing via local network technologies. These URLs can then be detected by nearby clients, the vision being that such a client could be integrated in browsers, making browsers aware of URLs a priori relevant to their local physical context.

While the Physical Web URL sharing over BLE is mostly considered through the use of dedicated and simple hardware beacons, more powerful devices (such as the ones considered as part of the multi-devices MediaScape user experiences) are naturally able to use the same technical specifications to broadcast URLs as needed.

In this prototype, a Web application that plays a video advertizes itself over BLE via a mock-up JavaScript API; a Physical Web-aware client can then connect to the Web application and be provided with a UI to control the video.

## Running the prototype

[Video of the prototype](https://www.youtube.com/watch?v=E3-qtM5_N80)

The prototype runs a node-based server on port 3000. The device on which the server runs represents the "first" screen; for commodity, that server also hosts the simplistic multi-device application `myapp`.

This server must run on a linux machine that supports Bluetooth 4.0. If there are more than one bluetooth device on the said machine, and the ones that supports Bluetooth 4.0 is not `hci0`, the server should be started with the environment variable `BLENO_HCI_DEVICE_ID=n` where `n` is the number of the hci device.

Because of limitations in the Bluetooth protocol, URLs that can shared over BLE cannot be longer than 21 bytes long (!); while a real deployment would use an URL shortener (such as the one provided by the Physical Web project), in the context of this prototype, we configure the server to recognize itself under the name `myapp` by editing the `/etc/hosts` file.

If the second screen runs from a separate device, that device must be made to resolve the `myapp` name correctly as well.

## Implementation notes

There is no JavaScript API available today to broadcast a URL over BLE.

The ongoing work in the [W3C Web Bluetooth Community Group](https://www.w3.org/community/web-bluetooth/) targets reading from Bluetooth devices, not emitting as one (central vs peripherical role in Bluetooth parlance).

Thus, this prototype uses a back-end service that builds on [the uri-beacon node module](https://github.com/don/node-uri-beacon) which lets the (Linux-only) device on which it is running beacon URLs.

That service itself is wrapped in a pseudo JavaScript API:
```javascript
var broadcast = navigator.mediascapeBroadcastURL('http://example.org/my/app');

// once no longer useful
broadcast.stop();
```

It would probably be worth exploring how much overlap there is with the whole notion of URL sharing as [documented by the WHATWG](https://wiki.whatwg.org/wiki/Sharing), which itself is a more focused approach to the late [Web Intents](http://webintents.org/).

### Security considerations

Right now, the API pretends to be asking for user permission; presumably, letting any random Web page broadcast any random URLs at any time is not a good idea.

In addition or instead of user consent, it might be worth looking into:
* requiring engagement gesture before broadcasting is possible
* time-boxing the broadcast
* limiting URLs that can be broadcasted to the same origin
* requiring https for broadcast