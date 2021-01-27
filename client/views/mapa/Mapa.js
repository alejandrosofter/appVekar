import "/imports/easeljs.js";
import { Promise } from 'meteor/promise';

export class Mapa{
	constructor(id,modo){
		escalaCorre=20;
		this.nombreCanvas=id;
		this.cargarMapa();
		modoVenta=modo;
		diferenciaX=0;
		diferenciaY=0;
		posicionX=300;
		posicionY=300;
		
	}
	async cargarMapa()
	{
	    mapa_ = new createjs.Stage(this.nombreCanvas);
		mapa_.on("stagemousedown", function(evt) {
	    	//mapa_.enableMouseOver(10)
	    	posicionX=evt.stageX-diferenciaX;
	    	posicionY=evt.stageY-diferenciaY;
		})
	    var res= await this.cargaFondo();

	    this.cargarNodos()
	}
	get modoVenta()
    {
    	return this.modo;
    }
    set modoVenta(data)
    {
    	this.modo=data;
    }
	get posicionY()
    {
    	return this.posY;
    }
    set posicionY(data)
    {
    	this.posY=data;
    }
    get posicionX()
    {
    	return this.posX;
    }
    set posicionX(data)
    {
    	this.posX=data;
    }
    get escalaCorre()
    {
    	return this.escalaCorre_;
    }
    set escalaCorre(data)
    {
    	this.escalaCorre_=data;
    }
    get mapa_()
    {
    	return this.canvasMapa;
    }
    get cargarNodo()
    {
    	return this.cargarNodos()
    }
    set mapa_(data)
    {
    	this.canvasMapa=data;
    }
    get imagenMapa_()
    {
    	return this.imagenMapa;
    }
    set imagenMapa_(data)
    {
    	this.imagenMapa=data;
    }
    get diferenciaY()
    {
    	return this.difY;
    }
    set diferenciaY(data)
    {
    	this.difY=data;
    }
    get diferenciaX()
    {
    	return this.difX;
    }
    set diferenciaX(data)
    {
    	this.difX=data;
    }
    moverMapa(eje,lugar)
    {
    	// console.log(escalaCorre)
    	if(lugar)mapa_[eje] -= escalaCorre;
    	else mapa_[eje] += escalaCorre;
    	
    	if(eje=="x")
    		if(lugar)diferenciaX-=escalaCorre;
    		else diferenciaX+=escalaCorre;
    	else if(lugar) diferenciaY-=escalaCorre; else diferenciaY+=escalaCorre;
        
        //this.correrDeLugar(eje,lugar);
        mapa_.update();
    }
	cargaFondo()
	{
	    UIBlock.block("Buscando datos del mapa...");
	    return new Promise(function(ok,err){
	    Meteor.call("buscarMapa",function(err,data){
	    	
	        var img=new Image();
	        img.src=data;

	         img.onload=function(event){
	              imagenMapa_ = new createjs.Bitmap(event.target)
	        
	        // scale it
	        //imagenMapa.scaleX = imagenMapa.scaleY = 0.6;
	        imagenMapa_.x = Settings.findOne({clave:"posicionX"}).valor*1;
	        imagenMapa_.y = Settings.findOne({clave:"posicionY"}).valor*1;
	        /// Add to display list
	        mapa_.addChild(imagenMapa_);

	        // Render Stage
	        mapa_.update();
	        UIBlock.unblock();
	        ok("bien!!")
	        
	         }

 			
	    })
	});

	}
	actualiza(){
		mapa_.update();
	}
	cargarNodos()
	{
	     var arr=DatosMapa.find({}).fetch();
	    var mapa=mapa_.children[0];
	    mapa_.children=[];
	    mapa_.addChild(mapa);
	    mapa_.update();
	   
	    for(var i=0;i<arr.length;i++) this.cargarCirculo(arr[i]);
	    
	    return true;
	}

	

	buscarCirculo(id)
	{
	    var arr=mapa_.children;
	     for(var i=0;i<arr.length;i++)
	        if(arr[i]._id==id)return i;
	    return null

	}
	actualizarCirculo(data)
	{
	    var index=this.buscarCirculo(data._id);
	    if(index){
	        var circulo=mapa_.children[index];
	        mapa_.removeChildAt(index);
	        data.x=circulo.x;
	        data.y=circulo.y;
	        this.cargarCirculo(data)
	    }
	    
	}
	cargarCirculo(data)
	{
	    var circle = new createjs.Shape();

	        var color="white";
	        if(data){
	            if(data.estado=="DISPONIBLE")color="green";
	            if(data.estado=="RESERVADO")color="yellow";
	            if(data.estado=="NO DISPONIBLE")color="red";
	        }
	        circle.graphics.setStrokeStyle(1).beginFill(color).beginStroke("rgba(0,0,0,1)").drawCircle(0,0,5);
	        
	        circle.x = data?(data.x):posicionX;
	        circle.y = data?(data.y):posicionY;
	        if(data)circle._id=data._id;
	        if(data)circle.lote=data.lote;
	        if(data)circle.manzana=data.manzana;
	        if(data)circle.manzana=data.manzana;
	        if(data)circle.idPropietario=data.idPropietario;
	        if(data)circle.estado=data.estado;
	        circle.on("pressmove",function(evt) {
	                if(!modoVenta){
	                	evt.currentTarget.x = evt.stageX-diferenciaX;
		                evt.currentTarget.y = evt.stageY-diferenciaY;
		                mapa_.update(); 
	                }
	                  
	            });
	         circle.on("rollover",function(evt) {
	         	console.log(this)
	                if(modoVenta)
	                	if(this._id){
	                	console.log(this._id)
	                }
	                  
	            });
	        circle.on("dblclick",function(evt) {
	        	if(this._id){

	        		Modal.show("asignarLote",this); // NO SE POR QUE SE EJECUTA 2 VECES, la segunda con los datos .. por eso el IF
	        	}
	        	
	            });
	        circle.on("click",function(evt) {
	        	if(this._id){

	        		//if(modoVenta)  Router.go('/nuevaVenta/'+this._id);
	               //else Modal.show("asignarLote",this); // NO SE POR QUE SE EJECUTA 2 VECES, la segunda con los datos .. por eso el IF
	        	}
	        	
	            });
	        mapa_.addChild(circle);
	        mapa_.update();

	}
	correrDeLugar(tipo,resta)
	{
		console.log(escalaCorre)
	    for(var i=1;i<mapa_.children.length;i++){
	        if(resta)  mapa_.children[i][tipo] -=escalaCorre;
	        else mapa_.children[i][tipo] +=escalaCorre;
	       // canvasMapa.update();
	    }
	}
	ripDataMapa(arr)
	{
	    var sal=[]

	    for(var i=1;i<arr.length;i++)
	        sal.push({x:arr[i].x,y:arr[i].y,_id:arr[i]._id,lote:arr[i].lote,manzana:arr[i].manzana,estado:arr[i].estado,idPropietario:arr[i].idPropietario})
	    return sal;
	}
	guardar_(arrEnvio)
	{
        this.guardarPosicionMapa(); 
         return new Promise(function(ok,err){
         	Meteor.call("guardarMapa",arrEnvio,function(err,res){  ok(true) })

    })
        
	}
	async guardarMapa()
	{
		var arr=mapa_.children;
        var arrEnvio=this.ripDataMapa(arr);
        UIBlock.block("Guardando datos...")
        var res=await this.guardar_(arrEnvio);
        this.cargarMapa();
        UIBlock.unblock();
	}
	async limpiarMapa()
	{
		mapa_.clear();
		var res=await limpiar();
		this.cargarMapa()
	}
	limpiar()
	{
		return new Promise(function(ok,err){
		 swal({   title: "Estas Seguro de limpiar el mapa?",   text: "Una vez que lo has quitado sera permanente!",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Si, borralo!",   closeOnConfirm: false }, 
                 function(){ 
         Meteor.call("limpiarMapa",function(err,res){  swal("Quitado!", "El registro ha sido borrado", "success");  })
           if(!err) ok(true);
           return ok(false)
        });
	})
	}
	guardarPosicionMapa()
	{
	     var valorx=Settings.findOne({clave:"posicionX"});
	        var valory=Settings.findOne({clave:"posicionY"});

	        Settings.update({_id:valorx._id},{$set:{valor:mapa_.children[0].x}});
	        Settings.update({_id:valory._id},{$set:{valor:mapa_.children[0].y}});
	}
}