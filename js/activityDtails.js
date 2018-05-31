var str = '';
var pageStr = '';

var pageNumber = !!getQueryVariable('pageNumber')?getQueryVariable('pageNumber'):1
var startTime = !!getQueryVariable('startTime')?getQueryVariable('startTime'):'';
var endTime = !!getQueryVariable('endTime')?getQueryVariable('endTime'):'';
var title = !!getQueryVariable("title") ? window.decodeURIComponent(getQueryVariable("title")) : "";
var apiDomain = 'http://m.womenvoice.cn:8080';// http://m.womenvoice.cn:8080
//var loginDomain = "http://b.womentest.com:81"; //'http://10.3.37.114:81'
//document.querySelector('meta[name="contentid"]').setAttribute('content',getQueryVariable('id'));
function ActivityDtails(){
   // this.getMore = this.getMore.bind(this);
}

ActivityDtails.prototype={
    Article:document.querySelector(".article"),
    more:document.querySelector(".more"),
    sign:document.querySelector('.sign'),
    getData:function(){
        var _this=this;
        var id = getQueryVariable("id");
        axios
    .get(apiDomain + "/webapi/activity/get/" + id)
    .then(function (response) {
        var when = document.querySelector(".when");
        var absRight = document.querySelector(".abs-right");
        var absLeft = document.querySelector(".abs-left");
        var res = response.data.data;
        console.log(res);
        if(!!res){
            absLeft.innerHTML=`<img src="${res.poster}" alt="">`;
            absRight.innerHTML=`<h2>${res.title}</h2>
                                <p>已报名：
                                    <span>${res.remainNum}</span>
                                    <em style="display:${res.num==-1?'none':''}">/${res.num}(人)</em>
                                </p>`;
            when.innerHTML=`<p>
                                <time>${res.startTime.split(" ")[0]} - ${res.deadLine.split(" ")[0]}</time>
                            </p>
                            <p>主办单位：
                                <span>${res.sponsor}</span>
                            </p>
                            <p>
                                <strong>北京 · </strong>
                                <span>${res.address}</span>
                            </p>`;
            _this.Article.innerHTML=`${res.description}`;
        }
        var html=document.documentElement;
        var relativeWidth=html.getBoundingClientRect().width;
        var articleHeightRem=_this.Article.offsetHeight/(relativeWidth/15);
        _this.more.style.display=articleHeightRem>18?'block':'';
        //_this.getMore = _this.getMore.bind(_this);
        //_this.more.addEventListener('click',_this.getMore.bind(_this));
        _this.more.addEventListener('click',function(){
            _this.getMore.call(_this);
        });
       _this.sign.style.display=new Date(res.deadLine.split(' ')[0]).getTime() + 86400000 > res.distanceTime&&(res.num==-1?Infinity:res.num)>res.remainNum ?'block':'none';
    
        document.querySelector('meta[name="contentid"]').setAttribute('content',res.id);
        document.querySelector('meta[name="title"]').setAttribute('content',res.title);
       
        
    })
    .catch(function (error) {
        alert('数据获取失败')
        console.log(error);
    });
    },
    getMore:function(){
        //console.log(this.Article);
        this.Article.style.maxHeight='100%';
        this.more.style.display='';
    },
    //点击我要报名判断是否登陆，如果未登录，显示登陆界面
    iWantSign:function (){
        $('.sign').click(function() {
            isLogin = cheakLogin()
    
           if(!isLogin) {
                $('.back_mask').show();
                $('.login_block').show();
           }else{
               return false;
           }
           
        })
    },
    //报名
    iSign:function(){
        var id = getQueryVariable("id");
        var sign = document.querySelector(".sign");
        var submit = sign.querySelector(".submit"); //提交按钮
        var name = sign.querySelector("#name"); //用户名Input
        var phoneNum = sign.querySelector("#phoneNum"); //手机号
        var Email = sign.querySelector("#Email"); //邮箱
        var Remark = sign.querySelector("#Remark"); //备注
        var errName = sign.querySelector(".errName"); //错误提示
        var errPhone = sign.querySelector(".errPhone");
        var errEmail = sign.querySelector(".errEmail");
        var nameOn=false,phonrOn=false,emailOn=false;
        //实时验证
        name.oninput = function() {
            if (name.value.trim() === "") {
              name.value = name.value.trim();
              errName.style.display = "block";
              return false;
            } else {
              errName.style.display = "";
              nameOn=true;
            }
          };
          phoneNum.oninput= function() {
            if (!/^1(3|4|5|7|8)\d{9}$/.test(phoneNum.value)) {
              errPhone.style.display = "block";
              return false;
            } else {
              errPhone.style.display = "";
              phonrOn=true;
            }
          };
          Email.oninput = function() {
            if (
              !/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(Email.value)
            ) {
              errEmail.style.display = "block";
              return false;
            } else {
              errEmail.style.display = "";
              emailOn=true;
            }
          };

        submit.onclick=function(){
                if(nameOn&&phonrOn&&emailOn){
                    $('.submit').attr("disabled","disabled");
                    axios({
                        method:'post',
                        url:apiDomain + '/webapi/activity/applyActivity',
                        withCredentials:true,
                        data:{
                            userName: name.value,
                            phone: phoneNum.value,
                            mail: Email.value,
                            remark: Remark.value,
                            sysCode: "activity",
                            sysId: id
                        }
                    }).then(function(response){
                        alert('报名成功');
                        $('.submit').removeAttr("disabled");
                        setTimeout(reloading, 2000);
                        function reloading() {
                            location.reload();
                        }
                    }).catch(function(error) {
                        $('.submit').removeAttr("disabled");
                        alert(error);
                    });
                }
            
        }
    }
}
var activityDtails=new ActivityDtails();

activityDtails.getData();
activityDtails.iWantSign();
activityDtails.iSign();

