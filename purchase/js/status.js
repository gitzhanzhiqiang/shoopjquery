function init() {
    //渲染公共顶部
    shopHeaderTop('#header-top');
    //渲染公共头部
    shopHeader('#s-header');

    var source = getQueryString('page');
    var status = getQueryString('status');
    showInfo(source, status);
    $('#stusBtn').children().eq(0).attr('href', pathCommon)
}
init();


function showInfo(pageName, status) {
    switch (pageName) {
        case 'orderComm':
            $('#stusTxt').text('评论成功');
            $('#stusBtn').children().eq(1).text('查看评论').attr('href', pathCommon + 'buyerPersonCenter/myEvaluation.html')
            break
        case 'repaly':
            $('#stusMoney').text('实付 ¥ 100.00');
            $('#stusBtn').children().eq(1).text('查看订单').attr('href', pathCommon + 'buyerPersonCenter/myEvaluation.html')
            break
    }
    switch (status) {
        case "200":
            $('#stusImg').removeClass('error').addClass('success');
            break
    }
}