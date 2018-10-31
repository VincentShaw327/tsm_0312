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
        'Name|1': ['自动组装设备', '注塑机', '冲压机'],
        'TypeName|1':['自动组装车间','注塑车间','冲压车间'],
        'UUID|+1': 1,
        TypeUUID: Mock.mock('@natural(1, 10)'),
        WorkshopUUID:Mock.mock('@natural(1, 10)'),
        'WorkshopName|1':['自动组装车间','注塑车间','冲压车间'],
        Note: '',
        Desc:'',
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
