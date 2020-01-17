//渲染公共顶部
shopHeaderTop('#header-top');
//渲染公共头部
shopHeader('#s-header');
var pageData; //接口数据
// 商品名称截取
$(".key-word .name").each(function () {
    var maxnum = 30;
    if ($(this).text().length > maxnum) {
        $(this).text($(this).text().substring(0, maxnum));
        $(this).html($(this).html() + '...');
    }
});
// 页面参数传值
var totalCount = 0; //总条数
var params = {
    pageIndex: 1,
    pageSize: 10
}
getshopCarList();
//    获取购物车数据
function getshopCarList() {
    ajax({
        methods: 'POST',
        // url: 'product-api-impl/shopcar/shopCarList',
        url: 'product-api-impl/shopcar/shopCarGoodsList',
        data: params,
        success: function (response) {
            if (response.code == 200) {
                var data = response.data.returnList ? response.data.returnList : [];
                totalCount = response.data.total;
                if (params.pageIndex > 1) {
                    pageData = pageData.concat(data);
                } else {
                    pageData = data;
                }
                createrPage(data);
                params.pages = response.data.pages;
                $(".highlight.totalNot").text(response.data.totalNot);
            } else {
                setMessage({
                    type: 'warning',
                    msg: response.msg
                });
            }
        },
        error: function (response) {

        }
    })
}
// 初始化生成页面
function createrPage(data) {
    if (data.length > 0) {
        $('#nodata').hide()
        var dom = '';
        for (var i = 0; i < data.length; i++) {
            let tmp = data[i];
            dom += '<li storeSupplierId="' + tmp.storeSupplierId + '" storeUserId="' + tmp.storeUserId + '" class="shopList">';
            dom += '<div class="store-info">';
          //   <label><input type="checkbox" class="shopAll"><div class="noSelected"></div></label>
            dom += '<div class="fl checkout-part"></div>';
            dom += '<span class="fl store-logo"></span>';
            dom += '<a href="../purchase/shopList.html?id=' + tmp.storeSupplierId + '"  class="fl">' + tmp.storeSupplierName + '</a>';
            dom += '<span class="fl serviceBtn">联系客服</span>';
            dom += '<span class="fl service-logo"></span>';
            dom += '</div>';
            dom += '<ul class="list-one">';
            let tmpii = tmp.goodsList;
            if (tmpii.length > 0) {
                for (var ii = 0; ii < tmpii.length; ii++) {
                    var iItem = tmpii[ii];
                    if (iItem.supplierId != -1) {
                        dom += '<li goodsId="' + iItem.id + '" carIds="'+iItem.shopCarId+'" goodsInventoryId="'+iItem.goodsInventoryPO.id+'" class="goodsDetail" data-money="' + iItem.shopCarCountMoney + '">'
                    } else {
                        dom += '<li goodsId="' + iItem.id + '" carIds="'+iItem.shopCarId+'"  goodsInventoryId="'+iItem.goodsInventoryPO.id+'" class="expired"  data-money="' + iItem.shopCarCountMoney + '">'
                    }
                    // 选择区域
                    // <label><input type="checkbox" class="currshop"><div class="noSelected"></div></label>
                    dom += '<div class="fl checkout-one"></div>';
                    if (iItem.supplierId != -1) {
                        dom += '<img src="' + iItem.imageAddress + '" onclick="goDetail(' + tmp.storeSupplierId + ',' + iItem.id + ')">';
                        dom += '<span class="goodsId" style="display: none;">' + iItem.id + '</span>';
                        dom += '<span class="goodsInventory" style="display: none;" title="库存数量">' + iItem.goodsInventoryPO.inventory + '</span>';
                        dom += '<div class="key-word fl"><p class="name" onclick="goDetail(' + tmp.storeSupplierId + ',' + iItem.id + ')">' + iItem.name + '</p>';
                    } else {
                        dom += '<img src="' + iItem.imageAddress + '">';
                        dom += '<span class="goodsId" style="display: none;">' + iItem.id + '</span>';
                        dom += '<span class="goodsInventory" style="display: none;" title="库存数量">' + iItem.goodsInventoryPO.inventory + '</span>';
                        dom += '<div class="key-word fl"><p class="name"' + iItem.name + '</p>';
                    }
                    dom += '<p class="weight">'
                    var dd = iItem.goodsSpecificationList
                    	for (var b = 0; b < dd.length; b++) {
						        dom += '<span>'+dd[b].categoryName+'：'+dd[b].name+'</span>&nbsp;&nbsp;'
                    	}
                    dom += '</p>'
                    dom += '</div>';
                    dom += '<div class="fl unitPrice" data-money="' + iItem.goodsInventoryPO.actualPrice + '">' + (iItem.goodsInventoryPO.actualPrice * 1).toFixed(2) + '元</div>';
                    // 输入数量
                    dom += '<div class="fl count">';
                    dom += '<span class="fl minus"></span>';
                    if (iItem.supplierId != -1) {
                        dom += '<input class="inputNum" type="text" value="' + iItem.shopCarNum + '" onkeyup="positiveIntegerMoney(this)"><span class="fl plus"></span>';
                    } else {
                        dom += '<input class="inputNum" type="text" disabled value="' + iItem.shopCarNum + '" onkeyup="positiveIntegerMoney(this)"><span class="fl plus"></span>';
                    }
                    dom += '</div>';
                    // 总价
                    dom += '<div class="fl totalPrice NowtotalPrice">' + iItem.shopCarCountMoney + '元</div>';
                    dom += '<div class="fl integralNum">' + iItem.integralCount + '积分</div>';
                    // dom += '<div id="init_integral"  style="display: none;">' + iItem.integral + '</div>';
                    if (iItem.supplierId != -1) {
                        dom += '<div class="fl handle-btn"><button class="nowPay">立即购买</button>';
                    } else {
                        dom += '<div class="fl handle-btn"><button>已失效</button>';
                    }
                    dom += '<p class="delGoods">删除商品</p></div>';
                    dom += '</li>';
                }
            }
            dom += '</ul></li>';
        }
        $("ul.list").append(dom);
    } else {
        $('#nodata').show()
    }
    // 页面生成,是否为全选状态//解决页面回退记录状态
    isAllSelect();
}
/**
 * 上下面全选
 */
function isAllSelect() {
    if ($(this).get(0).checked) {
        $('.list .goodsDetail').parents('.shopList').find('.shopAll').attr('checked', true);
        $('.list .goodsDetail').parents('.shopList').find('.shopAll').next().removeClass('noSelected').addClass('Selected');
        $('.list .goodsDetail .currshop').attr('checked', true);
        $('.list .goodsDetail .currshop').next().removeClass('noSelected').addClass('Selected');
    } else {
        $('.list .goodsDetail').parents('.shopList').find('.shopAll').attr('checked', false);
        $('.list .goodsDetail').parents('.shopList').find('.shopAll').next().removeClass('Selected').addClass('noSelected');
        $('.list .goodsDetail .currshop').attr('checked', false);
        $('.list .goodsDetail .currshop').next().removeClass('Selected').addClass('noSelected');
    }
    allSelect();
}
$('.selectAll').change(isAllSelect)
/**
 * 店铺全选
 */
$('.list').on('change', '.checkout-part .shopAll', function () {
    // 店铺下所有商品除过期商品个数
    var noExpiredLength = $(this).parents('.store-info').next('.list-one').find('.goodsDetail').length;
    // 店铺下所有商品个数
    var noExpiredLength2 = $(this).parents('.store-info').next('.list-one').find('.currshop:checked').length;
    if ($(this).get(0).checked) {
        if (noExpiredLength !== noExpiredLength2) {
            $(this).next().removeClass('noSelected').addClass('Selected');
        } else {
            $(this).attr('checked', false);
            return;
        }
        $(this).parents('.store-info').next('.list-one').find('.goodsDetail .currshop').attr('checked', true);
        $(this).parents('.store-info').next('.list-one').find('.goodsDetail .currshop').next().removeClass('noSelected').addClass('Selected');
    } else {
        $(this).next().removeClass('Selected').addClass('noSelected');
        $(this).parents('.store-info').next('.list-one').find('.goodsDetail .currshop').attr('checked', false);
        $(this).parents('.store-info').next('.list-one').find('.goodsDetail .currshop').next().removeClass('Selected').addClass('noSelected');
    }
    allSelect();
})
/**
 * 分级选择
 */
$('.list').on('change', '.currshop', function (event) {
    // 当前店铺下所有商品个数
    var currShopLength = $(this).parents('.list-one').find('.currshop').length;
    // 当前店铺下所有选中商品个数
    var currAllShopLength = $(this).parents('.list-one').find('.currshop:checked').length;
    // 是否为过期商品
    var expired = $(this).parents('.list-one').children('li').hasClass('expired');
    if ($(this).get(0).checked) {
        if (!expired) {
            $(this).next().removeClass('noSelected').addClass('Selected');
        } else {
            $(this).attr('checked', false);
            return;
        }
    } else {
        $(this).next().removeClass('Selected').addClass('noSelected');
        $(this).parents('.store-info').next('.list-one').find('.currshop').next().removeClass('Selected').addClass('noSelected');
    }
    if (currShopLength === currAllShopLength) {
        $(this).parents('li').find('.shopAll').attr('checked', true);
        $(this).parents('li').find('.shopAll').next().removeClass('noSelected').addClass('Selected');
    } else {
        $(this).parents('li').find('.shopAll').attr('checked', false);
        $(this).parents('li').find('.shopAll').next().removeClass('Selected').addClass('noSelected');
    }
    allSelect();
})
/**
 * 是否所有选择上
 */
function allSelect() {
    // 所有店铺下所有商品个数
    var AllShopLength = $('.list').find('.goodsDetail').parents('.shopList').find('.currshop').length;
    // 所有店铺下选中所有商品个数
    var AllCheckedLength = $('.list').find('.goodsDetail').parents('.shopList').find('.currshop:checked').length;
    // console.log(AllShopLength, AllCheckedLength)
    if (AllShopLength != 0 && AllShopLength === AllCheckedLength) {
        $('.selectAll').attr('checked', true);
        $('.selectAll').next().addClass('Selected');
    } else {
        $('.selectAll').attr('checked', false);
        $('.selectAll').next().removeClass('Selected').addClass('noSelected')
    }
    $(".highlight.totalNum").text(AllCheckedLength)
    totalPrice();
}
/**
 * 计算所有商品总价
 */
function totalPrice() {
//     var totalMoney = 0;
//     var arrShopDom = $('.list').find('.list-one li');
//     for (var i = 0; i < arrShopDom.length; i++) {
//         var isChecked = arrShopDom.eq(i).find('.currshop').get(0).checked;
//         if (isChecked) {
//             totalMoney += (arrShopDom.eq(i).data('money') * 1)
//         }
//     }
//     $(".highlight.totalPrice").text(totalMoney)
}
// 删除单个商品
$(".list").on('click', ".delGoods", function (event) {
	var carIds = $(this).closest('li').attr('carIds');
    var goodsId = $(this).closest('li').attr('goodsId');
    var supId = $(this).parents('.shopList').attr('storesupplierid');
    delData(goodsId, supId,carIds);
});

$('ul.list').on('change', 'input.inputNum', function (event) {
    var inputNum = parseInt($(this).val());
        goodsId = parseInt($(this).closest('li').attr('goodsid'));
       goodsInventoryId = parseInt($(this).closest('li').attr('goodsInventoryId'));//规格ID
        goodsInventory = parseInt($(this).closest('li').find('.goodsInventory').text()); //库存数量
        shopCarNum = parseInt($(this).closest('li').find('.shopCarNum').text()); //历史购物车数量
        supId = parseInt($(this).closest('li').parent().closest('li').attr('storeSupplierId'));
    if (supId != -1) {
        if (goodsInventory >= inputNum) {
        	 
            modifyGoods(goodsId,inputNum, supId, $(this),goodsInventoryId);
        } else {
            setMessage({
                type: 'warning',
                msg: "超出商品库存！"
            });
            $(this).val(goodsInventory);
            // 当前库存不等于历史购物车数量
            if (shopCarNum != goodsInventory) {
                modifyGoods(goodsId, goodsInventory, supId, $(this),goodsInventoryId);
            }
        }
    }
});
// 数量加减
$('.list').on('click', '.list-one li .count span', function (event) {
    // 已过期商品不能操作
    if ($(this).parents('.list-one').children('li').hasClass('expired')) return;
    var inputNum = parseInt($(this).parent().find('input').val()), //商品数量
    goodsInventoryId = parseInt($(this).closest('li').attr('goodsInventoryId'));//规格ID
        goodsId = parseInt($(this).closest('li').attr('goodsid')), //商品id
        goodsInventory = parseInt($(this).closest('li').find('.goodsInventory').text()), //商品库存总数
        supId = parseInt($(this).closest('li').parent().closest('li').attr('storeSupplierId'));
    if (supId == -1) {
        return;
    }
    if ($(this).hasClass('minus')) { //减
        if (inputNum == 1) {
            setMessage({
                type: 'warning',
                msg: "受不了了，宝贝不能再减少了哦"
            });
            return;
        } else {
            inputNum--
        }
    } else { //加
        if (goodsInventory <= inputNum) {
            setMessage({
                type: 'warning',
                msg: "超出商品库存！"
            });
            return;
        } else {
            inputNum++
        }
    }
    modifyGoods(goodsId, inputNum, supId, $(this),goodsInventoryId);
})

//修改商品数量
function modifyGoods(goodsId, goodsNum, supId, that,goodsInventoryId) {
	console.log(goodsNum)
    var data = {
        goodsId: (goodsId * 1),
        goodsNum: (goodsNum * 1),
        storeSupplierId: (supId * 1),
        goodsInventoryId:(goodsInventoryId*1),
    };
    ajax({
        url: 'product-api-impl/shopcar/addAndUpdateShopCar',
        methods: 'post',
        data: data,
        success: function (response) {
            if (response.code == 200) {
                that.parent().find('input').val(goodsNum);
                var unpdataMoney = that.parent().prev().data('money') * goodsNum;
                that.parent().next().text(unpdataMoney + '元');
                that.parents('.goodsDetail').data('money', unpdataMoney)
                that.parent().closest('li').find(".integralNum").html(Math.floor(unpdataMoney / 10) + '积分');
                totalPrice();
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

// 删除购物车
function delData(goodsId, supId,carIds,type) {
    var params = [];
	
    // 删除商品传值形式
    // productIds: [{storeSupplierId: 54, goodsId: 156}]
    if (type != 1) {
        params.push(carIds)
        // console.log("params=1=", obj);
    } else {
        params = goodsId;
        // console.log("params=2=", goodsId);
    }
    console.log(params)
    seTconfirmation('提示', '确认删除吗', {
        then: function () {
            ajax({
                url: 'product-api-impl/shopcar/deleteShopCarGoods',
                methods: 'post',
                data: {
                    carIds: params
                },

                success: function (response) {
                    if (response.code == 200) {
                        setMessage({
                            type: 'success',
                            msg: '删除成功'
                        })
                        $('.confirmation-common').css('display', 'none');
                        getshopCarList();
                        window.location.reload()
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
        },
        cath: function () {
            console.log('取消')
        }
    });
};
// 商品立即购买
$(".list").on('click', '.nowPay', function () {
    var goodsId = parseInt($(this).closest("li").find(".goodsId").html()),
        supId = $(this).closest("ul.list-one").closest("li").attr('storesupplierid'),
        goodsInventoryId = $(this).closest("li").attr('goodsInventoryId'),
        goodsNum = parseInt($(this).closest("li").find(".inputNum").val()),
        arr = [];
    arr.push({
        storeSupplierId: supId,
        goodsId: goodsId,
        num: goodsNum,
        goodsInventoryId:goodsInventoryId,
    });
    arr = JSON.stringify(arr);
    console.log(goodsInventoryId)
    if (supId != -1) {
        window.location.href = '../purchase/confirmOrder.html?list=' + arr;
    }
})

// 跳转结算页面 底部结算
$(".submitBtn").click(function () {
    // 所有店铺下选中所有商品个数
    var AllCheckedShop = $('.list .goodsDetail').parents('.shopList').find('.currshop:checked');
    if (AllCheckedShop.length > 0) {
        let arr = []
        for (var i = 0; i < AllCheckedShop.length; i++) {
            var goodsId = AllCheckedShop.eq(i).parents('.goodsDetail').attr('goodsid'),
                supId = AllCheckedShop.eq(i).parents('.shopList').attr('storesupplierid'),
                goodsInventoryId = AllCheckedShop.eq(i).parents('.goodsDetail').attr('goodsInventoryId'),
                goodsNum = AllCheckedShop.eq(i).parents('.goodsDetail').find('.inputNum').val();
            if (supId && supId != -1) {
                arr.push({
                    storeSupplierId: (supId * 1),
                    goodsId: (goodsId * 1),
                    num: (goodsNum * 1),
                    goodsInventoryId:(goodsInventoryId*1),
                });
            }

        }
        console.log(goodsInventoryId)
        arr = JSON.stringify(arr);
        // console.log("arr==", arr);
        window.location.href = '../purchase/confirmOrder.html?list=' + arr;
        // window.location.href = '../purchase/confirmOrder.html?list=' + arr + '&addressId=""';
        // window.location.href = 'confirmOrder.html?list=' + arr + '&addressId=0' + qdataDetail.supplierId;

    } else {
        setMessage({
            type: 'warning',
            msg: "您还没选中宝贝哦"
        })
    }

});
// 底部删除购物车
$(".bottomDel").click(function () {
    var arr = [];
    $('li .list-one li .Selected').closest('ul.list-one').each(function (i, item) {
        var supplierid = $(this).closest('li').attr('storeSupplierId');
        $(this).find('li .Selected').each(function (k, itm) {
            var goodsid = $(this).closest('li').attr('carIds');
            console.log(goodsid)
            arr.push(goodsid);
        })
    })
    if (arr.length <= 0) {
        setMessage({
            type: 'warning',
            msg: '请至少选择一件商品！'
        })
        return false;
    }
      delData(arr, 0,0, 1);

})
// 购物车底部清楚已失效
$(".bottom-pay .clearAll").click(function () {
    var arr = [];
    var allClearShopList = $('.list .expired');
    if (allClearShopList.length > 0) {
        ajax({
            url: 'product-api-impl/shopcar/deleteShopCarInvalidGoods',
            methods: 'post',
            data: {},
            success: function (response) {
                if (response.code == 200) {
                    setMessage({
                        type: 'success',
                        msg: '清除成功'
                    })
                    // $('.confirmation-common').css('display', 'none');
                    window.location.reload()
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
    } else {
        setMessage({
            type: 'warning',
            msg: '购物车暂无失效商品！'
        })
    }
})
// 操作节流
var _throttle = function (wait, fn) {
    var pre = 0,
        result;

    return function () {
        var now = (new Date()).getTime();
        if (now - pre > wait) {
            result = fn.apply();
            pre = now;
            return result;
        }
    }
};

// 滑动加载更多
$('body').scroll(function () {
    _throttle(300, function () {
        var scrollTop = $(this).scrollTop();
        var scrollHeight = $(document).height();
        var windowHeight = $(this).height();
        if (scrollTop + windowHeight >= scrollHeight) {
            if (totalCount > params.pageIndex * params.pageSize) {
                params.pageIndex++;
                getshopCarList();
            }
        }
    })();
})
// 跳转消息页面
$('.list').on('click', ".serviceBtn", function () {
    var storeUserId = $(this).parents('.shopList').attr('storeUserId');
    if (storeUserId && storeUserId != -1) {
        window.location.href = '../chitchat.html?id=' + storeUserId + '&isSupplier=1';
    } else {
        setMessage({
            type: 'warning',
            msg: '店铺不存在'
        })
    }
})
// 跳转商品详情页面
function goDetail(storesupplierid, goodsid) {
    window.location.href = '../purchase/productDetails.html?id=' + goodsid + '&supplierid=' + storesupplierid;
}