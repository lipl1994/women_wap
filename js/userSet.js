//获取元素
var loginDomain = "http://b.womentest.com:81"; //'http://10.3.37.114:81'
var registerMain = document.querySelector(".register-main"); //获取大容器
var setName = registerMain.querySelector(".set-name"); //设置昵称框
var setPassword = registerMain.querySelector(".set-password"); //设置密码框
var confirmPwd = registerMain.querySelector(".confirm-pwd"); //确认密码框
var finishBtn = registerMain.querySelector(".finish-btn"); //完成框
var phoneCode = localStorage.getItem("phoneCode"); //手机验证码
var phoneNum = localStorage.getItem("phoneNum"); //手机号
var name_onOf=false,pws_onOf=false,conpwd_onOf=false;
var back=document.querySelector('.back');

//验证用户名
var nameVal = new RegExp(/^[a-zA-Z0-9_u4E00-\u9FA5\-%&$#@]*$/); //用户名规则
setName.oninput = function() {
  if (
    !nameVal.test(setName.value) ||
    setName.value.length < 2 ||
    setName.value.length > 12
  ) {
    //console.log(1);
    setName.style.border = "1px solid #e60012";
  } else {
    setName.style.border = "";
    name_onOf=true;
  }
};
//密码校验
setPassword.oninput = function() {
  if (setPassword.value.length>15||setPassword.value.length<6) {
    //console.log(1);
    setPassword.style.border = "1px solid #e60012";
  } else {
    setPassword.style.border = "";
    pws_onOf=true;
  }
};
//确认密码校验
confirmPwd.oninput = function() {
  if (confirmPwd.value!=setPassword.value) {
    //console.log(1);
    confirmPwd.style.border = "1px solid #e60012";
  } else {
    confirmPwd.style.border = "";
    conpwd_onOf=true;
  }
};
finishBtn.addEventListener("click", function() {
  if(name_onOf&&pws_onOf&&conpwd_onOf){
    axios({
      method: "post",
      url: loginDomain + "/api/v2/users",
      data: {
        phone: phoneNum,
        name: setName.value,
        password: setPassword.value,
        verifiable_type: "phone",
        verifiable_code: phoneCode
      }
    }).then(function(response) {
      alert('注册成功')
    });
  }
  
});
back.addEventListener('click',function(){
  window.location.href='./register.html';
});