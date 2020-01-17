var validate = {}
/* 手机号码*/
validate.validatPhone = function (str) {
     // var reg = /0?(13|14|15|17|18)[0-9]{9}/;
     // var reg = /^13[0-9]{9}$|14[0-9]{9}|15[0-9]{9}$|18[0-9]{9}$|17[0-9]{9}$|16[0-9]{9}$/;
     // var reg = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/;
     var reg = /^[1](([3][0-9])|([4][1,5-7, 9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/;
     return reg.test(str);
}
validate.idCard = function (str) {
     var reg = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/;
     return reg.test(str);
}
//汉字或字母
validate.validaChineseletter = function (str) {
     var reg = /^[A-Za-z\u4e00-\u9fa5]+$/;
     return reg.test(str)
}
//汉字或数字
validate.validaChineseNumber = function (str) {
     var reg = /^[0-9\u4e00-\u9fa5]+$/;
     return reg.test(str)
}
//字母和数字
validate.validaLeterNumber = function (str) {
     var reg = /^[0-9a-zA-Z]+$/;
     return reg.test(str)
}
//版本号
validate.verno = function (str) {
     // var reg = /^([0-9]{1,2}[.]){3}[0-9]{1,2}$/;
     // var reg = /^([0-9]{1,2}[.])[0-9]{1,2}[.][0-9]{1,2}$/;
     var reg = /^\d+(\.\d+)*$/;
     return reg.test(str)
}
//邮箱
validate.validaEmail = function (str) {
     var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
     return reg.test(str)
}
/* 大小写字母*/
validate.validatAlphabets = function (str) {
     var reg = /^[A-Za-z]+$/;
     return reg.test(str);
}
// url
validate.url = function (str) {
     var reg = /^((ht|f)tps?):\/\/([\w\-]+(\.[\w\-]+)*\/)*[\w\-]+(\.[\w\-]+)*\/?(\?([\w\-\.,@?^=%&:\/~\+#]*)+)?/;
     return reg.test(str);
}
//中文
validate.userName = function (str) {
     /* var re = /^[\u4e00-\u9fa5]{2,20}$/;2到20个中文字符 */
     var re = /^[A-Za-z]|[\u4e00-\u9fa5]{2,20}$/;
     if (re.test(str)) {
          return true;
     } else {
          return false;
     }
}

// 银行
validate.bank = function (str) {
     var re = /^[0-9]{16,19}$/;
     if (re.test(str)) {
          return true;
     } else {
          return false;
     }
}

// 固定电话
validate.telephone = function (str) {
     var re = /^[0-9]{5,15}$/;
     if (re.test(str)) {
          return true;
     } else {
          return false;
     }
}
// 工商注册号
validate.bussAuthNum = function (str) {
     var re = /^[0-9a-zA-Z]{15,18}$/;
     if (re.test(str)) {
          return true;
     } else {
          return false;
     }
}