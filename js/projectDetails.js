var str = '';
var pageStr = '';
var docLink='';//初始

var pageNumber = !!getQueryVariable('pageNumber')?getQueryVariable('pageNumber'):1
var startTime = !!getQueryVariable('startTime')?getQueryVariable('startTime'):'';
var endTime = !!getQueryVariable('endTime')?getQueryVariable('endTime'):'';
var title = !!getQueryVariable("title") ? window.decodeURIComponent(getQueryVariable("title")) : "";
var apiDomain = 'http://m.womenvoice.cn:8080';//'' http://m.womenvoice.cn:8080
//var loginDomain = "http://b.womentest.com:81"; //'http://10.3.37.114:81'
//document.querySelector('meta[name="contentid"]').setAttribute('content',getQueryVariable('id'));
function ProjectDetails(){
   // this.getMore = this.getMore.bind(this);
}

ProjectDetails.prototype={
    Article:document.querySelector(".article"),
    more:document.querySelector(".more"),
    sign:document.querySelector('.sign'),
    getData:function(){
        var _this=this;
        var id = getQueryVariable("id");
        axios
    .get(apiDomain + "/webapi/project/get/" + id)
    .then(function (response) {
        var absRight = document.querySelector(".abs-right");
        var absLeft = document.querySelector(".abs-left");
        var down=document.getElementById('down');
        var res = response.data.data;
        down.href = res.applyTable;
        console.log(res);
        if(!!res){
            absLeft.innerHTML=`<img src="${res.image}" alt="">`;
            absRight.innerHTML=`<h2>${res.name}</h2>
                                <time>${res.sponsorTime}</time>`;
            _this.Article.innerHTML=`${res.content}`;
        }
        var html=document.documentElement;
        var relativeWidth=html.getBoundingClientRect().width;
        var articleHeightRem=_this.Article.offsetHeight/(relativeWidth/15);
        _this.more.style.display=articleHeightRem>18?'block':'';
        _this.more.addEventListener('click',function(){
            _this.getMore.call(_this);
        });
       _this.sign.style.display=new Date(res.endTime).getTime()+86400000 > res.distanceTime?'block':'none';
       //console.log(res.title);
        // document.querySelector('meta[name="contentid"]').setAttribute('content',res.id);
        // document.querySelector('meta[name="title"]').setAttribute('content',res.title);
       
        
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
        $('.sign-form').click(function() {
            isLogin = cheakLogin()
            //console.log(isLogin);
    
           if(!isLogin) {
                $('.back_mask').show();
                $('.login_block').show();
           }else{
               return false;
           }
           
        });
    },
    //选择地区下拉
    area:function (){
        var areaTitle=document.querySelector('.area-title');
        var selectBtn=document.querySelector('.select-btn');
        var areaList=document.querySelector('.area-list ul');
        var areaLi=areaList.querySelectorAll('li');
        areaTitle.onclick=function(e){
            e.stopPropagation();
            areaList.style.display='block';
            for(var i=0; i<areaLi.length; i++){
                areaLi[i].onclick=function(){
                    selectBtn.innerHTML=this.innerHTML;
                    areaList.style.display='';
                }
            }
        }
    },
    //上传文件
    fileUp:function() {
        myFile = document.getElementById("files");
        myFile.onchange = function() {
            var form = document.getElementById("uploads"),
                formData = new FormData(form);
                console.log(formData); 
            $.ajax({
              url: apiDomain + "/api/upload/file",
              type: "POST",
              data: formData,
              processData: false,
              contentType: false,
              success: function(res) {
                if (res) {
                  alert("上传成功！");
                }
                docLink = res.data.fileUrl;
                console.log(docLink);
              },
              error: function(err) {
                alert("网络连接失败,稍后重试", err);
              }
            });
          };
      },
    //报名
    iSign:function(){
        var id = getQueryVariable("id");
        var selectBtn=document.querySelector('.select-btn');
        var sign = document.querySelector(".sign");
        var submit = sign.querySelector(".submit"); //提交按钮
        var name = sign.querySelector("#name"); //用户名Input
        var phoneNum = sign.querySelector("#phoneNum"); //手机号
        var Email = sign.querySelector("#Email"); //邮箱
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
                        url:apiDomain + '/webapi/project/signUp',
                        withCredentials:true,
                        data:{
                            userName: name.value,
                            phone: phoneNum.value,
                            mail: Email.value,
                            sysCode: "project",
                            area: selectBtn.innerHTML,
                            sysId: id,
                            link: docLink
                        },
                        responseType: "json"
                    }).then(function(response){
                        $('.submit').removeAttr("disabled");
                        alert('项目申请成功')
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
var projectDetails=new ProjectDetails();

projectDetails.getData();
projectDetails.area();
projectDetails.iWantSign();
projectDetails.fileUp();
projectDetails.iSign();

