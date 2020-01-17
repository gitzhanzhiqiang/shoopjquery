//渲染公共顶部
shopHeaderTop('#header-top');
//渲染公共头部
shopHeader('#s-header');
var qdataDetail; //商品详情数据
var CollectionGoodsList = false; //用户收藏数据id
var goodsInventoryList = []//库存匹配
var goodsSpecificationList = []//规格数据
var goodsInventoryId = '';//规格ID
var imga = '';//图片保存
var inventorya;
productDetails();
//详情数据
function productDetails() {
     var id = getQueryString('id');
     var supplierId = getQueryString('supplierid');
     ajax({
          methods: 'POST',
          url: 'product-api-impl/app/goodsById?id=' + id + '&supplierId=' + supplierId,
          data: {},
          success: function (response) {
               if (response.code == 200) {

                    //商品详情数据
                    var dataDetail = response.data.GoodsDeatil;
                    qdataDetail = response.data.GoodsDeatil;
                    // inventorya = dataDetail.goodsInventoryList[0].inventory //库存
                    //库存总和
                    inventorya = 0
                    for (var ku = 0; ku < dataDetail.goodsInventoryList.length; ku++) {
                         inventorya += dataDetail.goodsInventoryList[ku].inventory
                    }
                    goodsInventoryList = dataDetail.goodsInventoryList
                    //店铺名id
                    $('#shop .shopname').text(dataDetail.supplierName);
                    $('#goshop').attr('data-id', dataDetail.supplierId);
                    // 登录状态请求收藏列表
                    if ($.cookie('token')) {
                         CollectionGoodsList = response.data.bool
                    }
                    //列表页大图
                    var imageAddress = response.data.GoodsDeatil.detailImageAddress;
                    var imageAddress = imageAddress.split(',')
                    var img = '';
                    for (var i = 0; i < imageAddress.length; i++) {
                         img += '<li><img src="' + imageAddress[i] + '"></li>'
                    }
                    $("#spec-list .list-h").append(img)
                    imga = imageAddress[0]
                    $("#spec-n1").append('<img src="' + imageAddress[0] + '" jqimg="' + imageAddress[0] + '" width="440" height="416px">')

                    //图片功能
                    $(".jqzoom").jqueryzoom({
                         xzoom: 400,
                         yzoom: 400,
                         offset: 10,
                         position: "right",
                         preload: 1,
                         lens: 1
                    });
                    $("#spec-list").jdMarquee({
                         deriction: "left",
                         width: 430,
                         height: 56,
                         step: 2,
                         speed: 4,
                         delay: 10,
                         control: true,
                         _front: "#spec-right",
                         _back: "#spec-left"
                    });
                    $("#spec-list img").bind("mouseover", function () {
                         var src = $(this).attr("src");
                         $("#spec-n1 img").eq(0).attr({
                              src: src.replace("\/n5\/", "\/n1\/"),
                              jqimg: src.replace("\/n5\/", "\/n0\/")
                         });
                         $("#spec-list").jdMarquee({
                              deriction: "left",
                              width: 430,
                              height: 56,
                              step: 2,
                              speed: 4,
                              delay: 10,
                              control: true,
                              _front: "#spec-right",
                              _back: "#spec-left"
                         });
                    }).bind("mouseout", function () {
                         $(this).css({
                              "border": "1px solid #ccc",
                              "padding": "2px"
                         });
                    })
                    //图片功能结束
                    //商品详情数据
                    var str = '';
                    str += '<h3 class="details_title">' + dataDetail.name + '</h3>'
                    if (dataDetail.sellingExplains != '') {
                         str += '<p class="details_jiesao">' + dataDetail.sellingExplains + '</p>';
                    }
                    if (dataDetail.discounPrice) {
                         if (dataDetail.goodsInventoryList[0].actualPrice == dataDetail.goodsInventoryList[dataDetail.goodsInventoryList.length - 1].actualPrice) {
                              str += '<p class="meiyuan">￥<span>' + dataDetail.goodsInventoryList[0].actualPrice + '</span>' + '<span style="color:#999999;font-size: 16px;">原价：(<s>￥' + dataDetail.price + '</s>)</span></p>';
                         } else {
                              str += '<p class="meiyuan">￥<span>' + dataDetail.goodsInventoryList[0].actualPrice + '~' + dataDetail.goodsInventoryList[dataDetail.goodsInventoryList.length - 1].actualPrice + '</span>' + '<span style="color:#999999;font-size: 16px;">原价：(<s>￥' + dataDetail.price + '</s>)</span></p>';
                         }
                    } else {
                         if (dataDetail.goodsInventoryList[0].actualPrice == dataDetail.goodsInventoryList[dataDetail.goodsInventoryList.length - 1].actualPrice) {
                              str += '<p class="meiyuan">￥<span>' + dataDetail.goodsInventoryList[0].actualPrice + '</span></p>';
                         } else {
                              str += '<p class="meiyuan">￥<span>' + dataDetail.goodsInventoryList[0].actualPrice + '~' + dataDetail.goodsInventoryList[dataDetail.goodsInventoryList.length - 1].actualPrice + '</span></p>';
                         }


                    }
                    // str += '<p class="meiyuan">￥<span>' + dataDetail.actualPrice + '</span></p>';
                    //                  str += '<p class="canshu">参数：<span>净含量 ' + dataDetail.weight + '</span></p>'
                    if ($.cookie('token')) {
                         if (dataDetail.deliveryAddress == '') {
                              str += '<p class="dizhi">配送：' + dataDetail.startAddress + '<span>运费：' + (dataDetail.isFree == 2 ? '包邮' : '¥' +
                                   dataDetail.carriageTemplateMoney) + '</span></p>'
                         } else {
                              str += '<p class="dizhi">配送：' + dataDetail.startAddress + ' 至 ' + dataDetail.deliveryAddress + '<span>运费：' + (dataDetail.isFree == 2 ? '包邮' : '¥' + dataDetail.carriageTemplateMoney) + '</span></p>'
                         }
                    } else {
                         str += '<p class="dizhi">配送：' + dataDetail.startAddress + ' 至 <a href="../login.html">请登录</a><span>运费：' + (dataDetail.isFree == 2 ? '包邮' : '¥' + dataDetail.carriageTemplateMoney) + '</span></p>'
                    }
                    str += '<div class="guige">'
                    goodsSpecificationList = dataDetail.goodsSpecificationList
                    var datas = dataDetail.goodsSpecificationList
                    //规格第一层
                    if (dataDetail.goodsInventoryList[0].firstSlot) {
                         if (datas != '') {
                              str += '<div class="specifi">'
                              for (var c = 0; c < datas.length; c++) {
                                   if (datas[c].slot == 1) {
                                        if (datas[c].sort == 1) {
                                             str += '<p>' + datas[c].categoryName + '</p>'
                                        }
                                        if (datas[c].imageAddress == '') {
                                             str += '<div class="ataspea" id="act' + datas[c].slot + '' + datas[c].sort + '" idt=' + datas[c].id + '>' + datas[c].name + '</div>'
                                        } else {
                                             str += '<div class="ataspec" id="act' + datas[c].slot + '' + datas[c].sort + '" idt=' + datas[c].id + '><img src="' + datas[c].imageAddress + '"><b>' + datas[c].name + '</b></div>'
                                        }
                                   }
                              }
                              str += '</div>'
                              //颜色二层
                              str += '<div class="sizs">'
                              for (var r = 0; r < datas.length; r++) {
                                   if (datas[r].slot == 2) {
                                        if (datas[r].sort == 1) {
                                             str += '<p>' + datas[r].categoryName + '</p>'
                                        }
                                        str += '<div class="ataspec" id="act' + datas[r].slot + '' + datas[r].sort + '" idt=' + datas[r].id + '>' + datas[r].name + '</div>'
                                   }
                              }
                              str += '</div>'
                              //颜色第三层
                              str += '<div class="sizeof">'
                              for (var o = 0; o < datas.length; o++) {
                                   if (datas[o].slot == 3) {
                                        if (datas[o].sort == 1) {
                                             str += '<p>' + datas[o].categoryName + '</p>'
                                        }
                                        str += '<div class="ataspec" id="act' + datas[o].slot + '' + datas[o].sort + '" idt=' + datas[o].id + '>' + datas[o].name + '</div>'
                                   }
                              }
                              str += '</div>'

                         }
                    }
                    str += '</div>'

                    str += '<div class="details_on">'
                    str += '<div class="shuliang">'
                    str += '<input type="text" value="1" onkeyup="positiveIntegerMoney(this)" />'
                    str += '<div>'
                    str += '<ul>'
                    str += '<li class="jia">+</li>'
                    str += '<li class="jian">-</li>'
                    str += '</ul>'
                    str += '</div>'
                    str += '</div>'
                    str += '<input type="button" value="加入购物车" class="gouwuche" />'
                    str += '<input type="button" value="立即购买" class="lijigoumai" />'
                    str += '</div>'
                    //                  str += '<p class="xiaoliang">月销量：<span>' + dataDetail.soldNumber + '笔</span>'
                    //                  if(datas == ''){
                    //                  	 str += '库存：<span class="kucuna">' + dataDetail.goodsInventoryList[0].inventory + '</span>'
                    //                  }else{
                    //                  	str += '库存：<span class="kucuna">'+inventorya+'</span>'
                    //                  }
                    //                   str += '</p>'
                    str += '<div class="shouchang">'
                    str += '<ul>'
                    str += '<li class="yuexiao">总销量：<span>' + dataDetail.soldNumber + '笔</span></li>'
                    if (datas == '') {
                         str += '<li class="yuexiao kucuna">库存：<span>' + dataDetail.goodsInventoryList[0].inventory + '</span>笔</li>'
                    } else {
                         str += '<li class="yuexiao kucuna">库存：<span>' + inventorya + '</span>笔</li>'
                    }
                    str += '<li class="' + (CollectionGoodsList ? 'shoucang' : 'noshoucang') + '" id="shoucang">点我收藏</li>'
                    str += '<li class="kefu" da-data="' + dataDetail.storeSupplierUserId + '">联系客服</li>'
                    str += '</ul>'
                    str += '</div>'
                    $(".details_neiron").append(str);
                    // 判断有没有规格
                    if (dataDetail.goodsInventoryList[0].firstSlot) {
                         defaultSelectedSpecification(); //默认选中规格
                    }
                    //商品详情
                    var str2 = '';
                    //  str2 += '<p class="canshujiesao">参数：净含量 ' + dataDetail.weight + '</p>'
                    str2 += '<div class="shangpin">' + dataDetail.explains + '</div>'
                    $(".tab_xiangqing").append(str2)
                    var str3 = ''
                    var dd = []
                    dd.push(JSON.parse(dataDetail.attributes))
                    for (var b = 0; b < dd.length; b++) {
                         str3 += '<tr>'
                         for (var filed in dd[b]) {
                              str3 += '<td>' + filed + '：' + dd[b][filed] + '</td>'
                         }
                         str3 += '</tr>'
                    }
                    //              			 str3 += '<tr>'
                    //		          				str3 += '<td>'+filed+'：'+dd[b][filed]+'</td>'
                    //		          			str3 += '</tr>'
                    $(".tab_xiangqing .tavles").append(str3)
                    //商品详情结束
                    //商品详情数据结束
                    // 评价列表
                    var evalparams = {
                         id: response.data.GoodsDeatil.id,
                         pageIndex: 1,
                         pageSize: 10,
                         isFirst: true
                    }
                    //商品评价

                    function dataEvaluationfn() {
                         //商品详情评价
                         ajax({
                              methods: 'POST',
                              url: 'product-api-impl/app/getGoodsEstimateList',
                              data: evalparams,
                              success: function (response) {
                                   if (response.code == 200) {
                                        var stc = 5
                                        var dataEvaluation = response.data.list;
                                        var dom = ''
                                        if (dataEvaluation.length) {
                                             for (var i = 0; i < dataEvaluation.length; i++) {
                                                  dom += '<li>'
                                                  dom += '<div class="touxiang">'
                                                  dom += '<div class="tou_img">'
                                                  if (dataEvaluation[i].userImage) {
                                                       dom += '<img src="' + dataEvaluation[i].userImage + '">'
                                                  } else {
                                                       dom += '<img src="../common/images/star2.png" alt="">';
                                                  }

                                                  dom += '</div>'
                                                  if (dataEvaluation[i].isAnon == 2) {
                                                       dom += '<span class="mingchen">匿名用户</span>'
                                                  } else {
                                                       dom += '<span class="mingchen">' + dataEvaluation[i].nickname + '</span>'
                                                  }
                                                  dom += '</div>'
                                                  dom += '<div class="neiron">'
                                                  for (var id = 0; id < dataEvaluation[i].rank; id++) {
                                                       dom += '<img src="./images/start1.png"/>'
                                                  }
                                                  for (var id = 0; id < stc - dataEvaluation[i].rank; id++) {
                                                       dom += '<img src="./images/start2.png"/>'
                                                  }
                                                  if (dataEvaluation[i].content) {
                                                       dom += '<p class="nei_ron">' + dataEvaluation[i].content + '</p>'
                                                  } else {
                                                       dom += '<p class="nei_ron">暂无评论</p>'
                                                  }

                                                  dom += '<span class="txt_tata">' + dataEvaluation[i].createTime + ''
                                                  var dd = dataEvaluation[i].specifValueJson
                                                  for (var b = 0; b < dd.length; b++) {
                                                       for (var filed in dd[b]) {
                                                            dom += '&nbsp;&nbsp;<span>' + filed + '：' + dd[b][filed] + '</span>'
                                                       }
                                                  }
                                                  dom += '</span>'
                                                  dom += '</div>'
                                                  dom += '</li>'
                                             }
                                             $(".tab_pinglu ul").empty().append(dom)
                                             if (evalparams.isFirst) {
                                                  evalparams.isFirst = false;
                                                  page({
                                                       pageSize: evalparams.pageSize,
                                                       pageNum: evalparams.pageIndex,
                                                       total: response.data.total,
                                                       fn: function (e) {
                                                            console.log(response.data.total)
                                                            evalparams.pageIndex = e.current;
                                                            dataEvaluationfn(); //更新
                                                       }
                                                  });

                                             }
                                        } else {
                                             dom += '<li>暂无评论列表</li>'
                                             $(".tab_pinglu ul").append(dom)
                                        }

                                        //商品详情评价结束
                                   }
                              }
                         })

                    }
                    dataEvaluationfn();

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
};
var arry = {
     firstSlot: '',
     secendSlot: '',
     thirdSlot: '',
}
// 默认选中规格
function defaultSelectedSpecification() {
     var firstSpecification = $('.details_neiron .guige .specifi');
     var imgs;
     var secendSlotDom;
     if (firstSpecification.children('.ataspec').length > 0) {
          secendSlotDom = firstSpecification.children('.ataspec');
          imgs = secendSlotDom.eq(0).find('img').attr("src");
     } else {
          secendSlotDom = firstSpecification.children('.ataspea');
     }
     var secendSlotDom1 = $('.details_neiron .guige .sizs .ataspec');
     var secendSlotDom2 = $('.details_neiron .guige .sizeof .ataspec');
     secendSlotDom.eq(0).addClass("sta");
     arry.firstSlot = secendSlotDom.eq(0).attr("idt");
     inventorys(1)
     if (!secendSlotDom1.eq(0).hasClass('easyui') && secendSlotDom1.length > 0) {
          secendSlotDom1.eq(0).addClass("sta");
          arry.secendSlot = secendSlotDom1.eq(0).attr("idt");
          inventorys(2)
          if (!secendSlotDom2.eq(0).hasClass('easyui') && secendSlotDom2.length > 0) {
               arry.thirdSlot = secendSlotDom2.eq(0).attr("idt")
               secendSlotDom2.eq(0).addClass("sta");
               inventorys(3)
          }
     }
}

//规格方法
$('.details_neiron').on('click', '.guige .specifi .ataspec', function () {
     var imgs = $(this).find('img').attr("src")
     if ($(this).hasClass('sta')) {
          $(this).removeClass('sta')
          $("#spec-n1").empty().append('<img src="' + imga + '" jqimg="' + imga + '" width="440" height="416px">')
          arry.firstSlot = ''
          inventorys(undefined, 1)
     } else {
          $("#spec-n1").empty().append('<img src="' + imgs + '" jqimg="' + imgs + '" width="440" height="416px">')
          arry.firstSlot = $(this).attr("idt")
          $(this).addClass("sta").siblings().removeClass('sta')
          inventorys(1)
     }
})
//规格方法
$('.details_neiron').on('click', '.guige .specifi .ataspea', function () {
     if (!determineSpecifications($(this))) {
          return false;
     }
     if ($(this).hasClass('sta')) {
          $(this).removeClass('sta')
          arry.firstSlot = ''
          inventorys(undefined, 1)
     } else {
          arry.firstSlot = $(this).attr("idt")
          $(this).addClass("sta").siblings().removeClass('sta')
          inventorys(1)
     }
})
//尺码方法
$('.details_neiron').on('click', '.guige .sizs .ataspec', function () {
     if (!determineSpecifications($(this))) {
          return false;
     }
     if ($(this).hasClass('sta')) {
          $(this).removeClass('sta')
          arry.secendSlot = ''
          inventorys(undefined, 2)
     } else {
          arry.secendSlot = $(this).attr("idt")
          $(this).addClass("sta").siblings().removeClass('sta')
          inventorys(2)
     }
})
//大小方法
$('.details_neiron').on('click', '.guige .sizeof .ataspec', function () {
     if (!determineSpecifications($(this))) {
          return false;
     }
     if ($(this).hasClass('sta')) {
          $(this).removeClass('sta')
          arry.thirdSlot = ''
          inventorys(undefined, 2)
     } else {
          arry.thirdSlot = $(this).attr("idt")
          $(this).addClass("sta").siblings().removeClass('sta')
          inventorys(3)
     }
})
// 判断规格
function determineSpecifications(dom) {
     if (dom.hasClass('easyui')) {
          return false;
     } else {
          return true;
     }

}
// 判断是否置灰
function isEasyui(firstDom, twoDom, number, list, isImg) {
     var firstName;
     var TwotName;
     if (number == 1) {
          firstName = 'secendSlot';
          TwotName = 'thirdSlot';
     }
     if (number == 2) {
          firstName = 'firstSlot';
          TwotName = 'thirdSlot';
     }
     if (number == 3) {
          firstName = 'firstSlot';
          TwotName = 'secendSlot';
     }
     judgeIsEasyui(firstDom, list, firstName, isImg);
     if (twoDom) {
          judgeIsEasyui(twoDom, list, TwotName, isImg);
     }
     // 判断当有一行全部置灰时， 库存置为0
     if (firstDom.length == firstDom.parent().children('.easyui').length || twoDom.length == twoDom.parent().children('.easyui').length) {
          $(".details_neiron .kucuna span").html(0);
     }
}
// 分段
function judgeIsEasyui(dom, list, name, isImg) {
     for (var i = 0; i < dom.length; i++) {
          var flg = false;
          for (var k = 0; k < list.length; k++) {
               // 判断有没有相同的id
               if (dom.eq(i).attr('idt') == list[k][name]) {
                    flg = true;
               }
          }
          if (!flg) {
               dom.eq(i).removeClass('sta').addClass('easyui');
          } else {
               // dom.eq(i).parent().children().removeClass('easyui');
          }
     }
     // 当第一个是图片的时候， 没有库存取消默认点击， 大图还原为原图
     if (name == 'firstSlot' && isImg && $('.details_neiron .guige .specifi .ataspec .sta').length == 0) {
          $("#spec-n1").empty().append('<img src="' + imga + '" jqimg="' + imga + '" width="440" height="416px">');
     }
}
var kuncun = ''
//计算库存
function inventorys(number, isCancel) {
     //	console.log(arry)
     //	console.log(goodsInventoryList)
     //	console.log(goodsSpecificationList[goodsSpecificationList.length - 1].slot)
     var list = [];
     var firstSpecification = $('.details_neiron .guige .specifi');
     // 取出为0的数据
     if (number == 1) {
          for (var i = 0; i < goodsInventoryList.length; i++) {
               if (arry.firstSlot == goodsInventoryList[i].firstSlot && (goodsInventoryList[i].inventory > 0)) {
                    list.push(goodsInventoryList[i])
               }
          }
          var secendSlotDom = $('.details_neiron .guige .sizs .ataspec');
          var secendSlotDom1 = $('.details_neiron .guige .sizeof .ataspec');
          isEasyui(secendSlotDom, secendSlotDom1, number, list);
     }
     if (number == 2) {
          for (var i = 0; i < goodsInventoryList.length; i++) {
               if (arry.secendSlot == goodsInventoryList[i].secendSlot && (goodsInventoryList[i].inventory > 0)) {
                    list.push(goodsInventoryList[i])
               }
          }
          var secendSlotDom;
          var isImg = false;
          if (firstSpecification.children('.ataspec').length > 0) {
               secendSlotDom = firstSpecification.children('.ataspec');
               isImg = true;
          } else {
               secendSlotDom = firstSpecification.children('.ataspea');
          }
          var secendSlotDom1 = $('.details_neiron .guige .sizeof .ataspec');
          isEasyui(secendSlotDom, secendSlotDom1, number, list, isImg);
     }
     if (number == 3) {
          for (var i = 0; i < goodsInventoryList.length; i++) {
               if (arry.thirdSlot == goodsInventoryList[i].thirdSlot && (goodsInventoryList[i].inventory > 0)) {
                    list.push(goodsInventoryList[i])
               }
          }
          var secendSlotDom;
          var isImg = false;
          if (firstSpecification.children('.ataspec').length > 0) {
               secendSlotDom = firstSpecification.children('.ataspec');
               isImg = true;
          } else {
               secendSlotDom = firstSpecification.children('.ataspea');
          }
          var secendSlotDom1 = $('.details_neiron .guige .sizs .ataspec');
          isEasyui(secendSlotDom, secendSlotDom1, number, list, isImg);
     }
     // 判断取消
     if (isCancel) {
          var secendSlotDom;
          if (firstSpecification.children('.ataspec').length > 0) {
               secendSlotDom = firstSpecification.children('.ataspec');
               isImg = true;
          } else {
               secendSlotDom = firstSpecification.children('.ataspea');
          }
          if (isCancel == 1) {
               console.log('34')
               $('.details_neiron .guige .sizs .ataspec').removeClass('easyui');
               $('.details_neiron .guige .sizeof .ataspec').removeClass('easyui');
          }
          if (isCancel == 2) {
               secendSlotDom.removeClass('easyui');
               $('.details_neiron .guige .sizeof .ataspec').removeClass('easyui');
          }
          if (isCancel == 3) {
                secendSlotDom.removeClass('easyui');
               $('.details_neiron .guige .sizs .ataspec').removeClass('easyui');
          }
          $(".details_neiron .kucuna span").html(inventorya); //设置为总的库存数量
     }
     // console.log(arry.firstSlot)
     // console.log(goodsInventoryList)
     // console.log(array)
     if (goodsSpecificationList[goodsSpecificationList.length - 1].slot == 1) {
          for (var i = 0; i < goodsInventoryList.length; i++) {
               if (arry.firstSlot != '') {
                    if (arry.firstSlot == goodsInventoryList[i].firstSlot) {
                         console.log(goodsInventoryList[i])
                         goodsInventoryId = goodsInventoryList[i].id
                         $(".details_neiron .kucuna span").html(goodsInventoryList[i].inventory)
                         $(".details_neiron .meiyuan span").html(goodsInventoryList[i].actualPrice)
                         kuncun = goodsInventoryList[i].inventory
                    }
               }
          }
     } else if (goodsSpecificationList[goodsSpecificationList.length - 1].slot == 2) {
          for (var i = 0; i < goodsInventoryList.length; i++) {
               if (arry.firstSlot != '' && arry.secendSlot != '') {
                    if (arry.firstSlot == goodsInventoryList[i].firstSlot && arry.secendSlot == goodsInventoryList[i].secendSlot) {
                         console.log(goodsInventoryList[i])
                         goodsInventoryId = goodsInventoryList[i].id
                         $(".details_neiron .kucuna span").html(goodsInventoryList[i].inventory)
                         $(".details_neiron .meiyuan span").html(goodsInventoryList[i].actualPrice)
                         kuncun = goodsInventoryList[i].inventory
                    }
               }
          }
     } else if (goodsSpecificationList[goodsSpecificationList.length - 1].slot == 3) {
          for (var i = 0; i < goodsInventoryList.length; i++) {
               //			if(arry.firstSlot == goodsInventoryList[i].firstSlot&&goodsInventoryList[i].inventory == 0){
               //				console.log(goodsInventoryList[i])
               //			}
               if (arry.firstSlot != '' && arry.secendSlot != '' && arry.thirdSlot != '') {
                    if (arry.firstSlot == goodsInventoryList[i].firstSlot && arry.secendSlot == goodsInventoryList[i].secendSlot && arry.thirdSlot == goodsInventoryList[i].thirdSlot) {
                         console.log(goodsInventoryList[i])
                         goodsInventoryId = goodsInventoryList[i].id
                         $(".details_neiron .kucuna span").html(goodsInventoryList[i].inventory)
                         $(".details_neiron .meiyuan span").html(goodsInventoryList[i].actualPrice)
                         console.log(goodsInventoryList[i])
                         kuncun = goodsInventoryList[i].inventory
                    }
               }
          }




          //		console.log(acct)
     }
}
// 进入店铺方法
$('#goshop').click(function () {
     window.location.href = './shopList.html?id=' + $('#goshop').data('id');
});
//联系客服
$('.details_neiron').on('click', '.shouchang .kefu', function () {
     var id = $(this).attr("da-data");
     if (id && id != -1) {
          window.location.href = "../chitchat.html?id=" + id + '&productId=' + getQueryString('id') + '&supplierid=' + getQueryString('supplierid') + '&isSupplier=1'
     } else {
          setMessage({
               type: 'warning',
               msg: '店铺不存在'
          })
     }
})
//加入购物车
$('.details_neiron').on('click', '.gouwuche', function () {
     //	console.log(kuncun)
     var userinfo = $.cookie('userInfo') ? JSON.parse($.cookie('userInfo')) : '';
     var isLogin = $.cookie('token') && userinfo;
     if (!isLogin) {
          window.location.href = '../login.html'
          return false
     }
     if ($(".details_neiron .kucuna span").html() == 0) {
          setMessage({
               type: 'warning',
               msg: '没有库存'
          })
          return false
     }
     if (goodsInventoryList[0].firstSlot != '') {//判断规格只有一条
          if (goodsSpecificationList[goodsSpecificationList.length - 1].slot == 1) {
               if (arry.firstSlot == '') {
                    setMessage({
                         type: 'warning',
                         msg: '请选择规格'
                    })
                    return false
               } else if (kuncun == 0 || kuncun == '') {
                    setMessage({
                         type: 'warning',
                         msg: '没有库存'
                    })
                    return false
               }
          } else if (goodsSpecificationList[goodsSpecificationList.length - 1].slot == 2) {
               if (arry.firstSlot == '' || arry.secendSlot == '') {
                    setMessage({
                         type: 'warning',
                         msg: '请选择规格'
                    })
                    return false
               } else if (kuncun == 0 || kuncun == '') {
                    setMessage({
                         type: 'warning',
                         msg: '没有库存'
                    })
                    return false
               }
          } else if (goodsSpecificationList[goodsSpecificationList.length - 1].slot == 3) {
               if (arry.firstSlot == '' || arry.secendSlot == '' || arry.thirdSlot == '') {
                    setMessage({
                         type: 'warning',
                         msg: '请选择规格'
                    })
                    return false
               } else if (kuncun == 0 || kuncun == '') {
                    setMessage({
                         type: 'warning',
                         msg: '没有库存'
                    })
                    return false
               }
          }
     } else {
          goodsInventoryId = goodsInventoryList[0].id
     }
     var goodsNum = $('.shuliang').find('input').val()
     ajax({
          methods: 'POST',
          url: 'product-api-impl/shopcar/addAndUpdateShopCar',
          data: {
               goodsId: qdataDetail.id, //商品id
               goodsAddNum: (goodsNum * 1), //商品数量
               storeSupplierId: qdataDetail.supplierId, //商品所属供应商id
               goodsInventoryId: goodsInventoryId,
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
});
// 点击收藏
$('.details_neiron').on('click', '#shoucang', function () {
     var arr = [];
     var obj = {
          storeSupplierId: qdataDetail["supplierId"],
          goodsId: qdataDetail.id
     }
     arr.push(obj);
     if ($.cookie('token')) {
          ajax({
               methods: 'POST',
               url: 'member-api-impl/userInfo/CollectionAction',
               data: {
                    productIds: arr, //产品id 
                    type: CollectionGoodsList ? 2 : 1, //type标识 1-添加收藏 2-取消收藏
               },
               success: function (response) {
                    if (CollectionGoodsList) {
                         $('#shoucang').removeClass("shoucang").addClass("noshoucang");
                         CollectionGoodsList = false;
                         setMessage({
                              type: 'success',
                              msg: '取消成功!'
                         })
                    } else {
                         $('#shoucang').removeClass("noshoucang").addClass("shoucang");
                         CollectionGoodsList = true;
                         setMessage({
                              type: 'success',
                              msg: '收藏成功!'
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

     } else {
          window.location.href = '../login.html'
     }
});
//立即购买
$('.details_neiron').on('click', '.lijigoumai', function () {
     var userinfo = $.cookie('userInfo') ? JSON.parse($.cookie('userInfo')) : '';
     var isLogin = $.cookie('token') && userinfo;
     if (!isLogin) {
          window.location.href = '../login.html'
          return false
     }
     if ($(".details_neiron .kucuna span").html() == 0) {
          setMessage({
               type: 'warning',
               msg: '没有库存'
          })
          return false
     }
     if (goodsInventoryList[0].firstSlot != '') {//判断规格只有一条
          var firstSpecification = $('.details_neiron .guige .specifi');
          var secendSlotDom;
          if (goodsSpecificationList[goodsSpecificationList.length - 1].slot == 1) {
               if (arry.firstSlot == '') {
                    setMessage({
                         type: 'warning',
                         msg: '请选择规格'
                    })
                    return false
               } else if (kuncun == 0 || kuncun == '') {
                    setMessage({
                         type: 'warning',
                         msg: '没有库存'
                    })
                    return false
               }
          } else if (goodsSpecificationList[goodsSpecificationList.length - 1].slot == 2) {
               if (arry.firstSlot == '' || arry.secendSlot == '') {
                    setMessage({
                         type: 'warning',
                         msg: '请选择规格'
                    })
                    return false
               } else if (kuncun == 0 || kuncun == '') {
                    setMessage({
                         type: 'warning',
                         msg: '没有库存'
                    })
                    return false
               }
          } else if (goodsSpecificationList[goodsSpecificationList.length - 1].slot == 3) {
               if (arry.firstSlot == '' || arry.secendSlot == '' || arry.thirdSlot == '') {
                    setMessage({
                         type: 'warning',
                         msg: '请选择规格'
                    })
                    return false
               } else if (kuncun == 0 || kuncun == '') {
                    setMessage({
                         type: 'warning',
                         msg: '没有库存'
                    })
                    return false
               }
          }
     } else {
          goodsInventoryId = goodsInventoryList[0].id
     }
     isToken();
     var goodsNum = $('.shuliang').find('input').val();
     var list = '[{"goodsId": ' + qdataDetail.id + ', "num": ' + goodsNum + ', "storeSupplierId": ' + qdataDetail["supplierId"] + ', "goodsInventoryId": ' + goodsInventoryId + '}]';
     window.location.href = 'confirmOrder.html?list=' + list + '&addressId=' + qdataDetail.supplierId;
})
//商品数量加减事件
$('.details_neiron').on('click', '.shuliang ul > li', function () {
     var zhi = $(this).html();
     var shu = $('.shuliang').find('input').val();
     if (zhi == "+") {
          shu++;
          $('.shuliang').find('input').val(shu);
          $('.jian').css('color', '#333');
     } else if (zhi == "-") {
          shu--;
          if (shu < 2) {
               shu = 1;
               $('.jian').css('color', '#999');
          }
          $('.shuliang').find('input').val(shu);
     }
});
//鼠标离开数量文本框时间
$(".shuliang").find('input').blur(function () {
     var shu = $(this).val();
     if (shu < 2) {
          shu = 1;
          $('.jian').css('color', '#999');
          $(this).val(shu);
     } else {
          $('.jian').css('color', '#333');
     }
});
//商品介绍切换事件
$('.pingjia').find('h3 > span').click(function () {
     $('.pingjia').find('h3 > span').removeClass("pingjia_on");
     $(this).addClass("pingjia_on");
     $('.tab_xiangqing').css('display', 'none');
     $('.tab_pinglu').css('display', 'none');
     var title = $(this).text();
     if (title == '商品详情') {
          $('.tab_xiangqing').css('display', 'block');
     } else if (title == '宝贝评论') {
          $('.tab_pinglu').css('display', 'block');
     }
});