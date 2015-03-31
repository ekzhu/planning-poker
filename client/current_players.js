Template.current_players.players = function () {
    return Players.find({room: Current.roomId()}, {sort: {name: 1}});
};

Template.player.selected = function () {
  return Current.plannerId() == this._id ? "selected" : '';
};

Template.player.events({
  'click input.remove-player': function () {
      if (this._id == Current.plannerId()) {
        return;
      }
      Players.remove(this._id);
      Messages.update(Current.messageId(), {$set: {content: this.name + " left the planning."}});
  }
});
