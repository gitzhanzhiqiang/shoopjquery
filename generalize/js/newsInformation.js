//渲染公共顶部
shopHeaderTop('#header-top');
//渲染公共头部
shopHeader('#s-header');
//渲染公共底部
shopFooter('#s-footer');


// 买家首页菜单
getGeneralizeNav();


getRecentnews();
//  获取最新动态
function getRecentnews() {
     ajax({
          methods: 'POST',
          url: 'support-api-impl/newsClassify/seleNewsClassifyById',
          data: {
               classifyId: 1,
               pageSize: 6,
               pageIndex: 1
          },
          success: function (response) {
               if (response.code == 200) {
                    var data = response.data.newsArticleVOList ? response.data.newsArticleVOList : [];
                    var dom = '';
                    for (var i = 0; i < data.length; i++) {
                         var oli = '<li id=' + data[i].id;
                         var oclass = (i + 1) % 3 == 1 ? ' class="side">' : ">";
                         oli += oclass;
                         oli += data[i].title + '</li>'
                         dom += oli;
                    }
                    $('.recentNews ul').html(dom);
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
getRecentnews0();
//  获取消薄活动
function getRecentnews0() {
     ajax({
          methods: 'POST',
          url: 'support-api-impl/newsClassify/seleNewsClassifyById',
          data: {
               classifyId: 2,
               pageSize: 5,
               pageIndex: 1
          },
          success: function (response) {
               if (response.code == 200) {
                    var data = response.data.newsArticleVOList ? response.data.newsArticleVOList : [];
                    var dom = '';
                    for (var i = 0; i < data.length; i++) {
                         dom += '<li id=' + data[i].id + '>' + data[i].title + '</li>';
                    }
                    $('.exhibition .fl ul').html(dom);
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
getRecentnews1();
//  法律法规
function getRecentnews1() {
     ajax({
          methods: 'POST',
          url: 'support-api-impl/newsClassify/seleNewsClassifyById',
          data: {
               classifyId: 3,
               pageSize: 6,
               pageIndex: 1
          },
          success: function (response) {
               if (response.code == 200) {
                    var data = response.data.newsArticleVOList ? response.data.newsArticleVOList : [];
                    var dom = '';
                    for (var i = 0; i < data.length; i++) {
                         dom += '<li id=' + data[i].id + '>' + data[i].title + '</li>';
                    }
                    $('.exhibition .fr ul').html(dom);
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
function go_detail(id) {
     window.location.href = './newsList.html?id=' + id;
}