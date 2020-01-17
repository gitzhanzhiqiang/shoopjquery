/*
 * @Author: liwanli 
 * @Date: 2019-05-31 10:07:27 
 * @Last Modified by: liwanli
 * @Last Modified time: 2019-07-05 14:21:34
 * 退换货 Js 文件 shopreplacement.js
 */

init();

function init() {
    //渲染公共顶部
    shopHeaderTop('#header-top');
    //渲染公共头部
    shopHeader('#s-header');
    var id = getQueryString('id');
    var refundType = getQueryString('refundType'); // 1退款退货 2换货
    // 头部状态进度显示
    if (refundType == 2) {
        $('#header-wapper').find('.prog-item').eq(0).children('.prog-text').text('买家申请换货');
        $('#header-wapper').find('.prog-item').eq(2).children('.prog-text').text('双方换货中');
        $('#header-wapper').find('.prog-item').eq(3).children('.prog-text').text('待买家评价');
        $('.class-item.money').hide();
    } else {
        $('#header-wapper').find('.prog-item').eq(0).children('.prog-text').text('买家申请退款退货');
        $('#header-wapper').find('.prog-item').eq(2).children('.prog-text').text('待卖家收到退货');
        $('#header-wapper').find('.prog-item').eq(3).children('.prog-text').text('已退款成功');
    }
    $('#header-wapper').find('.prog-item').eq(0).addClass('prog');
    $('#header-wapper').find('.prog-item').eq(1).children('.prog-text').text('待卖家处理申请');
    //订单详情信息
    orderdetail(id);
    //订单退换货原因
    orderReasonList(refundType);
    // 上传凭证
    upLoadFilePingz();
}


/**
 * 订单详情信息
 * @param {订单id} id 
 */
function orderdetail(id) {
    ajax({
        url: 'order-api-impl/order/getOrderinfoView?id=' + id,
        methods: 'post',
        data: {},
        success: function (response) {
            if (response.code == 200) {
                var data = response.data ? response.data : [];
                //订单信息 
                var orderInfoDOM = '';
                orderInfoDOM += '<input name="orderId" value="' + getQueryString('id') + '" style="display:none">';
                orderInfoDOM += '<input name="returnType" value="' + getQueryString('refundType') + '" style="display:none">';
                orderInfoDOM += '<input name="token" value="' + $.cookie('token') + '" style="display:none">';
                // orderInfoDOM += '<h3 class="title">订单信息';
                // orderInfoDOM += '<p class="current-time">创建时间：<span id="currTime">' + data.createTime + '</span></p>';
                // orderInfoDOM += '<p class="orderId">订单号：<span id="orderNum">' + data.orderNumber + '</span></p>';
                // orderInfoDOM += '</h3>';
                orderInfoDOM += '<div class="order-list">';
                for (var i = 0; i < data.listDetail.length; i++) {
                    orderInfoDOM += '<div class="details">';
                    orderInfoDOM += '<div class="details-left fl"><img src="' + data.listDetail[i].goodsImage + '" width="204" height="204" alt=""></div>';
                    orderInfoDOM += '<div class="details-right fl">';
                    orderInfoDOM += '<h3 class="title">' + data.listDetail[i].goodsName + '</h3>';
                    orderInfoDOM += '<div class="money">¥ ' + data.listDetail[i].goodsMoney + '</div>';
                  //  orderInfoDOM += '<div class="params">参数：<span>净含量 ' + data.listDetail[i].weight + '</span></div>';
                    orderInfoDOM += '<div class="num">数量：<span>' + data.listDetail[i].goodsNum + '</span></div>';
                    if (getQueryString('refundType') == 2) {
                        orderInfoDOM += '<input name="deliveryAddressId" value="' + data.deliveryAddressId + '" style="display:none">';
                    }
                    // orderInfoDOM += '<div class="adr">';
                    // orderInfoDOM += '<div class="adr-l">配送：<span>' + data.listDetail[i].goodsAddress + ' 至 ' + data.receiveAddress + '</span></div>';
                    // orderInfoDOM += '<div class="adr-r">运费：<span>¥' + data.shippingFee + '</span></div>';
                    orderInfoDOM += '</div></div>';
                }
                $('.expu-info .orderInfo').html(orderInfoDOM);
                $('.inpt').val('¥ ' + (data.shippingFee + data.orderMoney));
                $('.class-item.money .com p span').eq(0).text(data.orderMoney).next().text(data.shippingFee);
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
 * 
 * @param {退换货类型} type 
 */
function orderReasonList(type) {
    // 换货或退货类型(1退货原因，2换货原因,不传拿到全部原因) key:backType value:
    ajax({
        url: '/order-api-impl/orderReason/orderReasonList',
        methods: 'post',
        data: {
            backType: type || ''
        },
        success: function (response) {
            if (response.code == 200) {
                var data = response.data;
                var reasonHtml = '<select name="reasonId" class="inpt" id="reasonId">';
                reasonHtml += '<option value="">请选择</option>';
                for (var i = 0; i < data.length; i++) {
                    reasonHtml += '<option value="' + data[i].id + '">' + data[i].backDescription + '</option>';
                }
                $('.tuihuan-info .reason .com').html(reasonHtml);
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
 * 上传凭证
 */
var returnPic = [];

function upLoadFilePingz() {
    var pingz = $('#uploadPingz');
    var defineUpfilePath = '../common/images/add-img.png'
    var addPingzDom = '<p id="addimg" class="addimg"><img src="../common/images/add-img.png" width="144" height="144" alt=""><input name="returnPic" type="file" accept="image/*" style="display:none"></p>';
    pingz.html(addPingzDom);
    // 上传凭证方法
    pingz.on('click', '.addimg img', function () {
        $(this).next().click();
    })
    $('#uploadPingz').on('change', 'input[type="file"]', function () {
        var that = $(this);
        //判断图片格式    
        if (!that.val() || !judgeImageType(that)) {
            return false;
        }
        var number = IEVersion();
        if (number != -1 && number < 10) {
            //   that.parent().find('img').attr('src', this.value); //本地   服务器不行
            var imgDiv = that.parent().find('img');
            //  本地服务器都兼容 //localhost:8080 可用
            //   imgDiv.css('filter', 'progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod = scale, src=' + this.value + "'"); 
            //  ip和生产地址  img src不全 以下兼容
            $(this).select();
            window.parent.document.body.focus();
            var realpath = document.selection.createRange().text;
            imgDiv.css("filter", "progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled='true',src=\"" + realpath + "\",sizingMethod=scale)");
        } else {
            var file = this.files[0];
            var reads = new FileReader();
            reads.readAsDataURL(file);
            reads.onload = function (e) {
                that.parent().find('img').attr('src', this.result);
            };
        }
        that.parent().append('<a href="javascript:" class="up-close"></a>');
        var isNext = that.parent().next().hasClass('addimg');
        if (isNext || $('#uploadPingz .addimg').length >= 3) return;
        pingz.append(addPingzDom)
    })
    // 凭证右上角关闭方法
    pingz.on('click', '.up-close', function () {
        var upLoadImg = $('#uploadPingz .addimg')
        if (upLoadImg.length > 1) {
            $(this).parent('p').remove();
            // pingz.append('<p id="addimg" class="addimg"><img src="../common/images/add-img.png" width="144" height="144" alt=""><input name="returnPic" type="file" accept="image/*" style="display:none"></p>')
        } else {
            $(this).parent().find('img').attr('src', defineUpfilePath);
            $(this).parent().find('a').remove();
            $(this).next('input').val('')
        }
    })
}

// var params = {
//     orderId: (getQueryString('id') * 1),
//     returnType: (getQueryString('refundType') * 1), //订单退换货状态 1退货 2换货
//     backDescription: "$('.explain textarea').val()", //退换货描述
//     deliveryAddressId: "", //换货地址id 退货不用传，换货需要传
//     returnPic: "[]"
// }
//提交申请
$('#ajaxForm').on('click', '.submit', function () {
    if (!$('#reasonId').val()) {
        setMessage({
            type: 'warning',
            msg: '申请原因不能为空！'
        })
        return false;
    }
    setLoad(); //加载效果
    $('#ajaxForm').attr('action', baseUrl + 'order-api-impl/orderReturn/submitOrderinfoBack');
    $('#ajaxForm').ajaxSubmit({
        success: function (data) {
            $('.confirmation-common').remove(); //清除加载
            var number = IEVersion();
            if (number != -1 && number < 10) {
                ajax({
                    url: 'member-api-impl/userAuth/testInfos', //上传图片兼容接口
                    methods: 'post',
                    data: {},
                    success: function (response) {
                        var data = response ? response : {};
                        if (data.code == 200) {
                            window.location.href = "../purchase/orderDetails.html?id=" + getQueryString('id') + '&type=3'; // + '&refundType=' + refundType;
                        } else {
                            setMessage({
                                type: 'warning',
                                msg: data.msg
                            })
                        }
                    },
                    error: function (response) {
                        console.log(response)
                    }
                })
            } else {
                var response = '';
                if (typeof data == 'string') {
                    response = JSON.parse(data) ? JSON.parse(data) : {};
                } else {
                    response = data;
                }
                if (response.code == 200) {
                    window.location.href = "../purchase/orderDetails.html?id=" + getQueryString('id')+ '&type=3'; // + '&refundType=' + refundType;
                    setMessage({
                        type: 'success',
                        msg: response.msg
                    })
                } else {
                    setMessage({
                        type: 'warning',
                        msg: response.msg
                    })
                }
            }
        },
        error: function (error) {
            $('.confirmation-common').remove(); //清除加载
            console.info(error);
        }
    })
})