const Mock = require('mockjs');
var Random = Mock.Random;
module.exports = {
  obj: {
    totalCount: 100,
    currentPage: 1,
    pageSize: 10,
    'objectlist|10': [
      {
        'id|+1': 1,
        'Name|1': ['类型1','类型2','类型3','类型4','类型5','类型6','类型7','类型8',],
        ID: 'AUTO_SMT',
        Image:'/upload/1527825727_9.jpg',
        Founder:Mock.mock('@name'),
        CreatDateTime:Mock.mock('@date("yyyy-MM-dd")'),
        Renewing:Mock.mock('@name'),
        UpdateDateTime:Mock.mock('@date("yyyy-MM-dd")')
      },
    ],
  },
  msg: '',
  errorCode: '',
  status: 1,
}
