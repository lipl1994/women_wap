;(function(){
    var html=document.documentElement;
    var relativeWidth=html.getBoundingClientRect().width;
    //console.log(relativeWidth);
    html.style.fontSize=relativeWidth/15+'px';
})();




//时间格式转换
function dateFtt(fmt, date) { //author: meizz   
    var o = {
        "M+": date.getMonth() + 1, //月份   
        "d+": date.getDate(), //日   
        "h+": date.getHours(), //小时   
        "m+": date.getMinutes(), //分   
        "s+": date.getSeconds(), //秒   
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度   
        "S": date.getMilliseconds() //毫秒   
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};
function crtTimeFtt(value){
    //console.log(value);
    var crtTime = new Date(value);
    return top.dateFtt("yyyy-MM-dd hh:mm:ss",crtTime);//直接调用公共JS里面的时间类处理的办法     
};

//将周日转成周7
function sunToSeven(day){
    if(!day){
        return 7;
    }else{
        return day
    };
};

/*时间戳转换事件yy-mm-dd*/
function fmtDate(data) {
    var date = new Date(data);
    var y = 1900 + date.getYear();
    var m = "0" + (date.getMonth() + 1);
    var d = "0" + date.getDate();
    return y + "-" + m.substring(m.length - 2, m.length) + "-" + d.substring(d.length - 2, d.length);
}



//取cookie值
function getCookie(c_name) {
    if (document.cookie.length > 0) {
      c_start = document.cookie.indexOf(c_name + "=");
      if (c_start != -1) {
        c_start = c_start + c_name.length + 1;
        c_end = document.cookie.indexOf(";", c_start);
        if (c_end == -1) c_end = document.cookie.length;
        return unescape(window.decodeURIComponent(document.cookie.substring(c_start, c_end)));
      }
    }
    return "";
  };


  //清除cookie
function cleanCookie() {
    var myDate = new Date();
    myDate.setTime(myDate.getTime() - 1); //设置时间
    var domainCookie = "; domain=" + GetCookieDomain() + "; path=/";
    document.cookie =
      "userName=''; expires=" + myDate.toGMTString() + domainCookie;
    document.cookie = "userId=''; expires=" + myDate.toGMTString() + domainCookie;
    document.cookie = "userIp=''; expires=" + myDate.toGMTString() + domainCookie;
    document.cookie =
      "userIcon=''; expires=" + myDate.toGMTString() + domainCookie;
    document.cookie =
      "userArea=''; expires=" + myDate.toGMTString() + domainCookie;
    location.reload()
  };

  function GetCookieDomain() {
    var host = location.hostname;
    var ip = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
    if (ip.test(host) === true || host === "localhost") return host;
    var regex = /([^]*).*/;
    var match = host.match(regex);
    if (typeof match !== "undefined" && null !== match) host = match[1];
    if (typeof host !== "undefined" && null !== host) {
      var strAry = host.split(".");
      if (strAry.length > 1) {
        host = strAry[strAry.length - 2] + "." + strAry[strAry.length - 1];
      }
    }
    return "." + host;
  };
//是否登陆
  function cheakLogin() {

    // 获取cookie中的用户信息
    var userId = getCookie('userId')
    if(!!userId) {
        return true
    }
    else {
        return false
    }
    
}


  //查询参数查找
function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) { return pair[1]; }
    }
    return (false);
}; 
