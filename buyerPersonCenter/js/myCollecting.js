 var params = {
      "pageIndex": 1,
      "pageSize": 8,
      "first": true
 }

 function init() { //渲染公共顶部
      shopHeaderTop('#header-top');
      //渲染公共头部
      shopHeader('#s-header');
      getList(); //获取列表
 }
 init(); //初始化
 // 获取列表



 //请求接口数据
 function getList() {
      ajax({
           methods: 'POST',
           url: 'member-api-impl/user/myGoodsCollection',
           data: {
                "pageIndex": params.pageIndex,
                "pageSize": params.pageSize
           },
           success: function (response) {
                if (response.code == 200) {
                     var data = response.data ? response.data : {};
                     if (data.CollectionGoodsList.length == 0) {
                          $('.handle').css('display', 'none');
                          $('#nodata').show();
                     } else {
                          $('#nodata').hide();
                     }
                     var listDom = '';
                     for (var i = 0; i < data.CollectionGoodsList.length; i++) {
                          listDom += '<li id="' + data.CollectionGoodsList[i].id + '" data-sellid="' + data.CollectionGoodsList[i].storeSupplierId + '">';
                          listDom += '<img onClick="goDetail(' + data.CollectionGoodsList[i].id + "," + data.CollectionGoodsList[i].storeSupplierId + "," + data.CollectionGoodsList[i].supplierId + ')" src="' + data.CollectionGoodsList[i].imageAddress + '" alt="">';
                          listDom += '<p class="price">¥ ' + data.CollectionGoodsList[i].actualPrice + '</p>';
                          listDom += '<p class="key-word">' + nameSubstring(data.CollectionGoodsList[i].name) + '</p>';
                          listDom += '<div class="del">';
                          listDom += '<div class="fl checkout checkout-one">';
                          listDom += '<div class="noSelected"></div></div>';
                          listDom += '<span class="delete fr">删除</span>';
                          listDom += '</div>';
                          listDom += '</li>';
                     }
                     $('#list').html(listDom);
                     if (params.first) {
                          params.first = false;
                          page({
                               pageSize: params.pageSize,
                               pageNum: params.pageIndex,
                               total: data.total,
                               fn: function (e) {
                                    params.pageIndex = e.current;
                                    getList(); //更新
                                    $('.handle .checkout-all div').removeClass('Selected').attr('class', 'noSelected');
                               }
                          });
                     }
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

 // 字符串截取(调用each得不到所要截取的值， ajax顺序)
 function nameSubstring(str) {
      if (str.length > 23) {
           return str.substring(0, 23) + '...';
      } else {
           return str;
      }
 }
 //全选
 $('body').on('click', '.handle .checkout-all div', function () {
      var selected = $('#list li .checkout div');
      if (selected.hasClass('noSelected')) {
           selected.removeClass();
           $(this).removeClass();
           selected.addClass('Selected');
           $(this).addClass('Selected');
           $('#list li .del').show();
      } else {
           selected.removeClass();
           selected.addClass('noSelected');
           $('.handle .checkout-all div').removeClass();
           $('.handle .checkout-all div').addClass('noSelected');
           $('#list li .del').hide();
      }
 })
 //  单个选择
 $('#list').on('click', '.checkout-one div', function () {
      var that = $(this);
      var name = '';
      if (that.attr('class') == 'noSelected') {
           name = 'Selected';
      } else {
           name = 'noSelected';
      }
      that.removeClass();
      that.addClass(name);
      $('.checkout-one div.Selected').parent().parent().css('display', 'block');
      $('.checkout-one div.noSelected').parent().parent().css('display', 'none');
      $('.handle .checkout div').removeClass();
      if ($('#list li .Selected').length == $('#list li').length) {
           $('.handle .checkout div').addClass('Selected');
      } else {
           $('.handle .checkout div').addClass('noSelected');
      }
 });

 // 全选删除
 $('.handle').on('click', '.delete', function () {
      delProducts('all');
 })
 // 单个删除
 $('#list').on('click', '.delete', function () {
      delProducts($(this));
 })
 //  删除商品
 function delProducts(isAll) {
      var oli = $('#list .checkout').find('.Selected');
      var arr = [];

      //删除多件
      if (isAll == 'all') {
           for (var i = 0; i < oli.length; i++) {
                var ids = oli.eq(i).closest('#list li').attr('id');
                var sellid = oli.eq(i).closest('#list li').data('sellid');
                var obj = {
                     storeSupplierId: sellid,
                     goodsId: Number(ids)
                }
                arr.push(obj);
           }
           if (arr.length <= 0 && isAll == 'all') {
                setMessage({
                     type: 'warning',
                     msg: '请至少选择一件商品！'
                })
                return false;
           }
      } else {
           //删除单件
           var id = isAll.eq(0).closest('#list li').attr('id');
           var sellid = isAll.eq(0).closest('#list li').data('sellid');
           var obj = {
                storeSupplierId: sellid,
                goodsId: Number(id)
           }
           arr.push(obj);
      }
      seTconfirmation('提示', '确认删除吗?', {
           then: function () {
                ajax({
                     url: 'member-api-impl/userInfo/CollectionAction',
                     methods: 'post',
                     data: {
                          productIds: arr,
                          type: 2
                     },
                     success: function (response) {
                          var data = response.data ? response.data : {};
                          if (response.code == 200) {
                               setMessage({
                                    type: 'success',
                                    msg: response.msg
                               })
                               $('.confirmation-common').css('display', 'none');
                               //删除整页后更新
                               if (arr.length == $('#list').children().length) {
                                    params.first = true; //重新分页
                                    params.pageIndex--;
                               } else if (arr.length > 1) {
                                    //删除多件后更新
                                    params.first = true; //重新分页
                               }
                               $('.handle .checkout-all div').removeClass().addClass('noSelected'); //清除全选
                               //删除单件后更新
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

 /**
  * //查看商品详情
  * @param {number|string} id --商品id
  * @param {number|string} storeSupplierId -- 店铺id
  * @param {number|string} supplierId -- 上架店铺id
  */
 function goDetail(id, storeSupplierId, supplierId) {
      if (supplierId == -1) {
           setMessage({
                type: 'warning',
                msg: '商品已过期!'
           })
           return;
      }
      window.location.href = '../purchase/productDetails.html?id=' + id + '&supplierid=' + storeSupplierId;
 }