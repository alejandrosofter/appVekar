import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Accounts } from 'meteor/accounts-base';
import { $ } from 'meteor/jquery';
import dataTablesBootstrap from 'datatables.net-bs';
import 'datatables.net-bs/css/dataTables.bootstrap.css';
import "../public/printThis.js";
dataTablesBootstrap(window, $);
Date.prototype.addMonth = function (m) {
    var d = new Date(this);
    var years = Math.floor(m / 12);
    var months = m - (years * 12);
    if (years) d.setFullYear(d.getFullYear() + years);
    if (months) d.setMonth(d.getMonth() + months);
    return d;
}
Date.prototype.getFecha = function () {
    var value = this.valueOf();
    value += 86400000 * 1;
    var d= new Date(value);
  return d.toLocaleDateString()
}



//window.onbeforeunload = function() { return "Estas seguro de refrescar la aplicacion?"; };
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
function printElement(elem) {
    var domClone = elem.cloneNode(true);
    
    var $printSection = document.getElementById("printSection");
    
    if (!$printSection) {
        var $printSection = document.createElement("div");
        $printSection.id = "printSection";
        document.body.appendChild($printSection);
    }
    
    $printSection.innerHTML = "";
    
    $printSection.appendChild(domClone);
}

//window.onbeforeunload = function() { return "Estas seguro de refrescar la aplicacion?"; };
hayConexionInternet=function(){
  return  navigator.onLine;
}
String.prototype.lpad = function(padString, length) {
    var str = this;
    while (str.length < length)
        str = padString + str;
    return str;
}
setInterval(function(){ checkConexion(); }, 1500);
checkConexion=function(){
  if(hayConexionInternet()){
    $("#online").show("slow");
     $("#offline").hide();
   // UIBlock.unblock();
  }else {
    $("#offline").show("slow");
     $("#online").hide();
    
   //UIBlock.block('Has perdido la conexion a internet!.. no vas a poder ingresar datos al sistema hasta que no estes online nuevamente');
    swal("Ops!","Has perdido la conexion a internet!.. no vas a poder ingresar datos al sistema hasta que no estes online nuevamente","error");
  }
};

SimpleSchema.messages({
  required: "[label] es necesario para continuar!",
  minString: "[label] must be at least [min] characters",
  maxString: "[label] cannot exceed [max] characters",
  minNumber: "[label] must be at least [min]",
  maxNumber: "[label] cannot exceed [max]",
  minDate: "[label] must be on or after [min]",
  maxDate: "[label] cannot be after [max]",
  badDate: "[label] no es una fecha valida",
  minCount: "Tienes que ingresar por lo menos [minCount] valores",
  maxCount: "No puedes ingresar mas de [maxCount] valores",
  noDecimal: "[label] must be an integer",
  notAllowed: "[value] is not an allowed value",
  expectedString: "[label] tiene que se texto",
  expectedNumber: "[label] es necesario que sea un Numero",
  expectedBoolean: "[label] must be a boolean",
  notUnique: "Hay otro producto con ese codigo!",
  expectedArray: "[label] must be an array",
  expectedObject: "[label] must be an object",
  expectedConstructor: "[label] must be a [type]",
  regEx: [
    {msg: "[label] failed regular expression validation"},
    {exp: SimpleSchema.RegEx.Email, msg: "[label] tiene que ser una mail VALIDO"},
    {exp: SimpleSchema.RegEx.WeakEmail, msg: "[label] tiene que ser una mail VALIDO"},
    {exp: SimpleSchema.RegEx.Domain, msg: "[label] must be a valid domain"},
    {exp: SimpleSchema.RegEx.WeakDomain, msg: "[label] must be a valid domain"},
    {exp: SimpleSchema.RegEx.IP, msg: "[label] must be a valid IPv4 or IPv6 address"},
    {exp: SimpleSchema.RegEx.IPv4, msg: "[label] must be a valid IPv4 address"},
    {exp: SimpleSchema.RegEx.IPv6, msg: "[label] must be a valid IPv6 address"},
    {exp: SimpleSchema.RegEx.Url, msg: "[label] must be a valid URL"},
    {exp: SimpleSchema.RegEx.Id, msg: "[label] must be a valid alphanumeric ID"}
  ],
 // keyNotInSchema: "[key] is not allowed by the schema"
});