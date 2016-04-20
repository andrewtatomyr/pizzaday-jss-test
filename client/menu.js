
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
