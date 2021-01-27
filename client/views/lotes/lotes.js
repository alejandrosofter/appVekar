Template.lotes.onCreated(function () {
  var currentPage = new ReactiveVar(Session.get('current-page') || 0);
  this.currentPage = currentPage;
  this.autorun(function () {
    Session.set('current-page', currentPage.get());
  });
});


Template.lotes.helpers({
 'precioMtr2': function(){
         var sett=Settings.findOne({clave:"precioMetroCuadrado"});
      return  new Spacebars.SafeString("<i>PRECIO MTR2 <b> $"+sett.valor+"</b> (modifica desde <b style='cursor:pointer' id='irDatosSistema'>admin/datos sistema)</b></i>");
    },
    'settings': function(){
        return {
 collection: Lotes.find(),
          rowClass: function(item) { if(item.estado=="NO DISPONIBLE")return "deshabilitado";
                                    if(item.estado=="RESERVADO")return "reservado"},
          currentPage: Template.instance().currentPage,
 rowsPerPage: 10,
 showFilter: true,
class: "table table-condensed",
 fields: [
   {
        key: 'idPropietario',
        label: 'Propietario',
      fn: function (value, object, key) 
     { 
       var prop=Entidades.findOne({_id:value});
       if(prop)  return prop.razonSocial
     
     },
      },
      {
        key: 'manzana',
        label: 'Manzana',
         sortOrder: 0, sortDirection: 'ascending',
         headerClass: 'col-md-1',
      },
   {
        key: 'parcela',
        label: 'Parcela',
      sortOrder: 1, sortDirection: 'ascending',
        headerClass: 'col-md-1',
      },
   {
        key: 'superficie',
        label: 'Superficie',
      fn: function (value, object, key) {return value+" mts2"},
        headerClass: 'col-md-2',
      },
    {
        key: 'superficie',
        label: '$ Estimado',
      fn: function (value, object, key) 
     { 
       var mtr2=0;
       var val=Settings.findOne({clave:"precioMetroCuadrado"});
       if(val)  mtr2=Number(val.valor);
       return "$ "+ (Number(value)*mtr2).formatMoney(2, '.', ',');
     //console.log(res)
     },
      },
   {
        key: 'estado',
        label: 'Estado',
        headerClass: 'col-md-1',
      },
   {
        label: '',
        headerClass: 'col-md-1',
        tmpl:Template.accionesLotes
      }
 ]
 };
    }
});
Template.nuevoLote.events({
    'submit form': function(){
         console.log("click agregar");
    }
});

Template.lotes.events({
   'click #irDatosSistema': function(ev) {
     Router.go('/datosSistema/');
  },
   "click #btnAgregar":function(){
     Router.go('/nuevoLote');
  },
  'mouseover tr': function(ev) {
    $("#tablaLotes").find(".acciones").hide();
    $(ev.currentTarget).find(".acciones").show();
    
  },
  'mousemove tr': function(ev) {
    
  },
  'click .delete': function(ev) {
    var id=this._id;
    swal({   title: "Estas Seguro de quitar?",   text: "Una vez que lo has quitado sera permanente!",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Si, borralo!",   closeOnConfirm: true }, function(){ Lotes.remove(id); swal("Quitado!", "El registro ha sido borrado", "success"); });

  },
  'click .update': function(ev) {
    Router.go('/modificarLote/'+this._id);
  },
  
});
AutoForm.hooks({
  'nuevoLote_': {
    onSuccess: function (operation, result, template) {
     swal("GENIAL!","Se ha ingresado la entidad!","success");
    },
    onError: function(operation, error, template) {
     swal("Ops!","ha ocurrido un erro al ingresar el registro:"+error,"error");
    }
  },
    'modificarLote_': {
    onSuccess: function (operation, result, template) {
     swal("GENIAL!","Se ha modificado la entidad!","success");
      Router.go('/lotes/');
    },
    onError: function(operation, error, template) {
     swal("Ops!","ha ocurrido un erro al ingresar el registro:"+error,"error");
    }
  }
});