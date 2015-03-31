/*global Meteor:false, Template:false, Session:false, _:false, amplify:false */

var extractRoomFromUrl = function () {
  var path = window.location.pathname,
      start = 0,
      end;
  if (path[0] === '/') {
    start = 1;
  }
  if (path[path.length-1] === '/') {
    end = -1;
  }
  return path.slice(start, end);
};

// Only when all non-observer players voted this is true
AllVoted = function() {
  var nonObserverNotVoted = Players.find({voted: false, observer: false, room: Current.roomId()});
  var nonObserverPlayers = Players.find({observer: false, room: Current.roomId()});
  if (nonObserverNotVoted.count() > 0 || nonObserverPlayers.count() == 0) {
      return false;
  }
  return true;
};

Meteor.startup(function () {
    // var joinBox = $('#join-box');
    // var player = Players.findOne(Current.plannerId());
    // if (player) {
    //   joinBox.find('#room-name-input').val(extractRoomFromUrl());
    //   joinBox.find('#player-name-input').val(player.name);
    // }
});