var friendList = [];
window.onload = function() {
  initUpdate();
  getRoomNames();
};

var newRoom = function() {
  var $newroom = $('#createRoom').val();
  var option = $('<option>' + ($newroom) + '</option>');
  $('#roomSelect').append(option);
  $('#createRoom').val('');
  option.prop('selected', true);
};

var initUpdate = function() {
  setInterval(function() {
    var room = $('#roomSelect option:selected')[0].text || undefined;
    $.get('https://api.parse.com/1/classes/messages', function(data) {
      $('#chats').empty();
      var count = 0;
      var i = 0;
      while (i < 100 && count < 10) {
        try {
          if (JSON.stringify(data.results[i])) {
            if (JSON.stringify(data.results[i].username) && JSON.stringify(data.results[i].text) && JSON.stringify(data.results[i].roomname)) {
              if (escapeRegExp(data.results[i].roomname) === room && escapeRegExp(data.results[i].text).length !== 0) {
                var username = data.results[i].username;

                // add a button event listener to the nametag of each user, click it to become friends
                var newMsg = '<div class="msg"><button onclick="addFriend(\'' + username + '\')"><b>' 
                + escapeRegExp(data.results[i].username) + '</button>:</b> <br>';

                // bolds messages of users who are friends
                if (friendList.indexOf(username) !== -1) {
                  newMsg += '<b>' + escapeRegExp(data.results[i].text) + '</b></div><br>';
                } else {
                  newMsg += escapeRegExp(data.results[i].text) + '</div><br>';
                }
                $('#chats').append(newMsg);
                count++;
              }
            }
          }
        } catch (err) {
        }
        i++;
      }
    });
  }, 1000);  
};

var addFriend = function(friend) {
  if (friendList.indexOf(friend) === -1) {
    friendList.push(friend);
  }
};

var getRoomNames = function () {
  var names = [];
  $.get('https://api.parse.com/1/classes/messages', function(data) {
    $('#roomSelect').empty();
    for (var i = 1; i < data.results.length; i++) {
      if (JSON.stringify(data.results[i].roomname)) {
        if (names.indexOf(JSON.stringify(data.results[i].roomname).replace(/\"/g, '')) === -1) {
          names.push(JSON.stringify(data.results[i].roomname).replace(/\"/g, ''));
          $('#roomSelect').append('<option>' + JSON.stringify(data.results[i].roomname).replace(/\"/g, '') + '</option>');
        }
      }
    }
  });
};

var getMessage = function() {
  var message = {};
  message.text = $('#message').val();
  $('#message').val('');
  message.username = '';
  message.roomname = $('#roomSelect option:selected')[0].text;
  for (var i = document.URL.length - 1; i > 0; i--) {
    if (document.URL[i] === '=') {
      break;
    } else {
      message.username += document.URL[i];
    } 
  }
  message.username = message.username.split('').reverse().join('');
  $.post('https://api.parse.com/1/classes/messages', JSON.stringify(message));
};

var escapeRegExp = function(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
};