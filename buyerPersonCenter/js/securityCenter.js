shopHeaderTop('#header-top'); //渲染公共顶部
shopHeader('#s-header'); //渲染头部导航

// 获取信息
getData()
var userInfo = {};

function getData() {
     ajax({
          url: 'member-api-impl/userInfo/getUserInfoView',
          methods: 'post',
          data: {},
          success: function (response) {
               var data = response.data ? response.data : {};
               if (response.code == 200) {
                    userInfo = data;
                    $('ul.list li').eq(0).children().eq(1).html(data.userPhone); //手机号
                    // substring(data.bankCard.length - 4, data.bankCard.length)
                    if (data.backInfoList && data.backInfoList.length > 0) {
                         var bom = '';
                         for (var i = 0; i < data.backInfoList.length; i++) {
                              bom += '<li>';
                              bom += '<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;银行卡：</span>';
                              bom += '<span>' + data.backInfoList[i].bankName + '(' + data.backInfoList[i].bankCard.substring(data.backInfoList[i].bankCard.length - 4, data.backInfoList[i].bankCard.length) + ')</span>'
                              bom += '<span class="unbind" id="' + data.backInfoList[i].id + '">解绑</span>';
                              bom += '</li>';
                         }
                         $('.bindBankList').html(bom);
                    }

               } else {
                    setMessage({
                         type: 'warning',
                         msg: response.msg
                    })
               }

          },
          error: function (response) {
               console.log(response)
          }
     })
}
// 修改手机号码-打开弹窗
$('.list').on('click', '.edit-phone', function () {
     $('#alertForm-phone').show();
     $('#alertForm-phone input').val('');
     $('#alertForm-phone .time span').html(0);
     getCode();
})
var code = '';
// 获取图形验证码
function getCode() {
     ajax({
          url: 'member-api-impl/longin/getImagecCode?type=2',
          methods: 'post',
          data: {},
          success: function (response) {
               var data = response.data ? response.data : {};
               if (response.code == 200) {
                    code = data[0];
                    $('.captcha').children().attr('src', 'data:image/png;base64,' + data[1])
               } else {
                    setMessage({
                         type: 'warning',
                         msg: response.msg
                    })
               }

          },
          error: function (response) {
               console.log(response)
          }
     })
}
// 获取验证码
var mobileSerial = '';
var timeName;
// 获取验证码
function getIphoneCode(id) {
     mobileSerial = '';
     var obj = {};
     var url = 'member-api-impl/longin/getcode';
     // 获取修改手机号的
     if (id == '#alertForm-phone') {
          if (!$('#alertForm-phone input[name="newPhone"]').val()) {
               setMessage({
                    type: 'warning',
                    msg: '手机号码不能为空'
               })
               return false;
          }
          if (!validate.validatPhone($('#alertForm-phone input[name="newPhone"]').val())) {
               setMessage({
                    type: 'warning',
                    msg: '手机号码格式不正确'
               })
               return false;
          }
          if (!$('#alertForm-phone input[name="captcha"]').val()) {
               setMessage({
                    type: 'warning',
                    msg: '图形验证码不能为空'
               })
               return false;
          }
          obj = {
               phone: $('#alertForm-phone input[name="newPhone"]').val(),
               imageCode: $('#alertForm-phone input[name="captcha"]').val(),
               margCode: code,
               codeType: 2
          }
     }
     if (id == '#alertForm-bind') {
          // 获取银行卡的
          if (!$('#alertForm-bind input[name="name"]').val()) {
               setMessage({
                    type: 'warning',
                    msg: '持卡人姓名不能为空'
               })
               return false;
          }
          if (!$('#alertForm-bind input[name="idCard"]').val()) {
               setMessage({
                    type: 'warning',
                    msg: '证件号码不能为空'
               })
               return false;
          }
          if (!validate.idCard($('#alertForm-bind input[name="idCard"]').val())) {
               setMessage({
                    type: 'warning',
                    msg: '身份证号码格式不正确'
               })
               return false;
          }
          if (!$('#alertForm-bind input[name="bankCard"]').val()) {
               setMessage({
                    type: 'warning',
                    msg: '银行卡号不能为空'
               })
               return false;
          }
          if (!validate.bank($('#alertForm-bind input[name="bankCard"]').val())) {
               setMessage({
                    type: 'warning',
                    msg: '银行卡号为16-19位数字'
               })
               return false;
          }
          if (!$(id + ' input[name="phone"]').val()) {
               setMessage({
                    type: 'warning',
                    msg: '手机号码不能为空'
               })
               return false;
          }
          if (!validate.validatPhone($(id + ' input[name="phone"]').val())) {
               setMessage({
                    type: 'warning',
                    msg: '手机号码格式不正确'
               })
               return false;
          }
          if ($(id).find('.text span').html() == '绑定银行卡') {
               obj = {
                    type: 4,
                    phone: $(id + ' input[name="phone"]').val(),
                    accountName: $('#alertForm-bind input[name="name"]').val(),
                    identityNo: $('#alertForm-bind input[name="idCard"]').val(),
                    accountNo: $('#alertForm-bind input[name="bankCard"]').val()


               }
          } else {
               obj = {
                    type: 5,
                    phone: $(id + ' input[name="phone"]').val(),
                    id: $('#alertForm-bind .title span').attr('id')
               }
          }
          url = 'member-api-impl/collectionAgreement/sendMessage';
     }
     ajax({
          url: url,
          methods: 'post',
          data: obj,
          success: function (response) {
               var data = response.data ? response.data : {};
               if (response.code == 200) {
                    setMessage({
                         type: 'success',
                         msg: '获取验证码成功'
                    })
                    $(id + ' .time span').html(60)
                    $(id + ' .get-captcha').css('display', 'none');
                    $(id + ' .time').css('display', 'block');
                    timeName = setInterval(function () {
                         if ($(id + ' .time span').html() == 0) {
                              clearInterval(timeName);
                              $(id + ' .get-captcha').css('display', 'block');
                              $(id + ' .time').css('display', 'none');
                         }
                         $(id + ' .time span').html($(id + ' .time span').html() * 1 - 1)
                    }, 1000)
                    if (id == '#alertForm-bind') {
                         mobileSerial = data.mobileSerial; //标识 帮绑定银行卡需要
                    }
               } else {
                    setMessage({
                         type: 'warning',
                         msg: response.msg
                    })
               }

          },
          error: function (response) {
               console.log(response)
          }
     })
}
// 修改手机号
function subIphone() {
     if (!$('#alertForm-phone input[name="newPhone"]').val()) {
          setMessage({
               type: 'warning',
               msg: '手机号码不能为空'
          })
          return false;
     }
     if (!validate.validatPhone($('#alertForm-phone input[name="newPhone"]').val())) {
          setMessage({
               type: 'warning',
               msg: '手机号码格式不正确'
          })
          return false;
     }
     if (!$('#alertForm-phone input[name="captcha"]').val()) {
          setMessage({
               type: 'warning',
               msg: '图形验证码不能为空'
          })
          return false;
     }
     if (!$('#alertForm-phone input[name="phoneCaptcha"]').val()) {
          setMessage({
               type: 'warning',
               msg: '手机验证码不能为空'
          })
          return false;
     }
     if ($('#alertForm-phone .time span').html() == 0) {
          setMessage({
               type: 'warning',
               msg: '请重新获取验证码'
          })
          return false;
     }
     ajax({
          url: 'member-api-impl/user/updBindPhone',
          methods: 'post',
          data: {
               newPhone: $('#alertForm-phone input[name="newPhone"]').val(),
               authCode: $('#alertForm-phone input[name="phoneCaptcha"]').val()
          },
          success: function (response) {
               var data = response.data ? response.data : {};
               if (response.code == 200) {
                    setMessage({
                         type: 'success',
                         msg: response.msg
                    })
                    $('#alertForm-phone').hide();
                    clearInterval(timeName);
                    getData();
               } else {
                    setMessage({
                         type: 'warning',
                         msg: response.msg
                    })
               }

          },
          error: function (response) {
               console.log(response)
          }
     })
}
// 设置交易密码-打开弹窗
$('.list').on('click', '.create-password', function () {
     $('#alertForm-create-password').show();
})
// 修改交易密码-打开弹窗
$('.list').on('click', '.edit-password', function () {
     $('#alertForm-edit-password').show();
})
// 绑定银行卡-打开弹窗
$('.list').on('click', '.bind', function () {
     $('#alertForm-bind').show();
     $('#alertForm-bind .title span').html('绑定银行卡');
     $('#alertForm-bind .bankBind').css('display', 'block');
     $('#alertForm-bind .time span').html(0);
     $('#alertForm-bind .text').css('height', '495px');
})
// 解绑
$('.list').on('click', '.unbind', function () {
     $('#alertForm-bind').show();
     $('#alertForm-bind .title span').html('解绑银行卡').attr('id', $(this).attr('id'));
     $('#alertForm-bind .bankBind').css('display', 'none');
     $('#alertForm-bind .text').css('height', '300px');
})
// 绑定银行卡(解绑)
function subBank() {
     var url = 'member-api-impl/collectionAgreement/addOpenSAccount';
     if ($('#alertForm-bind').find('.text span').html() == '绑定银行卡') {
          if (!$('#alertForm-bind input[name="name"]').val()) {
               setMessage({
                    type: 'warning',
                    msg: '持卡人姓名不能为空'
               })
               return false;
          }
          if (!$('#alertForm-bind input[name="idCard"]').val()) {
               setMessage({
                    type: 'warning',
                    msg: '证件号码不能为空'
               })
               return false;
          }
          if (!validate.idCard($('#alertForm-bind input[name="idCard"]').val())) {
               setMessage({
                    type: 'warning',
                    msg: '身份证号码格式不正确'
               })
               return false;
          }
          if (!$('#alertForm-bind input[name="bankCard"]').val()) {
               setMessage({
                    type: 'warning',
                    msg: '银行卡号不能为空'
               })
               return false;
          }
          if (!validate.bank($('#alertForm-bind input[name="bankCard"]').val())) {
               setMessage({
                    type: 'warning',
                    msg: '银行卡号为16-19位数字'
               })
               return false;
          }
     }

     if (!$('#alertForm-bind input[name="phone"]').val()) {
          setMessage({
               type: 'warning',
               msg: '手机号码不能为空'
          })
          return false;
     }
     if (!validate.validatPhone($('#alertForm-bind input[name="phone"]').val())) {
          setMessage({
               type: 'warning',
               msg: '手机号码格式不正确'
          })
          return false;
     }
     if ($('#alertForm-bind .time span').html() == 0) {
          setMessage({
               type: 'warning',
               msg: '请重新获取验证码'
          })
          return false;
     }
     if (!$('#alertForm-bind input[name="phoneCaptcha"]').val()) {
          setMessage({
               type: 'warning',
               msg: '验证码不能为空'
          })
          return false;
     }
     if ($('#alertForm-bind').find('.text span').html() == '绑定银行卡') {
          obj = {
               bankAccount: $('#alertForm-bind input[name="name"]').val(),
               idNumber: $('#alertForm-bind input[name="idCard"]').val(),
               bankCard: $('#alertForm-bind input[name="bankCard"]').val(),
               phone: $('#alertForm-bind input[name="phone"]').val(),
               authCode: $('#alertForm-bind input[name="phoneCaptcha"]').val(),
               mobileSerial: mobileSerial
          }
     } else {
          url = 'member-api-impl/collectionAgreement/delOpenSAccount';
          obj = {
               id: $('#alertForm-bind .title span').attr('id'),
               authCode: $('#alertForm-bind input[name="phoneCaptcha"]').val(),
               mobileSerial: mobileSerial
          };
     }
     ajax({
          url: url,
          methods: 'post',
          data: obj,
          success: function (response) {
               var data = response.data ? response.data : {};
               if (response.code == 200) {
                    setMessage({
                         type: 'success',
                         msg: response.msg
                    })
                    getData();
                    clearInterval(timeName);
                    $('#alertForm-bind').hide();
               } else {
                    setMessage({
                         type: 'warning',
                         msg: response.msg
                    })
               }

          },
          error: function (response) {
               console.log(response)
          }
     })
}
// 关闭弹窗
function CloseAlert(status) {
     if (status) {
           clearInterval(timeName);
     }
     $('.alertForm').hide();
}