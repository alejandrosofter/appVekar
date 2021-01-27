var totalVentas=function(ano,mes,estado,agrupa)
{
  UIBlock.block('Consultando datos, aguarde un momento...');
  Meteor.call("totalVentas",ano,mes,estado,agrupa,function(err,res){
      Session.set("itemsSeleccionVentas",res);
    console.log(res);
     	UIBlock.unblock();
    });
}
var consultarDetalleMes=function(mes,tipo)
{
  UIBlock.block('Consultando datos, aguarde un momento...');
  Meteor.call("totalVentas",Session.get("anoSeleccion"),mes,null,null,function(err,res){
      Session.set("itemsSeleccionVentas",res);
    console.log(res);
     	UIBlock.unblock();
    });
}
var consultarMeses=function(){
  Meteor.call("mensualVentas",Number($("#anoSeleccion").val()),null,true,function(err,res){
      Session.set("resultadoMeses",res);
      	UIBlock.unblock();
    });
}

var consultarDetalleDias=function(mes){
   UIBlock.block('Consultando datos, aguarde un momento...');
  Meteor.call("totalVentasDias",Number($("#anoSeleccion").val()),mes,Session.get("diaSeleccion").dia,false,function(err,res){
    console.log(res)
      Session.set("detalleDiasMes",res);
      	UIBlock.unblock();
    });
}
var consultarTotalesAno=function()
{
  UIBlock.block('Consultando datos, aguarde un momento...');
  Meteor.call("totalVentas",Session.get("anoSeleccion"),null,null,true,function(err,res){
      Session.set("totalVentas",res);
      consultarMeses();
    });
}
 var totalMes=function()
  {
   var sum=0;
   Session.get("itemsSeleccionVentas").forEach(function(item,ind){
      sum+=item.importe;
      console.log(sum)
    });
    return sum;
}
Template.filaFiduciarios.helpers({
  "fiduciario":function(){
     return this.razonSocial;
    
  },
   "importePagar":function(){
     var porc= Number(this.porcentaje)/100;
    var sum=totalMes();
     return (sum*porc).formatMoney(2,',','.');
  },

        });

Template.detalleMesVentas.helpers({
  "tituloMes":function(){
    return(Session.get("mesSeleccion").mesLetras);
  },
   "itemsFiduciarios":function(){
     return Fiduciarios.find();
    
  },
  "tituloDia":function(){
    return(Session.get("diaSeleccion").dia)+" "+(Session.get("diaSeleccion").diaLetras);
  },
  "totalMes":function(){
   var sum=totalMes();
    return sum.formatMoney(2,',','.');
  },
})
Template.informeLotes.helpers({
  "meses":function(){
   
    return Session.get("resultadoMeses")
  },
  "dias":function(){
   
    return Session.get("diasMes")
  },
  "anoSeleccion":function(){
    return Session.get("anoSeleccion");
  },
  "mesSeleccion":function(){
    return Session.get("mesSeleccion");
  },
  "itemsSeleccion":function(){
    return Session.get("itemsSeleccionVentas");
  },
  "claseTotalAno":function(){
   
   if(Session.get("totalVentas")!==null)return "label-primary";
    return "label-default";
  },
  
  "totalAno":function(){
    
    if(Session.get("totalVentas")===null)return 0;
    return  Session.get("totalVentas")[0].total.toFixed(2);
  },
});
Template.informeLotes.onRendered(function(){
  var d=new Date();
   Session.set("anoSeleccion",d.getFullYear());
  consultarTotalesAno();
});
Template.cadaMesVentas.helpers({
  "mes":function(){
    return(this.mes.mesLetras);
  },
   
  "totalMes":function(){
   
    if(this.mes.data!==null)return this.mes.data[0].total.toFixed(2);
    return 0;
  },
  "claseTotalMes":function(){
   
    if(this.mes.data!==null)return "label-primary";
    return "label-default";
  },
  
});
Template.filaDetalleMesSeleccionVentas.helpers({
  "socio":function(){
    return this.apellido.toUpperCase()+" "+this.nombre;
  },
   "fecha":function(){
   var d=new Date(this.fecha);
     return d.toLocaleDateString();
  },
  "importeDet":function(){
   return this.importe.formatMoney(2,',','.')
  },
  "detalle":function(){
    var comp=this.comprador.length>0?this.comprador[0].razonSocial:"s/n";
    var det=!this.detalle?"s/det":this.detalle;
    return det+" ("+comp+")";
   
    
  
  },
   "imagenSocio":function(){
    if(this.imagen===null) return "-"
     return  new Spacebars.SafeString("<img style='width:70px' class='img-circle' src='"+this.imagen[0].data+"' title='"+this.imagen[0].descripcion+"' />");
  },
  
})
Template.cadaDiaVentas.events({
  "click .diaSeleccion":function(){
 
    Session.set("diaSeleccion",this.dia)
    consultarDetalleDias(Session.get("mesSeleccion").mes);
  },
});
Template.informeLotes.events({
  "click .mesSeleccion":function(){
  Session.set("mesSeleccion",this.mes);
    Session.set("detalleMes",[]);
   consultarDetalleMes(Session.get("mesSeleccion").mes);
//     consultarDetalleMes(this.mes.mes,true); //true es que es default
  },
  "click #imprimir":function(){
    import "/public/importar/printThis.js";
    $("#printArea").printThis({importCss:true,header:getHeader("DETALLE DE CAERNETS"," automaticos")})
  },
  
   "change #anoSeleccion":function(){
     Session.set("anoSeleccion",Number($("#anoSeleccion").val()));
   consultarTotalesAno();
  }
});