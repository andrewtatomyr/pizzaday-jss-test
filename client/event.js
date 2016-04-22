var eventHelper= function(selectedGroup) { //returnObjectWithEventStatus
  if (!selectedGroup) return undefined;

  var groupEvent= Events.findOne({"group": selectedGroup}); //just one active event in group (other dropped)
  if (!groupEvent) { //noActiveEventInGroup
    return {isActiveEvent: false}
  }

  var user= Participants.findOne({
    "group": selectedGroup,
    "name": Meteor.user().profile.name
  });
  var userStatusNote= user.orderStatus==="confirmed"?
    "Your Order Was Placed": //onUserConfirmParticipation
    user.orderStatus==="discarded"? "You Refused To Participate": //onUserDicardParticipation
    ""; //onUndefinedStatus
  return {
    _id: groupEvent._id,
    isActiveEvent: true,
    eventStatus: groupEvent.eventStatus,
    isOrdering: groupEvent.eventStatus==="ordering"? "checked": "",
    isOrdered: groupEvent.eventStatus==="ordered"? "checked": "",
    isDelivering: groupEvent.eventStatus==="delivering"? "checked": "",
    isDelivered: groupEvent.eventStatus==="delivered"? "checked": "",
    eventDate: groupEvent.eventDate,
    eventParticipants: groupEvent.eventParticipants,
    userOrder: user.order,
    userOrderStatus: user.orderStatus,
    userStatusNote: userStatusNote
  }
}



Template.eventPizzaDayControls.helpers({
  ePD: function() { //event'PizzaDay'Status
    return eventHelper(Session.get("selectedGroup"));
  }
});
Template.eventPizzaDayControls.events({
  "click .createEvent": function() { //createEvent
    var selectedGroup= Session.get("selectedGroup");
    var eventDate= new Date();
    eventDate= eventDate.toISOString().slice(0,10);
    Meteor.call("createEvent", selectedGroup, eventDate)
  },
  "submit form": function(event) { //updateEvent
    event.preventDefault();
    var eventDate= event.target.eventDate.value;
    var selectedGroup= Session.get("selectedGroup");
    var eventStatus= event.target.eventStatus.value;
    if (eventStatus==="delivered" && confirm("Finish Event?")) {
      Meteor.call("finishEvent", selectedGroup);
    } else {
      Meteor.call("updEvent", selectedGroup, eventDate, eventStatus);
    }
  }
});




Template.eventPizzaDay.helpers({
  ePD: function() {
    return eventHelper(Session.get("selectedGroup"));
  }
});
Template.eventPizzaDay.events({
  "click .inc": function() {
    var selectedGroup= Session.get("selectedGroup");
    Meteor.call("incItemCount", selectedGroup, this.itemId);
  },
  "click .del": function() {
    var selectedGroup= Session.get("selectedGroup");
    Meteor.call("delItemFromOrder", selectedGroup, this.itemId);
  },
  "click .confirmOrder": function() {
    var selectedGroup= Session.get("selectedGroup");
    Meteor.call("finishOrder", selectedGroup, "confirmed");
  },
  "click .discardParticipation": function() {
    var selectedGroup= Session.get("selectedGroup");
    Meteor.call("finishOrder", selectedGroup, "discarded");
  }
});
