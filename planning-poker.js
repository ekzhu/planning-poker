// Set up a collection to contain player information. On the server,
// it is backed by a MongoDB collection named "players".

Players = new Meteor.Collection("players");
Cards = new Meteor.Collection("cards");

CardNames = ['0', '1/2', '1', '2', '3', '5', '8', '13', '20', '40', '100', '?'];
CardValues = [0, 1/2, 1, 2, 3, 5, 8, 13, 20, 40, 100, -1];
NullCard = {name: "Empty", value: -1000};

function getAllPlayers() {
    return Players.find({}, {sort: {name: 1}});
};

if (Meteor.isClient) {
  
  Session.set("current_player", null);
  Session.set("current_card", null);
  
  Template.stage.players = getAllPlayers();
  
  Template.stage.events({
    'click input.clear-votes': function() {
        Players.update({}, {$set: {vote: NullCard, voted: false}}, {multi: true});
    }
  });
  
  Template.stage.everyone_voted = function() {
    if (Players.find({voted: false}).count() != 0 || Players.find().count() === 0) {
        return false;
    }
    return true;
  };
  
  Template.join_game.events({
    'click input.join': function(evt, tmpl) {
        var clientName = tmpl.find("#player-name-input").value;
        if (Players.find({name: clientName}).count() > 0) {
            alert("Player with the same name already exist!");
            return;
        }
        Players.insert({name: clientName, vote: NullCard, voted: false});
        Session.set("current_player", clientName);
        Session.set("current_card", null);
    }
  });
  
  Template.card_board.cards = function () {
    return Cards.find();
  };
  
  Template.card_board.events({
    'click input.vote': function (evt, tmpl) {
      var currentPlayerName = Session.get("current_player");
      Players.update({name: currentPlayerName}, {$set: {vote: this, voted: true}});
      Session.set("current_card", this.name);
    }
  });
  
  Template.card.selected = function() {
    return Session.equals("current_card", this.name) ? "selected" : '';
  };
  
  Template.current_players.players = getAllPlayers(); 
  
  Template.player.selected = function () {
    return Session.equals("current_player", this.name) ? "selected" : '';
  };
  
  Template.player.events({
    'click input.remove-player': function () {
        Players.remove(this);
    }
  });
}

// On server startup
if (Meteor.isServer) {
  Meteor.startup(function () {
    if (Cards.find().count() === 0) {
        for (var i = 0; i < CardValues.length; i++) {
            Cards.insert({name: CardNames[i], value: CardValues[i]});
        }
    }
  });
}
