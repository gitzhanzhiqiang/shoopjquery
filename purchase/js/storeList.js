//渲染公共顶部
shopHeaderTop('#header-top');
//渲染公共头部
shopHeader('#s-header');
isSearchShop = true;
$('.seach-tab li').eq(0).removeClass('active')
$('.seach-tab li').eq(1).addClass('active')

var seachName = decodeURI(getQueryString('seach') || '');
var params = {
     pageIndex: 1,
     pageSize: 5,
     alias: seachName,
     addressIds: '',
     saleCount: 0, //销量排序 1升序 2降序 0默认
     isFirst: true
}
var pageIndex = getQueryString('pageIndex');
if (pageIndex) {
     pageIndex = pageIndex?pageIndex:1;
     params.pageIndex = pageIndex;
}

// 所在地选择
$('body').click(function (e) {
     e = e || window.event;
     if (e.target.className == 'source') {
          $('.type-nav .adslist').toggle();
     } else if (e.target.className == 'adrs-item city') {

     } else {
          $('.type-nav .adslist').hide();
          $('.type-nav .cityList').hide();
     }
     if (e.target.className == 'adrs-item' && e.target.className != 'adrs-item city') {
          var adrs = e.target.innerHTML === '全部' ? '' : e.target.innerHTML;
          $('.type-nav li.fr span').text(adrs);
          params.addressIds = e.target.getAttribute('data-id') || '';
          params.alias = $('#s-input').val();
          params.isFirst = true;
          params.pageIndex = 1;
          getList();
     }
     if (e.target.className == 'adrs-item city') {
          params.addressIds = e.target.getAttribute('data-id') || '';
          $('.type-nav .cityList').css('display', 'block')
          getCity(e.target.getAttribute('data-id') || '')
     }
});
// 切换筛选导航
$('.type-nav li.fl').click(function () {
     var index = $(this).index();
     $('.type-nav li.fl span').removeClass('active');
     $('.type-nav li.fl').children('img').attr("src", "images/moren.png");
     if (index == 0) {
          params.saleCount = 0;
     } else if (index == 1) {
          if ($(this).hasClass("actived")) {
               $(this).removeClass("actived");
               params.saleCount = 2;
               $(this).children('img').attr("src", "images/xia.png");
          } else {
               $(this).addClass("actived");
               params.saleCount = 1;
               $(this).children('img').attr("src", "images/shang.png");
          }
     }
     $(this).children('span').addClass('active');
     params.alias = $('#s-input').val();
     params.pageIndex = 1;
     params.isFirst = true;
     getList();
});

/**
 * 获取列表
 */
getList();
// 搜索方法
function seachFn() {
     var seach = decodeURI(getQueryString('seach'));
     $('#s-input').val(seach);
     params.isFirst = true;
     params.alias = seach;
     params.pageIndex = 1;
     getList();
}

/**
 * 获取所在地
 */
getAddress();

function getAddress() {
     ajax({
          methods: 'POST',
          url: 'member-api-impl/address/getLocationProvinceList',
          data: {},
          success: function (response) {
               if (response.code == 200) {
                    var data = response.data
                    var adsDom = '';
                    adsDom += '<dd>';
                    for (var i = 0; i < data.length; i++) {
                         if (data[i].locationLevel == 1) {
                              adsDom += '<a class="adrs-item" data-id="' +
                                   data[i].id + '" href="javascript:">' + data[i].provinceName + '</a>';
                         }
                    }
                    adsDom += '</dd>';
                    adsDom += '<dd>';
                    for (var j = 0; j < data.length; j++) {
                         if (data[j].locationLevel == 2) {
                              adsDom += '<a class="adrs-item" data-id="' +
                                   data[j].id + '" href="javascript:">' + data[j].provinceName + '</a>';
                         }
                    }
                    adsDom += '</dd>';
                    adsDom += '<dd>';
                    for (var k = 0; k < data.length; k++) {
                         if (data[k].locationLevel == 3) {
                              adsDom += '<a class="adrs-item city" data-id="' +
                                   data[k].id + '" href="javascript:">' + data[k].provinceName + '</a>';
                         }
                    }
                    adsDom += '</dd>';
                    $('#adslist').html(adsDom).css('visibility', 'visible').hide();
               }
          },
          error: function (response) {
               console.log(response)
          }
     })
}
// 获取城市
function getCity(id) {
     ajax({
          methods: 'POST',
          url: 'member-api-impl/address/selByParentId',
          data: {
               parentId: id
          },
          success: function (response) {
               if (response.code == 200) {
                    var data = response.data ? response.data : [];
                    var adsDom = '';
                    adsDom += '<dd>';
                    for (var i = 0; i < data.length; i++) {
                         adsDom += '<a class="adrs-item" data-id="' +
                              data[i].id + '" href="javascript:">' + data[i].provinceName + '</a>';
                    }
                    adsDom += '</dd>';
                    $('.cityList').html(adsDom);

               }
          },
          error: function (response) {
               console.log(response)
          }
     })
}
var obj;

function getList() {
     ajax({
          methods: 'POST',
          url: 'member-api-impl/merchant/getMerchantShopList',
          data: params,
          success: function (response) {
               if (response.code == 200) {
                    var data = response.data ? response.data : {};
                    if (data.records.length > 0) {
                         var perShop = '';
                         for (var i = 0; i < data.records.length; i++) {
                              var provinceData = data.records[i].tprovinceList[data.records[i].tprovinceList.length - 1];
                              var id = data.records[i].applyStatus == '-1' ? provinceData.provinceName : data.records[i].supplierId;
                              perShop += '<div class="perShop">';
                              // <!--  左边商店图片包括信息  -->
                              perShop += '<div class="perShop-left" onClick="go_url(' + data.records[i].applyStatus + ',\'' + id + '\')">';
                              perShop += '<div>'
                              perShop += '<img  src="' + (data.records[i].shopHeadPhoto || '../common/images/storeList.png') + '" alt="' + data.records[i].alias + '">'
                              perShop += '</div>';
                              perShop += '<div>';
                              perShop += '<h2>' + (data.records[i].alias || provinceData.provinceName) + '</h2>'
                              perShop += '</div>';
                              perShop += '<div class="perShop_bo">';
                              perShop += '<p>销量：' + data.records[i].salesNum + '</p>';
                              perShop += '<p>所在地：'
                              var adslen = data.records[i].tprovinceList;

                              for (var k = 0; k < adslen.length; k++) {
                                   perShop += (k == 0 || k == 2 || k == 4) ? adslen[k].provinceName : '';
                              }
                              perShop += '</p>';
                              perShop += '</div>';
                              perShop += '</div>';
                              //<!-- 右边对应商店的商品 -->
                              perShop += '<div class="perShop-right fr">';
                              // if (data.records[i].applyStatus == 1) {
                              perShop += '<ul class="product-nav">';
                              var godslength = data.records[i].goodsDetailList.length <= 4 ? data.records[i].goodsDetailList.length : 4
                              for (var j = 0; j < godslength; j++) {
                                   perShop += '<li class="fl">';
                                   if (data.records[i].applyStatus == 1) {
                                        perShop += '<img onClick="goDetail(' + data.records[i].goodsDetailList[j].goodsId + ', ' + data.records[i].supplierId + ')" src="' + data.records[i].goodsDetailList[j].imageAddress + '" alt="">';
                                   } else {
                                        perShop += '<img src="' + data.records[i].goodsDetailList[j].imageAddress + '" alt="">';

                                   }
                                   perShop += '<span>¥ ' + data.records[i].goodsDetailList[j].actualPrice + '</span>';
                                   perShop += '</li>';
                              }
                              perShop += '</ul>';
                              // } else {
                              //<!-- 未入驻 -->
                              obj = {
                                   tprovinceList: [],
                                   name: '',
                                   id: data.records[i].id,
                                   provinceName: ''
                              }
                              for (var z = 0; z < data.records[i].tprovinceList.length; z++) {
                                   obj.tprovinceList.push(data.records[i].tprovinceList[z].id);
                                   obj.name += data.records[i].tprovinceList[z].provinceName
                              }
                              obj.name = encodeURI(encodeURI(obj.name));
                              // perShop += "<div class='hasNone'><a href='../sellerCenter/sellercenter.html?data=" + JSON.stringify(obj) + "' class='settled'>暂未入驻，申请开通</a></div>";
                              // }
                              perShop += '</div></div>';
                         }
                         $('#nodata').hide();
                         $('#shopList').html(perShop);
                    } else {
                         $('#shopList').empty();
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
               console.log(response)
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

// 跳转店铺
function go_url(applyStatus, id) {
     if (applyStatus == 1) {
          window.location.href = './shopList.html?id=' + id;
     } else {
          if (applyStatus == "-1") {
               obj.provinceName = encodeURI(encodeURI(id))
          }
          window.location.href = './shopList.html?data=' + JSON.stringify(obj);
     }
}
// 查看商品详情
function goDetail(id, supplierId) {
     window.location.href = './productDetails.html?id=' + id + '&supplierid=' + supplierId;
}