Lotes = new Mongo.Collection('lotes');
Pagos = new Mongo.Collection('pagos');
Entidades = new Mongo.Collection('entidades');
Propietarios = new Mongo.Collection('propietarios');
Fiduciarios = new Mongo.Collection('fiduciarios');
Ventas = new Mongo.Collection('ventas');
Settings = new Mongo.Collection('settings');
Presupuestos = new Mongo.Collection('preuspuestos');
Liquidaciones = new Mongo.Collection('liquidaciones');
DatosMapa = new Mongo.Collection('datosMapa');

var schemaDatosMapa= new SimpleSchema({
  x: {
    type: Number,
    label: "X",
   
  },
   y: {
    type: Number,
    label: "Y",
   
  },

  lote: {
    type: Number,
    label: "Lote",
     optional:true,
  },
  manzana: {
    type: Number,
    label: "Manzana",
     optional:true,
  },
  comentario: {
    type: String,
    label: "Comentario/s",
     optional:true,
  },
  estado: {
    type: String,
    label: "Estado",
     optional:true,
      autoform: {
         style: "width:140px",
      options: [
        {label: "DISPONIBLE", value: "DISPONIBLE"},
        {label: "RESERVADO", value: "RESERVADO"},
        {label: "NO DISPONIBLE", value: "NO DISPONIBLE"},
        
      ]
    }
  },
  idPropietario: {
    type: String,
    label: "Propietario",
     optional:true,
     autoform: {
       type: "select2",
       options: function () {
        return _.map(Propietarios.find().fetch(), function (c, i) {
          return {label: c.razonSocial, value: c._id};
        })},
        style: "width:250px",
      },
  },

})
var schemaLiquidaciones= new SimpleSchema({
  fecha: {
    type: Date,
    label: "Fecha",
    autoform: {
         style: "width:180px",
    }
  },
   
  importeA: {
    type: Number,
    autoform: {
         style: "width:150px",
    },
    decimal:true,
    label: "$ Importe A",
  },
   importeB: {
    type: Number,
    decimal:true,
    autoform: {
         style: "width:150px",
    },
    label: "$ Importe B",
  },
  pagosFiduciarios:{
     type: Array,
     optional:true,
  },
  "pagosFiduciarios.$":{
    type:Object,
  },
   "pagosFiduciarios.$.idFiduciario":{
     type: String,
   
  },
  "pagosFiduciarios.$.porcentaje":{
     type: Number,
     decimal:true
  },
  "pagosFiduciarios.$.importeA":{
     type: Number,
     decimal:true
   
  },
   "pagosFiduciarios.$.importeB":{
     type: Number,
     decimal:true
   
  },
   pagos:{
     type: Array,
     optional:true,
  },
  "pagos.$":{
    type:Object,
  },
   "pagos.$.idPago":{
     type: String,
     optional:true,
   label:"id pago?"
  },
  "pagos.$.idVenta":{
     type: String,
   
  },
  "pagos.$.idLote":{
     type: String,
   
  },
  "pagos.$.idCuota":{
     type: String,
   
  },
  "pagos.$.idEntidad":{
     type: String,
   
  },
  "pagos.$.tipoComprobante":{
     type: String,
   
  },
  "pagos.$.importePago":{
     type: Number,
     decimal:true,
     label:"impo"
   
  },
   "pagos.$.idDeudasLote":{
     type: [String],
   
  },
    pagosPropietarios:{
     type: Array,
     optional:true,
  },
  "pagosPropietarios.$":{
    type:Object,
  },
   "pagosPropietarios.$._id":{
     type: String,
   
  },

   "pagosPropietarios.$.importeTotal":{
     type: Number,
     decimal:true,
    autoform: {
      
        style: "width:60px",
      },
  },
  "pagosPropietarios.$.idPropietario":{
     type: String,
   
  },
    "pagosPropietarios.$.tipoComprobante":{
     type: String,
   
  },
   pagosFiduciarios:{
     type: Array,
     optional:true,
  },
  
  "pagosFiduciarios.$":{
    type:Object,
  },
   "pagosFiduciarios.$._id":{
     type: String,
    autoValue: function() {
      return Meteor.uuid();
    }
  },
  "pagosFiduciarios.$.porcentaje":{
     type: Number,
   decimal:true
  },
   "pagosFiduciarios.$.importeA":{
     type: Number,
     decimal:true,
    autoform: {
      
        style: "width:60px",
      },
  },
   "pagosFiduciarios.$.importeB":{
     type: Number,
     decimal:true,
    autoform: {
      
        style: "width:60px",
      },
  },
  "pagosFiduciarios.$.idFiduciario":{
     type: String,
   
  },

})
var schemaPresupuestos= new SimpleSchema({
   idEntidad: {
    type: String,
    label: "Comprador",
    autoform: {
       type: "select2",
       options: function () {
        return _.map(Entidades.find().fetch(), function (c, i) {
          return {label: c.razonSocial, value: c._id};
        })},
        style: "width:250px",
      },
  },
   idLote: {
    type: String,
    label: "Lote",
    autoform: {
       type: "select2",
       options: function () {
        return _.map(DatosMapa.find().fetch(), function (c, i) {
          var lab="MANZANA: "+c.manzana+" PARCELA: "+c.parcela;
          return {label: lab, value: c._id};
        })},
        style: "width:250px",
      },
  },
  fecha: {
    type: Date,
    label: "Fecha",
    autoform: {
         style: "width:180px",
    }
  },
   fechaPrimerVto: {
    type: Date,
    label: "Fecha 1er vto cuota",
    autoform: {
         style: "width:180px",
    }
  },
  vto: {
    type: Date,
    label: "Fecha Vto",
    autoform: {
         style: "width:180px",
    }
  },
   
  importe: {
    type: Number,
    decimal:true,
    autoform: {
         style: "width:150px",
    },
    label: "$ Importe",
  },
   importeCuota: {
    type: Number,
      decimal:true,
    autoform: {
         style: "width:150px",
    },
    label: "$ Importe cuota",
  },
   cantidadCuotas: {
    type: Number,
    autoform: {
         style: "width:80px",
    },
    label: "Cant. Cuotas",
  },
   nroPresupuesto: {
    type: Number,
    autoform: {
         style: "width:70px",
    },
    label: "Nro Presupuesto",
  },
  tasaInteres: {
    type: Number,
    decimal:true,
    autoform: {
         style: "width:80px",
    },
    label: "% Interes",
  },
  importeEntrega: {
    type: Number,
     decimal:true,
    autoform: {
         style: "width:150px",
    },
    label: "$ Entrega",
  },
  estado: {
    type: String,
    label: "Estado",
     autoform: {
         style: "width:180px",
      options: [
        {label: "PENDIENTE", value: "PENDIENTE"},
        {label: "RECHAZADO", value: "RECHAZADO"},
        {label: "ACEPTADO", value: "ACEPTADO"},
        
      ]
    }
    
  }
})

var schemaVentas= new SimpleSchema({
   idEntidad: {
    type: String,
    label: "Comprador",
    autoform: {
       type: "select2",
       options: function () {
        return _.map(Entidades.find().fetch(), function (c, i) {
          return {label: c.razonSocial, value: c._id};
        })},
        style: "width:250px",
      },
  },
   idLote: {
    type: String,
    label: "Lote",
    autoform: {
       type: "select2",
       options: function () {
        return _.map(DatosMapa.find().fetch(), function (c, i) {
          var lab="MANZANA: "+c.manzana+" PARCELA: "+c.parcela;
          return {label: lab, value: c._id};
        })},
        style: "width:250px",
      },
  },
  fecha: {
    type: Date,
    label: "Fecha",
    autoform: {
         style: "width:180px",
    }
  },
   fechaPrimerVto: {
    type: Date,
    label: "Fecha 1er vto cuota",
    autoform: {
         style: "width:180px",
    }
  },
  
   deudasLote:{
     type: Array,
     optional:true,
  },
  "deudasLote.$":{
    type:Object,
  },
   "deudasLote.$._id":{
     type: String,
    autoValue: function() {
      return Meteor.uuid();
    }
  },
  "deudasLote.$.cuota":{
     type: Number,
    autoform: {
      
        style: "width:60px",
      },
  },
  "deudasLote.$.estado":{
     type: String,
    label:"estado",
    autoform: {
      
        style: "width:60px",
      },
  },
   "deudasLote.$.importe":{
     type: Number,
     decimal:true,
    autoform: {
      
        style: "width:60px",
      },
  },
  "deudasLote.$.fechaVto":{
     type: Date,
    autoform: {
      
        style: "width:180px",
      },
  },
   pagosLote:{
     type: Array,
     optional:true,
  },
  "pagosLote.$":{
    type:Object,
  },
   "pagosLote.$._id":{
     type: String,
    autoValue: function() {
      return Meteor.uuid();
    }
  },
  "pagosLote.$.detallePago":{
     type: String,
    optional:true,
    autoform: {
      
       // style: "width:180px",
      },
  },
   "pagosLote.$.idDeudasLote":{
     type: [String],
     label:"Deuda Lote",
     optional:true,
       autoform: {
      
        multiple:true,
        type: "select2",
        style: "width:350px",
      },
  },
   "pagosLote.$.fechaPago": {
    type: Date,
      label: "Fecha",
      autoform: {
      
        style: "width:180px",
      },
  },
  "pagosLote.$.tipoComprobante": {
    type: String,
    label: "Tipo de Comprobante",
    
     autoform: {
       type:"select-radio-inline",
        // style: "width:180px",
      options: [
        {label: "A", value: "A"},
        {label: "B", value: "B"},
      ]
    }
    
  },
  "pagosLote.$.porcentajeDescuento": {
    type: Number,
     label: "% desc.",
    decimal:true,
    autoform: {
      
        style: "width:80px",
      },
  },
  "pagosLote.$.importePago": {
    type: Number,
     label: "Importe paga",
     decimal:true,
    autoform: {
      
        style: "width:150px",
      },
  },
  "pagosLote.$.estado": {
    type: String,
     label: "Estado",
   
  },
   
  importe: {
    type: Number,
    autoform: {
         style: "width:150px",
    },
    label: "$ Importe",
  },
   importeCuota: {
    type: Number,
      decimal:true,
    autoform: {
         style: "width:150px",
    },
    label: "$ Importe cuota",
  },
   cantidadCuotas: {
    type: Number,
    autoform: {
         style: "width:80px",
    },
    label: "Cant. Cuotas",
  },
  tasaInteres: {
    type: Number,
    decimal:true,
    autoform: {
         style: "width:80px",
    },
    label: "% Interes",
  },
  importeEntrega: {
    type: Number,
     decimal:true,
    autoform: {
         style: "width:150px",
    },
    label: "$ Entrega",
  },
  estado: {
    type: String,
    label: "Estado",
     autoform: {
         style: "width:180px",
      options: [
        {label: "PAGANDO", value: "PAGANDO"},
        {label: "SALDADO", value: "SALDADO"},
        {label: "BAJA", value: "BAJA"},
      ]
    }
    
  }
})

var schemaFiduciarios= new SimpleSchema({
  
  razonSocial: {
    type: String,
    label: "Razon Social",
  },
  telefono: {
    type: String,
    label: "Tel.",
  },
   email: {
    type: String,
    label: "Email",
  },
 porcentaje: {
    type: Number,
   decimal:true,
    label: "Porcentaje",
  },
})
var schemaEntidades= new SimpleSchema({
  
  razonSocial: {
    type: String,
    label: "Razon Social",
  },
  telefono: {
    type: String,
    label: "Tel.",
  },
 email: {
    type: String,
    label: "Email",
  },

})
var schemaPropietarios= new SimpleSchema({
  
  razonSocial: {
    type: String,
    label: "Razon Social",
  },
  telefono: {
    type: String,
    label: "Tel.",
  },
 email: {
    type: String,
    label: "Email",
  },

})
var schemaLotes = new SimpleSchema({
  
  idPropietario: {
    type: String,
    label: "Propietario",
    autoform: {
       type: "select2",
       options: function () {
        return _.map(Propietarios.find({}).fetch(), function (c, i) {
          return {label: c.razonSocial, value: c._id};
        })},
        style: "width:250px",
      },
  },
  manzana: {
    type: Number,
    label: "Manzana",
     autoform: {
      placeholder: 'Nro',
      style: "width:80px"
    },
  },
  parcela: {
    type: Number,
    label: "Parcela",
    autoform: {
      placeholder: 'Nro',
      style: "width:80px"
    },
  },
  superficie: {
    type: Number,
    decimal:true,
    label: "Sup.",
    autoform: {
      placeholder: 'Nro',
      style: "width:120px"
    },
  },
   detalle: {
    type: String,
    label: "Detalle",
     optional:true,
    autoform: {
      placeholder: 'Detalle sobre LOTE...',
      style: "width:100%"
    },
  },
   estado: {
    type: String,
     optional:false,
    label: "Estado",
      autoform: {
         style: "width:180px",
      options: [
        {label: "DISPONIBLE", value: "DISPONIBLE"},
        {label: "RESERVADO", value: "RESERVADO"},
        {label: "NO DISPONIBLE", value: "NO DISPONIBLE"},
      ]
    }
  },
  
 
});
var schemaSettings = new SimpleSchema({
  clave: {
    type: String,
    label: "Clave",
  },
  valor: {
    type: String,
    label: 'Valor',
  },
  fecha: {
    type: Date,
     label: 'Fecha',
    optional: true,

  },
  created: {
    type: Date,
    optional: true,
    autoValue: function() {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return {
          $setOnInsert: new Date()
        };
      } else {
        this.unset();
      }
    },
  },
  updated: {
    type: Date,
    optional: true,
    autoValue: function() {
      if (this.isUpdate) {
        return new Date();
      }
    },
  },
 
});
Liquidaciones.attachSchema(schemaLiquidaciones);
Propietarios.attachSchema(schemaPropietarios);
Entidades.attachSchema(schemaEntidades);
Fiduciarios.attachSchema(schemaFiduciarios);
Presupuestos.attachSchema(schemaPresupuestos);
Ventas.attachSchema(schemaVentas);
Lotes.attachSchema(schemaLotes);
Settings.attachSchema(schemaSettings);
DatosMapa.attachSchema(schemaDatosMapa);
