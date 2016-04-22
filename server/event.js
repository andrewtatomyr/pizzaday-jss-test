class Order { //createsReportObject
  constructor(group) {
    var pp= Participants.find({
      "group": group,
      "orderStatus": "confirmed"
    }).fetch();
    this.pp= pp;

    var totalCount= {}; //orderedItems
    for (var usr in pp) {
      for (var itm in pp[usr].order) {
        var itemId= pp[usr].order[itm].itemId;
        var itemCount= parseInt(pp[usr].order[itm].count);
        if (isNaN(totalCount[itemId])) totalCount[itemId]= 0; //init
        totalCount[itemId]+= itemCount;
      }
    }

    var usedCoupons= {}, discount= {};
    for (var itemId in totalCount) {
      var coupons= parseInt( Menu.findOne(itemId).coupons );
      usedCoupons[itemId]= Math.min(totalCount[itemId], coupons);
      Meteor.call("manageCoupons", group, itemId, -usedCoupons[itemId]);
      discount[itemId]= usedCoupons[itemId] / totalCount[itemId];
    }

    var total$= []; //total amount $
    for (var usr in pp) {
      total$[usr]= 0;

      for (var itm in pp[usr].order) {
        var itemId= pp[usr].order[itm].itemId;
        total$[usr]+=
          parseFloat(pp[usr].order[itm].itemPrice) *
          (1 - discount[itemId]) *
          parseInt(pp[usr].order[itm].count);
      }
    }
    this.total$= total$.map( (el)=> Math.round(el*100)/100 );
    console.log(this.total$);

    var totalOrder= [];
    for (var itemId in totalCount) {
      totalOrder.push({
        itemName: Menu.findOne(itemId).itemName,
        itemCount: totalCount[itemId]
      });
    }
    this.totalOrder= totalOrder;

  }

  getTotalCost() { //eventCostSummation
    return this.total$.reduce( (partitialSum, el)=> partitialSum + Number(el) );
  }

}



Meteor.methods({
  incItemCount: function(group, itemId) {
    Participants.update(
      {
        "group": group,
        "name": Meteor.user().profile.name,
        "order.itemId": itemId
      },
      {$inc: {
        "order.$.count": 1
      }}
    );
  },
  delItemFromOrder: function(group, itemId) {
    Participants.update(
      {
        "group": group,
        "name": Meteor.user().profile.name
      },
      {$pull: {
        "order": {"itemId": itemId}
      }}
    );
  },
  finishOrder: function(group, participation) {
    Participants.update({
      "group": group,
      "name": Meteor.user().profile.name
    }, {$set: {
      "orderStatus": participation //comfirmed || discarded
    }});

    //finish event order
    if (!Participants.findOne({
      "group": group,
      "orderStatus": undefined
    })) { //no one has undefined status
      Events.update({
        "group": group
      }, {$set: {
        "eventStatus": "ordered"
      }});
      var eventOrder= new Order(group); //createEventReport
      for (var usr in eventOrder.pp) { //sendingEmails
        var eventList= { //accessorialObject
          eventDate: Events.findOne({"group": group}).eventDate,
          eventManager: Groups.findOne({"groupName": group}).creator,
          userName: eventOrder.pp[usr].name,
          total$: eventOrder.total$[usr],
          order: eventOrder.pp[usr].order,
          totalOrder: eventOrder.totalOrder,
          eventTotalCost: eventOrder.getTotalCost()
        }
        var html= Meteor.call("renderEmailHtml", eventList); //SSR-emailRendering
        Meteor.call("sendEmail",
          eventOrder.pp[usr].email,
          "no-replay@pizzaday-jss-test.herokuapp.com",
          "Event in '"+group+"'",
          html
        );
      }
    }

  },
  createEvent: function(group, eventDate) {
    Events.insert({
      group,
      eventDate,
      eventStatus: "ordering"
    });
  },
  updEvent: function(group, eventDate, eventStatus) {
    Events.update({"group": group}, {$set: {
      "eventDate": eventDate,
      "eventStatus": eventStatus
    }});
  },
  finishEvent: function(group) {
    Events.remove({"group": group});
    Participants.update({
      "group": group
    }, {$unset: {
      orderStatus: "",
      order: ""
    }}, {multi: true});
  }

});
