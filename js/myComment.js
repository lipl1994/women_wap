var pageNumber = !!getQueryVariable('pageNumber')?getQueryVariable('pageNumber'):1;
var apiDomain = 'http://m.womenvoice.cn:8080';//'' http://m.womenvoice.cn:8080
function MyComment(){

}
MyComment.prototype={
    getData:function(){
        var str='';
        var _this=this;
        axios({
            method:'get',
            withCredentials:true,
            url: apiDomain + "/webapi/ucenter/myComments",
            data:{
                pageNumber:pageNumber,
                pageSize:10000
            }
        }).then(function(response){
            var res=response.data.data;
            console.log(res);
            var myCommentList=document.querySelector('.my-comment-list');
            if(!!res.list&&res.list.length>0){
                
                res.list.forEach(function(item){
                        str+=  `<section class="my-comment-item">
                                    <article class="comment-box">
                                        <p>${item.content}</p>
                                        <time>${crtTimeFtt(item.createAt)}</time> 
                                    </article>
                                    <div class="comment-artacle">
                                        <div class="artacle-title">
                                            <p><a target="_blank" href="${item.articleUrl}">${item.title}</a></p>
                                        </div>
                                    </div>
                                </section>`
                });
                myCommentList.innerHTML=str;
            }
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
        var activityList=document.querySelector('.my-comment-list');
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
var myComment=new MyComment();
myComment.getData();
myComment.showMenu();
function goToDetail(id,delFlag){
    if(delFlag==0){
        window.open('./activityDetails.html?id='+id);
    }else{
        alert('该活动已下线');
    }
    
  }