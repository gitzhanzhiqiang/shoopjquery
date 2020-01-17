function init() {
     headerTop('#header'); //渲染顶部
     headerNav('#header-seach'); //渲染头部导航
     applySellerCenter('#centre-left-nav'); //渲染默认左边导航
     var dom = '<input type="text" name="token" style="display: none;" value="' + $.cookie('token') + '"/>'
     $('#ajaxForm').append(dom);
}
init();
// 选中checkout
$('#list').on('click', '.checkout div', function () {
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
$('#nav li.tab').click(function () {
     $('#nav li span').removeClass('hover');
     $(this).children('span').eq(0).addClass('hover');
     parameter = {
          applyStatus: $(this).attr('status'),
          pageSize: 10,
          pageNum: 1,
          first: true
     }
     getList();
});
// 下载

function downLoad() {
     console.log(baseUrl + 'member-api-impl/excel/downloadDataTemplate?moduleType=villager&token=' + $.cookie('token'))
     window.open(baseUrl + 'member-api-impl/excel/downloadDataTemplate?moduleType=villager&token=' + $.cookie('token'));
}
$('#file').change(function (e) {
     if (!judgeImageType($(this), 1)) {
          return false;
     }
     form_submit();
})
// 提交显示
function form_submit() {
     $('#ajaxForm').attr('action', baseUrl + 'member-api-impl/excel/uploadData');
     $('#ajaxForm').ajaxSubmit({
          success: function (data) {
               var number = IEVersion();
               if (number != -1 && number < 10) {
                    ajax({
                         url: 'member-api-impl/userAuth/testInfos',
                         methods: 'post',
                         data: {},
                         success: function (response) {
                              var data = response ? response : {};
                              console.log(response)
                              if (data.code == 200) {
                                   setMessage({
                                        type: 'success',
                                        msg: data.msg
                                   })
                                   setTimeout(function () {
                                        window.location.reload();
                                   }, 800)
                              } else {
                                   setMessage({
                                        type: 'warning',
                                        msg: data.msg
                                   })
                              }

                         },
                         error: function (response) {
                              console.log(response)
                         }
                    })
               } else {

                    var data = JSON.parse(data) ? JSON.parse(data) : {};
                    if (data.code == 200) {
                         setMessage({
                              type: 'success',
                              msg: data.msg
                         })
                         setTimeout(function () {
                              window.location.reload();
                         }, 800)
                    } else {
                         setMessage({
                              type: 'warning',
                              msg: data.msg
                         })
                    }
               }
          },
          error: function (error) {
               console.info(error);
          }
     })
}
var parameter = {
     // applyStatus 3全部 0申请 1同意 2不同意
     applyStatus: 3,
     pageSize: 10,
     pageNum: 1,
     first: true

}
getList(); //获取列表
function getList() {
     ajax({
          url: 'member-api-impl/villager/getAllInfo',
          methods: 'get',
          data: parameter,
          success: function (response) {
               if (response.code == 200) {
                    var data = response.data ? response.data : {};
                    var dom = '<ul class="list" >';
                    for (var i = 0; i < data.records.length; i++) {
                         var li = data.records[i];
                         dom += '<li>';
                         dom += '<dl>';
                         dom += '<dt class="fl">' + li.name + '<span></span></dt>';
                         dom += '<dt class="fl">' + li.phone + '<span></span></dt>';
                         dom += '<dt class="fl">' + li.idNumber + '<span></span></dt>';
                         dom += '<dt class="fl">￥' + li.historyCountMoney + '<span></span></dt>';
                         if (li.applyStatus == 0) {
                              dom += '<dt class="fl">';
                              dom += '<p onClick="audit(' + li.id + ', 2)">不同意</p>';
                              dom += '<button onClick="audit(' + li.id + ', 1)">同意</button>';
                              dom += '</dt>';
                         } else {
                              dom += '<dt class="fl" onClick="deletion_record(' + li.id + ')" >删除</span></dt>';
                         }

                         dom += '</dl>';
                         dom += '</li>';
                    }
                    dom += '</div>'

                    if (data.records.length > 0) {
                         $('#list').html(dom);
                    } else {
                         $('#list').html('');
                    }
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
               console.log(response)
          }
     })
}

function deletion_record(id) {
     seTconfirmation('提示', '确认删除吗?', {
          then: function () {
               ajax({
                    url: 'member-api-impl/villager/delOneVillager',
                    methods: 'get',
                    data: {
                         id: id
                    },
                    success: function (response) {
                         if (response.code == 200) {
                              setMessage({
                                   type: 'success',
                                   msg: response.msg
                              })
                              $('.confirmation-common').css('display', 'none');
                              parameter.first = true;
                              getList();
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

function audit(id, status) {
     // var title = status ? '确认同意吗?' : '确认不同意吗?';
     var title = '';
     if (status == 1) {
          title = '确认同意吗?';
     } else {
          title = '确认不同意吗?';
     }
     seTconfirmation('提示', title, {
          then: function () {
               ajax({
                    url: 'member-api-impl/villager/agreeOneVillager',
                    methods: 'get',
                    data: {
                         id: id,
                         applyStatus: status
                    },
                    success: function (response) {
                         if (response.code == 200) {
                              setMessage({
                                   type: 'success',
                                   msg: response.msg
                              })
                              $('.confirmation-common').css('display', 'none');
                              parameter.first = true;
                              getList();
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