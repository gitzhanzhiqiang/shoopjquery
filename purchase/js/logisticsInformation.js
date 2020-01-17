//渲染公共顶部
shopHeaderTop('#header-top');
//渲染公共头部
shopHeader('#s-header');
getLogistics();

function getLogistics() {
    var id = getQueryString('id');
    ajax({
        methods: 'POST',
        url: 'order-api-impl/express/getOrderTraces',
        data: {
            orderId: Number(id)
        },
        success: function (response) {
            if (response.code == 200) {
                var data = response.data ? response.data : {};
                var tracesList = data.tracesList;
                var tracesHtml = '';
                //  物流状态: 0-无轨迹，1-已揽收，2-在途中，3-签收,4-问题件
                if (data.tracesList) {
                    for (var i = 0; i < tracesList.length; i++) {
                        tracesHtml += '<li>';
                        tracesHtml += '<div class="fl left">' + tracesList[i].acceptTime + '<span>' + tracesList[i].acceptTypeStr + '</span></div>';
                        tracesHtml += '<div class="fl right">';
                        for (var j = 0; j < tracesList[i].childTracesList.length; j++) {
                            tracesHtml += '<p>' + tracesList[i].childTracesList[j].acceptDay + '&nbsp;&nbsp;' + tracesList[i].childTracesList[j].acceptHour + '<span>' + tracesList[i].childTracesList[j].acceptStation + '</span></p>';
                        }
                    }
                }else {
                    tracesHtml += '<li>';
                    tracesHtml += '<div class="fl left">下单时间<span>' + data.orderInfo.createTime + '</span></div>';
                    tracesHtml += '<div class="fl right">';
                    tracesHtml += '<p><span>'+data.orderInfo.expressLastInfo+'</span></p>';
                }
                // 物流详情
                $('.list').html(tracesHtml);
                // 快递信息
                data.expressVO && $('.text').children('p').eq(0).children('span').eq(0).text(data.orderInfo.expressTicket).next('span').text(data.expressVO.expressName).next('span').text(data.expressVO.expressPhone);
                !data.expressVO && $('.text').children('p').eq(0).hide();
                !data.expressVO && $('.text').children('p').eq(1).hide();
                $('.text').children('p').eq(1).children('span').eq(0).text(data.orderInfo.sellerAddress).next('span').text(data.orderInfo.sellPhone)
                $('.text').children('p').eq(2).children('span').eq(0).text(data.orderInfo.receiveAddress).next('span').text(data.orderInfo.consigneePhone)
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