function init() {
     headerTop('#header'); //渲染顶部
     headerNav('#header-seach'); //渲染头部导航
     applySupplierCenter('#centre-left-nav'); //渲染默认左边导航
}
init();

/**
 * 获取supplierId 用于获取列表信息
 */
var supplierId;
function getSupperlid() {
     ajax({
          url: 'product-api-impl/app/getSellerInfo?rank=2',
          methods: 'get',
          success: function (res) {
               var data = res.data ? res.data : {};
               if (res.code == 200) {
                    supplierId = data.supplierId;
                    getList(supplierId); //获取表格数据
               }
          }
     })
}
getSupperlid();


/**
 * 获取表格数据
 * @param {Number} supplierId  
 */
var emsList = [];
function getList(supplierId) {
     $('table #oli').remove();
     ajax({
          url: 'order-api-impl/signCustom/getSignCustomBySupplierId',
          methods: 'post',
          data: {
               supplierId: supplierId,
          },
          success: function (response) {
               var data = response.data ? response.data : {};
               emsList = data;
               var len = emsList.length;
               if (response.code == 200) {
                    var dom = '';
                    for (var i = 0; i < len; i++) {
                         dom += '<tr class="oli" id="oli">';
                         dom += '<td colspan="2">'
                         dom += '<span>' + emsList[i].expressName + '</span>'
                         dom += '</td>'
                         dom += '<td>'
                         dom += '<span>' + emsList[i].customerName + '</span>'
                         dom += '</td>'
                         dom += '<td>'
                         dom += ' <span>' + emsList[i].sendSite + '</span>'
                         dom += '</td>'
                         dom += ' <td>'
                         dom += '<span class="del" id=' + emsList[i].id + '>删除</span> '
                         dom += ' <span class="add" id=' + emsList[i].id + '>编辑</span>'
                         dom += '</td>'
                         dom += '</tr>'
                    }
                    $('table').append(dom);
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

// 关闭弹窗
function CloseAlert() {
     $('select[name="expressId"]').eq(0).val(''), // 快递编号
          $('input[name="customerName"]').val(''), //客户号
          $('input[name="customerPwd"]').val(''), //客户密码
          $('input[name="sendSite"]').val(''), //网点编号,
          $('.alertForm').hide();
     delete modifyObj.id
}

// 提交
function submitLeaveMessage() {
     var url = 'order-api-impl/signCustom/addSignCustom' //新增
     var dom = $('.alertForm h3 span').html();
     var obj = {};
     obj = {
          supplierId: supplierId,
          expressId: $('select[name="expressId"]').eq(0).val(), // 快递编号
          customerName: $('input[name="customerName"]').val(), //客户号
          customerPwd: $('input[name="customerPwd"]').val(), //客户密码
          sendSite: $('input[name="sendSite"]').val(), //网点编号,
     }

     // 表单验证
     if (dom == '新增') {
          if (!$('select[name="expressId"]').eq(0).val()) {
               setMessage({
                    type: 'warning',
                    msg: '请选择快递公司'
               })
               return false;
          }

          if (!$('input[name="customerName"]').val()) {
               setMessage({
                    type: 'warning',
                    msg: '客户号不允许为空'
               })
               return false;
          }
          if (!$('input[name="customerPwd"]').val()) {
               setMessage({
                    type: 'warning',
                    msg: '客户密码不允许为空'
               })
               return false;
          }
          if (!$('input[name="sendSite"]').val()) {
               setMessage({
                    type: 'warning',
                    msg: '网点编号不允许为空'
               })
               return false;
          }

     }

     if (dom == '编辑') {
          url = 'order-api-impl/signCustom/updateSignCustom';
          obj.id = modifyObj.id;
     }

     ajax({
          url: url,
          methods: 'post',
          data: obj,
          success: function (response) {
               if (response.code == 200) {
                    setMessage({
                         type: 'success',
                         msg: response.msg
                    })
                    CloseAlert();
                    getList(supplierId);
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

// =============================================
//显示新增弹窗
$('.addNew').on('click', function () {
     $('.leaveMsg').show();
     $('.text h3 span').html('新增');
})

// 编辑
var modifyObj = {}
$('.expressage').on('click', '.add', function () {
     $('.text h3 span').html('编辑');
     $('.leaveMsg').show();
     var id = $(this).attr('id') * 1;
     for (var i = 0; i < emsList.length; i++) {
          if (id === emsList[i].id) {
               $('select[name="expressId"]').val(emsList[i].expressId)
               $('input[name="customerName"]').val(emsList[i].customerName);
               $('input[name="customerPwd"]').val(emsList[i].customerPwd);
               $('input[name="sendSite"]').val(emsList[i].sendSite);
               modifyObj.id = id;
               break;
          }
     }
})

//删除
$('.expressage').on('click', '.del', function () {
     var that = this;
     var id = $(this).attr('id');
     seTconfirmation('提示', '确认删除吗', {
          then: function () {
               ajax({
                    url: 'order-api-impl/signCustom/deleteSignCustom',
                    methods: 'post',
                    data: {
                         id: id,
                    },
                  success:function(response){
                         if (response.code == 200) {
                              setMessage({
                                   type: 'success',
                                   msg: "删除成功！"
                              })
                              $('.leaveMsg').hide();
                              getList(supplierId);
                         } else {
                              setMessage({
                                   type: 'warning',
                                   msg: "删除失败！"
                              })
                         }
                    }
               })
               $(that).closest('tr').remove();
               $('.confirmation-common').css('display', 'none');
          },
          cath: function () {
               console.log('取消')
          }
     });
})

/**
 * 获取物流公司列表
 */
var expressList = [];
function getExpressList() {
     ajax({
          url: 'order-api-impl/express/getExpressCustomerNumList',
          methods: 'post',
          // data: {
          //      sheetType: 1
          // },
          success:function(res) {
               var dom = "";
               if (res.code === 200) {
                    expressList = res.data;
                    var len = expressList.length;
                    console.log(expressList)
                    for (i = 0; i < len; i++) {
                         dom += '<option value =' + expressList[i].id + '>' + expressList[i].expressName + '</option>'
                    }
                    $('select[name="expressId"]').append(dom)
               }
          }
     })
}
getExpressList();