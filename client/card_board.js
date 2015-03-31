Template.card_board.cards = function () {
  return Cards.find({}, {sort: {value: 1}});
};

Template.card_board.events({
  'click input.vote': function (evt, tmpl) {
    if (!AllVoted()) {
        Players.update(Current.plannerId(), {$set: {vote: this, voted: true}});
    }
  }
});

Template.card.selected = function() {
  var player = Players.findOne(Current.plannerId());
  return player && player.vote.name == this.name ? 'selected' : '';
};