function init() {
    headerTop('#header');//渲染顶部
    headerNav('#header-seach');//渲染头部导航
    applySupplierCenter('#centre-left-nav'); //渲染默认左边导航
}
init();
// 选中checkout
$('#list').on('click', '.checkout div', function() {
    var that = $(this);
    var name = '';
    if (that.attr('class') == 'noSelected') {
        name = 'Selected';
    } else {
        name = 'noSelected';

    }
    that.removeClass();
    that.addClass(name);
});
// 切换导航
$('#nav li').click(function() {
    $('#nav li span').removeClass('hover');
    $(this).children('span').eq(0).addClass('hover');
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
         url: 'member-api-impl/supplier/dataCount',
         methods: 'get',
         data: {
              // putAway: parameter.putAway,
              pageNum: parameter.pageNum,
              pageSize: parameter.pageSize,    
              begin: parameter.begin,
              end: parameter.end,
              rank: 2
         },
         success: function (response) {
              var data = response.data ? response.data : {};
              if (response.code == 200) {
                   var dom = '';
                   var list = data.data
                   if(list.length){
                        $('#list').show();
                        for (var i = 0; i < list.length; i++) {
                             dom += '<li>';
                             dom += '<dl>';
                             dom += '<dt class="fl">'+list[i].phone_name+'<span></span></dt>';
                             dom += '<dt class="fl">'+list[i].sales+'<span></span></dt>';
                             dom += '<dt class="fl">'+list[i].deliver_profit+'</dt>';
                             dom += '</dl>';
                             dom += '</li>';
                        }
                   }else{
                        $('#list').hide();
                   }
                   $('#list').html(dom);
                   if (parameter.first) {
                        parameter.first = false;
                        page({
                             pageSize: parameter.pageSize,
                             pageNum: parameter.pageNum,
                             total: data.total,
                             fn: function (e) {
                                  parameter.pageNum = e.current;
                                  getList(); //更新
                             }
                        });
                   }
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