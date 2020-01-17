function init() {
     headerTop('#header'); //渲染顶部
     headerNav('#header-seach'); //渲染头部导航
     applySupplierCenter('#centre-left-nav'); //渲染默认左边导航
}
init();
// 选中checkout
$('#list').on('click', '.checkout div', function () {
     var that = $(this);
     var name = '';
     if (that.attr('class') == 'noSelected') {
          name = 'Selected';
     } else {
          name = 'noSelected';

     }
     that.removeClass();
     that.addClass(name);
});
// 切换导航
$('#nav li').click(function () {
     $('#nav li span').removeClass('hover');
     $(this).children('span').eq(0).addClass('hover');
     parameter = {
          pageNum: 1,
          pageSize: 10,
          first: true,
          // status 1代发货 2
          status: (Number($(this).attr('status')) + 1)
     }
     getList();
});
//d订单搜索
$("#searchs").click(function () {
     parameter.orderSelect = $("#idvalue").val()
     getList();
})
//选择搜索
$("#chooses").change(function () {
     parameter.belongSuper = $(this).val()
     getList();
})
var parameter = {
     pageNum: 1,
     pageSize: 10,
     first: true,
     // status 1代发货 2
     status: 1,
     belongSuper: '', //订单所属 0-所属卖家 1-所属供应商 ,
     orderSelect: '', //订单搜索 ,
}
getList();
//获取表格
function getList() {
     ajax({
          url: 'order-api-impl/order/getInterflownByStatus',
          methods: 'post',
          data: {
               status: parameter.status,
               pageNum: parameter.pageNum,
               pageSize: parameter.pageSize,
               rank: 2,
               belongSuper: parameter.belongSuper,
               orderSelect: parameter.orderSelect,
          },
          success: function (response) {
               var data = response.data ? response.data : {};
               if (response.code == 200) {
                    var oli = $('#nav li');
                    oli.eq(0).find('span').eq(1).html(data.waitSend);
                    oli.eq(1).find('span').eq(1).html(data.hasSend);
                    oli.eq(2).find('span').eq(1).html(data.hasGet);
                    var dom = '';
                    for (var i = 0; i < data.data.length; i++) {
                         var ali = data.data[i];
                         dom += '<li>';
                         //表头店铺信息
                         dom += '<div class="store">';
                         dom += '<span>' + ali.createTime + '</span>';
                         dom += '<span>' + ali.storeSupplierName + '</span>';
                         dom += '<span>订单号：' + ali.orderNumber + '</span>';
                        if(ali.invoiceStatus != 0){
                         	dom += '<span class="tag">已开发票</span>';
                         }
                         dom += '</div>';
                         //列表订单信息

                         dom += '<ol class="list-one">';
                         for (var k = 0; k < ali.listDetail.length; k++) {
                              dom += '<li>';
                              dom += '<img src="' + ali.listDetail[k].goodsImage + '" alt="" class="fl">';

                              dom += '<div class="key fl">';
                              dom += '<p>' + ali.listDetail[k].goodsName + '</p>';
                              dom += '<p>'
                              var dd = ali.listDetail[k].specifValueJson
                              for (var b = 0; b < dd.length; b++) {
                                   for (var filed in dd[b]) {
                                        dom += '<span>' + filed + '：' + dd[b][filed] + '</span>&nbsp;&nbsp;'
                                   }
                              }
                              dom += '</p>'
                              dom += '</div>';

                              dom += '<div class="number fl">';
                              dom += '<p>单价 ¥ ' + ali.listDetail[k].goodsMoney + '</p>';
                              dom += '<p>数量 ' + ali.listDetail[k].goodsNum + '</p>';
                              dom += '</div>';

                              dom += '<div class="sum fl">';
                              dom += '<div class="receive-info">';
                              dom += '<span class="label fl">收货信息</span>';
                              dom += '<span class="address fl">' + ali.receiveAddress + ' ' + ali.consigneeName + ' ' + ali.consigneePhone + '</span>';
                              dom += '</div>';

                              if(ali.expressLastInfo != ''){
                              		dom += '<div class="logistics-info">';
	                              dom += '<span class="fl label">物流信息</span>';
	                              dom += '<div class="fl">';
	                              dom += '<span class="font">' + ali.expressLastInfo + '</span>';
	                              //                  	dom += '<span class="font">周三</span>';
	                              //                  	dom += '<span class="font">14：21：29</span>';
	                              //                  	dom += '<p class="font">您的订单开始处理</p>';
	                              dom += '</div>';
	                              dom += '</div>';
                              }
                              
                              dom += '</div>';
                              dom += '</li>';
                         }
                         dom += '</ol>';

                         //订单状态和操作
                         dom += '<div class="bottom">';
                         var status = '';
                         //0待付款,1待发货,2待收货,3待评价,4已完成
                         switch (ali.status) {
                              case -1:
                                   status = '取消';
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
                         }
                         dom += '<span class="fl status">订单状态：' + status + '</span>';
                         dom += '<span class="fr details" onClick="orderdetails(' + ali.id + ')">订单详情</span>';
                         //订单状态 判断按钮 
                         if (ali.canHandle) {
                              if (ali.status == 1) {
//                                 dom += ' <span class="fr delivery" receiveAddress="' + ali.buyerAddressSupple + '" buyerAddressIdList="' + ali.buyerAddressIdList.join(',') + '" sellerAddressIdList="' + data.sellerAddressIdList.join(',') + '" sellerAddressSupple="' + data.sellerAddressSupple + '" onClick="shipments(this)" orderNumber="' + ali.orderNumber + '">立即发货</span>';
                                   dom += ' <span class="fr delivery" onClick="shipments(this)" orderId="'+ali.id+'" orderNumber="' + ali.orderNumber + '">立即发货</span>';
                              }
                              if (ali.status == 2) {
                                   dom += '<span class="fr details" onClick="orderwuliu(' + ali.id + ')">物流详情</span>';
                              }
                              if (ali.status == 3) {
                                   dom += '<span class="fr details" onClick="orderwuliu(' + ali.id + ')">物流详情</span>';
                              }
                         }
                         dom += '</div>';
                         dom += '</li>';
                    }
                    $('#list').html(dom);

                    if (parameter.first) {
                         parameter.first = false;
                         page({
                              pageSize: parameter.pageSize,
                              pageNum: parameter.pageNum,
                              total: data.total,
                              fn: function (e) {
                                   parameter.pageNum = e.current;
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
//订单详情页
function orderdetails(num) {
     window.location.href = '../purchase/orderDetails.html?id=' + num
};
//查看物流
function orderwuliu(num) {
     window.location.href = "../purchase/logisticsInformation.html?id=" + num;
}
// 关闭弹窗
function CloseAlert() {
     $('.alertForm').hide();
}
var IsNotice = 0;
//通知上门取件
$(".alertForm .text .input .tab_div .oli div .notice p").click(function () {
     IsNotice = Number($(this).attr("daid"))
     $(this).addClass("has");
     if ($(this).hasClass('has')) {
          $(this).find("img").attr('src', '../common/images/dz_xuanz.png');
          $(this).siblings().removeClass("has");
          $(this).siblings().find("img").attr('src', '../common/images/dz_meixuan.png');
     } else {
          $(this).find("img").attr('src', '../common/images/dz_meixuan.png');
          $(this).siblings().removeClass("has");
          $(this).siblings().find("img").attr('src', '../common/images/dz_xuanz.png');
     }
})
// aler tab
$('.tab li').each(function (i) {
     $(this).click(function () {
          $(this).parent().find('li').removeClass('hove');
          $(this).addClass('hove');
          $('.tab_div .oli').css('display', 'none');
          $('.tab_div .oli').eq(i).css('display', 'block');
     })
})
var orderNumber = ''; //订单号
var buyerAddressIdList = [];
var sellerAddressIdList = [];
// 发货按钮
function shipments(that) {
     var dom = $(that);
//   console.log(dom)
     var dd = dom.attr('orderId')
     $('.alertForm input').val('');
     $('.alertForm select').val('');
     $('.alertForm textarea').val('');
//   getExpressParamForOrder(dd); //获取物流信息
//   buyerAddressIdList = dom.attr('buyerAddressIdList').split(','); //买方
//   var receiveAddress = dom.attr('receiveAddress'); //附加地址
//   $('.alertForm input[name="buyerAddressSupple"]').val(receiveAddress);
//   sellerAddressIdList = dom.attr('sellerAddressIdList').split(','); //卖方
//   var sellerAddressSupple = dom.attr('sellerAddressSupple') ? dom.attr('sellerAddressSupple') : ''; //卖方附加地址
//   $('.alertForm input[name="sellerAddressSupple"]').val(sellerAddressSupple);
     orderNumber = dom.attr('orderNumber'); //订单
     $('.alertForm.leaveMsg').show();
//   // 清空第一个后的全部
     $('.shipments select').eq(0).nextAll().remove();
     $('.take select').eq(0).nextAll().remove();
     getExpressParamForOrder(dd); //获取物流信息
//   getAddress(null, 0, '.shipments select', 0, sellerAddressIdList);
//   getAddress(null, 0, '.take select', 0, buyerAddressIdList);
}
// 下拉框变化
$('.five').on('change', 'select', function (event) {
     var e = event.srcElement ? event.srcElement : event.target;
     $(this).nextAll().remove();
     getAddress(e.value, null, $(this));
})
// 获取地址
function getAddress(id, index, that, number, arr, arr2) {
     ajax({
          url: 'member-api-impl/address/selByParentId',
          methods: 'post',
          data: {
               parentId: id ? id : 0
          },
          success: function (response) {
               if (response.code == 200) {
                    var data = response.data ? response.data : [];
                    if (data.length > 0) {
                         var dom = '';
                         if (index == 0) {
                              dom += '<option value="">请选择</option>';
                              for (var i = 0; i < data.length; i++) {
                                   dom += '<option value="' + data[i].id + '">' + data[i].provinceName + '</option>';
                              }
                              $('.shipments select').eq(0).html(dom).val(sellerAddressIdList[0]);
                              $('.take select').eq(0).html(dom).val(buyerAddressIdList[0]);
                         } else {
                              dom += ' <select name="" id=""  placeholder="请选择">'
                              dom += '<option value="">请选择</option>';
                              for (var i = 0; i < data.length; i++) {
                                   dom += '<option value="' + data[i].id + '">' + data[i].provinceName + '</option>';
                              }
                              dom += '</select>';
                              $(that).parent().append(dom);
                         }
                    }
                    if (number && number < arr.length - 1 || number == 0 && number < arr.length - 1) {
                         getAddress(arr[number], null, that, number + 1, arr);
                    }
                    if (number && number < arr.length || number == 0 && number < arr.length) {
                         if (number && number != 0) {
                              $(that).eq(number).val(arr[number]);
                         }
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
// 获取物流参数
function getExpressParamForOrder(num) {
     ajax({
          url: 'order-api-impl/express/getExpressParamForOrder',
          methods: 'post',
          data: {
          	orderId:num,
          	rank:2,
          },
          success: function (response) {
               var data = response.data ? response.data : {};
               if (response.code == 200) {
                    var expressPaymentVOList = ''; //邮费方式
                    var expressSendTypeVOList = ''; //快递方式
                    var expressVOList = ''; //物流公司
                    for (var i = 0; i < data.expressPaymentVOList.length; i++) {
                         expressPaymentVOList += '<option value="' + data.expressPaymentVOList[i].payType + '">' + data.expressPaymentVOList[i].payName + '</option>'
                    }
                    $('.expressPaymentVO').html(expressPaymentVOList);
                    for (var i = 0; i < data.expressSendTypeVOList.length; i++) {
                         expressSendTypeVOList += '<option value="' + data.expressSendTypeVOList[i].expType + '">' + data.expressSendTypeVOList[i].expTypeName + '</option>'
                    }
                    $('.expressSendTypeVO').html(expressSendTypeVOList);
                    for (var i = 0; i < data.expressVOList.length; i++) {
                          let text = data.expressVOList[i].signCustomId ? '(已签约)' : '';
                         expressVOList += '<option value="' + data.expressVOList[i].id + '">' + data.expressVOList[i].expressName + text + '</option>';
                    }
                    $('.expressVO').eq(0).html(expressVOList);
                    var dom = '';
                    for (var i = 0; i < data.allExpressVOList.length; i++) {
                         dom += '<option value="' + data.allExpressVOList[i].id + '">' + data.allExpressVOList[i].expressName + '</option>'
                    }
                    $('.expressVO').eq(1).html(dom);
					//买方
					buyerAddressIdList = data.buyerAddressSelectList
					$('.alertForm input[name="buyerAddressSupple"]').val(data.buyerAddressSupple);
					getAddress(null, 0, '.take select', 0, buyerAddressIdList);
					
					//卖方
					sellerAddressIdList = data.sellerAddressSelectList
					$('.alertForm input[name="sellerAddressSupple"]').val(data.sellerAddressSupple);
					getAddress(null, 0, '.shipments select', 0, sellerAddressIdList);
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
// 提交
function submitLeaveMessage() {
//     	console.log(IsNotice) //是否通知上门揽收
     var dom = $('.alertForm .tab .hove').html();
     var obj = {};
     if (dom == '在线下单') {
          obj = {
               deliveryType: 1,
               sellerAddressIdList: [], //发货
               buyerAddressIdList: [], //收货地址
               quantity: $('.alertForm input[name="quantity"]').val(), //包裹数不允许为空
               remark: $('.alertForm textarea').val(),
               isNotice: IsNotice, //是否通知上门揽收
               sellPhone: $('.alertForm input[name="sellPhone"]').eq(0).val(), //发货方手机号
               expressId: $('.alertForm select[name="expressId"]').eq(0).val(), //物流公司
               payType: $('.alertForm select[name="payType"]').val(),
               expType: $('.alertForm select[name="expType"]').val(),
               buyerAddressSupple: $('.alertForm input[name="buyerAddressSupple"]').val(),
               sellerAddressSupple: $('.alertForm input[name="sellerAddressSupple"]').val(),
               sellerPostCode: $('.alertForm input[name="sellerPostCode"]').val(), //卖家邮编
               buyerPostCode: $('.alertForm input[name="buyerPostCode"]').val(), //买家邮编
               orderNumber: orderNumber, //订单编号
          }

          var sellerAddressIdList = $('.alertForm .shipments select');
          for (var i = 0; i < sellerAddressIdList.length; i++) {
               if (sellerAddressIdList.eq(i).val()) {
                    obj.sellerAddressIdList.push(sellerAddressIdList.eq(i).val())
               }

          }
          if (obj.sellerAddressIdList.length != sellerAddressIdList.length) {
               setMessage({
                    type: 'warning',
                    msg: '请选择发货地址到最后一级'
               })
               return false;
          }
          var buyerAddressIdList = $('.alertForm .take select');
          for (var i = 0; i < buyerAddressIdList.length; i++) {
               if (buyerAddressIdList.eq(i).val()) {
                    obj.buyerAddressIdList.push(buyerAddressIdList.eq(i).val())
               }

          }
          if (obj.buyerAddressIdList.length != buyerAddressIdList.length) {
               setMessage({
                    type: 'warning',
                    msg: '请选择收货地址到最后一级'
               })
               return false;
          }
          if (!$('.alertForm input[name="sellerAddressSupple"]').val()) {
               setMessage({
                    type: 'warning',
                    msg: '发货补充地址不允许为空'
               })
               return false;
          }
          if (!$('.alertForm input[name="buyerAddressSupple"]').val()) {
               setMessage({
                    type: 'warning',
                    msg: '收获补充地址不允许为空'
               })
               return false;
          }
          if ($('.alertForm input[name="sellerPostCode"]').val().length != 6) {
               setMessage({
                    type: 'warning',
                    msg: '卖家邮编必填（6位数字）'
               })
               return false;
          }
          if ($('.alertForm input[name="buyerPostCode"]').val().length != 6) {
               setMessage({
                    type: 'warning',
                    msg: '买家邮编必填（6位数字）'
               })
               return false;
          }
          if (!$('.alertForm input[name="quantity"]').val()) {
               setMessage({
                    type: 'warning',
                    msg: '包裹数不允许为空'
               })
               return false;
          }
     }
     if (dom == '自己联系物流') {
          obj = {
               deliveryType: 2,
               sellPhone: $('.alertForm input[name="sellPhone"]').eq(1).val(), //发货方手机号
               expressTicket: $('.alertForm input[name="expressTicket"]').val(), //物流运单号
               expressId: $('.alertForm select[name="expressId"]').eq(1).val(), //物流公司
               orderNumber: orderNumber, //订单编号
          }
          if (!$('.alertForm input[name="expressTicket"]').val()) {
               setMessage({
                    type: 'warning',
                    msg: '物流运单号不能为空'
               })
               return false;
          }
     }
     if (dom == '无需物流') {
          obj = {
               deliveryType: 3,
               orderNumber: orderNumber, //订单编号
               sellPhone: $('.alertForm input[name="sellPhone"]').eq(2).val() //发货方手机号
          }
     }
     obj.orderNumber = orderNumber; //订单编号
     obj.rank = 2;
     ajax({
          url: 'order-api-impl/express/createExpressSheet',
          methods: 'post',
          data: obj,
          success: function (response) {
               if (response.code == 200) {
                    setMessage({
                         type: 'success',
                         msg: response.msg
                    })
                    $('.leaveMsg').hide();
                    if (dom == '在线下单') {
                         $('.leaveMsg1').show();
                         $('.leaveMsg1 .input').html(response.data.printTemplate)
                    }
                    parameter.first = true;
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
}

$('.addNew').on('click', function(){
     window.open('./addNewEMS.html', '_self');
})