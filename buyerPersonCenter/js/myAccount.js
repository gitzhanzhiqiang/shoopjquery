function init() {
    shopHeaderTop('#header-top'); //渲染公共顶部
    //渲染公共头部
    shopHeader('#s-header');
    myBalance();
}
init();


//提现跳转
$('.text-right').on('click', '.top_balance a.button', function() {
    window.location.href = 'withdrawal.html';
})

function myBalance() {
    ajax({
        methods: 'post',
        url: 'member-api-impl/user/myBalance',
        data: {},
        success: function(response) {
            if (response.code == 200) {
                var data = response.data ? response.data : [];
                $('.top_balance .tip span').html(data.balanceMoney);
            } else {
                setMessage({
                    type: 'warning',
                    msg: response.msg
                });
            }

        },
        error: function(response) {}
    })
}

//获取交易明细列表
var parameter = {
    pageIndex: 1,
    pageSize: 10,
    first: true
}
accountList()

function accountList() {
    ajax({
        methods: 'post',
        url: 'member-api-impl/accountMoney/getAccountMoneyPageByUserId',
        data: {
            pageIndex: parameter.pageIndex,
            pageSize: parameter.pageSize
        },
        success: function(response) {
            if (response.code == 200) {
                var data = response.data ? response.data : [];
                var dom = '';
                if (data.records.length > 0) {
                    $('#list').show();
                    $('.noData').hide();
                } else {
                    $('#list').hide();
                    $('.noData').show();
                }
                for (var i = 0; i < data.records.length; i++) {
                    dom += '<li>';
                    dom += '<div class="fl">';
                    var types = '';
                    // 1资金提现 2资金充值 3季度分润 4退款 ,
                    switch (data.records[i].types) {
                        case 1:
                            types = '资金提现';
                            break;
                        case 2:
                            types = '资金充值';
                            break;
                        case 3:
                            types = '季度分润';
                            break;
                        case 4:
                            types = '退款';
                            break;
                    }
                    if (types) {
                        dom += '<p>交易类型：<span>' + types + '</span></p>';
                    }
                    dom += '<p>交易时间：<span>' + data.records[i].applyTime + '</span></p>';
                    // dom += '<p>交易内容：<span>订单号4511212125151的商品款项</span></p>';
                    dom += '</div>';
                    dom += '<div class="fl">';
                    dom += '<p>操作金额：<span>¥ ' + data.records[i].money + '</span></p>';
                    dom += '</div>';
                    dom += '<div class="fl">';
                    // dom += '<p>可用余额：<span>¥ 300.00</span></p>';
                    dom += '</div>';
                    dom += '</li>';
                }
                $('#list').html(dom);
                if (parameter.first) {
                    parameter.first = false;
                    page({
                        pageSize: parameter.pageSize,
                        pageNum: parameter.pageIndex,
                        total: data.total,
                        fn: function(e) {
                            parameter.pageIndex = e.current;
                            accountList(); //更新
                        }
                    });
                } else {
                    // setMessage({
                    //     type: 'warning',
                    //     msg: response.msg
                    // })
                }
            } else {
                setMessage({
                    type: 'warning',
                    msg: response.msg
                });
            }

        },
        error: function(response) {}
    })
}