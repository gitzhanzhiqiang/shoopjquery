function init() {
    headerTop('#header'); //渲染顶部
    headerNav('#header-seach'); //渲染头部导航
    applySellerCenter('#centre-left-nav'); //渲染默认左边导航
    var dom = '<input type="text" name="token" style="display: none;" value="' + $.cookie('token') + '"/>'
    dom += '<input name="id" type="text" placeholder="请填写" style="display: none;">'
    $('#ajaxForm').append(dom);
}
init();

getList(); //获取表格数据
/**
* 获取表格数据
*/
var bannerList = [];
function getList() {
    $('table #oli').remove();
    ajax({
        url: 'product-api-impl/banner/getBannerListBySupplier',
        methods: 'get',
        success: function (response) {
            var data = response.data ? response.data : {};
            bannerList = data;
            var len = bannerList.length;
            if (response.code == 200) {
                var dom = '';
                for (var i = 0; i < len; i++) {
                    var displayWay = "PC";
                    if(bannerList[i].displayWay === 1){
                        displayWay = "移动端"
                    }
                    dom += '<tr class="oli" id="oli">';
                    dom += '<td colspan="2">'
                    dom += '<span>' + bannerList[i].id + '</span>'
                    dom += '</td>'
                    dom += '<td>'
                    dom += '<span>' + bannerList[i].bannerName + '</span>'
                    dom += '</td>'

                    dom += ' <td class="imgTd">';
                    dom += ' <span class="lookPic">查看图片</span>';
                    dom += ' <div class="imgBox">';
                    dom += ' <img src=' + bannerList[i].picture + ' alt="">';
                    dom += ' </div>';
                    dom += '</td>';
                    dom += '<td>';
                    dom += ' <span>' + displayWay + '</span>'
                    dom += '</td>'
                    dom += '<td>';
                    dom += ' <span>' + bannerList[i].sort + '</span>'
                    dom += '</td>'
                    dom += ' <td>'
                    dom += '<span class="del" id=' + bannerList[i].id + '>删除</span> '
                    dom += ' <span class="add" id=' + bannerList[i].id + '>编辑</span>'
                    dom += '</td>'
                    dom += '</tr>'
                }
                $('table').append(dom);
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

// 关闭弹窗
function CloseAlert() {
    $('input[name="id"]').val('');
    $('input[name="sort"]').val('');
    $('input[name="bannerName"]').val('');
    $('input[type="file"]').val('');
    $('.alertForm').find('.ddd').attr('src', '');
    $('.alertForm').hide();
    $('.alertForm').find('.ddd').css('display', 'none');
    radioCheck('displayWay', 1);
}

// 提交
var reg = /^[1-5]*$/
function submitLeaveMessage() {
    var url = 'product-api-impl/banner/addBannerBySupplier' //新增
    var surl = 'product-api-impl/banner/getAddBannerSubmitInfo' //ie调用地址
    var dom = $('.alertForm h3 span').html();
    // 表单验证
    if (dom == '添加banner') {
        if (!$('input[name="bannerName"]').val()) {
            setMessage({
                type: 'warning',
                msg: '名称不允许为空'
            })
            return false;
        }

        var sort = $('input[name="sort"]').val();
        if (!sort) {
            setMessage({
                type: 'warning',
                msg: '显示顺序不允许为空'
            })
            return false;
        } else {
            if (!reg.test(sort)) {
                setMessage({
                    type: 'warning',
                    msg: '显示顺序为1-5范围内的数字'
                })
                return false;
            } else {
                sort *= 1;
                if (sort < 1 || sort > 5) {
                    setMessage({
                        type: 'warning',
                        msg: '显示顺序为1-5范围内的数字'
                    })
                    return false;
                }
            }
        }

        if (!$('input[name="picFile"]').val()) {
            setMessage({
                type: 'warning',
                msg: '请添加图片'
            })
            return false;
        }
    }

    if (dom == '编辑banner') {
        url = 'product-api-impl/banner/updateBannerBySupplier';
        surl = 'product-api-impl/banner/getUpdateBannerSubmitInfo';
        if (!$('input[name="bannerName"]').val()) {
            setMessage({
                type: 'warning',
                msg: '名称不允许为空'
            })
            return false;
        }

        var sort = $('input[name="sort"]').val();
        if (!sort) {
            setMessage({
                type: 'warning',
                msg: '显示顺序不允许为空'
            })
            return false;
        } else {
            if (!reg.test(sort)) {
                setMessage({
                    type: 'warning',
                    msg: '显示顺序为1-5范围内的数字'
                })
                return false;
            } else {
                sort *= 1;
                if (sort < 1 || sort > 5) {
                    setMessage({
                        type: 'warning',
                        msg: '显示顺序为1-5范围内的数字'
                    })
                    return false;
                }
            }
        }

        if (!$('.ddd').attr('src')) {
            if (!$('input[name="picFile"]').val()) {
                setMessage({
                    type: 'warning',
                    msg: '请添加图片'
                })
                return false;
            }
        }
    }

    $('#ajaxForm').attr('action', baseUrl + url);
    $('#ajaxForm').ajaxSubmit({
        success: function (data) {
            console.log(data)
            var number = IEVersion();
            if (number != -1 && number < 10) {
                ajax({
                    url: surl,
                    methods: 'get',
                    data: {},
                    success: function (response) {
                        var data = response ? response : {};
                        console.log(response)
                        if (data.code == 200) {
                            setMessage({
                                type: 'success',
                                msg: data.msg
                            })
                            getList();
                            CloseAlert();
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
            } else {
                var response = '';
                if (typeof data == 'string') {
                    response = JSON.parse(data) ? JSON.parse(data) : {};
                } else {
                    response = data;
                }
                if (response.code == 200) {
                    setMessage({
                        type: 'success',
                        msg: response.msg
                    })
                    getList();
                    CloseAlert();
                } else {
                    setMessage({
                        type: 'warning',
                        msg: response.msg
                    })
                }
            }
        },
        error: function (error) {
            console.info(error);
        }
    })
}

// =============================================
//显示新增弹窗
$('.addNew').on('click', function () {
    $('.leaveMsg').show();
    $('.text h3 span').html('添加banner');
    $('input[type="file"]').val('');
    // $('input[type="file"]').style('display', 'block');
    $('input[type="file"]').css('display', 'block');
    $('.alertForm').find('.ddd').attr('src', '');
})


/**
 * radio回显函数
 * @param {String} inputName 指定的radio组  
 * @param {String} backValue 需要回显的值，从接口获取
 */
function radioCheck(inputName, backValue) {
    var index;
    $("input[name=" + inputName + "]").each(function (i) {
         var str = $(this).val();
         if (str == backValue) {
              $(this).attr("checked", true);
              index = i;
         }
    });
    return index;
}

// 编辑
$('.expressage').on('click', '.add', function () {
    $('.text h3 span').html('编辑banner');
    $('.leaveMsg').show();
    var id = $(this).attr('id') * 1;
    for (var i = 0; i < bannerList.length; i++) {
        if (id === bannerList[i].id) {
            $('input[name="id"]').val(bannerList[i].id)
            $('input[name="bannerName"]').val(bannerList[i].bannerName)
            $('input[name="sort"]').val(bannerList[i].sort);
            $('.alertForm').find('.ddd').attr('src', bannerList[i].picture);
            radioCheck('displayWay', bannerList[i].displayWay);
            break;
        }
    }
    console.log($('.ddd').attr('src'))
    if ($('.ddd').attr('src')) {
        $('input[type="file"]').css('display', 'none');
    }
    $('.alertForm').find('.ddd').css('display', 'block');
})


//===============滑动显示图片===========
$('.expressage').on('mouseover', '.lookPic', function () {
    $(this).next('.imgBox').show()
})

$('.expressage').on('mouseout', '.lookPic', function () {
    $(this).next('.imgBox').hide()
})

//删除信息
$('.expressage').on('click', '.del', function () {
    var that = this;
    var id = $(this).attr('id');
    seTconfirmation('提示', '确认删除吗', {
        then: function () {
            ajax({
                url: 'product-api-impl/banner/deleteBanner',
                methods: 'post',
                data: {
                    id: id,
                },
                success: function (response) {
                    if (response.code == 200) {
                        setMessage({
                            type: 'success',
                            msg: "删除成功！"
                        })
                        $('.leaveMsg').hide();
                        getList();
                    } else {
                        setMessage({
                            type: 'warning',
                            msg: "删除失败！"
                        })
                    }
                }
            })

            $(that).closest('tr').remove();
            $('.confirmation-common').css('display', 'none');
        },
        cath: function () {
            console.log('取消')
        }
    });
})

// 图片上传(封面)
$('#form .photo').on('change', 'input[type="file"]', function () {
    var that = $(this);
    var name = that.closest('.photo').hasClass('one');
    // 判断图片格式    
    if (!judgeImageType(that)) {
        return false;
    }
    var number = IEVersion();
    if (number != -1 && number < 10) {
        var imgDiv = that.parent().find('img');
        $(this).select();
        window.parent.document.body.focus();
        var realpath = document.selection.createRange().text;
        imgDiv.css("filter", "progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled='true',src=\"" + realpath + "\",sizingMethod=scale)");
        that.parent().find('img').show();
        that.hide();
        if (!name) {
            addDom(this.value, that);
        }
    } else {
        var file = this.files[0];
        var reads = new FileReader();
        reads.readAsDataURL(file);
        reads.onload = function (e) {
            that.parent().find('img').attr('src', this.result);
            that.parent().find('img').show();
            that.hide();
            if (!name) {
                addDom(this.result, that);
            }
        };
    }

})

function addDom(url, that) {
    var dom = '<div class="verification-el-input fl">';
    dom += ' <img src="' + url + '" alt="">';
    dom += '<input name="detailImageAddress" class="verification-input" type="file" accept="image/*" requir="" msg="不能为空！">';
    dom += '<div class="isShow">';
    dom += '<div class="background"></div>';
    dom += '<div class="deltree"></div>';
    dom += '<div class="deltree_text">删除</div>';
    dom += '</div>';
    dom += '</div>';
    that.closest('.verification-el-input').after(dom);
    if (that.closest('.form-item').find('.verification-el-input').length == 6) {
        $('.form-item.carousel .verification-el-input').last().css('display', 'none')
    }
}
//    图片鼠标滑过和移出
$('#form .photo').on('mouseenter', 'img', function () {
    $('#form .photo .isShow').hide();
    $(this).closest('.verification-el-input').find('.isShow').show();
})
$('#form .photo').on('mouseleave', '.isShow', function () {
    $(this).parent().find('.isShow').hide();
});
//    删除图片
$('#form .photo').on('click', '.deltree_text', function () {
    var parent = $(this).closest('div.verification-el-input');
    if (parent.closest('.form-item').hasClass('one')) {
        if ($('input[name="imageAdds"]').val()) {
            editImg(1, parent.find('img').attr('src'));
        }
        parent.find('img').attr('src', '');
        parent.find('img').hide();
        $(this).parent().hide(); //幕布隐藏
        var file = parent.find('input[type="file"]');
        file.after(file.clone().val(""));
        file.remove();
        parent.find('input[type="file"]').show();
        parent.find('input[type="file"]').attr('requir', true);
    } else {
        if ($('input[name="detailImageAdds"]').val()) {
            editImg(2, $(this).parent().parent().find('img').attr('src'));
        }
        $(this).parent().parent().remove();
        if ($('#form .photo.carousel .verification-el-input').length <= 1) {
            $('#form .photo.carousel .verification-el-input .verification-input').attr('requir', true);
        }
        if ($('.form-item.carousel .verification-el-input').length == 5) {
            $('.form-item.carousel .verification-el-input').last().css('display', 'block');
        }
    }

})


function editImg(status, url) {
    if (status == 1) {
        $('input[name="imageAdds"]').val('');
    } else {
        var text = $('input[name="detailImageAdds"]').val().split(',');
        text.splice(text.indexOf(url), 1)
        $('input[name="detailImageAdds"]').val(text.join(','))
    }
}