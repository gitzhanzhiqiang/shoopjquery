//渲染公共顶部
shopHeaderTop('#header-top');
//渲染公共头部
shopHeader('#s-header');
//渲染公共底部
shopFooter('#s-footer');
// 买家首页菜单
getGeneralizeNav();

getdetail();
//  获取最新动态
function getdetail() {
     ajax({
          methods: 'POST',
          url: 'support-api-impl/newsClassify/seleNewsArticleById',
          data: {
               articleId: getQueryString('id')
          },
          success: function (response) {
               if (response.code == 200) {
                    var data = response.data ? response.data : {};
                    $('.title').children().eq(0).html(data.title);
                    $('.title').children().eq(1).find('span').eq(0).html(data.createTime);
                    $('.title').children().eq(1).find('span').eq(1).html(data.articleSource);
                    $('.content1').html(data.content);
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