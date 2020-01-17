//渲染公共顶部
shopHeaderTop('#header-top');
//渲染公共头部
shopHeader('#s-header');
var id = getQueryString('id');
// 评价参数
var params = {
     orderId: id,
     commList: [
          // {
          //      content: '', //评论内容
          //      isAnon: 0, //2匿名 1非匿名
          //      productId: 0, //产品id
          //      rank: '' //星级
          // }
     ]
}
var goodsInventoryId = '';
getOrderCommList()
// 评论列表
function getOrderCommList() {
     ajax({
          methods: 'post',
          url: "order-api-impl/orderComm/list?orderId=" + id,
          data: {},
          success: function (response) {
               if (response.code == 200) {
                    var data = response.data ? response.data : [];
                    var evaluateListDom = '';
                    for (var i = 0; i < data.length; i++) {
                    	goodsInventoryId = data[i].goodsInventoryId
                         evaluateListDom += '<dl class="list">';
                         evaluateListDom += '<dt>' + data[i].storeSupplierName + '</dt>';
                         evaluateListDom += '<dd id="' + data[i].goodsId + '">';
                         evaluateListDom += '<div class="left fl"><img src="' + data[i].goodsImage + '" alt=""><div>';
                         evaluateListDom += '<p>' + data[i].goodsName + '</p>';
                           evaluateListDom += '<p>'
                           	var dd = data[i].specifValueJson
                              for (var b = 0; b < dd.length; b++) {
                                   for (var filed in dd[b]) {
                                        evaluateListDom += '<span>' + filed + '：' + dd[b][filed] + '</span>&nbsp;&nbsp;'
                                   }
                              }
                           evaluateListDom += '</p>';
                         evaluateListDom += '</div>';
                         evaluateListDom += '</div>';
                         evaluateListDom += '<div class="right fl">';
                         evaluateListDom += '<div class="top">';
                         evaluateListDom += '<span class="fl">商品评分</span>';
                         evaluateListDom += '<div class="star fl">';
                         evaluateListDom += '<p class="fl"></p>';
                         evaluateListDom += '<p class="fl"></p>';
                         evaluateListDom += '<p class="fl"></p>';
                         evaluateListDom += '<p class="fl"></p>';
                         evaluateListDom += '<p class="fl"></p>';
                         evaluateListDom += '</div>';
                         evaluateListDom += '<div class="text"></div>';
                         evaluateListDom += '</div>';
                         evaluateListDom += '<div class="bottom">';
                         evaluateListDom += '<span class="fl">商品评价</span>';
                         evaluateListDom += '<textarea class="fl" placeholder="请输入（200字）" onkeydown="inputMaxLength(this, 200)"></textarea>';
                         evaluateListDom += '</div>';
                         evaluateListDom += '<p>';
                         evaluateListDom += '<span class="fr">匿名评价</span>';
                         evaluateListDom += '<span class="fr imgSatr"></span>';
                         evaluateListDom += '</p>';
                         evaluateListDom += '</div>';
                         evaluateListDom += '</dd>';
                         evaluateListDom += '</dl>';
                    }
                    $('#shopList').html(evaluateListDom)
               }
          },
          error: function (error) {
               console.log(error);
          }
     })
}
$('#shopList').on('click', '.star p', function () {
     if ($(this).hasClass('evaluate') && $(this).next().hasClass('evaluate')) {
          $(this).parent().children().removeClass('evaluate');
          $(this).addClass('evaluate');
          $(this).prevAll().addClass('evaluate');
     } else if ($(this).hasClass('evaluate')) {
          // parent().children()
          $(this).removeClass('evaluate');
     } else {
          $(this).parent().children().removeClass('evaluate');
          $(this).addClass('evaluate');
          $(this).prevAll().addClass('evaluate');
     }
     var number = $(this).parent().find('.evaluate').length;
     var text = ''
     switch (number) {
          case 1:
               text = '失望';
               break;
          case 2:
               text = '不满';
               break;
          case 3:
               text = '一般';
               break;
          case 4:
               text = '满意';
               break;
          case 5:
               text = '惊喜';
               break;
          default:
               text = '';

     }
     $(this).parent().parent().find('.text').html(text);

})
// 匿名
$('#shopList').on('click', '.imgSatr', function () {
     $(this).removeClass('imgSatr').addClass('imgSatrSelect');
});
$('#shopList').on('click', '.imgSatrSelect', function () {
     $(this).removeClass('imgSatrSelect').addClass('imgSatr');
});
// 提交评价
$('#appraise').click(function () {
     var isNumberTrue = true;
     params.commList.length = 0; //清空参数
     var storeArr = $('#shopList').children('.list');
     // 遍历店铺
     for (var i = 0; i < storeArr.length; i++) {
          var shopArr = storeArr.eq(i).children('dd');
          // 遍历店铺下所有商品
          for (var j = 0; j < shopArr.length; j++) {
//             console.log(shopArr.eq(j))
               if (shopArr.eq(j).find('.star .evaluate').length == 0) {
                    isNumberTrue = false;
               }
               var isAnon = shopArr.eq(j).find('.bottom').next('p').children('span:last-child').hasClass('imgSatrSelect')
               params.commList.push({
                    content: shopArr.eq(j).find('.bottom textarea').val(), //评论内容
                    isAnon: (isAnon ? 2 : 1), //2匿名 1非匿名
                    productId: shopArr.eq(j).attr('id'), //产品id
                    rank: shopArr.eq(j).find('.star .evaluate').length, //星级
	                goodsInventoryId:goodsInventoryId,
               })
          }
     }
     if (!isNumberTrue) {
          setMessage({
               type: 'warning',
               msg: '请选择商品评分'
          });
          return false;
     }
//   console.log(params)
     ajax({
          methods: 'post',
          url: "order-api-impl/orderComm/submit",
          data: params,
          success: function (response) {
               window.location.href = './status.html?page=orderComm&status=' + response.code
          },
          error: function (error) {
               console.log(error);
          }
     })
})