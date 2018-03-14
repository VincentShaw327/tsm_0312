function CpTime(a, b) {
    a.UpdateDateTime = a.UpdateDateTime.replace("-","/");//替换字符，变成标准格式
    b.UpdateDateTime = b.UpdateDateTime.replace("-","/");//替换字符，变成标准格式
    var lastDatetime = new Date(Date.parse(a.UpdateDateTime));
    var nextDatetime = new Date(Date.parse(b.UpdateDateTime));
    return lastDatetime - nextDatetime
}

export {CpTime}
