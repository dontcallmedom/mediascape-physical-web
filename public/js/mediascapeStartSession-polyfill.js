// heavily inspired from https://github.com/mfoltzgoogle/presentation-cast/blob/gh-pages/presentation_cast.js
(function() {
  ////////////////////////////////////////////////////////////////////////////
  // Bookkeeping for the polyfill.

  // Map from presentationUrlL|id to the corresponding PresentationSession.
  var presentationSessions_ = {};
  // Keeps track of the PresentationSession that is currently being started or
  // joined, to link up with listeners 
  var pendingSession_ = null;

  var ORIGIN_RE_ = new RegExp('https?://[^/]+');

  // @return {string} A random 8 character identifier.
  var generateId_ = function() {
    return (Math.round(Math.random() * 3221225472) + 1073741824).toString(16);
  };

  ////////////////////////////////////////////////////////////////////////////
  // Implementation of Presentation API at
  // http://webscreens.github.io/presentation-api/

  // Namespace for the Presentation API
  var presentation = {
    // Event handler for AvailableChangeEvent.
    onavailablechange: null,
    // Is always null on the controlling page.
    session: null
  };

  // Constructor for AvailableChangeEvent.
  // @param {boolean} available True if a screen is available, false otherwise.
  var AvailableChangeEvent = function(available) {
    this.bubbles = false;
    this.cancelable = false;
    this.available = available;
  };

  // Constructor for StateChangeEvent.
  var StateChangeEvent = function(state) {
    this.bubbles = false;
    this.cancelable = false;
    this.state = state;
  };

  // Requests the initiation of a new presentation.
  // @param {string} presentationUrl The URL of the document to present.
  // @param {string=} presentationId An optional id to assign the presentation.
  //     If not provided, a random one will be assigned.
  presentation.startSession = function(presentationUrl, presentationId) {
    var session = new PresentationSession(presentationUrl,
                                          presentationId || generateId_());
    return new Promise(function(resolve, reject) {
      var existingSession = presentationSessions_[session.key_];
      if (existingSession) {
        // User agent cannot have two sessions with identical URL+id.
        reject(Error('Session already running for ' + session.key_));
        return;
      }

      presentationSessions_[session.key_] = session;

        if (!confirm("Do you want to share this app with nearby devices?")) {
            reject(new DOMException("User denied permission", "AbortError"));
            return;
        }

      // Start BLE beacon
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "http://localhost:3000/api/beacon");
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.onload = function() {
            resolve(session);
        };
        xhr.send("action=start&url=" + encodeURIComponent(presentationUrl));
        xhr.onerror = function(e) {
            reject(new DOMException("Unable to start Bluetooth beacon: " + JSON.stringify(e), "OperationError"));
        };
    });
  };

  // Requests the PresentationSession for an existing presentation.
  // @param {string} presentationUrl The URL of the document being presented.
  // @param {string} presentationId The id of the presentation..
  presentation.joinSession = function(presentationUrl, presentationId) {
    var session = new PresentationSession(presentationUrl,
                                          presentationId || generateId_());
    return new Promise(function(resolve, reject) {
      var existingSession = presentationSessions_[session.key_];
      if (existingSession) {
        resolve(existingSession);
      } else {
        // TODO(mfoltz): Keep promise pending in case the session is discovered later.
        reject(Error('No session available for ' + session.key_));
      }
    });
  };

  // Constructor for PresentationSession.
  // @param {string} presentationUrl The URL of the presentation.
  // @param {string} presentationId The id of the presentation.
  var PresentationSession = function(presentationUrl, presentationId) {
    this.url = presentationUrl;
    this.id = presentationId;
    this.state = 'disconnected';
    this.onmessage = null;
    this.onstatechange = null;

    // Private properties.
    this.key_ = this.url + '|' + this.id;
    this.origin_ = ORIGIN_RE_.exec(this.url)[0];
  };

  // Posts a message to the presentation.
  // @param {string} message The message to send.
  PresentationSession.prototype.send = function(message) {
    if (this.state == 'connected') {
    } else {
    }
  };

  // Closes the presentation (by disconnecting from the underlying Cast
  // session).
  PresentationSession.prototype.close = function() {
    if (this.state == 'disconnected') {
      return;
    }
    this.state = 'disconnected';
    this.fireStateChange_();
  };

  // Bind polyfill.
  navigator.mediascapePresentation = presentation;
})();
