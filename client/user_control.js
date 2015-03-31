Template.in_game.current_player = function () {
  var player = Players.findOne(Current.plannerId());
  return player ? player.name : '';
};

Template.in_game.isObserver = function() {
  var player = Players.findOne(Current.plannerId());
  return player ? player.observer : false;
};

Template.in_game.events({
  'click input.leave': function (evt, tmpl) {
    var player = Players.findOne(Current.plannerId());
    Messages.update(Current.messageId(), {$set: {content: player.name + " left the planning."}});
    Players.remove(player._id);
    if (Players.find({room: Current.roomId()}).count() === 0) {
      Rooms.remove(Current.roomId());
      Messages.remove(Current.messageId());
    }
    Current.reset();
  },
  'change input.observe': function (evt, tmpl) {
    Players.update(Current.plannerId(), {$set: {observer: evt.target.checked}});
  }
});
