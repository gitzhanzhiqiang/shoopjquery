(function ($) {
     var zp = {
          init: function (obj, pageinit) {
               return (function () {
                    zp.addhtml(obj, pageinit);
                    zp.bindEvent(obj, pageinit);
               }());
          },
          addhtml: function (obj, pageinit) {
               return (function () {
                    obj.empty();
                    /*上一页*/
                    if (pageinit.current > 1) {
                         obj.append('<a href="javascript:;" class="prebtn"><</a>');
                    } else {
                         obj.remove('.prevPage');
                         obj.append('<span class="disabled"><</span>');
                    }
                    /*中间页*/
                    if (pageinit.current > 5 && pageinit.pageNum > 5) {
                         obj.append('<a href="javascript:;" class="zxfPagenum">' + 1 + '</a>');
                         obj.append('<a href="javascript:;" class="zxfPagenum">' + 2 + '</a>');
                         obj.append('<span class="point">•••</span>');
                    }
                    if (pageinit.current > 5 && pageinit.current <= pageinit.pageNum - 5) {
                         var start = pageinit.current - 2,
                              end = pageinit.current + 2;
                    } else if (pageinit.current > 5 && pageinit.current > pageinit.pageNum - 5) {
                         var start = pageinit.pageNum - 5,
                              end = pageinit.pageNum;
                    } else {
                         var start = 1,
                              end = 9;
                    }
                    for (; start <= end; start++) {
                         if (start <= pageinit.pageNum && start >= 1) {
                              if (start == pageinit.current) {
                                   obj.append('<span class="current">' + start + '</span>');
                              } else if (start == pageinit.current + 1) {
                                   obj.append('<a href="javascript:;" class="zxfPagenum nextpage">' + start + '</a>');
                              } else {
                                   obj.append('<a href="javascript:;" class="zxfPagenum">' + start + '</a>');
                              }
                         }
                    }
                    if (end < pageinit.pageNum) {
                         obj.append('<span class="point">•••</span>');
                    }
                    /*下一页*/
                    if (pageinit.current >= pageinit.pageNum) {
                         obj.remove('.nextbtn');
                         obj.append('<span class="disabled">></span>');
                    } else {
                         obj.append('<a href="javascript:;" class="nextbtn">></a>');
                    }
                    /*尾部*/
                    obj.append('<span class="page">' + '共' + '<b>' + pageinit.pageNum + '</b>' + '页' + '</span>');
                    obj.append('<span class="jump">跳转至</span>' + '<input type="text" class="zxfinput" value="' + pageinit.current + '"/>' + '<span class="page">页</span>');
                    obj.append('<span class="zxfokbtn">' + '确定' + '</span>');
               }());
          },
          bindEvent: function (obj, pageinit) {
               obj.off("click");
               return (function () {
                    obj.on("click", "a.prebtn", function () {
                         var cur = parseInt(obj.children("span.current").text());
                         var current = $.extend(pageinit, {
                              "current": cur - 1
                         });
                         zp.addhtml(obj, current);
                         if (typeof (pageinit.backfun) == "function") {
                              pageinit.backfun(current);
                         }
                    });
                    obj.on("click", "a.zxfPagenum", function () {
                         var cur = parseInt($(this).text());
                         var current = $.extend(pageinit, {
                              "current": cur
                         });
                         zp.addhtml(obj, current);
                         if (typeof (pageinit.backfun) == "function") {
                              pageinit.backfun(current);
                         }
                    });
                    obj.on("click", "a.nextbtn", function () {
                         var cur = parseInt(obj.children("span.current").text());
                         var current = $.extend(pageinit, {
                              "current": cur + 1
                         });
                         zp.addhtml(obj, current);
                         if (typeof (pageinit.backfun) == "function") {
                              pageinit.backfun(current);
                         }
                    });
                    obj.on("click", "span.zxfokbtn", function () {
                         var cur = parseInt($("input.zxfinput").val());
                         // 超出分页 默认最大分页值
                         if (pageinit.pageNum < cur) {
                              cur = pageinit.pageNum;
                         }
                         // 当小于1 或部位数字时， 默认第一页
                         if (cur < 1 || isNaN(cur)) {
                              cur = 1;
                         }
                         var current = $.extend(pageinit, {
                              "current": cur
                         });
                         zp.addhtml(obj, {
                              "current": cur,
                              "pageNum": pageinit.pageNum
                         });
                         if (typeof (pageinit.backfun) == "function") {
                              pageinit.backfun(current);
                         }
                    });
               }());
          }
     }
     $.fn.createPage = function (options) {
          var pageinit = $.extend({
               pageNum: 15,
               current: 1,
               backfun: function () {}
          }, options);
          zp.init(this, pageinit);
     }
}(jQuery));