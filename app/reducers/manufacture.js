import { handleActions } from 'redux-actions'
import { hasResponseError } from 'utils'
import moment from 'moment';
const Mock = require('mockjs');
var Random = Mock.Random;
// import moment from 'moment'
import { message } from 'antd'

const BOMListState = {
  productOrderList: [],
  currentPage: 1,
  pageCount: 0,
  pageSize: 20,
  totalCount: 0,
  // loading:true
}
export const productOrder = handleActions({
  'request order list'(state, action) {
    return { ...state, loading: true }
  },
  'receive order list'(state, action) {
    const { req, res } = action.payload
    let list=[];
    if (hasResponseError(res)) {
      message.error(res.msg)
      return { ...state, loading: false }
    }
    else{
        if(!gconfig.isDemo_dev){
            return { obj:res.obj.objectlist, loading: false }
        }
        else{
            list=res.objectlist.map((item,index)=>{
                return{
                    UUID:item.UUID,
                    key:index,
                    // WorkshopUUID:item.WorkshopUUID,
                    ID: 'SC'+Random.now('yyyyMMdd')+'_'+Random.integer(5),
                    // Name: item.Name,
                    // Desc: item.Desc,
                    // Note: item.Note,
                    // ProductUUID: item.ProductUUID,
                    // ProductModelID: item.ProductModelID,
                    'ProductModelName|1': ['HDMI端子','RCA音视频端子','光纤端子','PCMCIA'], //产品名称
                    'WorkshopName|1':['自动车间一','自动车间二','注塑车间','冲压车间'],
                    PlanNumber: Mock.mock('@natural(5000, 50000)'), //计划产量
                    ScheduleNumber:Mock.mock('@natural(5000, 50000)'),
                    FinishNumber: item.FinishNumber, //实际产量
                    RejectNumber: item.RejectNumber, //不合格数量
                    IssuedDateTime: moment().
                                        subtract(Mock.mock('@natural(0, 15)'), 'days').
                                            format('YYYY-MM-DD HH:mm'), //下单日期
                    PlanDeliverDate: moment().
                                        add(Mock.mock('@natural(0, 15)'), 'days').
                                            format('YYYY-MM-DD HH:mm'),//计划交期
                    DeliverDateTime: item.DeliverDateTime, //实际交期
                    PlanStartDateTime: item.PlanStartDateTime, //计划开始时间
                    StartDateTime: item.StartDateTime, //实际开始时间
                    // PlanFinishDateTime: item.PlanFinishDateTime.slice(0,10), //计划完成时间
                    FinishDateTime: item.FinishDateTime, //实际完成时间
                    UpdateDateTime: item.UpdateDateTime, //更新时间
                    Status: Mock.mock('@natural(0, 3)')
                }
            })
            list=Mock.mock(list)
            res.objectlist=list;
            res.totalcount=Mock.mock('@natural(0, 65)');
            return { productOrderList:list,total:res.totalcount, loading: false }
        }
    }
  },


}, BOMListState)


const DataList = JSON.parse(sessionStorage.getItem('MockTaskList'));
const productTaskState = {
  productTaskList:DataList?DataList.productTaskList:[],
  currentPage: 1,
  pageCount: 0,
  pageSize: 20,
  totalCount: 0,
}
export const productTask = handleActions({
  'request task list'(state, action) {
    return { ...state, loading: true }
  },
  'receive task list'(state, action) {
    const { req, res } = action.payload
    console.log('receive task list',state,action)
    let list=[];
    if (hasResponseError(res)) {
      message.error(res.msg)
      return { ...state, loading: false }
    }
    else{
        if(!gconfig.isDemo_dev){
            return { obj:res.obj.objectlist, loading: false }
        }
        else{

            if(state.productTaskList.length==0){
                list=res.objectlist.map((item,index)=>{
                    return{
                        UUID:item.UUID,
                        key:index,
                        // BomUUID: item.BomUUID,
                        lotJobID: `T${Random.now('yyyyMMdd')}_${Mock.mock('@natural(20000, 50000)')}`,
                        // FinishDateTime: item.FinishDateTime,
                        FinishNumber: 2000,
                        // MoldModelUUID: item.MoldModelUUID,
                        PlanStartDateTime: moment().
                                                subtract(Mock.mock('@natural(0, 15)'), 'days').
                                                format('YYYY-MM-DD HH:mm'),
                        PlanFinishDateTime: moment().
                                                add(Mock.mock('@natural(0, 15)'), 'days').
                                                format('YYYY-MM-DD HH:mm'),
                        PlanNumber: Mock.mock('@natural(20000, 50000)'),
                        // ProductModelID: item.ProductModelID,
                        'ProductModelName|1': ['HDMI端子','RCA音视频端子','光纤端子','PCMCIA'], //产品名称
                        ProductModelSN: item.ProductModelSN,
                        // ProductModelUUID: item.ProductModelUUID,
                        RejectNumber: 0,
                        rej_progress:0,
                        pro_progress:0,//生产进度
                        StartDateTime: moment().format('YYYY-MM-DD HH:mm'),
                        Status: Mock.mock('@natural(0, 4)'),
                        UpdateDateTime: item.UpdateDateTime,
                        restTime:function(){
                                    // this.PlanFinishDateTime-this.StartDateTime
                                    let a=moment(item.PlanFinishDateTime),
                                        b=this.StartDateTime,
                                        c=a.diff(b);
                                  return  moment(c).format('YYYY-MM-DD HH:mm');
                                },
                        WorkstationID: item.WorkstationID,
                        WorkstationName: '设备'+Mock.mock('@natural(0, 20)'),
                        WorkstationUUID: item.WorkstationUUID
                    }
                })
            }
            else{
                list=state.productTaskList.map((item,index)=>{
                    return{
                        ...item,
                        FinishNumber: item.FinishNumber+Mock.mock('@natural(0, 50)'),
                        RejectNumber: item.RejectNumber+Mock.mock('@natural(0, 1)'),
                        rej_progress:(item.RejectNumber/item.FinishNumber).toFixed(2),
                        pro_progress:(item.FinishNumber/item.PlanNumber).toFixed(2),
                        restTime:function(){
                                    // this.PlanFinishDateTime-this.StartDateTime
                                    let a=moment(item.PlanFinishDateTime),
                                        b=moment(),
                                        c=a.diff(b);
                                return  moment.duration(c,'ms').as('hours').toFixed(0);
                                  // return moment(c).format('HH:mm:ss')
                                  // return  c;
                                },
                    }
                })
            }
            list=Mock.mock(list);
            res.objectlist=list;
            res.totalcount=Mock.mock('@natural(0, 65)');
            sessionStorage.setItem('MockTaskList', JSON.stringify({ productTaskList:list}));
            return { productTaskList:list,total:res.totalcount, loading: false }
        }
    }
  },

}, productTaskState)
