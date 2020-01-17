var parameter = {
     pageIndex: 1,
     pageSize: 10,
     status: '',
     first: true
}

function init() {
     shopHeaderTop('#header-top'); //渲染公共顶部
     //渲染公共头部
     shopHeader('#s-header');
     //判断是否是从商品首页跳转过来的
     var orderStatus = getQueryString('orderStatus');
     if (orderStatus) {
          for (var i = 0; i < 5; i++) {
               if ($('#nav li').eq(i).attr('status') == orderStatus) {
                    console.log($('#nav li').eq(i))
                    $('#nav li span').removeClass('hover');
                    $('#nav li').eq(i).children('span').eq(0).addClass('hover');
                    parameter = {
                         pageIndex: 1,
                         pageSize: 10,
                         status: orderStatus,
                         first: true
                    }
                    getList(); //获取列表
               }
          }
     } else {
          getList(); //获取列表
     }
}
init();

// 省市区
$('#select_data').on('change', 'select', function (event) {
     var e = event.srcElement ? event.srcElement : event.target;
     $(this).parent().parent().nextAll().remove();
     if (e.value != '') {
          getAddress(e.value);
     }
})
//评价跳转
$('#list').on('click', '.bottom .pngjiaClass', function (event) {
     var id = $(this).parent().parent().parent().attr('id');
     window.location.href = "../purchase/commentCommodity.html?id=" + id;
})
//评价跳转
$('#list').on('click', '.bottom .pingjiaClass', function (event) {
     var id = $(this).parent().parent().parent().attr('id');
     window.location.href = "../purchase/commentCommodity.html?id=" + id;
})
// 获取列表数据(待xx)
function getList() {
     var url = '';
     if (parameter.status < 0) {
          parameter.status = '';
          returnGoods();
     } else {
          url = 'order-api-impl/order/getOrderinfoPageByStatus';
          parameter.status = parseInt(parameter.status);
          ajax({
               url: url,
               methods: 'post',
               data: {
                    status: parameter.status,
                    pageIndex: parameter.pageIndex,
                    pageSize: parameter.pageSize,
               },
               success: function (response) {
                    if (response.code == 200) {
                         var data = response.data ? response.data : [];
                         var dom = '';
                         var oli = data.records;
                         $('#nav li').eq(1).children('span').eq(1).html(data.waitPay);
                         $('#nav li').eq(2).children('span').eq(1).html(data.waitSend);
                         $('#nav li').eq(3).children('span').eq(1).html(data.waitGet);
                         $('#nav li').eq(4).children('span').eq(1).html(data.waitJudge);
                         if (oli.length > 0) {
                              $('#list').show();
                              $('.noOrder').hide();
                         } else {
                              $('#list').hide();
                              $('.noOrder').show();
                         }
                         for (var i = 0; i < oli.length; i++) {
                              dom += '<li id=' + oli[i].id + ' storeUserId="' + oli[i].storeUserId + '" data-sellid="' + oli[i].storeSupplierId + '" data-money=' + (oli[i].orderMoney + oli[i].shippingFee) + '>';
                              dom += '<div class="top">';
                              dom += '<div class="fl">' + oli[i].createTime.slice(0, 10) + '</div>';
                              dom += '<div class="fl">订单号:' + oli[i].orderNumber + '</div>';
                              dom += '<div class="fl dp"><img class="store" src="image/store.png" alt="">' + oli[i].storeSupplierName + '</div>';
                              if (oli[i].belongSuper == 1) {
                                   dom += '<div class="fl dp">供应商：' + oli[i].sellName + '</div>';
                              } else {
                                   dom += '<div class="fl dp"></div>';
                              }
                              dom += '<div class="fl kf"><img class="service" src="image/service.png" alt="">联系客服</div>';
                              dom += '</div>';
                              for (var j = 0; j < oli[i].listDetail.length; j++) {
                                   dom += '<div class="bottom">';
                                   dom += '<div class="fl">';
                                   dom += '<img src="' + oli[i].listDetail[j].goodsImage + '" alt="">';
                                   dom += '<h1>';
                                   dom += '<p>' + oli[i].listDetail[j].goodsName + '</p>';
                                   //                                 dom += '<p>净含量：' + oli[i].listDetail[j].weight + '</p>';
                                   dom += '<p>'
                                   var dd = oli[i].listDetail[j].specifValueJson
                                   for (var b = 0; b < dd.length; b++) {
                                        for (var filed in dd[b]) {
                                             dom += '<span>' + filed + '：' + dd[b][filed] + '</span>&nbsp;&nbsp;'
                                        }
                                   }
                                   dom += '</p>'
                                   dom += '</h1>';
                                   dom += '</div>';
                                   dom += '<div class="fl">' + oli[i].listDetail[j].goodsMoney + '元</div>';
                                   dom += '<div class="fl">x' + oli[i].listDetail[j].goodsNum + '</div>';
                                   dom += '<div class="fl">';
                                   //商品操作模块
                                   if (oli[i].enableReturn) {
                                        if (oli[i].status == 1 || oli[i].status == 2 || oli[i].status == 3) {
                                             dom += '<p class="button refund money">退款</p>';
                                        }
                                        if (oli[i].status == 3) {
                                             dom += '<p  class="button refund goods">换货</p>';
                                        }
                                        if (oli[i].status == 9) {
                                             dom += '<p class="button argue">争议退款</p>';
                                        }

                                        //                                      if (oli[i].status == 6) {
                                        //                                           dom += '<p id="' + oli[i].orderReturnPO.id + '" class="button CheckLook goods">查看换货</p>';
                                        //                                      }
                                        //                                      if (oli[i].status == 7) {
                                        //                                           dom += '<p id="' + oli[i].orderReturnPO.id + '" class="button CheckLook money">查看退款</p>';
                                        //                                      }
                                   }
                                   if (oli[i].status == 6 && oli[i].orderReturnPO.exchangeStatus == 2) {
                                        dom += '<p class="button writeNum">填写单号</p>';
                                   }
                                   if (oli[i].status == 7 && oli[i].orderReturnPO.backStatus == 2) {
                                        dom += '<p class="button writeNum">填写单号</p>';
                                   }
                                   dom += '</div>';
                                   //实付款模块
                                   dom += '<div class="fl">';
                                   dom += '<p>' + (oli[i].orderMoney + oli[i].shippingFee) + '元</p>';
                                   dom += '<p>(含运费：' + oli[i].shippingFee + '元)</p>';
                                   dom += '</div>';
                                   //交易状态模块
                                   dom += '<div class="fl">';
                                   //除去退货退款的操作按钮
                                   var status = '';
                                   var button = '';
                                   var buttonClass = '';
                                   // -1已取消,0待付款,1待发货,2待收货,3已签收,4待评价,5已完成 6换货 7退款
                                   switch (oli[i].status) {
                                        case -1:
                                             status = '已取消';
                                             button = '';
                                             buttonClass = 'pay';
                                             break;
                                        case 0:
                                             status = '待付款';
                                             button = '立即支付';
                                             buttonClass = 'pay';
                                             break;
                                        case 1:
                                             status = '待发货';
                                             button = '';
                                             break;
                                        case 2:
                                             status = '待收货';
                                            if (oli[i].deliveryType === 2 || oli[i].deliveryType === 3){
                                                 button = '确认收货';
                                            } 
                                             buttonClass = 'confirmGoods';
                                             break;
                                        case 3:
                                             status = '已签收';
                                             button = '确认收货';
                                             buttonClass = 'confirmGoods';
                                             break;
                                        case 4:
                                             status = '待评价';
                                             button = '立即评价';
                                             buttonClass = 'review';
                                             break;
                                        case 5:
                                             status = '已完成';
                                             button = '再次购买';
                                             buttonClass = 'buyAgain';
                                             break;
                                   }
                                   // if(oli[i].status === 6) {

                                   // }
                                   if (status) {
                                        dom += '<p>' + status + '</p>';
                                   }
                                   // exchangeStatus (integer, optional): 0不换货 1待换货 2已同意,换货中 3已换货 
                                   var exchangeStatus = '';
                                   var exchangeButton = '';
                                   var backStatus = '';
                                   var pingjiaButton = '';//评价按钮
                                   var pngjiaClass = '';//评价名字
                                   //退货
                                   switch (oli[i].orderReturnPO.exchangeStatus) {
                                        case -1:
                                             exchangeStatus = '不同意';
                                             break;
                                        case 0:
                                             exchangeStatus = '同意换货';
                                             break;
                                        case 1:
                                             exchangeStatus = '待换货';
                                             break;
                                        case 2:
                                             exchangeStatus = '换货中';
                                             exchangeButton = '确认收货';
                                             buttonClass = 'confirmGoods';
                                             break;
                                        case 3:
                                             exchangeStatus = '已换货,待评价';
                                             // exchangeButton = '再次购买';
                                             buttonClass = 'confirmGoods';
                                             button = '确认收货';
                                             // pingjiaButton = '立即评价';
                                             pngjiaClass = 'pngjiaClass';
                                             break;
                                        case 4:
                                             exchangeStatus = '换货评价完成';
                                             exchangeButton = '再次购买';
                                             buttonClass = 'buyAgain';
                                             break;
                                   }
                                   if (oli[i].status == 6) {
                                        dom += '<p>' + exchangeStatus + '</p>';
                                        dom += '<p id="' + oli[i].orderReturnPO.id + '" class="button CheckLook goods"  style="border: none;">查看换货</p>';
                                   }
                                   //退款
                                   // backStatus (integer, optional): 0不退款 1待退款 2已同意,退货中 3已退款 ,
                                   switch (oli[i].orderReturnPO.backStatus) {
                                        case -1:
                                             refundStatus = '不同意';
                                             break;
                                        case 0:
                                             refundStatus = '待退款';
                                             break;
                                        case 1:
                                             refundStatus = '待退款';
                                             break;
                                        case 2:
                                             refundStatus = '退货中';
                                             break;
                                        case 3:
                                             refundStatus = '已退款';
                                             break;
                                   }
                                   if (oli[i].status == 7) {
                                        dom += '<p>' + backStatus + '</p>';
                                        dom += '<p id="' + oli[i].orderReturnPO.id + '" class="button CheckLook money" style="border: none;">查看退款</p>';
                                   }
                                   dom += '<p class="detail">订单详情</p>';
                                   if (oli[i].status == 2 || oli[i].status == 3 || oli[i].status == 4 || oli[i].status == 5) {
                                        dom += '<p class="check">查看物流</p>';
                                   }

                                   dom += '</div>';
                                   //交易操作模块
                                   dom += '<div class="fr">';
                                   //根据前面判断得到的交易操作按钮
                                   if (button) {
                                        if (oli[i].status == 0 && (time(oli[i].createTime) != 0)) {
                                             dom += '<p class="button ' + buttonClass + '">' + button + '</p>';
                                        } else if (oli[i].status != 0) {
                                             dom += '<p class="button ' + buttonClass + '">' + button + '</p>';
                                        }
                                   }
                                   if (oli[i].status == 4) {
                                        var againBuy = "";
                                        var againBuyClass = "";
                                        againBuy = "再次购买";
                                        againBuyClass = "buyAgain"
                                        dom += '<p class="button ' + againBuyClass + '">' + againBuy + '</p>';
                                   }
                                   if (exchangeButton) {
                                        dom += '<p class="button ' + buttonClass + '">' + exchangeButton + '</p>';
                                        if (oli[i].orderReturnPO.exchangeStatus == 3) {
                                             dom += '<p class="button ' + pngjiaClass + '">' + pingjiaButton + '</p>';
                                        }
                                   }
                                   //剩余时间
                                   if (oli[i].status == 0 && (time(oli[i].createTime) != 0)) {
                                        dom += '<p class="restTime reset" time="' + oli[i].createTime + '">' + time(oli[i].createTime) + '</p>';
                                   }
                                   if (oli[i].remainderDays) {
                                        dom += '<p class="restTime">还剩' + oli[i].remainderDays + '</p>';
                                   }
                                   if (oli[i].status == 2 || oli[i].status == 3 || oli[i].status == 6) {
                                        if (!oli[i].prolongDate && (oli[i].orderReturnPO.exchangeStatus == 2)) {
                                             dom += '<p class="longerTime">延长收货</p>';
                                        }
                                   }
                                   //删除订单
                                   if (oli[i].status == 5 || oli[i].status == -1) {
                                        dom += '<p class="button delete" id="' + oli[i].id + '">删除</p>';
                                   }
                                   if (oli[i].status == 0) {
                                        dom += '<p class="more" addressid="' + oli[i].deliveryAddressId + '">';
                                        dom += '更多操作';
                                        dom += '<a href="javascript:;">';
                                        dom += '<span class="cancelOrder">取消订单</span>';
                                        dom += '</a>';
                                        dom += '</p>';
                                   }
                                   dom += '</div>';
                                   dom += '</div>';
                              }
                              dom += '</li>';
                         }
                         $('#list').html(dom);
                         timeDate();
                         if (parameter.first) {
                              parameter.first = false;
                              page({
                                   pageSize: parameter.pageSize,
                                   pageNum: parameter.pageIndex,
                                   total: data.total,
                                   fn: function (e) {
                                        parameter.pageIndex = e.current;
                                        getList(); //更新
                                   }
                              });
                         }
                    } else {
                         setMessage({
                              type: 'warning',
                              msg: response.msg
                         })
                    }

               },
               error: function (response) {
                    console.log(response);
               }
          })
     }
}
// 删除订单
$('#list').on('click', '.delete', function () {
     var _that = $(this);
     seTconfirmation('提示', '确认删除吗', {
          then: function () {
               ajax({
                    url: 'order-api-impl/order/deleteOrderinfo',
                    methods: 'post',
                    data: {
                         id: _that.attr('id'),
                    },
                    success: function (response) {
                         var data = response.data ? response.data : {};
                         if (response.code == 200) {
                              setMessage({
                                   type: 'success',
                                   msg: '删除成功'
                              })
                              $('.confirmation-common').css('display', 'none');
                              getList();
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
          },
          cath: function () {
               console.log('取消')
          }
     });
});
//退货售后
function returnGoods() {
     ajax({
          url: 'order-api-impl/orderReturn/getBuyerReturnOrderList',
          methods: 'post',
          data: {
               // status: parameter.status,
               pageIndex: parameter.pageIndex,
               pageSize: parameter.pageSize,
          },
          success: function (response) {
               if (response.code == 200) {
                    var data = response.data ? response.data : [];
                    var dom = '';
                    var oli = data.records;
                    if (oli.length > 0) {
                         $('#list').show();
                         $('.noOrder').hide();
                    } else {
                         $('#list').hide();
                         $('.noOrder').show();
                    }
                    for (var i = 0; i < oli.length; i++) {
                         if (oli[i].status == 6 || oli[i].status == 7) {
                              dom += '<li id=' + oli[i].orderId + ' data-sellid="' + oli[i].sellId + '" data-money=' + (oli[i].orderMoney + oli[i].shippingFee) + '>';
                         } else {
                              dom += '<li id=' + oli[i].id + ' data-sellid="' + oli[i].sellId + '" data-money=' + (oli[i].orderMoney + oli[i].shippingFee) + '>';
                         }

                         dom += '<div class="top">';
                         dom += '<div class="fl">' + oli[i].applyTime + '</div>';
                         dom += '<div class="fl">订单号:' + oli[i].orderNumber + '</div>';
                         dom += '<div class="fl dp"><img class="store" src="image/store.png" alt="">' + oli[i].sellName + '</div>';
                         dom += '<div class="fl"><img class="service" src="image/service.png" alt="">联系客服</div>';
                         dom += '</div>';
                         for (var j = 0; j < oli[i].detailList.length; j++) {
                              dom += '<div class="bottom">';
                              dom += '<div class="fl">';
                              dom += '<img src="' + oli[i].detailList[j].goodsImage + '" alt="">';
                              dom += '<h1>';
                              dom += '<p>' + oli[i].detailList[j].goodsName + '</p>';
                              //dom += '<p>净含量：' + oli[i].detailList[j].weight + '</p>';
                              dom += '<p>'
                              var dd = oli[i].detailList[j].specifValueJson
                              for (var b = 0; b < dd.length; b++) {
                                   for (var filed in dd[b]) {
                                        dom += '<span>' + filed + '：' + dd[b][filed] + '</span>&nbsp;&nbsp;'
                                   }
                              }
                              dom += '</p>'
                              dom += '</h1>';
                              dom += '</div>';
                              dom += '<div class="fl">' + oli[i].detailList[j].goodsMoney + '元</div>';
                              dom += '<div class="fl">' + oli[i].detailList[j].goodsNum + '</div>';
                              dom += '<div class="fl">';
                              //商品操作模块
                              //                            if (oli[i].enableReturn) {
                              //                                 if (oli[i].status == 6) {
                              //                                      dom += '<p id="' + oli[i].orderReturnPO.id + '" class="button CheckLook goods">查看换货</p>';
                              //                                 }
                              //                                 if (oli[i].status == 7) {
                              //                                      dom += '<p id="' + oli[i].orderReturnPO.id + '" class="button CheckLook money">查看退款</p>';
                              //                                 }
                              //                            }
                              dom += '</div>';
                              //实付款模块
                              dom += '<div class="fl">';
                              dom += '<p>' + oli[i].orderMoney + '元</p>';
                              dom += '<p>(含运费：' + oli[i].shippingFee + '元)</p>';
                              dom += '</div>';
                              //交易状态模块
                              dom += '<div class="fl">';
                              //除去退货退款的操作按钮
                              var status = '';
                              var button = '';
                              var buttonClass = '';
                              // -1已取消,0待付款,1待发货,2待收货,3已签收,4待评价,5已完成 6换货 7退款
                              switch (oli[i].status) {
                                   case -1:
                                        status = '已取消';
                                        button = '';
                                        break;
                                   case 0:
                                        status = '待付款';
                                        button = '立即支付';
                                        buttonClass = 'review';
                                        break;
                                   case 1:
                                        status = '待发货';
                                        button = '';
                                        break;
                                   case 2:
                                        status = '待收货';
                                        if (oli[i].deliveryType === 2 || oli[i].deliveryType === 3){
                                             button = '确认收货';
                                        } 
                                        // button = '确认收货';
                                        buttonClass = 'confirmGoods';
                                        break;
                                   case 3:
                                        status = '已签收';
                                        button = '确认收货';
                                        buttonClass = 'confirmGoods';
                                        break;
                                   case 4:
                                        status = '待评价';
                                        button = '立即评价';
                                        buttonClass = 'review';
                                        break;
                                   case 5:
                                        status = '已完成';
                                        button = '再次购买';
                                        buttonClass = 'buyAgain';
                                        break;
                              }
                              if (status) {
                                   dom += '<p>' + status + '</p>';
                              }
                              // exchangeStatus (integer, optional): 0不换货 1待换货 2已同意,换货中 3已换货 
                              var exchangeStatus = '';
                              var exchangeButton = '';
                              var refundStatus = '';
                              var pingjiaButton = '';
                              var pingjiaClass = '';
                              //换货
                              //                            console.log(oli[i].exchangeStatus)
                              switch (oli[i].exchangeStatus) {
                                   case -1:
                                        exchangeStatus = '不同意';
                                        break;
                                   case 0:
                                        exchangeStatus = '同意换货';
                                        break;
                                   case 1:
                                        exchangeStatus = '待换货';
                                        break;
                                   case 2:
                                        exchangeStatus = '换货中';
                                        exchangeButton = '确认收货';
                                        buttonClass = 'confirmGoods';
                                        break;
                                   case 3:
                                        exchangeStatus = '已换货,待评价';
                                        exchangeButton = '再次购买';
                                        buttonClass = 'buyAgain';
                                        pingjiaButton = '立即评价';
                                        pingjiaClass = 'pingjiaClass';
                                        break;
                                   case 4:
                                        exchangeStatus = '换货评价成功';
                                        break;
                              }
                              if (oli[i].status == 6) {
                                   dom += '<p>' + exchangeStatus + '</p>';
                                   dom += '<p id="' + oli[i].returnId + '" class="button CheckLook goods" style="border: none;">查看换货</p>';
                              }
                              //退款
                              // refundStatus (integer, optional): 0不退款 1待退款 2已同意,退货中 3已退款 ,
                              switch (oli[i].refundStatus) {
                                   case -1:
                                        refundStatus = '不同意';
                                        break;
                                   case 0:
                                        refundStatus = '待退款';
                                        break;
                                   case 1:
                                        refundStatus = '待退款';
                                        break;
                                   case 2:
                                        refundStatus = '退货中';
                                        break;
                                   case 3:
                                        refundStatus = '已退款';
                                        break;
                              }
                              if (oli[i].status == 7) {
                                   dom += '<p>' + refundStatus + '</p>';
                                   dom += '<p id="' + oli[i].returnId + '" class="button CheckLook money" style="border: none;">查看退款</p>';
                              }
                              dom += '<p class="detail">订单详情</p>';
                              if (oli[i].status == 2 || oli[i].status == 3 || oli[i].status == 4 || oli[i].status == 5) {
                                   dom += '<p class="check">查看物流</p>';
                              }
                              dom += '</div>';
                              //交易操作模块
                              dom += '<div class="fr">';
                              //根据前面判断得到的交易操作按钮
                              if (button) {
                                   dom += '<p class="button ' + buttonClass + '">' + button + '</p>';
                              }
                              if (exchangeButton) {
                                   dom += '<p class="button ' + buttonClass + '">' + exchangeButton + '</p>';
                                   if (oli[i].exchangeStatus == 3) {
                                        dom += '<p class="button ' + pingjiaClass + '">' + pingjiaButton + '</p>';
                                   }
                              }
                              //剩余时间
                              if (oli[i].remainderDays) {
                                   dom += '<p class="restTime">还剩' + oli[i].remainderDays + '</p>';
                              }
                              if (oli[i].status == 2 || oli[i].status == 3 || oli[i].status == 6) {
                                   if (!oli[i].prolongDate && (oli[i].exchangeStatus == 2)) {
                                        dom += '<p class="longerTime">延长收货</p>';
                                   }
                              }
                              dom += '</div>';
                              dom += '</div>';
                         }
                         dom += '</li>';
                    }
                    $('#list').html(dom);
                    if (parameter.first) {
                         parameter.first = false;
                         page({
                              pageSize: parameter.pageSize,
                              pageNum: parameter.pageIndex,
                              total: data.total,
                              fn: function (e) {
                                   parameter.pageIndex = e.current;
                                   getList(); //更新
                              }
                         });
                    } else {
                         setMessage({
                              type: 'warning',
                              msg: response.msg
                         })
                    }
               }

          },
          error: function (response) {
               console.log(response);
          }
     })
}
//倒计时6小时
function time(time) {
     var createTime = new Date(time.replace(/-/g, "/"));
     var now = new Date();
     var totalSeconds = parseInt((now - createTime) / 1000);
     //剩余时间
     var restTime = 6 * 60 * 60 - totalSeconds;
     if (restTime > 0) {
          // 取模（余数）
          var modulo = restTime % (60 * 60 * 24);
          // 小时数
          var hours = Math.floor(modulo / (60 * 60));
          modulo = modulo % (60 * 60);
          // 分钟
          var minutes = Math.floor(modulo / 60);
          // 秒
          var seconds = modulo % 60;
          // 输出到页面
          if (hours != 0 && hours > 0) {
               return "还剩" + hours + "时" + minutes + "分" + seconds + "秒";
          } else if (hours == 0 && minutes != 0 && minutes > 0) {
               return "还剩" + minutes + "分" + seconds + "秒";
          } else if (minutes == 0 && seconds > 0) {
               return "还剩" + seconds + "秒";
          } else {
               return 0;
          }
     } else {
          return 0;
     }

}
var timeName = '';
// 倒计时定时器
function timeDate() {
     if ($('ul.list li .reset').length == 0) {
          return false;
     }
     timeName = setInterval(function () {
          var oli = $('ul.list li .reset');
          if (oli.length) {
               //清除定时器
               clearInterval('timeName');
          }
          for (var i = 0; i < oli.length; i++) {
               var child = oli.parent().children('.reset');
               if (time(oli.attr('time')) == 0) {
                    //找到类名为reset的标签
                    for (var j = 0; j < child.length; j++) {
                         //判断是否已经到结束时间
                         if (child.eq(j).html() == '还剩1秒' || child.eq(j).html() == '0') {
                              child.eq(j).removeClass('reset');
                              //隐藏倒计时和按钮
                              child.parent().css('display', 'none');
                         }
                    }
               } else {
                    for (var k = 0; k < child.length; k++) {
                         oli.eq(k).html(time(oli.eq(k).attr('time')))
                    }
               }
          }
     }, 1000);
}
// 打开弹窗
$('#list').on('click', 'li .more .updateAddress', function () {
     $('.alertForm').show();
})
// 关闭弹窗
function CloseAlert() {
     $('#list .bottom .more a').hide();
     $('.alertForm').hide();
}
// 关闭客服消息弹窗
function CloseAlertMsg() {
     $('.details_alertForm.chatWith').hide();
}
// 发送客服消息
function SendAlertMsg() {

}
// 隐藏更多
$(document).click(function () {
     $('#list .bottom .more a').hide();
})
// 切换导航
$('#nav li').click(function () {
     clearInterval('timeName');
     $('#nav li span').removeClass('hover');
     $(this).children('span').eq(0).addClass('hover');
     parameter = {
          pageIndex: 1,
          pageSize: 10,
          status: $(this).attr('status'),
          first: true
     }
     getList();
});

$('#list').on('click', '.bottom .more', function () {
     $(this).children().show();
})

//确认收货和延长收货
$('#list').on('click', 'li .fr p', function () {
     var id = $(this).parent().parent().parent().attr('id');
     var url = '',
          text = '',
          title = '',
          data = {};
     if ($(this).attr('class').indexOf('confirmGoods') != -1) {
          url = 'order-api-impl/orderpay/confirmReceipt';
          text = '确认收货后您的货款将打给卖家，请确认收到货物后操作哦！';
          title = '确认收货';
          data = {
               orderId: id
          };
     } else if ($(this).attr('class').indexOf('longerTime') != -1) {
          url = 'order-api-impl/order/updOrderinfoProlongDate?id=' + id,
               text = '每笔订单只可延长一次哦，是否延长收货？';
          title = '延长收货';
          data = {};
     } else {
          return false;
     }
     seTconfirmation(title, text, {
          then: function () {
               ajax({
                    url: url,
                    methods: 'post',
                    data: data,
                    success: function (response) {
                         if (response.code == 200) {
                              setMessage({
                                   type: 'success',
                                   msg: response.msg
                              })
                              $('.confirmation-common').css('display', 'none');
                              window.location.reload()
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
          },
          cath: function () {
               console.log('取消')
          }
     });
})

//取消订单
$('#list').on('click', 'li .fr p.more span.cancelOrder', function () {
     var id = $(this).parent().parent().parent().parent().parent().attr('id');
     seTconfirmation('取消订单', '取消后订单失效，是否确认取消订单？', {
          then: function () {
               ajax({
                    url: 'order-api-impl/order/cancelOrderinfo?id=' + id,
                    methods: 'post',
                    data: {},
                    success: function (response) {
                         if (response.code == 200) {
                              setMessage({
                                   type: 'success',
                                   msg: '操作成功'
                              })
                              $('.confirmation-common').css('display', 'none');
                              $('#list .bottom .more a').hide();
                              window.location.reload()
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
          },
          cath: function () {
               console.log('取消')
          }
     });
})

//再次购买
$('#list').on('click', 'li .fr p.buyAgain', function () {
     var id = $(this).parent().parent().parent().attr('id');
     seTconfirmation('再次购买', '是否确认再次购买？', {
          then: function () {
               ajax({
                    url: 'product-api-impl/shopcar/addAndUpdateShopCarRepurchase',
                    methods: 'post',
                    data: {
                         orderId: id
                    },
                    success: function (response) {
                         if (response.code == 200) {
                              // setMessage({
                              //     type: 'success',
                              //     msg: '操作成功'
                              // })
                              window.location.href = "../buyerPersonCenter/myCart.html";
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
          },
          cath: function () {
               console.log('取消')
          }
     });
})

//立即支付
$('#list').on('click', 'li .fr p.button.pay', function () {
     var id = $(this).parent().parent().parent().attr('id');
     var money = $(this).parent().parent().parent().data('money');
     var orderinfo = [{
          "orderId": id,
          "orderPayMoney": money
     }]
     window.location.href = "../purchase/payment.html?orderinfo=" + JSON.stringify(orderinfo);
})
//查看物流
$('#list').on('click', 'li .fl p.check', function () {
     var id = $(this).parent().parent().parent().attr('id');
     window.location.href = "../purchase/logisticsInformation.html?id=" + id;
})
//进入店铺
$('#list').on('click', 'li  .fl.dp', function () {
     var id = $(this).parent().parent().attr('data-sellid');
     window.location.href = "../purchase/shopList.html?id=" + id;
})
//退换商品
$('#list').on('click', 'li .fl p.button.refund', function () {
     var id = $(this).parent().parent().parent().attr('id');
     var refundType = $(this).hasClass('refund money') ? 1 : $(this).hasClass('refund goods') ? 2 : 1
     window.location.href = "../purchase/shopreplacement.html?id=" + id + '&refundType=' + refundType;
})
//退换商品
$('#list').on('click', 'li .fl p.button.CheckLook', function () {
     var id = $(this).attr('id');
     window.location.href = "../purchase/retreatOrder.html?id=" + id + '&type=3';
})
//订单详情
$('#list').on('click', 'li .fl p.detail', function () {
     var id = $(this).parent().parent().parent().attr('id');
     window.location.href = "../purchase/orderDetails.html?id=" + id + '&type=3';
})
//立即评价
$('#list').on('click', 'li .fr p.button.review', function () {
     var id = $(this).parent().parent().parent().attr('id');
     window.location.href = "../purchase/commentCommodity.html?id=" + id;
})
//联系客服
$('#list').on('click', 'li .fl.kf', function () {
     var storeUserId = $(this).parents('li').attr('storeUserId');
     if (storeUserId && storeUserId != -1) {
          window.location.href = '../chitchat.html?id=' + storeUserId + '&isSupplier=1';
     } else {
          setMessage({
               type: 'warning',
               msg: '店铺不存在'
          })
     }
})

//发起争议退款
$('#list').on('click', 'li .fl p.button.argue', function () {
     var id = $(this).parent().parent().parent().attr('id');
     seTconfirmation('提示', '是否发起争议退款？', {
          then: function () {
               ajax({
                    url: "order-api-impl/argueOperate/addArgueOperate",
                    methods: 'post',
                    data: {
                         orderId: id,
                    },
                    success: function (response) {
                         if (response.code == 200) {
                              setMessage({
                                   type: 'success',
                                   msg: '操作成功'
                              })
                              $('.confirmation-common').css('display', 'none');
                              $('#list .bottom .more a').hide();
                              getList();

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
          },
          cath: function () {
               console.log('取消')
          }
     });
})

var allid;
// 填写单号
$('#list').on('click', 'li .fl p.button.writeNum', function () {
     var id = $(this).parent().parent().parent().attr('id');
     allid = id;
     $('.writeNumber').show();
})

// 填写物流单号-取消
function CloseWriteNumber() {
     // $('select[name="emsName"]').val('')
     $('input[name="emsNum"]').val('')
     $('.writeNumber').hide();
}

function submitForm() {
     if (!$('input[name="emsNum"]').val()) {
          setMessage({
               type: 'warning',
               msg: '请填写物流单号'
          })
          return false;
     }

     // if (!$('select[name="emsName"]').val()) {
     //      setMessage({
     //           type: 'warning',
     //           msg: '请选择'
     //      })
     //      return false;
     // }
     var obj = {
          orderId: allid * 1,
          logisticsNum: $('input[name="emsNum"]').val()
     }
     ajax({
          url: "order-api-impl/orderReturn/updateOrderReturnLogisticsNum",
          methods: 'post',
          data: obj,
          success: function (response) {
               if (response.code == 200) {
                    setMessage({
                         type: 'success',
                         msg: response.msg
                    })
                    CloseWriteNumber()
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