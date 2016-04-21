

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
  },
  "addButton": function() {

    console.log("[get addButton]",Session.get("addButton"));
    console.log("[get group]",Session.get("selectedGroup"));
    return Session.get("addButton");//selectedGroup===? Groups.findOne({"groupName": selectedGroup}).logoUrl || "pizzaday.png";
  },
  "newGroupName": function() {
    return Session.get("newGroupName");
  },
  "newGroupLogo": function() {
    return Session.get("newGroupLogo") || "add-group.png";
  }
});
Template.groups.events({
  "click .group": function(/*event*/) { //selectGroup
    //var selectedGroup= this.groupName
    Session.set("selectedGroup", this.groupName);
    console.log(this.groupName);
    Session.set("addButton", "");
    Session.set("newGroupName", "");
    Session.set("newGroupLogo", "");
    //console.log(selectedGroup);
    //<<//
    //console.log("we select >> "+event.target.innerText);
  },
  /*"click #groupName": function() { //selectNewGroup
    //var selectedGroup= event.target.textContent
    Session.set("selectedGroup", ""); //~
    //console.log(selectedGroup);
    //<<//
    //console.log("we select >> "+event.target.innerText);
  },*/
  "click #addButton": function() { //selectNewGroup
    //var selectedGroup= event.target.textContent
    Session.set("selectedGroup", "");
    Session.set("addButton", "true");
    //$("#newGroupNameAndLogo").toggle();
    console.log("addButton","group["+Session.get("selectedGroup")+"]","addB["+Session.get("addButton")+"]");


    //console.log(selectedGroup);
    //<<//
    //console.log("we select >> "+event.target.innerText);
  },
  "click #refuse": function() {
    Session.set("addButton", "");
    Session.set("newGroupName", "");
    Session.set("newGroupLogo", "");
  },
  "change #groupName": function(event) {
    console.log(">>>>>>>event>>>>>>");
    console.log(event);
    Session.set("newGroupName", event.target.value);
  },
  "change #logoUrl": function(event) {
    console.log(">>>>>>>event>>>>>>");
    console.log(event);
    Session.set("newGroupLogo", event.target.value);
  },
  "submit form": function(event) { //createGroup
    event.preventDefault();
    //>>// var groupName= event.target.groupName.value;
    //>>// alert(groupName)

    //>>// Meteor.call("addGroup", groupName);
    //>>// Session.set("selectedGroup", groupName);
    var selectedGroup= event.target.groupName.value;
    var logoUrl= event.target.logoUrl.value;
    //console.log(selectedGroup);
    //console.log(Groups.findOne({"groupName": selectedGroup}));

    if ( Groups.findOne({"groupName": selectedGroup}) ) {
      alert("Group with same name already exists! Set another name please");
    } else {
      Session.set("selectedGroup", selectedGroup);
      Session.set("addButton", "");
      Session.set("newGroupName", "");
      Session.set("newGroupLogo", "");
      Meteor.call("createGroup", selectedGroup, logoUrl);

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
      //console.log("private: "+groupCreator);
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



/*
Template.groupLogo.helpers({
  logoUrl: function() {
    var selectedGroup= Session.get("selectedGroup");
    if (selectedGroup) {
      return Groups.findOne({"groupName": selectedGroup}).logoUrl
    }
  }
});
Template.groupLogo.events({
  "submit form": function() {
    event.preventDefault();
    //var selectedUser= event.target.selectedUser.value;
    //var selectedGroup= ;
    Meteor.call("setLogoUrl", Session.get("selectedGroup"), event.target.logoUrl.value);
  }
});
*/


Template.usersList.helpers({
  "user": function() {
    //var user= Meteor.user().profile.name; //Meteor.userId();
    return Meteor.users.find();
    //Meteor.users.findOne({})
  },
  /**/
  "selectedGroup": function() { //???
    //var selectedGroup= Session.get("selectedGroup");
    //console.log("selectedGroup: "+selectedGroup);
    return Session.get("selectedGroup")
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
    //console.log(selectedGroup);
    return selectedGroup;
  }
});
Template.participantsList.events({
  //del
  "click .removeParticipant": function() {
    //console.log(this)

    Meteor.call("removeParticipant", this._id);
  }
});
