/*
 * @Author: liwanli
 * @Date: 2019-05-29 10:11:00
 * @Last Modified by: liwanli
 * @Last Modified time: 2019-06-27 16:51:03
 * 订单付款页面Js文件 payment.js
 */


//渲染公共顶部
shopHeaderTop('#header-top');
//渲染公共头部
shopHeader('#s-header');

var orderData = getQueryString('orderinfo');
orderData = orderData ? JSON.parse(unescape(orderData))[0] : {};
var params = {
     // 支付参数：
     // orderId 订单id
     // orderPayMoney 订单金额
     orderId: orderData.orderId,
     orderPayMoney: orderData.orderPayMoney,
     // payType: 'ALI'
}
paySelect(); // 支付选择方式
paySelectBankDom(); //渲染银行卡列表
bankSelect(); // 银行卡选择
// downTime(); //订单剩余支付时间
$('#surplusTime').hide(); //订单剩余支付时间

/**
 * 订单剩余支付时间
 */
function downTime() {
     var defaultTime = 1800;
     var timeDom = $('#surplusTime span');
     var sec = '00';
     var min = '00'
     var timer = setInterval(function () {
          defaultTime--;
          min = Math.floor(defaultTime / 60);
          sec = Math.floor(defaultTime % 60);
          var strTime = "0:" + reZero(min) + ":" + reZero(sec);
          timeDom.text(strTime)
          if (defaultTime < 1) {
               clearInterval(timer)
          }
     }, 1000);

     function reZero(time) {
          return time < 10 ? '0' + time : time
     }
}

/**
 * 支付选择方式
 */
// var qrcode_wx = new QRCode(document.getElementById("qrcode_wx"), {
//      width: 220,
//      height: 220
// });
var qrcode_apliy = new QRCode(document.getElementById("qrcode_apliy"), {
     width: 220,
     height: 220
});
var payForAnother = false;
$('#payForAnother').change(function () {
     if (this.checked) {
          payForAnother = true;
     } else {
          payForAnother = false;
     }
     var origin = window.location.origin;
     var orderMoney = orderData.orderPayMoney;
     var orderId = orderData.orderId;
     var orderDetail = {
          orderMoney: orderMoney,
          orderId: orderId,
          token: $.cookie('token'),
          payForAnother: payForAnother
     };
     orderDetail = JSON.stringify(orderDetail);
     // 支付宝已授权
     qrcode_apliy.makeCode(origin + "/h5/pay?orderData=" + orderDetail);
})

function paySelect() {
     var origin = window.location.origin;
     var orderMoney = orderData.orderPayMoney;
     var orderId = orderData.orderId;
     var orderDetail = {
          orderMoney: orderMoney,
          orderId: orderId,
          token: $.cookie('token'),
          payForAnother: payForAnother
     };
     orderDetail = JSON.stringify(orderDetail);
     ajax({
          url: 'member-api-impl/user/alipayAuth',
          methods: 'post',
          data: {},
          success: function (response) {
               if (response.code == 200) {
                    // if (response.data) {
                    // 支付宝已授权
                    qrcode_apliy.makeCode(origin + "/h5/pay?orderData=" + orderDetail);
                    // } else {
                    // 支付宝未授权
                    // qrcode_apliy.makeCode(origin + "/h5/empower?orderData=" + orderDetail);

                    // }
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
     $('#payment-mode').on('click', 'li', function () {
          $('#payment-mode li').removeClass('active');
          $(this).addClass('active');
          $('.payment-sec').hide().eq($(this).index()).show();
          var index = $(this).index();
          if($(this).text() === '网银支付') {
               $('#go_pay').show();
               $('#go_detail').hide();
          } else {
               $('#go_pay').hide();
               $('#go_detail').show();
          }
     })
}

/**
 * 渲染银行卡列表
 */
function paySelectBankDom() {
     // var authBankData = ['']
     // var eBankData = ['']
     var isBindCard = false;
     var authBankDom = '';
     var eBankDom = '';
     backlength = 12;
     if (isBindCard) {
          $('#authBank').next().show();
          for (var i = 1; i < backlength; i++) {
               if (i == 1) {
                    authBankDom += '<li class="bank-item"><img src="../common/images/bank_' + i + '.png" /></li>';
               } else {
                    authBankDom += '<li class="bank-item"><img src="../common/images/bank' + i + '.png" /></li>';
               }
          };
     } else {
          $('#authBank').next().hide();
          authBankDom += '<p class="nobank">您还未绑卡哦，请前往 <a href="">【安全中心】</a>绑卡</p>';
     }
     // if (isBindCard) {
     // $('#eBank').next().show();
     for (var i = 1; i < backlength; i++) {
          if (i == 1) {
               eBankDom += '<li class="bank-item"><img src="../common/images/bank_' + i + '.png" /></li>';
          } else {

               eBankDom += '<li class="bank-item"><img src="../common/images/bank' + i + '.png" /></li>';
          }
     };
     // } else {
     //     $('#eBank').next().hide();
     //     eBankDom += '<p class="nobank">您还未绑卡哦，请前往 <a href="">【安全中心】</a>绑卡</p>';
     // }
     $('#authBank').append(authBankDom);
     $('#eBank').append(eBankDom);
}
/**
 * 银行卡选择
 */
function bankSelect() {
     var eBank = $('#eBank');
     var eBankList = eBank.children('li');
     eBank.on('click', 'li', function () {
          for (var i = 0; i < eBankList.size(); i++) {
               console.log(i)
               eBankList.eq(i).find('img').attr('src', '../common/images/bank' + (i + 1) + '.png');
          }
          $(this).find('img').attr('src', '../common/images/bank_' + ($(this).index() + 1) + '.png')
     })
}
offlinePayment();

function offlinePayment() {
     // 参数：
     // orderId 订单id
     // orderPayMoney 订单金额
     ajax({
          url: 'order-api-impl/orderpay/offlinePayment',
          methods: 'post',
          data: params,
          success: function (response) {
               if (response.code == 200) {
                    // payee_card_no: "98001230903300070008"
                    // payee_name: "张孝德"
                    var ebankhtml = '<dl class="money">';
                    ebankhtml += '<dt>待支付金额：</dt>';
                    ebankhtml += '<dd>' + orderData.orderPayMoney + '<b>元</b> <em>&nbsp;&nbsp;&nbsp;&nbsp;注：金额要精确到0.01元</em></dd></dl>';
                    // ebankhtml += '<dl class="ebankname"><dt>收款方银行：</dt><span>浙江网商银行</span></dl>';
                    // ebankhtml += '<dl><dt>收款方户名：</dt><span>' + response.data.payee_name + ' </span></dl>';
                    // ebankhtml += '<dl class="ebanknum"><dt>收款方卡号：</dt><span>' + response.data.payee_card_no + '</span></dl>';
                    // ebankhtml += '<dl class="tip"><dt>温情提醒：</dt><dd class="content">1. 请使用线下网银转账方式将金额支付至收款账户；<br>2. 实际支付金额需跟待支付金额完全一致， 否则会造成付款失败；<br>3. 该收款账号为爱心购平台官方担保账号， 请放心支付， 如有疑问请联系客服： 0571 - 88030268；<br> 4. 使用网银支付成功后， 订单状态会在30分钟内改变， 请注意查看。</dl >';
                    $('.payment-sec.e-bank ul').html(ebankhtml)
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

/**
 * 选择银行立即支付操作
 */

function goPayBtn() {
     // ajax({
     //      url: '/order-api-impl/orderpay/selectOrderPay',
     //      methods: 'post',
     //      data: params,
     //      success: function (response) {
     //           if (response.code == 200) {
     //                setMessage({
     //                     type: 'success',
     //                     msg: '操作成功'
     //                })

     //           } else {
     //                setMessage({
     //                     type: 'warning',
     //                     msg: response.msg
     //                })
     //           }
     //      },
     //      error: function (response) {
     //           console.log(response)
     //      }
     // })
}

// qrcode_apliy.makeCode('http://192.168.0.200:8080/shoppingPlatformPC/purchase/payment.html');
// qrcode_wx.makeCode('http://192.168.0.200:8080/shoppingPlatformPC/purchase/payment.html');


// 获取银行卡
getBankList();

function getBankList() {
     ajax({
          url: 'member-api-impl/userInfo/getUserInfoView',
          methods: 'post',
          data: params,
          success: function (response) {
               var dada = response.data ? response.data : {};
               if (response.code == 200) {
                    var dom = '';
                    for (var i = 0; i < dada.backInfoList.length; i++) {
                         dom += '<option value="' + dada.backInfoList[i].id + '">' + dada.backInfoList[i].bankName + '('+ dada.backInfoList[i].bankCard.substring(dada.backInfoList[i].bankCard.length-4, dada.backInfoList[i].bankCard.length) +')' + '</option>';
                    }
                    $('.bankList').html(dom);

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
// 快捷支付提交第一步
function subpay() {
     console.log($('.buyplay-wechart select').val())
     if ($('.buyplay-wechart select').val() == '') {
          setMessage({
               type: 'warning',
               msg: '请选择银行卡'
          })
          return false;
     }
     ajax({
          url: 'order-api-impl/orderpay/directPayment',
          methods: 'post',
          data: {
               orderId: params.orderId,
               orderPayMoney: params.orderPayMoney,
               payChannel: 1,
               bankCardId: $('.buyplay-wechart select').val()
          },
          success: function (response) {
               if (response.code == 200) {
                     var dada = response.data ? response.data : {};
                    $('.buyplay-wechart .two input').attr('token',dada.token);
                    $('.buyplay-wechart .two input').attr('mobileSerial',dada.mobileSerial);
                    $('.buyplay-wechart .two').show();
                    $('.buyplay-wechart .first').hide();
                    countDown();
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


// 上一步
function goBack() {
     $('.buyplay-wechart .two').hide();
     $('.buyplay-wechart .first').show();
     $('.buyplay-wechart .two input').val('');
     // 清除定时器防止叠加；
     if (timeID) {
          num = 121;
          clearTimeout(timeID)
     }
}
// 快捷支付
function fastPayment() {
     if ($('.buyplay-wechart .two input').val() == '') {
          setMessage({
               type: 'warning',
               msg: '请输入验证码'
          })
          return false;
     }
     ajax({
          url: 'order-api-impl/orderpay/paymentSubmitTokens',
          methods: 'post',
          data: {
               token: $('.buyplay-wechart .two input').attr('token'),
               mobileCode: $('.buyplay-wechart .two input').val(),
               mobileSerial: $('.buyplay-wechart .two input').attr('mobileSerial')
          },
          success: function (response) {
               var data = response.data ? response.data : {};
               if (response.code == 200) {
                    window.location.href = 'status.html?status=200';
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

// 去订单详情页
function go_orderDetails () {
    window.location.href = '../purchase/orderDetails.html?id=' + orderData.orderId + '&type=3'
}

// 倒计时120s
var num = 121;
var timeID;
function countDown() {
     num--;
     $('.countDown').html(num + ' s');
     if(num) {
          timeID = setTimeout(countDown, 1000);
     } else {
          $('.countDown').html("");
          clearInterval(timeID)
          setMessage({
               type: 'warning',
               msg: "支付超时，即将跳转..."
          })
          setTimeout(function(){
               window.location.replace('../buyerPersonCenter/myOrder.html');
          },1500)
     }
}

//网银支付
// 第一步
function currency_payment() {
     ajax({
          url: 'order-api-impl/orderpay/directPayment',
          methods: 'post',
          data: {
               orderId: orderData.orderId,
               orderPayMoney: orderData.orderPayMoney,
               payChannel: 0,
          },
          success: function (response) {
               var data = response.data ? response.data : {};
               var token = data.token;
               if (response.code == 200) {
                    // window.open('./pay.html?token=' + window.encodeURI(window.encodeURI(token)))
                    window.open('./pay.html?data=' + JSON.stringify(data))
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

