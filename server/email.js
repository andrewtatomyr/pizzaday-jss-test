


SSR.compileTemplate('emailHtml', Assets.getText('email.html'));
//'Your order:<ul>{{#each order}}<li>{{itemName}} x {{count}}</li>{{/each}}</ul> Total cost: ${{total$}}'

/*
Template.emailText.helpers({
  /*time: function() {
    return new Date().toString();
  },*
  //isEventManeger: function() {

  //}
});
*/

Meteor.methods({

  renderEmailHtml: function(userName, total$, order, eventDate, eventManager) {
    //var html = SSR.render("emailText", {username: "arunoda"});
    var html = SSR.render("emailHtml", {
      userName,
      total$,
      order,
      eventDate,
      eventManager,
      isEventManager: userName===eventManager
    });
    //console.log(":::->");
    //console.log(html);
    return html
  },
  sendEmail: function(to, from, subject, html) {
    //check([to, from, subject, text], [String]);

    // Let other method calls from the same client start running,
    // without waiting for the email sending to complete.
    this.unblock();

    Email.send({
      to,
      from,
      subject,
      html
    });
  }
});
