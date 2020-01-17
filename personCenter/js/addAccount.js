function init() {
     headerTop('#header'); //渲染顶部
     headerNav('#header-seach'); //渲染头部导航
     // types 0 买家 2 供应商 1 卖家
     // var userInfo = $.cookie('userInfo') ? JSON.parse($.cookie('userInfo')) : {};
     $('.centre-left-nav').children('.types_1,.types_2').hide();
     //   if (userInfo.types == 1) {
     //        $('.centre-left-nav').children('.types_2').hide();
     //   } else if (userInfo.types == 2) {
     //        $('.centre-left-nav').children('.types_1').hide();
     //   } else {
     //        
     //   }

}
init();


// 添加
$('.edit').on('click', function () {
     window.location.href = '../sellerCenter/addAccount.html?name=personCenter';
})


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
                    $('.info-photo').prepend(photo);
                    // var account = '<li><span>登录账号：</span><span class="right">' + data.phone + '</span></li>';
                    // account += '<li><span>账号ID：</span><span class="right">' + data.userNum + '</span></li>';
                    // account += '<li><span>注册时间：</span><span class="right">' + data.createTime + '</span></li>';
                    // account += '<li><span>上次登录：</span><span class="right">' + data.lastLoginTime + '</span></li>';
                    // $('.info-account').append(account);

                    var account = '<li> <div class="fl"> 账户名：<span class="right">' + data.nickname + '</span></div> <div class="fl"> 注册时间：<span class="right">' + data.createTime + '</span></div></li>';
                    account += '<li> <div class="fl"> 账号ID：<span class="right">' + data.userNum + '</span></div> <div class="fl"> 上次登录时间：<span class="right">' + data.lastLoginTime + '</span></div></li>';
                    $('.info-account').append(account);
                    // types 0 买家 2 供应商 1 卖家
                    if (data.types == 2) {
                         $('.accountType').html('<span class="fl center accountType">供应商</span>');
                         $('.centre-left-nav').children('.types_2').show();
                    } else if (data.types == 1) {
                         $('.accountType').html('<span class="fl center accountType">卖家</span>');
                         $('.centre-left-nav').children('.types_1').show();
                    } else {
                         $('.centre-left-nav').children('.types_1,.types_2').hide();
                         $('.accountType').html('<span class="fl center accountType">普通用户</span>');
                    }
                    $('.phone').html(data.phone);
                    $('.appid').html(data.wechatAccount);
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
accountInfo();