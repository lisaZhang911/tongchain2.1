var year = ''
var month = ''
var date = ''
var hh = ''
var mm = ''
var ss = ''

function timeExchange(strTime){
   var d = new Date(strTime);
   year = d.getFullYear()
   month = d.getMonth()+1
   date = d.getDate()
   hh = d.getHours()
   mm = d.getMinutes()
   ss = d.getSeconds()
}


export  {timeExchange,year,month,date,hh,mm,ss}
