Template.menuList.helpers({ //container
  "menuItem": function() {
    return Menu.find({"canBeOrderedIn": Session.get("selectedGroup")});
  },
  "visibleClass": function() { //show|hide edit mode
    return this._id===Session.get("editedItem")? {"show": "hidden", "edit": ""} :{"show": "", "edit": "hidden"};
  },
  "eventClass": function() { //visible only if event exists for group
    var selectedGroup= Session.get("selectedGroup");
    var orderingInGroupEvent= Events.findOne({
      "group": selectedGroup,
      "eventStatus": "ordering" //only when ordering
    });

    var user= Participants.findOne({ //hide if user already placed order
      "group": selectedGroup,
      "name": Meteor.user().profile.name
    });
    return orderingInGroupEvent && !user.orderStatus? "": "hidden";
  },
  "creatorClass": function() { //visible only for group creator
    var selectedGroup= Session.get("selectedGroup");
    if (selectedGroup) {
      var groupCreator= Groups.findOne({"groupName": selectedGroup}).creator;
      var thisUser= Meteor.user();
    }
    return selectedGroup && thisUser && thisUser.profile.name===groupCreator? "": "hidden";
  }

});
Template.menuList.events({
  "click .itemNameAndPrice": function() { //editItem
    Session.set("editedItem", this._id);
  },
  "click .orderItem": function() { //orderItem
    var selectedGroup= Session.get("selectedGroup");
    Meteor.call("orderItem", selectedGroup, this._id);
  },
  "click .addCoupon": function() {
    var selectedGroup= Session.get("selectedGroup");
    Meteor.call("manageCoupons", selectedGroup, this._id, 1);
  },
  "click .removeCoupon": function() {
    var selectedGroup= Session.get("selectedGroup");
    Meteor.call("manageCoupons", selectedGroup, this._id, -1);
  }

});





Template.editItem.events({
  "submit form": function(event) { //editItem
    event.preventDefault();
    var updItemId= Session.get("editedItem");
    var updItemName= event.target.updItemName.value;
    var updItemPrice= event.target.updItemPrice.value;

    Meteor.call("updMenuItem", updItemId, updItemName, updItemPrice);
    Session.set("editedItem", "");
  },
  "click .discardChanges": function() {
    Session.set("editedItem", "");
  }

});




Template.createMenuItem.events({
  "submit form": function(event) { //createMenuItem
    event.preventDefault();
    var itemName= event.target.itemName.value;
    var itemPrice= event.target.itemPrice.value;
    var selectedGroup= Session.get("selectedGroup");

    Meteor.call("createMenuItem", itemName, itemPrice, selectedGroup);
    $(".itemOptions").val(""); //clearingInputFields
  }

});
