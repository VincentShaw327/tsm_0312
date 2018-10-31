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
        'Name|1': ['自动车间一','自动车间一','注塑车间','冲压车间'],
        ID: 'AUTO_SMT',
        Image:'/upload/1527825727_9.jpg',
        'TypeName|1':['自动组装车间','注塑车间','冲压车间'],
        Founder:Mock.mock('@cname'),
        CreatDateTime:Mock.mock('@date("yyyy-MM-dd")'),
        Renewing:Mock.mock('@cname'),
        UpdateDateTime:Mock.mock('@date("yyyy-MM-dd")')
      },
    ],
  },
  msg: '',
  errorCode: '',
  status: 1,
}
