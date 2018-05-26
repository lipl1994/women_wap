//获取元素
//var loginDomain = "http://b.womentest.com:81"; //'http://10.3.37.114:81'
var registerMain = document.querySelector(".register-main"); //获取大容器
var setName = registerMain.querySelector(".set-name"); //设置密码框
var setPassword = registerMain.querySelector(".set-password"); //确认密码框
var finishBtn = registerMain.querySelector(".finish-btn"); //完成框
var phoneCode = localStorage.getItem("phoneCode"); //手机验证码
var phoneNum = localStorage.getItem("phoneNum"); //手机号
var back=document.querySelector('.back');
var pwd_onOf=false, conpwd_onOf=false;

//密码校验
setName.oninput = function() {
  if (setName.value.length>15||setName.value.length<6) {
    //console.log(1);
    setName.style.border = "1px solid #e60012";
  } else {
    setName.style.border = "";
     pwd_onOf=true;
  }
};

//确认密码校验
setPassword.oninput = function() {
  if (setPassword.value!=setName.value) {
    //console.log(1);
    setPassword.style.border = "1px solid #e60012";
  } else {
    setPassword.style.border = "";
    conpwd_onOf=true;
  }
};
back.addEventListener('click',function(){
  window.location.href='./find-password.html';
});
finishBtn.addEventListener("click", function() {
  if(pwd_onOf&&conpwd_onOf){
    axios({
      method: "put",
      url:"http://10.3.37.114:81/api/v2/user/retrieve-password",
      data: {
        phone: phoneNum,
        password: setName.value,
        verifiable_type: "sms",
        verifiable_code: phoneCode
      }
    }).then(function(response) {
      alert('修改成功');
    }).catch(function(err){
        console.log(err)
    });
  }
  
});
