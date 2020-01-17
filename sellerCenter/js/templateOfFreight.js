function init() {
     headerTop('#header'); //渲染顶部
     headerNav('#header-seach'); //渲染头部导航
     applySellerCenter('#centre-left-nav'); //渲染默认左边导航
     getList();
}
init();
//获取列表
function getList() {
     ajax({
          url: 'member-api-impl/template/list',
          methods: 'post',
          data: {
               rank: 1
          },
          success: function (response) {
               if (response.code == 200) {
                    var data = response.data ? response.data : [];
                    var dom = '';
                    for (var i = 0; i < data.length; i++) {
                         var shipWay = '';
                         switch (data[i].shipWay) {
                              case 1:
                                   shipWay = '快递'
                                   break;
                              case 2:
                                   shipWay = 'ems'
                                   break;
                              case 3:
                                   shipWay = '平邮'
                                   break;
                              default:
                                   shipWay = ''

                         }
                         dom += '<li id="' + data[i].id + '">';
                         dom += '<table>';
                         dom += '<tr class="first">';
                         dom += '<td colspan="1">' + data[i].name + '（运费方式:' + shipWay + '）' + '</td>';
                         dom += '<td colspan="4">';
                         dom += '最后编辑时间：' + data[i].updateTime;
                         dom += '<span class="btn" style="display:none;">复制模板</span>';
                         dom += '<span class="btn" onClick="goEditFreight(' + data[i].id + ')">编辑</span>';
                         dom += '<span class="btn" onClick="delData(' + data[i].id + ')">删除</span>';
                         dom += '</td>';
                         dom += '</tr>';
                         dom += '<tr>';
                         // dom += '<td width="20%">运费方式</td>';
                         dom += '<td width="40%">运送到</td>';
                         dom += '<td width="15%">首件（个）</td>';
                         dom += '<td width="15%">运费（元）</td>';
                         dom += '<td width="15%">续件（个）</td>';
                         dom += '<td>运费（元）</td>';
                         dom += '</tr>';
                         for (var k = 0; k < data[i].list.length; k++) {
                              var list = data[i].list;
                              dom += '<tr>';

                              // dom += '<td>' + shipWay + '</td>';
                              var area = '';
                              if (list[k].isDefault == 1) {
                                   var areaList = list[k].areaNames.split(',');
                                   for (var j = 0; j < areaList.length; j++) {
                                        area += areaList[j] + '&nbsp;';
                                   }
                              } else {
                                   area = '全国';
                              }
                              dom += ' <td>' + area + '</td>';
                              dom += '<td>' + list[k].firstCount + '</td>';
                              dom += '<td>' + list[k].firstMoney + '</td>';
                              dom += ' <td>' + list[k].continueCount + '</td>';
                              dom += '<td>' + list[k].continueMoney + '</td>';
                              dom += '</tr>';
                         }

                         dom += '</table>';
                         dom += ' </li>';
                    }
                    $('.list').html(dom);

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

// 删除模板
function delData(id) {
     seTconfirmation('提示', '确认删除吗', {
          then: function () {
               ajax({
                    url: 'member-api-impl/template/del',
                    methods: 'post',
                    data: {
                         id: id
                    },
                    success: function (response) {
                         if (response.code == 200) {
                              setMessage({
                                   type: 'success',
                                   msg: response.msg
                              })
                              $('.confirmation-common').css('display', 'none');
                              getList();

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
          },
          cath: function () {
               console.log('取消')
          }
     });
}

// 进入编辑页
function goEditFreight(id) {
     window.open('./freightCompile.html?template=2&id='+id,'_self')
}