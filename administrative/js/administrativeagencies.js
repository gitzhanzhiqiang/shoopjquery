function init() {
     headerTop('#header'); //渲染顶部
     headerNav('#header-seach'); //渲染头部导航
     var dom = '<input type="text" name="token" style="display: none;" value="' + $.cookie('token') + '"/>'
     $('#ajaxForm').append(dom);
     isToken(); //判断登陆
     getAddress(null, 0); //获取省市区
     villagedata(); //帮扶信息获取
}
init();

//联动
var select = $('#ajaxForm select');

function getAddress(id, index) {
     ajax({
          url: 'member-api-impl/address/selByParentId',
          methods: 'post',
          data: {
               parentId: id ? id : 0
          },
          success: function (response) {
               if (response.code == 200) {
                    var data = response.data ? response.data : [];
                    if (data.length > 0) {
                         var dom = '';
                         if (index == 0) {
                              dom += '<option value="">请选择</option>';
                              for (var i = 0; i < data.length; i++) {
                                   dom += '<option value="' + data[i].id + '">' + data[i].provinceName + '</option>';
                              }
                              $('#select_data select').eq(0).html(dom);
                         } else if ($('#select_data select').length == 1) {
                              dom += '<li class="fl">';
                              dom += ' <div class="verification-el-input">';
                              dom += ' <select name="addressList" id="" class="verification-input" requir="true" msg="请选择">'
                              dom += '<option value="">请选择</option>';
                              for (var i = 0; i < data.length; i++) {
                                   dom += '<option value="' + data[i].id + '">' + data[i].provinceName + '</option>';
                              }
                              dom += '</select>';
                              dom += '</div>'
                              dom += '</li>';
                              $('#select_data').append(dom);
                         } else {
                              dom += '<li class="fl">';
                              dom += ' <div class="verification-el-input">';
                              dom += ' <select name="addressList" id="">'
                              dom += '<option value="">请选择</option>';
                              for (var i = 0; i < data.length; i++) {
                                   dom += '<option value="' + data[i].id + '">' + data[i].provinceName + '</option>';
                              }
                              dom += '</select>';
                              dom += '</div>'
                              dom += '</li>';
                              $('#select_data').append(dom);
                         }
                    }

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
$('#select_data').on('change', 'select', function (event) {
     var e = event.srcElement ? event.srcElement : event.target;
     $(this).parent().parent().nextAll().remove();
     if ($('#select_data select').length < 4) {
          if (e.value != '') {
               getAddress(e.value);
          }
     }
})

// 检验必传显示*号 同时初始化 lable位置
verification_required('#form');
var rules = {
     phone: [
          // {
          //      min: 2,
          //      message: '2'
          // }, {
          //      min: 5,
          //      max: 11,
          //      message: '长度在 1 到 11 个字符'
          // },
          {
               validator: validatePass
          }
     ]
}
// form_submit('#form', rules); //初始化

//检验手机格式
function validatePass() {
     val = $("#form").find('input.verification-input:text[props="phone"]').val();
     if (!validate.validatPhone(val)) {
          return '手机格式不正确';
     } else {
          return false;
     }
}

// 提交显示
function form_submit(id) {
     // verification(id, rules, function () {
     // console.log('验证成功');
     $('#ajaxForm').attr('action', baseUrl + 'member-api-impl/userAuth/sellApply');
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
                         setTimeout(function () {
                              window.location.reload();
                         }, 800)
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
     // })
}
//跳转充值界面
$('.buttom').click(function () {
     // console.log(this)
     if (this == $('.buttom')[0]) {
          window.location.href = 'topupOrWithdraw.html' + '?isTopup=1';
     } else if (this == $('.buttom')[1]) {
          window.location.href = 'topupOrWithdraw.html' + '?isTopup=0';
     }
})

//    setMessage ({
//       type: 'warning',
//       msg: 'r5435'
//    })
//    监听file上传
$('.last li').on('change', 'input[type="file"]', function (e) {
     var that = $(this);
     //判断图片格式    
     if (!judgeImageType(that)) {
          return false;
     }
     var number = IEVersion();
     if (number != -1 && number < 10) {
          var imgDiv = that.parent().find('img');
          $(this).select();
          window.parent.document.body.focus();
          var realpath = document.selection.createRange().text;
          imgDiv.css("filter", "progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled='true',src=\"" + realpath + "\",sizingMethod=scale)");
          that.parent().find('img').show();
          that.hide();
     } else {
          var file = this.files[0];
          var reads = new FileReader();
          reads.readAsDataURL(file);
          reads.onload = function (e) {
               that.parent().find('img').attr('src', this.result);
               that.parent().find('img').show();
               that.hide();
          };
     }
})
//    图片鼠标滑过和移出
$('.last li .img img').mouseenter(function () {
     $('.last li .isShow').hide();
     $(this).closest('.verification-el-input').find('.isShow').show();
})
$('.last li .isShow').mouseleave(function () {
     $(this).parent().find('.isShow').hide();
});
//    删除图片
$('.last li .p').click(function () {
     var parent = $(this).closest('div.verification-el-input');
     parent.find('img').attr('src', '');
     parent.find('img').hide();
     $(this).parent().hide(); //幕布隐藏
     console.log(parent.find('input[type="file"]'))
     var file = parent.find('input[type="file"]');
     file.after(file.clone().val(""));
     file.remove();
     parent.find('input[type="file"]').show();
})

//帮扶信息获取
function villagedata() {
     ajax({
          url: 'member-api-impl/income/getVillageIncomeList',
          methods: 'post',
          data: {},
          success: function (response) {
               var data = response.data ? response.data : {};
               if (response.code == 200) {
                    if (data.applyStatus == 1) {
                         $('.form').hide();
                    } else {
                         $('.form').show();
                    }
                    var dom = '';
                    var sum = 0;
                    var sum2 = 0;
                    for (var i = 0; i < data.length; i++) {
                         dom += '<ul class="text_top_ul">';
                         dom += '<li class="left"><span>' + data[i].villageCount + '</span><i></i></li>';
                         dom += '<li class="left"><span>' + data[i].incomeOtherTotal + '</span><i></i></li>';
                         dom += '<li class="left"><span>' + data[i].incomeTotal + '</span><i></i></li>';
                         dom += '<li class="left"><span>' + data[i].incomeRemain + '</span></li>';
                         dom += '</ul>';
                         sum = data[i].incomeTotal;
                         sum2 = data[i].incomeRemain;
                    }
                    $('.text_ul li').eq(0).children('p').html(data.villageCount);
                    $('.text_ul li').eq(1).children('p').html(data.incomeOtherTotal);
                    $('.text_ul li').eq(2).children('p').html(data.incomeTotal);
                    $('.text_ul li').eq(3).children('p').html(data.incomeRemain);

                    // 为echarts对象加载数据
                    Initecharts(sum, sum2);
                    if (!data.length) {
                         $('.data-right').hide();
                    } else {
                         $('.data-right').show();
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


function Initecharts(incomeTotal, incomeRemain) {
     var progress = echarts.init(document.getElementById('progress'));
     var finish = '完成进度 ' + incomeTotal;
     var remnant = '目标剩余额度 ' + incomeRemain
     var progressData = {
          legend: {
               orient: 'vertical',
               x: 280,
               y: 150,
               itemGap: 15,
               itemWidth: 18, // 图例图形宽度
               itemHeight: 14, // 图例图形高度
               data: [finish, remnant],
               textStyle: {
                    color: '#666666', // 图例文字颜色
                    fontSize: 18
               }
          },
          title: {
               show: true,
               text: "总额度",
               textStyle: {
                    fontSize: 16,
                    fontWeight: 'normal',
                    color: '#333'
               },
               x: 100,
               y: 220
          },
          color: ['#FC6C0C', '#f7b793'],
          series: [{
               // name: '访问来源',
               type: 'pie',
               radius: ['40%', '70%'],
               center: ['30%', '40%'],
               startAngle: 10,
               minAngle: 20,
               itemStyle: {
                    normal: {
                         label: {
                              show: false
                         },
                         labelLine: {
                              show: false
                         }
                    },
                    emphasis: {
                         show: true,
                         label: {
                              show: true,
                              position: 'center',
                              textStyle: {
                                   fontSize: '16',
                                   fontWeight: 'bold'
                              }
                         }
                    }
               },
               data: [{
                         value: incomeTotal,
                         name: finish
                    },
                    {
                         value: incomeRemain,
                         name: remnant
                    }
               ]
          }]

     };
     progress.setOption(progressData);
}