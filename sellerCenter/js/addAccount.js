// 账户切换
$('#account_type').on('click', 'li i', function () {
    $('#account_type li i').removeClass();
    $('.text_bottom ').hide();
    var that = $(this);
    var name = '';
    if (that.attr('class') == 'active') {
        name = ' ';
    } else {
        name = 'active';
    }
    // that.removeClass();
    that.addClass(name);
    // 显示
    var className = $(this).closest('li').prop("className");
    if (className == 'zhifubao') {
        $('.alipay ').show();
    } else if (className == 'weixin') {
        $('.wechat ').show();
    } else if (className == 'yinlian') {
        $('.unionpay ').show();
    }
})
//渲染默认左边导航
function init() {
    headerTop('#header');//渲染顶部
    headerNav('#header-seach');//渲染头部导航
    moneyModuleNav('#centre-left-nav', getQueryString('name'));
//     applySellerCenter('#centre-left-nav'); 
}
init();

//获取商品详情
getData();

function getData() {
     var id = getQueryString('id');
     if (id) {
          ajax({
               url: '/product-api-impl/app/goodsById',
               methods: 'post',
               data: {
                    id: id
               },
               success: function (response) {
                    var data = response.data ? response.data : {};
                    if (response.code == 200) {
                         setMessage({
                              type: 'success',
                              msg: response.msg
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
}