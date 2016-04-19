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






//* var order= new Order( Participants.find({"group": group, "orderStatus": "confirmed"}).fetch() )
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
