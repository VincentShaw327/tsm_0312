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
        Name: 'AUTO_SMT',
        Image:'/upload/1527825727_9.jpg',
        'TypeName|1':['自动组装车间','注塑车间','冲压车间'],
        Founder:Mock.mock('@cname'),
        CreatDateTime:Mock.mock('@date("yyyy-MM-dd")'),
        Renewing:Mock.mock('@cname'),
        UpdateDateTime:Mock.mock('@date("yyyy-MM-dd")'),
        'UUID|+1': 1,
        WorkshopUUID:Mock.mock('@natural(1, 10)'),
        Desc: '',
        Note: '',
        ProductUUID: Mock.mock('@natural(1, 10)'),
        ProductModelID: Mock.mock('@natural(1, 10)'),
        'ProductModelName|1': ['HDMI端子','RCA音视频端子','光纤端子','PCMCIA'], //产品名称
        'WorkshopName|1':['自动组装车间','注塑车间','冲压车间'],
        PlanNumber:Mock.mock('@natural(3000, 50000)'), //计划产量
        ScheduleNumber:Mock.mock('@natural(200, 1000)'),
        FinishNumber: Mock.mock('@natural(3000, 50000)'), //实际产量
        RejectNumber: Mock.mock('@natural(1, 100)'), //不合格数量
        IssuedDateTime: Mock.mock('@datetime'), //下单日期
        PlanDeliverDate: Mock.mock('@datetime'), //计划交期
        DeliverDateTime: Mock.mock('@datetime'), //实际交期
        PlanStartDateTime: Mock.mock('@datetime'), //计划开始时间
        StartDateTime: Mock.mock('@datetime'), //实际开始时间
        PlanFinishDateTime: Mock.mock('@datetime'), //计划完成时间
        FinishDateTime: Mock.mock('@datetime'), //实际完成时间
        UpdateDateTime: Mock.mock('@datetime'), //更新时间
        Status:function(){
            return Mock.mock('@natural(0, 3)');
        }
      },
    ],
  },
  msg: '',
  err: '',
  // status: 1,
}
