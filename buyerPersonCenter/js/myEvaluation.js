function init() {
    shopHeaderTop('#header-top'); //渲染公共顶部
    //渲染公共头部
    shopHeader('#s-header');
}
init();

var parameter = {
    pageIndex: 1,
    pageSize: 10,
    first: true
}
getList();
//获取评价列表
function getList() {
    ajax({
        url: 'product-api-impl/userestimate/getUserComment',
        methods: 'post',
        data: {
            pageIndex: parameter.pageIndex,
            pageSize: parameter.pageSize
        },
        success: function(response) {
            if (response.code == 200) {
                var data = response.data ? response.data : [];
                var dom = '';
                if (data.data.length > 0) {
                    $('#list').show();
                    $('.noData').hide();
                } else {
                    $('#list').hide();
                    $('.noData').show();
                }
                for (var i = 0; i < data.data.length; i++) {
                    dom += '<li>';
                    if (data.data[i].image) {
                        dom += '<img src="' + data.data[i].image + '" alt="">';
                    } else {
                        dom += '<img src="../common/images/star2.png" alt="">';
                    }
                    dom += '<div>';
                    if(data.data[i].content){
                    	dom += '<p>' + data.data[i].content + '</p>';
                    }else{
                    	dom += '<p>暂无评价</p>';
                    }
                    
                    dom += '<p>' + data.data[i].time + '</p>';
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
                            getList(); //更新
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
                })
            }
        },
        error: function(response) {
            console.log(response)
        }
    })
}