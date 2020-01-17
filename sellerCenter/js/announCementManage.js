function init() {
     headerTop('#header'); //渲染顶部
     headerNav('#header-seach'); //渲染头部导航
     applySellerCenter('#centre-left-nav'); //渲染默认左边导航
     verification_required('#form'); //显示米号必传
}

init();

getTable();
function getTable() {
     ajax({
          url: 'member-api-impl/notice/getNoticeList',
          methods: 'post',
          data: {},
          success: function (response) {
               if (response.code == 200) {
                    var data = response.data ? response.data : {};
                    var str = '';
                    str += '<tr>';
                    str += '<td>公告标题</td>';
                    str += '<td>公告id</td>';
                    str += '<td>状态</td>';
                    str += '<td>操作</td>';
                    str += '</tr>';
                    for (var i = 0; i < data.length; i++) {
                         str += '<tr>';
                         str += '<td>' + data[i].title + '</td>';
                         str += '<td>' + data[i].id + '</td>';
                         str += '<td>' + (data[i].status == 1 ? '显示' : '隐藏') + '</td>';
                         str += '<td><span onClick="edit(' + data[i].id + ',' + data[i].supplierId + ')">编辑</span><span onClick="del(' + data[i].id + ',' + data[i].supplierId + ')">删除</span></td>';
                         str += '</tr>';
                    }
                    $('table').html(str)

               } else {
                    setMessage({
                         type: 'warning',
                         msg: response.msg
                    })
               }
          },
          error: function (response) {
               console.log(response);
          }
     })
}
function edit(id, supplierId) {
     window.location.href = './announCement.html?id=' + id + '&supplierId=' + supplierId;
}
function del(id, supplierId) {
     seTconfirmation('提示', '确认删除吗', {
          then: function () {
               ajax({
                    url: 'member-api-impl/notice/delNoticeBySupplierId',
                    methods: 'post',
                    data: {
                         id: id,
                         supplierId: supplierId
                    },
                    success: function (response) {
                         var data = response.data ? response.data : {};
                         if (response.code == 200) {
                              setMessage({
                                   type: 'success',
                                   msg: response.msg
                              })
                              $('.confirmation-common').css('display', 'none');
                              getTable();
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
          },
          cath: function () {
               console.log('取消')
          }
     });
}