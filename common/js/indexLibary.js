// 主要为index.js中调用的函数
// 通用事件处理函数
var ida = getQueryString('id');
console.log(ida)
function bindEvent(elem, type, fn) {
     if (window.addEventListener) {
          return elem.addEventListener(type, fn);
     } else {
          // ie8
          return elem.attachEvent("on" + type, fn);
     }
}

//事件代理,用于后面点击单个表情
function eventProxy(elem, type, selector, fn) {
     if (fn == null) {
          fn = selector;
          selector = null;
     }
     bindEvent(elem, type, function (e) {
          var e = e || event;
          var target = e.target || e.srcElement;
          //兼容ie8及以下浏览器event
          if (selector) {
               if (matchesSelector(target, selector)) {
                    fn.call(target, e);
               }
          } else {
               fn(e);
          }
     })
}

//切换图片地址obj:dom对象 index:索引，对应哪个元素 type:0（背景） 1（背景2）
function getSRC(obj, index, type) {
     var src = "";
     if (type === 0) {
          if (index === 0) {
               src = pathCommon + "common/images/smileB.png";
          } else if (index === 1) {
               src = pathCommon + "common/images/pictureB.png";
          } else {
               src = pathCommon + "common/images/heartB.png";
          }
     } else {
          if (index === 0) {
               src = pathCommon + "common/images/simile.png";
          } else if (index === 1) {
               src = pathCommon + "common/images/picture.png";
          } else {
               src = pathCommon + "common/images/heart.png";
          }
     }
     obj.src = src;
}

var dataxin = {};
//个人信息
productDetails()
function productDetails() {
     ajax({
          methods: 'post',
          url: 'member-api-impl/user/accountDetail',
          data: {},
          success: function (response) {
               if (response.code == 200) {
                    dataxin = response.data
               } else {
                    setMessage({
                         type: 'warning',
                         msg: response.msg
                    });
               }

          },
          error: function (response) { }
     })
}
//接收者信息
var receivexin = {};
productDetailsa()
function productDetailsa() {
     ajax({
          methods: 'get',
          url: 'member-api-impl/im/getReciveInfo',
          data: {
               rid: getQueryString('id'),
               isSupplier: getQueryString('isSupplier') ? 1 : 0
          },
          success: function (response) {
               if (response.code == 200) {
                    receivexin = response.data
                    if (response.data.userImage != '') {
                         $(".right-pane .head .title").attr('src', response.data.userImage)
                    }
                    if (response.data.nickname != '') {
                         $(".right-pane .head .names").html(response.data.nickname)
                    }
               } else {
                    setMessage({
                         type: 'warning',
                         msg: response.msg
                    });
               }

          },
          error: function (response) { }
     })
}
//发送消息函数，后面可封装成客服和用户类型，以及发送类型的功能
function sendMes(type, obj) {
     var dom = "";
     dom += '<div class="personB">';
     if (dataxin.nickname) {
          dom += '<div class="personNameB fontCommon">' + dataxin.nickname + '</div>';
     } else {
          dom += '<div class="personNameB fontCommon">官方弟弟</div>';
     }
     dom += '<div class="clearFloat"></div>';
     dom += '<div class="personContentB">';
     if (dataxin.userImage) {
          dom += '<img src="' + dataxin.userImage + '">';
     } else {
          dom += '<img src="' + pathCommon + 'common/images/star.png" alt="">';
     }

     dom += '<span class="talkContentB fontCommon">';
     dom += '<span class="time">' + parseTime(new Date(), '{y}-{m}-{d} {h}:{i}:{s}') + '</span>'
     if (type === 0) {
          dom += obj;
     } else if (type === 1) {
          dom += '<img src=' + obj + '>'
     } else {
          dom += '<div class = "goodsLatest">'
          dom += obj;
          dom += '</div>'
     }
     dom += '</span>';
     dom += '<span class="triangleB"></span>';
     dom += '</div>';
     dom += '<div class="clearFloat status">未读</div>';
     dom += '</div>';
     //插入节点之后清空dom，否则干扰下一次运行
     $('.chatBox').append(dom);
     dom = "";
     //发送完毕消息后，清空输入框；
     $('.textarea').text('');
     //发送内容后重新获取高度，使其保持在最底部
     showContent = $(".chatBox");
     showContent[0].scrollTop = showContent[0].scrollHeight;
}
// 接收商铺的消息
function sendMes1(type, obj) {
     var dom = "";
     var dom = '<div class="personA">';
     if (receivexin.nickname) {
          dom += '<div class="personNameA fontCommon">' + receivexin.nickname + '</div>';
     } else {
          dom += '<div class="personNameA fontCommon">官方弟弟</div>';
     }
     dom += '<div class="personContent">';
     if (receivexin.userImage) {
          dom += '<img src="' + receivexin.userImage + '">';
     } else {
          dom += '<img src="' + pathCommon + 'common/images/star.png" alt="">';
     }
     dom += '<span class="triangle"></span>';
     dom += '<span class="talkContent fontCommon marginLeft">';
     dom += '<span class="time">' + obj.time + '</span>';
     if (type === 0) {
          dom += obj.messageBody;
     } else if (type === 1) {
          dom += '<img src=' + obj.messageBody + '>'
     } else {
          dom += '<div class = "goodsLatest">'
          dom += obj.messageBody;
          dom += '</div>'
     }
     dom += '</span>';
     dom += '</div>';
     dom += '</div>';
     //插入节点之后清空dom，否则干扰下一次运行
     $('.chatBox').append(dom);
     dom = "";
     //发送完毕消息后，清空输入框；
     $('.textarea').text('');
     //发送内容后重新获取高度，使其保持在最底部
     showContent = $(".chatBox");
     showContent[0].scrollTop = showContent[0].scrollHeight;
}
//后面添加 个人
function sendMesh(type, obj) {
     var dom = "";
     dom += '<div class="personB">';
     if (dataxin.nickname) {
          dom += '<div class="personNameB fontCommon">' + dataxin.nickname + '</div>';
     } else {
          dom += '<div class="personNameB fontCommon">官方弟弟</div>';
     }
     dom += '<div class="clearFloat"></div>';
     dom += '<div class="personContentB">';
     if (dataxin.userImage) {
          dom += '<img src="' + dataxin.userImage + '">';
     } else {
          dom += '<img src="' + pathCommon + 'common/images/star.png" alt="">';
     }

     dom += '<span class="talkContentB fontCommon">';
     dom += '<span class="time">' + obj.pushTime + '</span>';
     if (type === 0) {
          dom += obj.messageBody;
     } else if (type === 1) {
          dom += '<img src=' + obj.messageBody + '>'
     } else {
          dom += '<div class = "goodsLatest">'
          dom += obj.messageBody;
          dom += '</div>'
     }
     dom += '</span>';
     dom += '<span class="triangleB"></span>';
     dom += '</div>';
     var text = '';
     var name = '';
     if (obj.state == 2) {
          text = '未读';
          name = 'status';
     }
     dom += '<div class="clearFloat ' + name + '">' + text + '</div>';
     dom += '</div>';
     //插入节点之后清空dom，否则干扰下一次运行
     $('.chatBox .chattingRecords').after(dom);
     dom = "";
     //发送完毕消息后，清空输入框；
     $('.textarea').text('');
     //发送内容后重新获取高度，使其保持在最底部
     showContent = $(".chatBox");
     showContent[0].scrollTop = showContent[0].scrollHeight;
}
//商铺
function sendMesh1(type, obj) {
     var dom = "";
     var dom = '<div class="personA">';
     if (receivexin.nickname) {
          dom += '<div class="personNameA fontCommon">' + receivexin.nickname + '</div>';
     } else {
          dom += '<div class="personNameA fontCommon">官方弟弟</div>';
     }
     dom += '<div class="personContent">';
     if (receivexin.userImage) {
          dom += '<img src="' + receivexin.userImage + '">';
     } else {
          dom += '<img src="' + pathCommon + 'common/images/star.png" alt="">';
     }
     dom += '<span class="triangle"></span>';
     dom += '<span class="talkContent fontCommon marginLeft">';
     dom += '<span class="time">' + obj.pushTime + '</span>'
     if (type === 0) {
          dom += obj.messageBody;
     } else if (type === 1) {
          dom += '<img src=' + obj.messageBody + '>'
     } else {
          dom += '<div class = "goodsLatest">'
          dom += obj.messageBody;
          dom += '</div>'
     }
     dom += '</span>';
     dom += '</div>';
     dom += '</div>';
     //插入节点之后清空dom，否则干扰下一次运行
     $('.chatBox .chattingRecords').after(dom);
     dom = "";
     //发送完毕消息后，清空输入框；
     $('.textarea').text('');
     //发送内容后重新获取高度，使其保持在最底部
     showContent = $(".chatBox");
     showContent[0].scrollTop = showContent[0].scrollHeight;
}
//由于部分浏览器对matcher() 方法不支持
function matchesSelector(element, selector) {
     if (element.matches) {
          return element.matches(selector);
     } else if (element.matchesSelector) {
          return element.matchesSelector(selector);
     } else if (element.webkitMatchesSelector) {
          return element.webkitMatchesSelector(selector);
     } else if (element.msMatchesSelector) {
          return element.msMatchesSelector(selector);
     } else if (element.mozMatchesSelector) {
          return element.mozMatchesSelector(selector);
     } else if (element.oMatchesSelector) {
          return element.oMatchesSelector(selector);
     } else if (element.querySelectorAll) {
          var matches = (element.document || element.ownerDocument).querySelectorAll(selector),
               i = 0;
          while (matches[i] && matches[i] !== element) i++;
          return matches[i] ? true : false;
     }
     throw new Error('不支持您的上古浏览器！');
}

// 获取图片
function getObjectURL(file) {
     var url = null;
     if (window.createObjcectURL != undefined) {
          url = window.createOjcectURL(file);
     } else if (window.URL != undefined) {
          url = window.URL.createObjectURL(file);
     } else if (window.webkitURL != undefined) {
          url = window.webkitURL.createObjectURL(file);
     }
     // alert(url)
     // console.log(url);
     return url;
}

//请求客服详情
function chatWith(id) {
     $.ajax({
          url: "http://106.14.135.233:8080/buyCar/getProFlex",
          type: 'get',
          data: {
               spID: id
          },
          //ie10以下跨域，无法请求数据。需要设置；
          crossDomain: true == !(document.all),
          success: function (res) {
               var result = $.parseJSON(res);
               $('.head').children('span').text(result[0].pName);
               console.log(result[0].p1)
               $('.head').children('img').attr('src', result[0].p1);
               $('.personNameA').text(result[0].pName);
               $('.personA img').attr('src', result[0].p1);
               $('.personNameA').each(function () {
                    var words = $(this).text().length;
                    if (words > 20) {
                         $(this).text($(this).text().slice(0, 10) + "...");
                    }
               });
          }
     })
}