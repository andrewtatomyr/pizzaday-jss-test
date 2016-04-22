Meteor.publish("users", function() {
  if (this.userId) return Meteor.users.find();
});
Meteor.publish("groups", function() {
  return Groups.find();
});
Meteor.publish("participants", function() {
  if (this.userId) return Participants.find();
});
Meteor.publish("menu", function() {
  if (this.userId) return Menu.find();
});
Meteor.publish("events", function() {
  if (this.userId) return Events.find();
});
