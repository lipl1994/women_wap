
var loginDomain = "http://fulian.womenvoice.cn"; //'http://10.3.37.114:81'
//图片验证码
(function() {
  var img = document.querySelector(".code img");
  img.onclick = function() {
    this.src = this.src + "&t=" + Date.now();
  };
})();

//手机验证码
(function() {
  axios.defaults.headers.post["Content-Type"] =
    "application/x-www-form-urlencoded";
  var sentCode = document.querySelector(".sent-code");
  var inpuCode = document.querySelector(".code input");
  var phoneNum = document.getElementById("phoneNum");
  var nextBtn = document.querySelector(".next-btn");
  //console.log(nextBtn);
  var phoneCode = document.getElementById("phoneCode");
  var onOf = true;
  var nextOn = true;
  sentCode.addEventListener("click", function() {
    var num = 60;
    var time;
    if (!onOf) {
      return;
    }
    axios({
      withCredentials: true,
      method: "post",
      url: loginDomain + "/passport/checkcaptchas?type=api",
      // headers: {
      //     //'Content-Type': 'application/x-www-form-urlencoded'
      // },
      data: {
        captcha: inpuCode.value
      }
    })
      .then(function(response) {
        time = setInterval(function() {
          num--;
          sentCode.style.background = "#9B9B9B";
          if (num < 0) {
            //console.log(2);
            sentCode.innerHTML = "发送验证码";
            sentCode.style.background = "";
            onOf = true;
            return clearInterval(time);
          }
          sentCode.innerHTML = "等待" + num + "秒";
        }, 1000);
        axios({
          withCredentials: true,
          method: "post",
          url:loginDomain + "/api/v2/verifycodes/register",
          data: {
            phone: phoneNum.value
          },
          validateStatus: function(status) {
            return status < 800; // 状态码在大于或等于500时才会 reject
          }
        })
          .then(function(response) {
            if (response.status >= 400) {
              onOf = true;
              alert(response.data.message);
            } else {
              nextBtn.style.background='#D87B7A';
              nextBtn.style.color='#fff';
              nextBtn.addEventListener("click", function() {
                if (!/^1(3|4|5|7|8)\d{9}$/.test(phoneNum.value)) {
                  phoneNum.style.border = "1px solid #e60012";
                  return false;
                }
                localStorage.setItem("phoneCode", phoneCode.value);
                localStorage.setItem("phoneNum", phoneNum.value);
                window.location.href = "./user-set.html";
              });
            }
          })
          .catch(function(error) {
            onOf = true;
            console.log(error.response);
            //alert('图形验证码不正确');
          });
      })
      .catch(function(error) {
        onOf = true;
        alert("图形验证码不正确");
      });

    onOf = false;
  });

  phoneNum.oninput= function() {
    if (!/^1(3|4|5|7|8)\d{9}$/.test(phoneNum.value)) {
      phoneNum.style.border = "1px solid #e60012";
      return false;
    } else {
      phoneNum.style.border = "";
    }
  };
})();
