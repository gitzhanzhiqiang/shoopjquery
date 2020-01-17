function init() {
     shopHeaderTop('#header-top'); //渲染公共顶部
     shopHeader('#s-header'); //渲染头部导航
     var dom = '<input type="text" name="token" style="display: none;" value="' + $.cookie('token') + '"/>'
     $('#ajaxForm').append(dom);
}
init();
// 获取信息
getInfo()

function getInfo() {
     ajax({
          url: 'member-api-impl/user/accountDetail',
          methods: 'post',
          data: {},
          success: function (response) {
               var data = response.data ? response.data : {};
               if (response.code == 200) {
                    $('#list li').eq(0).children().eq(1).html(data.userNum); //id
                    $('#list li div input').eq(0).val(data.nickname); //昵称
                    if (data.sex) {
                         $('#list li').eq(2).children().eq(1).children().removeClass('select').addClass('noSelect');
                         $('#list li').eq(2).children().eq(2).children().removeClass('noSelect').addClass('select');
                    } else {
                         // 0男 1 女
                         $('#list li').eq(2).children().eq(1).children().removeClass('noSelect').addClass('select');
                         $('#list li').eq(2).children().eq(2).children().removeClass('select').addClass('noSelect');
                    }
                    $('#fileImg').attr('src', data.userImage); //图片
                    var dom = '<input type="text" name="sex" style="display: none;" value="' + data.sex + '"/>'
                    dom += '<input type="text" name="nickname" style="display: none;" value="' + data.nickname + '"/>'
                    $('#ajaxForm').append(dom);
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
$('ul').on('click', 'p.sex', function () {
     if (!$(this).hasClass('select')) {
          $(this).closest('li').find('p.sex').removeClass('noSelect select').addClass('noSelect');
          $(this).removeClass('noSelect').addClass('select');
     }
})

// 加上边框，去掉只读
$('.text-right').on('click', 'ul li .updated', function () {
     $('#list li div input').eq(0).css('border', '1px solid #ccc');
     $('#list li div input').eq(0).removeAttr("readonly");
})

// 去掉边框，加上只读
$('#list').on('blur', 'li input[type=text]', function () {
     $('#list li div input').eq(0).css('border', 'none');
     $('#list li div input').eq(0).attr("readonly", "readonly");
     $('#ajaxForm input[name="nickname"]').val($('#list li div input').eq(0).val())
})

//    监听file上传
$('#list').on('change', 'input[type="file"]', function (e) {
     var that = $(this);
     //判断图片格式    
     if (!judgeImageType(that)) {
          return false;
     }
     var number = IEVersion();
     if (number != -1 && number < 10) {
          //   that.parent().find('img').attr('src', this.value); //本地   服务器不行
          var imgDiv = $('#fileImg');
          //  本地服务器都兼容 //localhost:8080 可用
          //   imgDiv.css('filter', 'progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod = scale, src=' + this.value + "'"); 
          //  ip和生产地址  img src不全 以下兼容
          $(this).select();
          window.parent.document.body.focus();
          var realpath = document.selection.createRange().text;
          imgDiv.css("filter", "progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled='true',src=\"" + realpath + "\",sizingMethod=scale)");
     } else {
          var file = this.files[0];
          var reads = new FileReader();
          reads.readAsDataURL(file);
          reads.onload = function (e) {
               $('#fileImg').attr('src', this.result);
          };
     }
})

// 头像上传
function form_submit() {
     $('#list li div input').eq(0).css('border', 'none');
     $('#list li div input').eq(0).attr("readonly", "readonly");
     if ($('#list li').eq(2).children().eq(1).children().hasClass('select')) {
          $('input[name="sex"]').val(0);
     } else {
          $('input[name="sex"]').val(1);
     }
     // console.log( $('#list li').eq(2).children().eq(1).children().hasClass('select'))
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