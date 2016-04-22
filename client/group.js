Template.groups.helpers({
  group: function() {
    return Groups.find();
  },
  currentUser: function() {
    if ( Meteor.user() ) return Meteor.user().profile.name;
  },
  selectedClass: function() {
    var selectedGroup= Session.get("selectedGroup");
    var groupName= this.groupName;
    return (groupName==selectedGroup)? "selected": "";
  },
  addButton: function() {
    return Session.get("addButton");
  },
  newGroupName: function() {
    return Session.get("newGroupName");
  },
  newGroupLogo: function() {
    return Session.get("newGroupLogo") || "add-group.png";
  }
});
Template.groups.events({
  "click .group": function() { //selectGroup
    Session.set("selectedGroup", this.groupName);
    Session.set("addButton", "");
    Session.set("newGroupName", "");
    Session.set("newGroupLogo", "");
  },
  "click #addButton": function() { //intendToreateNewGroup
    Session.set("selectedGroup", "");
    Session.set("addButton", "true");
  },
  "click #refuse": function() { //hideCretionControls
    Session.set("addButton", "");
    Session.set("newGroupName", "");
    Session.set("newGroupLogo", "");
  },
  "change #groupName": function(event) { //hotGroupNamePresentation
    Session.set("newGroupName", event.target.value);
  },
  "change #logoUrl": function(event) {  //hotLogoPresentation
    Session.set("newGroupLogo", event.target.value);
  },
  "submit form": function(event) { //createGroup
    event.preventDefault();
    var selectedGroup= event.target.groupName.value;
    var logoUrl= event.target.logoUrl.value;

    if ( Groups.findOne({"groupName": selectedGroup}) ) { //preventNameDuplication
      alert("Group with same name already exists! Set another name please"); //madeForSimplicity
    } else {
      Session.set("selectedGroup", selectedGroup);
      Meteor.call("createGroup", selectedGroup, logoUrl);
      Session.set("addButton", "");
      Session.set("newGroupName", "");
      Session.set("newGroupLogo", "");
    }
  }

});




Template.groupControls.helpers({ //container
  participantClass: function() { //visible only for participants
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
  creatorClass: function() { //visible only for group creator
    var selectedGroup= Session.get("selectedGroup");
    if (selectedGroup) {
      var groupCreator= Groups.findOne({"groupName": selectedGroup}).creator;
      var thisUser= Meteor.user();
    }
    return selectedGroup && thisUser && thisUser.profile.name===groupCreator? "": "hidden";
  },
}); //no events like `submit form` (because it contains other tpl with forms)



Template.usersList.helpers({
  user: function() {
    return Meteor.users.find();
  },
  selectedGroup: function() {
      return Session.get("selectedGroup");
  }
});
Template.usersList.events({
  "submit form": function(event) { //addParticitant
    event.preventDefault();
    var selectedUser= event.target.selectedUser.value;
    var selectedGroup= Session.get("selectedGroup");
    Meteor.call("addParticitant", selectedUser, selectedGroup);
  }
});




Template.participantsList.helpers({
  participant: function() {
    return Participants.find({"group": Session.get("selectedGroup")});
  },
  selectedGroup: function() {
    return Session.get("selectedGroup");
  }
});
Template.participantsList.events({
  "click .removeParticipant": function() {
    Meteor.call("removeParticipant", this._id);
  }
});
