
Meteor.methods({
  createGroup: function(groupName) {
    var thisUser= Meteor.user();
    if (!thisUser) return false;
    //console.log(thisUser.profile.name+" adds: "+groupName)
    if (groupName) Groups.insert({
      groupName: groupName,
      creator: thisUser.profile.name
    });
    //Session.set("selectedGroup", groupName);
  },
  addParticitant: function(user, groupName) {
    //console.log("add: "+user)
    var thisUser= Meteor.user();
    if (!thisUser) return false;
    var creator= Groups.findOne({"groupName": groupName}).creator;
    //console.log(thisUser.profile.name+"?=="+creator);

    //new
    var userAlreadyInGroup= Participants.findOne({"group": groupName, "name": user});



    if (
      thisUser.profile.name===creator &&
      user && groupName
      && !userAlreadyInGroup
    ) Participants.insert({
      name: user,
      email: Meteor.users.findOne({"profile.name": user}).services.google.email,
      group: groupName,
      //groupManager: creator
    });
  },
  removeParticipant: function(_id) {
    Participants.remove(_id);
  }

});
