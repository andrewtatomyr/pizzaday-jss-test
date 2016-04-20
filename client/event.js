
class EventHelpers {
  /*constructor() {

  }
  isActiveEvent(selectedGroup) {
    //var selectedGroup= Session.get("selectedGroup");
    var groupEvent= Events.findOne({"group": selectedGroup});
    console.log("~isActiveEvent", selectedGroup);
    return groupEvent? true: false;
  }*/

  ePD(selectedGroup) {
    //var selectedGroup= Session.get("selectedGroup");
    var groupEvent= Events.findOne({"group": selectedGroup}); //just one active event (other dropped)
    var user= Participants.findOne({
      "group": selectedGroup,
      "name": Meteor.user().profile.name
    });
    console.log("~ePD", selectedGroup);
    var userStatusNote= user.orderStatus==="confirmed"?
      "Your Order Was Placed":
      user.orderStatus==="discarded"? "You Refused To Participate":
    "";
    //console.log(userStatusNote);

    return {
      _id: groupEvent._id,
      //new:
      isActiveEvent: groupEvent? true: false,
      eventStatus: groupEvent.eventStatus,

      isOrdering: groupEvent.eventStatus==="ordering"? "checked": "",
      isOrdered: groupEvent.eventStatus==="ordered"? "checked": "",
      isDelivering: groupEvent.eventStatus==="delivering"? "checked": "",
      isDelivered: groupEvent.eventStatus==="delivered"? "checked": "",
      eventDate: groupEvent.eventDate,
      eventParticipants: groupEvent.eventParticipants

      , userOrder: user.order //new
      , userOrderStatus: user.orderStatus //new
      , userStatusNote: userStatusNote //new?
    }
  }

}
eventHelpers= new EventHelpers();
/*eventHelpers.prototype.isActiveEvent= function() {
  var selectedGroup= Session.get("selectedGroup");
  var groupEvent= Events.findOne({"group": selectedGroup});
  return groupEvent? true: false;
}*/
//console.log("~~>");
//console.log(Events.findOne({"group": selectedGroup}));

Template.eventPizzaDayControls.helpers({
  /*"isActiveEvent": function() {
    return eventHelpers.isActiveEvent(Session.get("selectedGroup"));
  }, /*function() {
    var selectedGroup= Session.get("selectedGroup");
    var groupEvent= Events.findOne({"group": selectedGroup});
    return groupEvent? true: false;
  },*/
  "ePD": function() {
    return eventHelpers.ePD(Session.get("selectedGroup"));
  } /*function() {
    var selectedGroup= Session.get("selectedGroup");
    var groupEvent= Events.findOne({"group": selectedGroup}); //just one active event (other dropped)


    return {
      _id: groupEvent._id,
      isOrdering: groupEvent.eventStatus==="ordering"? "checked": "",
      isOrdered: groupEvent.eventStatus==="ordered"? "checked": "",
      isDelivering: groupEvent.eventStatus==="delivering"? "checked": "",
      isDelivered: groupEvent.eventStatus==="delivered"? "checked": "",
      eventDate: groupEvent.eventDate,
      eventParticipants: groupEvent.eventParticipants
    }
  }*/
});
Template.eventPizzaDayControls.events({
  "click .createEvent": function() { //createEvent
    //alert(`createEvent`)
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
    console.log("submit form->",eventDate, eventStatus);

    if (eventStatus==="delivered" && confirm("finish event?")) {
      //...

      Meteor.call("finishEvent", selectedGroup);
    } else {

      Meteor.call("updEvent", selectedGroup, eventDate, eventStatus);
    }
  }
});




Template.eventPizzaDay.helpers({
  //duplicate:
  /*"isActiveEvent": function() {
    return eventHelpers.isActiveEvent(Session.get("selectedGroup"));
  }, /*function() {
    var selectedGroup= Session.get("selectedGroup");
    var groupEvent= Events.findOne({"group": selectedGroup});
    return groupEvent? true: false;
  },*/
  //duplicate:
  "ePD": function() {
    return eventHelpers.ePD(Session.get("selectedGroup"));
  } /*function() {
    var selectedGroup= Session.get("selectedGroup");
    var groupEvent= Events.findOne({"group": selectedGroup}); //just one active event (other dropped)
    var user= Participants.findOne({
      "group": selectedGroup,
      "name": Meteor.user().profile.name
    });

    var userStatusNote= user.orderStatus==="confirmed"?
      "Your Order Was Placed":
      user.orderStatus==="discarded"? "You Refused To Participate":
    "";
    //console.log(userStatusNote);

    return {
      _id: groupEvent._id,
      //new:
      eventStatus: groupEvent.eventStatus,

      isOrdering: groupEvent.eventStatus==="ordering"? "checked": "",
      isOrdered: groupEvent.eventStatus==="ordered"? "checked": "",
      isDelivering: groupEvent.eventStatus==="delivering"? "checked": "",
      isDelivered: groupEvent.eventStatus==="delivered"? "checked": "",
      eventDate: groupEvent.eventDate,
      eventParticipants: groupEvent.eventParticipants

      , userOrder: user.order //new
      , userOrderStatus: user.orderStatus //new
      , userStatusNote: userStatusNote //new?
    }
  },
  /*"isSomeItemsInOrder": function() {
    var userOrder=
  }*/
});
Template.eventPizzaDay.events({
  "click .inc": function() {
    var selectedGroup= Session.get("selectedGroup");

    console.log(this);
    Meteor.call("incItemCount", selectedGroup, this.itemId);
    //return groupEvent? true: false;
  },
  "click .del": function() {
    var selectedGroup= Session.get("selectedGroup");

    console.log(this);
    Meteor.call("delItemFromOrder", selectedGroup, this.itemId);
    //return groupEvent? true: false;
  },
  "click .confirmOrder": function() {
    var selectedGroup= Session.get("selectedGroup");
    Meteor.call("finishOrder", selectedGroup, "confirmed");
    //console.log(this);
    //Meteor.call("confirmOrder", selectedGroup);
    //return groupEvent? true: false;
  },
  "click .discardParticipation": function() {
    var selectedGroup= Session.get("selectedGroup");
    Meteor.call("finishOrder", selectedGroup, "discarded");

    //console.log(this);
    //Meteor.call("discardParticipation", selectedGroup);
    //return groupEvent? true: false;
  }
});
