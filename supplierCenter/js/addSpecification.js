function init() {
     headerTop('#header'); //渲染顶部
     headerNav('#header-seach'); //渲染头部导航
     applySellerCenter('#centre-left-nav'); //渲染默认左边导航
     getBaseSpec(); //获取规格类型
}
init();
var id = getQueryString('id');
getSpecDetailByGoodId();
var selectData = '';

function getBaseSpec() {
     ajax({
          url: 'product-api-impl/app/getBaseSpec',
          methods: 'post',
          data: {},
          success: function (response) {
               var data = response.data ? response.data : [];
               if (response.code == 200) {
                    for (var i = 0; i < data.length; i++) {
                         selectData += '<option value="' + data[i].id + '">' + data[i].specName + '</option>'
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
// 获取详情
function getSpecDetailByGoodId() {
     ajax({
          url: 'product-api-impl/app/getSpecDetailByGoodId?goodsId=' + id,
          methods: 'post',
          data: {},
          success: function (response) {
               var data = response.data ? response.data : {};
               if (response.code == 200) {
                    var dom = '<tr class="firstTr">';
                    for (var b = 0; b < data.menuNameList.length; b++) {
                         dom += ' <td>' + data.menuNameList[b] + '</td>';
                    }
                    dom += '</tr>';
                    for (var c = 0; c < data.inventoryList.length; c++) {
                         dom += '<tr class="li" id="' + data.inventoryList[c].id + '">';
                         var name = data.inventoryList[c].tname.split(',');
                         for (var d = 0; d < name.length; d++) {
                              dom += '<td>' + name[d] + '</td>';
                         }
                         dom += '<td><input type="text" onkeyup="twoDecimalPlaces(this)" placeholder="请输入" value="' + data.inventoryList[c].price + '"></td>';
                         dom += '<td><input type="text" onkeyup="twoDecimalPlaces(this)" placeholder="请输入" value="' + data.inventoryList[c].discounPrice + '"></td>';
                         dom += '<td><input type="text" onkeyup="positiveIntegerMoney(this)" placeholder="请输入" value="' + data.inventoryList[c].inventory + '"></td>';
                         dom += '<td><input type="text" placeholder="请输入" value="' + data.inventoryList[c].code + '"></td>';
                         dom += '</tr>';

                    }
                    $('.specification .batch input').val('');
                    $('.specification table').html(dom);
                    $('.specification .bottom').show();
                    if (data.specDetailList.length > 0) {
                         $('.nospecification').hide();
                         initSpecification(data.specDetailList); //初始化规格
                    } else {
                         $('.specification .bottom').hide();
                         $('input[name="aprice"]').val(data.noSpecValue.aprice);
                         $('input[name="adiscounPrice"]').val(data.noSpecValue.adiscounPrice);
                         $('input[name="ainventory"]').val(data.noSpecValue.ainventory);
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
// 添加规格
$('.specification .top').on('click', '.add', function () {
     if ($('.specification ul.list').children().length == 3) {
          setMessage({
               type: 'warning',
               msg: '最多添加三个'
          })
          return false;
     }
     if ($('.specification ul.list').children().length == 1 && $('.specification ul.list').children().eq(0).find('.specificationName img').length == 2) {
          $('.specification ul.list').children().eq(0).find('.specificationName img').eq(0).parent().remove();
     }
     var dom = '<li>';
     dom += '<div  class="specificationName">';
     dom += '<label for="" class="fl">规格名:</label>';
     dom += '<div class="fl">';
     dom += '<select name="" id="">';
     dom += selectData;
     dom += '</select>';
     dom += '</div>';
     if ($('.specification ul.list').children().length == 0) {
          dom += '<div class="fl">';
          dom += '<img class="del" src="../common/images/del.png" alt="">';
          dom += '</div>';
          dom += '<div class="fl">';
          dom += '<label class="selectImg" for=""><img src="../common/images/dz_meixuan.png" alt="">添加规格图片</label>';
          dom += '</div>';
     } else {
          dom += '<div class="fl">';
          dom += '<img class="del" src="../common/images/del.png" alt="">';
          dom += '</div>';
     }
     dom += ' </div>';
     dom += '<div  class="specificationValue">';
     dom += '<label for="" class="fl">规格值:</label>';
     dom += '<div class="fl">';
     dom += '<input type="text" name="name" placeholder="请输入">';
     dom += '</div>';
     dom += '<div class="fl">';
     dom += ' <img class="addValue" src="../common/images/add.png" alt="">';
     dom += '<img class="delValue" src="../common/images/del.png" alt="">';
     dom += ' </div>';
     dom += '</div>';
     dom += '</li>';
     $('.specification ul.list').append(dom);
})
// 点击图片添加规格图片
$('.specification').on('click', '.list .selectImg', function () {
     if ($(this).children('img').attr('src') == '../common/images/dz_meixuan.png') {
          $(this).children('img').attr('src', '../common/images/dz_xuanz.png');
          var dom = ' <div class="specificationImg">';
          dom += '<img src="" alt="">';
          dom += ' <form target="nm_iframe" enctype="multipart/form-data" action="" method="post">'
          dom += '<input name="specImage" type="file" accept="image/*">';
          dom += '<input name="token" type="text">';
          dom += '<input name="keyId" type="text">';
          dom += '</form>';
          dom += '<div class="isShow">';
          dom += '<div class="background"></div>';
          dom += '<div class="deltree"></div>';
          dom += '<div class="deltree_text">删除图片</div>';
          dom += '</div>';
          dom += ' </div>';
          $('.specification .list li').eq(0).find('.specificationValue input[type="text"]').parent().append(dom);

     } else {
          $(this).children('img').attr('src', '../common/images/dz_meixuan.png');
          $('.specification .list li').eq(0).find('.specificationValue .specificationImg').remove();
     }
})
// 添加规格值
$('.specification').on('click', '.list .addValue', function () {
     var dom = ' <div  class="specificationValue" >';
     dom += '<label for="" class="fl">规格值:</label>';
     dom += '<div class="fl">';
     dom += '<input type="text" name="name" placeholder="请输入" >';
     if ($(this).closest('li').find('.specificationName .selectImg img').attr('src') == '../common/images/dz_xuanz.png') {
          dom += ' <div class="specificationImg">';
          dom += '<img src="" alt="">';
          dom += ' <form target="nm_iframe" enctype="multipart/form-data" action="" method="post">'
          dom += '<input name="specImage" type="file" accept="image/*">';
          dom += '<input name="token" type="text">';
          dom += '<input name="keyId" type="text">';
          dom += '</form>';
          dom += '<div class="isShow">';
          dom += '<div class="background"></div>';
          dom += '<div class="deltree"></div>';
          dom += '<div class="deltree_text">删除图片</div>';
          dom += '</div>';
          dom += ' </div>';
     }

     dom += '</div>';
     dom += '<div class="fl">';
     dom += ' <img class="addValue" src="../common/images/add.png" alt="">';
     dom += '<img class="delValue" src="../common/images/del.png" alt="">';
     dom += '</div>';
     dom += '</div>';
     $(this).closest('li').append(dom);
})
// 删除规格值
$('.specification .list').on('click', '.delValue', function () {
     $(this).closest('div.specificationValue').remove();
})
// 删除属性
$('.specification .list').on('click', '.specificationName .del', function () {
     $(this).closest('li').remove();
     if ($('.specification .list li').length == 1) {
          var dom = '<div class="fl">';
          dom += '<img class="del" src="../common/images/del.png" alt="">';
          dom += '</div>';
          $('.selectImg').parent().before(dom);
     }
     if ($('.specification .list li').length == 0) {
          $('.specification table').html('');
          $('.specification .bottom').hide();
          $('.nospecification').show();
     }
})
// 图片上传(封面)
$('.specification').on('change', '.list input[type="file"]', function () {
     var that = $(this);
     // 判断图片格式    
     if (!judgeImageType(that)) {
          return false;
     }
     $(this).parent().attr('action', baseUrl + 'product-api-impl/app/imageUpload');
     $(this).parent().children('input[name="token"]').val($.cookie('token'));
     var keyId = new Date().getTime() + '' + Math.ceil(Math.random() * 10000000);
     $(this).parent().children('input[name="keyId"]').val(keyId);
     $(this).parent().ajaxSubmit({
          success: function (data) {
               var number = IEVersion();
               if (number != -1 && number < 10) {
                    ajax({
                         url: 'product-api-impl/app/getSpecImageByKeyId',
                         methods: 'post',
                         data: {
                              keyId: keyId
                         },
                         success: function (response) {
                              console.log(response)
                              var data = response ? response : {};
                              if (data.code == 200) {
                                   that.parent().parent().find('img').attr('src', response.imageAddress);
                                   that.parent().parent().find('img').css('display', 'block');
                                   that.parent().hide();
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
               } else {
                    var response = '';
                    if (typeof data == 'string') {
                         response = JSON.parse(data) ? JSON.parse(data) : {};
                    } else {
                         response = data;
                    }
                    if (response.code == 200) {
                         that.parent().parent().find('img').attr('src', response.imageAddress);
                         that.parent().parent().find('img').css('display', 'block');
                         that.parent().hide();
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

})
//    图片鼠标滑过和移出
$('.specification').on('mouseenter', '.list img', function () {
     $(this).closest('.specificationImg').find('.isShow').show();
})
$('.specification').on('mouseleave', '.list .specificationValue .specificationImg .isShow', function () {
     $(this).hide();
});
//    删除图片
$('.specification').on('click', '.list .specificationValue .specificationImg .isShow .deltree_text', function () {
     $(this).closest('.specificationImg').find('img').attr('src', '').hide();
     $(this).closest('.specificationImg').find('form').show();
     $(this).closest('.isShow').hide();
})
// 生成明细
$('.creatTable').click(function () {
     if (!verificationSpecification()) {
          return false;
     }
     var oli = $('.specification .list').children();
     for (var b = 0; b < oli.eq(0).find('.specificationImg img').length; b++) {
          var img = oli.eq(0).find('.specificationImg img').eq(b);
          if (!img.attr('src')) {
               setMessage({
                    type: 'warning',
                    msg: '规格图片不允许为空'
               })
               return false;
          }
     }
     var array = [];
     for (var i = 0; i < oli.length; i++) {
          var obj = {
               categoryId: oli.eq(i).find('.specificationName select').val(), //规格类型id ,
               categoryName: oli.eq(i).find('.specificationName select option:selected').text(), //规格类型名称
               goodId: id,
               goodSpecChildDTOList: [],
               slot: i + 1
          }
          for (var k = 0; k < oli.eq(i).find('.specificationValue').length; k++) {
               var data = oli.eq(i).find('.specificationValue').eq(k);
               var oliObj = {
                    name: data.find('input[name="name"]').val(),
                    sort: k + 1,
                    specId: data.find('input[name="name"]').attr('specId') ? data.find('input[name="name"]').attr('specId') : '',
                    specImage: data.find('.specificationImg img').attr('src') ? data.find('img').attr('src') : ''
               }
               obj.goodSpecChildDTOList.push(oliObj)

          }
          array.push(obj);
     }
     ajax({
          url: 'product-api-impl/app/addOrUpdGoodSpec',
          methods: 'post',
          data: {
               goodsAddDTOList: array
          },
          success: function (response) {
               var data = response.data ? response.data : {};
               if (response.code == 200) {
                    var dom = '<tr class="firstTr">';
                    for (var b = 0; b < data.menuNameList.length; b++) {
                         dom += ' <td>' + data.menuNameList[b] + '</td>';
                    }
                    dom += '</tr>';
                    for (var c = 0; c < data.inventoryList.length; c++) {
                         dom += '<tr class="li" id="' + data.inventoryList[c].id + '">';
                         var name = data.inventoryList[c].tname.split(',');
                         for (var d = 0; d < name.length; d++) {
                              dom += '<td>' + name[d] + '</td>';
                         }
                         dom += '<td><input type="text" onkeyup="twoDecimalPlaces(this)" placeholder="请输入" value="' + data.inventoryList[c].price + '"></td>';
                         dom += '<td><input type="text" onkeyup="twoDecimalPlaces(this)" placeholder="请输入" value="' + data.inventoryList[c].discounPrice + '"></td>';
                         dom += '<td><input type="text" onkeyup="positiveIntegerMoney(this)" placeholder="请输入" value="' + data.inventoryList[c].inventory + '"></td>';
                         dom += '<td><input type="text" placeholder="请输入" value="' + data.inventoryList[c].code + '"></td>';
                         dom += '</tr>';

                    }
                    $('.specification .batch input').val('');
                    $('.specification table').html(dom);
                    $('.specification .bottom').show();
                    $('.nospecification').hide();
                    initSpecification(data.specDetailList); //初始化规格

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

})
// 初始化规格值
function initSpecification(list) {
     var bom = '';
     for (var i = 0; i < list.length; i++) {
          bom += '<li>';
          bom += '<div  class="specificationName">';
          bom += '<label for="" class="fl">规格名:</label>';
          bom += '<div class="fl">';
          bom += '<select name="" id="" ">';
          bom += selectData;
          bom += '</select>';
          bom += '</div>';
          if (i == 0) {
               if (list.length == 1) {
                    bom += '<div class="fl">';
                    bom += '<img class="del" src="../common/images/del.png" alt="">';
                    bom += '</div>';
               }
               bom += '<div class="fl">';
               var src = '../common/images/dz_meixuan.png';
               if (list[i].existImg) {
                    src = '../common/images/dz_xuanz.png';
               }
               bom += '<label class="selectImg" for=""><img src="' + src + '" alt="">添加规格图片</label>';
               bom += '</div>';
          } else {
               bom += '<div class="fl">';
               bom += '<img class="del" src="../common/images/del.png" alt="">';
               bom += '</div>';
          }
          bom += ' </div>';
          for (var k = 0; k < list[i].goodSpecChildDTOList.length; k++) {
               var goodSpecChildDTOList = list[i].goodSpecChildDTOList[k];
               bom += '<div  class="specificationValue">';
               bom += '<label for="" class="fl">规格值:</label>';
               bom += '<div class="fl">';
               bom += '<input type="text" name="name" placeholder="请输入" value="' + goodSpecChildDTOList.name + '" specId="' + goodSpecChildDTOList.specId + '">';
               if (list[i].existImg) {
                    bom += '<div class="specificationImg">';
                    var imgShow = '';
                    var isForm = '';
                    if (goodSpecChildDTOList.specImage) {
                         imgShow = 'display: block;'
                         isForm = 'display: none;'
                    }
                    bom += '<img src="' + goodSpecChildDTOList.specImage + '" alt="" style="' + imgShow + '">';
                    bom += ' <form target="nm_iframe" enctype="multipart/form-data" action="" method="post" style="' + isForm + '">'
                    bom += '<input name="specImage" type="file" accept="image/*">';
                    bom += '<input name="token" type="text">';
                    bom += '<input name="keyId" type="text">';
                    bom += '</form>';
                    bom += '<div class="isShow">';
                    bom += '<div class="background"></div>';
                    bom += '<div class="deltree"></div>';
                    bom += '<div class="deltree_text">删除图片</div>';
                    bom += '</div>';
                    bom += ' </div>';
               }
               bom += '</div>';
               bom += '<div class="fl">';
               bom += ' <img class="addValue" src="../common/images/add.png" alt="">';
               bom += '<img class="delValue" src="../common/images/del.png" alt="">';
               bom += ' </div>';
               bom += '</div>';
          }
          bom += '</li>';
     }
     $('.specification ul.list').html(bom);
     for (var j = 0; j < $('.specification ul.list select').length; j++) {
          $('.specification ul.list select').eq(j).val(list[j].categoryId);
     }

}
// 排序
$('.sort').click(function () {
     if (!verificationSpecification()) {
          return false;
     }
     var oli = $('.specification .list').children();
     var dom = '';
     var array = [];
     for (var i = 0; i < oli.length; i++) {
          dom += '<h4>' + oli.eq(i).find('.specificationName select option:selected').text() + '</h4>';
          var name = 'buttonInt' + i;
          array.push(name);
          dom += '<div class="item_container ' + name + '">';
          dom += '<div class="item_content">';
          dom += '<ul>';
          for (var k = 0; k < oli.eq(i).find('.specificationValue').length; k++) {
               var data = oli.eq(i).find('.specificationValue').eq(k);
               dom += '<li>';
               dom += '<div class="item" keyId="' + data.attr('keyId') + '">' + data.find('input[name="name"]').val() + '</div>';
               dom += '</li>'
          }
          dom += '</ul>';
          dom += '</div>';
          dom += '</div>';
     }
     $('.leaveMsg1 .textdata').html(dom);
     $('.leaveMsg1').show();
     for (var k = 0; k < array.length; k++) {
          buttonInt('.' + array[k]);
     }
})
// 提交排序
function sortSubmit() {
     var data = $('.leaveMsg1 .textdata .item_container');
     var oli = $('.specification .list').children();
     for (var i = 0; i < data.length; i++) {
          var dom = $('<div></div>');
          var array = [];
          for (var k = 0; k < data.eq(i).children('.item').length; k++) {
               var item = data.eq(i).children('.item').eq(k);
               // 备份dom元素和填写的值
               array[item.attr('index')] = oli.eq(i).find('.specificationValue').eq(k);
          }
          oli.eq(i).children('.specificationValue').remove();
          for (var z = 0; z < array.length; z++) {
               oli.eq(i).append(array[z]);
          }

     }
     $('.leaveMsg1').hide();
}
// 验证规格值和
function verificationSpecification() {
     var flag = true;
     if ($('.specification ul.list').children().length == 0) {
          flag = false;
          return false;
     }
     for (var i = 0; i < $('.specification ul.list input[type="text"]').length; i++) {
          if ($('.specification ul.list input[type="text"]').eq(i).val() == '' && $('.specification ul.list input[type="text"]').eq(i).attr('name') != 'token' && $('.specification ul.list input[type="text"]').eq(i).attr('name') != 'keyId') {
               setMessage({
                    type: 'warning',
                    msg: '规格所有值不允许为空'
               })
               flag = false;
               return false;
          }
     }
     return flag;
}


// 关闭弹窗
function CloseAlert() {
     $('.alertForm').hide();
}
// 拖动排序
function buttonInt(bom) {
     $(function () {
          function Pointer(x, y) {
               this.x = x;
               this.y = y;
          }

          function Position(left, top) {
               this.left = left;
               this.top = top;
          }
          $(bom + " .item").each(function (i) {
               this.init = function () { // 初始化
                         this.box = $(this).parent();
                         $(this).attr("index", i).css({
                              position: "absolute",
                              left: this.box.position().left,
                              top: this.box.position().top + 10
                         }).appendTo(bom);
                         this.drag();
                    },
                    this.move = function (callback) { // 移动
                         console.log()
                         $(this).stop(true).animate({
                              left: this.box.position().left,
                              top: this.box.position().top + 10
                         }, 500, function () {
                              if (callback) {
                                   callback.call(this);
                              }
                         });
                    },
                    this.collisionCheck = function () {
                         var currentItem = this;
                         var direction = null;
                         $(this).siblings(".item").each(function () {
                              if (
                                   currentItem.pointer.x > this.box.offset().left &&
                                   currentItem.pointer.y > this.box.offset().top &&
                                   (currentItem.pointer.x < this.box.offset().left + this
                                        .box.width()) &&
                                   (currentItem.pointer.y < this.box.offset().top + this.box
                                        .height())
                              ) {
                                   // 返回对象和方向
                                   if (currentItem.box.offset().top < this.box.offset().top) {
                                        direction = "down";
                                   } else if (currentItem.box.offset().top > this.box.offset()
                                        .top) {
                                        direction = "up";
                                   } else {
                                        direction = "normal";
                                   }
                                   this.swap(currentItem, direction);
                              }
                         });
                    },
                    this.swap = function (currentItem, direction) { // 交换位置
                         if (this.moveing) return false;
                         var directions = {
                              normal: function () {
                                   var saveBox = this.box;
                                   this.box = currentItem.box;
                                   currentItem.box = saveBox;
                                   this.move();
                                   $(this).attr("index", this.box.index());
                                   $(currentItem).attr("index", currentItem.box.index());
                              },
                              down: function () {
                                   // 移到上方
                                   var box = this.box;
                                   var node = this;
                                   var startIndex = currentItem.box.index();
                                   var endIndex = node.box.index();;
                                   for (var i = endIndex; i > startIndex; i--) {
                                        var prevNode = $(bom + " .item[index=" +
                                             (i - 1) + "]")[0];
                                        node.box = prevNode.box;
                                        $(node).attr("index", node.box.index());
                                        node.move();
                                        node = prevNode;
                                   }
                                   currentItem.box = box;
                                   $(currentItem).attr("index", box.index());
                              },
                              up: function () {
                                   // 移到上方
                                   var box = this.box;
                                   var node = this;
                                   var startIndex = node.box.index();
                                   var endIndex = currentItem.box.index();;
                                   for (var i = startIndex; i < endIndex; i++) {
                                        var nextNode = $(bom + " .item[index=" +
                                             (i + 1) + "]")[0];
                                        node.box = nextNode.box;
                                        $(node).attr("index", node.box.index());
                                        node.move();
                                        node = nextNode;
                                   }
                                   currentItem.box = box;
                                   $(currentItem).attr("index", box.index());
                              }
                         }
                         directions[direction].call(this);
                    },
                    this.drag = function () { // 拖拽
                         var oldPosition = new Position();
                         var oldPointer = new Pointer();
                         var isDrag = false;
                         var currentItem = null;
                         $(this).mousedown(function (e) {
                              e.preventDefault();
                              oldPosition.left = $(this).position().left;
                              oldPosition.top = $(this).position().top;
                              oldPointer.x = e.clientX;
                              oldPointer.y = e.clientY;
                              isDrag = true;

                              currentItem = this;

                         });
                         $(bom).mousemove(function (e) {
                              var currentPointer = new Pointer(e.clientX, e.clientY);
                              if (!isDrag) return false;
                              $(currentItem).css({
                                   "opacity": "0.8",
                                   "z-index": 999
                              });
                              var left = currentPointer.x - oldPointer.x + oldPosition.left;
                              var top = currentPointer.y - oldPointer.y + oldPosition.top;
                              $(currentItem).css({
                                   left: left,
                                   top: top
                              });
                              currentItem.pointer = currentPointer;
                              // 开始交换位置

                              currentItem.collisionCheck();


                         });
                         $(document).mouseup(function () {
                              if (!isDrag) return false;
                              isDrag = false;
                              currentItem.move(function () {
                                   $(this).css({
                                        "opacity": "1",
                                        "z-index": 0
                                   });
                              });
                         });
                    }
               this.init();
          });
     })
}


// 批量设置
function setValue(that, status) {
     var tr = $('table').find('tr.li');
     for (var i = 0; i < tr.length; i++) {
          tr.eq(i).find('input').eq(status).val(that.value);
     }
}

// 返回上一页
function go_url() {
     window.location.href = 'addProducts.html?id=' + id;
}
// 最后提交
function submitData() {
     var obj = {};
     if ($('table').find('tr.li').length == 0) {
          if ($('input[name="aprice"]').val() == '') {
               setMessage({
                    type: 'warning',
                    msg: '商品单价不允许为空'
               })
               return false;
          }
          // if ($('input[name="adiscounPrice"]').val() == '') {
          //      setMessage({
          //           type: 'warning',
          //           msg: '折扣价不允许为空'
          //      })
          //      return false;
          // }
          if ($('input[name="adiscounPrice"]').val() != '' && $('input[name="adiscounPrice"]').val() * 1 > $('input[name="aprice"]').val() * 1) {
               setMessage({
                    type: 'warning',
                    msg: '折扣价不可超过商品单价'
               })
               return false;
          }
          if ($('input[name="ainventory"]').val() == '') {
               setMessage({
                    type: 'warning',
                    msg: '库存数量不允许为空'
               })
               return false;
          }
          obj = {
               aprice: $('input[name="aprice"]').val(),
               adiscounPrice: $('input[name="adiscounPrice"]').val(),
               ainventory: $('input[name="ainventory"]').val(),
               inventoryList: [],
               goodId: id
          }
     } else {
          obj = {
               aprice: '',
               adiscounPrice: '',
               ainventory: '',
               inventoryList: [],
               goodId: id
          }
          for (var i = 0; i < $('table').find('tr.li').length; i++) {
               var otr = $('table').find('tr.li').eq(i);
               if (otr.find('input').eq(0).val() == '' || otr.find('input').eq(2).val() == '') {
                    setMessage({
                         type: 'warning',
                         msg: '规格明细列表单价和库存不允许为空'
                    })
                    return false;
               }
               if (otr.find('input').eq(1).val() != '' && otr.find('input').eq(1).val() * 1 > otr.find('input').eq(0).val() * 1) {
                    setMessage({
                         type: 'warning',
                         msg: '规格明细列表第' + (i + 1) + '行折扣价不可大于单价'
                    })
                    return false;
               }
               var data = {
                    price: otr.find('input').eq(0).val(),
                    discounPrice: otr.find('input').eq(1).val(),
                    inventory: otr.find('input').eq(2).val(),
                    name: otr.find('input').eq(3).val(),
                    id: otr.attr('id')
               }
               obj.inventoryList.push(data);
          }
     }
     // console.log(obj)
     ajax({
          url: 'product-api-impl/app/updGoodinvetoryDetail',
          methods: 'post',
          data: obj,
          success: function (response) {
               var data;
               if (response.code == 200) {
                    setMessage({
                         type: 'success',
                         msg: response.msg
                    })
                    setTimeout(function () {
                         window.location.href = 'productsManage.html';
                    }, 1000)
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