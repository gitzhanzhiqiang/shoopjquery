var backupsWebSocket; //长连接
// 获取联系人
var userInfo = $.cookie('userInfo') ? JSON.parse($.cookie('userInfo')) : {};
//console.log(userInfo)
var ida = getQueryString('id');
if (!getQueryString('productId')) {
     $('#sendProduct').hide();
}
/*发送内容模块 */
//  发送框三个小图标动画及事件
// 使用此方式添加事件只能用闭包，否则作用域链中的i会被替换。只有一个图片能实现功能；
var imgArr = $('.inputBox_top img'),
     len = imgArr.length;
for (var i = 0; i < len; i++) {
     function a(i) {
          bindEvent(imgArr[i], 'mouseover', function () {
               getSRC(imgArr[i], i, 0);
          });
          bindEvent(imgArr[i], 'mouseout', function () {
               getSRC(imgArr[i], i, 1);
          });
          if (i != 0) {
               //当表情框显示的情况下，点击其他两个小图标 关闭表情框；
               bindEvent(imgArr[i], 'click', function () {
                    $('.emojstext').hide();
               });
               $('.upload').on('click', function () {
                    $('.emojstext').hide();
               })
          }
     }
     a(i);
}

// 先获取输入内容，并发送消息
var btn1 = document.getElementById('dd');
bindEvent(btn1, 'click', function () {
     sendMessage(); //发送消息
});
$('.textarea').bind('keyup', function (event) {
     if (event.keyCode == "13") {　　　　 //回车执行查询   　　　　
          $('#search_button').click();
          sendMessage(); //发送消息        　　
     }
});
// 发送产品了链接
$('#sendProduct').click(function () {
     var url = baseUrl + pathCommon + 'purchase/productDetails.html?id=' + getQueryString('productId') + '&supplierid=' + getQueryString('supplierid');
     console.log(baseUrl + pathCommon + 'purchase/productDetails.html?id=' + getQueryString('productId') + '&supplierid=' + getQueryString('supplierid'))
     sendMes(0, url); //发送消息
     backupsWebSocket.send(JSON.stringify({
          types: 4,
          sid: userInfo.id,
          rid: ida,
          messageBody: url
     }));
})
//发送消息     
function sendMessage() {
     var words = $('.textarea').text(),
          showContent;
     if (words.length > 0 && words.length < 150) {
          sendMes(0, words); //发送消息
          backupsWebSocket.send(JSON.stringify({
               types: 0,
               sid: userInfo.id,
               rid: ida,
               messageBody: words
          }));
          //        sendMes1(0, words); //对方的消息 测试玩得（可删除）
     } else if (words.length <= 0) {
          setMessage({
               type: 'warning',
               msg: '请输入内容！'
          })
     } else {
          console.log(words.length);
          setMessage({
               type: 'warning',
               msg: '内容过长！'
          })
     }
}
//点击表情显示表情框
bindEvent(imgArr[0], 'click', function () {
     $('.emojstext').toggle();
});

//点击输入框关闭emoj表情
$('.textarea').on('click', function () {
     $('.emojstext').hide();
})

//点击单个emoj表情，将其获取到输入框中
var emoj = document.getElementById("emoj");
eventProxy(emoj, 'click', 'span', function (e) {
     var e = e || event,
          target = e.target || e.srcElement;
     t = target.innerText;
     $('.textarea').text($('.textarea').text() + t);
     $("#emoj").hide();
     console.log($('.textarea').text() + t)
})
var dom = '<input type="text" name="token" style="display: none;" value="' + $.cookie('token') + '"/>'
$('.ajaxForm').append(dom);
// 获取图片并发送
var file = $(".upload");
file.change(function () {
     console.log('a')
     $('.ajaxForm').attr('action', baseUrl + 'member-api-impl/im/picUpload');
     $('.ajaxForm input[name="sid"]').val(userInfo.id);
     console.log($('#ajaxForm').attr('action'))
     $('.ajaxForm').ajaxSubmit({
          success: function (data) {
               if (data.code == 200) {
                    sendMes(1, data.data);
                    backupsWebSocket.send(JSON.stringify({
                         types: 1,
                         sid: userInfo.id,
                         rid: ida,
                         messageBody: data.data
                    }));
                    //                  sendMes1(1, data.data); //对方的消息 测试玩得（可删除）
               } else {
                    setMessage({
                         type: 'warning',
                         msg: data.msg
                    })
               }
               console.log(typeof data)
          },
          error: function (error) {
               console.info(error);
          }
     })
     // sendMes(1, getObjectURL(file[0].files[0]));
});
// 创建长连接
initWebsocket();

function initWebsocket() {

     // 判断当前浏览器是否支持WebSocket
     if (!window.WebSocket) {
          setMessage({
               type: 'warning',
               msg: '当前浏览器不支持消息协议'
          })
          return false;
     }
     let array = baseUrl.split('//');
     let url = '';
     //   array[1] = '192.168.0.137:8888/';
     if (array[0] == 'http:') {
          url = 'ws:' + array[1] + 'websocket/' + userInfo.id;
     } else if (baseUrl == 'https://test.ixgoo.cn/') {
          url = 'wss:' + array[1] + 'websocket/' + userInfo.id;
     } else {
          url = 'wss:' + '//im.ixgoo.cn/' + 'websocket/' + userInfo.id;
     }
     backupsWebSocket = new WebSocket(url);
     //连接发生错误的回调方法
     backupsWebSocket.onerror = function () {
          console.log('错误')
          backupsWebSocket.close();
     };
     //连接成功建立的回调方法
     backupsWebSocket.onopen = function (event) {
          // 发起挥手
          console.log('成')
          backupsWebSocket.send(JSON.stringify({
               types: 2,
               sid: userInfo.id,
               rid: ida,
               messageBody: ''
          }));
          //发送的为字符串
          //           backupsWebSocket.send(message);
     };
     //接收到消息的回调方法
     backupsWebSocket.onmessage = function (event) {
          //接受的为字符串
          let data = JSON.parse(event.data);
          console.log(data)
          if (data.code == 200) {
               // 系统连接成功消息不加载
               if (data.date.sid == 0) {

                    return false;
               }
               // 接受对方的信息
               console.log(data)
               sendMes1(data.date.types, data.date);
          } else {
               if (data.code == 666) {
                    setTimeout(() => {
                         editStatus();//切换状态
                    }, 1000)
                    return false;
               }
               setMessage({
                    type: 'warning',
                    msg: data.msg
               })
          }

     };
     //连接关闭的回调方法
     backupsWebSocket.onclose = function () {
          console.log('关闭')
     };
     //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
     backupsWebSocket.onbeforeunload = function () {
          // 回手离开
          backupsWebSocket.send(JSON.stringify({
               types: 3,
               sid: userInfo.id,
               rid: ida,
               messageBody: ''
          }));
          backupsWebSocket.close();
     }
}
// 未读状态
function editStatus() {
     $('.personB .clearFloat.status').html('');
}
/*左侧联系人模块 */
//ajax动态加载渲染联系人
// $.ajax({
//      url: "http://106.14.135.233:8080/buyCar/Give",
//      type: 'get',
//      //ie10以下跨域，无法请求数据。需要设置；
//      crossDomain: true == !(document.all),
//      success: function (res) {
//           var result = $.parseJSON(res);
//           $.each(result, function (index, obj) {
//                var dom = "";
//                dom += '<div class="perMessage" id=' + obj.id + '>';
//                dom += '<img src =' + obj.pic + '>';
//                dom += '<span class="name fontCommon">' + obj.name + '</span>';
//                dom += '</div >'
//                $('.jimi-left-content').append(dom);
//           })
//           $('.jimi-left-content').on('click', '.perMessage', function () {
//                var id = $(this).attr("id");
//                chatWith(id);
//           })
//      }
// })

//点击联系人改变样式
$(".jimi-left-content").on("click", "div", function () {
     $(".jimi-left-content div").eq($(this).index())
          .attr("style", "background:#D2E6F9")
          .siblings().removeAttr("style");
});

// 关闭
$('.operation span').click(function () {
     console.log('关闭离开');
     // 回手离开
     backupsWebSocket.send(JSON.stringify({
          types: 3,
          sid: userInfo.id,
          rid: ida,
          messageBody: ''
     }));
     // 关闭长连接
     backupsWebSocket.close();
     window.history.go(-1);
})
setScroll();
// 重新获取高度，使其保持在最底部
function setScroll() {
     var showContent = $(".chatBox");
     showContent[0].scrollTop = showContent[0].scrollHeight;
}
var staid = -1;
var numberd = -1;
//更多消息记录
$("#gengduo").click(function () {
     chat()
})

//更多消息接口
function chat() {
     ajax({
          url: 'member-api-impl/im/chatRecord',
          methods: 'get',
          data: {
               sid: userInfo.id,
               rid: ida,
               chatId: staid,
               number: numberd,
          },
          success: function (response) {
               if (response.code == 200) {
                    if (response.data.data != '') {
                         var add = response.data.data.reverse() ///反转
                         staid = add[0].id
                         numberd = response.data.number
                         for (var i = 0; i < add.length; i++) {
                              if (response.data.data[i].sid == ida) {
                                   sendMesh1(response.data.data[i].types, response.data.data[i]);
                              } else if (response.data.data[i].sid == userInfo.id) {
                                   sendMesh(response.data.data[i].types, response.data.data[i]);
                              }
                         }
                    } else {
                         $('.chattingRecords').remove()
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
chat();