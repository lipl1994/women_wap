// 频道id 文章id 文章标题
var categoryId = 0, articleId = 0,title='',isReplyShow=false;
//评论模块数据接口地址
var domain = 'http://api.womenvoice.cn';//http://api.womenvoice.cn';
//登录注册模块数据接口地址
var loginDomain = 'http://fulian.womenvoice.cn';//'http://fulian.womenvoice.cn/'

var replyObj = {parentId:'', replyCommentId:''}

var isLogin = false
$(document).ready(function () {

    // 检查是否登陆过了
    isLogin = cheakLogin()
    if(isLogin) {
        var userName = getCookie('userName')
        !!userName?userName:'未知用户'
        $('.comment_login').text(userName)
        $('.comment_login').removeClass('comment_login')
    }

    //获取<meta>标签中的文章id,类目id,title信息
    categoryId = document.querySelector('meta[name="catalogs"]').getAttribute('content');
    articleId = document.querySelector('meta[name="contentid"]').getAttribute('content');
    title = document.querySelector('meta[name="title"]').getAttribute('content');

    //获取评论列表
    getNewComments()
    getHotComments()

    //点击写评论输入框事件
    $('#add_comment_action').click(function() {
        isLogin = cheakLogin()

       if(isLogin) {
           $(this).hide()
           $('.textarea_submit').show()
           $('#add_new_comment').focus()
       }
       else {
           $('.back_mask').show()
           $('.login_block').show()
       }
    })

    $('.wap_comment_container').on('click', '.face',(function (event) {
        if (!$('#sinaEmotion').is(':visible')) {
            $(this).sinaEmotion();          
            event.stopPropagation();
        }
        // if($(this).parents('.reply_block').length > 0){
        //     $('#sina-emotion').css('bottom','414px!important')
        // }
    }))

    $('.wap_comment_container').on('click', '.submit_btn',(function (event) {
        var content = $(this).parents('form').children('textarea').val().trim()
        var parentId = '', replyCommentId = '',replyTo = ''
        if ($(this).hasClass('replyComment')) {
            parentId = replyObj.parentId
            replyCommentId = replyObj.replyCommentId
        }
        
        var userInfo = getCookieObj()
        var articleUrl = window.location.href
        
        if (!!content) {
            var data = {
                content: content,
                categoryId: categoryId,
                articleId: articleId,
                title:title,
                replyUserOpenId: userInfo.userId,
                userName: userInfo.userName,
                userIp: userInfo.userIp,
                userIcon: userInfo.userIcon,
                parentId: parentId,
                replyCommentId: replyCommentId,
                area: userInfo.userArea=='null'?null:userInfo.userArea,
                articleUrl:articleUrl,
                commmentType:'user'
            }
            $.ajax({
                url: domain + "/webapi/comment/addComment",
                data: JSON.stringify(data),
                type: 'POST',
                contentType: 'application/json',
                success: function (data) {
                    alert("收到您的评论。感谢您的关注和发言！")
                    setTimeout(location.reload(),1500);

                },
                error: function (data) {
                    alert("操作失败")
                    return false
                }
            })

        }
        else {
            alert('内容不能为空')
            return false
        }
    }))

    $('.wap_comment_container').on('click','.comment_login',(function (event) {
        $('.back_mask').show()
        $('.login_block').show()
    }))

    $('.login_btn').click(function() {
        var userName = $('#login_user_name').val().trim()
        var password = $('#login_password').val().trim()

        var params = {
            login: userName,
            password: password,
            type: 'comment'
        }
        if (!!userName && !!password){
            $.ajax({
                url: loginDomain + "/api/v2/tokens",
                data: JSON.stringify(params),
                type:'POST',
                contentType: 'application/json',
            }).done(function (data) {
                setUserInfo(data)//设置用户信息
                $('.red-notice').hide()
                $('.back_mask').hide()
                $('.login_block').hide()
            })
            .fail(function(data){
                console.log(data)
                $('.red-notice').css('display','block')
                
                if (data.status=='422'){
                    if (!!data.responseJSON.password){
                        $('.red-notice').text('密码错误')
                        $('#login_password').addClass('input_red')
                    }
                    else if (!!data.responseJSON.message){
                        $('.red-notice').text(data.responseJSON.message[0])
                    }
                }
                else if (data.status == '404'){
                    $('.red-notice').text('用户不存在')
                    $('#login_user_name').addClass('input_red')
                }
            })
        }
        else {
            $('.login_btn').removeClass('active')
            alert("请正确填写用户名密码")
        }
    })

    //点击赞
    $('.wap_comment_container').on("click", '.likes',function(){ 
        var commentId = '' 
        var parentBlock =  $(this).parents('.parent_floor')
        if(parentBlock.length > 0){
            commentId = parentBlock.attr('data-id')
        }
        else {
            commentId = $(this).parents('.dialog_floor').attr('data-id')
        }    
        var me = this

        if(!$(me).attr('data-voted')){
        
            var bodyFormData = new FormData();
            bodyFormData.set('commentId', commentId);

            axios({
                method: 'post',
                url: domain + "/webapi/comment/likes",
                data: bodyFormData,
                config: { headers: {'Content-Type': 'multipart/form-data' }}
              })
              .then(function (data) {
                    console.log(data)
                    $(me).find('span').text(data.data.data.likes)
                    $(me).find('span').addClass('red')
                    $(me).find('img').attr('src','./images/btn_like.png')
                    $(me).attr('data-voted',true)
              })
              .catch(function (error) {
                  alert('操作失败')
                    console.log(error);
              });
        }
    })

    //点击回复
    $('.wap_comment_container').on('click','.reply',function() {
        isLogin = cheakLogin()
        if(isLogin) {
            var parentId = $(this).parents('.comment_unit_block').children('.parent_floor').attr('data-id') || ''
            var replyCommentId = $(this).parents('.dialog_floor').attr('data-id') || ''
            $('.back_mask').show()
            $('.reply_block').show()

            replyObj = {
                parentId: parentId,
                replyCommentId: replyCommentId
            }
        }
        else {
            $('.back_mask').show()
            $('.login_block').show()
        }
        
        
    })

    $('.back_mask').click(function() {
        $(this).hide()
        $('.login_block').hide()
        $('.login_container').children('input').val('')
        $('.red-notice').hide()
        $('.login_container').children('input').removeClass('input_red')
    })

    $('.cancle_btn').click(function() {
        $('.back_mask').hide()
        $('.reply_block').hide()
        $(this).parents('form').children('textarea').val('')
        replyObj = {
            parentId: '',
            replyCommentId: ''
        }
    })

})

function getCookieObj() {
    var userInfo = {
        userName: getCookie('userName'),
        userId: getCookie('userId'),
        userIp: getCookie('userIp'),
        userIcon: getCookie('userIcon'),
        userArea: getCookie('userArea')
    }
    return userInfo
    
}

function checkInput(){
    var userName = $('#login_user_name').val().trim()
        var password = $('#login_password').val().trim()

        if(!!userName && !!password) {
            $('.login_btn').addClass('active')
        }
        else {
            $('.login_btn').removeClass('active')
        }
}

function setUserInfo(data) {
    if(!!data.userName){
        $('.comment_login').text(data.userName)
        $('.comment_login').removeClass('comment_login')
    }

    var date = new Date();
    date.setHours(date.getHours() + (24 * 30)); //保存一个月
    var domainCookie = "; domain=" + GetCookieDomain() + "; path=/";
    document.cookie = "expires=" + date.toGMTString() + domainCookie
    document.cookie = "userName=" + data.userName + domainCookie
    document.cookie = "userId=" + data.userId + domainCookie
    document.cookie = "userIp=" + data.userIp + domainCookie
    document.cookie = "userIcon=" + data.userIcon + domainCookie
    document.cookie = "userArea=" + data.userArea+  domainCookie
}

function GetCookieDomain() {
	var host = location.hostname;
	var ip = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
	if (ip.test(host) === true || host === 'localhost') return host;
	var regex = /([^]*).*/;
	var match = host.match(regex);
	if (typeof match !== "undefined" && null !== match) host = match[1];
	if (typeof host !== "undefined" && null !== host) {
		var strAry = host.split(".");
		if (strAry.length > 1) {
			host = strAry[strAry.length - 2] + "." + strAry[strAry.length - 1];
		}
	}
	return '.' + host;
}

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

function getCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=")
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1
            c_end = document.cookie.indexOf(";", c_start)
            if (c_end == -1) c_end = document.cookie.length
            return decodeURIComponent(document.cookie.substring(c_start, c_end))
        }
    }
    return ""
}

function getNewComments() {
    var data = {
        categoryId: categoryId,
        articleId: articleId
    }

    axios.get(domain + "/webapi/comment/list", {
        params: data,
        dataType: "json", 
        crossDomain: true,
      })
      .then(function (data) {
        setNewComments(data.data,'newList')
        
      })
      .catch(function (error) {
        console.log(error);
      });
} 

function getHotComments() {
    var data = {
        categoryId: categoryId,
        articleId: articleId
    }

    axios.get(domain + "/webapi/comment/hots", {
        params: data,
        dataType: "json", 
        crossDomain: true,
      })
      .then(function (data) {
        setNewComments(data.data,'hotList')
        
      })
      .catch(function (error) {
        console.log(error);
      });

}

function setNewComments(data,selector) {
    var listItemString = ''
    var commentsData = !!data.data && data.data.list ? data.data.list : data.data
    if (!!commentsData && !!commentsData.length){
        $('.' + selector).parent('.comment-util').show()
        $('.have_no_comment').hide()
        for(var i = 0;i < commentsData.length; i++){
            listItemString += '<div class="comment_unit_block"><div class="parent_floor" data-id=' + commentsData[i].id  + '><div class="comment_info clearfix"><div class="user_info fl">' + (!!commentsData[i].userIcon && commentsData[i].userIcon!='null' ? '<img src="' + commentsData[i].userIcon +'">' : '<img src="./images/default_profile.png">') + 
                '<div><p>' + commentsData[i].userName + '</p><span>' + formatTime(commentsData[i].createAt) +'</span></div></div><div class="comment_likes fr"><div class="likes"><span>' + commentsData[i].likes + '</span><img src="./images/btn_like_sele.png" alt="">' +
                '</div><div class="reply"><img src="./images/reply.png" alt=""></div></div></div><div class="comment_content"><p class="text">' + commentsData[i].content +
                '</p></div></div>'
            if (!!commentsData[i].replyComment && !!commentsData[i].replyComment.length) {
                var replyComment = commentsData[i].replyComment
                for (var j = 0; j < replyComment.length; j++){
                    listItemString += '<div data-id="' + replyComment[j].id + '" class="dialog_floor"><div class="comment_info clearfix"><div class="user_info fl"><div><p><i class="' + (replyComment[j].commmentType == 'admin'? 'admin_reply': '') + '">' + replyComment[j].userName +
                        '</i><i class="reply_text">回复:</i>' + replyComment[j].replyTo + '</p><span>' + formatTime(replyComment[j].createAt) + '</span></div></div><div class="comment_likes fr"><div class="likes"><span>' +
                        replyComment[j].likes + '</span><img src="./images/btn_like_sele.png" alt=""></div><div class="reply"><img src="./images/reply.png" alt=""></div></div></div><div class="comment_content"><p class="text">' +
                        replyComment[j].content + '</p></div></div>'
                }
            }
            listItemString += '</div></div>'

        }
        $("." + selector).append(listItemString)
        formatContent()
    }
}

//渲染新浪表情
function formatContent(text) {
    var textArray = $('.text')
    for (var i = 0; i < textArray.length;i++){
        $(textArray[i]).html(textArray[i].innerHTML).parseEmotion()
    }
}

function formatTime(date) {
    date=date+'';
    if(date==""){
        date= new Date();
    }else if(date.length>10){
        date = new Date(parseInt(date));
    }else{
        date = new Date(parseInt(date) * 1000);
    }
    function pad(num, n) {
        var len = num.toString().length;
        while(len < n) {
            num = "0" + num;
            len++;
        }
        return num;
    }
    var dateTime = "";
    var minute = 1000 * 60;
    var hour = minute * 60;
    var day = hour * 24;
    var halfamonth = day * 15;
    var month = day * 30;
    function getDateDiff2(dateTimeStamp){
        var now = new Date().getTime();
        var diffValue = now - dateTimeStamp;
        var monthC =diffValue/month;
        var weekC =diffValue/(7*day);
        var dayC =diffValue/day;
        var hourC =diffValue/hour;
        var minC =diffValue/minute;
        
        var y_o = date.getFullYear(),y_n = (new Date()).getFullYear();
        var d_o = date.getDate(),    d_n = (new Date()).getDate();//日
        var h_o = date.getHours(),   h_n = (new Date()).getHours(); //小时
        var m_o = date.getMinutes(), m_n = (new Date()).getMinutes(); //分
        var s_o = date.getSeconds(), s_n = (new Date()).getSeconds();//秒
        var result="";
        if(y_o!=y_n){
                result=(y_o + '')+"-"+ pad(date.getMonth() + 1,2)+ "-" +pad(d_o,2); 
        }else if (y_n == y_o){
            if(d_n-d_o==1){
                result="昨天 "+pad(h_o,2)+":"+pad(m_o,2);
            }else if(d_n-d_o>1){
                result=(y_o + '')+"-"+pad(date.getMonth() + 1,2)+ "-" +pad(date.getDate(),2);
            }else {
                if(minC>30){
                    result=pad(h_o,2)+":"+pad(m_o,2);
                }else if (minC<=30 && minC>0){
                    if(m_n-m_o==0)
                        result=Math.abs(m_n-m_o+1)+"分钟前";
                    else{
                        result=Math.abs(m_n-m_o)+"分钟前";
                    }
                    }else {
                    result="1分钟前";
                    }
            }
        }
        return result;
    }
    dateTime = getDateDiff2(date);
    return dateTime;
}