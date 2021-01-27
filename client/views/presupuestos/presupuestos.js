Template.presupuestos.onCreated(function () {
  var currentPage = new ReactiveVar(Session.get('current-pagePresupuestos') || 0);
  this.currentPage = currentPage;
  this.autorun(function () {
    Session.set('current-page', currentPage.get());
  });
});
Template.nuevoPresupuesto.onCreated(function () {
  Meteor.call("getValorConfig","nroPresupuesto",function(err,res){
    $("#nroPresupuesto").val(res)
  });
});

Template.presupuestos.helpers({
    'settings': function(){
        return {
 collection: Presupuestos.find(),
           currentPage: Template.instance().currentPage,
           rowClass: function(item) { if(item.estado=="SALDADO")return "deshabilitado" },
 rowsPerPage: 10,
 showFilter: true,
class: "table table-condensed",
 fields: [
   {
        key: 'nroPresupuesto',
        label: 'Nro',
     
         fn: function (value, object, key) {return ""+String(value).lpad("0",5)},
     
         headerClass: 'col-md-1',
      },
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
        key: 'tasaInteres',
        label: 'Interes',
         fn: function (value, object, key) {return ""+value},
     
         headerClass: 'col-md-1',
      },
      {
        key: 'importeEntrega',
        label: '$ Entrega',
         fn: function (value, object, key) {return "$ "+value.formatMoney(2,",",".")},
     
         headerClass: 'col-md-1',
      },
   {
        key: 'cantidadCuotas',
        label: 'Cuotas',
         fn: function (value, object, key) {return value},
     
         headerClass: 'col-md-1',
      },
    {
        key: 'importe',
        label: '$ Importe',
         fn: function (value, object, key) {return "$ "+value.formatMoney(2,",",".")},
     
         headerClass: 'col-md-2',
      },
 
   {
        key: 'estado',
        label: 'Estado',
      headerClass: 'col-md-1',
      },
   {
        label: '',
        headerClass: 'col-md-1',
        tmpl:Template.accionesPresupuestos
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
Template.nuevoPresupuesto.helpers({
    'precioMtr2': function(){
         var sett=Settings.findOne({clave:"precioMetroCuadrado"});
      return  new Spacebars.SafeString("<i>PRECIO MTR2 <b> $"+sett.valor+"</b> (modifica desde <b style='cursor:pointer' id='irDatosSistema'>admin/datos sistema)</b></i>");
    },
  
});

Template.nuevoPresupuesto.events({
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
Template.modificarPresupuesto.events({
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
Template.itemPresupuesto.helpers({
  "fecha":function(){
    return this.fecha.getFecha()
  },
  "importe":function(){
    return this.importe.formatMoney(2)
  },
})
Template.imprimirPresupuesto.helpers({
  "razonSocial":function(){
    var compr=Entidades.findOne({_id:this.idEntidad});
    if(compr)return compr.razonSocial;
    return "S/N"
  },
   "lote":function(){
    var elem=Lotes.findOne({_id:this.idLote});
    if(elem)return "MANZANA: "+elem.manzana+" PARCELA: "+elem.parcela+" ";
    return "S/N"
  },
  "importe":function(){
    return this.importe.formatMoney(2)
  },
  "fechaLetras":function(){
    return this.fecha.getFecha()
  },
  "vto":function(){
    return this.fecha.getFecha()
  },
  "valorCuota":function(){
    return this.importeCuota.formatMoney(2)
  },
  "entrega":function(){
    return this.importeEntrega.formatMoney(2)
  },
  "interes":function(){
    return this.tasaInteres
  },
  "cuotas":function(){
    return this.cantidadCuotas
  },
  "cuotasPresupuesto":function(){
    var salida=[];
    var fechaAux=this.fechaPrimerVto;
    var  importeAux=this.importeCuota;
    for(var i=0;i<this.cantidadCuotas;i++){
      var aux={nroCuota:(i+1),fecha:fechaAux,importe:importeAux};
      salida.push(aux);
      fechaAux=fechaAux.addMonth(1);
    }
    return salida
  }
})
Template.imprimirPresupuesto.events({
    "click #imprimir":function(){
    import "/public/importar/printThis.js";
      console.log(this)
    $("#printable").printThis({importCss:true,header:""})
  },
})
Template.presupuestos.events({
   "click #btnAgregar":function(){
     Router.go('/nuevoPresupuesto');
  },
  'mouseover tr': function(ev) {
    $("#tablaPresupuestos").find(".acciones").hide();
    $(ev.currentTarget).find(".acciones").show();
    
  },
  
  'click .delete': function(ev) {
    var id=this._id;
    swal({   title: "Estas Seguro de quitar?",   text: "Una vez que lo has quitado sera permanente!",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Si, borralo!",   closeOnConfirm: true }, function(){ Presupuestos.remove(id); swal("Quitado!", "El registro ha sido borrado", "success"); });

  },
  'click .update': function(ev) {
    Router.go('/modificarPresupuesto/'+this._id);
  },
  'click .imprimir': function(ev) {
    var act=this;
     Modal.show('imprimirPresupuesto',function(){ return act; });
 
  },
   'click .pagos': function(ev) {
     Session.set("venta",this);
    Router.go('/pagosPresupuesto/'+this._id);
  },
  
});
var cargarDeudas=function(idPresupuesto)
{
  var venta=Presupuestos.findOne({_id:idPresupuesto});
  var fecha=venta.fechaPrimerVto;
  for(var i=1;i<=venta.cantidadCuotas;i++){
    var deuda={_id:Meteor.uuid(),cuota:i,importe:venta.importeCuota,fechaVto:fecha,estado:"PENDIENTE"};
  Presupuestos.update({_id:idPresupuesto},{
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
  'nuevoPresupuesto_': {
    onSuccess: function (operation, result, template) {
     swal("GENIAL!","Se ha ingresado el registro!","success");
      var elem=Presupuestos.findOne({_id:result});
      Meteor.call("incrementaPresupuesto",function(err,res){
        Modal.show('imprimirPresupuesto',function(){ return elem; });
      Router.go('/presupuestos/');
})
       
    },
    onError: function(operation, error, template) {
     swal("Ops!","ha ocurrido un erro al ingresar el registro:"+error,"error");
    }
  },
    'modificarPresupuesto_': {
    onSuccess: function (operation, result, template) {
     swal("GENIAL!","Se ha modificado el registro!","success");
      Router.go('/presupuestos/');
    },
    onError: function(operation, error, template) {
     swal("Ops!","ha ocurrido un erro al ingresar el registro:"+error,"error");
    }
  }
});