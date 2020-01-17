//渲染公共顶部
shopHeaderTop('#header-top');
//渲染公共头部
shopHeader('#s-header');


var parentparams = {
     deliveryAddressId: '', //对应收货地址表id
     orderInfo: [
          //{ //订单备注集合
          //   "goods": [//商品集合
          //       {
          //           "carriageTemplateMoney": 16.00,
          //           "goodsId": 161,
          //           "goodsNum": 4,
          //           "price": 5.00
          //        }
          //    ]
          //   storeSupplierId: 56, //供应商id
          //   modeOfDistribution: "1", // 配送方式
          //   remark: "" //备注
          //   "villageId": ""
          // }
     ],
}; //提交订单参数
var totalMoney = 0; //总金额
var isAddressType = 'add'; //是否新增地址
var addAddress = []; //地址信息
var invoiceshu = []; //发票数据
var panduan = ''; //判断新建   修改 发票
var orid = ''; //修改发票的ID
var mun = 1; //发票默认
//订单信息
orderInfo()
// 获取收获地址列表
getList();
// 开发票
invoice();
/**
 * 所有发票内容
 */
function invoice() {
     $('.orderInformation').on('change', '.invoice .checkbox input', function () {
          if ($(this).get(0).checked) {
               $(this).parents('.checkbox').removeClass('noSelect').addClass('selected').next().show();
          } else {
               $(this).parents('.checkbox').removeClass('selected').addClass('noSelect').next().hide();
          }
     })

     // 发票选择
     $('.orderInformation').on('change', '.invoice .invoiceType', function () {
          if ($(this).val() == 1) {
               $('.invoiceTitle').show();
               $('.invoice3').hide()
          } else if ($(this).val() == 2) {
               $('.invoiceTitle').hide();
               $('.invoice3').show()
          }
     })
     $('.orderInformation').on('change', '.invoice .invoiceTitle', function () {
          if ($(this).val() == 1) {
               $('.invoice3').eq(0).hide()
          }
          if ($(this).val() == 2) {
               $('.invoice3').eq(0).show()
          }
     })
}
//添加发票开头
$('.orderInformation').on('click', '.invoice .checkbox span', function () {
     $(".alertForma .text .box .zengzhi").hide()
     panduan = '0'; //判断新建   修改 发票
     orid = ''; //修改发票的ID
     mun = 1; //发票默认
     $(".alertForma .text .form-item .moren img").find("img").attr('src', '../common/images/dz_xuanz.png').addClass('selected'); //发票默认
     $("#alertForma").show()
     $('.alertForma .title').html('创建抬头' + '<img src="./images/delete.png" alt="" onClick="CloseAlerta()">')
     $(".alertForma .text .form-item #invoiceType").val("")
     $(".alertForma .text .form-item #titleTypes").val("")
     $('#alertForma input[name="content"]').val("")
     $('#alertForma input[name="taxNumber"]').val("")
     $('#alertForma input[name="enterpriseAddress"]').val('') //注册地址
     $('#alertForma input[name="enterprisePhone"]').val("") //注册电话
     $('#alertForma input[name="bankDeposit"]').val("") //开户银行
     $('#alertForma input[name="bankAccount"]').val("") //银行账户
})
fapiaoshuju()
//发票数据
function fapiaoshuju() {
     ajax({
          methods: 'POST',
          url: 'order-api-impl/invoicetitle/getInvoicetitleList',
          data: {},
          success: function (response) {
               if (response.code == 200) {
                    var invoiceshua = response.data ? response.data : [];
                    invoiceshu = invoiceshua.reverse()
               } else {
                    setMessage({
                         type: 'warning',
                         msg: response.msg
                    });
               }
          },
          error: function (response) {}
     })
};
// 关闭弹窗
function CloseAlerta() {
     $('.alertForma').hide();
}
//设为默认抬头
$(".alertForma .text .form-item .moren").click(function () {
     if ($(this).find("img").hasClass('selected')) {
          mun = 0
          $(this).find("img").attr('src', '../common/images/dz_meixuan.png').removeClass('selected');
     } else {
          mun = 1
          $(this).find("img").attr('src', '../common/images/dz_xuanz.png').addClass('selected');
     }
})
//选择发票
$(".alertForma .text .form-item #invoiceType").change(function () {
     console.log($(this).val())
     if ($(this).val() == 1 || $(this).val() == '') {
          $(".alertForma .text .box .zengzhi").hide()
     } else if ($(this).val() == 2) {
          $(".alertForma .text .box .zengzhi").show()
     }
})
$(".order-item").on('click', '.invoice ul li span', function () {
     $(this).prev('input').click()
})
//提交发票
function submitfapiao() {
     if ($(".alertForma .text .form-item #invoiceType").val() == "") {
          setMessage({
               type: 'warning',
               msg: '请选择发票类型'
          });
          return false
     }
     if ($(".alertForma .text .form-item #invoiceType").val() == 1) {
          if ($(".alertForma .text .form-item #titleTypes").val() == "") {
               setMessage({
                    type: 'warning',
                    msg: '请选择抬头类型'
               });
               return false
          }
          if ($('#alertForma input[name="content"]').val() == "") {
               setMessage({
                    type: 'warning',
                    msg: '请输入发票抬头'
               });
               return false
          }
          if ($('#alertForma input[name="taxNumber"]').val() == "") {
               setMessage({
                    type: 'warning',
                    msg: '纳税人识别号'
               });
               return false
          }
     } else if ($(".alertForma .text .form-item #invoiceType").val() == 2) {
          if ($(".alertForma .text .form-item #titleTypes").val() == "") {
               setMessage({
                    type: 'warning',
                    msg: '请选择抬头类型'
               });
               return false
          }
          if ($('#alertForma input[name="content"]').val() == "") {
               setMessage({
                    type: 'warning',
                    msg: '请输入发票抬头'
               });
               return false
          }
          if ($('#alertForma input[name="taxNumber"]').val() == "") {
               setMessage({
                    type: 'warning',
                    msg: '纳税人识别号'
               });
               return false
          }
     }
     var urla = ''
     if (panduan == '0') {
          console.log('新')
          urla = 'order-api-impl/invoicetitle/addinvoicetitle'
     } else {
          console.log('改')
          urla = 'order-api-impl/invoicetitle/updateinvoicetitle'
     }
     var pams;
     if ($(".alertForma .text .form-item #invoiceType").val() == 1) {
          pams = {
               invoiceType: $(".alertForma .text .form-item #invoiceType").val(), //发票类型
               titleTypes: $(".alertForma .text .form-item #titleTypes").val(), //抬头类型
               content: $('#alertForma input[name="content"]').val(), //发票抬头
               taxNumber: $('#alertForma input[name="taxNumber"]').val(), //发票抬头
               tacitlyApprove: mun, //是否设置为默认 
               id: orid,
          }
     } else if ($(".alertForma .text .form-item #invoiceType").val() == 2) {
          pams = {
               invoiceType: $(".alertForma .text .form-item #invoiceType").val(), //发票类型
               titleTypes: $(".alertForma .text .form-item #titleTypes").val(), //抬头类型
               content: $('#alertForma input[name="content"]').val(), //发票抬头
               taxNumber: $('#alertForma input[name="taxNumber"]').val(), //纳税人识别号
               tacitlyApprove: mun, //是否设置为默认 
               enterpriseAddress: $('#alertForma input[name="enterpriseAddress"]').val(), //注册地址
               enterprisePhone: $('#alertForma input[name="enterprisePhone"]').val(), //注册电话
               bankDeposit: $('#alertForma input[name="bankDeposit"]').val(), //开户银行
               bankAccount: $('#alertForma input[name="bankAccount"]').val(), //银行账户
               id: orid,
          }
     }
     ajax({
          methods: 'POST',
          url: urla,
          data: pams,
          success: function (response) {
               if (response.code == 200) {
                    CloseAlerta()
                    fapiaoshuju()
                    orderInfo()
                    setMessage({
                         type: 'success',
                         msg: '成功'
                    });
               } else {
                    setMessage({
                         type: 'warning',
                         msg: response.msg
                    });
               }
          },
          error: function (response) {}
     })
}
//删除发票
function dels(num) {
     var _that = $(this);
     seTconfirmation('提示', '确认删除吗', {
          then: function () {
               ajax({
                    url: 'order-api-impl/invoicetitle/delinvoicetitle',
                    methods: 'post',
                    data: {
                         id: num,
                    },
                    success: function (response) {
                         if (response.code == 200) {
                              fapiaoshuju()
                              orderInfo()
                              setMessage({
                                   type: 'success',
                                   msg: '删除成功'
                              })
                              $('.confirmation-common').css('display', 'none');
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

}
//发票详情
function invoicedeit(id) {
     ajax({
          methods: 'POST',
          url: 'order-api-impl/invoicetitle/getInvoicetitleView',
          data: {
               id: id,
          },
          success: function (response) {
               if (response.code == 200) {
                    panduan = '1'
                    orid = id
                    var data = response.data
                    $('.alertForma').show();
                    if (data.invoiceType == 1) {
                         $(".alertForma .text .box .zengzhi").hide()
                    } else {
                         $(".alertForma .text .box .zengzhi").show()
                    }
                    $(".alertForma .text .form-item #invoiceType").val(data.invoiceType) //发票类型
                    $(".alertForma .text .form-item #titleTypes").val(data.titleTypes) //抬头类型
                    $('#alertForma input[name="content"]').val(data.content) //发票抬头
                    $('#alertForma input[name="taxNumber"]').val(data.taxNumber) //发票抬头
                    $('#alertForma input[name="enterpriseAddress"]').val(data.enterpriseAddress) //注册地址
                    $('#alertForma input[name="enterprisePhone"]').val(data.enterprisePhone) //注册电话
                    $('#alertForma input[name="bankDeposit"]').val(data.bankDeposit) //开户银行
                    $('#alertForma input[name="bankAccount"]').val(data.bankAccount) //银行账户
                    if (data.tacitlyApprove == 1) {
                         $(".alertForma .text .form-item .moren img").attr('src', '../common/images/dz_xuanz.png');
                         mun = data.tacitlyApprove
                         $(".alertForma .text .form-item .moren img").addClass('selected');
                    } else {
                         $(".alertForma .text .form-item .moren img").attr('src', '../common/images/dz_meixuan.png');
                         mun = data.tacitlyApprove
                         $(".alertForma .text .form-item .moren img").removeClass('selected');
                    }
               } else {
                    setMessage({
                         type: 'warning',
                         msg: response.msg
                    });
               }
          },
          error: function (response) {}
     })
}


//收获地址选择
$('.adress').on('click', 'span.fl', function () {
     if (!$(this).hasClass("selected")) {
          $(this).parent().parent().find('.selected').removeClass('selected');
          $(this).parent().parent().children().children('span.fl').addClass('noSelect');
          $(this).removeClass('noSelect');
          $(this).addClass('selected');
          $(this).parent().children('a').addClass('selected');
          parentparams.deliveryAddressId = $('.adress .selected').parent().attr('id');
          //订单信息  选择地址更新运费
          orderInfo();
     } // else {
     //  $(this).removeClass('selected');
     //  $(this).addClass('noSelect');
     //  $(this).parent().children('a').removeClass('selected');
     //}
})
//选择地址联动
$('.order-item').on('change', '.village div.fl select', function () {
     var id = $(this).val();
     $(this).nextAll().remove();
     if (id) {
          getBfcAddress(id);
     }
})
// 省市区
$('#alertForm').on('change', '#select_data select', function (event) {
     var e = event.srcElement ? event.srcElement : event.target;
     $(this).parent().parent().nextAll().remove();
     if (e.value != '') {
          getAddress(e.value, '#select_data');
     }
})
// 修改地址-打开弹窗
$('.adress').on('click', 'li .edit-address', function () {
     //请求地址详情数据
     var that = $(this)
     ajax({
          methods: 'POST',
          url: 'member-api-impl/user/addressDetail',
          data: {
               addressId: that.parent().attr('id')
          },
          success: function (response) {
               if (response.code == 200) {
                    var data = response.data ? response.data : {};

                    var arr = [];
                    if (data.list.length > 0) {
                         arr = data.list.reverse();
                         addAddress = arr;
                         newAddress(arr[0], 0);
                    }
                    $('#alertForm #select_data').empty()
                    $('.alertForm .title').html('修改地址' + '<img src="./images/delete.png" alt="" onClick="CloseAlert()">')
                    $('.alertForm').show();
                    isAddressType = that.parent().attr('id');
                    $('#alertForm input[name="name"]').val(data.name);
                    $('#alertForm input[name="phone"]').val(data.phone);
                    $('#alertForm input[name="addressSupple"]').val(data.addressSupple);
               } else {
                    setMessage({
                         type: 'warning',
                         msg: response.msg
                    });
               }
          },
          error: function (response) {}
     })


})
//提交订单
$('#submitOrder').click(function () {
     var array = [];
     var shopList = $('.orderInformation .order-item > li'); //店铺列表
     var shen = $('.village div.fl').children();
     for (var i = 0; i < shen.length; i++) {
          if (shen.eq(i).val()) {
               array.push(shen.eq(i).val())
          }
     }
     if (array.length != 0 && array.length != shen.length) {
          setMessage({
               type: 'warning',
               msg: '合作店铺不允许为空'
          });
          return false;
     }

     for (var i = 0; i < shopList.length; i++) {
          if (shopList.eq(i).children('.invoice').children("p").hasClass('selected')) {
               parentparams.orderInfo[i].titleId = Number(shopList.eq(i).children('.invoice').children('ul').children('li').children("input[type='radio']:checked").attr("ida"))
          } else {
               parentparams.orderInfo[i].titleId = ''
          }
          parentparams.orderInfo[i].remark = shopList.eq(i).children('.bottom').children('textarea').val();
          var isBF = shopList.eq(i).find('.village').children().is('div'); //是否有帮扶村
          if (isBF && array.length == shen.length) {
               parentparams.orderInfo[i].villageId = shen.eq(shen.length - 1).val();
          } else {
               parentparams.orderInfo[i].villageId = "";
          }
     }
     if (!parentparams.deliveryAddressId) {
          setMessage({
               type: 'warning',
               msg: '请先设置收货地址!'
          });
          return false;
     }
     // 加载loading
     var that = $(this);
     that.children('img').show();
     console.log(parentparams)
     ajax({
          methods: 'post',
          url: 'order-api-impl/order/submitOrderinfo',
          data: parentparams,
          success: function (response) {
               var data = response.data ? response.data : [];
               if (response.code == 200) {
                    if (data.length) {
                         var orderInfo = []; //订单信息
                         for (var i = 0; i < data.length; i++) {
                              orderInfo.push({
                                   'orderId': data[i].id, //订单id
                                   'orderPayMoney': data[i].orderMoney + data[i].shippingFee //订单支付金额
                              })
                         }
                         // setMessage({
                         //      type: 'warning',
                         //      msg: '订单提交成功！请去小程序支付！'
                         // });
                         window.location.href = './payment.html?orderinfo=' + JSON.stringify(orderInfo);
                    }
               } else {
                    setMessage({
                         type: 'warning',
                         msg: response.msg
                    });
               }
               that.children('img').hide();
          },
          error: function (response) {
               that.children('img').hide();
          }
     })
})


/**
 *  获取订单信息
 */
function orderInfo() {
     var addressId = getQueryString('addressId');
     var list = getQueryString('list');
     //   console.log(addressId)
     //   console.log(list)
     ajax({
          methods: 'post',
          url: 'product-api-impl/app/confirmGoodsList',
          data: {
               addressId: parentparams.deliveryAddressId || '',
               list: JSON.parse(list),
          },
          success: function (response) {
               if (response.code == 200) {
                    var data = response.data.supplierList ? response.data.supplierList : [];
                    totalMoney = response.data.totalMoney ? response.data.totalMoney : [];
                    var total = response.data.total ? response.data.total : [];
                    if (data.length) {
                         // 确认订单信息
                         var dom = '';
                         parentparams.orderInfo.length = 0; //清空订单避免更新订单重复添加
                         for (var i = 0; i < data.length; i++) {
                              parentparams.orderInfo.push({ //订单集合
                                   goods: [],
                                   storeSupplierId: data[i].storeSupplierId, //供应商id
                                   remark: "", //备注
                                   villageId: ""
                              });

                              dom += ' <li>';
                              dom += '<div class="store">';
                              dom += '<img src="./images/shop_icon.png" alt="">';
                              dom += '<span>' + data[i].storeSupplierName + '</span>';
                              dom += '</div>';
                              for (var j = 0; j < data[i].shipWayList.length; j++) {
                                   for (var k = 0; k < data[i].shipWayList[j].goodsList.length; k++) {
                                        dom += '<div class="top">';
                                        dom += '<img class="fl" src="' + data[i].shipWayList[j].goodsList[k].imageAddress + '" alt="">';
                                        dom += '<div class="fl">';
                                        dom += '<p>' + data[i].shipWayList[j].goodsList[k].name + '</p>';
                                        dom += '<p>¥ <span>' + data[i].shipWayList[j].goodsList[k].actualPrice + '</span></p>';
                                        //dom += '<p>参数：净含量 <span>' + data[i].shipWayList[j].goodsList[k].weight + '</span></p>';
                                        dom += '<p>数量：<span>' + data[i].shipWayList[j].goodsList[k].num + '</span></p>';
                                        dom += '<p>'
                                        var dd = data[i].shipWayList[j].goodsList[k].goodsSpecificationList
                                        for (var b = 0; b < dd.length; b++) {
                                             dom += '<span>' + dd[b].categoryName + ' : ' + dd[b].name + '</span>&nbsp;&nbsp;'
                                        }
                                        dom += '</p>';
                                        dom += '</div>';
                                        dom += '</div>';
                                        if (parentparams.orderInfo[i] && Array.isArray(parentparams.orderInfo[i].goods)) {
                                             parentparams.orderInfo[i].goods.push({
                                                  goodsId: data[i].shipWayList[j].goodsList[k].id,
                                                  goodsNum: data[i].shipWayList[j].goodsList[k].num,
                                                  price: data[i].shipWayList[j].goodsList[k].actualPrice,
                                                  goodsInventoryId: data[i].shipWayList[j].goodsList[k].goodsInventoryId,
                                             })
                                        }
                                   }
                                   dom += '<div class="bottom">';
                                   dom += '<span class="fl">备注:</span>';
                                   dom += '<textarea class="jsremark fl" value="" placeholder="请输入（100字）" maxlength="100" onkeydown="inputMaxLength(this, 100)"></textarea>';
                                   dom += '<p class="fl">';
                                   dom += ' <span>运费：¥ ' + data[i].shipWayList[j].fee + '</span>';
                                   dom += ' <span class="fl">总合计</span><a href="javascript:;" class="fl">¥ ' + data[i].totalMoney + '</a>';
                                   dom += '</p>';
                                   dom += '</div>';
                              }
                              dom += '<div class="invoice">';
                              dom += '<p class="checkbox noSelect"><label><i class="icon"></i><input type="checkbox"> 开具发票</label>'
                              dom += '<span>创建新抬头</span>'
                              dom += '</p>';
                              dom += '<ul>';
                              for (var b = 0; b < invoiceshu.length; b++) {
                                   dom += '<li><input type="radio" ida="' + invoiceshu[b].id + '" name="tacitlyApprove' + data[i].storeSupplierId + '" value="' + invoiceshu[b].tacitlyApprove + '" />&nbsp;&nbsp;&nbsp;&nbsp;<span>' + invoiceshu[b].content + ''
                                   if (invoiceshu[b].invoiceType == 1 && invoiceshu[b].titleTypes == 1) {
                                        if (invoiceshu[b].tacitlyApprove == 1) {
                                             dom += '&nbsp;&nbsp;(普通)&nbsp;(个人发票)</span><a>默认</a><b onclick="dels(' + invoiceshu[b].id + ')">删除</b><b onclick="invoicedeit(' + invoiceshu[b].id + ')">修改</b></li>';
                                        } else {
                                             dom += '&nbsp;&nbsp;(普通)&nbsp;(个人发票)</span><b onclick="dels(' + invoiceshu[b].id + ')">删除</b><b onclick="invoicedeit(' + invoiceshu[b].id + ')">修改</b></li>';
                                        }
                                   } else if (invoiceshu[b].invoiceType == 1 && invoiceshu[b].titleTypes == 2) {
                                        if (invoiceshu[b].tacitlyApprove == 1) {
                                             dom += '&nbsp;&nbsp;(普通)&nbsp;(企业发票)</span><a>默认</a><b onclick="dels(' + invoiceshu[b].id + ')">删除</b><b onclick="invoicedeit(' + invoiceshu[b].id + ')">修改</b></li>';
                                        } else {
                                             dom += '&nbsp;&nbsp;(普通)&nbsp;(企业发票)</span><b onclick="dels(' + invoiceshu[b].id + ')">删除</b><b onclick="invoicedeit(' + invoiceshu[b].id + ')">修改</b></li>';
                                        }
                                   } else if (invoiceshu[b].invoiceType == 2 && invoiceshu[b].titleTypes == 1) {
                                        if (invoiceshu[b].tacitlyApprove == 1) {
                                             dom += '&nbsp;&nbsp;(增值税)&nbsp;(个人发票)</span><a>默认</a><b onclick="dels(' + invoiceshu[b].id + ')">删除</b><b onclick="invoicedeit(' + invoiceshu[b].id + ')">修改</b></li>';
                                        } else {
                                             dom += '&nbsp;&nbsp;(增值税)&nbsp;(个人发票)</span><b onclick="dels(' + invoiceshu[b].id + ')">删除</b><b onclick="invoicedeit(' + invoiceshu[b].id + ')">修改</b></li>';
                                        }
                                   } else if (invoiceshu[b].invoiceType == 2 && invoiceshu[b].titleTypes == 2) {
                                        if (invoiceshu[b].tacitlyApprove == 1) {
                                             dom += '&nbsp;&nbsp;(增值税)&nbsp;(企业发票)</span><a>默认</a><b onclick="dels(' + invoiceshu[b].id + ')">删除</b><b onclick="invoicedeit(' + invoiceshu[b].id + ')">修改</b></li>';
                                        } else {
                                             dom += '&nbsp;&nbsp;(增值税)&nbsp;(企业发票)</span><b onclick="dels(' + invoiceshu[b].id + ')">删除</b><b onclick="invoicedeit(' + invoiceshu[b].id + ')">修改</b></li>';
                                        }
                                   }
                              }
                              //                            dom += '<li><span>发票类型：</span>';
                              //                            dom += '<select class="invoiceType">';
                              //                            dom += '<option value="1">普通发票</option>';
                              //                            dom += '<option value="2">增值税专用发票</option>';
                              //                            dom += '</select>';
                              //                            dom += '</li>';
                              //                            dom += '<li class="invoiceTitle"><span>抬头类型：</span>';
                              //                            dom += '<select class="invoiceTitle">';
                              //                            dom += '<option value="1">个人</option>';
                              //                            dom += '<option value="2">企业</option>';
                              //                            dom += '</select>';
                              //                            dom += '</li>';
                              //                            dom += '<li class="invoiceTitleNum"><span>发票抬头：</span><input value="" /></li>';
                              //                            dom += '<li class="invoice3"><span>纳税人识别号：</span><input value="" /></li>';
                              //                            dom += '<li class="invoice3"><span>注册地址：</span><input value="" /></li>';
                              //                            dom += '<li class="invoice3"><span>注册电话：</span><input value="" /></li>';
                              //                            dom += '<li class="invoice3"><span>开户银行：</span><input value="" /></li>';
                              //                            dom += '<li class="invoice3"><span>银行账户：</span><input value="" /></li>';
                              dom += '</ul>';
                              dom += '</div>';
                              dom += '<div class="village clearfix"><p class="name">合作店铺(' + data[i].storeSupplierName + ')';
                              if (data[i].chooseVillage) {
                                   dom += '<div><span class="fl">店铺:</span><div class="fl"></div></div>';
                              }
                         }
                         $('.orderInformation ul').html(dom);
                         // 确认付款信息
                         $('.orderInformation .order-item li .invoice ul input:radio[value=1]').attr('checked', 'true')
                         $('.paymentInformation .totalMoney').html('￥ ' + totalMoney);
                         $('.paymentInformation .total').html(total);
                         // 帮扶村地址五级联动
                         getBfcAddress(0);

                    }
               } else {
                    setMessage({
                         type: 'warning',
                         msg: response.msg
                    });
               }
          },
          error: function (response) {}
     })
}
/**
 * 帮扶地址专用接口
 */
function getBfcAddress(parentId) {
     ajax({
          methods: 'post',
          url: 'member-api-impl/address/getWhetherHelpvillage',
          data: {
               parentId: parentId
          },
          success: function (response) {
               var data = response.data ? response.data : [];
               if (response.code == 200) {
                    if (data.length) {
                         var dom = '<select class="fl">';
                         dom += '<option value="">请选择</option>'
                         for (var i = 0; i < data.length; i++) {
                              dom += '<option value="' + data[i].id + '">' + data[i].provinceName + '</option>'
                         }
                         dom += '</select>';

                         if (parentId == 0) {
                              $('.village div.fl').empty().append(dom);
                         } else {
                              $('.village div.fl').append(dom);
                         }
                    }
               } else {
                    setMessage({
                         type: 'warning',
                         msg: response.msg
                    });
               }

          },
          error: function (response) {}
     })
}

/**
 * 请求地址列表数据
 */
function getList() {
     ajax({
          methods: 'POST',
          url: 'member-api-impl/user/deliveryAddressList',
          data: {},
          success: function (response) {
               if (response.code == 200) {
                    var data = response.data ? response.data : {};
                    var listDom = '';
                    for (var i = 0; i < data.length; i++) {
                         listDom += '<li id="' + data[i].id + '">';
                         if (data[i].isDefault) {
                              listDom += '<span class="fl selected"></span>';
                              listDom += '<p class="fl">';
                              listDom += '<span>' + data[i].name + '</span><span>' + data[i].addressDetail + '</span><span>' + data[i].phone + '</span>';
                              listDom += '<span>默认地址</span>';
                              listDom += '</p>';
                              listDom += '<a class="edit-address selected fr" href="javascript:;">修改地址</a>';
                              listDom += '</li>';
                              // currSelectedIndex = data[i].id
                         } else {
                              listDom += '<span class="fl noSelect"></span>';
                              listDom += '<p class="fl">';
                              listDom += '<span>' + data[i].name + '</span><span>' + data[i].addressDetail + '</span><span>' + data[i].phone + '</span>';
                              listDom += '</p>';
                              listDom += '<a class="edit-address fr" href="javascript:;">修改地址</a>';
                              listDom += '</li>';
                         }
                    }
                    $('.adress ul').empty().append(listDom);
                    parentparams.deliveryAddressId = $('.adress .selected').parent().attr('id');

               } else {
                    setMessage({
                         type: 'warning',
                         msg: response.msg
                    });
               }
          },
          error: function (response) {}
     })
}
/**
 * 收货地址联动
 */
function getAddress(parentId, domname) {
     ajax({
          methods: 'post',
          url: 'member-api-impl/address/selByParentId',
          data: {
               parentId: parentId
          },
          success: function (response) {
               var data = response.data ? response.data : [];
               if (response.code == 200) {
                    // console.log(data);
                    if (data.length) {
                         var dom = '<select class="fl">';
                         dom += '<option value="">请选择</option>'
                         for (var i = 0; i < data.length; i++) {
                              dom += '<option value="' + data[i].id + '">' + data[i].provinceName + '</option>'
                         }
                         dom += '</select>';

                         if (domname == '#alertForm #select_data') {
                              if (parentId == 0) {
                                   $(domname).empty();
                                   var newadddom = '';
                                   newadddom += '<li class="fl">';
                                   newadddom += ' <div class="verification-el-input">';
                                   newadddom += dom;
                                   newadddom += ' </div>';
                                   newadddom += ' </li>';

                                   $(domname).html(newadddom);
                              } else {
                                   $(domname).append(dom);
                              }
                         } else if (domname == '#select_data') {
                              var newadddom = '';
                              newadddom += '<li class="fl">';
                              newadddom += ' <div class="verification-el-input">';
                              newadddom += dom;
                              newadddom += ' </div>';
                              newadddom += ' </li>';

                              $(domname).append(newadddom);

                         }
                    }
               } else {
                    setMessage({
                         type: 'warning',
                         msg: response.msg
                    });
               }

          },
          error: function (response) {}
     })
}

function newAddress(obj, number) {
     ajax({
          url: 'member-api-impl/address/selByParentId',
          methods: 'post',
          data: {
               parentId: number == 0 ? 0 : obj.code
          },
          async: false,
          success: function (response) {
               if (response.code == 200) {
                    var data = response.data ? response.data : [];
                    if (data.length > 0) {
                         var dom = '';
                         dom += '<li class="fl">';
                         dom += ' <div class="verification-el-input">';
                         dom += ' <select name="addressList" id="" class="verification-input" requir="true" msg="请选择">'
                         dom += '<option value="">请选择</option>';
                         for (var i = 0; i < data.length; i++) {
                              dom += '<option value="' + data[i].id + '">' + data[i].provinceName + '</option>';

                         }
                         dom += '</select>';
                         dom += '</div>'
                         dom += '</li>';
                         $('#select_data').append(dom);
                    }

                    if (number < addAddress.length) {
                         newAddress(addAddress[number++], number++)
                    } else {
                         for (var i = 0; i < addAddress.length; i++) {
                              $('#select_data select').eq(i).val(addAddress[i].code)
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
// 创建新地址-打开弹窗
function addNewAddress() {
     $('.alertForm .title').html('新增地址' + '<img src="./images/delete.png" alt="" onClick="CloseAlert()">')
     $('.alertForm').show();
     isAddressType = 'add'
     $('#alertForm input[name="name"]').val('');
     $('#alertForm input[name="phone"]').val('');
     getAddress(0, '#alertForm #select_data');
     $('#alertForm input[name="addressSupple"]').val('');

}
// 关闭弹窗
function CloseAlert() {
     $('.alertForm').hide();
}
// 检验必传显示*号 同时初始化 lable位置
verification_required('#alertForm');
// form_submit('#alertForm'); //初始化
$('#alertForm .submit').click(function () {
     var username = $('#alertForm input[name="name"]').val(); //收货人姓名
     var userTel = $('#alertForm input[name="phone"]').val(); //电话号码
     var addressSupple = $('#alertForm input[name="addressSupple"]').val(); //详细地址
     var selectNum = $('#alertForm #select_data').children();
     var addressList = [];
     $('#alertForm li select').each(function () {
          var addrVal = $(this).val()
          if (addrVal !== "") {
               addressList.push(addrVal);
          }
     })
     if (!username.trim()) {
          setMessage({
               type: 'warning',
               msg: '请填写收货人姓名'
          })
          return false;
     }
     if (!userTel.trim()) {
          setMessage({
               type: 'warning',
               msg: '请填写收货人手机号'
          })
          return false;
     }
     if (selectNum.length !== addressList.length) {
          setMessage({
               type: 'warning',
               msg: '请选择收获地址'
          })
          return false;
     }
     if (!addressSupple.trim()) {
          setMessage({
               type: 'warning',
               msg: '请填写详细地址'
          })
          return false;
     }
     if (!validate.validatPhone($(' input[name="phone"]').val())) {
          setMessage({
               type: 'warning',
               msg: '手机号码格式不正确'
          })
          return false;
     }


     var obj = {
          name: username,
          phone: userTel,
          addressList: addressList, //地址
          addressSupple: addressSupple,
          isDefault: 0,
          zoneId: addressList[addressList.length - 1]
     }
     if (isAddressType != 'add') {
          obj.id = isAddressType;
          // 修改地址
          ajax({
               url: 'member-api-impl/user/updAddress',
               methods: 'post',
               data: obj,
               success: function (response) {
                    var data = response.data ? response.data : {};
                    if (response.code == 200) {
                         setMessage({
                              type: 'success',
                              msg: response.msg
                         });
                         var updAddDom = '<p class="fl"><span>' + data.name + '</span><span>' + data.addressDetail + '</span><span>' + data.phone + '</span></p>'
                         $('.adress ul').find('#' + data.id + '>p').html(updAddDom);
                         //订单信息  选择地址更新运费
                         orderInfo();
                         $('.alertForm').hide();
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

     } else {
          // 新增地址
          ajax({
               url: 'member-api-impl/user/addAddress',
               methods: 'post',
               data: obj,
               success: function (response) {
                    var data = response.data ? response.data : {};
                    if (response.code == 200) {
                         setMessage({
                              type: 'success',
                              msg: response.msg
                         })
                         getList(); //更新列表
                         //订单信息  选择地址更新运费
                         orderInfo();
                         $('.alertForm').hide();

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
})
//验证手机号码
$('#alertForm input[name="phone"]').on('change', function () {
     if (!$(' input[name="phone"]').val()) {
          setMessage({
               type: 'warning',
               msg: '手机号码不能为空'
          })
     }
     if (!validate.validatPhone($(' input[name="phone"]').val())) {
          setMessage({
               type: 'warning',
               msg: '手机号码格式不正确'
          })
     }
})