//渲染公共顶部
shopHeaderTop('#header-top');
//渲染公共头部
shopHeader('#s-header');

$('ul').on('click', 'h3', function () {
     window.location.href = 'helpDetails.html?id=' + $(this).attr('id');
})
getList();
//获取列表
function getList() {
     ajax({
          url: 'member-api-impl/helpservice/getHelpServiceList',
          methods: 'post',
          data: {},
          success: function (response) {
               var data = response.data ? response.data : [];
               if (response.code == 200) {
                    var dom = '';
                    for (var i = 0; i < data.length; i++) {
                         dom += '<li>';
                         dom += '<h3 id="' + data[i].id + '">' + data[i].name + '</h3>';
                         dom += '<p>' + data[i].text + '</p>';
                         dom += '</li>';
                    }
                    $('ul#list').html(dom);
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