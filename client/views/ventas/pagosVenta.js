var marcarPagado=function (idVenta,idPago)
{
	Meteor.call("marcarPagado",idVenta,idPago,function(err,res){
	console.log("ok+"+idVenta+"+idPago+"+idPago)
	});
}
AutoForm.hooks({
'modificaPagosVenta_': {

		onSuccess: function(operation, result, template) {
      UIBlock.unblock();
			swal("GENIAL!", "Se ha modificado el registro!", "success");
			Modal.hide();

		},
		onError: function(operation, error, template) {
			UIBlock.unblock();
			swal("Ops!", "ha ocurrido un error, por favor chequee los datos ingresados: " + error, "error");


		}
	},
'nuevoPagoVenta_': {
		before:{
      update: function(doc) {
				console.log(doc)
			},
		},
		  docToForm: function(doc, ss) {
		if(doc.pagosLote)
		for(var i=0;i<doc.pagosLote.length;i++)
			for(var j=0;j<doc.pagosLote[i].idDeudasLote.length;j++)
				marcarPagado(doc._id, doc.pagosLote[i].idDeudasLote[j])
			
		return doc
  },
		onSuccess: function(operation, result, template) {
			swal("GENIAL!", "Se ha ingresado el registro!", "success");
			Modal.hide();
			Router.go('/ventas');
			

		},
		onError: function(operation, error, template) {
UIBlock.unblock();
			swal("Ops!", "ha ocurrido un error, por favor chequee los datos ingresados: " + error, "error");


		}
	}
	
});

Template.pagosVenta.events({
	'click .delete': function(ev) {

    var id=Session.get('venta')._id;
		var res=this._id+"";
		var idDeuda=this.idDeudasLote;
		swal({   title: "Estas Seguro de quitar?",   text: "Una vez que lo has quitado sera permanente!",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Si, borralo!",   closeOnConfirm: false }, 
				 function(){ 
		 Meteor.call("quitarPagoVenta",id,res,idDeuda,function(err,res){
        if(!err)swal("Quitado!", "El registro ha sido borrado", "success");
        else swal("Ops...", "Ha ocurrido un error para quitar! .. por favor chekear nuevamente", "error");
      });
			
		});
  
  },

	'click .update': function(ev) {
    var val=this;
    Modal.show('modificaPagoVenta',function(){
			return val;
			
		});
  },
	
});
var calcularImportePaga=function(importeNuevo)
{
	
	var importe=(Session.get("importeParcialPago")*1)+importeNuevo;

		var porcentaje=Number($("#porcentajeDescuento").val())
		console.log(porcentaje)
		if(porcentaje===0)return importe.toFixed(2);
		var descuento=importe*porcentaje;
		var total=importe-descuento;
		return total.toFixed(2);
}
Template.nuevoPagoVenta.helpers({
	"datos":function()
	{
		return Session.get("venta")
	},
	"importePaga":function()
	{
		return Session.get("importeParcialPago")
	}
})
Template.nuevoPagoVenta.onCreated(function () {
	Session.set("importeParcialPago",0);
	console.log(this)
	consultarDatosDeudas(this.data._id)
        
})
var consultarDatosDeudas=function(id)
{
	Meteor.call("getDeudas",id,function(err,data){
			var ret= _.map(data, function (c, i) {
				var fecha=c.fechaVto.toLocaleDateString();
	          var lab="CUOTA: "+c.cuota+" $: "+c.importe.formatMoney(2,",",".")+" Vto: "+fecha+"";
				console.log(c)
				return {"id":c.idPago,"text":lab,"importe":c.importe,"_id":c._id};
	        });
	        console.log(ret)
	 		$('#idDeudasLote').select2({data:ret}).trigger('change');
		
		});
}
Template.modificaPagoVenta.onCreated(function () {
  var datos=this.data;
	consultarDatosDeudas(Session.get("venta")._id)
        
})
Template.modificaPagoVenta.helpers({
	"datos":function()
	{
		return Session.get("venta")
	}
})
Template.nuevoPagoVenta.events({
	"select2:select #idDeudasLote":function(ev,dat){

		var aux=calcularImportePaga(ev.params.data.importe);
		Session.set("importeParcialPago",aux);
	},
	"change #porcentajeDescuento":function(ev,dat){
		var aux=calcularImportePaga(ev.params.data.importe);
		Session.set("importeParcialPago",aux);
	},
	"select2:unselect #idDeudasLote":function(ev,dat){
			var aux=calcularImportePaga(-ev.params.data.importe);
		Session.set("importeParcialPago",aux);
	}
})
Template.modificaPagoVenta.events({
	"select2:select #idDeudasLote":function(ev,dat){

		var aux=calcularImportePaga(ev.params.data.importe);
		Session.set("importeParcialPago",aux);
	},
	"change #porcentajeDescuento":function(ev,dat){
		var aux=calcularImportePaga(ev.params.data.importe);
		Session.set("importeParcialPago",aux);
	},
	"select2:unselect #idDeudasLote":function(ev,dat){
			var aux=calcularImportePaga(-ev.params.data.importe);
		Session.set("importeParcialPago",aux);
	}
})
Template.pagosVenta.events({
  'click #btnAgregar': function(ev) {
    var act=this;
    Modal.show('nuevoPagoVenta',function(){ return act; });
  },
	 'click #idDeudasLote': function(ev) {
    var act=this;
    console.log(ev)
		 console.log(this)
  },
	
	
    
});
var buscarIndice=function(busca)
{
	var arr=Session.get("venta").pagosLote;
	for (var i = 0; i < arr.length; i++)
		if(arr[i]._id==busca)return i;
	return -1;
}

Template.modificaPagoVenta.helpers({

	"etiquetaFecha":function(){
		var idSeleccion=this._id;
		var ind=buscarIndice(idSeleccion);
	return 'pagosLote.'+ind+'.fechaPago';
	},
	"etiquetaDetalle":function(){
		var idSeleccion=this._id;
		var ind=buscarIndice(idSeleccion);
	return 'pagosLote.'+ind+'.detallePago';
	},
	"etiquetaPorcentajeDescuento":function(){
		var idSeleccion=this._id;
		var ind=buscarIndice(idSeleccion);
	return 'pagosLote.'+ind+'.porcentajeDescuento';
	},
	"etiquetaTipoComprobante":function(){
		var idSeleccion=this._id;
		var ind=buscarIndice(idSeleccion);
	return 'pagosLote.'+ind+'.tipoComprobante';
	},
  "eti_deudasLote":function(){
		var idSeleccion=this._id;
		var ind=buscarIndice(idSeleccion);
	return 'pagosLote.'+ind+'.idDeudasLote';
	},
	 "etiquetaImporte":function(){
		var idSeleccion=this._id;
		var ind=buscarIndice(idSeleccion);
	return 'pagosLote.'+ind+'.importePago';
	},
});
var getDetalleDeuda=function(idDeuda)
{
	var deudas=Session.get("venta").deudasLote;
	for(var i=0;i<deudas.length;i++)
		if(deudas[i]._id===idDeuda)return "<b>CUOTA:</b> "+deudas[i].cuota+" con <b>vto:</b> "+deudas[i].fechaVto.getFecha();
}
Template.pagosVenta.helpers({
	'settings': function(){
        return {
 collection: this.pagosLote,
 rowsPerPage: 10,
 class: "table table-condensed",
 showFilter: false,
					
 fields: [
	 	{
					key: 'fechaPago',
					label: 'Fecha',
					headerClass: 'col-md-2',
					sortOrder: 0, sortDirection: 'descending' ,hidden: true
				}, 
      {
        key: 'fechaPago',
        label: 'Fecha',
				headerClass: 'col-md-1',
        fn: function (value, object, key) {
          var d=new Date(value);
           return d.toLocaleDateString();
         }
      },
	   {
        key: 'tipoComprobante',
        label: 'Tipo Comprobante',
        fn: function (value, object, key) {
       //   var d=new Date(value);
           return value;
         }
      },
	  {
        key: 'idDeudasLote',
        label: 'Cuotas pagadas...',
        fn: function (value, object, key) {
					var cad="";
           for(var i=0;i<value.length;i++){
						 cad+=getDetalleDeuda(value[i])
					 }
           return new Spacebars.SafeString(cad);
         }
      },
	  {
        key: 'porcentajeDescuento',
        label: '% descuento',
        fn: function (value, object, key) {
       //   var d=new Date(value);
           return value;
         }
      },
	  {
        key: 'importePago',
        label: '$ Importe',
		
				headerClass: 'col-md-2',
        fn: function (value, object, key){return "$ "+value.formatMoney(2,",",".")},
      },
   
    
    {
        label: '',
        headerClass: 'col-md-1',
        tmpl:Template.accionesPagosVentas
      }
 ]
 };
    },
	"items":function(){
		var acts=new Meteor.Collection(this.actividades);
		return this.actividades;
	},
	
	'mouseover tr': function(ev) {
    $("#tablaPagosVentas").find(".acciones").hide();
   $("#tablaPagosVentas").find(".acciones").show();
    
  },
	
});