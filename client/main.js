Template.main.hasJoined = function () {
  var sess = Current.get();
  return sess
        && Players.findOne(sess.plannerId) 
        && Rooms.findOne(sess.roomId)
        && Messages.findOne(sess.messageId);
};

Template.title.roomName = function () {
  var room = Rooms.findOne(Current.roomId());
  return room ? room.name : 'Unknown';
};