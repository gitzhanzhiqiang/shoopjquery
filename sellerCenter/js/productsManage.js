function init() {
     headerTop('#header'); //渲染顶部
     headerNav('#header-seach'); //渲染头部导航
     applySellerCenter('#centre-left-nav'); //渲染默认左边导航
}
init();

// 选中checkout
$('#list').on('click', '.checkout div', function () {
     var that = $(this);
     var name = '';
     if (that.attr('class') == 'noSelected') {
          name = 'Selected';
     } else {
          name = 'noSelected';
     }
     that.removeClass();
     that.addClass(name);
     $('.handle-btn .checkout div').removeClass();
     if ($('#list li .Selected').length == $('#list li').length) {
          $('.handle-btn .checkout div').addClass('Selected');
     } else {
          $('.handle-btn .checkout div').addClass('noSelected');
     }
});

// 切换导航
$('#nav li.list').click(function () {
     $('#nav li span').removeClass('hover');
     $(this).children('span').eq(0).addClass('hover');
     parameter = {
          pageNum: 1,
          pageSize: 10,
          putAway: $(this).children('span').eq(0).attr('putAway'),
          first: true
     }
     getList();
     allNoSelect();
     $('.handle-btn .checkout div').removeClass();
     $('.handle-btn .checkout div').addClass('noSelected');
});

// 添加跳转
$('#nav').on('click', 'li .add', function () {
     window.location.href = 'addProducts.html'
})

// 编辑跳转
$('#list').on('click', '.fr p.fl', function () {
     var id = $(this).eq(0).closest('#list li').attr('id');
     window.location.href = 'addProducts.html?id=' + id;
})

//全选
$('body').on('click', '.handle-btn .checkout div', function () {
     var selected = $('#list li .checkout div');
     if (selected.hasClass('noSelected')) {
          selected.removeClass();
          $(this).removeClass();
          selected.addClass('Selected');
          $(this).addClass('Selected');
     } else {
          allNoSelect()
     }
})
//全不选
function allNoSelect() {
     var selected = $('#list li .checkout div');
     selected.removeClass();
     selected.addClass('noSelected');
     $('.handle-btn .checkout div').removeClass();
     $('.handle-btn .checkout div').addClass('noSelected');
}


var parameter = {
     putAway: '', //是否上架  1上架，2未上架
     pageNum: 1,
     pageSize: 10,
     first: true
}
getList();

function getList() {
     ajax({
          url: 'product-api-impl/app/goodManageList',
          methods: 'post',
          data: {
               putAway: parameter.putAway,
               pageNum: parameter.pageNum,
               pageSize: parameter.pageSize,
               rank: 1
          },
          success: function (response) {
               var data = response.data ? response.data : {};
               if (response.code == 200) {
                    $('.handle-btn .checkout div').removeClass();
                    $('.handle-btn .checkout div').addClass('noSelected');
                    $('#nav li').eq(1).children('span').eq(1).html(data.goodOnCount);
                    $('#nav li').eq(2).children('span').eq(1).html(data.goodOffCount);
                    var dom = '';
                    var oli = data.data;
                    if (oli) {
                         for (var i = 0; i < oli.length; i++) {
                              dom += '<li id="' + oli[i].id + '">';
                              dom += '<div class="fl">';
                              dom += '<div class="fl checkout">';
                              dom += '<div class="noSelected"></div>';
                              dom += '</div>';
                              dom += '<img src="' + oli[i].imageAddress + '" alt="" class="fl">';
                              dom += '<div class="fl">';
                              dom += '<h3>' + oli[i].name + '</h3>';
                            //  dom += '<p>净含量' + oli[i].weight + '</p>';
                              dom += '</div>';
                              dom += '</div>';
                              dom += '<div class="fl">￥<input value="' + oli[i].priceScope + '" readonly></div>';
                              dom += '<div class="fl">';
                              dom += '<p>' + oli[i].inventory + '</p>';
                              dom += '</div>';
                              dom += '<div class="fl">' + oli[i].soldNumber + '</div>';
                              dom += '<div class="fl">';
                              dom += '<span>' + oli[i].createTime + '</span>';
                              // dom += '<span>' + oli[i].endTime + '</span>';
                              dom += '</div>';
                              dom += '<div class="fr">';
                              dom += '<p class="fl">编辑</p>';
                              if (oli[i].putaway == 2) {
                                   dom += '<p class="fr" putaway="2">上架</p>';
                              } else {
                                   dom += '<p class="fr" putaway="1">下架</p>';
                              }
                              dom += '</div>';
                              dom += '</li>';
                         }
                         if (!oli.length || oli.length == 0) {
                              $('.handle-btn').hide();
                         } else {
                              $('.handle-btn').show();
                         }
                    }
                    $('#list').html(dom);
                    if (parameter.first) {
                         parameter.first = false;
                         page({
                              pageSize: parameter.pageSize,
                              pageNum: parameter.pageNum,
                              total: data.totalCount,
                              fn: function (e) {
                                   parameter.pageNum = e.current;
                                   getList(); //更新
                              }
                         });
                    }
               } else {
                    $('.handle-btn').hide();
               }
          },
          error: function (response) {
               setMessage(response.msg)
          }
     })
}

//删除
$('.handle-btn').on('click', '.del', function () {
     handle('del', 'all');
})
//上架
$('.handle-btn').on('click', '.up', function () {
     handle('up', 'all');
})
//单条数据的上架和下架
$('body').on('click', '#list div.fr p.fr', function () {
     if ($(this).attr('putaway') == 2) {
          handle('up', $(this));
     } else if ($(this).attr('putaway') == 1) {
          handle('down', $(this));
     }
})
//上架 下架 删除的操作
function handle(type, isAll) {
     var oli = $('#list .checkout').find('.Selected');
     var arr = [];
     for (var i = 0; i < oli.length; i++) {
          var ids = oli.eq(i).closest('#list li').attr('id');
          arr.push(ids);
     }
     //整体操作
     if (arr.length <= 0 && isAll == 'all') {
          setMessage({
               type: 'warning',
               msg: '请至少选择一条数据'
          })
          return false;
     } else if (isAll != 'all') {
          //单独操作
          var id = isAll.eq(0).closest('#list li').attr('id');
          arr.push(id)
     }
     var url = '';
     var text = '';
     if (type == 'del') {
          url = 'product-api-impl/app/goodDel';
          text = '确认删除吗';
     } else if (type == 'up') {
          url = 'product-api-impl/app/goodUp';
          text = '确认上架吗';
     } else if (type == 'down') {
          url = 'product-api-impl/app/goodDown';
          text = '确认下架吗';
     }
     seTconfirmation('提示', text, {
          then: function () {
               ajax({
                    url: url,
                    methods: 'post',
                    data: {
                         productIds: arr,
                         rank: 1
                    },
                    success: function (response) {
                         var data = response.data ? response.data : {};
                         if (response.code == 200) {
                              setMessage({
                                   type: 'success',
                                   msg: response.msg
                              })
                              $('.confirmation-common').css('display', 'none');
                              parameter.first = true;
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
}