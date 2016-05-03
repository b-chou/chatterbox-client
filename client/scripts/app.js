var friendList = [];
window.onload = function() {
  initUpdate();
  getRoomNames();
};

var buttonClicks = function() {
  $('ul#tabs li').click(function(e) {
    if (!$(this).hasClass('active')) {
      var tabNum = $(this).index();
      var nthChild = tabNum + 1;
      $('ul#tabs li.active').removeClass('active');
      $(this).addClass('active');
      $('ul#tab li.active').removeClass('active');
      $('ul#tab li:nth-child(' + nthChild + ')').addClass('active');
    }
  });
};

var newRoom = function() {
  var $newroom = $('#createRoom').val();
  var newTabs = $('#tabs').append('<li>' + $newroom + '</li>');
  var newTab = $('#tab').append('<li class=\'active\'><div id=\'chats\' name=\'' + $newroom + '\'>' + '</div></li>');
  $('#createRoom').val('');
  buttonClicks();
  $.post('https://api.parse.com/1/classes/messages', JSON.stringify({text: 'opened up new room', username: '\?\?', roomname: $newroom}));
};

var initUpdate = function() {
  setInterval(function() {
    var currentTab = $('.active #chats').attr('name');
    console.log('Switched to ', currentTab);
    $.get('https://api.parse.com/1/classes/messages', function(data) {
      $('.active #chats').empty();
      var count = 0;
      var i = 0;
      while (i < 100 && count < 10) {
        try {
          if (JSON.stringify(data.results[i]) && JSON.stringify(data.results[i].username) && JSON.stringify(data.results[i].text) && JSON.stringify(data.results[i].roomname) && escapeRegExp(data.results[i].roomname) === currentTab) {
            var username = data.results[i].username;
            var newMsg = '<div class="msg"><button class=\'tab\' onclick="addFriend(\'' + username + '\')"><b>' 
            + escapeRegExp(username) + '</button>: </b>';
            if (friendList.indexOf(username) !== -1) {
              newMsg += '<b>' + escapeRegExp(data.results[i].text) + '</b></div><br>';
            } else {
              newMsg += escapeRegExp(data.results[i].text) + '</div><br>';
            }
            $('.active #chats').append(newMsg);
            count++;
          }
        } catch (err) {
        }
        i++;
      }
    });
  }, 100);  
};

var addFriend = function(friend) {
  if (friendList.indexOf(friend) === -1) {
    friendList.push(friend);
  }
};

var getRoomNames = function () {
  var names = [];
  $.get('https://api.parse.com/1/classes/messages', function(data) {
    $('#tab').empty();
    $('#tabs').empty();
    for (var i = 1; i < data.results.length; i++) {
      if (JSON.stringify(data.results[i].roomname)) {
        if (names.indexOf(JSON.stringify(data.results[i].roomname).replace(/\"/g, '')) === -1) {
          names.push(JSON.stringify(data.results[i].roomname).replace(/\"/g, ''));
          $('#tabs').append('<li>' + JSON.stringify(data.results[i].roomname).replace(/\"/g, '') + '</li>');
          $('#tab').append('<li><div id=\'chats\' name=\'' + data.results[i].roomname + '\'>' + '</div></li>');
        }
      }
    }
    buttonClicks();
  });
};

var getMessage = function() {
  var message = {};
  message.text = $('#message').val();
  $('#message').val('');
  message.username = '';
  message.roomname = $('.active #chats').attr('name');
  var flag = false;
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


