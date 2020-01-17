// var baseUrl = 'http://192.168.0.96:8704/'; //王
// var baseUrl = 'http://192.168.0.173:8705/'; //徐
// var baseUrl = 'http://192.168.0.137:8704/'; //曹
//  var baseUrl = 'http://192.168.0.233:8704/'; //俞
// var baseUrl = 'http://192.168.0.120:8704/' //测试
// var baseUrl = 'https://test.ixgoo.cn/' //外网测试
var baseUrl = 'https://www.ixgoo.cn/' //生产
// var baseUrl = 'http://192.168.0.98:8704/' //吴
var pathCommon = '/shoppingPlatformPC/';
var pathName = window.location.origin || window.location.hostname;
// 兼容ie
if (pathName == 'www.ixgoo.cn' || pathName == 'test.ixgoo.cn' || pathName == 'https://test.ixgoo.cn' || pathName == 'https://www.ixgoo.cn') {
     pathCommon = '/'
} else if (pathName == 'http://192.168.0.121:8081') {
     pathCommon = '/web/shoppingPlatformPC/'
}
jQuery.cookie = function (name, value, options) {
     if (typeof value != 'undefined') {
          options = options || {};
          if (value === null) {
               value = '';
               options = $.extend({}, options);
               options.expires = -1;
          }
          var expires = '';
          if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
               var date;
               if (typeof options.expires == 'number') {
                    date = new Date();
                    date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
               } else {
                    date = options.expires;
               }
               expires = '; expires=' + date.toUTCString();
          }
          var path = options.path ? '; path=' + (options.path) : '';
          var domain = options.domain ? '; domain=' + (options.domain) : '';
          // var secure = options.secure ? '; secure' : '';
          var secure = true;
          document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
     } else {
          var cookieValue = null;
          if (document.cookie && document.cookie != '') {
               var cookies = document.cookie.split(';');
               for (var i = 0; i < cookies.length; i++) {
                    var cookie = jQuery.trim(cookies[i]);
                    if (cookie.substring(0, name.length + 1) == (name + '=')) {
                         cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                         break;
                    }
               }
          }
          return cookieValue;
     }
};

//接口封装
function ajax(parameters) {
     var token = $.cookie('token') ? $.cookie('token') : '';
     jQuery.support.cors = true;
     if (parameters.url != 'member-api-impl/longin/getcode' && parameters.url != 'member-api-impl/longin/getImagecCode' && parameters.url != 'member-api-impl/longin/phoneLogin') {
          // isToken();
     }
     var timestamp = (new Date()).valueOf();
     var flg = parameters.url.indexOf('?');
     var connector = '&';
     if (flg == -1) {
          connector = '?';
     }

     $.ajax({
          headers: {
               'content-type': 'application/json',
               token: token,
               // token:'031b5f0ef4db46a58c6f2c11c900d9c75',
               loginType: 1
          },
          type: parameters.methods,
          url: baseUrl + parameters.url + connector + 'timestamp=' + timestamp,
          async: true, //异步
          dataType: "json",
          data: parameters.methods == 'get' ? parameters.data : JSON.stringify(parameters.data),
          success: function (response) {
               if (response.code == 999) {
                    $.cookie('token', '', {
                         expires: -1
                    });
                    $.cookie('userInfo', '', {
                         expires: -1
                    });
                    setMessage({
                         type: 'warning',
                         msg: '请登录'
                    })
                    if (parameters.url == 'member-api-impl/user/myHome') {
                         parameters.success(response);
                         return false;
                    }
                    // window.location.href = pathCommon + "login.html";
                    return false;
               } else {
                    parameters.success(response);
               }
          },

          error: function (response) {
               console.log(response)
          }
     });
}
// 统一添加ico
function icnAdd() {
     var dom = '<link rel="icon" href="' + pathCommon + 'common/images/ico.ico' + '" type="image/x-icon" />' + '<link rel="shortcut icon" href="' + pathCommon + 'common/images/ico.ico' + '" type="image/x-icon"/>';
     $('head').append(dom);
}
icnAdd();
// 正整数
function positiveIntegerMoney(that, max) {
     if (that.value.length == 1) {
          that.value = that.value.replace(/[^1-9]/g, '');
     } else {
          that.value = that.value.replace(/\D/g, '');
     }
     if (max && that.value > max) {
          that.value = '';
          setMessage({
               type: 'warning',
               msg: '不能大于' + max
          });

     }
     return that.value;
}
// 可输0
function positiveIntegerMoney1(that, max) {
     if (that.value.length == 1) {
          that.value = that.value.replace(/[^0-9]/g, '');
     } else {
          that.value = that.value.replace(/\D/g, '');
     }
     if (max && that.value > max) {
          that.value = '';
          setMessage({
               type: 'warning',
               msg: '不能大于' + max
          });

     }
     return that.value;
}
//两位小数
function twoDecimalPlaces(that, maxMoney) {
     that.value = that.value.replace(/[^\d.]/g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
     // //首位不能为.
     if (that.value !== '' && that.value === '.') {
          that.value = '';
     }
     // //以上已经过滤,此处控制的是如果没有小数点,首位不能为类似于01,02的金额
     if (that.value.indexOf('.') < 0 && that.value !== '') {
          if (that.value.length === 2) {
               that.value = parseFloat(that.value)
          }
          //第一位不能为.
          if (that.value === '.') {
               that.value = ''
          }
     }
     //如果有小小金钱大小限制，传入money
     if (maxMoney) {
          if (that.value > maxMoney) {
               that.value = '';
               setMessage({
                    type: 'warning',
                    msg: '不能大于' + maxMoney
               });
          }
     }
     return that.value
}
//获取url参数
function getQueryString(name) {
     var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
     var r = (window.location.search ? window.location.search : window.location.hash).substr(1).match(reg);
     if (r != null) return unescape(r[2]);
     return null;
}
// cookie
function setCookies1(key, value, iDays) {
     var day = new Date();
     day.setDate(day.getDate() + iDays);
     document.cookie = key + "=" + value + ";expires=" + day.toGMTString();
}

function setCookies(name, value) {
     var Days = 30;
     var exp = new Date();
     exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
     document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}

function getCookie(key) {
     var str = document.cookie;
     if (str == null || str == undefined || str == '') {
          return "";
     }
     var arr = str.split("; ");
     for (var i = 0; i < arr.length; i++) {
          var arr2 = arr[i].split("=");
          if (key == arr2[0]) {
               return arr2[1]
          }
     }
     return "";
}

function removeCookie(key) {
     setCookies(key, "", -1);
}

function isToken() {
     var token = $.cookie('token');
     // console.log(token)
     if (!token) {
          setMessage({
               type: 'warning',
               msg: '没有登陆， 请去登陆'
          });
          setTimeout(function () {
               window.location.href = pathCommon + 'login.html';
          }, 800)
     }
}

function getUserBean() {
     var userstr = getCookie("user");
     if (userstr == null || userstr == undefined || userstr == '') {
          return null;
     }
     return JSON.parse(userstr);
}


function parseTime(time, cFormat) {
     if (arguments.length === 0) {
          return null;
     }
     if (time === undefined || time === null)
          return '';

     var format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}';
     var date;
     if (typeof time == 'object') {
          date = time;
     } else {
          if (('' + time).length === 10) time = parseInt(time) * 1000;
          date = new Date(time);
     }
     var formatObj = {
          y: date.getFullYear(),
          m: date.getMonth() + 1,
          d: date.getDate(),
          h: date.getHours(),
          i: date.getMinutes(),
          s: date.getSeconds(),
          a: date.getDay()
     };
     var time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, function (result, key) {
          var value = formatObj[key];
          if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1];
          if (result.length > 0 && value < 10) {
               value = '0' + value;
          }
          return value || 0;
     });
     return time_str;
}

// 判断ie
function isIE() {
     if (window.navigator.userAgent.indexOf("MSIE") >= 1) {
          return true;
     } else {
          return false;
     }
}
// 设置indexof
function setIndexOf() {
     if (!Array.prototype.indexOf) {
          Array.prototype.indexOf = function (val) {
               var value = this;
               for (var i = 0; i < value.length; i++) {
                    if (value[i] == val) return i;
               }
               return -1;
          };
     }
}
setIndexOf();
// 判断是否是图片格式
function judgeImageType(file, status) {
     var type = [];
     type = file.val().split('.');
     var typeArr = [];
     if (status) {
          typeArr = ['xlsx'];
     } else {
          typeArr = ['jpg', 'jpeg', 'png', 'PNG', 'JPG', 'JPEG'];
     }

     // 验证通过
     if (typeArr.indexOf(type[type.length - 1]) != -1) {
          return true;
     } else {
          if (status) {
               setMessage({
                    type: 'warning',
                    msg: '上传的文件为.xlsx!'
               });
               return false;
          } else {
               setMessage({
                    type: 'warning',
                    msg: '上传的图片只能是 JPG、JPEG、png、PNG 格式!'
               });
               return false;
          }

     }
}
// 判断版本
function IEVersion() {
     var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串  
     var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器  
     var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器  
     var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
     if (isIE) {
          var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
          reIE.test(userAgent);
          var fIEVersion = parseFloat(RegExp["$1"]);
          if (fIEVersion == 7) {
               return 7;
          } else if (fIEVersion == 8) {
               return 8;
          } else if (fIEVersion == 9) {
               return 9;
          } else if (fIEVersion == 10) {
               return 10;
          } else {
               return 6; //IE版本<=7
          }
     } else if (isEdge) {
          return 'edge'; //edge
     } else if (isIE11) {
          return 11; //IE11  
     } else {
          return -1; //不是ie浏览器
     }
}
function myBrowser() {
     var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
     var isOpera = userAgent.indexOf("Opera") > -1;
     if (isOpera) { //判断是否Opera浏览器
          return "Opera"
     }
     ;
     if (userAgent.indexOf("Firefox") > -1) { //判断是否Firefox浏览器
          return "FF";
     }
     ;
     if (userAgent.indexOf("Chrome") > -1) {
          return "Chrome";
     }
     ;
     if (userAgent.indexOf("Safari") > -1) { //判断是否Safari浏览器
          return "Safari";
     }
     ;
     if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) { //判断是否IE浏览器
          return "IE";
     }
     ;
}
// maxlength ie 10以下不能用
function inputMaxLength(that, max) {
     if (IEVersion() < 10 && IEVersion() != -1) {
          var input = $(that);
          if (input.val().length >= max) {
               input.val(input.val().substr(0, max))
          }
     }

}
//提示
function setMessage(options) {
     //  三个值 msg, type, time
     // type  warning， success
     var alertMsg = '<div class="alertMsg ';
     var arr = window.location.pathname.split('/');
     var path = '../';
     if (arr[arr.length - 1] == 'login.html' || arr[arr.length - 1] == 'index.html') {
          path = '';
     }
     alertMsg += options.type + '">';
     var symbol = options.type == 'success' ? '<img class="fl" src="' + pathCommon + 'common/images/success.png">' : '<img class="fl" src="' + pathCommon + 'common/images/error.png">';
     alertMsg += symbol;
     alertMsg += options.msg;
     $('body').append(alertMsg);
     var number = options.time ? options.time : 2700;
     setTimeout(function () {
          $('div.alertMsg').remove();
     }, number)
}
// 确认提示 
function seTconfirmation(title, msg, options) {
     $('.confirmation-common').remove();
     var dom = '';
     dom += '<div class="confirmation-common">';
     dom += '<div class="dog_alert"></div>';
     dom += ' <div class="text">';
     dom += ' <div class="alert-center">';
     dom += ' <div>';
     var arr = window.location.pathname.split('/');
     var path = '';
     if (arr[arr.length - 1] != 'login.html' && arr[arr.length - 1] != 'index.html') {
          path = '../'
     }
     dom += title + '<img class="fr closeConfirmation" src="' + pathCommon + 'common/images/delete.png" alt="" ></div>';
     dom += '<p>' + msg + '</p>';
     dom += '<div class="btn">';
     dom += '<button class="closeConfirmation">取消</button><button class="submitData">确认</button>';
     dom += '</div>';
     dom += '</div>';
     dom += '</div>';
     dom += ' </div>';
     $('body').off('click', '.closeConfirmation');
     $('body').off('click', '.submitData');
     $('body').append(dom);
     $('body').on('click', '.closeConfirmation', function () {
          $('.confirmation-common').css('display', 'none');
          options.cath();

     })
     $('body').on('click', '.submitData', function () {
          // 确认需要自己隐藏
          options.then();
     })

}
// load 加载
function setLoad() {
     $('.confirmation-common').remove();
     var dom = '';
     dom += '<div class="confirmation-common">';
     dom += '<div class="dog_alert"></div>';
     dom += '<img class="load" src="' + pathCommon + 'common/images/loading.gif">';
     dom += ' </div>';
     $('body').append(dom);
}
// 卖家中心导航

function applySellerCenter(id) {
     var name = [{
          path: 'sellercenter.html',
          name: '村/户店商认证',
          children: [{
               path: 'topupOrWithdraw.html'
          },
          {
               path: 'addAccount.html'
          }
          ]
     },
     {
          path: 'transactionManage.html',
          name: '交易管理'
     },
     {
          path: 'logisticsManage.html',
          name: '物流管理',
          children: [{
               path: 'addNewEMS.html'
          }]
     },
     {
          path: 'templateOfFreight.html',
          name: '运费模板',
          children: [{
               path: 'freightCompile.html'
          }]
     },
     {
          path: 'productsManage.html',
          name: '商品管理',
          children: [{
               path: 'addProducts.html'
          },
          {
               path: 'addSpecification.html'
          }
          ]
     },
     {
          path: 'customerService.html',
          name: '客户服务'
     },
     {
          path: 'eveManagement.html',
          name: '评价管理'
     },
     // {
     //      path: 'villagerList.html',
     //      name: '村民名录'
     // },
     {
          path: 'dataStatistics.html',
          name: '数据统计'
     },
     {
          path: 'advertisementManage.html',
          name: '广告图管理'
     },
     {
          path: 'announCementManage.html',
          name: '公告管理',
          children: [{
               path: 'announCement.html'
          }
          ]
     }
     ]
     Centerdatafile(id, name); //导航对比
}
// 供应商导航

function applySupplierCenter(id) {
     var name = [{
          path: 'sellercenter.html',
          name: '爱心供应商认证',
          children: [{
               path: 'topupOrWithdraw.html'
          },
          {
               path: 'addAccount.html'
          }
          ]
     },
     {
          path: 'transactionManage.html',
          name: '交易管理'
     },
     {
          path: 'logisticsManage.html',
          name: '物流管理',
          children: [{
               path: 'addNewEMS.html'
          }]
     },
     {
          path: 'templateOfFreight.html',
          name: '运费模板',
          children: [{
               path: 'freightCompile.html'
          }]
     },
     {
          path: 'productsManage.html',
          name: '商品管理',
          children: [{
               path: 'addProducts.html'
          },
          {
               path: 'addSpecification.html'
          }
          ]
     },
     {
          path: 'customerService.html',
          name: '客户服务'
     },
     // {
     //      path: 'distributionManage.html',
     //      name: '分销管理'
     // },
     {
          path: 'eveManagement.html',
          name: '评价管理'
     },
     {
          path: 'dataStatistics.html',
          name: '数据统计'
     }
          // ,
          //  {
          //      path: 'announCementManage.html',
          //      name: '公告管理',
          //      children: [{
          //           path: 'announCement.html'
          //      }
          //      ]
          // }
          // {
          //      path: 'advertisementManage.html',
          //      name: '广告图管理'
          // }
     ]
     Centerdatafile(id, name); //导航对比
}
//导航对比 数据
function Centerdatafile(id, name) {
     var arr = window.location.pathname.split('/');
     var dom = '<ul class="centre-left-nav">';
     for (var i = 0; i < name.length; i++) {
          if (arr[arr.length - 1] == name[i].path) {
               dom += '<li class="hover"><a href="' + name[i].path + '">' + name[i].name + '</a></li>';
          } else {
               if (name[i].children && name[i].children.length > 0) {
                    var list = name[i].children;
                    var flg = false;
                    for (var k = 0; k < list.length; k++) {
                         if (list[k].path == arr[arr.length - 1]) {
                              flg = true;
                         }
                    }
                    if (flg) {
                         dom += '<li class="hover"><a href="' + name[i].path + '">' + name[i].name + '</a></li>';
                    } else {
                         dom += '<li><a href="' + name[i].path + '">' + name[i].name + '</a></li>';
                    }
               } else {
                    dom += '<li><a href="' + name[i].path + '">' + name[i].name + '</a></li>';
               }
          }
     }
     dom += '</ul>'
     $(id).append(dom)
}
// 提现和充值
function moneyModuleNav(id, name) {
     var obj = {
          sellerCenter: [{
               path: 'sellercenter.html',
               name: '村/户店商认证'
          },
          {
               path: 'transactionManage.html',
               name: '交易管理'
          },
          {
               path: 'logisticsManage.html',
               name: '物流管理'
          },
          {
               path: 'productsManage.html',
               name: '商品管理'
          },
          {
               path: 'customerService.html',
               name: '客户服务'
          },
          // {
          //      path: 'villagerList.html',
          //      name: '村民名录'
          // },
          {
               path: 'dataStatistics.html',
               name: '数据统计'
          },
               // {
               //      path: 'announCement.html',
               //      name: '公告管理'
               // }
          ],
          supplierCenter: [{
               path: '../supplierCenter/sellercenter.html',
               name: '爱心供应商认证'
          },
          {
               path: '../supplierCenter/transactionManage.html',
               name: '交易管理'
          },
          {
               path: '../supplierCenter/logisticsManage.html',
               name: '物流管理',
               children: [{
                    path: 'addNewEMS.html'
               }]
          },
          {
               path: '../supplierCenter/productsManage.html',
               name: '商品管理'
          },
          {
               path: '../supplierCenter/customerService.html',
               name: '客户服务'
          },
          {
               path: '../supplierCenter/distributionManage.html',
               name: '分销管理'
          },
          {
               path: '../supplierCenter/dataStatistics.html',
               name: '数据统计'
          },
               // {
               //      path: '../supplierCenter/announCement.html',
               //      name: '公告管理'
               // }
          ],
          personCenter: [{
               path: '../personCenter/accountInfo.html',
               name: '账户资料'
          },
          {
               path: '../personCenter/addAccount.html',
               name: '账户信息'
          },
          ]
     }

     var dom = '<ul class="centre-left-nav">';
     for (var i = 0; i < obj[name].length; i++) {
          if (i == 0 && name != 'personCenter') {
               dom += '<li class="hover"><a href="' + obj[name][i].path + '">' + obj[name][i].name + '</a></li>';
          } else {
               if (i == 1 && name == 'personCenter') {
                    dom += '<li class="hover"><a href="' + obj[name][i].path + '">' + obj[name][i].name + '</a></li>';
               } else {
                    dom += '<li ><a href="' + obj[name][i].path + '">' + obj[name][i].name + '</a></li>';
               }
          }
     }
     dom += '</ul>';
     $(id).append(dom)
}
// 公用顶部头部
function headerTop(id) {
     var userinfo = $.cookie('userInfo') ? JSON.parse($.cookie('userInfo')) : '';
     // console.log(userinfo)
     var topdom = ' <div class="body-center">';
     topdom += '<div class="fl left"><a href="' + pathCommon + 'index.html' + '">爱心购首页</a></div>';
     topdom += '<ul class="fr right">';
     topdom += ' <li class="fl">';
     // topdom += ' <img class="fl" src="" alt="">';
     topdom += '<span class="fl"><a href="' + pathCommon + 'downLoadApp.html"">下载APP</a></span>';
     topdom += ' <span class="fl write">|</span>';
     topdom += ' </li>';
     topdom += '<li class="fl">';
     topdom += '<img src="' + (userinfo.userImage ? userinfo.userImage : pathCommon + 'common/images/star.png') + '" width="100%" height="100%" style="display:block" alt="">';
     topdom += '</li>'
     topdom += '<li class="fl name">'
     topdom += '<span>' + (userinfo && userinfo.nickname) + '</span>';
     topdom += '</li>';
     topdom += '<li class="fl" id="loginout">退出</li>';
     topdom += '</ul>';
     topdom += '</div>';
     $(id).append(topdom);
}

// 头部导航
function headerNav(id) {
     var arr = window.location.pathname.split('/');
     var nav = [{
          path: 'sellerCenter',
          name: '村/户店商',
          childrenpath: '/sellercenter.html'
     },
     {
          path: '',
          name: '经销商',
          noShow: true
     },
     {
          path: 'supplierCenter',
          name: '爱心供应商',
          childrenpath: '/sellercenter.html'
     },
     {
          path: 'administrative',
          name: '政府/机构信息',
          childrenpath: '/administrativeagencies.html'
     },
     {
          path: 'personCenter',
          name: '个人中心',
          childrenpath: '/accountInfo.html',
          noShow: true
     }
     ];
     var dom = '<div class="body-center"><div class="fl left" onclick="goUrl()">';
     dom += '<img class="fl logo" src="../common/images/s-logo.png" alt="" >';
     dom += '</div>'
     var obj = getQueryString('name') ? getQueryString('name') : arr[arr.length - 2];
     // 右侧导航
     dom += '<ul class="fr right">';
     var data = $.cookie('userInfo') ? JSON.parse($.cookie('userInfo')) : {};
     // console.log(data)
     for (var j = 0; j < nav.length; j++) {
          if (!nav[j].noShow) {
               if (data.types == 0) {
                    if (obj == nav[j].path) {
                         dom += '<li class="fl right_nav hover"><a href="../' + nav[j].path + nav[j].childrenpath + '">' + nav[j].name + '</a><i class="top-triangle"></i></li>';
                    } else {
                         dom += '<li class="fl right_nav"><a href="../' + nav[j].path + nav[j].childrenpath + '">' + nav[j].name + '</a></li>';
                    }
               }
               if (data.types == 1) {
                    if (nav[j].name != "爱心供应商") {
                         // console.log(nav[j])
                         if (obj == nav[j].path) {
                              // console.log(nav[j].name)
                              dom += '<li class="fl right_nav hover"><a href="../' + nav[j].path + nav[j].childrenpath + '">' + nav[j].name + '</a><i class="top-triangle"></i></li>';
                         } else {
                              // console.log(nav[j].name)
                              dom += '<li class="fl right_nav"><a href="../' + nav[j].path + nav[j].childrenpath + '">' + nav[j].name + '</a></li>';
                         }
                    }

               }
               if (data.types == 2) {
                    if (nav[j].name != "村/户店商") {
                         if (obj == nav[j].path) {
                              dom += '<li class="fl right_nav hover"><a href="../' + nav[j].path + nav[j].childrenpath + '">' + nav[j].name + '</a><i class="top-triangle"></i></li>';
                         } else {
                              dom += '<li class="fl right_nav"><a href="../' + nav[j].path + nav[j].childrenpath + '">' + nav[j].name + '</a></li>';
                         }
                    }
               }


          }
     }
     // 个人中心的头像
     dom += '<li class="fl last">';
     dom += '<a href="../personCenter/accountInfo.html">';
     var userInfo = $.cookie('userInfo') ? JSON.parse($.cookie('userInfo')) : {};
     var src = userInfo.updateTime ? userInfo.updateTime : pathCommon + 'common/images/star.png';
     dom += '<img class="fl" src="' + src + '" alt="">';
     dom += '</a>'
     dom += '</li>';
     dom += '</ul>';
     dom += '</div>';
     $(id).append(dom);
}

// 公共跳转方法
function goUrl(url) {
     var url = url ? url : '';
     window.location.href = pathCommon + url;
}
//判断卖家中心 左侧导航  村民名录
function shopHeaderleft() {
     var userinfo = $.cookie('userInfo') ? JSON.parse($.cookie('userInfo')) : '';
     if (userinfo.types == 8) {
          // $('#centre-left-nav .centre-left-nav li').eq(7).hide()
     }
};
//买家公用顶部 Top
function shopHeaderTop(id) {
     var userinfo = $.cookie('userInfo') ? JSON.parse($.cookie('userInfo')) : '';
     var isLogin = $.cookie('token') && userinfo;
     var topdom = '<div class="top"><img style="width: 1200px;" src="' + pathCommon + 'common/images/tophead.png"></div>'
     topdom += '<div class="bottom">';
     topdom += ' <div class="body-center topbox">';
     if ($.cookie('token')) {
          if (userinfo.types == 1) {
               topdom += '<a href="' + pathCommon + 'sellerCenter/sellercenter.html" class="seller-center">村集体商户</a>';
          } else if (userinfo.types == 2) {
               topdom += '<a style="margin-left: 20px;" href="' + pathCommon + 'supplierCenter/sellercenter.html" class="seller-center">爱心供销商</a>';
          } else {
               topdom += '<a href="' + pathCommon + 'sellerCenter/sellercenter.html" class="seller-center">村集体商户</a>';
               topdom += '<a style="margin-left: 20px;" href="' + pathCommon + 'supplierCenter/sellercenter.html" class="seller-center">爱心供销商</a>';
               topdom += '<a style="margin-left: 20px;" href="' + pathCommon + 'administrative/administrativeagencies.html" class="seller-center">政府机构</a>';
          }
     } else {
          topdom += '<a href="' + pathCommon + 'purchasingLogin.html" class="seller-center">爱心采购商</a>';
          topdom += '<a style="margin-left: 20px;" href="' + pathCommon + 'supplierLogin.html" class="seller-center">爱心供应商</a>';
          topdom += '<a style="margin-left: 20px;" href="' + pathCommon + 'purchasingLogin.html" class="seller-center">爱心服务商</a>';
          topdom += '<a style="margin-left: 20px;" href="' + pathCommon + 'villageLogin.html" class="seller-center">村集体商户</a>';
          topdom += '<a style="margin-left: 20px;" href="' + pathCommon + 'administrationLogin.html" class="seller-center">政府机构</a>';
     }

     topdom += '<ul class="site-nav fr">';
     if (isLogin) {
          topdom += '<li class="site-nav-menu"><a href="javascript:" class="user-name"><i class="user-icon"><img src="' + (userinfo.userImage ? userinfo.userImage : pathCommon + 'common/images/star.png') + '" width="100%" height="100%" style="display:block" alt=""></i>' + (userinfo && userinfo.nickname) + '</a><span style="font-size: 14px;color:#666;  cursor: pointer;" id="loginout">退出</span></li>';
          topdom += '<li class="site-nav-pipe"></li>';
          topdom += '<li class="site-nav-menu"><a href="' + pathCommon + 'buyerPersonCenter/myshopping.html">我的爱心购<i class="arrow-icon"></i></a></li>';
          topdom += '<li class="site-nav-pipe"></li>';
          topdom += '<li class="site-nav-menu"><a href="' + pathCommon + 'buyerPersonCenter/myOrder.html">我的订单</a></li>';
          topdom += '<li class="site-nav-pipe"></li>';
          topdom += '<li class="site-nav-menu"><a href="' + pathCommon + 'buyerPersonCenter/myCart.html"><i class="cart-icon"></i>购物车</a></li>';
     } else {
          topdom += '<li class="site-nav-menu"><a href="' + pathCommon + 'login.html" class="top-login">请登录</a><a href="' + pathCommon + 'login.html" class="top-register">免费注册</a> </li>';
          topdom += '<li class="site-nav-pipe"></li>';
          topdom += '<li class="site-nav-menu"><a href="' + pathCommon + 'login.html">我的爱心购<i class="arrow-icon"></i></a></li>';
          topdom += '<li class="site-nav-pipe"></li>';
          topdom += '<li class="site-nav-menu"><a href="' + pathCommon + 'login.html">我的订单</a></li>';
          topdom += '<li class="site-nav-pipe"></li>';
          topdom += '<li class="site-nav-menu"><a href="' + pathCommon + 'login.html"><i class="cart-icon"></i>购物车</a></li>';
     }
     topdom += '<li class="site-nav-pipe"></li>';
     topdom += '<li class="site-nav-menu"><a href="' + pathCommon + 'downLoadApp.html"><i class="download-icon"></i>下载APP</a></li>';
     topdom += '<li class="site-nav-pipe"></li>';
     topdom += '<li class="site-nav-menu"><a href="' + pathCommon + 'purchase/helpCenter.html">帮助中心</a></li>';
     topdom += '</ul >';
     topdom += '</div >';
     topdom += '</div>';
     $(id).html(topdom);




}
//买家公用头部 shopHeader
function shopHeader(id) {
     var shopHeaderDom = '<div class="body-center clearfix">';
     shopHeaderDom += '<div class="header-wapper" id="header-wapper">';
     shopHeaderDom += '<h1 class="logo fl"><a href="' + pathCommon + '" style="width:256px;height:47px"></a></h1>';
     shopHeaderDom += '</div>';
     $(id).append(shopHeaderDom);
     // 不同页面显示不同板块
     selectShowModule();
}

var isSearchShop = false;

//买家公用头部搜索 seachbox
function shopHeaderSeach() {
     var seachArr = [];
     var cookieValue = $.cookie('seachArr') || '[]';
     seachArr = JSON.parse(decodeURI(cookieValue));
     var seachDom = '<div id="seachbox" class="seachbox fl">';
     seachDom += '<ul class="seach-tab">';
     seachDom += '<li class="active">商品搜索</li>';
     seachDom += '<li>店铺搜索</li>';
     seachDom += '</ul>';
     seachDom += '<div class="seach-input clearfix">';
     var query = getQueryString('seach') || '';
     seachDom += '<input type="text" class="s-input fl" onkeyup="return seachQuery(event)" id="s-input" placeholder="请输入关键词搜索~" value="' + decodeURI(query) + '">';
     seachDom += '<button class="s-btn fl" id="seachBtn">搜索</button>';
     seachDom += '</div>';
     // 登录显示搜索历史，不登录不显示
     if ($.cookie('token')) {
          seachDom += '<ul class="seach-menu">';
          for (var i = 0; i < seachArr.length; i++) {
               seachDom += '<li><a href="javascript:" onclick="goSeach(\'' + seachArr[i] + '\')">' + seachArr[i] + '</a></li>';
          }
          seachDom += '</ul >';
     }
     seachDom += '</div>';
     $('#header-wapper').append(seachDom);
     $('#seachBtn').click(seachQuery);
     // 搜索tab
     $('.seach-tab li').click(function () {
          $('.seach-tab li').removeClass('active');
          $(this).addClass('active');
          isSearchShop = $(this).index() ? true : false;
     })
     // 搜索方法
     function seachQuery(event) {
          if (event.keyCode !== 13 && event.type != 'click') return;
          window.seachText = $('#s-input').val();
          var p = seachArr.indexOf(seachText);
          if (p != -1) {
               seachArr.splice(p, 1);
          }
          if (seachText != '') {
               seachArr.unshift(seachText);
          }
          if (seachArr.length > 7) {
               seachArr.splice(7);
          }
          if (!isSearchShop) { //搜索商品生成记录
               $.cookie('seachArr', JSON.stringify(seachArr), {
                    expires: 1,
                    secure: true
               });
          }
          goSeach(seachText);
     }

     function goSeach(name) {
          name = encodeURI(encodeURI(name))
          var routerPath = window.location.pathname.split('/');
          var pagePathName = routerPath[routerPath.length - 1];
          if (pagePathName == 'productList.html' || pagePathName == 'storeList.html') {
               //name有值是点击搜索历史搜索（搜索历史是商品历史店铺没有）
               if (isSearchShop) {
                    if (pagePathName != 'storeList.html') { // 搜索店铺且不在店铺列表中
                         window.location.href = pathCommon + 'purchase/storeList.html#seach=' + name;
                    } else {
                         // 搜索店铺在店铺列表中 店铺列表变化页面不跳转
                         if (seachFn) {
                              window.location.hash = '#seach=' + name;
                              seachFn();
                         }
                    }
               } else {
                    if (pagePathName != 'productList.html') { // 搜索商品且不在商品列表中
                         window.location.href = pathCommon + 'purchase/productList.html#seach=' + name;
                    } else {
                         // 搜索商品在商品列表中 商品列表变化页面不跳转
                         if (seachFn) {
                              var ishot = getQueryString('hot') || (window.location.search.indexOf('hot') != -1);
                              if (ishot) {
                                   window.location.href = window.location.href.split('?')[0] +
                                        '#seach=' + name;
                              } else {
                                   window.location.hash = '#seach=' + name;
                              }
                              // 登录显示搜索历史，不登录不显示
                              if ($.cookie('token')) {
                                   var seachDom = ''
                                   for (var i = 0; i < seachArr.length; i++) {
                                        seachDom += '<li><a href="javascript:" onclick="goSeach(\'' + seachArr[i] + '\')">' + seachArr[i] + '</a></li>';
                                   }
                                   $('.seach-menu').html(seachDom);
                              }
                              $('#s-input').valname;
                              seachFn();
                         }
                    }
               }

          } else {
               // 不在商品列表与店铺列表中
               if (isSearchShop) {
                    // 搜索店铺列表
                    window.location.href = pathCommon + 'purchase/storeList.html#seach=' + name;
               } else {
                    // 搜索商品列表
                    window.location.href = pathCommon + 'purchase/productList.html#seach=' + name;
               }
          }
     }
     window.goSeach = goSeach;

     // 把搜索方法挂载到windows 解决 onkeyup 事件
     window.seachQuery = seachQuery;
}


// 订单进度显示
function shopHeaderProgress() {
     var progressDom = '<div class="progress">';
     progressDom += '<dl class="prog-item">';
     progressDom += '<dd class="prog-img">1</dd>';
     progressDom += '<dt class="prog-text"></dt>';
     progressDom += '</dl>';
     progressDom += '<dl class="prog-item">';
     progressDom += '<dd class="prog-img">2</dd>';
     progressDom += '<dt class="prog-text"></dt>';
     progressDom += '</dl>';
     progressDom += '<dl class="prog-item">';
     progressDom += '<dd class="prog-img">3</dd>';
     progressDom += '<dt class="prog-text"></dt>';
     progressDom += '</dl>';
     progressDom += '<dl class="prog-item">';
     progressDom += '<dd class="prog-img">4</dd>';
     progressDom += '<dt class="prog-text"></dt>';
     progressDom += '</dl>';
     progressDom += '</div>';
     $('#header-wapper').append(progressDom);
}

function selectShowModule() {
     var routerPath = window.location.pathname.split('/');
     var pagePathName = routerPath[routerPath.length - 1];
     if (pagePathName == '' || pagePathName == 'index.html' || pagePathName == 'productList.html' || pagePathName == 'shopList.html' || pagePathName == 'storeList.html' || routerPath[routerPath.length - 2] == 'generalize' || pagePathName == 'downLoadApp.html') {
          // 显示商品搜索
          shopHeaderSeach();
     } else if (pagePathName == 'shopreplacement.html' || pagePathName == 'orderDetails.html' || pagePathName == 'retreatOrder.html') {
          // 显示订单进度
          shopHeaderProgress();
     }
}

//买家公用底部 shopFooter
function shopFooter(id) {
     var footerNav = [{
          name: '用户指南',
          path: null,
          children: [{
               name: '购物流程',
               path: pathCommon + 'agreement/shoppingProcess.html'
          }, {
               name: '支付方式 ',
               path: pathCommon + 'agreement/patternPayment.html'
          }, {
               name: '常见问题',
               path: pathCommon + 'agreement/faq.html'
          }]
     },
     {
          name: '售后服务',
          path: null,
          children: [{
               name: '售后服务政策 ',
               path: pathCommon + 'agreement/service.html'
          }, {
               name: '免责商品说明 ',
               path: pathCommon + 'agreement/liabilityExemption.html'
          }, {
               name: '退换货流程 ',
               path: pathCommon + 'agreement/salesReturn.html'
          }]
     },
     // {
     //      name: '支付方式',
     //      path: null,
     //      children: [{
     //           name: '在线支付',
     //           path: 'javascript:;'
     //      }]
     // },
     // {
     //      name: '商务合作',
     //      path: null,
     //      children: [{
     //           name: '联系我们',
     //           path: 'javascript:;'
     //      }]
     // },
     {
          name: '商家服务',
          path: null,
          children: [{
               name: '商家入驻流程',
               path: pathCommon + 'agreement/enter.html'
          }, {
               name: '平台新商家需知',
               path: pathCommon + 'agreement/newBusinesses.html'
          }, {
               name: '商户管理规则',
               path: pathCommon + 'agreement/administrativeRules.html'
          }]
     },
     {
          name: '了解我们',
          path: null,
          children: [{
               name: '平台基本介绍',
               path: pathCommon + 'agreement/platformIntroduction.html'
          }, {
               name: '平台帮扶创新介绍',
               path: pathCommon + 'agreement/helpIntroduce.html'
          }, {
               name: '平台公益帮扶流程',
               path: pathCommon + 'agreement/supportProcess.html'
          }]
     },
          //   {
          //        name: '淘宝特色',
          //        path: null,
          //        children: [{
          //             name: '手机淘宝',
          //             path: 'javascript:'
          //        }, {
          //             name: '旺旺/旺信',
          //             path: 'javascript:'
          //        }, {
          //             name: '大众评审',
          //             path: 'javascript:'
          //        }]
          //   }
     ]


     var shopHeaderDom = '<div class="s-footer">';
     shopHeaderDom += '<div class="help_center body-center">';
     for (var i = 0; i < footerNav.length; i++) {
          shopHeaderDom += '<dl class="mod_dl">';
          shopHeaderDom += '<div class="mod_wrap">';
          if (footerNav[i].path) {
               shopHeaderDom += '<dt><i class="ifont"></i><span><a href="' + footerNav[i].path + '">' + footerNav[i].name + '</a></span></dt>';
          } else {
               shopHeaderDom += '<dt><i class="ifont"></i><span>' + footerNav[i].name + '</span></dt>';
          }
          shopHeaderDom += '<dd>';
          for (var j = 0; j < footerNav[i].children.length; j++) {
               var oli = footerNav[i].children[j];
               if (oli) {
                    shopHeaderDom += '<span><a href="' + oli.path + '">' + oli.name + '</a></span>';
               } else {
                    shopHeaderDom += '<span>' + oli.name + '</span>';
               }
          }
          shopHeaderDom += '</dd>';
          shopHeaderDom += '</div>';
          shopHeaderDom += '</dl>';
     }
     shopHeaderDom += '<div class="lianxi">';
     shopHeaderDom += '<p><img src="' + pathCommon + 'common/images/dianhua.png" alt="">服务热线：</p>';
     shopHeaderDom += '<h2 style="margin-bottom: 10px;">0571-88030278</h2>';
     shopHeaderDom += '<p><img src="' + pathCommon + 'common/images/dizhi.png" alt="">联系地址：</p>';
     shopHeaderDom += '<h3>浙江省杭州市下城区白石巷318号南楼2003室</h3>';
     shopHeaderDom += '</div>';
     shopHeaderDom += '</div>';
     shopHeaderDom += '<div class="site_footer">';
     shopHeaderDom += '<div class="body-center">';
     shopHeaderDom += '<div class="footer_hd">';
     shopHeaderDom += '<div class="inner">';
     shopHeaderDom += '<p><a href="http://www.beian.miit.gov.cn/">© 浙江中经发联盟控股有限公司 版权所有&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;浙ICP备18045337号-5</a></p>';

     shopHeaderDom += '</div>';
     shopHeaderDom += '</div>';
     shopHeaderDom += '</div>';
     shopHeaderDom += '</div>';
     shopHeaderDom += '</div>';
     $(id).append(shopHeaderDom);
}

// 验证 是否必传 及设置label宽度 为*位置做准备
function verification_required(id) {
     $(id).find('.verification-input').map(function () {
          if ($(this).attr('requir') && $(this).closest('div.form-item').find('label .form-required').length == 0) {
               var dom = '<span class="form-required">*</span>';
               $(this).closest('div.form-item').find('label').prepend(dom)
          }
     })
     if ($(id).attr('label-width')) {
          $(id).find('label').css('width', $(id).attr('label-width'))
     }

}
// 验证必传显示msg

function verification(id, rules, fn) {
     // 第一个参数为id 表格id
     //    第二个参数 规则
     // isInit 初始化
     var input = $(id).find('.verification-input');
     var flg = false;
     var arr = [];
     for (var k = 0; k < input.length; k++) {
          var that = $(input[k]);
          // 判断如果有必传规则
          if (that.val().length == 0 && that.attr('requir')) {
               verificationAddDom(that, id, that.attr('msg'));
               continue;
          }
          // 函数和正则匹配
          if (that.attr('props') && that.val().length > 0) {
               if (!verificationTwo(that, id, rules)) { //当规则验证成功后返回true
                    continue;
               }
          }
          arr.push(k)
          that.closest('div.verification-el-input').find('.verification-relus').remove(); //成功后清除
          if (arr.length == input.length) {
               if (fn) {
                    fn(); //验证正确 返回回调 callback
               }
          }
     }
}
// 当有其他验证规则时
function verificationTwo(that, id, rules) {
     var name = rules[that.attr('props')];
     for (var i = 0; i < name.length; i++) {
          // 规则 第一个验证不了， 就不进行下一个
          if (name[i].min && name[i].max) {
               if (that.val().length < name[i].min || that.val().length > name[i].max) {
                    verificationAddDom(that, id, name[i].message);
                    break;
               }
          }
          if (name[i].min && !name[i].max) {
               if (that.val().length < name[i].min) {
                    verificationAddDom(that, id, name[i].message);
                    break;
               }
          }
          if (name[i].max && !name[i].min) {
               if (that.val().length > name[i].max) {
                    verificationAddDom(that, id, name[i].message);
                    break;
               }
          }
          // 方法验证
          if (name[i].validator) {
               if (name[i].validator()) { //验证不通过返回错误提示
                    verificationAddDom(that, id, name[i].validator());
                    break;
               }
          }
     }
     // console.log(i)
     if (name.length == i) { //判断当前一个input 所有规则匹配完毕
          return true;
     } else {
          false;
     }
}
// 添加验证dom
function verificationAddDom(that, id, msg) {
     var className = $(id).attr('position-verification') == 'bottom' ? $(id).attr('position-verification') : '';
     // style ie7 span下沉  向上提 input paddingTop的值
     var dom = '';
     if (className) { //bottom
          dom = '<span class="verification-relus ' + className + '">' + msg + '</span>';
     } else { //left
          dom = '<span class="verification-relus ' + className + '" style="*top:-' + that.css('paddingTop') + '">' + msg + '</span>';
     }

     if (that.closest('div.verification-el-input').children('.verification-relus').length == 0) {
          that.closest('div.verification-el-input').append(dom);
     } else {
          that.closest('div.verification-el-input').find('.verification-relus').html(msg);
     }
}

// 退出

$('body').on('click', '#loginout', function () {
     loginout();
})

function loginout() {
     ajax({
          methods: 'post',
          url: 'member-api-impl/longin/logout',
          data: {
               loginType: 1,
               token: getCookie('token')
          },
          success: function (response) {
               if (response.code == 200) {
                    setMessage({
                         type: 'success',
                         msg: '退出成功'
                    });
                    $.cookie('token', '', {
                         expires: -1
                    });
                    $.cookie('userInfo', '', {
                         expires: -1
                    });
                    window.location.href = pathCommon + 'login.html';
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


// 分页
// pageSizeName: 'pageSize',
// pageIndexName: 'pageNum',
// total: data.total
//  fnName: 'getList'
function page(obj) {
     if (!obj.total) {
          $(".zxf_pagediv").css('display', 'none');
     }
     console.log(obj)
     var page = Math.ceil(obj.total / obj.pageSize);
     if (page > 1) {
          $(".zxf_pagediv").css('display', 'block');
          //翻页
          $(".zxf_pagediv").createPage({
               pageNum: page,
               current: obj.pageNum * 1,
               backfun: function (e) {
                    if (obj.fn) {
                         obj.fn(e);
                    }
               }
          });
     } else {
          $(".zxf_pagediv").css('display', 'none');
     }

}

// 富文本(2.1.)
function creatwangEditor(editor, url) {
     // 7125行代码， ie form提交禁止获取iframe的内容
     // var editor = new wangEditor(obj.id);
     editor.config.uploadImgUrl = baseUrl + url;
     // 配置自定义参数（举例）
     editor.config.uploadParams = {
          token: $.cookie('token')
     };
     // 设置 headers（举例）
     editor.config.uploadHeaders = {
          // 'Accept': 'text/x-json',
          'Accept': '*/*'
          // 'Content-Type': 'multipart/form-data'
     };

     // 隐藏掉插入网络图片功能。该配置，只有在你正确配置了图片上传功能之后才可用。
     // editor.config.hideLinkImg = true;
     // 自定义load事件
     editor.config.uploadImgFns.onload = function (resultText, xhr) {
          // resultText 服务器端返回的text
          // xhr 是 xmlHttpRequest 对象，IE8、9中不支持
          // 上传图片时，已经将图片的名字存在 editor.uploadImgOriginalName
          var originalName = editor.uploadImgOriginalName || '';

          // 如果 resultText 是图片的url地址，可以这样插入图片：
          if (resultText) {
               // console.log(resultText)
               editor.command(null, 'insertHtml', '<img src="' + resultText + '" alt="' + originalName + '" style="max-width:100%;"/>');
          }

          // 如果不想要 img 的 max-width 样式，也可以这样插入：
          // editor.command(null, 'InsertImage', resultText);
     };

     // 自定义timeout事件
     editor.config.uploadImgFns.ontimeout = function (xhr) {
          // xhr 是 xmlHttpRequest 对象，IE8、9中不支持
          setMessage({
               type: '上传超时',
               msg: response.msg
          });
     };

     // 自定义error事件
     editor.config.uploadImgFns.onerror = function (xhr) {
          // xhr 是 xmlHttpRequest 对象，IE8、9中不支持
          setMessage({
               type: 'warning',
               msg: response.msg
          });

     };
     // 隐藏掉插入网络图片功能。该配置，只有在你正确配置了图片上传功能之后才可用。
     editor.config.hideLinkImg = true;
     editor.config.uploadImgFileName = 'wangEditorH5File';
     editor.create();
     //  editor.$txt.html('<p><br></p>');
     editor.$txt.html('');
}
// (3.1.1)
function creatwangEditor3(editor, $text1, url) {
     if (IEVersion() != -1 && IEVersion() < 10) {
          setMessage({
               type: 'warning',
               msg: '请使用ie10及以上浏览器'
          });
          return false;
     }
     editor.customConfig.menus = [
          'head', // 标题
          'bold', // 粗体
          'fontSize', // 字号
          'fontName', // 字体
          'italic', // 斜体
          'underline', // 下划线
          'strikeThrough', // 删除线
          'foreColor', // 文字颜色
          'backColor', // 背景颜色
          'link', // 插入链接
          'list', // 列表
          'justify', // 对齐方式
          'quote', // 引用
          'emoticon', // 表情
          'image', // 插入图片
          'table', // 表格
          // 'video', // 插入视频
          'code', // 插入代码
          'undo', // 撤销
          'redo' // 重复
     ]
     // 将图片大小限制为 3M
     editor.customConfig.uploadImgMaxSize = 10 * 1024 * 1024;
     // 限制一次最多上传
     editor.customConfig.uploadImgMaxLength = 1;
     // 定义heade
     // editor.customConfig.uploadImgHeaders = {
     //     'Accept': 'text/x-json'
     // }
     // 加参数
     editor.customConfig.uploadImgParams = {
          token: $.cookie('token')
     }
     editor.customConfig.uploadImgServer = baseUrl + url; // 上传图片到服务器
     // editor.customConfig.uploadImgParamsWithUrl = true; //url拼接
     // 跨域上传中如果需要传递 cookie 需设置 withCredentials
     editor.customConfig.withCredentials = true;
     editor.customConfig.uploadFileName = 'wangEditorH5File';
     // 将 timeout 时间改为 3s
     editor.customConfig.uploadImgTimeout = 3000;
     editor.customConfig.linkImgCheck = function (src) {
          // console.log(src) // 图片的链接
          // if (IEVersion() != -1) {
          //      var name = src.split('.');
          //      var typeArr = ['jpg', 'jpeg', 'png', 'PNG'];
          //      if (typeArr.indexOf(name[name.length -1]) != -1) {
          //           // editor.txt.html('r43453443')
          //            editor.txt.html(editor.txt.html() + '<p><img src="'+ src +'" style="max-width:100%;"></p>');
          //            return '543543';
          //      }
          // } else {
          //      // return true;
          // }
          //  editor.txt.html(editor.txt.html() + '<p><img src="'+ src +'" style="max-width:100%;"></p>');
          return true // 返回 true 表示校验成功
          // return '验证失败' // 返回字符串，即校验失败的提示信息
     }
     editor.customConfig.uploadImgHooks = {
          before: function (xhr, editor, files) {
               // 图片上传之前触发
               // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，files 是选择的图片文件

               // 如果返回的结果是 {prevent: true, msg: 'xxxx'} 则表示用户放弃上传
               if (files[0].size > 10 * 1024 * 1024) {
                    return {
                         prevent: true,
                         msg: '图片超过10M,放弃上传'
                    }
               }
          },
          // 如果服务器端返回的不是 {errno:0, data: [...]} 这种格式，可使用该配置
          // （但是，服务器端返回的必须是一个 JSON 格式字符串！！！否则会报错）
          customInsert: function (insertImg, result, editor) {
               // console.log(result)
               // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
               // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果

               // 举例：假如上传图片成功后，服务器端返回的是 {url:'....'} 这种格式，即可这样插入图片：
               if (result.code == 200) {
                    var url = result.url;
                    if (IEVersion() != -1) {
                         editor.txt.html(editor.txt.html() + '<img src="' + url + '">');
                    } else {
                         insertImg(url);
                    }
               } else {
                    setMessage({
                         type: 'warning',
                         msg: result.msg
                    })
               }

               return false;
               // result 必须是一个 JSON 格式字符串！！！否则报错
          }
     }
     // editor.customConfig.onblur = function (html) {
     //      // html 即编辑器中的内容
     //      $text1.val(html)
     //      console.log(html)
     // }
     // editor.customConfig.onchange = function (html) {
     //      // 监控变化，同步更新到 textarea
     //      $text1.val(html)
     // }
     editor.create();
     editor.txt.clear(); //清空编辑器内容
}


// 推广首页
function getGeneralizeNav() {
     // 获取首页接口数据
     ajax({
          methods: 'POST',
          url: '/member-api-impl/user/getHomePageInfo',
          data: {
               loginType: 2
          },
          success: function (res) {
               var shopHeaderDom = '<div id="sliderMenua"><div id="sliderMenu" class="slider-menu">';
               // menu-nav  商品分类
               shopHeaderDom += '<div class="menu-nav fl">';
               shopHeaderDom += '<h3 id="cate-theme"><img src="' + pathCommon + 'common/images/kun.png" width="16px" height="14px" alt=""><b>品牌商城</b></h3>';
               shopHeaderDom += '<ul id="cate-menu" class="cate-menu"></ul>'; //一级分类
               shopHeaderDom += '<div class="cate-pop" id="cate-pop"></div>'; //二级分类
               shopHeaderDom += '</div>';
               shopHeaderDom += '<div class="navitems fr">';
               shopHeaderDom += '<ul class="navitems-group">';

               // 首页导航
               var len = res.data.forwardTypeList.length > 9 ? 9 : res.data.forwardTypeList.length;
               var arr = window.location.pathname.split('/');
               for (var i = 0; i < len; i++) {
                    var name = encodeURI(res.data.forwardTypeList[i].name);
                    name = encodeURI(name);
                    var itemHref = res.data.forwardTypeList[i].jumpWay == 2 ? res.data.forwardTypeList[i].url : ('../purchase/productList.html#seach=' + name);
                    var url = res.data.forwardTypeList[i].url.split('/');
                    var className = '';
                    if (url[url.length - 1] == arr[arr.length - 1]) {
                         className = 'hover';
                    }
                    shopHeaderDom += '<li><a class="' + className + '" href=' + itemHref + '>' + res.data.forwardTypeList[i].name + '</a></li>';
               }
               if (res.data.forwardTypeList.length > 9) {
                    shopHeaderDom += '<li id="more"><a href="javascript:">更多 <i class="more-icon"></i></a></li>';
               }
               shopHeaderDom += '</ul>';
               // navitems-select  商品菜单
               shopHeaderDom += '<div class="navitems-select" id="navitems-select">';
               shopHeaderDom += '<ul>';
               for (var i = 9; i < res.data.forwardTypeList.length; i++) {
                    var name = encodeURI(res.data.forwardTypeList[i].name);
                    name = encodeURI(name);
                    var itemHref = res.data.forwardTypeList[i].jumpWay == 2 ? res.data.forwardTypeList[i].url : ('../purchase/productList.html#seach=' + name);
                    shopHeaderDom += '<li><a href=' + itemHref + '>' + res.data.forwardTypeList[i].name + '</a></li>';
               }
               shopHeaderDom += '</ul>';
               shopHeaderDom += '</div>';
               shopHeaderDom += '</div>';
               shopHeaderDom += '</div>';
               shopHeaderDom += '</div>';
               shopHeaderDom += '</div>';
               $('#s-header').append(shopHeaderDom);
               //   $('#s-header').find('.body-center').append(shopHeaderDom);
               cateMenu = $('#cate-menu');
               catePop = $('#cate-pop');

               //渲染一级菜单
               var cateMenuArr = res.data.goodsType.menuList;
               var cateMenuDom = '';
               for (var i = 0; i < cateMenuArr.length; i++) {
                    cateMenuDom += '<li class="cate-menu-item">';
                    var name = encodeURI(cateMenuArr[i].name);
                    name = encodeURI(name);
                    cateMenuDom += '<img src="' + cateMenuArr[i].iconAddress + '" style="position: absolute;left: 10px;top: 16px;width: 14px;height: 14px;"/>'
                    cateMenuDom += '<a href="../purchase/productList.html#seach=' + name + '">' + cateMenuArr[i].name + '</a>';
                    cateMenuDom += '<em><img src="' + pathCommon + 'common/images/syj.png"/></em></li >';
               }
               cateMenu.empty().append(cateMenuDom);
               $('#more,#navitems-select').hover(function () {
                    $('#navitems-select').show()
               }, function () {
                    $('#navitems-select').hide()
               })
               // 渲染二级菜单
               cateMenu.on("mouseenter", ".cate-menu-item", function () {
                    $(this).addClass("actived ac").siblings().removeClass("actived ac");
                    $(this).find('a').addClass("ac").parent().siblings().find('a').removeClass("ac");
                    var index = $(this).index();
                    catePop.children('.cate-pop-col').eq(index).show();
                    //渲染二级菜单
                    var catePopDom = '';
                    for (var i = 0; i < cateMenuArr[index].childList.length; i++) {
                         catePopDom += '<dl class="cate-pop-col clearfix">';
                         var name = encodeURI(cateMenuArr[index].childList[i].name);
                         name = encodeURI(name);
                         catePopDom += '<dt class="cate-pop-tit fl"><a href="../purchase/productList.html#seach=' + name + '">' + cateMenuArr[index].childList[i].name + '</a>&gt;</dt>';
                         catePopDom += '<dd class="cate-pop-con fl">';
                         for (var j = 0; j < cateMenuArr[index].childList[i].childList.length; j++) {
                              var name1 = encodeURI(cateMenuArr[index].childList[i].childList[j].name);
                              name1 = encodeURI(name1);
                              catePopDom += '<a href="../purchase/productList.html#seach=' + name1 + '">' + cateMenuArr[index].childList[i].childList[j].name + '</a>';
                         }

                         catePopDom += '</dd>';
                         catePopDom += '</dl >';
                    }
                    catePop.empty().append(catePopDom);
               })

               //切换显示
               $('#s-header').on("mouseenter", "#cate-theme", function () {
                    cateMenu.show();
               })
               $('#s-header').on("mouseleave", "#cate-theme", function () {
                    cateMenu.hide();
               })
               $('#s-header').on("mouseenter", "#cate-menu", function () {
                    cateMenu.show();
                    catePop.show();
               })
               $('#s-header').on("mouseleave", "#cate-menu", function () {
                    cateMenu.hide();
                    catePop.hide();
               })
               $('#s-header').on("mouseenter", "#cate-pop", function () {
                    cateMenu.show();
                    catePop.show();
               })
               $('#s-header').on("mouseleave", "#cate-pop", function () {
                    cateMenu.hide();
                    catePop.hide();
               })
               $("#cate-menu .cate-menu-item").hover(function () {
                    $(this).find("em").find("img").attr("src", pathCommon + 'common/images/syjj.png')
               }, function () {
                    $(this).find("em").find("img").attr("src", pathCommon + "common/images/syj.png")
               })

          },
          error: function (err) { }
     })
}