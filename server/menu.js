
Meteor.methods({
  createMenuItem: function(itemName, itemPrice, groupName) {
    //console.log("add: "+user)
    //var thisUser= Meteor.user().profile.name;
    //var creator= Groups.findOne({"groupName": groupName}).creator;
    //console.log(thisUser+"?=="+creator);
    var thisUser= Meteor.user();
    if (!thisUser) return false;
    Menu.insert({
      itemName: itemName,
      itemPrice: itemPrice,
      canBeOrderedIn: groupName,
      coupons: 0
    });
  },
  updMenuItem: function(updItemId, updItemName, updItemPrice) {
    //console.log("! must be updtd: "+updItemId)
    var thisUser= Meteor.user();
    if (!thisUser) return false;
    Menu.update(updItemId, {$set: {
      itemName: updItemName,
      itemPrice: updItemPrice
    }});

  },
  orderItem: function(group, itemId) {

    var itemAlreadyInOrder= Participants.findOne({
        "group": group,
        "name": Meteor.user().profile.name,
        "order.itemId": itemId
    });


    var itemName= Menu.findOne({"_id": itemId}).itemName;
    var itemPrice= Menu.findOne({"_id": itemId}).itemPrice;

    if (!itemAlreadyInOrder) Participants.update(
      {
        "group": group,
        "name": Meteor.user().profile.name,
        //"order": itemId
      },
      {$addToSet: {
        "order": {itemId, itemName, itemPrice, count: 1}
      }}
    );

  },
  manageCoupons: function(group, itemId, incDec) {
    Menu.update(itemId, {$inc: {"coupons": incDec}});
  }
});
