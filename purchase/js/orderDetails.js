/*
 * @Author: liwanli
 * @Date: 2019-05-29 16:52:45
 * @Last Modified by: liwanli
 * @Last Modified time: 2019-07-05 18:19:33
 * 订单详情 Js 文件  orderDetails.js
 */

init();

function init() {
    var id = getQueryString('id');
    //渲染公共顶部
    shopHeaderTop('#header-top');
    //渲染公共头部
    shopHeader('#s-header');
    // 头部状态进度显示
    $('#header-wapper').find('.prog-item').eq(0).children('.prog-text').text('待买家付款');
    $('#header-wapper').find('.prog-item').eq(1).children('.prog-text').text('待卖家发货');
    $('#header-wapper').find('.prog-item').eq(2).children('.prog-text').text('待买家收货');
    $('#header-wapper').find('.prog-item').eq(3).children('.prog-text').text('待买家评论');
    orderdetail(id)
}
var orderData; //订单数据
/**
 * 订单详情信息
 * @param {订单id} id 
 */
var orderData = {};

function orderdetail(id) {
    ajax({
        url: 'order-api-impl/order/getOrderinfoView?id=' + id,
        methods: 'post',
        data: {},
        success: function (response) {
            if (response.code == 200) {
                var data = orderData = response.data ? response.data : [];
                orderData = data;
                //订单信息 
                var orderInfoDOM = '<div class="shopList">';
                orderInfoDOM += '<div class="shopList-info">';
                orderInfoDOM += '<div class="top">';

                orderInfoDOM += '<div class="shoptit">' + data.storeSupplierName + '</div>';
                orderInfoDOM += '<p class="current-time">创建时间：<span id="currTime">' + data.createTime + '</span></p>';
                orderInfoDOM += '<p class="orderId">订单号：<span id="orderNum">' + data.orderNumber + '</span></p></div>';
                orderInfoDOM += '<div class="order-list">';

                for (var i = 0; i < data.listDetail.length; i++) {
                    orderInfoDOM += '<div class="details">';
                    orderInfoDOM += '<div class="details-left fl">';
                    orderInfoDOM += '<img src="' + data.listDetail[i].goodsImage + '" width="100%" alt="">';
                    orderInfoDOM += '</div>';
                    orderInfoDOM += '<div class="details-right fl">';
                    orderInfoDOM += '';
                    orderInfoDOM += '<div class="drinfo"><h3 class="title">' + data.listDetail[i].goodsName + '</h3>';
                    orderInfoDOM += '<div class="params">'
                    //                  orderInfoDOM += '参数：<span>净含量 ' + data.listDetail[i].weight + '</span>'
                    var dd = data.listDetail[i].specifValueJson
                    for (var b = 0; b < dd.length; b++) {
                        for (var filed in dd[b]) {
                            orderInfoDOM += '<span>' + filed + '：' + dd[b][filed] + '</span>&nbsp;&nbsp;'
                        }
                    }


                    orderInfoDOM += '</div></div>';
                    orderInfoDOM += '<div class="drinfo"><p class="money">单价&nbsp;&nbsp;¥ ' + data.listDetail[i].goodsMoney + '</p>';
                    orderInfoDOM += '<p class="num">数量&nbsp;&nbsp;<span>' + data.listDetail[i].goodsNum + '</span></p></div>';
                    // orderInfoDOM += '<div class="adr">';
                    // orderInfoDOM += '<div class="adr-l">配送：<span>' + data.listDetail[i].goodsAddress + ' 至 ' + data.receiveAddress + '</span></div>';
                    orderInfoDOM += '</div>';
                    orderInfoDOM += '</div>';
                }
                orderInfoDOM += '</div>';
                orderInfoDOM += '<div class="btom clearfix">';
                if (data.remark) {
                    orderInfoDOM += '<div class="remarks fl">备注：';
                    orderInfoDOM += '<textarea disabled="disabled">' + data.remark + '</textarea>';
                    orderInfoDOM += '</div>';
                } else {
                    orderInfoDOM += '<div class="remarks fl">备注：无</div>';
                }


                orderInfoDOM += '<div class="botm-r fr"><div class="adr-r">运费：<span>¥' + (data.shippingFee).toFixed(2) + '</span></div><div class="total">总合计:<span>¥' + (data.shippingFee + data.orderMoney).toFixed(2) + '</span></div></div>';
                orderInfoDOM += '</div>'

                if (data.invoiceStatus != 0) {
                    orderInfoDOM += '<div class="invoicefa" id="invoicefa">';
                    orderInfoDOM += '<ul>'
                    if (data.invoiceAndTitleInfo.invoiceType == 1) {
                        orderInfoDOM += '<li><span>发票类型：</span>普通发票</li>'
                    } else {
                        orderInfoDOM += '<li><span>发票类型：</span>增值税专用发票</li>'
                    }
                    if (data.invoiceAndTitleInfo.titleTypes == 1) {
                        orderInfoDOM += '<li><span>抬头类型：</span>个人</li>'
                    } else {
                        orderInfoDOM += '<li><span>抬头类型：</span>企业</li>'
                    }
                    if (data.invoiceAndTitleInfo.titleContent == '') {
                        orderInfoDOM += '<li><span>发票抬头：</span>用户未填写信息</li>'
                    } else {
                        orderInfoDOM += '<li><span>发票抬头：</span>' + data.invoiceAndTitleInfo.titleContent + '</li>'
                    }

                    if (data.invoiceAndTitleInfo.invoiceType != 1) {
                        if (data.invoiceAndTitleInfo.taxNumber == '') {
                            orderInfoDOM += '<li><span>纳税人识别号：</span>用户未填写信息</li>'
                        } else {
                            orderInfoDOM += '<li><span>纳税人识别号：</span>' + data.invoiceAndTitleInfo.taxNumber + '</li>'
                        }
                        if (data.invoiceAndTitleInfo.enterpriseAddress == '') {
                            orderInfoDOM += '<li><span>注册地址：</span>用户未填写信息</li>'
                        } else {
                            orderInfoDOM += '<li><span>注册地址：</span>' + data.invoiceAndTitleInfo.enterpriseAddress + '</li>'
                        }

                        if (data.invoiceAndTitleInfo.enterprisePhone == '') {
                            orderInfoDOM += '<li><span>注册电话：</span>用户未填写信息</li>'
                        } else {
                            orderInfoDOM += '<li><span>注册电话：</span>' + data.invoiceAndTitleInfo.enterprisePhone + '</li>'
                        }

                        if (data.invoiceAndTitleInfo.bankDeposit == '') {
                            orderInfoDOM += '<li><span>开户银行：</span>用户未填写信息</li>'
                        } else {
                            orderInfoDOM += '<li><span>开户银行：</span>' + data.invoiceAndTitleInfo.bankDeposit + '</li>'
                        }
                        if (data.invoiceAndTitleInfo.bankAccount == '') {
                            orderInfoDOM += '<li><span>银行账户：</span>用户未填写信息</li>'
                        } else {
                            orderInfoDOM += '<li><span>银行账户：</span>' + data.invoiceAndTitleInfo.bankAccount + '</li>'
                        }
                    }
                    orderInfoDOM += '</ul>'
                    orderInfoDOM += '</div>';
                }


                orderInfoDOM += '</div>';
                orderInfoDOM += '<div class="mode" id="orderMode">';
                orderInfoDOM += '<h3 class="title">合作店铺<span>&nbsp;|&nbsp;</span></h3>';
                orderInfoDOM += '<div class="inner">';
                orderInfoDOM += '<span>合作店铺：</span>';
                orderInfoDOM += '<p></p>';
                orderInfoDOM += '</div>';
                orderInfoDOM += '</div>';
                $('#orderInfo').find('.orderInfo-main').html(orderInfoDOM);
                // 合作店铺
                if (data.villageName) {
                    $('#orderMode .title span').html('&nbsp;|&nbsp;' + data.storeSupplierName);
                    $('#orderMode .inner p').text(data.villageName);
                } else {
                    $('#orderMode .title span').html('&nbsp;|&nbsp;' + data.storeSupplierName);
                    $('#orderMode .inner').hide();
                }
                // $('.status #replay .editaddre a').attr('id', data.deliveryAddressId)
                //物流信息
                $('.logistics .company span').text(data.materialCompany || '暂无物流公司信息');
                $('.logistics .Waybill-no span').text(data.expressTicket || '暂无运单号码');
                $('.logistics .logistics-info .date').text(data.updateTime);
                //              $('.logistics .logistics-info .time').text('00:00:00');
                $('.logistics .logistics-info .time').next('p').text(data.expressLastInfo);
                $('.logistics').hide();

                //付款信息 
                var replayInfo = $('#replayInfo');
                replayInfo.find('.orderMoney').text(' ¥' + (data.orderMoney + data.shippingFee));
                replayInfo.find('.receiveAddress').text(data.receiveAddress);
                replayInfo.find('.consigneeName').text(data.consigneeName);
                replayInfo.find('.consigneePhone').text(data.consigneePhone);
                // status  -1已取消, 0待付款,1待发货,2待收货,3已签收,4待评价,5已完成 6换货 7退货 ,
                // 当前订单状态
                $('#orderDetails .status .inner').hide(); //所有状态隐藏
                switch (data.status) {
                    case -1:
                        $('#orderStatus').text('已取消');
                        break;
                    case 0:
                        $('#header-wapper').find('.prog-item').eq(0).addClass('prog');
                        $('#orderStatus').text('待付款');
                        $('#orderDetails .status .inner#replay').show();
                        //倒计时
                        downTime(data);
                        break;
                    case 1:
                        $('#orderStatus').text('待发货');
                        $('#header-wapper').find('.prog-item').eq(0).addClass('finish');
                        $('#header-wapper').find('.prog-item').eq(1).addClass('prog');
                        $('#orderDetails .status .inner#hair').show()
                        if (data.isSeller) {
                            if (data.canHandle) {
                                $('#orderDetails .status .inner#hair').find('.seller').show()
                            }
                        } else {
                            $('#orderDetails .status .inner#hair').find('.noseller').show()
                        }
                        break;
                    case 2:
                        if (data.deliveryType === 2 || data.deliveryType === 3){
                         $('#orderDetails .status .inner#Receivingsigning').show();
                       } 
                        $('#orderStatus').text('待收货');
                        $('#header-wapper').find('.prog-item').eq(0).addClass('finish');
                        $('#header-wapper').find('.prog-item').eq(1).addClass('finish');
                        $('#header-wapper').find('.prog-item').eq(2).addClass('prog');
                        $('#Receivingsigning').find('#surplusTime').text(data.remainderDays + '天');
                        // $('#orderDetails .status .inner#Receivingsigning').show();
                        if (data.isSeller) {
                            $('#orderDetails .status .inner#Receivingsigning').find('.seller').show()
                        } else {
                            $('#orderDetails .status .inner#Receivingsigning').find('.noseller').show()
                        }
                        // console.log(data.enableReturn) 是否支持退换
                        if (!data.enableReturn) {
                            $('.aftermarket').hide()
                        }
                        // 显示物流
                        $('.logistics').show();
                        if (!data.expressTicket) {
                            $('.logistics .logistics-info').hide();
                        }
                        break;
                    case 3:
                        $('#orderStatus').text('已签收');
                        $('#header-wapper').find('.prog-item').eq(0).addClass('finish');
                        $('#header-wapper').find('.prog-item').eq(1).addClass('finish');
                        $('#header-wapper').find('.prog-item').eq(2).addClass('prog');
                        $('#Receivingsigning').find('#surplusTime').text(data.remainderDays + '天');
                        $('#orderDetails .status .inner#Receivingsigning').show();
                        if (data.isSeller) {
                            $('#orderDetails .status .inner#Receivingsigning').find('.seller').show()
                        } else {
                            $('#orderDetails .status .inner#Receivingsigning').find('.noseller').show()
                        }
                        // 显示物流
                        $('.logistics').show();
                        if (!data.expressTicket) {
                            $('.logistics .logistics-info').hide();
                        }
                        break;
                    case 4:
                        $('#orderStatus').text('待评价');
                        $('#header-wapper').find('.prog-item').eq(0).addClass('finish');
                        $('#header-wapper').find('.prog-item').eq(1).addClass('finish');
                        $('#header-wapper').find('.prog-item').eq(2).addClass('finish');
                        $('#header-wapper').find('.prog-item').eq(3).addClass('prog');
                        $('#orderDetails .status .inner#evaluate').show();
                        if (data.isSeller) {
                            $('#orderDetails .status .inner#evaluate').find('.seller').show()
                        } else {
                            $('#orderDetails .status .inner#evaluate').find('.noseller').show()
                        }
                        // 显示物流
                        $('.logistics').show();
                        if (!data.expressTicket) {
                            $('.logistics .logistics-info').hide();
                        }
                        break;
                    case 5:
                        $('#orderStatus').text('已完成');
                        $('#header-wapper').find('.prog-item').eq(0).addClass('finish');
                        $('#header-wapper').find('.prog-item').eq(1).addClass('finish');
                        $('#header-wapper').find('.prog-item').eq(2).addClass('finish');
                        $('#header-wapper').find('.prog-item').eq(3).addClass('finish');
                        $('#orderDetails .status .inner#orderOk').show();
                        if (data.isSeller) {
                            $('#orderDetails .status .inner#orderOk').find('.seller').show()
                        } else {
                            $('#orderDetails .status .inner#orderOk').find('.noseller').show()
                        }

                        // 显示物流
                        $('.logistics').show();
                        if (!data.expressTicket) {
                            $('.logistics .logistics-info').hide();
                        }
                        break;
                    case 6:
                        // 0不换货 1待换货 2已同意,换货中 3已换货  ,
                        var exchangeStatus = '';
                        switch (data.orderReturnPO.exchangeStatus) {
                            case -1:
                                exchangeStatus = '不同意';
                                break;
                            case 0:
                                exchangeStatus = '同意换货';
                                break;
                            case 1:
                                exchangeStatus = '待换货';
                                $('#header-wapper').find('.prog-item').eq(0).addClass('finish').children('.prog-text').text('申请换货');
                                $('#header-wapper').find('.prog-item').eq(1).addClass('prog').children('.prog-text').text('待换货');
                                $('#header-wapper').find('.prog-item').eq(2).children('.prog-text').text('换货中');
                                $('#header-wapper').find('.prog-item').eq(3).children('.prog-text').text('已换货');
                                break;
                            case 2:
                                exchangeStatus = '换货中';
                                $('#header-wapper').find('.prog-item').eq(0).addClass('finish').children('.prog-text').text('申请换货');
                                $('#header-wapper').find('.prog-item').eq(1).addClass('finish').children('.prog-text').text('待换货');
                                $('#header-wapper').find('.prog-item').eq(2).addClass('prog').children('.prog-text').text('换货中');
                                $('#header-wapper').find('.prog-item').eq(3).children('.prog-text').text('已换货');
                                break;
                            case 3:
                                exchangeStatus = '已换货,待评价';
                                $('#header-wapper').find('.prog-item').eq(0).addClass('finish').children('.prog-text').text('申请换货');
                                $('#header-wapper').find('.prog-item').eq(1).addClass('finish').children('.prog-text').text('待换货');
                                $('#header-wapper').find('.prog-item').eq(2).addClass('finish').children('.prog-text').text('换货中');
                                $('#header-wapper').find('.prog-item').eq(3).addClass('prog').children('.prog-text').text('已换货');
                                break;
                            case 4:
                                exchangeStatus = '交易成功';
                                break;

                        }
                        $('#orderStatus').text(exchangeStatus);
                        $('#orderDetails .status .inner#change').show();
                        $('#change #surplusTime').text(data.remainderDays + '天');
                        $('#change .applyTime').html('换货申请时间：<span>' + data.orderReturnPO.applyTime + '</span>');

                        break;
                    case 7:
                        // 0不退款 1待退款 2已同意,退货中 3已退款
                        var refundStatus = '';
                        switch (data.orderReturnPO.backStatus) {
                            case -1:
                                refundStatus = '不同意';
                                break;
                            case 0:
                                refundStatus = '不退款';
                                break;
                            case 1:
                                refundStatus = '待退款';
                                $('#header-wapper').find('.prog-item').eq(0).addClass('finish').children('.prog-text').text('申请退款');
                                $('#header-wapper').find('.prog-item').eq(1).addClass('prog').children('.prog-text').text('待退款');
                                $('#header-wapper').find('.prog-item').eq(2).children('.prog-text').text('退款中');
                                $('#header-wapper').find('.prog-item').eq(3).children('.prog-text').text('已退款');
                                break;
                            case 2:
                                refundStatus = '退款中';
                                $('#header-wapper').find('.prog-item').eq(0).addClass('finish').children('.prog-text').text('申请退款');
                                $('#header-wapper').find('.prog-item').eq(1).addClass('finish').children('.prog-text').text('待退款');
                                $('#header-wapper').find('.prog-item').eq(2).addClass('prog').children('.prog-text').text('退款中');
                                $('#header-wapper').find('.prog-item').eq(3).children('.prog-text').text('已退款');
                                break;
                            case 3:
                                refundStatus = '已退款';
                                $('#header-wapper').find('.prog-item').eq(0).addClass('finish').children('.prog-text').text('申请退款');
                                $('#header-wapper').find('.prog-item').eq(1).addClass('finish').children('.prog-text').text('待退款');
                                $('#header-wapper').find('.prog-item').eq(2).addClass('finish').children('.prog-text').text('退款中');
                                $('#header-wapper').find('.prog-item').eq(3).addClass('prog').children('.prog-text').text('已退款');
                                break;
                        }
                        $('#orderStatus').text(refundStatus);
                        $('#retreat #surplusTime').text(data.remainderDays + '天');
                        // $('#retreat .applyTime').html('退货申请时间：<span>' + data.orderReturnPO.applyTime + '</span><br>卖家已拒绝退货申请,时间：<span>' + data.orderReturnPO.reviewTime + '</span>');
                        // if (list[i].disputeApplyTime) {
                        //     dom1 += '申请争议退款时间：<span>' + list[i].disputeApplyTime + '</span>'
                        // }
                        $('#retreat .applyTime').html(dom1)
                        $('#orderDetails .status .inner#retreat').show();
                        break;
                    case 10:
                        $('#orderStatus').text('争议订单');
                        var dom2 = "";
                        var list = data.orderReturnList;
                        for (var i = 0; i < data.orderReturnList.length; i++) {
                            dom2 += '退货申请时间：<span>' + list[i].applyTime + '</span>'
                            dom2 += '<br>';
                            if (list[i].reviewTime) {
                                dom2 += '</span>卖家已拒绝退货申请,时间：<span>' + list[i].reviewTime + '</span>'
                                dom2 += '<br>';
                            }
                        }
                        if (data.disputeApplyTime) {
                            dom2 += '申请争议退款时间：<span>' + data.disputeApplyTime + '</span>'
                        }
                        $('#retreat .applyTime').html(dom2)


                        // $('#retreat .forbiden').html('申请争议退款时间：<span>' + data.orderReturnPO.applyTime + '</span>');
                        $('#orderDetails .status .inner#retreat').show();
                        break;
                    default:
                        $('#orderStatus').text('订单数据异常');
                        $('#orderDetails .status .inner').hide();
                }
                if (data.status > 1 && data.status<10) {
                    var dom1 = "";
                    var list = data.orderReturnList;
                    for (var i = 0; i < data.orderReturnList.length; i++) {
                        dom1 += '退货申请时间：<span>' + list[i].applyTime + '</span>'
                        dom1 += '<br>';
                        if (list[i].reviewTime) {
                            dom1 += '</span>卖家已拒绝退货申请,时间：<span>' + list[i].reviewTime + '</span>'
                            dom1 += '<br>';
                        }
                    }
                  $('#retreat').show().children().html(dom1)
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

/**
 * 订单倒计时时间
 */
function downTime(data) {
    if (!data.createTime) return;
    currTime = new Date(data.createTime.replace(/-/g, "/"));
    nowTime = new Date();
    var defaultHours = 6; //定义过期小时
    var totalSeconds = parseInt((nowTime - currTime) / 1000);
    var restTime = defaultHours * (60 * 60) - totalSeconds;

    function dTime() {
        var timeDom = $('#surplusTime');
        var hours = '0';
        var min = '00';
        var sec = '00';
        hours = Math.floor(restTime / (60 * 60));
        min = Math.floor((restTime - hours * 3600) / 60);
        sec = Math.floor(restTime % 60);
        var strTime = reZero(hours) + ":" + reZero(min) + ":" + reZero(sec);
        timeDom.text(strTime)
    }
    if (restTime < 1) {
        $('#orderStatus').text('已取消');
        $('#orderDetails .status .inner').hide();
        return
    } else {
        dTime()
    };
    var timer = setInterval(function () {
        if (restTime < 1) {
            clearInterval(timer);
            $('#orderStatus').text('已取消');
            $('#orderDetails .status .inner').hide();
        }
        restTime--;
        dTime()
    }, 1000);

    function reZero(time) {
        return time < 10 ? '0' + time : time
    }
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
//立即支付
$('#replay').find('.ljplay').click(function () {
    var orderinfo = [{
        "orderId": getQueryString('id'),
        "orderPayMoney": (orderData.shippingFee + orderData.orderMoney)
    }]
    window.location.href = "../purchase/payment.html?orderinfo=" + JSON.stringify(orderinfo);
})
//取消订单
$('#replay').find('.cancel').click(function () {
    var id = getQueryString('id');
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
            // $('#orderDetails .status .inner').hide();
        },
        cath: function () {
            console.log('取消')
        }
    });
})
//确认收货和延长收货
$('#Receivingsigning').on('click', 'a.noseller', function () {
    var id = getQueryString('id');
    var url = '',
        text = '',
        title = '',
        data = {};
    if ($(this).attr('id').indexOf('collectShop') != -1) {
        url = 'order-api-impl/orderpay/confirmReceipt';
        text = '确认收货后您的货款将打给卖家，请确认收到货物后操作哦！';
        title = '确认收货';
        data = {
            orderId: id
        };
    } else if ($(this).attr('id').indexOf('extendShop') != -1) {
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
                        window.location.reload()
                    } else {
                        setMessage({
                            type: 'warning',
                            msg: response.msg
                        })
                    }
                    $('.confirmation-common').css('display', 'none');
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
$('#orderOk').on('click', '.againPlay', function () {
    var id = getQueryString('id');
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
// 联系客服
$('#hair,#evaluate,#orderOk').on('click', 'a.im', function () {
    var userInfo = $.cookie('userInfo') ? JSON.parse(JSON.stringify($.cookie('userInfo'))) : {};
    var userInfo = $.cookie('userInfo') ? JSON.parse($.cookie('userInfo')) : {};
    var id = '';
    if (userInfo.id == orderData.userId) {
        id = orderData.storeUserId;
    } else if (userInfo.id == orderData.storeUserId) {
        id = userInfo.id;
    } else {
        setMessage({
            type: 'warning',
            msg: '聊天用户有误'
        });
        return false;
    }
    window.location.href = '../chitchat.html?id=' + id;
})
//退换商品
function refundShop(type) {
    var id = getQueryString('id');
    window.location.href = './shopreplacement.html?id=' + id + '&refundType=' + type;
}
//立即评价
$('#evaluate').on('click', '.pingjia', function () {
    var id = getQueryString('id');
    window.location.href = "../purchase/commentCommodity.html?id=" + id;
})

var type = getQueryString('type') * 1;
// 返回订单列表
$('.backButton').on('click', function () {
    if (type === 3) {
        window.open("../buyerPersonCenter/myOrder.html", '_self')
    } else if (type === 2) {
        window.open("../supplierCenter/transactionManage.html", '_self')
    } else {
        window.open("../sellerCenter/transactionManage.html", '_self')
    }
})