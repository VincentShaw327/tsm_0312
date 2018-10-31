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
        'Name|1': ['HDMI端子','HDMI C型端子','HDMI C型外壳','HDMI加长一体端子','HDMI加长一体外壳','HDMI立式短端子','HDMI立式长端子',,'PCMCIA','USB端子'],
        'TypeName|1':['注塑物料','金属物料','其它物料'],
        'TypeName|1':['自动组装车间','注塑车间','冲压车间'],
        TypeUUID:Mock.mock('@natural(1, 10)'),
        ID: function(){
            return 'mtrl_'+this.id
        },
        Note: '-',
        Desc:'-',
        SN:/sn[0-9]{8}/,
        Version: function(){
            // let sn=/sn[0-9]{8}/
            return 'ver_'+Mock.mock('@natural(0, 3)');
        },
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
