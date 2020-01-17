function init() {
    shopHeaderTop('#header-top'); //渲染公共顶部
    //渲染公共头部
    shopHeader('#s-header');
}
init();

// 打开弹窗
$('.button').on('click', 'p.reply', function() {
    $('.details_alertForm').show();
})

// 关闭弹窗
function CloseAlert() {
    $('.details_alertForm').hide();
}

var id = getQueryString('id');
var parameter = {
    pageIndex: 1,
    pageSize: 10,
    createUserId: '',
    first: true
}
messageDetail();

//消息详情
function messageDetail() {
    parameter.createUserId = id;
    if (!id) {
        $('.reply').hide();
    } else {
        $('.reply').show();
    }
    ajax({
        url: 'member-api-impl/message/updGetMessageTalkList',
        methods: 'post',
        data: {
            pageIndex: parameter.pageIndex,
            pageSize: parameter.pageSize,
            createUserId: parameter.createUserId,
        },
        success: function(response) {
            if (response.code == 200) {
                var data = response.data ? response.data : [];
                var dom = '';
                for (var i = 0; i < data.records.length; i++) {
                    dom += '<li>';
                    dom += '<h5>' + data.records[i].title + '</h5>';
                    if (parameter.createUserId) {
                        dom += '<p>' + data.records[i].mainBody + '</p>';
                    } else {
                        dom += data.records[i].mainBody;
                    }
                    dom += '<div>';
                    dom += '<span>' + data.records[i].createUserName + '</span>';
                    dom += '<span>' + data.records[i].sendTime + '</span>';
                    dom += '</div>';
                    dom += '</li>';
                }
                $('#details_list').html(dom);
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

//提交
$('.details_alertForm').on('click', '.submit', function() {
    var title = $('.box input').val();
    var mainBody = $('.box textarea').val();
    if (!title) {
        setMessage({
            type: 'warning',
            msg: '请输入标题'
        })
        return false;
    }
    if (!mainBody) {
        setMessage({
            type: 'warning',
            msg: '请输入正文内容'
        })
        return false;
    }
    ajax({
        url: 'member-api-impl/message/replyMessageTalk',
        methods: 'post',
        data: {
            receiveUserId: id,
            title: title,
            mainBody: mainBody
        },
        success: function(response) {
            if (response.code == 200) {
                setMessage({
                    type: 'success',
                    msg: response.msg
                })
                $('.details_alertForm').hide();
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
})