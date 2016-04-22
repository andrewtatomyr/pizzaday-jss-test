Meteor.subscribe("users");
Meteor.users.deny({update: function () { return true; }});
Meteor.subscribe("groups");
Meteor.subscribe("participants");
Meteor.subscribe("menu");
Meteor.subscribe("events");




Template.afterSignIn.helpers({ //container
  "signedClass": function() {
    return Meteor.userId()? "": "hidden";
  }
});
