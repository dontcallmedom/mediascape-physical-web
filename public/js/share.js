document.getElementById('share').addEventListener('click', function () {
  var presentationRequest = new w3cPresentationRequest('http://myapp:3000/c');
  presentationRequest.start().then(function (connection) {
    connection.onstatechange = function () {
      console.log('presentation connection state changed to "' + connection.state + '"');
    };
    console.log(connection);
  });
});
