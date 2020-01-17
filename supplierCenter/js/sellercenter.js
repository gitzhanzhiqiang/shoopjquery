function init() {
     headerTop('#header'); //渲染顶部
     headerNav('#header-seach'); //渲染头部导航
     applySupplierCenter('#centre-left-nav'); //渲染默认左边导航
     $('#centre-left-nav .centre-left-nav li:not(li.hover)').css('display', 'none');
     var dom = '<input type="text" name="token" style="display: none;" value="' + $.cookie('token') + '"/>'
     $('#ajaxForm').append(dom);
     isToken();
     getList(); //获取表格
}
init();
//获取表格
var applyStatus = 0;

function getList() {
     ajax({
          url: 'product-api-impl/app/getSellerInfo',
          methods: 'get',
          data: {
               rank: 2
          },
          success: function (response) {
               var data = response.data ? response.data : {};
               if (response.code == 200) {
                    var dom = '';
                    dom += '<li class="left"><span>' + data.goodsCount + '</span><i></i></li>';
                    dom += '<li class="left"><span>' + data.upGoods + '</span><i></i></li>';
                    dom += ' <li class="left"><span>' + data.inventory + '</span><i></i></li>';
                    dom += ' <li class="left"><span>' + data.orderNum + '</span><i></i></li>';
                    dom += ' <li class="left"><span>' + data.orderMoney + '</span><i></i></li>';
                    dom += ' <li class="left"><span>' + data.netIncome + '</span><i></i></li>';
                    dom += ' <li class="left"><span>' + data.accountBlance + '</span></li>';
                    $('#list').append(dom);
                    //  判断是否申请过
                    applyStatus = data.applyStatus;
                    // 判断提现按钮是否出现
                    if (data.accountType == 0) {
                         $('.text_buttom p').eq(0).hide();
                    }
                    // data.applyStatus = 0;
                    if (data.applyStatus == 1) {
                         $('.title_ti').css('display', 'none');
                         $('.form').css('display', 'none');
                         $('#status').html('(认证通过)');
                         $('#centre-left-nav .centre-left-nav li:not(li.hover)').css('display', 'block');
                    } else {
                         $('#centre-left-nav .centre-left-nav li:not(li.hover)').remove();
                         if (data.applyStatus == 2) {
                              $('#status').html('(审批未通过,' + data.loserMsg + ')');
                              $('.first_form').show();
                              $('.button.first').show();
                              $('.text').css('display', 'none');
                              $('.text_buttom').css('display', 'none');
                         } else if (data.applyStatus == 3) {
                              $('#status').html('(认证通过，审批中)');
                              $('.title_ti').css('display', 'none');
                              $('.form').css('display', 'none');
                         } else {
                              $('.first_form').show();
                              $('.button.first').show();
                              $('.text').css('display', 'none');
                              $('.text_buttom').css('display', 'none');
                         }
                         getAddress(null, 0); //获取省市区
                         getBank(); //获取银行和省份
                         // 时间控件
                         laydate({
                              elem: '#J-xl'
                         });
                         laydate({
                              elem: '#J-x2'
                         });
                         laydate({
                              elem: '#J-xl1'
                         });
                         laydate({
                              elem: '#J-xl2'
                         });
                    }
                    console.log(data.applyStatus)
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
// 获取省份和银行
function getBank() {
     ajax({
          url: 'member-api-impl/user/getProvinceAndBankNameList',
          methods: 'post',
          data: {},
          success: function (response) {
               if (response.code == 200) {
                    var data = response.data ? response.data : {};
                    var dom = '';
                    for (var i = 0; i < data.bankInfoList.length; i++) {
                         dom += '<option value="' + data.bankInfoList[i].bankId + '">' + data.bankInfoList[i].bankName + '</option>';
                    }
                    $('.bankList select').eq(0).html(dom);
                    var bom = '';
                    for (var k = 0; k < data.provinceInfoList.length; k++) {
                         bom += '<option value="' + data.provinceInfoList[k].pid + '">' + data.provinceInfoList[k].provinceName + '</option>';
                    }
                    $('.bankList select').eq(1).html(bom);
                    //  获取支行
                    getBankBranchList($('.bankList select').eq(0).val(), $('.bankList select').eq(1).val())
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
//  支行change
$('.bankList').on('change', 'select.bank', function () {
     getBankBranchList($('.bankList select').eq(0).val(), $('.bankList select').eq(1).val())
})
//  获取支行
var bankBranchList = [];

function getBankBranchList(id, id1) {
     ajax({
          url: 'member-api-impl/user/getBankBranchList',
          methods: 'post',
          data: {
               bankId: id,
               pid: id1
          },
          success: function (response) {
               if (response.code == 200) {
                    var data = response.data ? response.data : {};
                    bankBranchList = data;
                    var dom = '';
                    for (var i = 0; i < data.length; i++) {
                         dom += '<option value="' + data[i].openBankNum + '">' + data[i].openBankName + '</option>';
                    }
                    $('.bankList select').eq(2).html(dom);
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
$('.bankList').on('keyup', 'input', function () {
     var value = $(this).val();
     if (value) {
          var dom = '';
          for (var i = 0; i < bankBranchList.length; i++) {
               if (bankBranchList[i].openBankName.indexOf(value) != -1) {
                    dom += '<option value="' + bankBranchList[i].openBankNum + '">' + bankBranchList[i].openBankName + '</option>';
               } else { }
          }
          if (dom) {
               $('.bankList select').eq(2).html(dom);
          } else {
               dom += '<option value="">请重新输入支行名称（搜索不到）</option>';
               $('.bankList select').eq(2).html(dom);
          }

     } else {
          var dom = '';
          for (var i = 0; i < bankBranchList.length; i++) {
               dom += '<option value="' + bankBranchList[i].openBankNum + '">' + bankBranchList[i].openBankName + '</option>';
          }
          $('.bankList select').eq(2).html(dom);
     }
})
// 获取省市区
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

// 省市区
$('#select_data').on('change', 'select', function (event) {
     var e = event.srcElement ? event.srcElement : event.target;
     $(this).parent().parent().nextAll().remove();
     if (e.value != '') {
          getAddress(e.value);
     }
})
// 商户类型选择
$('.type_02,.type_03').hide();
$('.type_01').show();
var userType = "01"
$('select.verification-input[name="merchantType"]').change(function () {
     $('.type_01,.type_02,.type_03').hide();
     userType = $(this).val()
     switch (userType) {
          case "01":
               $('.type_01').show();
               break
          case "02":
               $('.type_02').show();
               break
          case "03":
               $('.type_03').show();
               break
          case "04":
               $('.type_03').show();
               break
     }
})
// 检验必传显示*号 同时初始化 lable位置
verification_required('#form');
var rules = {
     phone: [{
          validator: validatePass
     }],
     bankCardNo: [{
          validator: bank
     }],
     servicePhoneNo: [{
          validator: servicePhoneNo
     }],
     principalCertNo1: [{
          validator: principalCertNo1
     }],
     principalCertNo: [{
          validator: principalCertNo
     }],
     bussAuthNum: [{
          validator: bussAuthNum
     }],
     principalMobile: [{
          validator: principalMobile
     }]
}
// form_submit('#form', rules); //初始化

// 手机号码验证
function validatePass() {
     val = $("#form").find('input.verification-input:text[props="phone"]').val();
     if (!validate.validatPhone(val)) {
          return '手机格式不正确';
     } else {
          return false;
     }
}
// 银行绑定的手机号
function principalMobile() {
     val = $("#form").find('input.verification-input:text[props="principalMobile"]').val();
     if (!validate.validatPhone(val)) {
          return '手机格式不正确';
     } else {
          return false;
     }
}
//  验证银行卡
function bank() {
     val = $(".first_form").find('input.verification-input:text[name="bankCardNo"]').val();
     if (!validate.bank(val)) {
          return '银行卡号为16-19为数字';
     } else {
          return false;
     }
}
//  工商注册号
function bussAuthNum() {
     val = $(".first_form").find('input.verification-input:text[name="bussAuthNum"]').val();
     console.log()
     if (!validate.bussAuthNum(val)) {
          return '工商注册号为15-18为数字、字母';
     } else {
          return false;
     }
}
// 客服电话验证
function servicePhoneNo() {
     val = $(".first_form").find('input.verification-input:text[name="servicePhoneNo"]').val();
     if (!validate.telephone(val)) {
          return '客服电话5-15个数字， 不能带-';
     } else {
          return false;
     }
}
//  身份证号码验证
function principalCertNo() {
     val = $(".first_form").find('input.verification-input:text[name="principalCertNo"]').val();
     if (!validate.idCard(val)) {
          return '身份证号码格式不正确';
     } else {
          return false;
     }
}
//  身份证号码验证
function principalCertNo1() {
     val = $(".first_form").find('input.verification-input:text[name="shareHolderCertNo"]').val();
     if (!validate.idCard(val)) {
          return '身份证号码格式不正确';
     } else {
          return false;
     }
}
$('.checkboxChange').on('change', function () {
     // console.log($(this).prop('checked'))
     var dom = $(this).closest('ul').children('li').eq(2).find('input');
     if ($(this).prop('checked')) {
          dom.val('');
          dom.css('display', 'none');
     } else {
          dom.css('display', 'block');
     }


})
// 下一步(input)
var flag = true;
function form_submit(id) {
     // verification(id, rules, function () {
     // console.log('验证成功');
     if ($('#form input[name="needProxy"]:checked').val() == 1 && !$('#form input[name="electron"]').attr('checked')) {
          setMessage({
               type: 'warning',
               msg: '代理需勾选《电子商务代运营合作协议》'
          })
          return false;
     }
     if (!$('#form input[name="InAgreement"]').attr('checked')) {
          setMessage({
               type: 'warning',
               msg: '需勾选《消薄爱心购平台商家入驻协议》'
          })
          return false;
     }
     if (!flag) {
          // return false;
     }
     flag = false;
     var list = $('#form select[name="addressList"]');
     var addressList = []
     $('#form select[name="addressList"]').each(function () {
          addressList.push($(this).val());
     })
     // 自然人身份证有效期
     var principalCertValids = [];
     var personCertValidsDom = $('#form input[name="personCertValids"]');
     var name = '法人';
     if ($('select[name="merchantType"]').val() < 3) {
          name = '负责人'
     }
     if (personCertValidsDom.eq(0).val() == '') {
          setMessage({
               type: 'warning',
               msg: name + '身份证开始有效期不能为空'
          })
          flag = true;
          return false;
     }
     if (personCertValidsDom.eq(1).val() == '' && !$('#form input[name="personCertValidsCheck"]').attr('checked')) {
          setMessage({
               type: 'warning',
               msg: name + '身份证结束有效期请选择长期或具体时间'
          })
          flag = true;
          return false;
     }
     if (!$('#form input[name="personCertValidsCheck"]').attr('checked')) {
          if (personCertValidsDom.eq(1).val() && personCertValidsDom.eq(1).val() < personCertValidsDom.eq(0).val()) {
               setMessage({
                    type: 'warning',
                    msg: name + '身份证结束有效期不能小于开始有效期'
               })
               flag = true;
               return false;
          }
     }

     principalCertValids.push(personCertValidsDom.eq(0).val());
     if ($('#form input[name="personCertValidsCheck"]').attr('checked')) {
          principalCertValids.push('长期');
     } else {
          principalCertValids.push(personCertValidsDom.eq(1).val());
     }
     // 控股股东身份证有效期
     var shareHolderCertValid = [];
     if ($('select[name="merchantType"]').val() > 1) {
          var shareHolderCertValidDom = $('#form input[name="shareHolderCertValid"]');
          if (shareHolderCertValidDom.eq(0).val() == '') {
               setMessage({
                    type: 'warning',
                    msg: '控股股东身份证开始有效期不能为空'
               })
               flag = true;
               return false;
          }
          if (shareHolderCertValidDom.eq(1).val() == '' && !$('#form input[name="shareHolderCertValidCheck"]').attr('checked')) {
               setMessage({
                    type: 'warning',
                    msg: '控股股东身份证结束有效期请选择长期或具体时间'
               })
               flag = true;
               return false;
          }
          if (!$('#form input[name="shareHolderCertValidCheck"]').attr('checked')) {
               if (shareHolderCertValidDom.eq(1).val() && shareHolderCertValidDom.eq(1).val() < shareHolderCertValidDom.eq(0).val()) {
                    setMessage({
                         type: 'warning',
                         msg: '控股股东身份证结束有效期不能小于开始有效期'
                    })
                    flag = true;
                    return false;
               }
          }
          shareHolderCertValid.push(shareHolderCertValidDom.eq(0).val());
          if ($('#form input[name="shareHolderCertValidCheck"]').attr('checked')) {
               shareHolderCertValid.push('长期');
          } else {
               shareHolderCertValid.push(shareHolderCertValidDom.eq(1).val());
          }
     }
     var obj = {
          rank: 2,
          id: $(".first_form input[name='id']").val(),
          addressList: addressList, //地址
          bindCardInfo: { //银行卡参数
               bankCardNo: $('#form input[name="bankCardNo"]').val(), //银行卡号
               // branchName: $('#form input[name="branchName"]').val(), //开户行
               bankCertName: $('#form input[name="bankCertName"]').val(), //银行账户户名
               contactLine: $('.bankList select').eq(2).val() //联行号
          },
          baseInfo: { //企业参数
               merchantName: $('#form input[name="merchantName"]').val(), //商户名称
               merchantType: $('#form select[name="merchantType"]').val() == '04' ? '03' : $('#form select[name="merchantType"]').val(), //商户类型
               mcc: $('#form select[name="mcc"]').val() //支付宝线下经营类目
          },
          merchantDetail: { //商户详情
               needProxy: $('#form input[name="needProxy"]:checked').val(), //是否代理
               // role: $('#form select[name="role"]').val(), //角色
               // shopName: $('#form input[name="shopName"]').val(), //店铺名称
               principalMobile: $('#form input[name="principalMobile"]').val(), //银行绑定的手机号
               personProfession: $('#form input[name="personProfession"]').val(), //职业
               contactName: $('#form input[name="contactName"]').val(), //联系人姓名
               contactMobile: $('#form input[name="contactMobile"]').val(), //联系人电话
               address: $('#form input[name="address"]').val(), //详细地址
               servicePhoneNo: $('#form input[name="servicePhoneNo"]').val(), //客服电话
               principalCertNo: $('#form input[name="principalCertNo"]').val(), //身份证号码
               principalPerson: $('#form input[name="principalPerson"]').val(), //负责人/企业法人姓名
               bussAuthNum: $('#form input[name="bussAuthNum"]').val(), //工商注册号
               shareHolderName: $('#form input[name="shareHolderName"]').val(), //控股股东姓名
               shareHolderCertNo: $('#form input[name="shareHolderCertNo"]').val(), //控股股东身份证件号码
               shareHolderCertValids: shareHolderCertValid.join(','), //控股股东身份证件有效期
               principalCertValids: principalCertValids.join(','), //法定代表人身份证件有效期
               personCertValids: principalCertValids.join(',') //身份证件有效期

          }
     }
     console.log(obj)
     ajax({
          url: 'member-api-impl/entry/addEntry',
          methods: 'post',
          data: obj,
          success: function (response) {
               var data = response.data ? response.data : {};
               if (response.code == 200) {
                    // 下一步
                    $('.first_form').css('display', 'none');
                    $('#form .button').eq(0).css('display', 'none');
                    $('#ajaxForm').css('display', 'block');
                    $('#form .button').eq(1).css('display', 'block');
                    $('#ajaxForm input[name="id"]').val(data.id);
                    $(".first_form input[name='id']").val(data.id);
                    // $('#ajaxForm').find('.form-item.last li.type_01').hide();
                    // $('#ajaxForm').find('.form-item.last li.type_02').hide();
                    // $('#ajaxForm').find('.form-item.last li.type_03').hide();
                    // $('#tishi').hide();

                    // switch (userType) {
                    //      case "01":
                    //           $('#ajaxForm').find('.form-item.last li.type_01').show();
                    //           $('#tishi').show();
                    //           break
                    //      case "02":
                    //           $('#ajaxForm').find('.form-item.last li.type_02').show();
                    //           break
                    //      case "03":
                    //           $('#ajaxForm').find('.form-item.last li.type_03').show();
                    //           break
                    // }
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
     // })
}
//  上一步
function last_step() {
     $('.first_form').css('display', 'block');
     $('#form .button').eq(0).css('display', 'block');
     $('#ajaxForm').css('display', 'none');
     $('#form .button').eq(1).css('display', 'none');
}
// 提交图片
function form_submit_img(id) {
     // console.log('a')
     // verification(id, rules, function () {
     // console.log('验证成功');
     setLoad(); //加载效果
     $('#ajaxForm').attr('action', baseUrl + 'member-api-impl/entry/addEntryPhoto');
     $('#ajaxForm').ajaxSubmit({
          success: function (data) {
               var number = IEVersion();
               if (number != -1 && number < 10) {
                    ajax({
                         url: 'member-api-impl/userAuth/testInfos',
                         methods: 'post',
                         data: {},
                         success: function (response) {
                              $('.confirmation-common').remove(); //清除加载
                              var data = response ? response : {};
                              console.log(response)
                              if (data.code == 200) {
                                   //  setMessage({
                                   //       type: 'success',
                                   //       msg: '提交成功， 短信验证码已发送，请填写'
                                   //  })
                                   setMessage({
                                        type: 'success',
                                        msg: '提交成功'
                                   })
                                   setTimeout(function () {
                                        window.location.reload();
                                   }, 1500)
                                   // $('#ajaxForm').css('display', 'none');
                                   // $('#form .button').eq(1).css('display', 'none');
                                   // $('#form .submit_code').css('display', 'block');
                                   // $('#form .button').eq(2).css('display', 'block');
                              } else {
                                   setMessage({
                                        type: 'warning',
                                        msg: data.msg
                                   });
                                   $('.confirmation-common').remove(); //清除加载

                              }

                         },
                         error: function (response) {
                              $('.confirmation-common').remove(); //清除加载
                              console.log(response)
                         }
                    })
               } else {
                    $('.confirmation-common').remove(); //清除加载
                    var response = '';
                    if (typeof data == 'string') {
                         response = JSON.parse(data) ? JSON.parse(data) : {};
                    } else {
                         response = data;
                    }
                    if (response.code == 200) {
                         //  setMessage({
                         //       type: 'success',
                         //       msg: '提交成功， 短信验证码已发送，请填写'
                         //  })
                         setMessage({
                              type: 'success',
                              msg: '提交成功'
                         })
                         setTimeout(function () {
                              window.location.reload();
                         }, 1500)
                         // $('#ajaxForm').css('display', 'none');
                         // $('#form .button').eq(1).css('display', 'none');
                         // $('#form .submit_code').css('display', 'block');
                         // $('#form .button').eq(2).css('display', 'block');
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
//  提交验证码
function submitIphoneCode() {
     verification('.submit_code', rules, function () {
          ajax({
               url: 'member-api-impl/entry/checkEntryCode',
               methods: 'post',
               data: {
                    authCode: $('#form input[name="authCode"]').val(),
                    id: $('#form input[name="id"]').val()
               },
               success: function (response) {
                    var data = response.data ? response.data : {};
                    if (response.code == 200) {
                         setMessage({
                              type: 'success',
                              msg: response.msg
                         })
                         //  setTimeout(function () {
                         //       window.location.reload();
                         //  }, 800)

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
}
//跳转充值界面
$('.buttom').click(function () {
     // console.log(this)
     // if (this == $('.buttom')[0]) {
     //      window.location.href = '../sellerCenter/topupOrWithdraw.html' + '?isTopup=1&name=supplierCenter';
     // } else if (this == $('.buttom')[1]) {
     //      window.location.href = '../sellerCenter/topupOrWithdraw.html' + '?isTopup=0&name=supplierCenter';
     // }
     let money = $('.text_bottom ul li').last().children('span').html();
     seTconfirmation('提示', '确认提现金额' + money + '元吗', {
          then: function () {
               ajax({
                    url: 'order-api-impl/orderpay/supplierOrderClear',
                    methods: 'post',
                    data: {},

                    success: function (response) {
                         if (response.code == 200) {
                              setMessage({
                                   type: 'success',
                                   msg: '提现成功'
                              })

                              window.location.reload()
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

//    监听file上传
$('.last li').on('change', 'input[type="file"]', function (e) {
     var that = $(this);
     //判断图片格式    

     if (!judgeImageType(that)) {
          return false;
     }
     var number = IEVersion();
     if (number != -1 && number < 10) {
          //   that.parent().find('img').attr('src', this.value); //本地   服务器不行
          var imgDiv = that.parent().find('img');
          //  本地服务器都兼容 //localhost:8080 可用
          //   imgDiv.css('filter', 'progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod = scale, src=' + this.value + "'"); 
          //  ip和生产地址  img src不全 以下兼容
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
     //  $('.last li .isShow').hide();
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