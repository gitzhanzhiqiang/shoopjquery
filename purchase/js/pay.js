// function currency_submit(token) {
//     ajax({
//         url: 'order-api-impl/orderpay/paymentSubmitTokens',
//         methods: 'post',
//         data: {
//             token: window.decodeURI(getQueryString('token'))
//         },
//         success: function (response) {
//             var data = response.data ? response.data : {};
//             if (response.code == 200) {
//                 $('body').html(data)
//             } else {
//                 setMessage({
//                     type: 'warning',
//                     msg: response.msg
//                 })
//             }
//         },
//         error: function (response) {
//             console.log(response)
//         }
//     })
// }
// currency_submit();

var data = JSON.parse(getQueryString('data'))
// console.log(data)
$('form').attr('action', data.url)
$("input[name='merId']").val(data.merId);
$("input[name='date']").val(data.date);
$("input[name='token']").val(data.token);
$("input[name='sign']").val(data.sign);
$("input[name='method']").val(data.method);
$("input[name='version']").val(data.version);
$("input[name='mobileCode']").val(data.mobileCode);
$("input[name='mobileSerial']").val(data.mobileSerial);
$('form').submit();