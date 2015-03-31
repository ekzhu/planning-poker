// Show votes from all non-observer players AND players who are observer but voted
Template.stage.players = function () {
  return Players.find(
    {$or: [
      {room: Current.roomId(), observer: false},
      {room: Current.roomId(), observer: true, voted: true}]
    },
    {sort: {name: 1}});
};

Template.stage.events({
  'click input.clear-votes': function() {
      Players.find({room: Current.roomId()}).forEach(function(player) {
        Players.update(player._id, {$set: {vote: NullCard, voted: false}});
      });
      var player = Players.findOne(Current.plannerId());
      Messages.update(Current.messageId(), {$set: {content: player.name + " cleared all votes."}});
  }
});

Template.stage.everyone_voted = AllVoted;