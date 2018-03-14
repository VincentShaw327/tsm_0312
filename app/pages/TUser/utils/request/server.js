//函数也可以当成参数传递。
/**
  * url: 请求url
  * func: 请求方法名
  * obj: 请求参数
  * cb: 成功回调
  * failcb: 失败回调
  * isAsync: 是否同异步, 默认同步
  */

function DoPost(url, func, obj, cb, failcb, isAsync = "true") {
    var req = new TRequest();
    req.exec(url, func, obj,
    // success:
    function(json) {
    cb(json); //cb是一个函数，这里调用了这个函数，然后给了参数。
    return;
    },
    // error:
    function(json) {
    failcb(json) },
    isAsync  // 是否异步
);
    return;
}

export {
    DoPost
}
