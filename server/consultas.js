var getTotalVenta2s=function(ano,mes,estado,agrupa)
{
//console.log("ano: "+ano+" mes:"+mes+" estadi:"+estado+" agrupa:"+agrupa);
  var ordenar={ $sort : { _id : 1 } };
		var unw={$unwind: "$pagosLote"};
   var grupo={$group: {_id: 1,total:{$sum:1}}};
	var join={$lookup:{
        from:"entidades",
        localField:"_id",
        foreignField:"idEntidad",
        as:"comprador"
    }}; 
   var proyecto={$project:{_id:1,total:1 }};
		var match={$match:{ano:ano}};
	if(mes!==null)match.$match.mes=mes;
	
 
   var pipeline = [proyecto,match ];
	if(agrupa)pipeline.push(grupo);
	// console.log(pipeline)
var res= Ventas.aggregate(pipeline);
console.log(res)
	
	if(res.length>0)return res;
	return null; 
} 
var getTotalVentas=function(ano,mes,estado,agrupa)
{
//console.log("ano: "+ano+" mes:"+mes+" dia:"+dia+" estadi: agrupa:"+agrupa);
  var ordenar={ $sort : { _id : 1 } };
		var unw={$unwind: "$pagosLote"};
   var grupo={$group: {_id: 1,total:{$sum:"$importe"}}};
	var join={$lookup:{
        from:"entidades",
        localField:"idEntidad",
        foreignField:"_id",
        as:"comprador"
    }};
   var proyecto={$project:{_id:1,total:1,fecha:"$pagosLote.fechaPago",importe:"$pagosLote.importePago",idEntidad:"$idEntidad",detalle:"$pagosLote.detallePago",ano:{$year:"$pagosLote.fechaPago"},mes:{$month:"$pagosLote.fechaPago"}, }};
		var match={$match:{ano:ano,mes:mes}};


   var pipeline = [unw,proyecto,join,match ];
	if(agrupa)pipeline.push(grupo);

var res= Ventas.aggregate(pipeline);
		 console.log(res)
	if(res.length>0)return res;
	return null;
}
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
cantidadDiasMes=function(month,year) {
    return new Date(year, month, 0).getDate();
}
var consultarDeuda=function(agruparEntidad,idEntidad){
    	var fecha=new Date();
    	 
		var match={$match:{fechaVto:{$lte:fecha}}}
		
		var look= { $lookup: { from: "entidades", localField: "idEntidad", foreignField: "_id", as: "entidad" } };
		var look2= { $lookup: { from: "lotes", localField: "idLote", foreignField: "_id", as: "lote" } };
		var proyecto={$project:{_id:"$deudasLote._id",idVenta:"$_id",fechaVto:"$deudasLote.fechaVto",idLote:1,cuota:"$deudasLote.cuota",importe:"$deudasLote.importe",idEntidad:"$idEntidad",estado:"$deudasLote.estado"}};
		var agrega={$addFields:{idComprador:"$lote.idComprador"}}
		
		var proyecto2={$project:{entidad:{ "$arrayElemAt": [ "$entidad", 0 ] },idEntidad:"$entidad._id",lote:{ "$arrayElemAt": [ "$lote", 0 ] },fechaVto:1, cuota:1,importe:1,_id:1}};
		
		var grupo={$group:{_id:{idEntidad:"$entidad._id",razonSocial:"$entidad.razonSocial",email:"$entidad.email",telefono:"$entidad.telefono"},total:{$sum:"$importe"} }}
		
		var pipeline = [{$unwind: "$deudasLote"},proyecto,look,look2,match,proyecto2 ];
		
		if(agruparEntidad){
		    var arr=[];
		    pipeline.push(grupo);
		    var res= Ventas.aggregate(pipeline); 
		    for(var i=0; i<res.length;i++) arr.push({"idEntidad":res[i]._id.idEntidad, "razonSocial":res[i]._id.razonSocial,"email":res[i]._id.email,"telefono":res[i]._id.telefono,"importe":res[i].total});
		    return arr;
		    
		}
		if(idEntidad) pipeline.push({$match:{idEntidad:idEntidad}})
		
		var res= Ventas.aggregate(pipeline); 
  		return res
}
var getDatosDeuda=function(idEntidad){
    var deudasEntidad=consultarDeuda(false,idEntidad);
   
    
    var cad="";
    var fechaACtual=new Date();
    cad+="<small style='float:rigth'><i> FECHA:"+fechaActual.toLocaleDateString()+"</i></small>"
    cad+="<h1>RESUMEN DE <b>CUENTA</b></h1>";
    cad+="<table class='greyGridTable'>";
    cad+="<thead><tr><td>CUOTA</td><td>VTO.</td><td>$ IMPORTE</td></tr></thead>";
   
    cad+="<tbody>"
    var tot=0;
     for(var i=0;i<deudasEntidad.length;i++){
        var aux=deudasEntidad[i];
        tot+=aux.importe;
        var fecha=new Date(aux.fechaVto);
        cad+="<tr>";
        cad+="<td> CUOTA "+aux.cuota+" </td>";
         cad+="<td>"+fecha.toLocaleDateString()+"</td>";
          cad+="<td>"+aux.importe.formatMoney(2,".")+"</td>";
        cad+="</tr>";
    }
    
    cad+="</tbody>"
     cad+="<tfoot><tr><td></td><td>TOTAL</td><td>"+tot.formatMoney(2,".")+"</td></tr><tfoot>"
     cad+="</table>";
    return cad;
}
var enviarMail=function(email,mensaje,razonSocial,titulo)
{
    var seting=Settings.findOne({clave:"cadenaConexionMail"});
    var empresa=Settings.findOne({clave:"nombreEmpresa"});
    var contacto=Settings.findOne({clave:"datosContacto"});
     var emailEmpresa=Settings.findOne({clave:"emailEmpresa"});

	var valorMail=seting?seting.valor:"";
	process.env.MAIL_URL=valorMail; 

    var arrEnviados=[];
    SSR.compileTemplate('htmlEmail', Assets.getText('email_1.html')); //ESTA EN CARPETA /private/email_1.html

    var mensajePersonal=mensaje;

    mensajePersonal=mensajePersonal.replace("%razonSocial",razonSocial);
    
    titulo=titulo.replace("%razonSocial",razonSocial);
	
	
	var emailData={
	  mensaje: mensajePersonal,
	  datosEmpresa: empresa.valor,
	  contacto:contacto.valor
	};
	
     Email.send({
				from: emailEmpresa.valor,
				to: email,
				subject: titulo,
				html:SSR.render('htmlEmail', (emailData)),
//				attachments: [{
//				filename: 'adjunto.pdf',
//				filePath:path,
//  }],	 
});
}
var enviarEmailDeuda=function(datosDeuda)
{
    var msgDeuda=Settings.findOne({clave:"mensajeDeudaMail"}).valor;
    var msg=getDatosDeuda(datosDeuda.idEntidad);
    msg+=msgDeuda;
    
    enviarMail(datosDeuda.email,msg,datosDeuda.razonSocial,"RESUMEN DE CUENTA VEKAR")
}

Meteor.methods({
"enviarMailDeudores":function(deuduores)
{
    for(var i=0;i<deuduores.length;i++){
        enviarEmailDeuda(deuduores[i])
    }   
}
,
"buscarMapa":function()
{
    var path = process.cwd() + '/../web.browser/app/lote.png';
    var fs = require('fs');//roboto-medium.ttf
  	return fs.readFileSync(path, "utf8"); 
}
,
"guardarMapa":function(data,diferenciaX,diferenciaY)
{
    //DatosMapa.remove({});
    console.log(data)
    for(var i=0;i<data.length;i++)
    	if(data[i]._id)DatosMapa.update({_id:data[i]._id},{$set:{x:data[i].x,y:data[i].y,estado:data[i].estado,lote:data[i].lote,manzana:data[i].manzana,idPropietario:data[i].idPropietario} });
    	else DatosMapa.insert({x:data[i].x,y:data[i].y,estado:"DISPONIBLE"});
}
,
"limpiarMapa":function()
{
    DatosMapa.remove({});
}
,
"informeDeudores":function(agruparEntidad)
{
	return consultarDeuda(agruparEntidad)
},
"quitarVenta":function(id)
{
	var venta=Ventas.findOne({_id:id});
	Lotes.update({_id:venta.idLote},{$set:{estado:"DISPONIBLE"}})
	Ventas.update({_id:id,},{$set:{"estado":"BAJA"}})
}
,
"quitarLiquidacion":function(id)
{

	Meteor.call("actualizaEstadoPagos",id,"PENDIENTE",function(err,res){
		Liquidaciones.remove({_id:id});
	});
}
,
"actualizaEstadoPagos":function(idLiquidacion,estado)
{
var liq=Liquidaciones.findOne({_id:idLiquidacion}).pagos;
for(var  i=0;i<liq.length;i++)
	Ventas.update({_id:liq[i].idVenta,"pagosLote._id":liq[i].idCuota},{$set:{"pagosLote.$.estado":estado}})
			
},
"marcarPagado":function(idVenta,idPago){
Ventas.update({
			_id: idVenta,
			"deudasLote._id": idPago
		}, {
			$set: {
				"deudasLote.$.estado": "CANCELADO"
			}
		}, true)
},
	"consultarPagosPendientes":function(agrupaPropietario)
	{
		
		var match={$match:{estado:"PENDIENTE"}}
		var look= { $lookup: { from: "entidades", localField: "idEntidad", foreignField: "_id", as: "entidad" } };
		var look2= { $lookup: { from: "lotes", localField: "idLote", foreignField: "_id", as: "lote" } };
		var proyecto={$project:{_id:"$pagosLote._id",idVenta:"$_id",idLote:"$idLote",idDeudasLote:"$pagosLote.idDeudasLote",idEntidad:"$idEntidad",idCuota:"$pagosLote._id",importe:"$pagosLote.importe",fechaPago:"$pagosLote.fechaPago",estado:"$pagosLote.estado",tipoComprobante:"$pagosLote.tipoComprobante",tipoDescuento:"$pagosLote.tipoDescuento",importePago:"$pagosLote.importePago" }};
		var agrega={$addFields:{idComprador:"$lote.idComprador"}}
		
		var proyecto2={$project:{lote:{ "$arrayElemAt": [ "$lote", 0 ] } ,entidad:{ "$arrayElemAt": [ "$entidad", 0 ] } ,_id:1,idVenta:1,idLote:1,idDeudasLote:1,idEntidad:1,idCuota:1,importe:1,fechaPago:1,estado:1,tipoComprobante:1,tipoDescuento:1,importePago:1}};
		
		var grupo={$group:{_id:{tipoComprobante:"$tipoComprobante",idPropietario:"$lote.idPropietario"},total:{$sum:"$importePago"}} }
		
		var pipeline = [{$unwind: "$pagosLote"},proyecto,match,look,look2,proyecto2 ];
		if(agrupaPropietario)pipeline.push(grupo) 
  		var res= Ventas.aggregate(pipeline); 
  		console.log(res)
  		return res
  			
	},
	"incrementaPresupuesto":function()
	{
		var elem=Settings.findOne({clave:"nroPresupuesto"});
		Settings.update({_id:elem._id},{$set:{valor:String(parseFloat(elem.valor)+1)}});
	},
	"getDeudas":function(idVenta){
		var match={$match:{_id:idVenta,estado:"PENDIENTE"}}
		var pipeline = [{$unwind: "$deudasLote"},{$project:{_id:1,cuota:"$deudasLote.cuota",idPago:"$deudasLote._id",importe:"$deudasLote.importe",fechaVto:"$deudasLote.fechaVto",estado:"$deudasLote.estado" }},match ];
  return Ventas.aggregate(pipeline);
	},
"mensualVentas":function(ano,estado,agrupa)
	{
		var res=[];
		for(var i=1;i<=12;i++){
			var auxData=getTotalVentas(ano,i,null,agrupa);
			var aux={data:auxData,mes:i,mesLetras:mesLetras(i)};
			res.push(aux);
		}
	//	res.push("dd");
		return res
	},
	"generarVariables":function()
	{
		//Settings.remove({});
		if(!Settings.findOne({clave:"precioMetroCuadrado"})) Settings.insert({clave:"precioMetroCuadrado",valor:"3200"});
		if(!Settings.findOne({clave:"nroPresupuesto"}))Settings.insert({clave:"nroPresupuesto",valor:"1"});
		if(!Settings.findOne({clave:"nroRecivo"}))Settings.insert({clave:"nroRecivo",valor:"1"});
		if(!Settings.findOne({clave:"posicionX"}))Settings.insert({clave:"posicionX",valor:"-750"});
		if(!Settings.findOne({clave:"posicionY"}))Settings.insert({clave:"posicionY",valor:"-430"});
		if(!Settings.findOne({clave:"cadenaConexionMail"}))Settings.insert({clave:"cadenaConexionMail",valor:"smtp://USUARIO%40gmail.com:CLAVE@smtp.gmail.com:465/"});
		if(!Settings.findOne({clave:"nombreEmpresa"}))Settings.insert({clave:"nombreEmpresa",valor:"SU EMPRESA"});
		if(!Settings.findOne({clave:"datosContacto"}))Settings.insert({clave:"datosContacto",valor:"empresa@dominio.com"});
		if(!Settings.findOne({clave:"emailEmpresa"}))Settings.insert({clave:"emailEmpresa",valor:"suempresa@dominio.com"});
		if(!Settings.findOne({clave:"mensajeDeudaMail"}))Settings.insert({clave:"mensajeDeudaMail",valor:"Por favor comunicarse..."});
	},
	"getValorConfig":function(clave_)
	{
		//Settings.remove({});
		var res=Settings.findOne({clave:clave_});
		if(res)return res.valor;
		return null;
	},
	"quitarPagoVenta":function(idVenta,idPago,idDeuda){
		console.log("idDeuda?"+idDeuda)
		for(var i=0;i<idDeuda.length;i++)
		Ventas.update({
			_id: idVenta,
			"deudasLote._id": idDeuda[i]
		}, {
			$set: {
				"deudasLote.$.estado": "PENDIENTE"
			}
		}, true);
		
		Ventas.update({_id:idVenta},{
      $pull: {
        pagosLote: {
          _id: idPago
        }
      }
    }, {
      getAutoValues: false
    });
	},
	"mensualVentasDia":function(ano,mes,agrupa)
	{
		var res=[];
		var days = ['Domingo','Lunes','Martes','Miercoles','Jueves','Viernes','Sabado'];
		var cantidadDias=cantidadDiasMes(mes,ano);
		
		for(var i=1;i<=cantidadDias;i++){
			var auxDia=new Date(ano,(mes-1),i);
			var diaLetras=days[auxDia.getDay()];
			var auxData=getTotalVentasDia(ano,mes,i,false);
			var aux={data:auxData,dia:i,diaLetras:diaLetras};
			res.push(aux);
		}
		return res
	},
	 'totalVentasDias':function(ano,mes,dia,agrupa){
  
   return getTotalVentasDia(ano,mes,dia,agrupa);
   //return [semana1,semana2,semana3,semana4];
},
 'totalVentas':function(ano,mes,estado,agrupa){
  
   return getTotalVentas(ano,mes,estado,agrupa);
   //return [semana1,semana2,semana3,semana4];
},
	"consultarMeses":function(ano){
		var res=[];
		for(var i=1;i<=12;i++){
			
			var aux={data:consultaVentasMes(ano,i),mes:i,mesLetras:mesLetras(i)};
			res.push(aux);
		}
	//	res.push("dd");
		return res
	},
  'getTotalAnoVentas':function(anoAfuera,mesAfuera){
  
   return consultaVentasAno(anoAfuera);
   //return [semana1,semana2,semana3,semana4];
},
  'getTotalAnoCompras':function(anoAfuera,mesAfuera){
  
   var res= consultaComprasAno(anoAfuera);
    console.log(res);
    return res;
   //return [semana1,semana2,semana3,semana4];
},
   'fileUpload': function (fileInfo, fileData) {
		 var fs = Npm.require('fs');
		var path = process.cwd()+"/tmp.csv";
		 console.log(path);
		 var resultados="DATA PROCESADA";
		// buf = iconv.encode("Sample input string", 'win1251');
		 fs.writeFile(path, fileData,{encoding:"ascii"}, function(err) {if(!err)console.log("SUBIO OK")});
		 
   },
  "loadFile":_importarProductos,
 "loginUser": function(data) {
   // Meteor.call('loginUser',{email: "vxxxxx@xxxx.com",password: "123456"}, function(error, result){
  //      if(!error) Meteor.loginWithToken(result.token);
   // });
       var user = Meteor.users.findOne({
         'emails.address': data.email
       });
       if (user) {
         var password = data.password;
         var result = Accounts._checkPassword(user, password);
         console.log(result);
         if (result.error) {
           return result.error;
         } else {
           return result;
         }
       } else {
         return {
           error: "user not found"
         }
       }
     }
});
Meteor.call("getTotalAnoCompras", 2017,function(err,res){   
  console.log(res);
 });