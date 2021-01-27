import { Meteor } from 'meteor/meteor';

import "./consultas.js";
//DATOS DE LA BASE DE DATOS!!!!//////////////////////////////////////////////////////////////////////////
	nombreBase="meteor";
puertoBase="3001";
//DATOS DE LA BASE DE DATOS!!!!//////////////////////////////////////////////////////////////////////////

Meteor.publish("reportTotals", function() {
// Remember, ReactiveAggregate doesn't return anything
ReactiveAggregate(this, Ventas, [{
    // assuming our Reports collection have the fields: hours, books
    $group: {
        '_id': this.userId,
        'hours': {
        // In this case, we're running summation. 
            $sum: '$importe'
        }
    }
}, {
    $project: {
        // an id can be added here, but when omitted, 
        // it is created automatically on the fly for you
        hours: '$importe'
    } // Send the aggregation to the 'clientReport' collection available for client use
}], { clientCollection: "clientReport" });
});
mesLetras=function(mes)
{
  if(mes==1)return "ENERO";
  if(mes==2)return "FEBRERO";
  if(mes==3)return "MARZO";
  if(mes==4)return "ABRIL";
  if(mes==5)return "MAYO";
  if(mes==6)return "JUNIO";
  if(mes==7)return "JULIO";
  if(mes==8)return "AGOSTO";
  if(mes==9)return "SEPTEMBRE";
  if(mes==10)return "OCTUBRE";
  if(mes==11)return "NOVIEMBRE";
  if(mes==12)return "DICIEMBRE";
  return "s/a";
}
Meteor.startup(() => {
  



  Meteor.publish('Entidades', function(){
    return Entidades.find();
});
   Meteor.publish('DatosMapa', function(){
    return DatosMapa.find();
});
	 Meteor.publish('Ventas', function(){
    return Ventas.find();
});
	  Meteor.publish('Lotes', function(){
    return Lotes.find();
});
  
  Meteor.publish('Pagos', function(){
    return Pagos.find();
});
	 Meteor.publish('Presupuestos', function(){
    return Presupuestos.find();
});
   Meteor.publish('Settings', function(){
    return Settings.find();
});
   Meteor.publish('Fiduciarios', function(){
    return Fiduciarios.find();
});
   Meteor.publish('Propietarios', function(){
    return Propietarios.find();
});
   Meteor.publish('Liquidaciones', function(){
    return Liquidaciones.find();
});
  
 
});
