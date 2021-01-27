var canvasMapa=null;
var nodosMapa=null;
var imagenMapa=null;
var escalaCorre=20;
var mapa=null;
var diferenciaX=0;
var diferenciaY=0;
import "/imports/easeljs.js";
import { Mapa } from "./Mapa.js";
AutoForm.hooks({
  'modificarDatosPlano_': {
    onSuccess: function (operation, result, template) {
     swal("GENIAL!","Se ha modificado el registro!","success");

     var data= this.currentDoc;
     if(this.updateDoc.$set.estado)data.estado=this.updateDoc.$set.estado;
     if(this.updateDoc.$set.lote)data.lote=this.updateDoc.$set.lote;
     if(this.updateDoc.$set.manzana)data.manzana=this.updateDoc.$set.manzana;
     if(this.updateDoc.$set.idPropietario)data.idPropietario=this.updateDoc.$set.idPropietario;
     
     if(mapa)mapa.actualizarCirculo(data);
     Modal.hide()
    },
  },

});

Template.editarPlano.onRendered(function(){
    mapa=new Mapa("canvasMapaLotes");
    window.onkeyup = function(ev){if(ev.code=="F4")mapa.cargarCirculo()}
})

Template.asignarLote.onRendered(function(){

});
Template.asignarLote.helpers({
    "datos":function(){
        console.log(this)
        var aux={idPropietario:this.idPropietario,_id:this._id,manzana:this.manzana,lote:this.lote,estado:this.estado};
        console.log(aux)
        return aux
    }
})
Template.asignarLote.events({
"click #btnVender":function(){
    Modal.hide();
    var data=this;
    setTimeout(function(){ Modal.show('nuevaVenta',function(){ return data; });}, 500);
    
   
}
})
Template.editarPlano.events({
    "click #addLote":function(){
        $(".botones").removeClass("btn-warning");
        $("#btnMarcaTerreno").addClass("btn-warning")
        mapa.cargarCirculo()
    },
  
    "click #btnIzquierda":function(){
        mapa.moverMapa("x",false);
        
    },
    "click #btnDerecha":function(){
         mapa.moverMapa("x",true);
         
    },
     "click #btnAbajo":function(){
      mapa.moverMapa("y",false);
    },
    "click #btnArriba":function(){
         mapa.moverMapa("y",true);
         
    },
    "click #btnLimpiar":function()
    {
       mapa.limpiar()
    },
    "click #btnRecarga":function()
    {
       mapa.cargarMapa()
    },
     "click #btnGuardar":function(){
        mapa.guardarMapa()
    },
   
    "click #btnCargarMapa":function(){
        cargarMapa()
    },
  
    
    
})