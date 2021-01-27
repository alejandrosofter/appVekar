_importarProductos=function(quita){
		const spawn = require('threads').spawn;

const thread = spawn(function(input, done) {
	var mongo = require('mongodb-bluebird');
	
	var arr=[];
		var resultados="";
	//	if(input.quita){
// 			var puertoBase="27017";
//   var nombreBase="appVekar";
		var puertoBase="3001";
   var nombreBase="meteor";
			mongo.connect('mongodb://localhost:'+puertoBase+'/'+nombreBase).then(function(db) { db.collection("lotes").drop();});
		//}
		console.log("INGRESANDO LOTES");
			var path = input.path+"/tmp.csv";
		var pathSalida = input.path+"/tmpSalida.txt";
		var contador=0;
		var contadorError=0;
		var fs = require('fs');
		
		fs.writeFile(pathSalida,"",function(err){if(err)throw err;});//VACIO EL LOG
    var readline = require('readline');
		var rd = readline.createInterface({
    input: fs.createReadStream(path),
});
	var i=0;
		rd.on('line',(function (line){
			
			contador++;

   var res = line.split(",");
		var manz= Number(res[2].split('"').join(''));
			var parc=Number(res[3].split('"').join(''));
			var sup=Number(res[4].split('"').join(''));
      	var idProp=res[1].split('"').join('');
			var ent=null;
			console.log(idProp)
			console.log(manz)
			if(idProp==="6")ent="r3iesG3EuPwrCFcrL";
			if(idProp==="7")ent="KwvGJZW3ybcepSxHF";
			if(idProp==="8")ent="cLM9mwaxLBTDPMFAw";
			var id='_' + Math.random().toString(36).substr(2, 9);
			if(ent)idProp=ent;
				var data={_id:id,idPropietario:idProp,manzana:manz,parcela:parc,superficie:sup,estado:"DISPONIBLE"};
				arr.push(data);
			}) );
         var aux="";
			rd.on('close', function(){
				mongo.connect("mongodb://localhost:"+puertoBase+"/"+nombreBase).then(function(db) {
    //if(db)db.createIndex( { "codigoBarras": 1 }, { unique: true } );
    var tabla = db.collection('lotes');
					for(var i=0;i<arr.length;i++){
					 tabla.insert(arr[i]).then(function(re) {
       
    }).catch(function(err) {
        console.error("ERROR DE CARGA:"+err.errmsg+" socio"+err);
    });
				}
    
});
				
			});
 
});
		 thread
  .send({quita:quita,path:process.cwd()})
  // The handlers come here: (none of them is mandatory) 
  .on('message', function(response) {
    console.log(response.aux);
    thread.kill();
  })

};