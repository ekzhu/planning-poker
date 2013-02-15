// Set up a collection to contain player information. On the server,
// it is backed by a MongoDB collection named "players".

// All players
Players = new Meteor.Collection("players");
// A static collection of cards
// I'd like to use datastore instead of static array because we might need to update them in the future.
Cards = new Meteor.Collection("cards");
// Store messages for each room
Messages = new Meteor.Collection("messages");
// At the moment, room functionality is not in place. So we use the only room globally.
CurrRoom = 1;

// Used to initialize cards
CardNames = ['0', '1/2', '1', '2', '3', '5', '8', '13', '20', '40', '100', '?'];
CardValues = [0, 1/2, 1, 2, 3, 5, 8, 13, 20, 40, 100, -1];
NullCard = {name: "Empty", value: -1000};

function getAllPlayers() {
    return Players.find({}, {sort: {name: 1}});
};

// Refactor needed
// We should separate client and server, and put functions in common module
if (Meteor.isClient) {
  
  // Each player's own session, reset at loading page
  Session.set("current_player", null);
  
  Template.stage.players = getAllPlayers();
  
  Template.stage.events({
    'click input.clear-votes': function() {
        Players.update({}, {$set: {vote: NullCard, voted: false}}, {multi: true});
        Messages.update({room: CurrRoom}, {$set: {content: Session.get("current_player") + " cleared all votes."}});
    }
  });
  
  Template.stage.everyone_voted = function() {
    if (Players.find({voted: false}).count() != 0 || Players.find().count() === 0) {
        return false;
    }
    return true;
  };
  
  Template.message.message = function() {
    return Messages.findOne({room: CurrRoom});
  };
  
  Template.join_game.events({
    'click input.join': function(evt, tmpl) {
        var clientName = tmpl.find("#player-name-input").value;
        if (Players.find({name: clientName}).count() > 0) {
            alert("Player with the same name already exist!");
            return;
        }
        if (!clientName) {
          alert("Please enter your name!");
          return;
        }
        Players.insert({name: clientName, vote: NullCard, voted: false});
        Messages.update({room: CurrRoom}, {$set: {content: clientName + " joined the game."}});
        Session.set("current_player", clientName);
    }
  });
  
  Template.join_game.curr_joined = function() {
    return Session.get("current_player") != null ? false : true;
  };
  
  Template.card_board.cards = function () {
    return Cards.find();
  };
  
  Template.card_board.events({
    'click input.vote': function (evt, tmpl) {
      var currentPlayerName = Session.get("current_player");
      Players.update({name: currentPlayerName}, {$set: {vote: this, voted: true}});
    }
  });
  
  Template.card.selected = function() {
    var player = Players.findOne({name: Session.get("current_player")});
    if (player) {
      return player.vote.name == this.name ? 'selected' : '';
    }
    return '';
  };
  
  Template.current_players.players = getAllPlayers(); 
  
  Template.player.selected = function () {
    return Session.equals("current_player", this.name) ? "selected" : '';
  };
  
  Template.player.events({
    'click input.remove-player': function () {
        Players.remove(this);
        Messages.update({room: CurrRoom}, {$set: {content: this.name + " left the game."}});
        if (Session.get("current_player") == this.name) {
          Session.set("current_player", null);
        }
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
    if (Messages.find().count() === 0) {
      // Insert the first message for a given room
      Messages.insert({content: "Welcome to Planning Poker!", room: CurrRoom});
    }
  });
}
