//渲染公共顶部
shopHeaderTop('#header-top');
//渲染公共头部
shopHeader('#s-header');
//渲染公共底部
shopFooter('#s-footer');
// 买家首页菜单
getGeneralizeNav();

var parameter = {
     pageIndex: 1,
     pageSize: 10,
     classifyId: getQueryString('id'),
     first: true
}
if (getQueryString('id') == 1) {
     $('h3').html('最新活动');
} else if (getQueryString('id') == 2) {
     $('h3').html('消薄活动');
} else {
     $('h3').html('法律法规');
}
getRecentnews();
function getRecentnews() {
     ajax({
          methods: 'POST',
          url: 'support-api-impl/newsClassify/seleNewsClassifyById',
          data: {
               pageIndex: parameter.pageIndex,
               pageSize: parameter.pageSize,
               classifyId: parameter.classifyId,
          },
          success: function (response) {
               if (response.code == 200) {
                    var data = response.data.newsArticleVOList ? response.data.newsArticleVOList : [];
                    var dom = '';
                    for (var i = 0; i < data.length; i++) {
                         dom += '<li id=' + data[i].id + '>' + data[i].title + '</li>'
                    }
                    $('.exhibition ul').html(dom);
                    if (parameter.first) {
                         parameter.first = false;
                         page({
                              pageSize: parameter.pageSize,
                              pageNum: parameter.pageIndex,
                              total: response.data.total,
                              fn: function (e) {
                                   parameter.pageIndex = e.current;
                                   getRecentnews(); //更新
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
               setMessage({
                    type: 'warning',
                    msg: response.msg
               })
          }
     })
}
$('ul').on('click', 'li', function () {
     var id = $(this).attr('id');
     // console.log(id)
     window.location.href = './newsContent.html?id=' + id;
})
