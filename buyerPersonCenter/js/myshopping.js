function init() {
     shopHeaderTop('#header-top'); //渲染公共顶部
     shopHeader('#s-header'); //渲染头部导航
     accountInfo(); // 获取账户信息
     myBalance(); //获取余额
}
init();

// 获取账户信息
function accountInfo() {
     ajax({
          methods: 'post',
          url: 'member-api-impl/user/accountDetail',
          data: {},
          success: function (response) {
               var data = response.data ? response.data : [];
               if (response.code == 200) {
                    var photo;
                    if (data.userImage) {
                         var photo = '<img src="' + data.userImage + '" alt=""  >';
                    } else {
                         photo = '<img src="../common/images/star2.png" alt=""  >';
                    }
                    $('.info-photo').append(photo);
                    // 加密手机号
                    var phone = '（' + data.phone.slice(0, 3) + '****' + data.phone.slice(7, 11) + '）';
                    $('.number').children().eq(0).children().html(phone)
                    $('.number').children().eq(1).children().html(data.userNum)
               } else {
                    setMessage({
                         type: 'warning',
                         msg: response.msg
                    });
               }

          },
          error: function (response) {}
     })
}


// 获取余额
function myBalance() {
     ajax({
          methods: 'post',
          url: 'member-api-impl/user/myBalance',
          data: {},
          success: function (response) {
               var data = response.data ? response.data : [];
               if (response.code == 200) {
                    $('.balance').children().html(data.balanceMoney);
               } else {
                    setMessage({
                         type: 'warning',
                         msg: response.msg
                    });
               }

          },
          error: function (response) {}
     })
}


// 点击头像跳转
$('#info .accountInfo .info-photo').click(function () {
     window.location.href = 'myProfile.html';
})
$('#info .accountInfo .number p').click(function () {
     window.location.href = 'myProfile.html';
})

//提现跳转
$('#info .fr p.withdrawal').click(function () {
     window.location.href = 'withdrawal.html';
})