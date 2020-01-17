//帮扶信息获取
function villagedata() {
     ajax({
          url: '/member-api-impl/income/getVillageIncomeList',
          methods: 'post',
          data: {},
          success: function (response) {
               var data = response.data ? response.data : {};
               if (response.code == 200) {
                    var dom = '';
                    var dom2 = '';
                    var sum = 0;
                    var sum2 = 0;
                    var arr = [];
                    for (var i = 0; i < data.length; i++) {
                         dom += '<ul class="data-table-td">';
                         dom += '<li style="width: 131px;">' + data[i].villageCount + '<span></span></li>';
                         dom += '<li style="width: 171px;">' + data[i].incomeOtherTotal + '<span></span></li>';
                         dom += '<li style="width: 121px;">' + data[i].incomeSellTotal + '<span></span></li>';
                         dom += '<li style="width: 150px;">' + data[i].incomeLabourTotal + '</li>';
                         dom += '</ul>';
                         dom2 += '<ul class="data-table-td">';
                         dom2 += '<li style="width: 131px;">' + data[i].incomeServiceTotal + '<span></span></li>';
                         dom2 += '<li style="width: 171px;">' + data[i].incomeRentTotal + '<span></span></li>';
                         dom2 += '<li style="width: 121px;">' + data[i].incomeManageTotal + '<span></span></li>';
                         dom2 += '<li style="width: 150px;">' + data[i].incomeTotal + '</li>';
                         dom2 += '</ul>';
                         var list = [
                              data[i].incomeSellTotal,
                              data[i].incomeLabourTotal,
                              data[i].incomeServiceTotal,
                              data[i].incomeRentTotal,
                              data[i].incomeManageTotal
                         ]
                         for (var j = 0; j < list.length; j++) {
                              arr.push(list[j])
                         }
                         sum += data[i].incomeTotal;
                         sum2 += data[i].incomeRemain;
                    }
                    $('.data-left .data-table .data-top-content').html(dom);
                    $('.data-left .data-table .data-bottom-content').html(dom2);
                    Initecharts(arr, sum, sum2)
                    if (!data.length) {
                         $('.data-right').hide();
                    } else {
                         $('.data-right').show();
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
}
villagedata()

function Initecharts(arr, incomeTotal, incomeRemain) {
     /*
      * @Author: liwanli 
      * @Date: 2019-03-27 09:13:18 
      * @Last Modified by: liwanli
      * @Last Modified time: 2019-04-01 14:34:40
      */
     // 基于准备好的dom，初始化echarts图表
     var ractbar = echarts.init(document.getElementById('ractbar'));
     var progress = echarts.init(document.getElementById('progress'));
     var balance = echarts.init(document.getElementById('balance'));
     //数据

     var barOptionData = {
          title: {
               x: 'center',
               text: '数据统计',
               textStyle: {
                    fontSize: 16,
                    color: '#B3B3B3'
               }
          },
          tooltip: {
               trigger: 'item'
          },
          grid: {
               borderWidth: 0,
               x: 0,
               x2: 0,
               y: 50,
               y2: 30
          },
          xAxis: [{
               type: 'category',
               position: "bottom",
               show: true,
               offset: 0,
               data: ['销售收入', '劳务收入', '服务收入', '租赁收入', '管理收入'],
               splitLine: {
                    show: false //去除网格线
               },
               splitArea: {
                    show: false //去除网格背景颜色
               },
               axisTick: {
                    show: false //隐藏X轴刻度长度
               },
               axisLine: {
                    show: false //隐藏X轴刻度长度
               }
          }],
          yAxis: [{
               type: 'value',
               show: false
          }],
          series: [{
                    name: '数据统计',
                    type: 'bar',
                    barWidth: 25,
                    align: "bottom",
                    barGap: "45px",
                    /*多个并排柱子设置柱子之间的间距*/
                    barCategoryGap: "45px",
                    /*多个并排柱子设置柱子之间的间距*/
                    data: arr,
                    itemStyle: {
                         normal: {
                              color: "#46A1E0",
                              label: {
                                   show: true,
                                   position: 'top'
                              }
                         }
                    }
               }

          ]
     };
     var progressData = {
          title: {
               show: true,
               text: "完成进度",
               textStyle: {
                    fontSize: 16,
                    fontWeight: 'normal',
                    color: '#333'
               },
               x: 70,
               y: 170
          },
          color: ['#46A1E0', '#B7DFF9'],
          series: [{
               // name: '访问来源',
               type: 'pie',
               radius: ['40%', '70%'],
               center: ['50%', '40%'],
               startAngle: 10,
               minAngle: 20,
               itemStyle: {
                    normal: {
                         label: {
                              show: false
                         },
                         labelLine: {
                              show: false
                         }
                    },
                    emphasis: {
                         show: true,
                         label: {
                              show: true,
                              position: 'center',
                              textStyle: {
                                   fontSize: '16',
                                   fontWeight: 'bold'
                              }
                         }
                    }
               },
               data: [{
                         value: incomeTotal,
                         name: '已完成'
                    },
                    {
                         value: incomeRemain,
                         name: '未完成'
                    }
               ]
          }]
     };
     var balanceData = {
          title: {
               show: true,
               text: "剩余额度",
               textStyle: {
                    fontSize: 16,
                    fontWeight: 'normal',
                    color: '#333'
               },
               x: 70,
               y: 170
          },
          color: ['#FFB6B6', '#E1212D'],
          series: [{
               name: '访问来源',
               type: 'pie',
               radius: ['40%', '70%'],
               center: ['50%', '40%'],
               startAngle: 10,
               minAngle: 20,
               itemStyle: {
                    normal: {
                         label: {
                              show: false
                         },
                         labelLine: {
                              show: false
                         }
                    },
                    emphasis: {
                         show: true,
                         label: {
                              show: true,
                              position: 'center',
                              textStyle: {
                                   fontSize: '16',
                                   fontWeight: 'bold'
                              }
                         }
                    }
               },
               data: [{
                         value: incomeTotal,
                         name: '已完成'
                    },
                    {
                         value: incomeRemain,
                         name: '未完成'
                    }
               ]
          }]
     };

     // 为echarts对象加载数据
     ractbar.setOption(barOptionData);
     progress.setOption(progressData);
     balance.setOption(balanceData);
}

function init() {
     headerTop('#header'); //渲染顶部
     headerNav('#header-seach'); //渲染头部导航
}
init();