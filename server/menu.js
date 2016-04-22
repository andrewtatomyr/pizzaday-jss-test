Meteor.methods({
  createMenuItem: function(itemName, itemPrice, groupName) {
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
    var itemName= Menu.findOne(itemId).itemName;
    var itemPrice= Menu.findOne(itemId).itemPrice;
    if (!itemAlreadyInOrder) Participants.update(
      {
        "group": group,
        "name": Meteor.user().profile.name
      },
      {$addToSet: {
        "order": {
          itemId,
          itemName,
          itemPrice,
          count: 1
        }
      }}
    );
  },
  manageCoupons: function(group, itemId, incDec) {
    Menu.update(itemId, {$inc: {"coupons": incDec}});
  }

});
