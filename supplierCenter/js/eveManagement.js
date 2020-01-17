function init() {
     headerTop('#header'); //渲染顶部
     headerNav('#header-seach'); //渲染头部导航
     applySupplierCenter('#centre-left-nav'); //渲染默认左边导航
}
init();
var parameter = {
     pageIndex: 1,
     pageSize: 10,
     rank: 2,
     first: true
}

function getList() {
     ajax({
          url: 'product-api-impl/estimate/selectestimatePageList',
          methods: 'post',
          data: parameter,
          success: function (response) {
               var data = response.data ? response.data : {};
               if (response.code == 200) {
                    var stc = 5
                    var dom = ''
                    for (var i = 0; i < data.list.length; i++) {
                         var oli = data.list[i]
                         dom += '<li>'
                         dom += '<div class="text_list_one">'
                         dom += '<p>' + oli.nickname + '</p>'
                         dom += '<span>'
                         for (var id = 0; id < oli.rank; id++) {
                              dom += '<img src="./images/start1.png"/>'
                         }
                         for (var id = 0; id < stc - oli.rank; id++) {
                              dom += '<img src="./images/start2.png"/>'
                         }
                         dom += '</span>'
                         dom += '</div>'
                         dom += '<div class="text_list_two">'
                         dom += '<p>' + oli.content + '</p>'
                         dom += '<span>' + oli.createTime + '</span>'
                         dom += '</div>'
                         dom += '<div class="text_list_three">'
                         dom += '<h4>' + oli.goodsName + '</h4>'
                         dom += '<p>' + oli.specifValueJsonString.replace(/\"/g, "") + '</p>'
                         dom += '</div>'
                         dom += '</li>'
                    }

                    $("#text_list_d").append(dom)
                    if (parameter.first) {
                         parameter.first = false;
                         page({
                              pageSize: parameter.pageSize,
                              pageIndex: parameter.pageIndex,
                              total: data.total,
                              fn: function (e) {
                                   parameter.pageIndex = e.current;
                                   getList(); //更新
                              }
                         });
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

};
getList()