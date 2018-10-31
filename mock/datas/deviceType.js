const Mock = require('mockjs');
var Random = Mock.Random;
module.exports = {
  obj: {
    totalCount: 100,
    currentPage: 1,
    pageSize: 3,
    'objectlist|3': [
      {
        'id|+1': 1,
        'Name|+1': ['自动组装设备', '注塑机', '冲压机'],
        ID:function(){
            return 'AUTO_SMT_'+this.id
        },
        Image:'/upload/1527825727_9.jpg',
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
