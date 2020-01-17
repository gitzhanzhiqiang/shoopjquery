var parameter = {
     pageIndex: 1,
     pageSize: 10,
     types: '',
     first: true
}

function init() {
     shopHeaderTop('#header-top'); //渲染公共顶部
     //渲染公共头部
     shopHeader('#s-header');
     //  getList();
}
init();

// 切换导航
$('#tab span').click(function () {
     var types = '';
     $('#tab span').removeClass('hover');
     $(this).addClass('hover');
     if ($(this).index() == 0) {
          getLinkman(-1)
     } else if ($(this).index() == 1) {
          getLinkman(0)
     } else if ($(this).index() == 2) {
          getLinkman(1)
     }
     //  getList();
});
//
//$('#list').on('click', 'li', function() {
//  window.location.href = 'messageDetails.html?id=' + $(this).attr('id');
//})

// 获取联系人
var userInfo = $.cookie('userInfo') ? JSON.parse($.cookie('userInfo')) : {};


function getLinkman(num) {
     ajax({
          url: 'member-api-impl/im/chatList',
          methods: 'get',
          data: {
               sid: userInfo.id,
               type: num,
          },
          success: function (response) {
               var data = response.data.data ? response.data.data : [];
               if (response.data.allNotReadMessageCount < 100 && response.data.allNotReadMessageCount > 0) {
                    $("#tcont").empty().append('全部<b>' + response.data.allNotReadMessageCount + '</b>')
               } else if (response.data.allNotReadMessageCount > 99) {
                    $("#tcont").empty().append('全部<b>99+</b>')
               } else {
                    $("#tcont").empty().append('全部')
               }

               if (response.data.sysNotReadMessageCount < 100 && response.data.sysNotReadMessageCount > 0) {
                    $("#tconta").empty().append('系统消息<b>' + response.data.sysNotReadMessageCount + '</b>')
               } else if (response.data.sysNotReadMessageCount > 99) {
                    $("#tconta").empty().append('系统消息<b>99+</b>')
               } else {
                    $("#tconta").empty().append('系统消息')
               }

               if (response.data.perNotReadMessageCount < 100 && response.data.perNotReadMessageCount > 0) {
                    $("#tcontb").empty().append('个人消息<b>' + response.data.perNotReadMessageCount + '</b>')
               } else if (response.data.perNotReadMessageCount > 99) {
                    $("#tcontb").empty().append('个人消息<b>99+</b>')
               } else {
                    $("#tcontb").empty().append('个人消息')
               }

               if (response.data.data.length > 0) {
                    $('#list').show();
                    $('.noData').hide();
               } else {
                    $('#list').hide();
                    $('.noData').show();
               }
               var dom = ''
               if (response.code == 200) {
                    for (var i = 0; i < data.length; i++) {
                         if (data[i].rid == userInfo.id) {
                              dom += '<li da-data="' + data[i].sid + '">'
                              dom += '<img src="' + (data[i].sidImage ? data[i].sidImag : pathCommon + "common/images/star.png") + '" alt="">'
                         } else {
                              dom += '<li da-data="' + data[i].rid + '">'
                              dom += '<img src="' + (data[i].ridImage ? data[i].ridImage : pathCommon + "common/images/star.png") + '" alt="">'
                         }
                         dom += '<div>'
                         dom += '<h5>'
                         if (data[i].rid == userInfo.id) {
                              dom += '' + data[i].sidNickName + '<span>' + data[i].pushTime + '</span>'
                         } else {
                              dom += '' + data[i].ridNickName + '<span>' + data[i].pushTime + '</span>'
                         }
                         dom += '</h5>'
                         dom += '<p>' + data[i].messageBody + '</p>'
                         dom += '</div>'
                         dom += '</li>'
                    }
                    $("#list").empty().append(dom)
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
getLinkman(-1);
$('#list').on('click', 'li', function () {
     var id = $(this).attr("da-data");
     if (id && id != -1) {
          window.location.href = "../chitchat.html?id=" + id
     } else {
          setMessage({
               type: 'warning',
               msg: '店铺不存在'
          })
     }
})
console.log(userInfo)





//获取消息列表
//function getList() {
//  ajax({
//      url: 'member-api-impl/message/getMessagePageByUserId',
//      methods: 'post',
//      data: {
//          pageIndex: parameter.pageIndex,
//          pageSize: parameter.pageSize,
//          types: parameter.types,
//      },
//      success: function(response) {
//          if (response.code == 200) {
//              var data = response.data ? response.data : [];
//              var dom = '';
//              if (data.records.length > 0) {
//                  $('#list').show();
//                  $('.noData').hide();
//              } else {
//                  $('#list').hide();
//                  $('.noData').show();
//              }
//              for (var i = 0; i < data.records.length; i++) {
//                  dom += '<li id="' + data.records[i].userPO.id + '">';
//                  if (data.records[i].userPO.userImage) {
//                      dom += '<img src="' + data.records[i].userPO.userImage + '" alt="">';
//                  } else {
//                      dom += '<img src="../common/images/star2.png" alt="">';
//                  }
//                  dom += '<div>';
//                  dom += '<h5>';
//                  dom += data.records[i].userPO.nickname + '<span>' + data.records[i].message.sendTime + '</span>';
//                  dom += '</h5>';
//                  dom += '<p>' + data.records[i].message.title + '</p>';
//                  dom += '</div>';
//                  dom += '</li>';
//              }
//              $('#list').html(dom);
//              if (parameter.first) {
//                  parameter.first = false;
//                  page({
//                      pageSize: parameter.pageSize,
//                      pageNum: parameter.pageIndex,
//                      total: data.total,
//                      fn: function(e) {
//                          parameter.pageIndex = e.current;
//                          getList(); //更新
//                      }
//                  });
//              } else {
//
//              }
//          } else {
//              setMessage({
//                  type: 'warning',
//                  msg: response.msg
//              })
//          }
//      },
//      error: function(response) {
//          console.log(response)
//      }
//  })
//}