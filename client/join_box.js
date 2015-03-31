// Methods 
var toSlug = function (txt) {
  var slug = txt.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-{2,}/g, '-');
  return slug.slice(slug[0] === '-' ? 1 : 0, slug[slug.length-1] === '-' ? -1 : undefined);
};

var guessFromSlug = function (slug) {
  return slug.replace(/-/g, ' ').replace(/\w\S*/g, function (t) { return t[0].toUpperCase() + t.substr(1); });
};

var addErrorToField = function (id, txt) {
  $(id).closest('.controls').append('<span class="help-block">' + txt + '</span>').closest('.control-group').addClass('error');
};

var removeErrorFromField = function (id) {
  $(id).closest('.control-group').removeClass('error').find('span').remove('span');
};

var validateJoin = function (playerName, createdRoomName, selectedRoomSlug) {
  removeErrorFromField('#player-name-input');
  if (!playerName) {
    addErrorToField('#player-name-input', "Please enter your name.");
    return false;
  }
  if (Players.findOne({name: playerName})) {
    addErrorToField('#player-name-input', "Player with the same name already exist!");
    return false;
  }
  removeErrorFromField('#room-name-input');
  if (!createdRoomName && !selectedRoomSlug) {
    addErrorToField('#room-name-input', "Please choose or enter a room name.");
    return false;
  }
  roomslug = toSlug(createdRoomName);
  if (Rooms.find({$or: [{name: createdRoomName},{slug: roomslug}]}).count() > 0) {
    addErrorToField('#room-name-input', "Room you are trying to create aleady exists: " + createdRoomName);
    return false;
  }
  if (selectedRoomSlug && !Rooms.findOne({slug: selectedRoomSlug})) {
    addErrorToField('#room-name-input', "Selected room doesn't seem to exist anymore.");
    return false;
  }
  return true;
};

var createNewPlayer = function (playerName, roomId) {
  return {name: playerName, vote: NullCard, voted: false, observer: false, room: roomId};
};

var createNewRoom = function (createdRoomName, roomSlug) {
  return {name: createdRoomName, slug: roomSlug};
}

var joinRoom = function (evt, tmpl) {
    var player = Players.findOne(Current.plannerId());
    if (player) {
      Players.remove(player._id);
    }
  
    var playerName = tmpl.find("#player-name-input").value;
    var createdRoomName = tmpl.find("#room-name-input").value;
    var selectedRoomSlug = Session.get('selected_room');
    if (!validateJoin(playerName, createdRoomName, selectedRoomSlug)) {
      return;
    }

    var _idOfRoom;
    var _idOfMessage;
    // If user select an existing room
    if (selectedRoomSlug) {
      var room = Rooms.findOne({slug: selectedRoomSlug});
      var message = Messages.findOne({room: room._id});
      Messages.update(message._id, {$set: {content: playerName + ' joined the planning'}});
      _idOfRoom = room._id;
      _idOfMessage = message._id;
    }
    else {
      // If user create a new room, did not select an existing room
      room = createNewRoom(createdRoomName, toSlug(createdRoomName))
      _idOfRoom = Rooms.insert(room);
      if (room.slug === '') {
        Rooms.update(_idOfRoom, {$set: {slug: _idOfRoom}});
      }
      _idOfMessage = Messages.insert({room: _idOfRoom, content: playerName + ' created the room: ' + createdRoomName})
    }
    
    var player = createNewPlayer(playerName, _idOfRoom);
    var _idOfPlayer = Players.insert(player);
    
    Current.reset({plannerId: _idOfPlayer, roomId: _idOfRoom, messageId: _idOfMessage});
};

var enterSubmit = function (e, t) {
  if (e.which === 13) {
    // Enter pressed.
    joinRoom(e, t);
  }
};

// Template items
Template.join_box.events({
  'click button.start': joinRoom,
  'keyup #player-name-input': enterSubmit,
  'keyup #room-name-input': function (e, t) {
    if (t.find('#room-name-input').value.length > 0) {
      Session.set('selected_room', null);
    }
    enterSubmit(e, t);
  }
});

Template.join_box.helpers({
  notJoined: function () {
    var sess = Current.get();
    return !sess
          || !Players.findOne(sess.plannerId) 
          || !Rooms.findOne(sess.roomId)
          || !Messages.findOne(sess.messageId);
  },

  anyRooms: function () {
    return Rooms.find().count() > 0;
  }
});

Template.existing_rooms.helpers({
  rooms: function () {
    return Rooms.find({}, {sort: {name: 1}});
  },
  selected: function () {
    return Session.equals('selected_room', this.slug);
  }
});

Template.existing_rooms.events({
  'change .existing': function (e, t) {
    var slug = $(t.find('.existing')).val();
    $('#room-name-input').val('');
    Session.set('selected_room', slug);
  }
});