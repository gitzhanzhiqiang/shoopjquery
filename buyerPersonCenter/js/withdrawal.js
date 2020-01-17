function init() {
    shopHeaderTop('#header-top'); //渲染公共顶部
    //渲染公共头部
    shopHeader('#s-header');
    getUserBankCard();
}
init();

//获取用户银行卡信息
function getUserBankCard() {
    ajax({
        url: 'member-api-impl/userInfo/getUserBankCard',
        methods: 'post',
        data: {},
        success: function (response) {
            if (response.code == 200) {
                var bankText = response.data.bankCard || '该用户暂无银行卡'
                $('#bank').text(bankText)
                //  setMessage({
                //      type: 'success',
                //      msg: response.msg
                //  })
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