//渲染公共顶部
shopHeaderTop('#header-top');
//渲染公共头部
shopHeader('#s-header');


getList();
//获取列表
function getList() {
     ajax({
          url: 'member-api-impl/helpservice/getHelpServiceById',
          methods: 'post',
          data: {
               id: getQueryString('id')
          },
          success: function (response) {
               var data = response.data ? response.data : {};
               if (response.code == 200) {
                    $('#help h3').html(data.name);
                    $('#help p').html(data.text);
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