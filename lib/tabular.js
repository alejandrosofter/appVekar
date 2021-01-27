 import Tabular from 'meteor/aldeed:tabular';
import moment from 'moment';


 so__=new Tabular.Table({
  name: "Lotes",
   language: {
     processing: "<img src='/images/loading.gif'>"
  },
   processing: true,
   stateSave: true,
  collection: Lotes,
//    createdRow( row, data, dataIndex ) {
//     if(data.estado=="BAJA"){
//       var fila=$(row);
//       fila.attr("class","deshabilitado");
//     }
//   },
   extraFields: ['grupos'],
   
  // autoWidth: false, // puse esto por que cuando eliminaba un socio y volvia a socios queda la tabla por la mitad
//classname:"compact",
  columns: [
     {data: "manzana", width: '80px', search: { isNumber: true, exact: false, },title: "Manzana"},
    {data: "parecela",search: { isNumber: false, exact: false, }, title: "Parecela",render: function (val, type, doc) {
    
         return new Spacebars.SafeString("<span  class='nombreProducto' style='cursor:pointer;'> "+val+"</span>");
         
    }},
     
      {data: "estado", width: '120px', search: { isNumber: false, exact: false, },title: "ESTADO",render: function(val, type, doc){
     return ""+val;
     }},
    {
        title: '',
       width: '100px',
        tmpl: Meteor.isClient && Template.accionesProductos
      }
  ]
});