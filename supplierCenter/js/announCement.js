function init() {
     headerTop('#header'); //渲染顶部
     headerNav('#header-seach'); //渲染头部导航
     applySupplierCenter('#centre-left-nav'); //渲染默认左边导航
     verification_required('#form'); //显示米号必传
}

init();
var wangEditor = window.wangEditor;
var editor = new wangEditor('#editor');
creatwangEditor3(editor, $('#text1'), 'product-api-impl/app/uploadGoodsExplainPic');

var supplierId;
function getSupperlid() {
     ajax({
          url: 'product-api-impl/app/getSellerInfo?rank=2',
          methods: 'get',
          success: function (res) {
               var data = res.data ? res.data : {};
               if (res.code == 200) {
                    supplierId = data.supplierId;
               }
          }
     })
}
if (getQueryString('supplierId')) {
     getDetail(); //详情
} else {
     getSupperlid();
}
function getDetail() {
     ajax({
          url: 'member-api-impl/notice/getNoticeBySupplierId',
          methods: 'post',
          data: {
               supplierId: getQueryString('supplierId'),
               id: getQueryString('id'),
          },
          success: function (response) {
               if (response.code == 200) {
                    var data = response.data ? response.data : {};
                    $('input[name="title"]').val(data.title);
                    $('textarea[name="mainBody"]').val(data.mainBody); //公告内容
                    editor.txt.html('<p>' + data.mainBody + '</p>');
                    $('input[name="status"]').val(data.status);
                    id = data.id; //此条公告id，修改的时候用

                    if (data.status === 1) {
                         $('.exchange i').removeClass('active').eq(0).addClass('active');
                    } else {
                         $('.exchange i').removeClass('active').eq(1).addClass('active');
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

/**
 * 提交公告
 */
function submitForm() {
     ajax({
          url: 'member-api-impl/notice/addOrUpdateNotice',
          methods: 'post',
          data: {
               id: getQueryString('id') ? getQueryString('id') : '', //存在id 则表示修改此条公告
               supplierId: getQueryString('supplierId') ? getQueryString('supplierId') : supplierId,
               status: $('input[name="status"]').val() * 1,
               title: $('input[name="title"]').val(),
               mainBody: editor.txt.html()
          },
          success: function (response) {
               var data = response ? response : {};
               if (data.code == 200) {
                    setMessage({
                         type: 'success',
                         msg: data.msg
                    })
                    window.history.back(-1);
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
     if ($(this).closest('.exchange')[0]) {
          that.closest('li').find('.exchange i').removeClass();
     }
     that.addClass(name);
     that.parent().find('input').val(that.parent().find('.active').attr('status'));
});
