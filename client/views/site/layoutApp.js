Template.layoutApp.helpers({
     'esAdmin': function(){
     if(!Meteor.user())return false;
     if(Meteor.user().username==="admin")return true;
       return false;
     },
  'nombreUsuario':function(){
    if(!Meteor.user())return "";
    return Meteor.user().username;
  }
});
Template.layoutApp.events({
     'click #nuevaEntidad': function(){
var act=this;
 Modal.show('nuevaEntidad',function(){ return act; });
  $("#modalnuevaEntidad").on("hidden.bs.modal", function () {
    $('body').removeClass('modal-open');  
$('.modal-backdrop').remove();
});
     },
      'click .nuevaVenta': function(){
var act=this;
 Modal.show('nuevaVenta',function(){ return act; });
  $("#modalnuevaVenta").on("hidden.bs.modal", function () {
    $('body').removeClass('modal-open');  
$('.modal-backdrop').remove();
});
     },
          'click #nuevoPropietario': function(){
var act=this;
 Modal.show('nuevoPropietario',function(){ return act; });
  $("#modalnuevoPropietario").on("hidden.bs.modal", function () {
    $('body').removeClass('modal-open');	
$('.modal-backdrop').remove();
});
     },

});
