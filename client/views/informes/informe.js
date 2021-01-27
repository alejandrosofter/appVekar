var consultarDeudas=function(agrupar,coleccion)
{
	Meteor.call("informeDeudores",agrupar,function(err,res){
	    console.log(res)
	     console.log(coleccion)
		Session.set(coleccion,res);
	})
}
Template.informe.rendered=function () {
	consultarDeudas(false,"informeDeudores");
   
};
Template.enviarMail.rendered=function () {
	consultarDeudas(true,"entidadesDeudores");
   
};
Template.cadaDeudorMail.helpers({
   
     "total":function()
    {
        return this.importe.formatMoney(2,".")
    }
})

Template.enviarMail.helpers({
    "deudoresMail":function()
    {
        return Session.get("entidadesDeudores")
    },
    
    
})
Template.enviarMail.events({
  "click #btnEnviar":function(){
       UIBlock.block('Enviando EMAILS, aguarde un momento...');
      Meteor.call("enviarMailDeudores",Session.get("entidadesDeudores"),function(err,res){
         UIBlock.unblock();
         swal("GENIAL!","Se han enviado los emails!","success")
          
      })
  }  
})
Template.informe.helpers({
'settingsLiquidaciones': function(){
        return {
 collection: Liquidaciones.find(),
currentPage: Template.instance().currentPage,
 rowsPerPage: 40,
 showNavigationRowsPerPage:false,
//  rowClass: function(item) { if(item.estado=="CANCELADO")return "deshabilitado" },
 showFilter:false,
class: "table table-condensed",
 fields: [

      {
        key: 'fecha',
        label: 'Fecha',
        fn: function (value, object, key){var d=new Date(value);return d.toLocaleDateString()},
      },
      
       {
        key: 'importeA',
        label: '$ A',
        fn: function (value, object, key){return value.formatMoney(2,".")},
      },
      {
        key: 'importeB',
        label: '$ B',
        fn: function (value, object, key){return value.formatMoney(2,".")},
      },
       
    
   
 ]
 };
    },
    'settingsDeudores': function(){
        return {
 collection: Session.get("informeDeudores"),
currentPage: Template.instance().currentPage,
 rowsPerPage: 40,
 showNavigationRowsPerPage:false,
//  rowClass: function(item) { if(item.estado=="CANCELADO")return "deshabilitado" },
 showFilter:false,
class: "table table-condensed",
 fields: [

      {
        key: 'fechaVto',
        label: 'Vto',
        fn: function (value, object, key){var d=new Date(value);return d.toLocaleDateString()},
      },
      {
        key: 'entidad',
        label: 'Comprador',
        fn: function (value, object, key){return value.razonSocial+" tel."+value.telefono},
      },
      {
        key: 'detalle',
        label: 'Detalle',
        fn: function (value, object, key){return "CUOTA "+object.cuota+" por LOTE manzana: "+object.lote.manzana+" parcela: "+object.lote.parcela},
      },
       {
        key: 'importe',
        label: '$ Importe',
        fn: function (value, object, key){return value.formatMoney(2,".")},
      },
       
    
   
 ]
 };
    }
})

Template.informe.events({
   "click #btnAgregar":function(){
     Router.go('/nuevaVenta');
  },
  'mouseover tr': function(ev) {
    $("#tablaVentas").find(".acciones").hide();
    $(ev.currentTarget).find(".acciones").show();
    
  },
  
  'click .delete': function(ev) {
    var id=this._id;
    swal({   title: "Estas Seguro de bajar la venta?",   text: "Una vez que lo has quitado sera permanente!",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Si, borralo!",   closeOnConfirm: true }, function(){
    Meteor.call("quitarVenta",id,function(err,res){
       swal("BAJA OK!", "El registro ha sido modificado", "success"); 
    })
 });

  },
  'click .update': function(ev) {
    Router.go('/modificarVenta/'+this._id);
  },
  'click #btnEnviar': function(ev) { 
      var val=this;
    Modal.show('enviarMail',function(){
			return val;
			
		});
  },
   'click .pagos': function(ev) {
     Session.set("venta",this);
    Router.go('/pagosVenta/'+this._id);
  },
  
  
});