//渲染公共顶部
shopHeaderTop('#header-top');
//渲染公共头部
shopHeader('#s-header');

var servicePhoneNo;
var id = getQueryString('id');
var params = {
     supplierId: !!id ? id : '',
     pageIndex: 1,
     pageSize: 30,
     goodsName: '',
     goodsPrice: 0, //价格排序 1升序 2降序 0默认
     saleCount: 0, //销量排序 1升序 2降序 0默认
     isFirst: true
}
var pageIndex = getQueryString('pageIndex');
if (pageIndex) {
     pageIndex = pageIndex ? pageIndex : 1;
     params.pageIndex = pageIndex;
}
/**
 * 暂未开通时
 */
var urlData = getQueryString('data') || '{}';
if (!!!id) {
     var obj = JSON.parse(urlData);
     $('.s-shopname .name').text(decodeURI(obj.provinceName) + ' 欢迎您');
     $('.details_alertForm').show();
}
// 返回列表
function backList() {
     window.location.href = './storeList.html'
}
// 立即申请
function applyNow() {
     var obj = JSON.parse(urlData);
     obj.name = encodeURI(encodeURI(decodeURI(obj.name)));
     obj.provinceName = encodeURI(encodeURI(decodeURI(obj.provinceName)));
     // console.log(obj.provinceName)
      window.location.href = '../sellerCenter/sellercenter.html?data=' + JSON.stringify(obj);
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
     getList();
});

/**
 * 获取列表
 */
getList();

// 搜索方法
function seachFn() {
     params.isFirst = true;
     params.goodsName = seachText;
     params.pageIndex = 1;
     getList();
}

function getList() {
     ajax({
          methods: 'POST',
          url: 'product-api-impl/app/myShopBySupplierId',
          data: params,
          success: function (response) {
               if (response.code == 200) {
                    var data = response.data ? response.data : {};
                    servicePhoneNo = data.servicePhoneNo;
                    shopStore(); // 店铺名
                    if (data.GoodsList.length > 0) {
                         var listDom = '';
                         for (var i = 0; i < data.GoodsList.length; i++) {
                              var goodsName = data.GoodsList[i].goodsName.length > 22 ? data.GoodsList[i].goodsName.substring(0, 22) + '...' : data.GoodsList[i].goodsName;
                              listDom += '<li>';
                              listDom += '<img onClick="goDetail(' + data.GoodsList[i].goodsId + ',' + data.supplierId + ')" src="' + data.GoodsList[i].imageAddress + '" alt="">';
                              listDom += '<p class="price">¥ ' + data.GoodsList[i].actualPrice + '</p>';
                              listDom += '<p class="key-word" onClick="goDetail(' + data.GoodsList[i].goodsId + ',' + data.supplierId + ')">' + goodsName + '</p>';
                              listDom += '<P class="payment">' + data.GoodsList[i].soldNumber + '人付款</P>';
                              //listDom += '<button id="addCard" onClick=addCart(' + data.GoodsList[i].goodsId + ',' + data.supplierId + ')>加入购物车</button>';
                              listDom += '</li>';
                         }
                         $('#list').empty().html(listDom);
                         $('#nodata').hide();
                    } else {
                         $('#list').empty();
                         $('#nodata').show();
                    }
                    data.supplierName ? $('.s-shopname .name').text(data.supplierName + ' 欢迎您') : '';
                    if (params.isFirst) {
                         params.isFirst = false;
                         page({
                              pageSize: params.pageSize,
                              pageNum: params.pageIndex,
                              total: data.total,
                              fn: function (e) {
                                   params.pageIndex = e.current;
                                   var url = window.location.href.split('&');
                                   var json = { time: new Date().getTime() };
                                   if (IEVersion() == -1 || IEVersion() >= 10) { //谷歌和ie10及以上
                                        window.history.pushState(json, "", url[0] + '&pageIndex=' + params.pageIndex);
                                        window.location.href = url[0] + '&pageIndex=' + params.pageIndex;
                                   }
                                   if (myBrowser() != 'Chrome') { //ie用
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
          var pageIndex = getQueryString('pageIndex');
          pageIndex = pageIndex ? pageIndex : 1;
          params.pageIndex = pageIndex;
          params.isFirst = true;
          getList(); //更新
     }, true)
}

// 加入购物车
function addCart(id, supplierid) {
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
function goDetail(id, supplierId) {
     window.location.href = '../purchase/productDetails.html?id=' + id + '&supplierid=' + supplierId;
}

// 店铺名dom
function shopStore() {
     $('#s-header').empty();
     var shopName = '<div class="s-shopname" id="container">'
     shopName += '<div id="center">';
     shopName += '<div class="fl store">';
     shopName += '<img src="./images/storeLogo.png">';
     shopName += '<h3 class="name"></h3>';
     shopName += '</div>';
     shopName += '<div class="fl tel">';
     shopName += '<img src="./images/tel.png">';
     shopName += '<span class="word">24小时服务热线</span>';
     shopName += '<span class="telphone">' + servicePhoneNo + '</span>';
     shopName += '</div>';
     shopName += '</div>';
     shopName += '</div>';
     $('#s-header').append(shopName);
     $('.seach-menu').hide();
     $('#seachbox .s-input.fl').val('');
}

// banner
sliderMenu();
// 买家首页菜单

function sliderMenu() {
     // 获取首页接口数据
     ajax({
          methods: 'get',
          url: 'product-api-impl/banner/getBannerListBySupplierId',
          data: {
               supplierId: id
          },
          success: function (res) {
               // banner切换
               var bannerDom = "";
               var bannerList = res.data;
               if (!bannerList.length) {
                    $('.banner').hide();
               }
               for (var i = 0; i < bannerList.length; i++) {
                    bannerDom += '<div class="swiper-slide"><a href="javascript:;"><img src=' + bannerList[i].picture + ' alt=""></a></div>'
               }
               //   bannerDom += '<div class="swiper-slide"><a href="javascript:;"><img src="common/images/index.png" alt=""></a></div>'
               $(".swiper-wrapper.img").empty().append(bannerDom);
               var mySwiper1 = $('.swiper-container.img').swiper({
                    autoplayDisableOnInteraction: false,
                    autoplay: 5000, //可选选项，自动滑动
                    speed: 1000,
                    loop: true,
                    simulateTouch: false, //禁止鼠标滑动
                    updateOnImagesReady: true, //所有的内嵌图像（img标签）加载完成后Swiper会重新初始化。
                    pagination: '.pagination',
                    paginationClickable: true //值为true时，点击分页器的指示点时会发生Swiper。
               })
          },
          error: function (err) { }
     })
}