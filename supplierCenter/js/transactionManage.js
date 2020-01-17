function init() {
     headerTop('#header'); //渲染顶部
     headerNav('#header-seach'); //渲染头部导航
     applySupplierCenter('#centre-left-nav'); //渲染默认左边导航
}
init();

// 切换导航
$('#nav li').click(function () {
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
//d订单搜索
$("#searchs").click(function () {
     parameter.orderSelect = $("#idvalue").val()
     getList();
})
//选择搜索
//$("#chooses").change(function(){
//	parameter.belongSuper = $(this).val()
//   getList();
//})
// 删除
$('#list').on('click', '.delete', function () {
     var _that = $(this);
     seTconfirmation('提示', '确认删除吗', {
          then: function () {
               ajax({
                    url: 'order-api-impl/order/deleteOrderinfo',
                    methods: 'post',
                    data: {
                         id: _that.attr('id'),
                         rank: 2,
                    },
                    success: function (response) {
                         var data = response.data ? response.data : {};
                         if (response.code == 200) {
                              setMessage({
                                   type: 'success',
                                   msg: '删除成功'
                              })
                              $('.confirmation-common').css('display', 'none');
                              if ($('#list').children().length == 1 && parameter.pageIndex != 1) {
                                   parameter.pageIndex--;
                                   parameter.first = true;
                              } else if ($('#list').children().length == 1) {
                                   parameter.first = true;
                              }
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

//翻页
$(".zxf_pagediv").createPage({
     pageNum: 10,
     current: 1,
     backfun: function (e) {
          console.log(e)
          //console.log(e);//回调
     }
});

function CloseAlert() {
     $('.alertForm').hide();
}
// 留言弹框
$('.list').on('click', '.isShow', function () {
     $('.leaveMsg').show();
})
// 退货弹框
//$('.list').on('click', '.reject', function () {
//   $('.reject').show();
//})
// 退款弹框
$('.list').on('click', '.refund', function () {
     $('.refund').show();
})


var parameter = {
     pageIndex: 1,
     pageSize: 10,
     first: true,
     status: '',
     orderSelect: '', //订单搜索
     belongSuper: '', //筛选
}
getList();
//获取表格
function getList() {
     ajax({
          url: 'order-api-impl/order/getSellOrderinfoByStatus',
          methods: 'post',
          data: {
               status: parameter.status,
               pageIndex: parameter.pageIndex,
               pageSize: parameter.pageSize,
               rank: 2,
               orderSelect: parameter.orderSelect,
               belongSuper: parameter.belongSuper,
          },
          success: function (response) {
               var data = response.data ? response.data : {};
               if (response.code == 200) {
                    $('#nav li').eq(1).children('span').eq(1).html(data.waitPay); //待付款
                    $('#nav li').eq(2).children('span').eq(1).html(data.waitSend); //待收货
                    $('#nav li').eq(3).children('span').eq(1).html(data.waitGet); //代发货
                    $('#nav li').eq(4).children('span').eq(1).html(data.waitJudge); //待评价
                    var dom = '';
                    var oli = data.data;
                    for (var i = 0; i < oli.length; i++) {
                         dom += '<li id="' + oli[i].id + '" userId="' + oli[i].userId + '" sellId="' + oli[i].storeSupplierId + '">'
                         //表头店铺信息
                         dom += '<div class="li-top">'
                         dom += '<div class="store fl">'
                         dom += '<span>' + oli[i].createTime + '</span>'
                         dom += '<span>' + oli[i].storeSupplierName + '</span>'
                         dom += '<span>订单号：' + oli[i].orderNumber + '</span>'
                         if (oli[i].invoiceStatus != 0 || oli[i].invoiceStatus != '') {
                              dom += '<span class="tag">已开发票</span>'
                         }
                         if (oli[i].remark != '') {
                              dom += '<span class="tag">有备注</span>'
                         }
                         dom += '</div>'
                         if (oli[i].belongSuper == 0) {
                              dom += '<span class="fr supplier"><i></i><b>联系卖家</b></span>';
                              dom += '<span class="fr purchaser"><i></i><b>联系买家</b></span>';
                         } else {
                              dom += '<span class="fr purchaser"><i></i><b>联系买家</b></span>';
                         }
                         dom += '</div>'
                         //列表订单信息
                         dom += '<ol class="list-one">'
                         var detail = oli[i].listDetail;
                         for (var k = 0; k < detail.length; k++) {
                              dom += '<li>'
                              dom += '<img src="' + detail[k].goodsImage + '" alt="" class="fl">'

                              dom += '<div class="key fl">'
                              dom += '<p>' + detail[k].goodsName + '</p>'
                              dom += '<p>'
                              var dd = detail[k].specifValueJson
                              for (var b = 0; b < dd.length; b++) {
                                   for (var filed in dd[b]) {
                                        dom += '<span>' + filed + '：' + dd[b][filed] + '</span>&nbsp;&nbsp;'
                                   }
                              }
                              dom += '</p>'
                              dom += '</div>'

                              dom += '<div class="number fl">'
                              dom += '<p>单价 ¥ ' + detail[k].goodsMoney + '</p>'
                              dom += '<p>数量 ' + detail[k].goodsNum + '</p>'
                              dom += '</div>'

                              dom += '<div class="sum fl">'
                              dom += '<p>实付 ¥ ' + (oli[i].orderMoney * 1 + oli[i].shippingFee * 1) + '</p>'
                              dom += '<p>含运费 ¥ ' + oli[i].shippingFee + '</p>'
                              var status = '';
                              //0待付款,1待发货,2待收货,3待评价,4已完成
                              switch (oli[i].status) {
                                   case -1:
                                        status = '已取消';
                                        break;
                                   case 0:
                                        status = '待付款';
                                        break;
                                   case 1:
                                        status = '待发货';
                                        break;
                                   case 2:
                                        status = '待收货';
                                        break;
                                   case 3:
                                        status = '已签收';
                                        break;
                                   case 4:
                                        status = '待评价';
                                        break;
                                   case 5:
                                        status = '已完成';
                                        break;
                                   case 6:
                                        status = '换货';
                                        break;
                                   case 7:
                                        status = '退货';
                                        break;
                                   case 10:
                                        status = '争议订单';
                                        break;
                              }
                              dom += '<p>状态 ' + status + '</p>'
                              dom += '</div>'

                              dom += '<div class="handle fl">'
                              if (status == '待付款') {
                                   dom += '<p class="countdown reset" time="' + oli[i].createTime + '">还剩 ' + time(oli[i].createTime) + '</p>'
                              } else {
                                   dom += '<p class="countdown" style="color: white;">还剩</p>'
                              }
                              //状态按钮
                              if (oli[i].status == 0) {
                                   dom += '<p class="btn cancel-order" id="' + oli[i].id + '" onClick="close1111(this)">取消订单</p>'
                              }
                              //                  	if (oli[i].status == 2) {
                              //                     		dom += '<p class="btn send-goods" onClick="">立即发货</p>'
                              //                  	}

                              if (oli[i].status == 6 && oli[i].orderReturnPO.exchangeStatus == -1) {
                                   // dom += '<p class="btn cancel-order" userId="' + oli[i].userId + '"  id="' + oli[i].orderReturnPO.id + '" orderId=' + oli[i].id + '">不同意换货</p>';
                              }
                              if (oli[i].status == 6 && oli[i].orderReturnPO.exchangeStatus == 1) {
                                   dom += '<p class="btn agree-replace reject" userId="' + oli[i].userId + '"  id="' + oli[i].orderReturnPO.id + '" orderId=' + oli[i].id + '">同意换货</p>';
                              }
                              if (oli[i].status == 6 && oli[i].orderReturnPO.exchangeStatus == 2) {
                                   dom += '<p class="btn agree-replace reject" userId="' + oli[i].userId + '"  id="' + oli[i].orderReturnPO.id + '" orderId=' + oli[i].id + '">确认换货</p>';
                              }
                              if (oli[i].status == 6 && oli[i].orderReturnPO.exchangeStatus == 3) {
                                   dom += '<p class="btn cancel-order" userId="' + oli[i].userId + '"  id="' + oli[i].orderReturnPO.id + '" orderId=' + oli[i].id + '">已换货</p>';
                              }
                              if (oli[i].status == 6 && oli[i].orderReturnPO.exchangeStatus == 5) {
                                   dom += '<p class="btn cancel-order" userId="' + oli[i].userId + '" id="' + oli[i].id + '">评价成功</p>'
                              }
                              
                              if (oli[i].status == 7 && oli[i].orderReturnPO.backStatus == -1) {
                                   dom += '<p class="btn cancel-order"  id="' + oli[i].orderReturnPO.id + '" orderId=' + oli[i].id + '">不同意退货</p>';
                              }
                              if (oli[i].status == 7 && oli[i].orderReturnPO.backStatus == 1) {
                                   dom += '<p class="btn send-goods reject"  userId="' + oli[i].userId + '" id="' + oli[i].orderReturnPO.id + '" orderId=' + oli[i].id + '">同意退货</p>';
                              }
                              // if (oli[i].status == 7 && oli[i].orderReturnPO.backStatus == 2) {
                              //      dom += '<p class="btn send-goods reject" userId="' + oli[i].userId + '"  id="' + oli[i].orderReturnPO.id + '" orderId=' + oli[i].id + '">确认退货</p>';
                              // }
                              if (oli[i].status == 7 && oli[i].orderReturnPO.backStatus == 2) {
                                   dom += '<p style="font-size:12px;max-width:200px" class="countdown autoGet" time="' + oli[i].confirmTuihTime + '"><span class="time"></span></p>'
                                   dom += '<p class="btn send-goods reject"  id="' + oli[i].orderReturnPO.id + '" orderId=' + oli[i].id + '">确认退货</p>';
                              }
                              if (oli[i].status == 7 && oli[i].orderReturnPO.backStatus == 3) {
                                   dom += '<p class="btn cancel-order"  id="' + oli[i].orderReturnPO.id + '" orderId=' + oli[i].id + '">已退货</p>';
                              }
                              if (oli[i].status == 7 && oli[i].orderReturnPO.backStatus == 4) {
                                   dom += '<p class="btn cancel-order"  id="' + oli[i].orderReturnPO.id + '" orderId=' + oli[i].id + '">退款中</p>';
                              }
                              dom += '<span class="fr more">更多<i></i>'
                              dom += '<div class="dropdown">'
                              dom += '<dl>'
                              dom += '<dd onClick="orderdetails(' + oli[i].id + ')">订单详情</dd>'
                              if (oli[i].status == 7 && oli[i].orderReturnPO.backStatus == 1) {
                                   dom += '<dd class="rejectBack" id="' + oli[i].orderReturnPO.id + '">拒绝退货</dd>'
                              }

                              if (oli[i].status == 6) {
                                   dom += '<dd onClick="orderdetaila(' + oli[i].orderReturnPO.id + ')">查看换货</dd>'
                              }
                              if (oli[i].status == 2 || oli[i].status == 4 || oli[i].status == 5 || oli[i].status == 6 || oli[i].status == 7) {
                                   dom += '<dd onClick="orderwuliu(' + oli[i].id + ')">查看物流</dd>'
                              }
                              if (oli[i].status == 5 || oli[i].status == -1) {
                                   dom += '<dd class="delete" id="' + oli[i].id + '">删除订单</dd>'
                              }
                              if(oli[i].orderReturnPO.logisticsNum){
                                   dom += '<dd class="forbiden" id="' + oli[i].id + '">确认退货争议</dd>'
                              }
                              dom += '</dl>'
                              dom += '</div>'
                              dom += '</span>'
                              dom += '</div>'
                              dom += '</li>'
                              dom += '<div class="xian"></div>'
                         }
                         dom += '</ol>'
                         dom += '</li>'
                    }

                    $('#list').html(dom);
                    timeDate();
                    initDom();
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
               console.log(response)
          }
     })
}
//查看物流
function orderwuliu(num) {
     window.location.href = '../purchase/logisticsInformation.html?id=' + num
};
//订单详情页
function orderdetails(num) {
     window.location.href = '../purchase/orderDetails.html?id=' + num + '&type=2';
};
//查看退换货 详情
function orderdetaila(num) {
     window.location.href = '../purchase/retreatOrder.html?id=' + num
};
// 关闭弹窗
function CloseAlert() {
     $('.alertForm').hide();
}
var obj = {
     orderId: '',
     id: '',
     userId: ''
}
// 留言弹框
$('.list').on('click', '.isShow', function () {
     // $('.leaveMsg').show();
     // $('textarea').eq(0).val('');
     // obj.orderId = $(this).attr('orderId');
     // obj.id = $(this).attr('id');
     //   obj.userId = $(this).parent().parent().attr('userid');
     if (obj.userId && obj.userId != -1) {
          window.location.href = '../chitchat.html?id=' + obj.userId;
     } else {
          setMessage({
               type: 'warning',
               msg: '店铺不存在'
          })
     }
})
// 退货/退款弹框
$('.list').on('click', '.reject', function () {
     // 1 退货， 2 换货；
     var that = this;
     obj.userId = $(that).attr('userId')
     var returnType = '';
     if ($(this).html() == '同意换货' || $(this).html() == '确认换货') {
          returnType = 2;
     } else {
          returnType = 1;
     }
     var url = 'order-api-impl/orderReturn/agreeOrderinfoBack';
     if ($(this).html() == '确认换货' || $(this).html() == '确认退货') {
          url = 'order-api-impl/orderReturn/confirmOrderinfoBack';
     }
     seTconfirmation('提示', '是否' + $(this).html(), {
          then: function () {
               ajax({
                    url: url,
                    methods: 'post',
                    data: {
                         isAgree: true,
                         returnType: returnType,
                         returnId: $(that).attr('id')
                    },
                    success: function (response) {
                         var data = response.data ? response.data : {};
                         if (response.code == 200) {
                              setMessage({
                                   type: 'success',
                                   msg: response.msg
                              })
                              parameter.first = true;
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
})
// 查看详情
function lookDetail(id) {
     $('.alertForm.leaveMsg1').show();
     ajax({
          url: 'order-api-impl/orderReturn/getSellerReturnView',
          methods: 'post',
          data: {
               returnId: id
          },
          success: function (response) {
               var data = response.data ? response.data : {};
               if (response.code == 200) {
                    var form = $('.alertForm.leaveMsg1');
                    form.find('span').eq(0).html(data.applyTime);
                    form.find('span').eq(1).html(data.consigneeName);
                    form.find('span').eq(2).html(data.reasonText);
                    form.find('img').eq(1).attr('src', data.returnPic)
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
// 提交留言
function submitLeaveMessage(status) {
     var text = '';
     if (status == 1) {
          text = $('textarea').eq(0);
     } else {
          text = $('textarea').eq(1);
     }
     if (text.val().length == 0) {
          return false;
     }
     ajax({
          url: 'member-api-impl/message/replyMessageTalk',
          methods: 'post',
          data: {
               receiveUserId: obj.userId,
               title: '留言',
               mainBody: text.val()
          },
          success: function (response) {
               var data = response.data ? response.data : {};
               if (response.code == 200) {
                    setMessage({
                         type: 'success',
                         msg: response.msg
                    })
                    CloseAlert(); //关闭弹窗
                    getList(); //更新
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
//关闭订单
$('body').on('click', '#list .list-button a', function () {
     var _that = $(this);
     var id = Number(_that.closest('li').attr('id'));
     seTconfirmation('提示', '确认关闭订单吗', {
          then: function () {
               ajax({
                    url: 'order-api-impl/order/cancelOrderinfo?id=' + id,
                    methods: 'post',
                    data: {
                         id: id,
                         rank: 2
                    },
                    success: function (response) {
                         var data = response.data ? response.data : {};
                         if (response.code == 200) {
                              setMessage({
                                   type: 'success',
                                   msg: response.msg
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
})

// 关闭订单
function close1111(that) {
     seTconfirmation('提示', '确认关闭订单吗', {
          then: function () {
               ajax({
                    url: 'order-api-impl/order/cancelOrderinfo?id=' + $(that).attr('id'),
                    methods: 'post',
                    data: {
                         id: $(that).attr('id')
                    },
                    success: function (response) {
                         var data = response.data ? response.data : {};
                         if (response.code == 200) {
                              setMessage({
                                   type: 'success',
                                   msg: '取消成功'
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
};

// 更多-下拉框出现、隐藏
$('#list').on('click', '.more', function () {
     $(this).parent().find(".dropdown").show();
})
$(document).click(function (event) {
     var e = $('#list .more'); // 设置目标区域
     if (!e.is(event.target) && e.has(event.target).length === 0) {
          $('#list .dropdown').hide(); //消失
     }
});

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

};
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

// 聊天
$('#list').on('click', '.purchaser', function () {
     window.location.href = '../chitchat.html?id=' + $(this).closest('li').attr('userId');
})
// 卖家
$('#list').on('click', '.supplier', function () {
     window.location.href = '../chitchat.html?id=' + $(this).closest('li').attr('sellId');
})

// 确认提示 
function seTconfirm(title, msg, options) {
     $('.confirmation-common').remove();
     var dom = '';
     dom += '<div class="confirmation-common">';
     dom += '<div class="dog_alert"></div>';
     dom += ' <div class="text" style="height: 350px;width: 500px;">';
     dom += ' <div class="alert-center">';
     dom += ' <div>';
     var arr = window.location.pathname.split('/');
     var path = '';
     if (arr[arr.length - 1] != 'login.html' && arr[arr.length - 1] != 'index.html') {
          path = '../'
     }
     dom += title + '<img class="fr closeConfirmation" src="' + pathCommon + 'common/images/delete.png" alt="" ></div>';
     dom += '<p>' + msg + '</p>';
     dom += '<div class="btn">';
     dom += '<button class="closeConfirmation">取消</button><button class="submitData">确认</button>';
     dom += '</div>';
     dom += '</div>';
     dom += '</div>';
     dom += ' </div>';
     $('body').off('click', '.closeConfirmation');
     $('body').off('click', '.submitData');
     $('body').append(dom);
     $('body').on('click', '.closeConfirmation', function () {
          $('.confirmation-common').css('display', 'none');
          options.cath();

     })
     $('body').on('click', '.submitData', function () {
          // 确认需要自己隐藏
          options.then();
     })
}

// 拒绝退货
$('#list').on('click', '.rejectBack', function () {
     var _that = $(this);
     seTconfirm('拒绝退货', "<textarea name='refuseReturnReason' rows='7' cols='45' style='font-size:15px;padding:5px;border: 1px solid #EBEBEB;' placeholder='拒绝原因'></textarea>", {
          then: function () {
               // if ($('textarea[name = refuseReturnReason]').val()) {

               //      return;
               // }
               ajax({
                    url: 'order-api-impl/orderReturn/agreeOrderinfoBack',
                    methods: 'post',
                    data: {
                         returnId: _that.attr('id'),
                         returnType: 1,
                         isAgree: false,
                         refuseReturnReason: $('textarea[name = refuseReturnReason]').val()
                    },
                    success: function (response) {
                         var data = response.data ? response.data : {};
                         if (response.code == 200) {
                              setMessage({
                                   type: 'success',
                                   msg: '拒绝成功'
                              })
                              $('.confirmation-common').css('display', 'none');
                              if ($('#list').children().length == 1 && parameter.pageIndex != 1) {
                                   parameter.pageIndex--;
                                   parameter.first = true;
                              } else if ($('#list').children().length == 1) {
                                   parameter.first = true;
                              }
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

// 确认退货争议
$('#list').on('click', '.forbiden', function () {
     var _that = $(this);
     var id = _that.attr('id');
     seTconfirmation('提示', "确认退货争议", {
          then: function () {
               ajax({
                    url: "order-api-impl/argueOperate/addArgueOperate",
                    methods: 'post',
                    data: {
                         orderId:id,
                    },
                    success: function (response) {
                         var data = response.data ? response.data : {};
                         if (response.code == 200) {
                              setMessage({
                                   type: 'success',
                                   msg: '操作成功'
                              })
                              $('.confirmation-common').css('display', 'none');
                              if ($('#list').children().length == 1 && parameter.pageIndex != 1) {
                                   parameter.pageIndex--;
                                   parameter.first = true;
                              } else if ($('#list').children().length == 1) {
                                   parameter.first = true;
                              }
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

//倒计时
function formartTime(time) {
     var endTime = new Date(time.replace(/-/g, "/"));
     var current = new Date();
     var restTime = parseInt((endTime - current) / 1000);
     if (restTime > 0) {
          // 取模（余数）
          var modulo = restTime % (60 * 60 * 24);
          var day = Math.floor(restTime / (60 * 60 * 24))
          // 小时数
          var hours = Math.floor(modulo / (60 * 60));
          modulo = modulo % (60 * 60);
          // 分钟
          var minutes = Math.floor(modulo / 60);
          // 秒
          var seconds = modulo % 60;
          // 输出到页面
          if (day >= 1 && hours >= 0) {
               return day + '天' + hours + "时";
          } else if (day == 0 && hours >= 1) {
               return hours + "时" + minutes + "分";
          } else if (minutes != 0 && minutes > 0) {
               return minutes + "分" + seconds + "秒";
          } else if (seconds > 0) {
               return seconds + "秒";
          } else {
               return 0;
          }
     } else {
          return 0;
     }
}


var time; //定时器id
function initDom() {
     var len = $('ul.list li .autoGet').length
     if (!len) {
          return false;
     }
     clearInterval(time);
     time = setInterval(function () {
          displayVal();
     }, 1000)
}
function displayVal() {
     var oli = $('ul.list li .autoGet');
     for (var i = 0; i < oli.length; i++) {
          var end = formartTime(oli.eq(i).attr('time'));
          oli.eq(i).find('span.time').html(end)
          if (!end) {
               oli.eq(i).removeClass('autoGet')
               oli.eq(i).css('display', 'none')
               // oli.eq(i).html('已确认退货')
               oli.eq(i).next().hide()
               // getList();
          }
     }
}