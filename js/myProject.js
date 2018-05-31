var pageNumber = !!getQueryVariable('pageNumber')?getQueryVariable('pageNumber'):1;
var apiDomain = 'http://m.womenvoice.cn:8080';//'' http://m.womenvoice.cn:8080
function MyProject(){

}
MyProject.prototype={
    getData:function(){
        var str='';
        var _this=this;
        axios({
            method:'get',
            withCredentials:true,
            url: apiDomain + "/webapi/ucenter/myProject",
            data:{
                pageNumber:pageNumber,
                pageSize:10000
            }
        }).then(function(response){
            var res=response.data.data;
            console.log(res);
            var actList=document.getElementById('actList');
            var myActivityList=document.querySelector('.my-activity-list');
            if(!!res.list&&res.list.length>0){
                
                res.list.forEach(function(item){
                        str+=  `<li>
                                    <div class="img" onclick="goToDetail(${item.id},${item.delFlag})"><img src="${item.projectImage}" alt=""></div>
                                    <div class="pro-item">
                                        <h2 onclick="goToDetail(${item.id},${item.delFlag})">${item.projectName}</h2>
                                        <p class="time-ddress"><span class="address">申请状态：</span><span class="${item.applyStatus==0?'wait-pass':item.applyStatus==1?'pass':''}">${item.applyStatus==0?'待审核':item.applyStatus==1?'已通过':'未通过'}</span><span onclick='alertWhy(${'"'+item.remark+'"'})' class="why">${item.applyStatus==2?'驳回原因':''}</span></p>      
                                    </div>
                                </li>`
                });
                actList.innerHTML=str;
            }else{
                myActivityList.innerHTML='<div class="null-box">'+
                                          '<p>你还没有报名参加活动，赶快去报名吧！</p>'+
                                          '<button><a href="./activityList.html">我要报名</a></button></div>';
              };
        }).catch(function(err){
            if(!isLogin){
                alert('请先登陆');
                _this.iWantSign();
            }else{
                alert(err);
            }
            
        })
    },
    showMenu:function(){
        var menuBtn=document.querySelector('.menu-btn');
        var menuButton=document.querySelector('.menu-button');
        var activityList=document.querySelector('.my-activity-list');
        var womenMenu=document.querySelector('.women-menu');
        var onOf=true
            menuBtn.onclick=function(){
                if(onOf){
                    womenMenu.style.display='block';
                    activityList.style.display='none';
                    //console.log(menuButton);
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
    iWantSign:function (){
            isLogin = cheakLogin()
           if(!isLogin) {
                $('.back_mask').show();
                $('.login_block').show();
           }else{
               return false;
           }
           
       
    }
}
var myProject=new MyProject();
myProject.getData();
myProject.showMenu();

function goToDetail(id,delFlag){
    if(delFlag==0){
        window.open('./projectDetails.html?id='+id);
    }else{
        alert('该项目已下线');
    }
    
  }

  function alertWhy(remarks){
      alert(remarks);
  };