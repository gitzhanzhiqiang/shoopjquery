//渲染公共顶部
shopHeaderTop('#header-top');
//渲染公共头部
shopHeader('#s-header');
//渲染公共底部
shopFooter('#s-footer');
// 买家首页菜单
getGeneralizeNav();
// 点击提交
function addClick() {
     if ($('#formText input').eq(0).val() == '') {
          setMessage({
               type: 'warning',
               msg: '请输入培训主题'
          })
          return false;
     }
     if ($('#formText input').eq(1).val() == '') {
          setMessage({
               type: 'warning',
               msg: '请输入参训单位'
          })
          return false;
     }
     if ($('#formText input').eq(2).val() == '') {
          setMessage({
               type: 'warning',
               msg: '请输入参训人数'
          })
          return false;
     }
     if ($('#formText input').eq(3).val() == '') {
          setMessage({
               type: 'warning',
               msg: '请输入姓名'
          })
          return false;
     }
     if ($('#formText input').eq(4).val() == '') {
          setMessage({
               type: 'warning',
               msg: '请准确填写号码，以免措失方案'
          })
          return false;
     }
     if (!validate.validatPhone($('#formText input').eq(4).val())) {
          setMessage({
               type: 'warning',
               msg: '手机号码格式不正确'
          })
          return false;
     }
     ajax({
          methods: 'POST',
          url: 'product-api-impl/documentTrain/addDocumentTrain',
          data: {
               itemCode: $('.party .oli.hover').attr('code'),
               trainTheme: $('#formText input').eq(0).val(), //主题id
               trainingUnits: $('#formText input').eq(1).val(), //参训单位
               trainNumber: $('#formText input').eq(2).val(), //参训人数
               contactName: $('#formText input').eq(3).val(), //姓名
               contactPhone: $('#formText input').eq(4).val(), //号码
               remark: $('#formText textarea').val(), //备注
          },
          success: function (response) {
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

          },
          error: function (response) {
               setMessage({
                    type: 'warning',
                    msg: response.msg
               })
          }
     })
}
// 获取数据
var parameter = {
     groupName: '',
     type: 22
}

//   点击导航
$('.party').on('click', '.oli', function () {
     $('.party .oli').removeClass('hover');
     $(this).addClass('hover');
     $('.payty_title b a').html($(this).html())
     if ($(this).attr("code") == "22") {
          $('.payty_title p').html("全国性党政干部培训、党性教育培训平台，汇集全国主流知名高校、党性教育培训机构资源，为全国各地党政机关、企事业单位提供党政干部、党性教育培训咨询、培训等相关服务。")
     } else if ($(this).attr("code") == "23") {
          $('.payty_title p').html("全国性各地党政机关、企事业单位专业培训平台，汇集全国主流知名高校、专业培训机构资源，为全国各地党政机关、企事业单位提供培训咨询、专业培训等相关服务。")
     } else if ($(this).attr("code") == "24") {
          $('.payty_title p').html("全国性各地党政机关、企事业单位专业会议、论坛平台，汇集全国相关主流专业机构资源，为全国各地党政机关、企事业单位、提供专业会议、论坛的策划、组织等相关服务。")
     }
     parameter.type = $(this).attr("code")
     getList();
})

$('.base_nav').on('click', '.item', function () {
     $('.base_nav .item').removeClass('hover');
     $(this).addClass('hover');
     parameter.groupName = $(this).children('span').html();
     getList();
})

getList();
//getCity(); //获取城市
function getCity() {
     ajax({
          url: 'product-api-impl/goodsGroup/getGoodsGroupNameByItemCode',
          methods: 'post',
          data: {},
          success: function (response) {
               var data = response.data ? response.data : [];
               if (response.code == 200) {
                    var dom = '<li class="fl">基地</li>';
                    for (var i = 0; i < data.length; i++) {
                         if (i == data.length - 1) {
                              dom += '<li class="fl item"><span>' + data[i] + '</span></li>';
                         } else {
                              dom += '<li class="fl item"><span>' + data[i] + '</span>|</li>'
                         }

                    }
                    $('.base_nav').html(dom);
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

function getList() {
     ajax({
          url: 'product-api-impl/goodsGroup/searchGoodsByGroupType',
          methods: 'post',
          data: parameter,
          success: function (response) {
               var data = response.data ? response.data : [];
               if (response.code == 200) {
                    var dom = '';
                    if (data.length > 0) {
                         $('#nodata').css('display', 'none');
                    } else {
                         $('#nodata').css('display', 'block');
                    }
                    for (var i = 0; i < data.length; i++) {
                         dom += '  <dl class="fl" id="' + data[i].id + '" supplierid="' + data[i].supplierId + '">';
                         dom += '<dt>';
                         dom += '<img src="' + data[i].imageAddress + '" alt="">';
                         dom += '</dt>';
                         dom += '<dd>';
                         dom += '<p>￥ ' + data[i].goodsMoney + '</p>';
                         dom += ' <p>' + data[i].name + '</p>';
                         dom += '<button class="fr">加入购物车</button>';
                         dom += '</dd>';
                         dom += ' </dl>';
                    }
                    $('.list_bottom').html(dom);
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

// 点击图片去详情
$('.list_bottom').on('click', 'img', function () {
     var dom = $(this).closest('dl');
     window.open('../purchase/productDetails.html?id=' + dom.attr('id') + '&supplierid=' + dom.attr('supplierid'));
})
//   加入购物车
$('.list_bottom').on('click', 'button', function () {
     var dom = $(this).closest('dl');
     ajax({
          methods: 'POST',
          url: 'product-api-impl/shopcar/addAndUpdateShopCar',
          data: {
               goodsId: dom.attr('id'), //商品id
               goodsAddNum: 1, //商品数量
               storeSupplierId: dom.attr('supplierId'), //商品所属供应商id
               goodsInventoryId: ''
          },
          success: function (response) {
               if (response.code == 200) {
                    setMessage({
                         type: 'success',
                         msg: '已加入购物车，可在购物车内查看~'
                    })
               } else {
                    setMessage({
                         type: 'warning',
                         msg: response.msg
                    })
               }

          },
          error: function (response) {
               setMessage({
                    type: 'warning',
                    msg: response.msg
               })
          }
     })
})