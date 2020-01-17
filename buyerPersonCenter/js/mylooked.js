 function init() { //渲染公共顶部
      shopHeaderTop('#header-top');
      //渲染公共头部
      shopHeader('#s-header');

      // 时间控件
      laydate({
           elem: '#J-xl'
      });
      // 默认日期为当天
      var nowMonth = new Date().getMonth() + 1;
      var nowDate = new Date().getDate();
      if (nowMonth < 10) {
           nowMonth = '0' + nowMonth;
      }
      if (nowDate < 10) {
           nowDate = '0' + nowDate;
      }
      $('#J-xl').val(new Date().getFullYear() + '-' + nowMonth + "-" + nowDate);
 }
 init(); //初始化
 // 获取列表
 var params = {
      "pageIndex": 1,
      "pageSize": 8,
      first: true
 }
 getList();

 //请求接口数据
 function getList() {
      var time = $('#J-xl').val().split('-');
      ajax({
           methods: 'POST',
           url: 'product-api-impl/app/getUserBrowsingHistoryPage',
           data: {
                "year": time[0],
                "month": time[1],
                "day": time[2],
                "pageIndex": params.pageIndex,
                "pageSize": params.pageSize,
           },
           success: function (response) {
                if (response.code == 200) {
                     var data = response.data ? response.data : {};
                     if (data.list.length == 0) {
                          $('#nodata').show();
                     } else {
                          $('#nodata').hide();
                     }
                     var listDom = '';
                     for (var i = 0; i < data.list.length; i++) {
                          listDom += '<li id="' + data.list[i].historyId + '" name="' + data.list[i].browsingTime + '">';
                          listDom += '<img onClick="goDetail(' + data.list[i].goodsId + ',' + data.list[i].storeSupplierId + ',' + data.list[i].supplierId + ')" src="' + data.list[i].goods.imageAddress + '" alt="">';
                          listDom += '<p class="price">¥ ' + data.list[i].goods.actualPrice + '</p>';
                          listDom += '<p class="key-word">' + nameSubstring(data.list[i].goods.name) + '</p>';
                          listDom += '<div class="del">';
                          listDom += '<sapn class="delete">删除</sapn>';
                          listDom += '</div>';
                          listDom += '</li>';
                     }
                     $('#list').html(listDom); //不用清除， 直接html覆盖就好
                     if (params.first) {
                          params.first = false;
                          page({
                               pageSize: params.pageSize,
                               pageNum: params.pageIndex,
                               total: data.total,
                               fn: function (e) {
                                    params.pageIndex = e.current;
                                    getList(); //更新
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

 // 筛选
 $('.filtrate span').on('click', function () {
      params.pageIndex = 1;
      params.first = true;
      getList();
 })


 //删除浏览商品
 $('#list').on('click', '.delete', function () {
      var historyId = $(this).closest('#list li').attr('id');
      var browsingTime = $(this).closest('#list li').attr('name');
      //  $(this).parent().css('display', 'none'); //点击删除时， 删除按钮会覆盖在删除框上， 隐藏
      seTconfirmation('提示', '确认删除吗?', {
           then: function () {
                ajax({
                     url: 'product-api-impl/app/delUserBrowsingHistory',
                     methods: 'post',
                     data: {
                          "childDTOList": [{
                               "historyId": historyId,
                               "time": browsingTime
                          }],
                          "delAll": false
                     },
                     success: function (response) {
                          var data = response.data ? response.data : {};
                          if (response.code == 200) {
                               setMessage({
                                    type: 'success',
                                    msg: response.data
                               })
                               $('.confirmation-common').css('display', 'none');
                               if ($('#list').children().length == 1) {
                                    params.first = true; //重新分页
                                    params.pageIndex--;
                                    getList();
                               } else {
                                    getList();
                               }
                          } else {
                               setMessage({
                                    type: 'warning',
                                    msg: response.data
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