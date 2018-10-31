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
        'Name|1': ['合格区', '不合格区', '检验区','包装区','装配区','备料区','组装区','加工区','周转区','仓库','返工区','成品待检区','待检区','来料区','废料区'],
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
