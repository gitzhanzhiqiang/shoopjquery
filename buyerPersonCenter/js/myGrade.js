function init() {
    shopHeaderTop('#header-top'); //渲染公共顶部
    //渲染公共头部
    shopHeader('#s-header');
    getGrade();
}
init();

//获取用户等级
function getGrade() {
    ajax({
        url: 'member-api-impl/user/accountGrade',
        methods: 'post',
        data: {},
        success: function(response) {
            if (response.code == 200) {
                var data = response.data ? response.data : [];
                $('.text-right-level li .level-number').html(data.integral); //可用积分
                $('.text-right-level li').find('span.icon').html(data.gradeName); //买家等级
                for (var i = 0; i < data.gradeStar; i++) {
                    $('.text-right-level li img').eq(i).attr('src', 'image/jifen_xin.png')
                }
                //计算下一等级
                var arr = data.gradeRange.split(',');
                var width = (data.gradeBegin / data.gradeEnd) * 100 + "%";
                console.log(width)
               //  $('.text-right-level .process').find('.pink span').html(data.gradeEnd);
                $('.text-right-level .process').find('.red span').html(data.gradeBegin);
                $('.text-right-level .process').find('.red').css('width', width);
                $('.text-right-level li').find('p.icon').html(data.gradeNextName);
                var dom = '';
                if (data.listIntegral.length > 0) {
                    $('#list').show();
                    $('.noData').hide();
                } else {
                    $('#list').hide();
                    $('.noData').show();
                }
                for (var i = 0; i < data.listIntegral.length; i++) {
                    dom += '<li>';
                    dom += '<p>' + data.listIntegral[i].goodsName + '</p>';
                    dom += '<p>' + data.listIntegral[i].finishTime + '<span class="fr">+' + data.listIntegral[i].integral + '</span></p>';
                    dom += '</li>';
                }
                $('#list').html(dom);
            } else {
                setMessage({
                    type: 'warning',
                    msg: response.msg
                })
            }
        },
        error: function(response) {
            console.log(response)
        }
    })
}
//获取积分列表
// function getList() {
//     ajax({
//         url: 'order-api-impl/order/getIntegral',
//         methods: 'post',
//         data: {},
//         success: function(response) {
//             if (response.code == 200) {
//                 var data = response.data ? response.data : [];
//                 var dom = '';
//                 if (data.data.length > 0) {
//                     $('#list').show();
//                     $('.noData').hide();
//                 } else {
//                     $('#list').hide();
//                     $('.noData').show();
//                 }
//                 for (var i = 0; i < data.length; i++) {
//                     dom += '<li>';
//                     dom += '<p>我是评价我是评价我是评价我是评价我是评价我是评价我是评价我是评价我是评价我是评价我是评价我是评价我是评价我是</p>';
//                     dom += '<p>2019-05-23 17:52:37</p>';
//                     dom += '</li>';
//                 }
//             } else {
//                 setMessage({
//                     type: 'warning',
//                     msg: response.msg
//                 })
//             }
//         },
//         error: function(response) {
//             console.log(response)
//         }
//     })
// }