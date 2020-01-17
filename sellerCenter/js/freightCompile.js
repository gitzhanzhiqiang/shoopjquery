function init() {
     headerTop('#header'); //渲染顶部
     headerNav('#header-seach'); //渲染头部导航
     applySellerCenter('#centre-left-nav'); //渲染默认左边导航
     getAddress(null, 1); //获取省市区 第一级
}
init();
var name = getQueryString('template');
var nowID = getQueryString('id');
console.log(nowID)
isEdit(); //判断是编辑还是提交

function isEdit() {
     if (name != 1) {
          $('#title').html('编辑运费模板');
     } else {
          $('#title').html('添加运费模板');
     }
}
var Listdata = [];
//获取省市区
function getAddress(id, index, number) {
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
                         if (index) {
                              dom += '<option value="">请选择</option>';
                              for (var i = 0; i < data.length; i++) {
                                   dom += '<option value="' + data[i].id + '">' + data[i].provinceName + '</option>';
                              }
                              $('#select_data select').eq(0).html(dom);
                              if (!nowID) {
                                   getDefaultAddress(); //获取商家地址
                              }
                         } else {
                              dom += '<li class="fl">';
                              dom += ' <div class="verification-el-input">';
                              dom += ' <select name="addressList" id="" class="verification-input fl" requir="true" msg="请选择">'
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
                    if (number < Listdata.length - 1) {
                         getAddress(Listdata[number + 1].code, null, number + 1);
                    }

                    if (number && $('#select_data select').length == Listdata.length || number == 0 && $('#select_data select').length == Listdata.length) {
                         for (var i = 0; i < $('#select_data select').length; i++) {
                              $('#select_data select').eq(i).val(Listdata[i].code);

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
// 地址级联
$('#select_data').on('change', 'select', function (event) {
     var e = event.srcElement ? event.srcElement : event.target;
     $(this).parent().parent().nextAll().remove();
     getAddress(e.value);
})
//获取商家地址
function getDefaultAddress(id) {
     ajax({
          url: 'member-api-impl/template/getSupplierAddress',
          methods: 'post',
          data: {
               rank: 1
          },
          success: function (response) {
               if (response.code == 200) {
                    var data = response.data ? response.data : [];
                    if (data.length > 0) {
                         Listdata = data;
                         getAddress(data[0].code, null, 0)
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
verification_required('#form');
var rules = {}
form_submit('#form', 'init'); //初始化


function validatePass() {
     val = $("#form").find('input.verification-input:text[props="phone"]').val();
     if (!validate.validatPhone(val)) {
          return '手机格式不正确';
     } else {
          return false;
     }
}
// 提交显示
function form_submit(id, init) {
     verification(id, rules, function () {
          // 当是自定义运费时
          if (!init && $('input[name="exemptionPostage"]:checked').val() == 1) {
               var tableDom = $('input[name="transport"]:checked').closest('li').find('table');
               var Input = tableDom.find('input');
               var city = tableDom.find('.city');
               for (var i = 0; i < Input.length; i++) {
                    if (Input[i].value == '') {
                         setMessage({
                              type: 'warning',
                              msg: '运送方式里的编辑框 件数和金额和不能为空'
                         });
                         return false;
                    }
               }
               for (var i = 0; i < city.length; i++) {
                    if (city.eq(i).html() == '') {
                         setMessage({
                              type: 'warning',
                              msg: '运送方式里的地区未选择请编辑'
                         });
                         return false;
                    }
               }
          }
          // 当是指定条件时
          if ($('input[name="condition"]').attr('checked') && !init) {
               if ($('input[name="overMoney"]').val() == '') {
                    setMessage({
                         type: 'warning',
                         msg: '当选择指定条件时,满金额不能为空'
                    });
                    return false;
               }
               if ($('input[name="overCount"]').val() == '') {
                    setMessage({
                         type: 'warning',
                         msg: '当选择指定条件时,满多少件不能为空'
                    });
                    return false;
               }

          }
          var address = [];
          var selectCity = $('#select_data select');
          for (var c = 0; c < selectCity.length; c++) {
               address.push(selectCity.eq(c).val())

          }
          // 选中运费方式的table
          var tableDom = $('input[name="transport"]:checked').closest('li').find('table');
          var shipWay = $('input[name="transport"]:checked').val();
          var TemplateDetailDTO = [];
          if ($('input[name="exemptionPostage"]:checked').val() == 1) {
               var TemplateDetailDTO = [{
                    id: tableDom.find('tr').eq(0).attr('oid') ? tableDom.find('tr').eq(0).attr('oid') : '',
                    areaIds: '',
                    areaNames: '所缺省份模板',
                    firstCount: tableDom.find('tr').eq(0).find('input').eq(0).val(), //首件数
                    first_money: tableDom.find('tr').eq(0).find('input').eq(1).val(), //首件金额
                    continueCount: tableDom.find('tr').eq(0).find('input').eq(2).val(), //续件数
                    continueMoney: tableDom.find('tr').eq(0).find('input').eq(3).val(), //续件金额
                    isDefault: 2,
                    shipWay: shipWay
               }];
               for (var d = 0; d < tableDom.find('.oli').length; d++) {
                    console.log('a')
                    var otr = tableDom.find('.oli').eq(d);
                    var obj = {
                         id: otr.attr('id') ? otr.attr('id') : '',
                         areaIds: otr.find('.city').attr('cityId'),
                         areaNames: otr.find('.city').html(),
                         firstCount: otr.find('input').eq(0).val(), //首件数
                         first_money: otr.find('input').eq(1).val(), //首件金额
                         continueCount: otr.find('input').eq(2).val(), //续件数
                         continueMoney: otr.find('input').eq(3).val(), //续件金额
                         isDefault: 1,
                         shipWay: shipWay
                    }
                    TemplateDetailDTO.push(obj);
               }
          }
          var specifyCondtionsFree = $('input[name="condition"]').attr('checked') ? 2 : 1; //是否指定条件
          var obj = {
               id: nowID * 1,
               rank: 1,
               shipWay: shipWay,
               name: $('input[name="name"]').val(), //模板名称
               addressId: address[address.length - 1], //地址id
               deliveryTime: $('select[name="deliveryTime"]').val(), //发货时间
               isFree: $('input[name="exemptionPostage"]:checked').val(), // 是否包邮
               price_way: $('input[name="price_way"]:checked').val(), //计价方式
               templateDetail: TemplateDetailDTO, //模板详情
               specifyCondtionsFree: specifyCondtionsFree, //是否指定条件
               overMoney: specifyCondtionsFree == 2 ? $('input[name="overMoney"]').val() : '', //满件金额
               overCount: specifyCondtionsFree == 2 ? $('input[name="overCount"]').val() : '' //满金额

          }
          var url = 'member-api-impl/template/add'
          if (nowID) {
               //此时方式为修改更新
               url = 'member-api-impl/template/update';
               obj.delIds = delIds;
          }
          ajax({
               url: url,
               methods: 'post',
               data: obj,
               success: function (response) {
                    if (response.code == 200) {
                         var data = response.data ? response.data : {};
                         setMessage({
                              type: 'success',
                              msg: response.msg
                         })
                         setTimeout(function () {
                              window.history.go(-1);
                         }, 300)
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

     })
}
// 是否包邮选择
$('input[name="exemptionPostage"]').change(function (e) {
     var e = event.srcElement ? event.srcElement : event.target;
     if (e.value == 1) {
          $('.expressage table').eq(0).css('display', 'block');
     } else {
          $('.expressage table').css('display', 'none');
     }
     $('input[name="transport"]').eq(0).prop('checked', true);
})
// 运送方式
$('input[name="transport"]').change(function (e) {
     var e = event.srcElement ? event.srcElement : event.target;
     if ($('input[name="exemptionPostage"]:checked').val() == 1) {
          $('.expressage table').css('display', 'none');
          $('.expressage table').eq(e.value - 1).css('display', 'block');
     }

})
// // 指定条件包邮
// $('input[name="condition"]').change(function (e) {
//      var e = event.srcElement ? event.srcElement : event.target;
//      if (e.checked) {
//           $('.condition').css('display', 'block');
//      } else {
//           $('.condition').css('display', 'none');
//      }

// })
// 关闭弹窗
function CloseAlert() {
     $('.alertForm').hide();
}
// 弹框的input选中变化和全选
$('.alertForm').on('change', 'input', function () {
     if ($(this).hasClass('region')) {
          var checkout = $(this).parent().closest('li').find('input.province');
          var arr = [];
          if ($(this).prop('checked')) {
               checkout.prop('checked', true);
          } else {
               checkout.prop('checked', false);
          }

     } else {
          var check = $(this).parent().parent().find('input');
          var region = $(this).parent().closest('li').find('input.region');
          if ($(this).parent().parent().find('input:checked').length == check.length) {
               region.prop('checked', true);
          } else {
               region.prop('checked', false);
          }
     }
})
var td = ''; //确认时保留
// 编辑
$('.expressage').on('click', '.edit', function () {
     var id = $(this).parent().find('.city').attr('cityId') ? $(this).parent().find('.city').attr('cityId') : '';
     var arr = id.split(',');
     td = $(this).parent().find('.city')
     areaTemplate(arr); //获取省
     $('.alertForm').css('display', 'block');
})
// 添加
$('.expressage').on('click', '.add', function () {
     var dom = '';
     dom += ' <tr class="oli">';
     dom += '<td colspan="2">';
     dom += '<span class="isCity">未添加地区</span>';
     dom += '<span class="noIscity city fl" name="平邮"></span>';
     dom += '<span class="fr edit">编辑</span>';
     dom += '</td>';
     dom += '<td>';
     dom += '<input onkeyup="positiveIntegerMoney(this)" type="text" value="">';
     dom += '</td>';
     dom += '<td>';
     dom += '<input onkeyup="positiveIntegerMoney1(this)" type="text" value="">';
     dom += '</td>';
     dom += '<td>';
     dom += '<input onkeyup="positiveIntegerMoney(this)" type="text" value="">';
     dom += '</td>';
     dom += '<td>';
     dom += '<input onkeyup="positiveIntegerMoney1(this)" type="text" value="">';
     dom += '</td>';
     dom += '<td>';
     dom += '<span class="del">删除</span>&nbsp;';
     dom += '<span class="add">添加</span>';
     dom += '</td>';
     dom += '</tr>';
     $(this).closest('table').append(dom);
})
// 删除
var delIds = [];
$('.expressage').on('click', '.del', function () {
     if ($(this).closest('table').find('.oli').length == 1) {
          setMessage({
               type: 'warning',
               msg: '至少有一条'
          })
          return false;
     }
     var that = this;
     var id = $(this).attr('id');
     seTconfirmation('提示', '确认删除吗', {
          then: function () {
               if (id) {
                    delIds.push(id);
               }
               $(that).closest('tr').remove();
               $('.confirmation-common').css('display', 'none');
          },
          cath: function () {
               console.log('取消')
          }
     });
})

//获取省模板
function areaTemplate(arr) {
     ajax({
          url: 'member-api-impl/template/areaTemplate',
          methods: 'post',
          data: {},
          success: function (response) {
               var data = response.data ? response.data : [];
               if (response.code == 200) {
                    var dom = '';
                    for (var i = 0; i < data.length; i++) {
                         dom += '<li>';
                         dom += '<p class="fl">';
                         dom += '<label><input class="region" type="checkbox" areaid="">' + data[i].areaName + '</label>';
                         dom += '</p>';
                         dom += '<div class="fr">';
                         for (var k = 0; k < data[i].list.length; k++) {
                              dom += '<label><input class="province" type="checkbox" areaid="' + data[i].list[k].areaId + '" name="' + data[i].list[k].name + '">' + data[i].list[k].name + '</label>';
                         }
                         dom += '</div>';
                         dom += '</li>';
                    }
                    $('.area').html(dom);
                    isCheckoutAll(arr);
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
// 默认选中和全选效果
function isCheckoutAll(arr) {
     var input = $('.alertForm input.province');
     for (var i = 0; i < input.length; i++) {
          for (var k = 0; k < arr.length; k++) {
               if (arr[k] == input.eq(i).attr('areaId')) {
                    input.eq(i).prop('checked', true);
               }
          }

     }
     for (var j = 0; j < $('.alertForm li').length; j++) {
          var oInput = $('.alertForm li').eq(j);
          if (oInput.find('input.province:checked').length == oInput.find('input.province').length) {
               console.log('a')
               oInput.find('input.region').prop('checked', true)
          }
     }
}

// 弹窗提交
function submitLeaveMessage() {
     var checkout = $('.alertForm input.province:checked')
     if (checkout.length == 0) {
          setMessage({
               type: 'warning',
               msg: '至少选择一个'
          })
     } else {
          var arr = [];
          var area = [];
          for (var i = 0; i < checkout.length; i++) {
               arr.push(checkout.eq(i).attr('areaid'));
               area.push(checkout.eq(i).attr('name'));
          }
          td.html(area.join(',')).css('display', 'block').attr('cityId', arr.join(','));
          td.parent().find('.isCity').css('display', 'none');
          $('.alertForm').css('display', 'none');
     }
}
/**
 * radio回显函数
 * @param {String} inputName 指定的radio组  
 * @param {String} backValue 需要回显的值，从接口获取
 */
function radioCheck(inputName, backValue) {
     var index;
     $("input[name=" + inputName + "]").each(function (i) {
          var str = $(this).val();
          if (str == backValue) {
               $(this).attr("checked", true);
               index = i;
          }
     });
     return index;
}
var edit;
if (nowID) {
     getDetail(nowID);
}
function getDetail(id) {
     ajax({
          url: 'member-api-impl/template/getTempView',
          methods: 'post',
          data: {
               id: id
          },
          success: function (response) {
               if (response.code == 200) {
                    var data = response.data ? response.data : [];
                    edit = data;
                    // if (data.length > 0) {
                    //      getAddress(data[0].code, null, 0)
                    // }
                    var list = [];
                    for (var i = 0; i < data.tprovincePOS.length; i++) {
                         data.tprovincePOS[i].code = data.tprovincePOS[i].id;
                    }
                    Listdata = data.tprovincePOS;
                    getdom();
                    getAddress(Listdata[0].code, null, 0)
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
function getdom() {
     $('input[name="name"]').val(edit.name);
     $('select[name="deliveryTime"]').val(edit.deliveryTime);
     // 配送方式
     var index = radioCheck('transport', edit.shipWay);
     var tableDom = $('input[name="transport"]').eq(index).closest('li').find('table');
     console.log(tableDom)
     tableDom.find('tr').eq(2).remove();
     $('.expressage table').hide();
     $('.expressage table').eq(index).show();
     // if (edit.shipWay === 1) {
     var listTempDetail = edit.listTempDetail;
     var len = listTempDetail.length;
     var oInput = tableDom.find('tr').eq(0).find('input');
     tableDom.find('tr').eq(0).attr('oid', listTempDetail[0].id);
     oInput.eq(0).val(listTempDetail[0].firstCount);
     oInput.eq(1).val(listTempDetail[0].firstMoney);
     oInput.eq(2).val(listTempDetail[0].continueCount);
     oInput.eq(3).val(listTempDetail[0].continueMoney);
     var dom = '';
     for (var i = 0; i < len; i++) {
          if (i > 0) {
               dom += ' <tr class="oli" id="' + listTempDetail[i].id + '">';
               dom += '<td colspan="2">';
               dom += '<span class="isCity"></span>';
               dom += '<span class="noIscity city fl" name="平邮" cityId=' + listTempDetail[i].areaIds + '>' + listTempDetail[i].areaNames + '</span>';
               dom += '<span class="fr edit">编辑</span>';
               dom += '</td>';
               dom += '<td>';
               dom += '<input onkeyup="positiveIntegerMoney(this)" type="text" value=' + listTempDetail[i].firstCount + '>';
               dom += '</td>';
               dom += '<td>';
               dom += '<input onkeyup="positiveIntegerMoney1(this)" type="text" value=' + listTempDetail[i].firstMoney + '>';
               dom += '</td>';
               dom += '<td>';
               dom += '<input onkeyup="positiveIntegerMoney(this)" type="text" value=' + listTempDetail[i].continueCount + '>';
               dom += '</td>';
               dom += '<td>';
               dom += '<input onkeyup="positiveIntegerMoney1(this)" type="text" value=' + listTempDetail[i].continueMoney + '>';
               dom += '</td>';
               dom += '<td>';
               dom += '<span class="del" id="' + listTempDetail[i].id + '">删除</span>&nbsp;';
               dom += '<span class="add">添加</span>';
               dom += '</td>';
               dom += '</tr>';
          }
     }
     tableDom.append(dom);


     // 是否包邮
     radioCheck('exemptionPostage', edit.isFree);
     // 查看包邮方式如果卖家包邮的隐藏表格
     if (edit.isFree === 2) {
          $('#tb').hide();
     }

     // 计价方式
     radioCheck('price_way', edit.priceWay);

     // 是否指定条件
     var specifyCondtionsFree = edit.specifyCondtionsFree;
     if (specifyCondtionsFree == 2) {
          $('input[name="condition"]').prop("checked", true);
     }
     specifyCondtionsFree == 2 ? $('input[name="overMoney"]').val(edit.overMoney) : '', //满件金额
          specifyCondtionsFree == 2 ? $('input[name="overCount"]').val(edit.overCount) : '' //满金额
     if (edit.shipWay) { }
}