Template.propietarios.helpers({
    'settings': function(){
        return {
 collection: Propietarios.find(),
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
        label: 'tel.',
        headerClass: 'col-md-2',
      },
   {
        label: '',
        headerClass: 'col-md-1',
        tmpl:Template.accionesPropietarios
      }
 ]
 };
    }
});
Template.nuevoPropietario.events({
    'submit form': function(){
         console.log("click agregar");
    }
});

Template.propietarios.events({
  "click #btnAgregar":function(){
      var act=this;
 Modal.show('nuevoPropietario',function(){ return act; });
  $("#modalnuevoPropietario").on("hidden.bs.modal", function () {
    $('body').removeClass('modal-open');	
$('.modal-backdrop').remove();
});
  },
  'mouseover tr': function(ev) {
    $("#tablaPropietarios").find(".acciones").hide();
    $(ev.currentTarget).find(".acciones").show();
    
  },
  'mousemove tr': function(ev) {
    
  },
  'click .delete': function(ev) {
    var id=this._id;
    swal({   title: "Estas Seguro de quitar?",   text: "Una vez que lo has quitado sera permanente!",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Si, borralo!",   closeOnConfirm: true }, function(){ Propietarios.remove(id); swal("Quitado!", "El registro ha sido borrado", "success"); });

  },
  'click .update': function(ev) {
          var act=this;
 Modal.show('modificarPropietario',function(){ return act; });
  $("#modalmodificarPropietario").on("hidden.bs.modal", function () {
    $('body').removeClass('modal-open');	
$('.modal-backdrop').remove();
});
  },
  
});
AutoForm.hooks({
  'nuevoPropietario_': {
    onSuccess: function (operation, result, template) {
     swal("GENIAL!","Se ha ingresado la entidad!","success");
     Modal.hide();
    },
    onError: function(operation, error, template) {
     swal("Ops!","ha ocurrido un erro al ingresar el registro:"+error,"error");
     Modal.hide();
    }
  },
    'modificarPropietario_': {
    onSuccess: function (operation, result, template) {
     swal("GENIAL!","Se ha modificado la entidad!","success");
     Modal.hide();
      Router.go('/propietarios/');
      
    },
    onError: function(operation, error, template) {
     swal("Ops!","ha ocurrido un erro al ingresar el registro:"+error,"error");
    }
  }
});