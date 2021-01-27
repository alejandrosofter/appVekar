Template.fiduciarios.helpers({
    'settings': function(){
        return {
 collection: Fiduciarios.find(),
 rowsPerPage: 10,
 showFilter: true,
class: "table table-condensed",
 fields: [
   {
        key: 'razonSocial',
        label: 'Razon Social',
      },
      {
        key: 'telefono',
        label: 'Tel.',
         headerClass: 'col-md-2',
      },
   {
        key: 'email',
        label: 'Email',
        headerClass: 'col-md-3',
      },
   {
        key: 'porcentaje',
        label: '% Porc.',
        headerClass: 'col-md-1',
      },
   
   {
        label: '',
        headerClass: 'col-md-1',
        tmpl:Template.accionesFiduciarios
      }
 ]
 };
    }
});
Template.nuevoFiduciario.events({
    'submit form': function(){
         console.log("click agregar");
    }
});

Template.fiduciarios.events({
   "click #btnAgregar":function(){
     Router.go('/nuevoFiduciario');
  },
  'mouseover tr': function(ev) {
    $("#tablaFiduciarios").find(".acciones").hide();
    $(ev.currentTarget).find(".acciones").show();
    
  },
  'mousemove tr': function(ev) {
    
  },
  'click .delete': function(ev) {
    var id=this._id;
    swal({   title: "Estas Seguro de quitar?",   text: "Una vez que lo has quitado sera permanente!",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Si, borralo!",   closeOnConfirm: true }, function(){ Fiduciarios.remove(id); swal("Quitado!", "El registro ha sido borrado", "success"); });

  },
  'click .update': function(ev) {
    Router.go('/modificarFiduciario/'+this._id);
  },
  
});
AutoForm.hooks({
  'nuevoFiduciario_': {
    onSuccess: function (operation, result, template) {
     swal("GENIAL!","Se ha ingresado el registro!","success");
    },
    onError: function(operation, error, template) {
     swal("Ops!","ha ocurrido un erro al ingresar el registro:"+error,"error");
    }
  },
    'modificarFiduciario_': {
    onSuccess: function (operation, result, template) {
     swal("GENIAL!","Se ha modificado el registro!","success");
      Router.go('/fiduciarios/');
    },
    onError: function(operation, error, template) {
     swal("Ops!","ha ocurrido un erro al ingresar el registro:"+error,"error");
    }
  }
});