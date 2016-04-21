Meteor.startup( function() {
  //process.env.MAIL_URL = "smtp://***:***@smtp.mailgun.org:587";
  //process.env.MONGO_URL= "mongodb://***:***@ds011251.mlab.com:11251/pizzaday";
});




/*
class acessRights extends Meteor {
  constructor() {
  this.user: super.user
  }
  isAuthorized() {

  }
  inGroup(groupName) {

  }
}
*/






/* var order= new Order( Participants.find({"group": group, "orderStatus": "confirmed"}).fetch() )
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





Meteor.publish("users", function() {
  //console.log(this.userId);
  if (this.userId) return Meteor.users.find() //why not *this.*?
});
Meteor.publish("groups", function() {
  //var currentUser= Meteor.userId();

  //console.log(this.userId);
  /*if (this.userId)*/ return Groups.find()//{"author": currentUser})
});
Meteor.publish("participants", function(/*selectedGroup*/) {
  //var thisUser= this.user();
  //console.log(this.userId);
  if (this.userId) return Participants.find(/*{"group": selectedGroup}*/)
});
Meteor.publish("menu", function(/*selectedGroup*/) {
  //var thisUser= this.user();
  //console.log(this.userId);
  if (this.userId) return Menu.find(/*{"group": selectedGroup}*/)
});
Meteor.publish("events", function() {
  if (this.userId) return Events.find(/*{"group": selectedGroup}*/)
});


Meteor.methods({
  /**
  "getParticipants": function(selectedGroup) {
    console.log( "[CALL:] get participants from "+ selectedGroup)
    console.log(Participants.find({"group": selectedGroup}).fetch());//x
    return Participants.find({"group": selectedGroup});//Participants.find({"group": selectedGroup})
  },
  /**
  "createGroup": function(groupName) {
    var thisUser= Meteor.user();
    if (!thisUser) return false;
    //console.log(thisUser.profile.name+" adds: "+groupName)
    if (groupName) Groups.insert({
      groupName: groupName,
      creator: thisUser.profile.name
    });
    //Session.set("selectedGroup", groupName);
  },
  "addParticitant": function(user, groupName) {
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
  "removeParticipant": function(_id) {
    Participants.remove(_id);
  },*
  "createMenuItem": function(itemName, itemPrice, groupName) {
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
  "updMenuItem": function(updItemId, updItemName, updItemPrice) {
    //console.log("! must be updtd: "+updItemId)
    var thisUser= Meteor.user();
    if (!thisUser) return false;
    Menu.update(updItemId, {$set: {
      itemName: updItemName,
      itemPrice: updItemPrice
    }});

  },
/**  "orderItem": function(group, itemId) {
    //console.log('! must be ordered:'+ itemId);
    /*var participantOrder= Events.findOne({
      "group": group,
      "eventParticipants.userName":Meteor.user().profile.name
    });

    *
    Events.update({
      "group": group,
      "eventParticipants.userName": Meteor.user().profile.name
    }, {
      $set: {"eventParticipants.order": {itemId: 0}}
    });
    *

    Events.update({
      "group": group,
      "eventParticipants.userName": Meteor.user().profile.name
    }, {$set: {
      "eventParticipants.order": {itemId, count: 0}
    }});
    *

    var participant= Participants.findOne({
      "group": group,
      "name": Meteor.user().profile.name
    });

    //var countField= "order."+itemId+".count"; //

    Participants.update(
      //participant._id,
      {
        "group": group,
        "name": Meteor.user().profile.name,
        "order": itemId
      },
      {$inc: {
        "order.$.count": 1
      }}//,
      //{upsert: true}
    );
    *
    Events.findOne(
      {
        "group": group,
        "eventParticipants.userName": Meteor.user().profile.name,
        "eventParticipants.$.order"
      },
      {$addToSet: {
        "eventParticipants.$.order": {itemId, count: 1}
      }}
    );*/


    /*Events.update(
      //participant._id,
      {
        "group": group,
        "eventParticipants.userName": Meteor.user().profile.name,

      },
      {$addToSet: {
        "eventParticipants.$.order": {itemId, count: 1}
      }}
    );*

    var itemAlreadyInOrder= Participants.findOne({
        "group": group,
        "name": Meteor.user().profile.name,
        "order.itemId": itemId
    });

    //console.log(":::::::::::::::::::");
    //console.log(!itemAlreadyInOrder);
    //console.log(":::::::::::::::::::");

    var itemName= Menu.findOne({"_id": itemId}).itemName;
    var itemPrice= Menu.findOne({"_id": itemId}).itemPrice;
    //console.log(itemName);

    if (!itemAlreadyInOrder) Participants.update(
      //participant._id,
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
  "manageCoupons": function(group, itemId, incDec) {
    Menu.update(itemId, {$inc: {"coupons": incDec}});
  },
  "incItemCount": function(group, itemId) {
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
  "delItemFromOrder": function(group, itemId) {
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
  "finishOrder": function(group, participation) {
    //console.log("! del: "+itemId);
    /*
    Events.update({
      "group": group,
      "eventParticipants": Meteor.user().profile.name
    }, {$addToSet: {
      "eventParticipants.$.status": "confirmed"

    }});
    *
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
          }*
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
      //*


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

      /*console.log("|");
      console.log("|");
      console.log("V");
      console.log(total$);
      console.log('::::::::::::::::::');
      console.log(totalCount);
      console.log("------------");
      console.log(usedCoupons);*

      //sending emails:

      var eventManager= Groups.findOne({"groupName": group}).creator;
      var eventDate= Events.findOne({"group": group}).eventDate;

      for (var usr in pp) { //sending emails
        /*let order= "";
        for (var itm in pp[usr].order) {
          order+= "> "+pp[usr].order[itm].itemName+" x "+pp[usr].order[itm].count+"\n";
        }*
        var html= Meteor.call("renderEmailHtml", pp[usr].name, total$[usr], pp[usr].order, eventDate, eventManager);
        console.log(`HTML>>`);
        console.log(html);
        Meteor.call("sendEmail",
          pp[usr].email,
          "event@pizzaday-jss-test.herokuapp.com",
          "Event in '"+group+"'",
          html //"Your order:"+"\n"+order+"\n"+"Total cost: $"+total$[usr]
        )

      }

      //var order= new Order(pp, gg, group);

    }

    //*

  },

  /*"discardParticipation": function(group) {
    console.log(":discard");
    Participants.update({
      "group": group,
      "name": Meteor.user().profile.name
    }, {$set: {
      "orderStatus": "discarded"

    }});
  },*
  "createEvent": function(group, eventDate) {
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
*
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
**/



});









/*
import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup
});
*/
