

/*
class Order {
  constructor(participants, eventManager, group) {
    this.participants= {};
    for (var key in participants) {
      this.participants[participants[key].name]= participants[key].order;
    }
    this.eventManager= Groups.findOne({"groupName": group}.creator);//eventManager;
    //this.participants= participants;
  }
  forParticipant(userName) {
    return this.participants[userName]
  }
  sendEmail(userName) {

  }

}




/* var eventOrder= new Order( Participants.find({"group": group, "orderStatus": "confirmed"}).fetch() )
class Order {
  constructor(participants, eventManager, group) {
    this.participants= {};
    for (var key in participants) {
      this.participants[participants[key].name]= participants[key].order;
    }
    this.eventManager= Groups.findOne({"groupName": group}.creator);//eventManager;
    //this.participants= participants;
  }
  forParticipant(userName) {
    return this.participants[userName]
  }
  sendEmail(userName) {

  }

}


//*/




Meteor.methods({


  incItemCount: function(group, itemId) {
    //console.log("! inc: "+itemId);

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
    //console.log("! del: "+itemId);

    Participants.update(
      {
        "group": group,
        "name": Meteor.user().profile.name,
        //"order.itemId": itemId
      },
      {$pull: {"order": {"itemId": itemId} } }
    );
  },
  finishOrder: function(group, participation) {
    //console.log("! del: "+itemId);
    /*
    Events.update({
      "group": group,
      "eventParticipants": Meteor.user().profile.name
    }, {$addToSet: {
      "eventParticipants.$.status": "confirmed"

    }});
    */
    Participants.update({
      "group": group,
      "name": Meteor.user().profile.name
    }, {$set: {
      "orderStatus": participation

    }});

    //finish event order
    if (!Participants.findOne({
      "group": group,
      "orderStatus": undefined
    })) {
      Events.update({
        "group": group
      }, {$set: {
        "eventStatus": "ordered"
      }});


      //calculatings:
      //?????????????????????????
      var pp= Participants.find({ //new?
        "group": group,
        "orderStatus": "confirmed"
      }).fetch();


      var totalCount= {}; //ordered  items
      for (var usr in pp) {
        for (var itm in pp[usr].order) {
          /*if (totalCount[pp[usr].order[itm].itemId]) {
            totalCount[pp[usr].order[itm].itemId]+= parseInt(pp[usr].order[itm].count);
          } else {
            totalCount[pp[usr].order[itm].itemId]= parseInt(pp[usr].order[itm].count);
          }*/
          var itemId= pp[usr].order[itm].itemId;
          var itemCount= parseInt(pp[usr].order[itm].count);
          if (isNaN(totalCount[itemId])) totalCount[itemId]= 0; //init
          totalCount[itemId]+= itemCount;
          //console.log(usr+" | "+itm+" >> "+itemCount, totalCount[itemId]);

        }
      }

      //var menu= Menu.find({"canBeOrderedIn": group}).fetch();
      var usedCoupons= {}, discount= {};
      for (var itemId in totalCount) {
        var coupons= parseInt( Menu.findOne(itemId).coupons );
        usedCoupons[itemId]= Math.min(totalCount[itemId], coupons);
        Meteor.call("manageCoupons", group, itemId, -usedCoupons[itemId]);
        discount[itemId]= usedCoupons[itemId] / totalCount[itemId];
        console.log(itemId+" >> "+ totalCount[itemId],"[",coupons,discount[itemId],"]");

      }
      //*/


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



      //sending emails:

      var eventManager= Groups.findOne({"groupName": group}).creator;
      var eventDate= Events.findOne({"group": group}).eventDate;

      for (var usr in pp) { //sending emails
        /*let order= "";
        for (var itm in pp[usr].order) {
          order+= "> "+pp[usr].order[itm].itemName+" x "+pp[usr].order[itm].count+"\n";
        }*/
        var html= Meteor.call("renderEmailHtml", pp[usr].name, total$[usr], pp[usr].order, eventDate, eventManager);
        //console.log(`HTML>>`);
        //console.log(html);
        Meteor.call("sendEmail",
          pp[usr].email,
          "event@pizzaday-jss-test.herokuapp.com",
          "Event in '"+group+"'",
          html //"Your order:"+"\n"+order+"\n"+"Total cost: $"+total$[usr]
        )

      }

      //var order= new Order(pp, gg, group);

    }

    //*/

  },


  createEvent: function(group, eventDate) {
    console.log('! new event:'+ eventDate+ " @ "+group);
    //var menu=

/*
    var groupParticipants= Participants.find({"group": group}).fetch();
    var eventParticipants= [];
    for (var key in groupParticipants) {
        eventParticipants[key]= {
          "userName": groupParticipants[key].name,
          "status": undefined,
          "order": []
        }
    }
*/
    Events.insert({
      group,
      eventDate,
      eventStatus: "ordering",
//      eventParticipants
    })
  },
  "updEvent": function(group, eventDate, eventStatus) {
    //console.log('! upd event:'+ " @ "+group);
    Events.update({"group": group}, {$set: {
      "eventDate": eventDate,
      "eventStatus": eventStatus
    }});
  },
  "finishEvent": function(group) {
    //-------------emailing & other
    //console.log('! finish event:'+ " @ "+group);
    Events.remove({"group": group});
    Participants.update({
      "group": group
    }, {$unset: {
      orderStatus: "",
      order: ""
    }}, {multi: true});
  }




});
