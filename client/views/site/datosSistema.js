Template.datosSistema.helpers({
    'settings': function(){
        return {
 collection: Settings.find(),
 rowsPerPage: 10,
 showFilter: true,
class: "table table-condensed",
 fields: [
      {
        key: 'clave',
        label: 'Clave',
        headerClass: 'col-md-2',
      },
   {
        key: 'valor',
        label: 'Valor',
      },
   
   {
        label: '',
        headerClass: 'col-md-2',
        tmpl:Template.accionesDatosSistema
      }
 ]
 };
    }
});

Template.datosSistema.events({
    'click #generarVariables': function(ev) {
     Meteor.call("generarVariables",function(err,res){   
 swal("GENIAL!","Se han actualizado los datos","success");
 });
  },
  'mouseover tr': function(ev) {
    $("#tablaDatosSistema").find(".acciones").hide();
    $(ev.currentTarget).find(".acciones").show();
    
  },
  'mousemove tr': function(ev) {
    
  },
  'click .delete': function(ev) {
    var id=this._id;
    swal({   title: "Estas Seguro de quitar?",   text: "Una vez que lo has quitado sera permanente!",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Si, borralo!",   closeOnConfirm: true }, function(){ Settings.remove(id); swal("Quitado!", "El registro ha sido borrado", "success"); });

  },
  'click .update': function(ev) {
    Router.go('/modificarDatosSistema/'+this._id);
  },
  
});
AutoForm.hooks({
  'nuevoDatosSistema_': {
    onSuccess: function (operation, result, template) {
     swal("GENIAL!","Se ha ingresado!","success");
    },
    onError: function(operation, error, template) {
     swal("Ops!","ha ocurrido un erro al ingresar el registro:"+error,"error");
    }
  },
    'modificarDatosSistema_': {
    onSuccess: function (operation, result, template) {
     swal("GENIAL!","Se ha modificado !","success");
      Router.go('/datosSistema/');
    },
    onError: function(operation, error, template) {
     swal("Ops!","ha ocurrido un erro al ingresar el registro:"+error,"error");
    }
  }
});