var imgCode = '';
$.cookie('token', '', {
     expires: -1
});
$.cookie('userInfo', '', {
     expires: -1
});

function getImgCode() {
     ajax({
          methods: 'POST',
          url: 'member-api-impl/longin/getImagecCode',
          data: {},
          success: function (response) {
               var data = response.data ? response.data : [];
               if (response.code == 200) {
                    imgCode = data[0];
                    $('#imgcode').attr('src', 'data:image/png;base64,' + data[1])
               } else {
                    setMessage({
                         type: 'warning',
                         msg: response.msg
                    });
               }
          },
          error: function (response) {

          }
     })
}
// 获取图形验证码
getImgCode();

// 账号、扫码切换
$('.code').on('click', 'li .fr', function () {
     $('.code').hide();
     $('.account').show();
})

$('.account').on('click', 'li .fr', function () {
     $('.account').hide();
     $('.code').show();
})
// 获取手机验证码
$('.account').on('click', 'ul li span.getcode', function () {
     var that = $(this);
     var phone = $('#phone').val();
     var pictureCode = $('#pictureCode').val();
     if (!phone) {
          setMessage({
               type: 'warning',
               msg: '手机号码不能为空'
          });
          return false;
     }
     if (!validate.validatPhone(phone)) {
          setMessage({
               type: 'warning',
               msg: '手机号码不正确'
          });
          return false;
     }
     if (!pictureCode) {
          setMessage({
               type: 'warning',
               msg: '图形验证码不能为空'
          });
          return false;
     }
     if (pictureCode.length != 4) {
          setMessage({
               type: 'warning',
               msg: '请输入四位图形验证码'
          });
          return false;
     }
     ajax({
          methods: 'post',
          url: 'member-api-impl/longin/getcode',
          data: {
               phone: phone,
               imageCode: pictureCode,
               margCode: imgCode
          },
          success: function (response) {
               var data = response.data ? response.data : [];
               if (response.code == 200) {
                    setMessage({
                         type: 'success',
                         msg: '获取成功'
                    });
                    $('.account .count_down').html(120);
                    $('.account .count_down').show();
                    that.hide();
                    var time = setInterval(function () {
                         var text = $('.account .count_down').html() * 1;
                         if (text == 0) {
                              $('.account .count_down').hide();
                              that.show();
                              clearInterval(time);
                         }
                         $('.account .count_down').text(text - 1)
                    }, 1000);
               } else {
                    setMessage({
                         type: 'warning',
                         msg: response.msg
                    });
               }

          },
          error: function (response) { }
     })
})
// 用户协议
$('.protocol img').click(function () {
     if ($(this).hasClass('selected')) {
          $(this).attr('src', 'common/images/dz_meixuan.png').removeClass('selected');;
     } else {
          console.log('a')
          $(this).attr('src', 'common/images/dz_xuanz.png').addClass('selected');
     }
})
// 登录判断
$('.account').on('click', 'ul li button', function () {
     var phone = $('#phone').val();
     var pictureCode = $('#pictureCode').val();
     var phoneCode = $('#phoneCode').val();
     if (!phone) {
          setMessage({
               type: 'warning',
               msg: '手机号码不能为空'
          });
          return false;
     }
     if (!validate.validatPhone(phone)) {
          setMessage({
               type: 'warning',
               msg: '手机号码不正确'
          });
          return false;
     }
     if (!pictureCode) {
          setMessage({
               type: 'warning',
               msg: '图形验证码不能为空'
          });
          return false;
     }
     if (pictureCode.length != 4) {
          setMessage({
               type: 'warning',
               msg: '请输入四位图形验证码'
          });
          return false;
     }
     if (!phoneCode) {
          setMessage({
               type: 'warning',
               msg: '手机验证码不能为空'
          });
          return false;
     }
     if (phoneCode.length != 6) {
          setMessage({
               type: 'warning',
               msg: '请输入六位手机验证码'
          });
          return false;
     }
     if ($('.count_down').html() == 0) {
          setMessage({
               type: 'warning',
               msg: '请重新发送手机验证码和更新新的图片验证码'
          });
          return false;
     }
     if (!$('.protocol img').hasClass('selected')) {
          setMessage({
               type: 'warning',
               msg: '请勾选登录协议'
          });
          return false;
     }
     ajax({
          methods: 'POST',
          url: 'member-api-impl/longin/phoneLogin',
          data: {
               phone: phone,
               imageAuthCode: pictureCode,
               margCode: imgCode,
               authCode: phoneCode,
               loginType: 1
          },
          success: function (response) {
               var data = response.data ? response.data : [];
               // data.token = 'eb3c0d47fd2046a1a5ed74b6cf5462ee1';
               // data.token = '71726bbfd67d4922be3ba3933306c69f5'
               if (response.code == 200) {
                    $.cookie('token', data.token, {
                         expires: 365,
                         secure: true
                    });
                    $.cookie('userInfo', JSON.stringify(data), {
                         expires: 365,
                         secure: true
                    });
                    // types 0 买家 2 供应商 1 卖家
                    // if (data.types == 0) {
                    //      window.location.href = 'sellerCenter/sellercenter.html';
                    // } else if (data.types == 1) {
                    //      window.location.href = 'supplierCenter/sellercenter.html';
                    // } else {
                    //      window.location.href = 'index.html';
                    // }
                    var url = '';
                    var array = window.location.pathname.split('/')
                    if (array[array.length - 1] == 'purchasingLogin.html') { //采购商
                         window.location.href = 'index.html';
                         return false;
                    }
                    if (array[array.length - 1] == 'villageLogin.html') { //村/户店商
                         window.location.href = 'sellerCenter/sellercenter.html';
                         return false;
                    }
                    if (array[array.length - 1] == 'supplierLogin.html') { //爱心供应商
                         window.location.href = 'supplierCenter/sellercenter.html';
                         return false;
                    }
                    if (array[array.length - 1] == 'administrationLogin.html') { //行政/机构
                         window.location.href = 'administrative/administrativeagencies.html';
                         return false;
                    }
                    window.location.href = 'index.html';
               } else {
                    setMessage({
                         type: 'warning',
                         msg: response.msg
                    });
               }
          },
          error: function (response) {

          }
     })
})
$('.login-footer').on('click', 'li', function () {
     var data = $(this).attr('data');
     if (data == 1) {
          window.location.href = './PrivacyProtocol.html';
     }
     if (data == 2) {
          window.location.href = './downLoadApp.html';
     }
     if (data == 3) {
           window.location.href = './agreement/faq.html';
     }
})