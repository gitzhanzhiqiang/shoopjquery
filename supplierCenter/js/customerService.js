function init() {
     headerTop('#header'); //渲染顶部
     headerNav('#header-seach'); //渲染头部导航
     applySupplierCenter('#centre-left-nav'); //渲染默认左边导航
}
init();
// 选中checkout
$('#list').on('click', '.checkout div', function () {
     var that = $(this);
     var name = '';
     if (that.attr('class') == 'noSelected') {
          name = 'Selected';
     } else {
          name = 'noSelected';

     }
     that.removeClass();
     that.addClass(name);
});
// 切换导航
$('#nav li').click(function () {
     $('#nav li span').removeClass('hover');
     $(this).children('span').eq(0).addClass('hover');
     parameter = {
          pageNum: 1,
          pageSize: 10,
          backStatus: $(this).children('span').eq(0).attr('backStatus'),
          returnType: $(this).children('span').eq(0).attr('returnType'),
          first: true
     }
     getList();
});

//全部 status 100 refundStatus 100
//就退款(未发货) status 1 refundStatus 1
//仅退款(已发货) status 2 refundStatus 1
//退货(已发货) status 2 refundStatus 2
//换货 status 200  refundStatus 200
var parameter = {
     backStatus: '',
     returnType: '',
     pageIndex: 1,
     pageSize: 10,
     first: true
}
getList();
//获取数据
function getList() {
     ajax({
          url: 'order-api-impl/orderReturn/getSellerReturnOrderList',
          methods: 'post',
          data: {
               backStatus: parameter.backStatus,
               returnType: parameter.returnType,
               pageIndex: parameter.pageIndex,
               pageSize: parameter.pageSize,
               rank: 2
          },
          success: function (response) {
               if (response.code == 200) {
                    var data = response.data ? response.data : {};
                    var oli = $('#nav li');
                    oli.eq(1).find('span').eq(1).html(data.refundAwaitCount);
                    oli.eq(2).find('span').eq(1).html(data.refundConsigneeCount);
                    oli.eq(3).find('span').eq(1).html(data.refundFinishCount);
                    oli.eq(4).find('span').eq(1).html(data.exchangeCount);
                    var dom = '';
                    var list = data.page.records;
                    for (var i = 0; i < list.length; i++) {
                         //订单头部
                         dom += '<li id=' + list[i].returnId + '><div class="list-head">';
                         dom += '<div class="table-one">';
                         dom += '<div class="fl date">' + list[i].applyTime + '</div>';
                         dom += '<div class="fl">订单号：' + list[i].orderNumber + '</div>';
                         dom += '</div>';
                         dom += '</div>';
                         if (list[i].detailList) {
                              for (var j = 0; j < list[i].detailList.length; j++) {
                                   //订单内容
                                   if (j == 0) {
                                        dom += '<div class="list-content first">';
                                   } else {
                                        dom += '<div class="list-content">';
                                   }
                                   dom += '<div class="fl list-text">';
                                   dom += '<img src="' + list[i].detailList[j].goodsImage + '" alt="" class="fl">';
                                   dom += '<div class="fl">';
                                   dom += '<h3>' + list[i].detailList[j].goodsName + '</h3>';
//                                 dom += '<p>净含量' + list[i].detailList[j].weight + '克</p>';
								   dom += '<p>'
				                    	var dd = list[i].detailList[j].specifValueJson
				                    	for (var b = 0; b < dd.length; b++) {
				                    		for(var filed in dd[b]){
										        dom += '<span>'+filed+'：'+dd[b][filed]+'</span>&nbsp;&nbsp;'
										    }
				                    	}
			                    	dom += '</p>'
                                   dom += '</div>';
                                   dom += '</div>';
                                   dom += '<div class="fl number">';
                                   dom += '<div class="fl price">￥' + list[i].detailList[j].goodsMoney + '</div>';
                                   dom += '<div class="fl">x' + list[i].detailList[j].goodsNum + '</div>';
                                   dom += '</div>';
                                   dom += '<div class="fl logistics">';
                                   dom += '<div><span>收货信息：</span><span>' + list[i].receiveAddress + '</span></div>';
                                   dom += '<div><span>物流公司：</span><span>' + list[i].materialCompany + '</span></div>';
                                   dom += '</div>';
                                   dom += '</div>';
                              }
                         }
                         //订单操作
                         dom += '<div class="list-button">';
                         if(list[i].canHandle){//判断是否自己的订单
	                         if (list[i].returnType == 1) {
	                              //退款
	                              if (list[i].refundStatus == 1) {
	                                   dom += '<p class="fr investigate" isAgree="true" isReturn="false" choose="true">同意退款</p>';
	                                    dom += '<p class="fr investigate" isAgree="true" isReturn="false" choose="false">不同意退款</p>';
	                              } else if (list[i].refundStatus == 2) {
	                                   dom += '<p class="fr investigate" isAgree="false" isReturn="false">确认收货</p>';
	                              }
	                         } else if (list[i].returnType == 2) {
	                              //退货
	                              if (list[i].exchangeStatus == 1) {
	                                   dom += '<p class="fr investigate" isAgree="true" isReturn="true" choose="true">同意换货</p>';
	                                    dom += '<p class="fr investigate" isAgree="true" isReturn="true" choose="false">不同意换货</p>';
	                              } else if (list[i].exchangeStatus == 2) {
	                                   dom += '<p class="fr investigate" isAgree="false" isReturn="true">确认收货</p>';
	                              }
	                         }
	                         
                       }  
                         if (list[i].status == 6 || list[i].status == 7) {
	                              dom += '<p class="fr" isAgree="true" isReturn="true" style="padding: 0 5px;"  onClick="lookDetail(' + list[i].returnId + ')">退货/换货详情</p>';
	                         }
                         dom += '</div></li>';
                    }
                    $('#list').html(dom);
                    if (parameter.first) {
                         parameter.first = false;
                         page({
                              pageSize: parameter.pageSize,
                              pageNum: parameter.pageIndex,
                              total: data.page.total,
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
}

$('#list').on('click', '.list-button p.investigate', function () {
     var isAgree = $(this).attr('isAgree'),
          isReturn = $(this).attr('isReturn'),
           choose = $(this).attr('choose'),
          url = '',
          returnType,
          text = '';
     if (isAgree == 'true') {
          url = 'order-api-impl/orderReturn/agreeOrderinfoBack';
          if (isReturn == 'true') {
               var returnType = 2;
               text = '确认同意换货吗';
          } else {
               returnType = 1;
               text = '确认同意退款吗';
          }
     } else {
          url = 'order-api-impl/orderReturn/confirmOrderinfoBack';
          if (isReturn == 'true') {
               var returnType = 2;
               text = '确认收货吗';
          } else {
               returnType = 1;
               text = '确认收货吗';
          }
     }
     var _that = this;
     seTconfirmation('提示', text, {
          then: function () {
               ajax({
                    url: url,
                    methods: 'post',
                    data: {
                         returnId: $(_that).parent().parent().attr('id'),
                         returnType: returnType,
                         isAgree:choose,
                    },
                    success: function (response) {
                         var data = response ? response : {};
                         console.log(response)
                         if (data.code == 200) {
                              setMessage({
                                   type: 'success',
                                   msg: data.msg
                              })
                              setTimeout(function () {
                                   // window.location.reload();
                              }, 800)
                         } else {
                              setMessage({
                                   type: 'warning',
                                   msg: data.msg
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

// 关闭弹窗
function CloseAlert() {
     $('.alertForm').hide();
     $('.alertForm.leaveMsg1').find('span').eq(4).empty()//清空
}
// 查看详情
function lookDetail(id) {
     $('.alertForm.leaveMsg1').show();
     ajax({
          url: 'order-api-impl/orderReturn/getSellerReturnView',
          methods: 'post',
          data: {
               returnId: id
          },
          success: function (response) {
               var data = response.data ? response.data : {};
               if (response.code == 200) {
                    var form = $('.alertForm.leaveMsg1');
                    form.find('span').eq(0).html(data.applyTime);//退货时间
                    form.find('span').eq(1).html(data.consigneeName);//退货名字
                    form.find('span').eq(2).html(data.reason);//退货原因
                    form.find('span').eq(3).html(data.reasonText);//退货说明
                    var imgs = data.returnPic.split(',')
                    for (var i = 0 ; i<imgs.length ; i++) {
                    	 form.find('span').eq(4).append('<img src="'+imgs[i]+'" alt="">')
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