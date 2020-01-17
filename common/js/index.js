//渲染公共顶部
shopHeaderTop('#header-top');
//渲染公共头部
shopHeader('#s-header');
//渲染公共底部
shopFooter('#s-footer');
// 买家首页菜单
sliderMenu();
if ($.cookie('token')) {
     ajax({
          methods: 'POST',
          url: 'member-api-impl/user/myHome',
          data: {},
          success: function (res) {
               if (res.code == 200) {
                    var userinfo = res.data.userInfo || {};
               } else {
                    if (res.code == 999) {
                         //渲染公共顶部
                         shopHeaderTop('#header-top');
                         return false;
                    }
                    setMessage({
                         type: 'warning',
                         msg: res.msg
                    })
               }
          },
          error: function (err) { }
     })
} else {
     $('.isLogin').css('display', 'none');
     $('.noLogin').css('display', 'block');
}
// 买家首页菜单
function sliderMenu() {
     // 获取首页接口数据
     ajax({
          methods: 'POST',
          url: 'member-api-impl/user/getHomePageInfo',
          data: {
               loginType: 2
          },
          success: function (res) {
               var shopHeaderDom = '<div id="sliderMenua"><div id="sliderMenu" class="slider-menu">';
               // menu-nav  商品分类
               shopHeaderDom += '<div class="menu-nav fl">';
               shopHeaderDom += '<h3 id="cate-theme"><img src="./common/images/kun.png" width="16px" height="14px" alt=""><b>商品分类</b></h3>';
               shopHeaderDom += '<ul id="cate-menu" class="cate-menu"></ul>'; //一级分类
               shopHeaderDom += '<div class="cate-pop" id="cate-pop"></div>'; //二级分类
               shopHeaderDom += '</div>';
               shopHeaderDom += '<div class="navitems fr">';
               shopHeaderDom += '<ul class="navitems-group">';

               // 首页导航
               var len = res.data.forwardTypeList.length > 9 ? 9 : res.data.forwardTypeList.length;
               for (var i = 0; i < len; i++) {
                    var name = encodeURI(res.data.forwardTypeList[i].name);
                    name = encodeURI(name);
                    var itemHref = res.data.forwardTypeList[i].jumpWay == 2 ? res.data.forwardTypeList[i].url : ('./purchase/productList.html#seach=' + name);
                    shopHeaderDom += '<li><a href=' + itemHref + '>' + res.data.forwardTypeList[i].name + '</a></li>';
               }
               if (res.data.forwardTypeList.length > 9) {
                    shopHeaderDom += '<li id="more"><a href="javascript:">更多 <i class="more-icon"></i></a></li>';
               }
               shopHeaderDom += '</ul>';
               // navitems-select  商品菜单
               shopHeaderDom += '<div class="navitems-select" id="navitems-select">';
               shopHeaderDom += '<ul>';
               for (var i = 9; i < res.data.forwardTypeList.length; i++) {
                    var name = encodeURI(res.data.forwardTypeList[i].name);
                    name = encodeURI(name);
                    var itemHref = res.data.forwardTypeList[i].jumpWay == 2 ? res.data.forwardTypeList[i].url : ('./purchase/productList.html#seach=' + name);
                    shopHeaderDom += '<li><a href=' + itemHref + '>' + res.data.forwardTypeList[i].name + '</a></li>';
               }
               shopHeaderDom += '</ul>';
               shopHeaderDom += '</div>';
               shopHeaderDom += '</div>';
               shopHeaderDom += '</div>';
               shopHeaderDom += '</div>';
               shopHeaderDom += '</div>';
               $('#s-header').append(shopHeaderDom);
               //               $('#s-header').find('.body-center').append(shopHeaderDom);
               cateMenu = $('#cate-menu');
               catePop = $('#cate-pop');

               //渲染一级菜单
               var cateMenuArr = res.data.goodsType.menuList;
               var cateMenuDom = '';
               for (var i = 0; i < cateMenuArr.length; i++) {
                    cateMenuDom += '<li class="cate-menu-item">';
                    var name = encodeURI(cateMenuArr[i].name);
                    name = encodeURI(name);
                    cateMenuDom += '<img src="' + cateMenuArr[i].iconAddress + '" style="position: absolute;left: 26px;;top: 16px;width: 14px;height: 14px;"/>'
                    cateMenuDom += '<a href="./purchase/productList.html#seach=' + name + '">' + cateMenuArr[i].name + '</a>';
                    cateMenuDom += '<em><img src="common/images/syj.png"/></em></li >';
               }
               cateMenu.empty().append(cateMenuDom);
               $('#more,#navitems-select').hover(function () {
                    $('#navitems-select').show()
               }, function () {
                    $('#navitems-select').hide()
               })
               // 渲染二级菜单
               cateMenu.on("mouseenter", ".cate-menu-item", function () {
                    $(this).addClass("actived ac").siblings().removeClass("actived ac");
                    $(this).find('a').addClass("ac").parent().siblings().find('a').removeClass("ac");
                    var index = $(this).index();
                    catePop.children('.cate-pop-col').eq(index).show();
                    //渲染二级菜单
                    var catePopDom = '';
                    for (var i = 0; i < cateMenuArr[index].childList.length; i++) {
                         catePopDom += '<dl class="cate-pop-col clearfix">';
                         var name = encodeURI(cateMenuArr[index].childList[i].name);
                         name = encodeURI(name);
                         catePopDom += '<dt class="cate-pop-tit fl"><a href="./purchase/productList.html#seach=' + name + '">' + cateMenuArr[index].childList[i].name + '</a>&gt;</dt>';
                         catePopDom += '<dd class="cate-pop-con fl">';
                         for (var j = 0; j < cateMenuArr[index].childList[i].childList.length; j++) {
                              var name1 = encodeURI(cateMenuArr[index].childList[i].childList[j].name);
                              name1 = encodeURI(name1);
                              catePopDom += '<a href="./purchase/productList.html#seach=' + name1 + '">' + cateMenuArr[index].childList[i].childList[j].name + '</a>';
                         }

                         catePopDom += '</dd>';
                         catePopDom += '</dl >';
                    }
                    catePop.empty().append(catePopDom);
               })
               cateMenu.hide();
               //切换显示
               $('#s-header').on("mouseenter", "#cate-theme", function () {
                    cateMenu.show();
               })
               $('#s-header').on("mouseleave", "#cate-theme", function () {
                    cateMenu.hide();
               })
               $('#s-header').on("mouseenter", "#cate-menu", function () {
                    cateMenu.show();
                    catePop.show();
               })
               $('#s-header').on("mouseleave", "#cate-menu", function () {
                    cateMenu.hide();
                    catePop.hide();
               })
               $('#s-header').on("mouseenter", "#cate-pop", function () {
                    cateMenu.show();
                    catePop.show();
               })
               $('#s-header').on("mouseleave", "#cate-pop", function () {
                    cateMenu.hide();
                    catePop.hide();
               })

               // banner切换
               var bannerDom = "";
               for (var i = 0; i < res.data.bannerList.length; i++) {
                    bannerDom += '<div class="swiper-slide"><a href="' + res.data.bannerList[i].url + '"><img src=' + res.data.bannerList[i].picture + ' alt=""></a></div>'
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

               $("#cate-menu .cate-menu-item").hover(function () {
                    $(this).find("em").find("img").attr("src", "common/images/syjj.png")
               }, function () {
                    $(this).find("em").find("img").attr("src", "common/images/syj.png")
               })

               // }
          },
          error: function (err) { }
     })
}
var typest = "12"
//首页获取数据
listdome(1);
var timeSetName;
var flashSaleList;
var leng;
var flg;
var idx;
var nowID;
function initScale(first) {
     var time = parseTime(new Date(), '{h}:{i}');
     var index;
     flg = '';
     // 判断当前时间否在活动区间内 startTime - endTime 代表一个活动区间
     for (var i = 0; i < flashSaleList.length; i++) {
          var data = flashSaleList[i];
          data.status = '已结束';
          if (data.startTime <= time && time < data.endTime) {
               flg = i + 1;
               index = i;
               break;
          }
     }

     // 用于匹配当前时间段的活动，如果存在当前活动 则更改其标题
     if (flg) {
          for (var k = 0; k < flashSaleList.length; k++) {
               var data = flashSaleList[k];
               if (k == index) { //抢购中
                    data.status = '抢购中';
                    nowID = data.id;
               }
               if (k > index) { //未开始
                    data.status = '未开始';
               }
          }

     }


     //不在时间段中
     if (!flg) {
          // 还有未开始的选择最近的一个未开始的
          for (var z = 0; z < flashSaleList.length; z++) {
               var data = flashSaleList[z];
               if (time < data.endTime) {
                    index = z;
                    nowID = data.id;
                    break;
               }
          }
          // if (index && index == 0) { //代表有未开始的， 开始整理状态 第一个未开始及以后置为未开始状态
          //      for (var h = 0; h < flashSaleList.length; h++) {
          //           if (h >= index) {
          //                flashSaleList[h].status = '未开始';
          //           }
          //      }
          // }
          //     等于空代表没有未开始的 默认最后一个
          if (!index && index != 0) {
               index = flashSaleList.length - 1;
               nowID = flashSaleList[index].id
          } else {
               // 重置状态
               for (var g = 0; g < flashSaleList.length; g++) {
                    if (g >= index) { //有未开始的
                         flashSaleList[g].status = '未开始'
                         nowID = flashSaleList[index].id
                    }
               }
          }
     }
     // 渲染
     // console.log('543543545==' + index)
     var nowSale = flashSaleList[index]
     if (idx != index) {
          idx = index;
          var len = nowSale.goodsFamilyList.length;
          var flashSaleListdata = ""
          for (var i = 0; i < len; i++) {
               flashSaleListdata += '<div class="goods" id="' + nowSale.goodsFamilyList[i].id + '" supplierid="' + nowSale.goodsFamilyList[i].supplierId + '">'
               flashSaleListdata += '<div class="left">'
               flashSaleListdata += '<img src="' + nowSale.goodsFamilyList[i].imageAddress + '" alt="" border="0">'
               flashSaleListdata += '</div>'
               flashSaleListdata += '<div class="right">'
               flashSaleListdata += '<p class = "goodsName">' + nowSale.goodsFamilyList[i].name + '</p>'
               flashSaleListdata += '<span class = "explains">' + nowSale.goodsFamilyList[i].explains + '</span>'
               flashSaleListdata += '<div class="progress">'
               flashSaleListdata += '<div></div>'
               flashSaleListdata += '</div>'
               flashSaleListdata += '<span>已抢购' + (nowSale.goodsFamilyList[i].type % 12 + nowSale.goodsFamilyList[i].id) * 2 + '件</span>'
               flashSaleListdata += '<div class="price">¥' + nowSale.goodsFamilyList[i].goodsMoney + '<del>¥' + nowSale.goodsFamilyList[i].goodsMaxMoney + '</del></div>'
               flashSaleListdata += '</div>'
               flashSaleListdata += '</div>'
          }
          $('#limitTime .title').html(nowSale.status)
          $(".goodsBox").html(flashSaleListdata);
          if (first) {
               timer(index); //开启定时器
          }
     } else {
          timer(index); //开启定时器
          $('#limitTime .title').html(nowSale.status);
     }
     // if(nowSale.status != '抢购中') {
     //     $('.time').hide();
     // }

}
// 是否开启定时器
function timer(idx) {
     if (flg) {
          timeSetName = setInterval(function () {
               var start = new Date().getTime();
               var end = parseTime(new Date(), '{y}-{m}-{d}') + ' ' + flashSaleList[idx].endTime;
               end = new Date(end).getTime();
               getDuration(end - start);
          }, 1000)

     } else {
          setTimeout(function () {
               initScale(); //一直监控
          }, 1000)
     }
}
// 返回时间
function getDuration(my_time) {
     var days = my_time / 1000 / 60 / 60 / 24;
     var daysRound = Math.floor(days);
     var hours = my_time / 1000 / 60 / 60 - (24 * daysRound);
     var hoursRound = Math.floor(hours);
     var minutes = my_time / 1000 / 60 - (24 * 60 * daysRound) - (60 * hoursRound);
     var minutesRound = Math.floor(minutes);
     var seconds = my_time / 1000 - (24 * 60 * 60 * daysRound) - (60 * 60 * hoursRound) - (60 * minutesRound);
     // console.log('转换时间:', daysRound + '天', hoursRound + '时', minutesRound + '分', seconds + '秒');
     var time = hoursRound + ':' + minutesRound + ':' + seconds;
     var time = {
          h: hoursRound < 10 ? 0 + '' + hoursRound : hoursRound,
          i: minutesRound < 10 ? 0 + '' + minutesRound : minutesRound,
          s: parseInt(seconds) < 10 ? 0 + '' + parseInt(seconds) : parseInt(seconds)
     }
     $('#limitTime .time').html('<span>' + time.h + '</span>:<span>' + time.i + '</span>:<span>' + time.s + '</span>');
     // 判断等于0时直接重新渲染
     if (parseInt(hoursRound) == 0 && parseInt(minutesRound) == 0 && parseInt(seconds) == 0) {
          clearInterval(timeSetName);
          setTimeout(function () {
               initScale(); //重新监控
          }, 1000)
     }
}
function listdome(int) {
     ajax({
          methods: 'POST',
          url: 'product-api-impl/goodsGroup/getHomePageInfoGoods',
          data: {
               type: typest,
               loginType: 1
          },
          success: function (response) {
               // 限时抢购
               flashSaleList = response.data.flashSaleList;
               leng = flashSaleList.length;
               initScale(1);
               // 广告图
               var firstGroup = response.data.firstGroup ? response.data.firstGroup : {}
               var firstGroupData = '<img src=' + firstGroup.pcPictureUrl + ' style="height:260px" alt="" groupType="32" h5GroupId=' + firstGroup.id + '></img>'
               $('.aixincd').html(firstGroupData)

               // 今日爆款
               var firstGroupList = response.data.firstGroupList ? response.data.firstGroupList : []
               if (firstGroupList) {
                    var firstGroupListData = "";
                    var len = firstGroupList.length;
                    if (len > 4) {
                         len = 4;
                    }
                    for (var i = 0; i < len; i++) {
                         firstGroupListData += '<div class="box" groupType=' + firstGroupList[i].groupType + ' h5GroupId=' + firstGroupList[i].id + '>';
                         firstGroupListData += '<div class="title">' + firstGroupList[i].brandName + '</div>'
                         firstGroupListData += '<img src=' + firstGroupList[i].pictureUrl + ' alt="商品">';
                         firstGroupListData += '</div>';
                    }
                    $("#fourBox").html(firstGroupListData)
               }

               //好评如潮新增
               var raveReviewsList = response.data.raveReviewsList
               if (raveReviewsList) {
                    var raveReviewsListdata = "";
                    var len = raveReviewsList.length;
                    if (len > 8) {
                         len = 8;
                    }
                    for (var i = 0; i < len; i++) {
                         raveReviewsListdata += '<div class="box fl" id="' + raveReviewsList[i].id + '" supplierid="' + raveReviewsList[i].supplierId + '">'
                         raveReviewsListdata += '<img src="' + raveReviewsList[i].imageAddress + '" alt="" border="0">'
                         raveReviewsListdata += '<p>' + raveReviewsList[i].name + '</p>'
                         raveReviewsListdata += '<div class="price">￥' + raveReviewsList[i].goodsMoney + '<del>￥' + raveReviewsList[i].goodsMaxMoney + '</del></div>'
                         raveReviewsListdata += '</div>'
                    }
                    $("#datahao").html(raveReviewsListdata)
               }

               //新品上线集合
               var newProductLineList = response.data.newProductLineList;
               if (newProductLineList.length > 0) {
                    $('#nodata').css('display', 'none');
               } else {
                    $('#nodata').css('display', 'block');
               }
               if (newProductLineList) {
                    var newProductLineListdata = ""
                    var len = newProductLineList.length;
                    if (len > 8) {
                         len = 8;
                    }
                    for (var i = 0; i < len; i++) {
                         newProductLineListdata += '<div class="box fl" id="' + newProductLineList[i].id + '" supplierid="' + newProductLineList[i].supplierId + '">'
                         newProductLineListdata += '<img src="' + newProductLineList[i].imageAddress + '" alt="" border="0">'
                         newProductLineListdata += '<p>' + newProductLineList[i].name + '</p>'
                         newProductLineListdata += '<div class="price">￥' + newProductLineList[i].goodsMoney + '<del>￥' + newProductLineList[i].goodsMaxMoney + '</del></div>'
                         newProductLineListdata += '</div>'
                    }
                    $("#dataxin").html(newProductLineListdata)
               }
               //   好评如潮去详情
               $('#datahao .box').click(function () {
                    var oli = $(this)
                    go_productDetails(oli);
               })

               //   新品上线去详情
               $('#dataxin .box').click(function () {
                    var oli = $(this)
                    go_productDetails(oli);
               })
          },
          error: function (response) {
               setMessage({
                    type: 'warning',
                    msg: response.msg
               })
          }
     })
}



// 好评如潮
$('#goodPraise').on('click', '.left img', function () {
     window.location.href = './purchase/productList.html#groupType=6';
})

// 新品上线
$('#newProduct').on('click', '.left img', function () {
     window.location.href = './purchase/productList.html#groupType=7';
})

$('.more').on('click', function () {
     window.location.href = './purchase/productList.html#groupType=5&h5GroupId=' + nowID;
})

$('.goCar').on('click', function () {
     window.location.href = './buyerPersonCenter/myCart.html'
})

//今日爆款点击
$('.aixincd').on('click', 'img', function () {
     var groupType = encodeURI($(this).attr('groupType'));
     var h5GroupId = encodeURI($(this).attr('h5GroupId'));
     groupType = encodeURI(groupType);
     h5GroupId = encodeURI(h5GroupId);
     window.location.href = './purchase/productList.html#groupType=' + groupType + '&h5GroupId=' + h5GroupId;
})

//广告位点击
$('#fourBox').on('click', '.box', function () {
     var groupType = encodeURI($(this).attr('groupType'));
     var h5GroupId = encodeURI($(this).attr('h5GroupId'));
     groupType = encodeURI(groupType);
     h5GroupId = encodeURI(h5GroupId);
     window.location.href = './purchase/productList.html#groupType=' + groupType + '&h5GroupId=' + h5GroupId;
})



// 获取数据
var parameter = {
     address: '',
     type: 9,
     pageIndex: 1,
     pageSize: 20,
     pages: 0
}
// 列表导航
$('.nav_ul li').each(function (i) {
     $(this).click(function () {
          $('.nav_ul li').removeClass('move');
          $(this).addClass('move');
          parameter.type = $(this).attr("da-data");
          parameter.pageIndex = 1;
          parameter.pages = 0; //最大页数
          getList();
     })
})
getList();

// 滑动加载
$('body').scroll(function () {
     var scrollTop = $(this).scrollTop();
     var scrollHeight = $(document).height();
     var windowHeight = $(this).height();
     if (scrollTop + windowHeight >= scrollHeight - 273) {
          if (parameter.pageIndex != parameter.pages && $('.loading').css('display') != 'block') {
                console.log('543')
               parameter.pageIndex++;
               getList(); //获取数据
          }

     }
})

function getList() {
     $('.loading').show();
     ajax({
          url: 'product-api-impl/goodsGroup/searchGoodsByGroupType',
          methods: 'post',
          data: parameter,
          success: function (response) {
               var data = response.data.list ? response.data.list : [];
               if (response.code == 200) {
                    if (data.length > 0) {
                         $('#datayou').css('display', 'block');
                         $('#nodata').css('display', 'none');
                    } else {
                         $('#nodata').css('display', 'block');
                         $('#datayou').css('display', 'none');

                    }
                    //名特优品/一带一路集合
                    var famousProductsList = response.data.list ? response.data.list : [];
                    var famousProductsListdata = ""
                    var len = famousProductsList.length;
                    for (var i = 0; i < len; i++) {
                         famousProductsListdata += '<div class="box fl" id="' + famousProductsList[i].id + '" supplierid="' + famousProductsList[i].supplierId + '">'
                         famousProductsListdata += '<div style="width: 232px;height: 232px; overflow: hidden;">'
                         famousProductsListdata += '<img src="' + famousProductsList[i].imageAddress + '" alt="" border="0">'
                         famousProductsListdata += '</div>'
                         famousProductsListdata += '<p>' + famousProductsList[i].name + '</p>'
                         famousProductsListdata += '<div class="price">¥' + famousProductsList[i].goodsMoney + '<del>¥' + famousProductsList[i].goodsMaxMoney + '</del></div>'
                         famousProductsListdata += '</div>'
                    }
                    parameter.pages = response.data.pages; //最大页码
                    if (parameter.pageIndex == 1) {
                         $("#datayou").html(famousProductsListdata)
                    } else {
                         $("#datayou").append(famousProductsListdata);
                    }
                    $('.loading').hide();
               } else {
                    setMessage({
                         type: 'warning',
                         msg: response.msg
                    })
               }

               //   点击图片进入详情
               $('#datayou .box').click(function () {
                    var oli = $(this).closest('div');
                    go_productDetails(oli)
               })
          },
          error: function (response) {
               console.log(response)
          }
     })
}
$('.goodsBox').on('click', '.goods', function () {
     go_productDetails($(this))
})


//去详情
function go_productDetails(dom) {
     if (!dom.attr('supplierid')) {
          return false;
     }
     window.open('./purchase/productDetails.html?id=' + dom.attr('id') + '&supplierid=' + dom.attr('supplierid'))
}