//渲染公共顶部
shopHeaderTop('#header-top');
//渲染公共头部
shopHeader('#s-header');
isSearchShop = false;
var query = getQueryString('seach');
var groupType = getQueryString('groupType');
var h5GroupId = getQueryString('h5GroupId');
var params = {
     pageIndex: 1,
     pageSize: 30,
     goodsName: query ? decodeURI(query) : "",
     goodsPrice: 0, //价格排序 1升序 2降序 0默认
     saleCount: 0, //销量排序 1升序 2降序 0默认
     selectHotGoods: getQueryString('hot') || 0, // 0否 1是热销商品;
     isFirst: true,
}
var pageIndex = getQueryString('pageIndex');
if (pageIndex) {
     pageIndex = pageIndex?pageIndex:1;
     params.pageIndex = pageIndex;
}
if (groupType) {
     params.groupType = groupType;
     params.h5GroupId = h5GroupId
}

// 切换筛选导航
$('#nav li').click(function () {
     var index = $(this).index();
     $('#nav li span').removeClass('active');
     $('#nav li').children('img').attr("src", "images/moren.png");
     if (index == 0) {
          params.goodsPrice = 0;
          params.saleCount = 0;
     } else if (index == 1) {
          if ($(this).hasClass("actived")) {
               $(this).removeClass("actived");
               params.saleCount = 2;
               params.goodsPrice = 0;
               $(this).children('img').attr("src", "images/xia.png");
          } else {
               $(this).addClass("actived");
               params.saleCount = 1;
               params.goodsPrice = 0;
               $(this).children('img').attr("src", "images/shang.png");
          }
     } else if (index == 2) {
          if ($(this).hasClass("actived")) {
               $(this).removeClass("actived");
               params.goodsPrice = 2;
               params.saleCount = 0;
               $(this).children('img').attr("src", "images/xia.png");
          } else {
               $(this).addClass("actived");
               params.goodsPrice = 1;
               params.saleCount = 0;
               $(this).children('img').attr("src", "images/shang.png");
          }
     }
     $(this).children('span').addClass('active');
     params.alias = $('#s-input').val();
     params.isFirst = true;
     params.pageIndex = 1;
     getList();
});

/**
 * 获取列表
 */
getList();

// 搜索方法
function seachFn() {
     var seach = getQueryString('seach') ? decodeURI(getQueryString('seach')) : '';
     console.log(seach)
     $('#s-input').val(seach);
     params.isFirst = true;
     params.goodsName = seach;
     params.pageIndex = 1;
     delete params.groupType;
     delete params.h5GroupId;
     getList();
}

function getList() {
     ajax({
          methods: 'POST',
          url: 'product-api-impl/app/goodsList',
          data: params,
          success: function (response) {
               if (response.code == 200) {
                    var data = response.data ? response.data : {};
                    if (data.GoodsList.length > 0) {
                         var listDom = '';
                         for (var i = 0; i < data.GoodsList.length; i++) {
                              var goodsName = data.GoodsList[i].goodsName.length > 22 ? data.GoodsList[i].goodsName.substring(0, 22) + '...' : data.GoodsList[i].goodsName;
                              listDom += '<li>';
                              listDom += '<img onClick="goDetail(' + data.GoodsList[i].goodsId + ',' + data.GoodsList[i].supplierId + ')" src="' + data.GoodsList[i].imageAddress + '" alt="">';
                              listDom += '<p class="price">¥ ' + data.GoodsList[i].actualPrice + '</p>';
                              listDom += '<p class="key-word" onClick="goDetail(' + data.GoodsList[i].goodsId + ',' + data.GoodsList[i].supplierId + ')">' + goodsName + '</p>';
                              listDom += '<P class="payment">' + data.GoodsList[i].soldNumber + '人付款</P>';
                              //  listDom += '<button id="addCard" onClick=addCart(' + data.GoodsList[i].goodsId + ',' + data.GoodsList[i].supplierId + ')>查看详情</button>';
                              listDom += '</li>';
                         }
                         $('#list').empty().html(listDom);
                         $('#nodata').hide();
                    } else {
                         $('#list').empty();
                         $('#nodata').show();
                    }
                    if (params.isFirst) {
                         params.isFirst = false;
                         page({
                              pageSize: params.pageSize,
                              pageNum: params.pageIndex,
                              total: data.total,
                              fn: function (e) {
                                   params.pageIndex = e.current;
                                   var url = window.location.href.split('&');
                                    var base;
                                   if (url[0].indexOf('#') == -1) {
                                        base = url[0] + '#seach=';
                                   } else {
                                        base = url[0];
                                   }
                                   var json = { time: new Date().getTime() };
                                   if (IEVersion() == -1 || IEVersion() >= 10) { //谷歌和ie10及以上
                                        window.history.pushState(json, "", base + '&pageIndex=' + params.pageIndex);
                                        window.location.href = base + '&pageIndex=' + params.pageIndex;
                                   }
                                   if (myBrowser() != 'Chrome') { //不是谷歌
                                        getList(); //更新
                                   }
                              }
                         });

                    }
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
if (IEVersion() == -1 || IEVersion() >= 10) { //谷歌和ie10及以上
     // 返回按钮 监听历史记录的变化
     window.addEventListener("popstate", function (e) {
          console.log('返回按钮')
          var pageIndex = getQueryString('pageIndex');
          pageIndex = pageIndex ? pageIndex : 1;
          params.pageIndex = pageIndex;
          params.isFirst = true;
          getList(); //更新
     }, true)
}

// 加入购物车
function addCart(id, supplierid) {
     console.log(id, supplierid)
     var addCardParams = {
          goodsId: id,
          storeSupplierId: supplierid
     }
     ajax({
          methods: 'POST',
          url: 'product-api-impl/shopcar/addAndUpdateShopCar',
          data: addCardParams,
          success: function (response) {
               if (response.code == 200) {
                    setMessage({
                         type: 'success',
                         msg: response.msg
                    });
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
// 查看商品详情
function goDetail(id, supplierid) {
     //   window.location.href = '../purchase/productDetails.html?id=' + id + '&supplierid=' + supplierid;
     window.open('../purchase/productDetails.html?id=' + id + '&supplierid=' + supplierid)
}