function init() {
     headerTop('#header'); //渲染顶部
     headerNav('#header-seach'); //渲染头部导航
     //     applySellerCenter('#centre-left-nav'); //渲染默认左边导航
     moneyModuleNav('#centre-left-nav', getQueryString('name'));
     $('#centre-left-nav .centre-left-nav li:not(li.hover)').css('display', 'none');
}
init();


//判断是充值还是提现
function isTopup() {
     var myData = getQueryString('isTopup');
     if (myData == 0) {
          $('.text-topup').show();
          $('.text-withdraw').hide();
     } else if (myData == 1) {
          $('.text-topup').hide();
          $('.text-withdraw').show();
     }
     if (getQueryString('applyStatus') != 1) {
          $('#centre-left-nav .centre-left-nav li:not(li.hover)').remove();
     } else {
          $('#centre-left-nav .centre-left-nav li:not(li.hover)').css('display', 'block');
     }
}
isTopup();

// 选中checkout
$('#list').on('click', 'i', function () {
     $('#list li i').removeClass()
     var that = $(this);
     var name = '';
     if (that.attr('class') == 'active') {
          name = ' ';
     } else {
          name = 'active';
     }
     that.addClass(name);
});

//返回上一页
$('.button button').click(function () {
     window.history.go(-1);
})
// 跳转到账户添加
function go_addurl() {
     window.location.href = 'addAccount.html' + '?name=' + getQueryString('name');
}



//获取数据
getData();

function getData() {
     ajax({
          url: 'member-api-impl/merchantAccount/getMerchantAccountByUserId',
          methods: 'post',
          data: {},
          success: function (response) {
               var data = response.data ? response.data : {};
               if (response.code == 200) {
                    console.log(response)
                    var data = response.data ? response.data : {};
                    $('.name span').html(data.custName + '(' + data.bname + '-' + data.custAccNo.substring(data.custAccNo.length - 4, data.custAccNo.length) + ')')
                    $('.money span').html(data.amount);
                    $('#input').on('keyup', function () {
                         twoDecimalPlaces(this, data.amount);
                    })
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
// 全部提现
$('.complete').click(function () {
     $('#input').val($('.money span').html())

})
$('.submit').click(function () {
     if ($('#input').val() == '') {
          setMessage({
               type: 'warning',
               msg: '请输入提现金额'
          })
          return false;
     }
     ajax({
          url: 'member-api-impl/czbWithdrawal/addCzbWithdrawal',
          methods: 'post',
          data: {
               amount: $('#input').val()
          },
          success: function (response) {
               var data = response.data ? response.data : {};
               if (response.code == 200) {
                    setMessage({
                         type: 'success',
                         msg: response.msg
                    })
                    setTimeout(function () {
                         window.history.back(-1);
                    }, 2000)
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
})