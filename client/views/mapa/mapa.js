import { Mapa } from "./Mapa.js";
var mapaInt=null;
AutoForm.hooks({
  'modificarDatosPlano_': {
    onSuccess: function (operation, result, template) {
     swal("GENIAL!","Se ha modificado el registro!","success");

     var data= this.currentDoc;
     if(this.updateDoc.$set.estado)data.estado=this.updateDoc.$set.estado;
     if(this.updateDoc.$set.lote)data.lote=this.updateDoc.$set.lote;
     if(this.updateDoc.$set.manzana)data.manzana=this.updateDoc.$set.manzana;
     if(this.updateDoc.$set.idPropietario)data.idPropietario=this.updateDoc.$set.idPropietario;
    
     mapaInt.actualizarCirculo(data);
     Modal.hide()
    },
  },

});
Template.mapa.onRendered(function(){
	mapaInt=new Mapa("canvas_mapa",true);

});

Template.mapa.events({
   "click #btnRecargar":function(){
   	mapaInt.cargarMapa()
   }
})