function init() {
     headerTop('#header'); //渲染顶部
     headerNav('#header-seach'); //渲染头部导航
     applySupplierCenter('#centre-left-nav'); //渲染默认左边导航
     var dom = '<input type="text" name="token" style="display: none;" value="' + $.cookie('token') + '"/>'
     $('#ajaxForm').append(dom);
     verification_required('#form'); //显示米号必传
     if (!getQueryString('id')) { //判断是否默认菜单分类
          getAddress(null, 0); //菜单
     }
     getTemplatedownList(); //获取运费模板 (里边判断是否是编辑调取详情)
}

init();
var typeList = [];
// 获取详情
var totalPoint = 0;
var wangEditor = window.wangEditor;
var editor = new wangEditor('#editor');
creatwangEditor3(editor, $('#text1'), 'product-api-impl/app/uploadGoodsExplainPic');

function getDeil() {
     ajax({
          url: 'product-api-impl/app/getGoodsById',
          methods: 'get',
          data: {
               goodsId: getQueryString('id'),
               rank: 2
          },
          success: function (response) {
               if (response.code == 200) {
                    var data = response.data.data ? response.data.data : {};
                    if (getQueryString('id')) {
                         $('input[name="name"]').val(data.name);
                         $('input[name="sellingExplains"]').val(data.sellingExplains); //商品卖点
                         // $('input[name="price"]').val(data.price); //单价
                         // $('input[name="discounPrice"]').val(data.discounPrice); //折扣价
                         $('input[name="id"]').val(data.id); //商品id
                         // $('input[name="weight"]').val(data.weight); //净含量
                         // $('input[name="quality"]').val(data.quality); //重量
                         // $('input[name="inventory"]').val(data.inventory); //库存数量
                         $('textarea[name="explains"]').val(data.explains); //商品说明
                         editor.txt.html('<p>' + data.explains + '</p>');
                         // $('textarea[name="startAddress"]').val(data.startAddress); //发货地址
                         $('select[name="carriageTemplateId"]').val(data.carriageTemplateId); //运费模板
                         // 是否上架
                         $('input[name="putaway"]').val(data.putaway);
                         if (data.putaway == 1) {
                              $('.up i').removeClass('active').eq(1).addClass('active');
                         } else {
                              $('.up i').removeClass('active').eq(0).addClass('active');
                         }
                         // 是否退货
                         $('input[name="isExchange"]').val(data.isExchange);
                         if (data.isExchange == 1) {
                              $('.exchange i').removeClass('active').eq(1).addClass('active');
                         } else {
                              $('.exchange i').removeClass('active').eq(0).addClass('active');
                         }
                         //封面/轮播图
                         $('input[name="imageAdds"]').val(data.imageAddress);
                         $('input[name="detailImageAdds"]').val(data.detailImageAddress);
                         // $('input[name="imageAddress"]').val(data.imageAddress);
                         var detailImageAddress = data.detailImageAddress.split(','); //轮播图
                         var dom = '<label class="fl" style="width:120px;"><span class="form-required">*</span>轮播图</label>';
                         for (var i = 0; i < detailImageAddress.length; i++) {
                              dom += '<div class="verification-el-input fl">';
                              dom += ' <img src="' + detailImageAddress[i] + '" alt="">';
                              dom += '<input name="detailImageAddress" class="verification-input" type="file" accept="image/*" requir="" msg="不能为空！">';
                              dom += '<div class="isShow">';
                              dom += '<div class="background"></div>';
                              dom += '<div class="deltree"></div>';
                              dom += '<div class="deltree_text">删除图片</div>';
                              dom += '</div>';
                              dom += '</div>';
                         }

                         $('.carousel').html(dom);
                         $('.carousel img').show();
                         $('.carousel input').hide();
                         var domImg = '<div class="verification-el-input fl">';
                         domImg += ' <img src="" alt="">';
                         domImg += '<input name="detailImageAddress" class="verification-input" type="file" accept="image/*" requir="" msg="不能为空！">';
                         domImg += '<div class="isShow">';
                         domImg += '<div class="background"></div>';
                         domImg += '<div class="deltree"></div>';
                         domImg += '<div class="deltree_text">删除图片</div>';
                         domImg += '</div>';
                         domImg += '</div>';
                         $('.carousel').append(domImg);

                         var imgOne = '<label class="fl" style="width:120px;"><span class="form-required">*</span>设置封面</label>';
                         imgOne += ' <div class="verification-el-input fl">';
                         imgOne += '<img src="' + data.imageAddress + '" alt="">';
                         imgOne += '<input name="imageAddress" class="verification-input" type="file" accept="image/*" requir="" msg="不能为空！">';
                         imgOne += '<div class="isShow">';
                         imgOne += ' <div class="background"></div>';
                         imgOne += '<div class="deltree"></div>';
                         imgOne += '<div class="deltree_text">删除图片</div>';
                         imgOne += '</div>';
                         imgOne += '</div>';
                         $('.one').html(imgOne);
                         $('.one img').show();
                         $('.one input').hide();
                         getAddress(null, 0); //菜单
                         $('input[name="totalPoint"]').val(data.totalPoint); //折扣价
                         totalPoint = data.totalPoint;
                         typeList = response.data.type;
                         // 属性
                         var bom = '';
                         $.each(JSON.parse(data.attributes), function (i, n) {
                              bom = '<li>';
                              bom += '<p>';
                              bom += '<span class="fl">属性名：</span>';
                              bom += '<input class="fl" type="text" placeholder="请输入" value="' + i + '">';
                              bom += '<img class="fl del" src="../common/images/del.png" alt="">';
                              bom += '</p>';
                              bom += '<p><span>内容：</span><input type="text" placeholder="请输入" value="' + n + '"></p>';
                              bom += '</li>';
                         });
                         $('.property ul').append(bom);
                    } else {
                         $('input[name="totalPoint"]').val(data.totalPoint); //折扣价
                         totalPoint = data.totalPoint;
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
var rules = {};
// 获取分类
function getAddress(id, index) {
     var id = id ? id : 0;
     ajax({
          url: 'product-api-impl/goodsType/menuList?parentId=' + id,
          methods: 'post',
          data: {},
          success: function (response) {
               if (response.code == 200) {
                    var data = response.data ? response.data : [];
                    if (data.length > 0) {
                         var dom = '';
                         if (index == 0) {
                              dom += '<option value="">请选择</option>';
                              for (var i = 0; i < data.length; i++) {
                                   dom += '<option value="' + data[i].id + '">' + data[i].name + '</option>';
                              }
                              $('#select_data select').eq(0).html(dom);
                         } else {
                              dom += '<li class="fl">';
                              dom += ' <div class="verification-el-input">';
                              dom += ' <select name="type" id="" class="verification-input" >'
                              dom += '<option value="">请选择</option>';
                              for (var i = 0; i < data.length; i++) {
                                   dom += '<option value="' + data[i].id + '">' + data[i].name + '</option>';
                              }
                              dom += '</select>';
                              dom += '</div>'
                              dom += '</li>';
                              $('#select_data').append(dom);
                         }
                    }
                    // 默认
                    if (typeList && typeList.length > 0 && index <= typeList.length - 1) {
                         $('#select_data select').eq(index).val(typeList[index]);
                         getAddress(typeList[index], index * 1 + 1);
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
     if (!e.value) {
          return false;
     }
     getAddress(e.value);
})
// 获取运费模板
function getTemplatedownList() {
     ajax({
          url: 'member-api-impl/template/downList',
          methods: 'post',
          data: {
               rank: 2
          },
          success: function (response) {
               if (response.code == 200) {
                    var data = response.data ? response.data : {};
                    var dom = '';
                    dom += '<option value="">请选择</option>';
                    for (var i = 0; i < data.length; i++) {
                         dom += '<option value="' + data[i].id + '">' + data[i].name + '</option>';
                    }
                    $('#templatedownList select').eq(0).html(dom);
                    // 判断是否是编辑
                    if (getQueryString('id')) {
                         $('.title p').css('display', 'none').eq(1).css('display', 'block');
                         getDeil();
                    } else {
                         getDeil();
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
var rules = {};
// form_submit('#form', rules); //初始化
// 提交显示
function form_submit(id) {
     if ($('#form .up .active').length > 0) {
          $('#form .up .verification-relus').hide();
     } else {
          $('#form .up .verification-relus').show();
     }
     if ($('#form .exchange .active').length > 0) {
          $('#form .exchange .verification-relus').hide();
     } else {
          $('#form .exchange .verification-relus').show();
     }
     //折扣价判断
     var discounPrice = Number($('input[name="discounPrice"]').val()); //折扣价
     if (discounPrice) {
          if (discounPrice < 0 || discounPrice > Number($('input[name="price"]').val())) {
               setMessage({
                    type: 'warning',
                    msg: '请输入大于零且小于原价的折扣价'
               })
               return false;
          }
     }
     for (var z = 0; z < $('.property li').length; z++) {
          var li = $('.property li').eq(z);
          if (li.find('input').eq(0).val() == '' || li.find('input').eq(1).val() == '') {
               setMessage({
                    type: 'warning',
                    msg: '属性名和内容不允许为空'
               })
               return false;
          }
     }
     var property = {};
     for (var z = 0; z < $('.property li').length; z++) {
          var li = $('.property li').eq(z);
          if (li.find('input').eq(0).val() != '' && li.find('input').eq(1).val() != '') {
               property[li.find('input').eq(0).val()] = li.find('input').eq(1).val()
          }
     }
     console.log(property)
     $('input[name="attributes"]').val(JSON.stringify(property));
     $('input[name="bb"]').val(property);
     if ($('input[name="totalPoint"]').val() < totalPoint) {
          setMessage({
               type: 'warning',
               msg: '商品返点不能小于' + totalPoint
          })
          return false;
     }
     // verification(id, rules, function () {
     console.log(editor.txt.html())
     $('#text1').val(editor.txt.html());
     $('#ajaxForm').attr('action', baseUrl + 'product-api-impl/app/goodAdd');
     $('#ajaxForm').ajaxSubmit({
          success: function (data) {
               console.log(data)
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
                                        window.location.href = 'addSpecification.html?id=' + response.goodId;
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
                              window.location.href = 'addSpecification.html?id=' + response.goodId;
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
// 选中checkout
$('#list').on('click', '.form-item i', function () {
     var that = $(this);
     var name = '';
     if (that.attr('class') == 'active') {
          name = ' ';
     } else {
          name = 'active';

     }
     if ($(this).closest('.up')[0]) {
          that.closest('li').find('.up i').removeClass();
     }
     if ($(this).closest('.exchange')[0]) {
          that.closest('li').find('.exchange i').removeClass();
     }
     that.addClass(name);
     that.parent().find('input').val(that.parent().find('.active').attr('status'));
});
// 收起
$('#list').on('click', '.close', function () {
     $(this).hide();
     $(this).closest('li').find('.form-item').hide();
     $(this).closest('li').find('.open').show();
     $(this).closest('li').find('.close-div').show();
     var value = $(this).closest('li').find('.form-item input').val();
     $('.close-div span').html(value)
})

// 删除
$('#list').on('click', '.delect', function () {
     $(this).closest('li').remove();
})

// 收起
$('#list').on('click', '.open', function () {
     $(this).hide();
     $(this).closest('li').find('.close-div').hide();
     $(this).closest('li').find('.form-item').show();
     $(this).closest('li').find('.close').show();
})


// 图片上传(封面)
$('#form .photo').on('change', 'input[type="file"]', function () {
     var that = $(this);
     var name = that.closest('.photo').hasClass('one');
     // 判断图片格式    
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
          if (!name) {
               addDom(this.value, that);
          }
     } else {
          var file = this.files[0];
          var reads = new FileReader();
          reads.readAsDataURL(file);
          reads.onload = function (e) {
               that.parent().find('img').attr('src', this.result);
               that.parent().find('img').show();
               that.hide();
               if (!name) {
                    addDom(this.result, that);
               }
          };
     }

})

function addDom(url, that) {
     var dom = '<div class="verification-el-input fl">';
     dom += ' <img src="' + url + '" alt="">';
     dom += '<input name="detailImageAddress" class="verification-input" type="file" accept="image/*" requir="" msg="不能为空！">';
     dom += '<div class="isShow">';
     dom += '<div class="background"></div>';
     dom += '<div class="deltree"></div>';
     dom += '<div class="deltree_text">删除图片</div>';
     dom += '</div>';
     dom += '</div>';
     that.closest('.verification-el-input').after(dom);
     if (that.closest('.form-item').find('.verification-el-input').length == 6) {
          $('.form-item.carousel .verification-el-input').last().css('display', 'none')
     }
}
//    图片鼠标滑过和移出
$('#form .photo').on('mouseenter', 'img', function () {
     $('#form .photo .isShow').hide();
     $(this).closest('.verification-el-input').find('.isShow').show();
})
$('#form .photo').on('mouseleave', '.isShow', function () {
     $(this).parent().find('.isShow').hide();
});
//    删除图片
$('#form .photo').on('click', '.deltree_text', function () {
     var parent = $(this).closest('div.verification-el-input');
     if (parent.closest('.form-item').hasClass('one')) {
          if ($('input[name="imageAdds"]').val()) {
               editImg(1, parent.find('img').attr('src'));
          }
          parent.find('img').attr('src', '');
          parent.find('img').hide();
          $(this).parent().hide(); //幕布隐藏
          var file = parent.find('input[type="file"]');
          file.after(file.clone().val(""));
          file.remove();
          parent.find('input[type="file"]').show();
          parent.find('input[type="file"]').attr('requir', true);
     } else {
          if ($('input[name="detailImageAdds"]').val()) {
               editImg(2, $(this).parent().parent().find('img').attr('src'));
          }
          $(this).parent().parent().remove();
          if ($('#form .photo.carousel .verification-el-input').length <= 1) {
               $('#form .photo.carousel .verification-el-input .verification-input').attr('requir', true);
          }
          if ($('.form-item.carousel .verification-el-input').length == 5) {
               $('.form-item.carousel .verification-el-input').last().css('display', 'block');
          }
     }

})

function editImg(status, url) {
     if (status == 1) {
          $('input[name="imageAdds"]').val('');
     } else {
          var text = $('input[name="detailImageAdds"]').val().split(',');
          text.splice(text.indexOf(url), 1)
          $('input[name="detailImageAdds"]').val(text.join(','))
     }
}
// 属性
$('.addproperty').on('click', 'div', function () {
     if ($('.property ul').children().length == 15) {
          setMessage({
               type: 'warning',
               msg: '最多添加15个属性'
          })
          return false;
     }
     var dom = '<li>';
     dom += '<p>';
     dom += '<span class="fl">属性名：</span>';
     dom += '<input class="fl" type="text" placeholder="请输入">';
     dom += '<img class="fl del" src="../common/images/del.png" alt="">';
     dom += '</p>';
     dom += '<p><span>内容：</span><input type="text" placeholder="请输入"></p>';
     dom += '</li>';
     $('.property ul').append(dom);
})
$('.property ul').on('click', 'span.del', function () {
     $(this).closest('li').remove();
})
$('.property').on('click', '.del', function () {
     $(this).closest('li').remove();
})