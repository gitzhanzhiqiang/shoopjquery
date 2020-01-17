function init() {
     headerTop('#header'); //渲染顶部
     headerNav('#header-seach'); //渲染头部导航
     var dom = '<input type="text" name="token" style="display: none;" value="' + $.cookie('token') + '"/>'
     $('#ajaxForm').append(dom);
}
init();
//    监听file上传
$('.info').on('change', 'input[type="file"]', function (e) {
     var that = $(this);
     //判断图片格式    
     if (!judgeImageType(that)) {
          return false;
     }
     var number = IEVersion();
     if (number != -1 && number < 10) {
          //   that.parent().find('img').attr('src', this.value); //本地   服务器不行
          var imgDiv = that.parent().parent().find('img');
          //  本地服务器都兼容 //localhost:8080 可用
          //   imgDiv.css('filter', 'progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod = scale, src=' + this.value + "'"); 
          //  ip和生产地址  img src不全 以下兼容
          $(this).select();
          window.parent.document.body.focus();
          var realpath = document.selection.createRange().text;
          imgDiv.css("filter", "progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled='true',src=\"" + realpath + "\",sizingMethod=scale)");
          that.parent().parent().find('img').show();
          that.hide();
     } else {
          var file = this.files[0];
          var reads = new FileReader();
          reads.readAsDataURL(file);
          reads.onload = function (e) {
               that.parent().parent().find('img').attr('src', this.result);
               that.parent().parent().find('img').show();
               that.hide();
          };
     }
     form_submit('#info');
})


// 获取账户信息
function accountInfo() {
     ajax({
          methods: 'post',
          url: 'member-api-impl/user/accountDetail',
          data: {},
          success: function (response) {
               var data = response.data ? response.data : [];
               if (response.code == 200) {
                    var photo;
                    if (data.userImage) {
                         var photo = '<img src="' + data.userImage + '" alt=""  >';
                    } else {
                         photo = '<img src="../common/images/star2.png" alt=""  >';
                    }
                    $('.info-photo').prepend(photo);
                    // var account = '<li><span>登录账号：</span><span class="right">' + data.phone + '</span></li>';
                    // account += '<li><span>账号ID：</span><span class="right">' + data.userNum + '</span></li>';
                    // account += '<li><span>注册时间：</span><span class="right">' + data.createTime + '</span></li>';
                    // account += '<li><span>上次登录：</span><span class="right">' + data.lastLoginTime + '</span></li>';
                    // $('.info-account').append(account);

                    var account = '<li> <div class="fl"> 账户名：<span class="right">' + data.nickname + '</span></div> <div class="fl"> 注册时间：<span class="right">' + data.createTime + '</span></div></li>';
                    account += '<li> <div class="fl"> 账号ID：<span class="right">' + data.userNum + '</span></div> <div class="fl"> 上次登录时间：<span class="right">' + data.lastLoginTime + '</span></div></li>';
                    $('.info-account').append(account);
                    $('.named').append(data.nickname);
                    // types 0 买家 2 供应商 1 卖家
                    if (data.types == 2) {
                         $('.accountType').html('<span class="fl center accountType">供应商</span>');
                         $('.centre-left-nav').children('.types_2').show();
                    } else if (data.types == 1) {
                         $('.accountType').html('<span class="fl center accountType">卖家</span>');
                         $('.centre-left-nav').children('.types_1').show();
                    } else {
                         $('.centre-left-nav').children('.types_1,.types_2').hide();
                         $('.accountType').html('<span class="fl center accountType">普通用户</span>');
                    }
                    $('.phone').html(data.phone);
                    $('.appid').html(data.appid);
                    $('.addressDetail').html(data.addressDetail);
               } else {
                    setMessage({
                         type: 'warning',
                         msg: response.msg
                    });
               }

          },
          error: function (response) {}
     })
}
accountInfo();

// 头像上传
function form_submit(id) {
     $('#ajaxForm').attr('action', baseUrl + 'member-api-impl/user/pcUpdAccountDetail');
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
                                   // setTimeout(function () {
                                   //      window.location.reload();
                                   // }, 800)
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
                    var response = '';
                    if (typeof data == 'string') {
                         response = JSON.parse(data) ? JSON.parse(data) : {};
                    } else {
                         response = data;
                    }
                    if (response.code == 200) {
                         setMessage({
                              type: 'success',
                              msg: response.msg
                         })
                         // setTimeout(function () {
                         //      window.location.reload();
                         // }, 800)
                    } else {
                         setMessage({
                              type: 'warning',
                              msg: response.msg
                         })
                    }
               }
          },
          error: function (error) {
               console.info(error);
          }
     })
}