function init() {
     //渲染公共顶部
     shopHeaderTop('#header-top');
     //渲染公共头部
     shopHeader('#s-header');
     // 获取列表
     getList();
}
init();
//请求地址列表数据
function getList() {
     ajax({
          methods: 'POST',
          url: 'member-api-impl/user/deliveryAddressList',
          data: {},
          success: function (response) {
               if (response.code == 200) {
                    var data = response.data ? response.data : {};
                    var listDom = '';
                    for (var i = 0; i < data.length; i++) {
                         listDom += '<li id="' + data[i].id + '">';
                         if (data[i].isDefault == 1) {
                              listDom += '<span class="default">默认地址</span>';
                         } else {
                              listDom += '<span class="to-default">设为默认</span>';
                         }
                         //地址过长隐藏
                         var addressDetail = data[i].addressDetail.length > 22 ? data[i].addressDetail.substring(0, 22) + '...' : data[i].addressDetail;
                         listDom += '<span>' + data[i].name + '</span>';
                         listDom += '<span class="addressDetail">' + addressDetail + '</span>';
                         listDom += '<span>' + data[i].phone + '</span>';
                         listDom += '<span class="edit-address">修改地址</span>';
                         listDom += '<sapn class="delete">删除</sapn>';
                         listDom += '</li>';
                    }
                    $('#list').empty().append(listDom);

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
// 省市区
$('#alertForm').on('change', '#select_data select', function (event) {
     var e = event.srcElement ? event.srcElement : event.target;
     $(this).parent().parent().nextAll().remove();
     if (e.value != '') {
          getAddress(e.value);
     }
})
var addAddress = [];
// 获取地址
function getAddress(id, number, status) {
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
                    // 修改时用
                    if (status) { //status用来判断修改时使用
                         if (number < addAddress.length) {
                              getAddress(addAddress[number++], number++, 1)
                         } else {
                              for (var i = 0; i < addAddress.length; i++) {
                                   $('#select_data select').eq(i).val(addAddress[i])
                              }
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

// 修改地址-打开弹窗
$('.list').on('click', '.edit-address', function () {
     //请求地址详情数据
     var id = $(this).parent().attr('id');
     ajax({
          methods: 'POST',
          url: 'member-api-impl/user/addressDetail',
          data: {
               addressId: id
          },
          success: function (response) {
               if (response.code == 200) {
                    var data = response.data ? response.data : {};

                    var arr = [];
                    if (data.list.length > 0) {
                         // 为了和创建时保持一致 code数组集合
                         for (var i = 0; i < data.list.length; i++) {
                              arr.push(data.list[i].code);
                         }
                         arr = arr.reverse();
                         addAddress = arr;
                         getAddress('', 0, 1);
                    }
                    $('#alertForm #select_data').empty()
                    $('.alertForm .title span').html('修改地址');
                    $('.alertForm .button').attr('id', id) //该条地址的id
                    $('.alertForm').show();
                    $('#alertForm input[name="name"]').val(data.name);
                    $('#alertForm input[name="phone"]').val(data.phone);
                    $('#alertForm input[name="addressSupple"]').val(data.addressSupple);

               } else {
                    setMessage({
                         type: 'warning',
                         msg: response.msg
                    });
               }
          },
          error: function (response) {}
     })
})
// 创建新地址-打开弹窗
function addNewAddress() {
     $('.alertForm .title span').html('创建新地址');
     $('.alertForm').show();
     $('#select_data').empty();
     getAddress(null); //获取省市区
     // 所有的input 和select清空
     $('#alertForm input').val('');
     $('#alertForm select').val('');
}

// 关闭弹窗
function CloseAlert() {
     $('.alertForm').hide();
}

//提交
function form_submit() {
     // 前台要做所有必传的效验
     if (!$(' input[name="name"]').val()) {
          setMessage({
               type: 'warning',
               msg: '收货人姓名不能为空'
          })
          return false;
     }
     if (!$(' input[name="phone"]').val()) {
          setMessage({
               type: 'warning',
               msg: '手机号码不能为空'
          })
          return false;
     }
     if (!validate.validatPhone($(' input[name="phone"]').val())) {
          setMessage({
               type: 'warning',
               msg: '手机号码格式不正确'
          })
          return false;
     }
     var addressList = []
     $('#alertForm select[name="addressList"]').each(function () {
          if ($(this).val()) { //当为空时， 空字符串也会占一个长度
               addressList.push($(this).val());
          }

     })
     // 判断所有下拉框是否都有选择值
     if (addressList.length != $('#alertForm select[name="addressList"]').length) {
          setMessage({
               type: 'warning',
               msg: '地址不能为空'
          })
          return false;
     }
     if (!$('#alertForm input[name="addressSupple"]').val()) {
          setMessage({
               type: 'warning',
               msg: '详细地址不能为空'
          })
          return false;
     }
     var obj = {
          name: $('#alertForm input[name="name"]').val(), //收货人姓名
          phone: $('#alertForm input[name="phone"]').val(), //电话号码
          addressList: addressList, //地址
          addressSupple: $('#alertForm input[name="addressSupple"]').val(), //详细地址
          isDefault: 0, //是否默认 1是 0否
          zoneId: addressList[addressList.length - 1] //最后一级地址id
     }
     var url = '';
     if ($('.alertForm .title span').html() == '创建新地址') {
          url = 'member-api-impl/user/addAddress'; //新增
     } else {
          url = 'member-api-impl/user/updAddress'; //修改
          obj.id = $('.alertForm .button').attr('id')
     }
     ajax({
          url: url,
          methods: 'post',
          data: obj,
          success: function (response) {
               var data = response.data ? response.data : {};
               if (response.code == 200) {
                    setMessage({
                         type: 'success',
                         msg: response.msg
                    })
                    getList(); //更新列表
                    $('.alertForm').hide();

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

// 删除地址
$('#list').on('click', '.delete', function () {
     var that = $(this);
     seTconfirmation('提示', '确认删除吗?', {
          then: function () {
               ajax({
                    url: 'member-api-impl/user/delAddress',
                    methods: 'post',
                    data: {
                         addressId: that.parent().attr('id')
                    },
                    success: function (response) {
                         var data = response.data ? response.data : {};
                         if (response.code == 200) {
                              setMessage({
                                   type: 'success',
                                   msg: response.msg
                              })
                              $('.confirmation-common').css('display', 'none');
                              getList();
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
          },
          cath: function () {
               console.log('取消')
          }
     });
})

//设为默认地址
$('#list').on('click', '.to-default', function () {
     var that = $(this);
     seTconfirmation('提示', '确认设为默认地址吗?', {
          then: function () {
               ajax({
                    url: 'member-api-impl/user/updDefaultAddress',
                    methods: 'post',
                    data: {
                         "addressId": that.parent().attr('id')
                    },
                    success: function (response) {
                         var data = response.data ? response.data : {};
                         if (response.code == 200) {
                              setMessage({
                                   type: 'success',
                                   msg: response.msg
                              })
                              $('.confirmation-common').css('display', 'none');
                              getList();
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
          },
          cath: function () {
               console.log('取消')
          }
     });
})