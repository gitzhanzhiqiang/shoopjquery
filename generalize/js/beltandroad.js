//渲染公共顶部
shopHeaderTop('#header-top');
//渲染公共头部
shopHeader('#s-header');
//渲染公共底部
shopFooter('#s-footer');
// 买家首页菜单
getGeneralizeNav();

// banner下导航点击
$('.banner_nav ul li').click(function () {
     window.location.href = '../purchase/productList.html#seach=' + encodeURI(encodeURI($(this).html()))
})
// 获取数据
var parameter = {
     address: '',
     type: 9,
}
getList();

function getList() {
     ajax({
          url: 'product-api-impl/goodsGroup/searchGoodsByGroupType',
          methods: 'post',
          data: parameter,
          success: function (response) {
               var data = response.data ? response.data : [];
               if (response.code == 200) {
                    var dom = '';
                    if (data.length > 0) {
                         $('#nodata').css('display', 'none');
                    } else {
                         $('#nodata').css('display', 'block');
                    }
                    for (var i = 0; i < data.length; i++) {
                         dom += '  <dl class="fl" id="' + data[i].id + '" supplierid="' + data[i].supplierId + '">';
                         dom += '<dt>';
                         dom += '<img src="' + data[i].imageAddress + '" alt="">';
                         dom += '</dt>';
                         dom += '<dd>';
                         dom += '<p>￥ ' + data[i].goodsMoney + '</p>';
                         dom += ' <p>' + data[i].name + '</p>';
                         dom += '<button class="fr">加入购物车</button>';
                         dom += '</dd>';
                         dom += ' </dl>';
                    }
                    $('.list_bottom').html(dom);
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
// 点击图片去详情
$('.list_bottom').on('click', 'img', function () {
     var dom = $(this).closest('dl');
     window.open('../purchase/productDetails.html?id=' + dom.attr('id') + '&supplierid=' + dom.attr('supplierid'));
})
//   加入购物车
$('.list_bottom').on('click', 'button', function () {
     var dom = $(this).closest('dl');
     ajax({
          methods: 'POST',
          url: 'product-api-impl/shopcar/addAndUpdateShopCar',
          data: {
               goodsId: dom.attr('id'), //商品id
               goodsAddNum: 1, //商品数量
               storeSupplierId: dom.attr('supplierId'), //商品所属供应商id
               goodsInventoryId: ''
          },
          success: function (response) {
               if (response.code == 200) {
                    setMessage({
                         type: 'success',
                         msg: '已加入购物车，可在购物车内查看~'
                    })
               } else {
                    setMessage({
                         type: 'warning',
                         msg: response.msg
                    })
               }

          },
          error: function (response) {
               setMessage({
                    type: 'warning',
                    msg: response.msg
               })
          }
     })
})