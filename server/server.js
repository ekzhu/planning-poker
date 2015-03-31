Meteor.startup(function () {
    if (Cards.find().count() === 0) {
        for (var i = 0; i < CardValues.length; i++) {
            Cards.insert({name: CardNames[i], value: CardValues[i]});
        }
    }
    Rooms.remove({url: ''});
});