const Mock = require('mockjs');
var Random = Mock.Random;
module.exports = {
  obj: {
    totalcount: 100,
    currentPage: 1,
    pageSize: 10,
    'objectlist|10': [
      {
        'id|+1': 1,
        'ID|1': ['208192347','201802335','208192237','208197447'],
        'UUID|+1': 1,
        Name:function(){
            return Mock.mock('@cname()')
        },
        Email: Mock.mock('@email()'),
        Phone:/^0755-[0-9]{8}/,
        Image:'',
        LoginName:/[a-z]{5}/,
        Mobile: /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))[0-9]{8}/,
        Desc: '-',
        Note: '-',
        CreatDateTime:Mock.mock('@date("yyyy-MM-dd")'),
        PlanNumber:Mock.mock('@natural(3000, 50000)'), //计划产量
        ActiveDateTime: Mock.mock('@datetime'), //更新时间
        InactiveDateTime: Mock.mock('@datetime'), //更新时间
        UpdateDateTime: Mock.mock('@datetime'), //更新时间
        Status: Mock.mock('@natural(0, 3)')
      },
    ],
  },
  msg: '',
  err: '',
  // status: 1,
}
