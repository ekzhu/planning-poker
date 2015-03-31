// Set up a collection to contain player information. On the server,
// it is backed by a MongoDB collection named "players".

// All players
Players = new Meteor.Collection("players");
// A static collection of cards
// I'd like to use datastore instead of static array because we might need to update them in the future.
Cards = new Meteor.Collection("cards");
// Store messages for each room
Messages = new Meteor.Collection("messages");
// Have rooms to allow for concurrent planning sessions on one server.
Rooms = new Meteor.Collection('rooms');

// Used to initialize cards
CardNames  = ['0', '1/2', '1', '2', '3', '5', '8', '13', '20', '40', '100', '?'];
CardValues = [ 0,   1/2,   1,   2,   3,   5,   8,   13,   20,   40,   100,  1000 ];
NullCard = {name: "Empty", value: -1000};