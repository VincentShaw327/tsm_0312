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
        'Name|1': ['自动组装设备', '注塑机', '冲压机'],
        'TypeName|1':['自动组装车间','注塑车间','冲压车间'],
        'ModelName|1': ['RCA自动机','USB专用机台','PCMCIA专用机台','RJ45自动机','GQ自动机','HDMI全自动机','Wafe全自动机','立式注塑机-无卤','注塑机-无卤','注塑机-有卤','冲压机'],
        'TypeName|1':['注塑机','冲压机','自动装配机'],
        ID: 'AUTO_SMT',
        Image:'/upload/1527825727_9.jpg',
        Founder:Mock.mock('@name'),
        CreatDateTime:Mock.mock('@date("yyyy-MM-dd")'),
        Renewing:Mock.mock('@name'),
        UpdateDateTime:Mock.mock('@date("yyyy-MM-dd")'),
        SN:/sn[0-9]{8}/,
        Label:/[a-z][0-9]{8}/,
        Desc:'-'
      },
    ],
  },
  msg: '',
  errorCode: '',
  status: 1,
}
