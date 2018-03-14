var rp = require('request-promise');

function DoPost(url, func, obj, cb, failcb, isAsync = "true") {

    var reqData = {
        op:  func,
        obj: obj
    }

    var options = {
        headers: {
            'User-Agent': 'Request-Promise'
        },
        method: 'POST',
        uri:    url,
        body:   JSON.stringify(reqData),
        json:   true
    }

    rp(options).then(function (parsedBody) {
        cb(parsedBody)
    })
    .catch(function (err) {
        failcb(err)
    });
}

export {
    DoPost
}
