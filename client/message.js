Template.message.message = function() {
  return Messages.findOne({room: Current.roomId()});
};
