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
        'Name|1': ['RCA自动机','USB专用机台','PCMCIA专用机台','RJ45自动机','GQ自动机','HDMI全自动机','Wafe全自动机','立式注塑机-无卤','注塑机-无卤','注塑机-有卤','冲压机'],
        'TypeName|1':['注塑机','冲压机','自动装配机'],
        'ID|1':['SMT-RCA','SMT-USB','SMT-PCMCIA','SMT-RJ45','SMT-GQ','SMT-HDMI','SMT-WAFE','INJECTION-01','INJECTION-02','INJECTION-03','PUNCH'],
        Image:'/upload/1527825727_9.jpg',
        Founder:Mock.mock('@name'),
        CreatDateTime:Mock.mock('@date("yyyy-MM-dd")'),
        Renewing:Mock.mock('@name'),
        UpdateDateTime:Mock.mock('@date("yyyy-MM-dd")'),
        Desc:'-'
      },
    ],
  },
  msg: '',
  errorCode: '',
  status: 1,
}
