


SSR.compileTemplate('emailText', 'Your order:<ul>{{#each order}}<li>{{itemName}} x {{count}}</li>{{/each}}</ul> Total cost: ${{total$}}');
//'Your order:\n{{#each order}}> {{itemName}} x {{count}}\n{{/each}} Total cost: ${{total$}}'
/*
Template.emailText.helpers({
  time: function() {
    return new Date().toString();
  }
});
*/

Meteor.methods({
  renderEmailText: function(total$, order) {
    //var html = SSR.render("emailText", {username: "arunoda"});
    var text = SSR.render("emailText", {total$, order});
    //console.log(":::->");
    //console.log(html);
    return text
  }
});
