var str = '';
var pageStr = '';

var pageNumber = !!getQueryVariable('pageNumber')?getQueryVariable('pageNumber'):1
var startTime = !!getQueryVariable('startTime')?getQueryVariable('startTime'):'';
var endTime = !!getQueryVariable('endTime')?getQueryVariable('endTime'):'';
var title = !!getQueryVariable("title") ? window.decodeURIComponent(getQueryVariable("title")) : "";
var cls=!!getQueryVariable("class")?getQueryVariable("class"):'';
//console.log(title);
var apiDomain = 'http://m.womenvoice.cn:8080';//'http://10.3.36.131:8080' 
//var loginDomain = "http://b.womentest.com:81"; //'http://10.3.37.114:81'


function Activity(){};

Activity.prototype={
    btnColor:function(){
        var thisWeek=document.querySelector('.time-select .week');
        var thisMonth=document.querySelector('.time-select .month');
        if(cls=='week_bk'){
            thisWeek.style.background='#e9414d';
            thisWeek.style.color='#fff';
        }else if(cls=='month_bk'){
            thisMonth.style.background='#e9414d';
            thisMonth.style.color='#fff';
        }else{
            return false;
        }
    },
    getData:function(){
        axios
    .get(apiDomain + '/webapi/activity/list', {
        params: {
            pageNumber: pageNumber,
            pageSize: 100,
            startTime:!!startTime?startTime:null,
            endTime:!!endTime?endTime:null,
            title:!!title?title:null
        }
    })
    .then(function (response) {
        var actList = document.getElementById('actList');
        var res = response.data.data;
        console.log(res);
        if(!!res.list && res.list.length > 0){
            res
                .list
                .forEach(function (item) {
                    str += `<li>
                                <div class="img" onclick="goToDetailesfunction(${item.id})"><img src="${item.poster}" alt=""></div>
                                <div class="activity-item">
                                    <h2 onclick="goToDetailesfunction(${item.id})">${item.title}</h2>
                                    <p class="time-ddress"><time>${item.startTime}</time><span class="icon-xian"> | </span><span class="address">${item.address}</span></p>
                                    <p><mark class="icon"></mark><span class="remain-num">${item.remainNum}</span><em style="display:${item.num==-1?'none':''}">/${item.num}</em></p>
                                </div>
                            </li>`
                });
            actList.innerHTML = str;
        }
    })
    .catch(function (error) {
        alert('数据获取失败')
        console.log(error);
    });
    },
    showMenu:function(){
        var menuBtn=document.querySelector('.menu-btn');
        var menuButton=document.querySelector('.menu-button');
        var activityList=document.querySelector('.activity-list');
        var womenMenu=document.querySelector('.women-menu');
        var onOf=true
        
            menuBtn.onclick=function(){
                if(onOf){
                    womenMenu.style.display='block';
                    activityList.style.display='none';
                    console.log(menuButton);
                    menuButton.style.background='url(./images/menu_btn2.png) no-repeat';
                    menuButton.style.backgroundSize='cover';
                    menuBtn.style.background='rgba(0,0,0,0.2)';
                    onOf=!onOf;
                }else{
                    womenMenu.style.display='';
                    activityList.style.display='';
                    menuButton.style.background='url(./images/menu_btn.png) no-repeat';
                    menuButton.style.backgroundSize='cover';
                    menuBtn.style.background='';
                    onOf=!onOf;
                }
               
            };
        
           
        
       
    },
    weekMonth:function(){
        var thisWeek=document.querySelector('.time-select .week');
        var thisMonth=document.querySelector('.time-select .month');
        var Today=new Date();
        var mon=Today.getDate()-sunToSeven(Today.getDay())+1;
        var sun=Today.getDate()+7-sunToSeven(Today.getDay());
        thisWeek.onclick=function(){
            timeSearch(fmtDate(new Date(Today.getFullYear(),Today.getMonth(),mon)),fmtDate(new Date(Today.getFullYear(),Today.getMonth(),sun)),'week_bk');  
        };
        thisMonth.onclick=function(){
            timeSearch(fmtDate(new Date(Today.getFullYear(),Today.getMonth(),1)),fmtDate(new Date(Today.getFullYear(),Today.getMonth()+1,0)),'month_bk');  
        }
        
        function timeSearch(ac_strTime,ac_endTime,type){
            var urlHost = window.location.host;
            var urlPath =  window.location.pathname;
            var test = "http://" + urlHost + urlPath;
            var search = 'pageNumber='+ 1 + '&pageSize=' + 100 + '&startTime=' + ac_strTime + '&endTime=' + ac_endTime+'&class='+type;
            window.location.href=test + '?' + search;

            
        };
    },
    //选择时间范围查询
    selectTime:function(){
        $(function () {
            $('#startTime').mobiscroll().date({
                preset : 'date',
                theme: 'android-ics light', //皮肤样式
                display: 'bottom', //显示方式
                lang: "zh",
                cancelText: "取消",
                dateFormat: "yyyy-mm-dd",
                stepMinute: 1,
                onSelect: function (textVale, inst) { //选中时触发事件
                    var array = textVale.split('-');
                    var ay = array[2].split(' ');
                    $('#endTime').mobiscroll().date({
                        preset : 'date',
                        theme: 'android-ics light', //皮肤样式
                        display: 'bottom', //显示方式
                        lang: "zh",
                        cancelText: "取消",
                        minDate: new Date(array[0], array[1] - 1, ay[0]),
                        stepMinute: 1,
                        onSelect: function (textVale, inst){
                            var startTime=document.getElementById('startTime').value;
                            var endTime=document.getElementById('endTime').value;
                            var urlHost = window.location.host;
                            var urlPath =  window.location.pathname;
                            var test = "http://" + urlHost + urlPath;
                            var search = 'startTime=' + startTime + '&endTime=' + endTime;
                            window.location.href=test + '?' + search;
                        }
                    });
                }
            });
            
        });
    }
}




var activity=new Activity();
activity.btnColor();
activity.getData();
activity.showMenu();
activity.selectTime();
activity.weekMonth();


function goToDetailesfunction(id) {
        window.open("./activityDetails.html?id=" + id);
    
    }