function init() {
     headerTop('#header'); //渲染顶部
     headerNav('#header-seach'); //渲染头部导航
     applySellerCenter('#centre-left-nav'); //渲染默认左边导航
}
init();
// 时间控件
laydate({
     elem: '#J-xl'
});
laydate({
     elem: '#J-xl-end'
});

var parameter = {
     begin: '1977-01-01',
     end: '2100-01-01',
     pageNum: 1,
     pageSize: 10,
     first: true
}
getList();

function getList() {
     ajax({
          url: 'order-api-impl/order/dataCount',
          methods: 'get',
          data: {
               // putAway: parameter.putAway,
               pageNum: parameter.pageNum,
               pageSize: parameter.pageSize,
               begin: parameter.begin,
               end: parameter.end,
               rank: 1
          },
          success: function (response) {
               var data = response.data ? response.data : {};
               if (response.code == 200) {
                    var dom = '';
                    var list = data.data
                    if (list.length) {
                         $('#list').show();
                         for (var i = 0; i < list.length; i++) {
                              dom += '<li>';
                              dom += '<dl>';
                              dom += '<dt class="fl">' + list[i].phone_name + '<span></span></dt>';
                              dom += '<dt class="fl">' + list[i].phone + '<span></span></dt>';
                              dom += '<dt class="fl">' + list[i].sales + '<span></span></dt>';
                              dom += '<dt class="fl">' + list[i].deliver_profit + '</dt>';
                              dom += '</dl>';
                              dom += '</li>';
                         }
                    } else {
                         $('#list').hide();
                    }
                    $('#list').html(dom);
                    // if (parameter.first) {
                    //      parameter.first = false;
                    //      page({
                    //           pageSize: parameter.pageSize,
                    //           pageNum: parameter.pageNum,
                    //           total: data.total,
                    //           fn: function (e) {
                    //                parameter.pageNum = e.current;
                    //                getList(); //更新
                    //           }
                    //      });
                    // }
               } else {
                    setMessage({
                         type: 'warning',
                         msg: response.msg
                    })
               }
          },
          error: function (response) {
               setMessage(response.msg)
          }
     })
}

$('#nav').on('click', 'button', function () {
     parameter.begin = $('#J-xl').val();
     parameter.end = $('#J-xl-end').val();
     if ($('#J-xl').val() && $('#J-xl-end').val()) {
          if ($('#J-xl').val() > $('#J-xl-end').val()) {
               setMessage({
                    type: 'warning',
                    msg: '起始日期应小于截止日期'
               })
               return false;
          }
     } else {
          parameter.begin = '1977-01-01';
          parameter.end = '2100-01-01';
     }
     getList();
})