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
        'Name|1': ['HDMI普通短端子','HDMI普通长端子','HDMI普通外壳','HDMI普通短端子N','HDMI普通长端子N','HDMI普通外壳N','HDMI带耳朵外壳','HDMI C型端子','HDMI C型外壳','HDMI加长一体端子','HDMI加长一体外壳','HDMI立式短端子','HDMI立式长端子','HDMI立式外壳','Wafe接地脚','Wafe插针','HDMI垫高端子','HDMI垫高外壳','PCMCIA上排端子','PCMCIA下排端子','USB侧立式端子','USB侧立式外壳'],
        'TypeName|1':['注塑物料','金属物料','其它物料'],
        TypeUUID:Mock.mock('@natural(1, 10)'),
        ID: function(){
            return 'mtrl_'+this.id
        },
        Image:'/upload/1527825727_9.jpg',
        Note: '-',
        Desc:'-',
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
