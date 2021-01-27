Template.ventas.onCreated(function () {
  var currentPage = new ReactiveVar(Session.get('current-pageVentas') || 0);
  this.currentPage = currentPage;
  this.autorun(function () {
    Session.set('current-page', currentPage.get());
  });
});
Template.deudasVentas.helpers({
'settings': function(){
console.log(this)
var arr=this.deudasLote
        return {
 collection: arr,
currentPage: Template.instance().currentPage,
 rowsPerPage: 40,
  rowClass: function(item) { if(item.estado=="CANCELADO")return "deshabilitado" },
 showFilter:false,
class: "table table-condensed",
 fields: [
  {
        key: 'cuota',
        label: 'Cuota',
      },
    
      {
        key: 'fechaVto',
        label: 'Fecha Vto.',
        fn: function (value, object, key){var d=new Date(value);return d.toLocaleDateString()},
      },
      
       {
        key: 'importe',
        label: 'Importe',
        fn: function (value, object, key){return value.formatMoney(2,".")},
      },
       {
        key: 'estado',
        label: 'Estado',
      },
    
   
 ]
 };
    }
})
Template.accionesVentas.helpers({
"estaActivo":function()
{
	return this.estado=="PAGANDO"
}
})
Template.ventas.helpers({
    'settings': function(){
        return {
 collection: Ventas.find(),
           currentPage: Template.instance().currentPage,
           rowClass: function(item) { if(item.estado=="SALDADO")return "deshabilitado";if(item.estado=="BAJA")return "deshabilitado" },
 rowsPerPage: 10,
 showFilter: true,
class: "table table-condensed",
 fields: [
      {
        key: 'fecha',
        label: 'Fecha',
         fn: function (value, object, key){var d=new Date(value);return d.toLocaleDateString()},
         headerClass: 'col-md-1',
      },
    {
        key: 'idEntidad',
        label: 'Comprador',
      fn: function (value, object, key) 
     { 
       var prop=Entidades.findOne({_id:value});
       if(prop)  return prop.razonSocial
     
     },
      },
    {
        key: 'idLote',
        label: 'Lote',
      fn: function (value, object, key) 
     { 
       var lote=Lotes.findOne({_id:value});
       if(lote)  return "MANZANA: "+lote.manzana+" PARCELA:"+lote.parcela+" SUP:"+lote.superficie+" MTR2"
     
     },
       headerClass: 'col-md-3',
      },

      {
        key: 'importe',
        label: '$ Importe',
         fn: function (value, object, key) {return "$ "+value.formatMoney(2,",",".")},
     
         headerClass: 'col-md-2',
      },
   {
        key: 'pagosLote',
        label: '$ PAGADO',
         fn: function (value, object, key) {
           var sum=0;
           if(value)
           for(var i=0;i<value.length;i++)
             sum+=value[i].importePago
           return "$ "+sum.formatMoney(2,",",".")
         },
     
         headerClass: 'col-md-2',
      },
   {
        key: 'estado',
        label: 'Estado',
      headerClass: 'col-md-1',
      },
   {
        label: '',
        headerClass: 'col-md-2',
        tmpl:Template.accionesVentas
      }
 ]
 };
    }
});
var calcularCuota=function()
{
  var base=Number($("#importe").val())-Number($("#importeEntrega").val());
  var interes=Number($("#tasaInteres").val());
  var cantidadCuotas=Number($("#cantidadCuotas").val());
  if(cantidadCuotas===0){
    $("#valorCuota").html("$ CUOTA $...")
    return 0;
  }
  var importeInteres=(interes/100)*base;
  var interesMensual=importeInteres/cantidadCuotas;
  var valorCuota=(base+importeInteres)/cantidadCuotas;
 
  $("#importeCuota").val(valorCuota);
  $("#valorCuota").html("CUOTA Mensual <b>$ "+valorCuota.formatMoney(2,",",".")+"</b>")
  $("#interesMensual").html("INTERES. Mensual <b>$ "+interesMensual.formatMoney(2,",",".")+"</b>")
  $("#interesAplicado").html("INTERES Total <b>$ "+importeInteres.formatMoney(2,",",".")+"</b>")
  return valorCuota;
}
Template.nuevaVenta.helpers({
  "idLote":function()
  {
    return this._id
  },
    'precioMtr2': function(){
         var sett=Settings.findOne({clave:"precioMetroCuadrado"});
      return  new Spacebars.SafeString("<i>PRECIO MTR2 <b> $"+sett.valor+"</b> (modifica desde <b style='cursor:pointer' id='irDatosSistema'>admin/datos sistema)</b></i>");
    }
});

Template.nuevaVenta.events({
  'click #irDatosSistema': function(ev) {
     Router.go('/datosSistema/');
  },
  'change #importeEntrega': function(ev) {
    calcularCuota()
  },
  'change #tasaInteres': function(ev) {
    calcularCuota()
  },
  'change #importe': function(ev) {
    calcularCuota()
  },
  'change #cantidadCuotas': function(ev) {
    calcularCuota()
  },
  'change #idLote': function(ev) {
    var lot=Lotes.findOne({_id:$("#idLote").val()});
    var sett=Settings.findOne({clave:"precioMetroCuadrado"});
    if(lot){
      var precioMtr2=sett.valor;
    var importe=lot.superficie*precioMtr2;
    $("#importe").val(importe.toFixed(2))
}
    
   
  },
})
Template.modificarVenta.events({
  'change #idLote': function(ev) {
    var lot=Lotes.findOne({_id:this.value});
    var sett=Settings.findOne({clave:"precioMetroCuadrado"});
     if(lot){
      var precioMtr2=sett.valor;
    var importe=lot.superficie*precioMtr2;
    $("#importe").val(importe.toFixed(2))
}
  },
})
Template.ventas.events({
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
  'click .deudas': function(ev) {
      var val=this;
    Modal.show('deudasVentas',function(){
			return val;
			
		});
  },
   'click .pagos': function(ev) {
     Session.set("venta",this);
    Router.go('/pagosVenta/'+this._id);
  },
  
  
});
var cargarDeudas=function(idVenta)
{
  var venta=Ventas.findOne({_id:idVenta});
  var fecha=venta.fechaPrimerVto;
  for(var i=1;i<=venta.cantidadCuotas;i++){
    var deuda={_id:Meteor.uuid(),cuota:i,importe:venta.importeCuota,fechaVto:fecha,estado:"PENDIENTE"};
  Ventas.update({_id:idVenta},{
      $push: {
        deudasLote: deuda
      }
    }, {
      getAutoValues: false
    });
    fecha=fecha.addMonth(1);
  }
  
}
AutoForm.hooks({
  'nuevaVenta_': {
    onSuccess: function (operation, result, template) {
     swal("GENIAL!","Se ha ingresado el registro!","success");
      var venta=Ventas.findOne({_id:result});
      DatosMapa.update({_id:venta.idLote},{$set:{estado:"NO DISPONIBLE"}});
      cargarDeudas(result)
      Modal.hide()
    },
    onError: function(operation, error, template) {
     swal("Ops!","ha ocurrido un erro al ingresar el registro:"+error,"error");
    }
  },
    'modificarVenta_': {
    onSuccess: function (operation, result, template) {
     swal("GENIAL!","Se ha modificado el registro!","success");
      Router.go('/ventas/');
    },
    onError: function(operation, error, template) {
     swal("Ops!","ha ocurrido un erro al ingresar el registro:"+error,"error");
    }
  }
});