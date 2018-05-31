var str = '';
var pageStr = '';

var pageNumber = !!getQueryVariable('pageNumber')?getQueryVariable('pageNumber'):1
var startTime = !!getQueryVariable('startTime')?getQueryVariable('startTime'):'';
var endTime = !!getQueryVariable('endTime')?getQueryVariable('endTime'):'';
var name = !!getQueryVariable("title") ? window.decodeURIComponent(getQueryVariable("title")) : "";
var apiDomain = 'http://m.womenvoice.cn:8080';//'http://10.3.36.131:8080' 


function Project(){};

Project.prototype={
    getData:function(){
        axios
    .get(apiDomain + '/webapi/project/list', {
        params: {
            pageNumber: pageNumber,
            pageSize: 100,
            delFlag:0,
            name: !!name ? name : null
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
                                <div class="img" onclick="goToDetailesfunction(${item.id})"><img src="${item.image}" alt=""></div>
                                <div class="pro-item">
                                    <h2 onclick="goToDetailesfunction(${item.id})">${item.name}</h2>
                                    <p class="time-ddress"><time>${item.sponsorTime}</time></p>      
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
        var proList=document.querySelector('.pro-list');
        var womenMenu=document.querySelector('.women-menu');
        var onOf=true
        
            menuBtn.onclick=function(){
                if(onOf){
                    womenMenu.style.display='block';
                    proList.style.display='none';
                    console.log(menuButton);
                    menuButton.style.background='url(./images/menu_btn2.png) no-repeat';
                    menuButton.style.backgroundSize='cover';
                    menuBtn.style.background='rgba(0,0,0,0.2)';
                    onOf=!onOf;
                }else{
                    womenMenu.style.display='';
                    proList.style.display='';
                    menuButton.style.background='url(./images/menu_btn.png) no-repeat';
                    menuButton.style.backgroundSize='cover';
                    menuBtn.style.background='';
                    onOf=!onOf;
                }
               
            };
        
           
        
       
    }
}
var project=new Project();
project.getData();
project.showMenu();

function goToDetailesfunction(id) {
        window.open("./projectDetails.html?id=" + id);
    }