SSR.compileTemplate('emailHtml', Assets.getText('email.html'));


Meteor.methods({
  renderEmailHtml: function(eventList) {
    var html= SSR.render("emailHtml", {
      eventList,
      isEventManager: eventList.userName===eventList.eventManager
    });
    return html;
  },
  sendEmail: function(to, from, subject, html) {
    this.unblock();
    Email.send({
      to,
      from,
      subject,
      html
    });
  }
});
