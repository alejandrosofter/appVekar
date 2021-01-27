var calcularImporte=function(tipoComprobante,arr)
{
	var sum=0;
	for(var i=0;i<arr.length;i++)
		if(arr[i]['tipoComprobante']==tipoComprobante) sum+=arr[i]["importePago"];
	
	return sum
}
var consultarPagosPendientes=function()
{
	Meteor.call("consultarPagosPendientes",false,function(err,res){
		Session.set("pagosLiquidacionPendientes",res);
		console.log(res)
		$("#importeA").val(calcularImporte("A",res));
		$("#importeB").val(calcularImporte("B",res));
	})
}
var consultarPagosFiduciarios=function()
{
	var importeA=$("#importeA").val()*1;
	var importeB=$("#importeB").val()*1;
	var fidu=Fiduciarios.find({}).fetch();

	var arr=[];
	for (var i=0;i<fidu.length;i++){
		var auxA=0;var auxB=0;
		var fiduciario=fidu[i];
		var porc=fiduciario.porcentaje/100;
		auxA=importeA*porc;auxB=importeB*porc;
		var tot=auxA+auxB;
		arr.push({_id:(new Date().getTime()+i)+"", fiduciario:fiduciario.razonSocial,idFiduciario:fiduciario._id, porcentaje:fiduciario.porcentaje,importeA:auxA,importeB:auxB})
		console.log(arr)
	}
	Session.set("pagosLiquidacionFiduciarios",arr);

}
var consultarPagosPropietario=function()
{
	Meteor.call("consultarPagosPendientes",true,function(err,res){
	var arr=[];
	for(var i=0;i<res.length;i++)
	arr.push({_id:(new Date().getTime()+i)+"",tipoComprobante:res[i]._id.tipoComprobante,idPropietario:res[i]._id.idPropietario,importeTotal:res[i].total})
	console.log(arr)
	Session.set("pagosLiquidacionPropietarios",arr);
		
	})
}
Template.nuevaLiquidacion.rendered=function(){
	consultarPagosPendientes();
	consultarPagosPropietario();
	consultarPagosFiduciarios()
}
Template.nuevaLiquidacion.helpers({

 'settings': function(){

        return {
 collection: Session.get("pagosLiquidacionPendientes"),
 rowsPerPage: 10,
 showFilter: false,
class: "table table-condensed",
 fields: [
   
   {
        key: 'fechaPago',
        label: 'Fecha',
         headerClass: 'col-md-1',
        fn: function (value, object, key){var d=new Date(value);return d.toLocaleDateString()},
      },
         {
        key: 'entidad',
        label: 'Comprador',
         fn: function (value, object, key) {
			if(value)return value.razonSocial;
			return "s/n"
},
        headerClass: 'col-md-2',
      },
   {
        key: 'importePago',
        label: '$ Importe',
         fn: function (value, object, key) {return "$ "+value.formatMoney(2,",",".")},
        headerClass: 'col-md-2',
      },
   {
        key: 'tipoComprobante',
        label: 'Tipo comp.',
        headerClass: 'col-md-1',
      },
 ]
 };
    },
    'settingsPropietario': function(){

        return {
 collection: Session.get("pagosLiquidacionPropietarios"),
 rowsPerPage: 10,
 showFilter: false,
class: "table table-condensed",
 fields: [
   
   {
        key: 'idPropietario',
        label: 'Propietario',
        fn: function (value, object, key) {
			var prop= Propietarios.findOne({_id:value});
			if(prop)return prop.razonSocial;
			return "S/N"
		},
      },
       

   {
        key: 'tipoComprobante',
        label: 'Tipo comp.',
        headerClass: 'col-md-1',
      },
         {
        key: 'importeTotal',
        label: '$ Importe',
         fn: function (value, object, key) {return "$ "+value.formatMoney(2,",",".")},
        headerClass: 'col-md-3',
      },
 ]
 };
    },
     'settingsFiduciario': function(){

        return {
 collection: Session.get("pagosLiquidacionFiduciarios"),
 rowsPerPage: 10,
 showFilter: false,
class: "table table-condensed",
 fields: [
   
   {
        key: 'fiduciario',
        label: 'Fiduciario',
        fn: function (value, object, key) {
			return value
		},
      },
       

   {
        key: 'porcentaje',
        label: '%',
        headerClass: 'col-md-1',
      },
         {
        key: 'importeA',
        label: '$ Importe A',
         fn: function (value, object, key) {return "$ "+value.formatMoney(2,",",".")},
        headerClass: 'col-md-2',
      },
      {
        key: 'importeB',
        label: '$ Importe B',
         fn: function (value, object, key) {return "$ "+value.formatMoney(2,",",".")},
        headerClass: 'col-md-2',
      },
 ]
 };
    }
})
Template.liquidaciones.helpers({
    'settings': function(){
        return {
 collection: Liquidaciones.find(),
 rowsPerPage: 10,
 showFilter: true,
class: "table table-condensed",
 fields: [
   
   {
        key: 'fecha',
        label: 'Fecha',
        fn: function (value, object, key) { var d=new Date(value); return d.toLocaleDateString(); }
      },
   {
        key: 'importeA',
        label: '$ Importe A',
        headerClass: 'col-md-2',
      },
       {
        key: 'importeB',
        label: '$ Importe B',
        headerClass: 'col-md-2',
      },
   {
        label: '',
        headerClass: 'col-md-2',
        tmpl:Template.accionesLiquidaciones
      }
 ]
 };
    }
});
Template.nuevaLiquidacion.events({
    'submit form': function(){
         console.log("click agregar");
    }
});

Template.cadaPagoPropietario.helpers({
	"importe":function(){
	return this.importeTotal.formatMoney(2,".");
	},
	"propietario":function(){
		console.log(this)
		var res= Propietarios.findOne({_id:this.idPropietario});
		console.log(res)
		if(res)return res.razonSocial
		return "S/N"
		}
})
var getSumatoria=function(arr,campo)
{
	var sum=0;
	for(var i=0;i<arr.length;i++) sum+=arr[i][campo];
	return sum;
}
Template.cadaPagoFIDUCIARIO.helpers({
	"importeA":function(){
	return this.importeA.formatMoney(2,".");
	},
	"importeB":function(){
	return this.importeB.formatMoney(2,".");
	},
	"total":function(){
	return (this.importeA+this.importeB).formatMoney(2,".");
	},
	
	"fiduciario":function(){
	var res= Fiduciarios.findOne({_id:this.idFiduciario});
	if(res)return res.razonSocial;
	return "S/N"
	}
})

Template.cadaPagoPagos.helpers({
	"comprador":function(){
	var comp=Entidades.findOne({_id:this.idEntidad});
	if(comp)return comp.razonSocial;
	return "S/N"
	},
	"lote":function(){
	var lote=Lotes.findOne({_id:this.idLote});
	if(lote)return "MANZANA: "+lote.manzana+" PARCELA: "+lote.parcela;
	return "S/N"
	},
	"importe":function()
	{
		return this.importePago.formatMoney(2,".")
	}
})
Template.imprimirLiquidacion.events({
"click #btnAceptar":function()
{
var Printer = require('print-js');
	printJS({ printable: 'printable', type: 'html' })
}
})
Template.imprimirLiquidacion.helpers({

	"fecha":function(){
	var d=new Date(this.fecha);
	console.log(this)
	return d.toLocaleDateString()
	
	}
})
Template.liquidaciones.events({
  "click #btnAgregar":function(){
     Router.go('/nuevaLiquidacion/');
  },
  'mouseover tr': function(ev) {
    $("#tablaLiquidaciones").find(".acciones").hide();
    $(ev.currentTarget).find(".acciones").show();
    
  },
  'mousemove tr': function(ev) {
    
  },
  'click .delete': function(ev) {
    var id=this._id;
    swal({   title: "Estas Seguro de quitar?",   text: "Una vez que lo has quitado sera permanente!",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Si, borralo!",   closeOnConfirm: false }, 
				 function(){ 
		 Meteor.call("quitarLiquidacion",id,function(err,res){  swal("Quitado!", "El registro ha sido borrado", "success");  })
			
		});
		

  },
  'click .update': function(ev) {
         Router.go('/modificarLiquidacion/');
  },
  'click .imprimir': function(ev) {
  var data=this;
        Modal.show('imprimirLiquidacion',function(){ return data; });
  },
  
});
AutoForm.hooks({
  'nuevaLiquidacion_': {
before:{
      insert: function(doc) {
			doc.pagosPropietarios=Session.get("pagosLiquidacionPropietarios")
			doc.pagosFiduciarios=Session.get("pagosLiquidacionFiduciarios")
			doc.pagos=Session.get("pagosLiquidacionPendientes")
		return doc
			},
		},
		after:{
      insert: function(id,doc) {
			Meteor.call("actualizaEstadoPagos",doc,"CANCELADO",function(err,res){
			
			})
			},
		},
    onSuccess: function (operation, result, template) {
     swal("GENIAL!","Se ha ingresado la entidad!","success");
     Router.go('/liquidaciones/');
    },
    onError: function(operation, error, template) {
     swal("Ops!","ha ocurrido un erro al ingresar el registro:"+error,"error");
     Modal.hide();
    }
  },
    'modificarLiquidacion_': {
    onSuccess: function (operation, result, template) {
     swal("GENIAL!","Se ha modificado la entidad!","success");
   
      
    },
    onError: function(operation, error, template) {
     swal("Ops!","ha ocurrido un erro al ingresar el registro:"+error,"error");
    }
  }
});