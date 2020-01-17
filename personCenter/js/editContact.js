//渲染默认导航
function init() {
    headerTop('#header'); //渲染顶部
    headerNav('#header-seach'); //渲染头部导航
    // types 0 买家 2 供应商 1 卖家
}
init();

// 获取账户信息
function accountInfo() {
    ajax({
        methods: 'post',
        url: 'member-api-impl/user/accountDetail',
        data: {},
        success: function (response) {
            var data = response.data ? response.data : [];
            if (response.code == 200) {
                var photo;
                if (data.userImage) {
                    var photo = '<img src="' + data.userImage + '" alt=""  >';
                } else {
                    photo = '<img src="../common/images/star2.png" alt=""  >';
                }
                $('.info-photo').prepend(photo);
                var account = '<li> <div class="fl"> 店铺名：<span class="right">' + data.nickname + '</span></div> <div class="fl"> 开店时间：<span class="right">' + data.createTime + '</span></div></li>';
                account += '<li> <div class="fl"> 店铺ID：<span class="right">' + data.userNum + '</span></div> <div class="fl"> 行政村：<span class="right">' + data.lastLoginTime + '</span></div></li>';
                $('.info-account').append(account);

                // types 0 买家 2 供应商 1 卖家
                if (data.types == 2) {
                    $('.accountType').html('<span class="fl center accountType">供应商</span>');
                    $('.centre-left-nav').children('.types_2').show();
                } else if (data.types == 1) {
                    $('.accountType').html('<span class="fl center accountType">卖家</span>');
                    $('.centre-left-nav').children('.types_1').show();
                } else {
                    $('.centre-left-nav').children('.types_1,.types_2').hide();
                    $('.accountType').html('<span class="fl center accountType">普通用户</span>');
                }
                $('.phone').html(data.phone);
                $('.appid').html(data.wechatAccount);
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
accountInfo();


// 检验必传显示*号 同时初始化 lable位置
verification_required('#form');
var rules = {
    phone: [{
        validator: validatePass
    }]
}
form_submit('#form', rules); //初始化

function validatePass() {
    val = $("#form").find('input.verification-input:text[props="phone"]').val();
    if (!validate.validatPhone(val)) {
        return '手机格式不正确';
    } else {
        return false;
    }
}
// 提交显示
function form_submit(id) {
    console.log('验证成功')
    verification(id, rules, function () {
        console.log('验证成功')
    })

}

// 获取图形验证码
var imgCode = '';
getImgCode();

function getImgCode() {
    ajax({
        methods: 'POST',
        url: 'member-api-impl/longin/getImagecCode?type=2',
        data: {},
        success: function (response) {
            var data = response.data ? response.data : [];
            if (response.code == 200) {
                imgCode = data[0];
                $('#imgcode').attr('src', 'data:image/png;base64,' + data[1])
            } else {
                setMessage({
                    type: 'warning',
                    msg: response.msg
                });
            }
        },
        error: function (response) {

        }
    })
}
// 获取手机验证码
$('.form').on('click', '.form-item .getcode span', function () {
    var that = $(this);
    var phone = $('#phone').val();
    var pictureCode = $('#pictureCode').val();
    if (!phone) {
        setMessage({
            type: 'warning',
            msg: '手机号码不能为空'
        });
        return false;
    }
    if (!validate.validatPhone(phone)) {
        setMessage({
            type: 'warning',
            msg: '手机号码不正确'
        });
        return false;
    }
    if (!pictureCode) {
        setMessage({
            type: 'warning',
            msg: '图形验证码不能为空'
        });
        return false;
    }
    if (pictureCode.length != 4) {
        setMessage({
            type: 'warning',
            msg: '请输入四位图形验证码'
        });
        return false;
    }
    ajax({
        methods: 'post',
        url: 'member-api-impl/longin/getcode',
        data: {
            phone: phone,
            imageCode: pictureCode,
            margCode: imgCode,
            codeType: "2"
        },
        success: function (response) {
            var data = response.data ? response.data : [];
            if (response.code == 200) {
                setMessage({
                    type: 'success',
                    msg: '获取成功'
                });
                $('.form .getcode .time').html(120);
                $('.form .getcode .time').show();
                that.hide();
                var time = setInterval(function () {
                    var text = $('.form .getcode .time').html() * 1;
                    if (text == 0) {
                        $('.form .getcode .time').hide();
                        that.show();
                        clearInterval(time);
                    }
                    $('.form .getcode .time').text(text - 1)
                }, 1000);
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
// 保存
$('.form').on('click', '.button button', function () {
    var phone = $('#phone').val();
    var pictureCode = $('#pictureCode').val();
    var phoneCode = $('#phoneCode').val();
    if (!phone) {
        setMessage({
            type: 'warning',
            msg: '手机号码不能为空'
        });
        return false;
    }
    if (!validate.validatPhone(phone)) {
        setMessage({
            type: 'warning',
            msg: '手机号码不正确'
        });
        return false;
    }
    if (!pictureCode) {
        setMessage({
            type: 'warning',
            msg: '图形验证码不能为空'
        });
        return false;
    }
    if (pictureCode.length != 4) {
        setMessage({
            type: 'warning',
            msg: '请输入四位图形验证码'
        });
        return false;
    }
    if (!phoneCode) {
        setMessage({
            type: 'warning',
            msg: '手机验证码不能为空'
        });
        return false;
    }
    if (phoneCode.length != 6) {
        setMessage({
            type: 'warning',
            msg: '请输入六位手机验证码'
        });
        return false;
    }
    if ($('.count_down').html() == 0) {
        setMessage({
            type: 'warning',
            msg: '请重新发送手机验证码和更新新的图片验证码'
        });
        return false;
    }
    ajax({
        methods: 'POST',
        url: 'member-api-impl/user/updBindPhone',
        data: {
            newPhone: phone,
            authCode: phoneCode
        },
        success: function (response) {
            var data = response.data ? response.data : [];
            if (response.code == 200) {
                setMessage({
                    type: 'success',
                    msg: response.msg
                });
                window.location.href = 'accountInfo.html';
            } else {
                setMessage({
                    type: 'warning',
                    msg: response.msg
                });
            }
        },
        error: function (response) {

        }
    })
})