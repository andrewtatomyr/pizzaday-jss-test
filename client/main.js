//import { }
//import { Session } from 'meteor/session';




Meteor.subscribe("users");
Meteor.subscribe("groups");
///Session.setDefault("selectedGroup", "--");//?
Meteor.subscribe("participants"/*, Session.get("selectedGroup") */);
Meteor.subscribe("menu"/*, Session.get("selectedGroup") */);
Meteor.subscribe("events");




Template.afterSignIn.helpers({ //container
  "signedClass": function() {
    return Meteor.userId()? "": "hidden";
  }
});




Template.groups.helpers({
  "group": function() {
    return Groups.find();
    //Meteor.users.findOne({})
  },
  "currentUser": function() {
    if ( Meteor.user() ) return Meteor.user().profile.name;
    //Meteor.users.findOne({})
  },
  /*
  "selectedGroup": function() { //???
    var selectedGroup= Session.get("selectedGroup");
    console.log("selectedGroup: "+selectedGroup);
    return selectedGroup
  },
  */
  "selectedClass": function() {

    var selectedGroup= Session.get("selectedGroup");
    //var _selectedGroup= selectedGroup;
    var groupName= this.groupName; //?
    //console.log(groupName+"?=="+selectedGroup);
    return (groupName==selectedGroup)? "selected": "";
  }
});
Template.groups.events({
  "click .group": function(event) { //selectGroup
    var selectedGroup= event.target.textContent
    Session.set("selectedGroup", selectedGroup);
    //console.log(selectedGroup);
    //<<//
    //console.log("we select >> "+event.target.innerText);
  },
  "click #groupName": function() { //selectNewGroup
    //var selectedGroup= event.target.textContent
    Session.set("selectedGroup", "");
    //console.log(selectedGroup);
    //<<//
    //console.log("we select >> "+event.target.innerText);
  },
  "submit form": function(event) { //createGroup
    event.preventDefault();
    //>>// var groupName= event.target.groupName.value;
    //>>// alert(groupName)

    //>>// Meteor.call("addGroup", groupName);
    //>>// Session.set("selectedGroup", groupName);
    var selectedGroup= event.target.groupName.value;
    console.log(selectedGroup);
    console.log(Groups.findOne({"groupName": selectedGroup}));

    if ( Groups.findOne({"groupName": selectedGroup}) ) {
      alert("Group with same name already exists! Set another name please");
    } else {
      Session.set("selectedGroup", selectedGroup);
      Meteor.call("createGroup", selectedGroup);

    }


    //<<//
  }

});




Template.groupControls.helpers({ //container
  "participantClass": function() { //visible only for participants
    var selectedGroup= Session.get("selectedGroup");
    if (selectedGroup) {
      var thisUser= Meteor.user();
      if (thisUser) {
        var thisUserInGroup= Participants.findOne({
          "name": thisUser.profile.name,
          "group": selectedGroup
        });
      }

    }
    return selectedGroup && thisUser && thisUserInGroup? "": "hidden";
  },
  "creatorClass": function() { //viible only for group creator
    var selectedGroup= Session.get("selectedGroup");
    if (selectedGroup) {
      var groupCreator= Groups.findOne({"groupName": selectedGroup}).creator;
      var thisUser= Meteor.user();
      console.log("private: "+groupCreator);
    }

    return selectedGroup && thisUser && thisUser.profile.name===groupCreator? "": "hidden";
  },
  //helpers for both templates eventPizzaDayControls & eventPizzaDay
  /*"isActiveEvent": function() {
    var selectedGroup= Session.get("selectedGroup");
    var groupEvent= Events.findOne({"group": selectedGroup});
    console.log(groupEvent);
    return groupEvent? true: false;
  },
  "ePD": function() {
    var selectedGroup= Session.get("selectedGroup");
    var groupEvent= Events.findOne({"group": selectedGroup}); //just one active event (other dropped)
    console.log(groupEvent);


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
}); //no events like `submit form` (because it contains other tpl with forms)




Template.usersList.helpers({
  "user": function() {
    //var user= Meteor.user().profile.name; //Meteor.userId();
    return Meteor.users.find();
    //Meteor.users.findOne({})
  },
  /**/
  "selectedGroup": function() { //???
    var selectedGroup= Session.get("selectedGroup");
    //console.log("selectedGroup: "+selectedGroup);
    return selectedGroup
  },
  /**/
});
Template.usersList.events({
  "submit form": function(event) { //addParticitant
    event.preventDefault();
    var selectedUser= event.target.selectedUser.value;
    var selectedGroup= Session.get("selectedGroup");
    //alert(selectedUser+"@"+/*groupName*/selectedGroup)
    Meteor.call("addParticitant", selectedUser, /*groupName*/selectedGroup);

  }
});




Template.participantsList.helpers({
  "participant": function() {
    //var user= Meteor.user().profile.name; //Meteor.userId();
    var selectedGroup= Session.get("selectedGroup");
    return Participants.find({"group": selectedGroup})
    //Meteor.users.findOne({})
  },
  "selectedGroup": function() {
    var selectedGroup= Session.get("selectedGroup");
    console.log(selectedGroup);
    return selectedGroup;
  }
});
Template.participantsList.events({
  //del
  "click .removeParticipant": function() {
    console.log(this)

    Meteor.call("removeParticipant", this._id);
  }
});




Template.menuList.helpers({ //container
  "menuItem": function() {
    var selectedGroup= Session.get("selectedGroup");
    return Menu.find({"canBeOrderedIn": selectedGroup})
  },
  "visibleClass": function() { //show|hide edit mode
    var editedItem= Session.get("editedItem");
    //console.log("editedItem: "+editedItem);
    //console.log("vC :-> ",this);
    return this._id===editedItem? {"show": "hidden", "edit": ""} :{"show": "", "edit": "hidden"}
  },
  "eventClass": function() { //visible only if event exists for group
    var selectedGroup= Session.get("selectedGroup");
    var orderingInGroupEvent= Events.findOne({
      "group": selectedGroup,
      "eventStatus": "ordering", //only when ordering
    });

    //new
    var user= Participants.findOne({ //hide if user already placed order
      "group": selectedGroup,
      "name": Meteor.user().profile.name
    });


    return orderingInGroupEvent && !user.orderStatus? "": "hidden";
  },
  //duplicate:
  "creatorClass": function() { //viible only for group creator
    var selectedGroup= Session.get("selectedGroup");
    if (selectedGroup) {
      var groupCreator= Groups.findOne({"groupName": selectedGroup}).creator;
      var thisUser= Meteor.user();
      console.log("private: "+groupCreator);
    }

    return selectedGroup && thisUser && thisUser.profile.name===groupCreator? "": "hidden";
  }

});
Template.menuList.events({
  "click .itemNameAndPrice": function() { //editItem
    console.log("edit: ");
    console.log(this);
    Session.set("editedItem", this._id);

    //console.log(document.getElementById("editable"));

  },
  "click .orderItem": function() { //orderItem
    console.log("add to order: ");
    console.log(this);
    var selectedGroup= Session.get("selectedGroup");



    Meteor.call("orderItem", selectedGroup, this._id);//?
  },
  "click .addCoupon": function() { //orderItem
    console.log("+ coupon: ");
    console.log(this);
    var selectedGroup= Session.get("selectedGroup");
    Meteor.call("manageCoupons", selectedGroup, this._id, 1);//?
  },
  "click .removeCoupon": function() { //orderItem
    console.log("- coupon: ");
    console.log(this);
    var selectedGroup= Session.get("selectedGroup");
    Meteor.call("manageCoupons", selectedGroup, this._id, -1);//?
  }


});







Template.editItem.events({
  "submit form": function(event) { //editItem
    event.preventDefault();
    console.log("saveChanges :-> ");
    //console.log(event.target.saveChanges);

    var updItemId= Session.get("editedItem"); //event.target.updItemId.value;
    console.log(updItemId)
    var updItemName= event.target.updItemName.value;
    var updItemPrice= event.target.updItemPrice.value;
    //var selectedGroup= Session.get("selectedGroup");
    //var updItemId= this._id;

    Meteor.call("updMenuItem", updItemId, updItemName, updItemPrice);
    Session.set("editedItem", "");
  },
  "click .discardChanges": function() {
    //console.log(this);
    Session.set("editedItem", "");

  },
  /*"blur .updItemNameAndPrice": function() {
    Session.set("editedItem", "");
  }*/
});




Template.createMenuItem.events({
  "submit form": function(event) { //createMenuItems
    event.preventDefault();

    var itemName= event.target.itemName.value;
    var itemPrice= event.target.itemPrice.value;
    var selectedGroup= Session.get("selectedGroup");
    Meteor.call("createMenuItem", itemName, itemPrice, selectedGroup);
    //alert(`add menu item ${itemName} to ${selectedGroup}`)
  }

});


/*
class order {
  constructor() {

  }

}





/*
class PizzaDayEvent {
  constructor() {
    var selectedGroup= Session.get("selectedGroup");
    this.group= selectedGroup;

    var eventDate= new Date();
    this.eventDate= eventDate.toISOString().slice(0,10);

    this.eventStatus= "ordering";
  }
  isActiveEvent() {
    var groupEvent= Events.findOne({"group": this.group});
    return groupEvent? true: false;
  }
  ePD() {
    //var selectedGroup= Session.get("selectedGroup");
    var groupEvent= Events.findOne({"group": this.group}); //just one active event (other dropped)


    return {
      _id: groupEvent._id,
      isOrdering: groupEvent.eventStatus==="ordering"? "checked": "",
      isOrdered: groupEvent.eventStatus==="ordered"? "checked": "",
      isDelivering: groupEvent.eventStatus==="delivering"? "checked": "",
      isDelivered: groupEvent.eventStatus==="delivered"? "checked": "",
      eventDate: groupEvent.eventDate,
      eventParticipants: groupEvent.eventParticipants
    }
  }


}

pizzaDay= new PizzaDayEvent();
*/








Template.eventPizzaDayControls.helpers({
  "isActiveEvent": function() {
    var selectedGroup= Session.get("selectedGroup");
    var groupEvent= Events.findOne({"group": selectedGroup});
    return groupEvent? true: false;
  },
  "ePD": function() {
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
  }
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
  "isActiveEvent": function() {
    var selectedGroup= Session.get("selectedGroup");
    var groupEvent= Events.findOne({"group": selectedGroup});
    return groupEvent? true: false;
  },
  //duplicate:
  "ePD": function() {
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

















/*
class Event {
  constructor() {
    this.selectedGroup= Session.get("selectedGroup");

  }

}
*/

/*
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';
Template.hello.onCreated(function helloOnCreated() {
  // counter starts at 0
  this.counter = new ReactiveVar(0);
});

Template.hello.helpers({
  counter() {
    return Template.instance().counter.get();
  },
});

Template.hello.events({
  'click button'(event, instance) {
    // increment the counter when button is clicked
    instance.counter.set(instance.counter.get() + 1);
  },
});
*/
