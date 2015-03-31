// Session dictionary for user
SessionAmplify = _.extend({}, Session, {
  keys: _.object(_.map(amplify.store(), function(value, key) {
    return [key, JSON.stringify(value)];
  })),
  set: function (key, value) {
    Session.set.apply(this, arguments);
    amplify.store(key, value);
  }
});

// Current session interface for user
Current = {
  roomId: function (roomId) {
    if (roomId !== undefined) {
      SessionAmplify.set("current_room_id", roomId);
    } else {
      roomId = SessionAmplify.get("current_room_id");
    }
    return roomId;
  },
  plannerId: function (plannerId) {
    if (plannerId !== undefined) {
      SessionAmplify.set("current_player_id", plannerId);
    } else {
      plannerId = SessionAmplify.get("current_player_id");
    }
    return plannerId;
  },
  messageId: function (messageId) {
    if (messageId !== undefined) {
      SessionAmplify.set("current_message_id", messageId);
    } else {
      messageId = SessionAmplify.get("current_message_id");
    }
    return messageId;
  },
  reset: function(ids) {
    if (ids == undefined) {
      SessionAmplify.set("current_room_id", null);
      SessionAmplify.set("current_player_id", null);
      SessionAmplify.set("current_message_id", null); 
    } 
    else {
      SessionAmplify.set("current_player_id", ids.plannerId);
      SessionAmplify.set("current_room_id", ids.roomId);
      SessionAmplify.set("current_message_id", ids.messageId);
    }
  },
  get: function() {
    var ids = {
      plannerId: SessionAmplify.get("current_player_id"),
      roomId: SessionAmplify.get("current_room_id"),
      messageId: SessionAmplify.get("current_message_id")
    };
    if (ids.plannerId && ids.roomId && ids.messageId) {
      return ids;
    }
    return null;
  }
};