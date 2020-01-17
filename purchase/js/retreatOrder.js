/*
 * @Author: liwanli 
 * @Date: 2019-05-30 17:11:54 
 * @Last Modified by: liwanli
 * @Last Modified time: 2019-07-05 18:12:39
 * 退换商品订单详情 Js 文件 retreatOrder.js
 */
init();

function init() {
    //渲染公共顶部
    shopHeaderTop('#header-top');
    //渲染公共头部
    shopHeader('#s-header');
    var id = getQueryString('id');
    orderdetail(id)
}
var orderData; //订单数据
/**
 * 退换商品订单详情
 * @param {订单id} id 
 */
var orderData = {};

function orderdetail(id) {
    ajax({
        url: 'order-api-impl/orderReturn/getSellerReturnView',
        methods: 'post',
        data: {
            returnId: id
        },
        success: function (response) {
            if (response.code == 200) {
                orderData = response.data ? response.data : [];
                var returnShopList = orderData.listOrderDetailVO || []; //退换货商品列表
                var orderinfo = orderData.orderinfoVO || []; //订单信息
                // 退换货信息
                var orderReturnPODom = '';
                orderReturnPODom += '<div class="shopList">';
                orderReturnPODom += '<div class="shopList-info">';
                orderReturnPODom += '<div class="top">';
                orderReturnPODom += '<div class="shoptit">' + orderinfo.storeSupplierName + '</div>';
                orderReturnPODom += '<p class="orderId">退款/换货编号：<span id="orderNum">' + orderinfo.orderNumber + '</span></p></div>';
                orderReturnPODom += '<div class="order-list">';
                for (var j = 0; j < returnShopList.length; j++) {
                    orderReturnPODom += '<div class="details">';
                    orderReturnPODom += '<div class="details-left fl"><img src="' + returnShopList[j].goodsImage + '" width="100%"></div>';
                    // 商品右侧信息
                    orderReturnPODom += '<div class="details-right fl">';
                    // 商品右左侧信息
                    orderReturnPODom += '<div class="drinfo">';
                    orderReturnPODom += '<h3 class="title">' + returnShopList[j].goodsName + '</h3>';
//                  orderReturnPODom += '<div class="params">参数：<span>净含量 ' + returnShopList[j].weight + '</span></div>';
                    
                    var dd = returnShopList[j].specifValueJson
                    	for (var b = 0; b < dd.length; b++) {
                    		for(var filed in dd[b]){
						        orderReturnPODom += '<span>'+filed+'：'+dd[b][filed]+'</span>&nbsp;&nbsp;'
						    }
                    	}
                    
                    orderReturnPODom += '</div>';
                    
                    // 商品右右侧信息
                    orderReturnPODom += '<div class="drinfo"><p class="money">单价&nbsp;&nbsp;¥ ' + returnShopList[j].goodsMoney + '</p>';
                    orderReturnPODom += '<p class="num">数量&nbsp;&nbsp;<span>' + returnShopList[j].goodsNum + '</span></p></div>';
                    // orderReturnPODom += '<div class="adr">';
                    // orderReturnPODom += '<div class="adr-l">配送：<span>' + returnShopList[j].goodsAddress + ' 至 ' + data.receiveAddress + '</span></div>';
                    orderReturnPODom += '</div>';
                    orderReturnPODom += '</div>';
                }
                orderReturnPODom += '</div>';
                if (orderData.returnType == 1) {
                    $('#retrunInfo .title h3').text('退货信息')
                    orderReturnPODom += ' <ul class="tuikuan">';
                    orderReturnPODom += '<li class="reason">退款原因：<span>' + orderData.reason + '</span></li>';
                    orderReturnPODom += '<li class="money">退款金额：<span>¥ ' + (orderinfo.orderMoney + orderinfo.shippingFee).toFixed(2) + '</span></li>';
                    orderReturnPODom += '<li class="explain">退款说明：<span>' + (orderData.reasonText || '无') + '</span></li>';
                }
                if (orderData.returnType == 2) {
                    $('#retrunInfo .title h3').text('换货信息')
                    orderReturnPODom += ' <ul class="tuikuan">';
                    orderReturnPODom += '<li class="reason">换货原因：<span>' + orderData.reason + '</span></li>';
                    // orderReturnPODom += '<li class="money">换货金额：<span>¥ ' + (orderinfo.orderMoney + orderinfo.shippingFee).toFixed(2) + '</span></li>';
                    orderReturnPODom += '<li class="explain">换货说明：<span>' + (orderData.reasonText || '无') + '</span></li>';
                }
                orderReturnPODom += '<li class="pingz">上传凭证：';
                orderReturnPODom += '<p class="upimg">';
                if (orderData.returnPic != '') {
                    var returnPic = orderData.returnPic.split(',');
                    for (var k = 0; k < returnPic.length; k++) {
                        orderReturnPODom += '<img src="' + returnPic[k] + '" width="144" height="144">';
                    }
                } else {
                    orderReturnPODom += '无';
                }
                orderReturnPODom += '</p>';
                orderReturnPODom += '</li>';
                orderReturnPODom += '</ul>';
                $('#retrunInfo').find('.orderInfo-main').html(orderReturnPODom);
                //订单信息 
                var orderInfoDOM = '<div class="shopList">';
                orderInfoDOM += '<div class="shopList-info">';
                orderInfoDOM += '<div class="top">';
                orderInfoDOM += '<p class="current-time">创建时间：<span id="currTime">' + orderinfo.createTime + '</span></p>';
                orderInfoDOM += '<p class="orderId">订单号：<span id="orderNum">' + orderinfo.orderNumber + '</span></p></div>';
                $('#orderInfo').find('.orderInfo-main').html(orderInfoDOM);

                // status  6换货 7退货 ,
                // 当前订单状态
                if (orderinfo.status == 6 || orderinfo.status == 7) {
                    // 是否卖家
                    if (orderinfo.isSeller) {
                        $('.status .seller').show()
                    } else {
                        $('.status .noseller').show()
                    }

                    if (orderinfo.status == 6) {
                        var exchangeStatus = '';
                        switch (orderData.exchangeStatus) {
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
                                $('#noNumber1').show();
                                break;
                            case 2:
                                exchangeStatus = '换货中';
                                $('#header-wapper').find('.prog-item').eq(0).addClass('finish').children('.prog-text').text('申请换货');
                                $('#header-wapper').find('.prog-item').eq(1).addClass('finish').children('.prog-text').text('待换货');
                                $('#header-wapper').find('.prog-item').eq(2).addClass('prog').children('.prog-text').text('换货中');
                                $('#header-wapper').find('.prog-item').eq(3).children('.prog-text').text('已换货');
                                $('#noNumber2').show();
                                break;
                            case 3:
                                exchangeStatus = '已换货,待评价';
                                $('#header-wapper').find('.prog-item').eq(0).addClass('finish').children('.prog-text').text('申请换货');
                                $('#header-wapper').find('.prog-item').eq(1).addClass('finish').children('.prog-text').text('待换货');
                                $('#header-wapper').find('.prog-item').eq(2).addClass('finish').children('.prog-text').text('换货中');
                                $('#header-wapper').find('.prog-item').eq(3).addClass('prog').children('.prog-text').text('已换货');
                                $('#noNumber3').show();
                                break;
                        }
                        $('#orderStatus').text(exchangeStatus);
                        $('#noNumber1 #surplusTime').text(orderData.remainderDays + '天');
                        $('#noNumber1 .applyTime').html('换货申请时间：<span>' + orderData.applyTime + '</span>');
                    }
                    if (orderinfo.status == 7) {
                        var backStatus = '';
                        switch (orderData.backStatus) {
                            case -1:
                                backStatus = '不同意';
                                break;
                            case 0:
                                backStatus = '同意退款';
                                break;
                            case 1:
                                backStatus = '待退款';
                                $('#header-wapper').find('.prog-item').eq(0).addClass('finish').children('.prog-text').text('申请退款');
                                $('#header-wapper').find('.prog-item').eq(1).addClass('prog').children('.prog-text').text('待退款');
                                $('#header-wapper').find('.prog-item').eq(2).children('.prog-text').text('退款中');
                                $('#header-wapper').find('.prog-item').eq(3).children('.prog-text').text('已退款');
                                $('#noNumber1').show();
                                $("#noNumber1 .times").html(orderData.applyTime)
                                break;
                            case 2:
                                backStatus = '退款中';
                                $('#header-wapper').find('.prog-item').eq(0).addClass('finish').children('.prog-text').text('申请退款');
                                $('#header-wapper').find('.prog-item').eq(1).addClass('finish').children('.prog-text').text('待退款');
                                $('#header-wapper').find('.prog-item').eq(2).addClass('prog').children('.prog-text').text('退款中');
                                $('#header-wapper').find('.prog-item').eq(3).children('.prog-text').text('已退款');
                                $('#noNumber2').show();
                                $("#noNumber2 .times").html(orderData.applyTime)
                                 $("#noNumber2 .timea").html(orderData.reviewTime) //审核时间
                                break;
                            case 3:
                                backStatus = '已退款';
                                $('#header-wapper').find('.prog-item').eq(0).addClass('finish').children('.prog-text').text('申请退款');
                                $('#header-wapper').find('.prog-item').eq(1).addClass('finish').children('.prog-text').text('待退款');
                                $('#header-wapper').find('.prog-item').eq(2).addClass('finish').children('.prog-text').text('退款中');
                                $('#header-wapper').find('.prog-item').eq(3).addClass('prog').children('.prog-text').text('已退款');
                                $('#noNumber3').show();
                                 $("#noNumber3 .times").html(orderData.applyTime)//申请时间
                                 $("#noNumber3 .timea").html(orderData.reviewTime) //审核时间
                                  $("#noNumber3 .timeb").html(orderData.finishTime) //审核时间
                                break;
                        }
                        $('#orderStatus').text(backStatus);
                        $('#noNumber1 #surplusTime').text(orderData.remainderDays + '天');
                        $('#noNumber1 .applyTime').html('退货申请时间：<span>' + orderData.applyTime + '</span>');
                    //     $('#header-wapper').find('.prog-item').eq(3).hide();
                    }
                } else {
                    $('#orderStatus').text('订单状态异常');
                    setMessage({
                        type: 'warning',
                        msg: '订单状态异常'
                    })

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

//立即支付
$('#replay').find('.ljplay').click(function () {
    var orderinfo = [{
        "orderId": getQueryString('id'),
        "orderPayMoney": (orderData.shippingFee + orderData.orderMoney)
    }]
    window.location.href = "../purchase/payment.html?orderinfo=" + JSON.stringify(orderinfo);
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

//立即评价
$('#evaluate').on('click', '.pingjia', function () {
    var id = getQueryString('id');
    window.location.href = "../purchase/commentCommodity.html?id=" + id;
})