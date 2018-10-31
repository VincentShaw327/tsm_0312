import { handleActions } from 'redux-actions'
import { hasResponseError } from 'utils'
const Mock = require('mockjs');
var Random = Mock.Random;
// import moment from 'moment'
import { message } from 'antd'

/*工艺*/
const ProcessListState = {
  bomlist: [],
  currentPage: 1,
  pageCount: 0,
  pageSize: 20,
  totalCount: 0,
}
export const process = handleActions({
  'request process list'(state, action) {
    return { ...state, loading: true }
  },
  'receive process list'(state, action) {
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
                    Name:'工艺'+index,

                    Number:'process_'+index,
                    'TypeName|1':['自动组装车间','注塑车间','冲压车间'], //类别名称
                    'isQCheck|1':['是','否'],
                    Hours:Mock.mock('@natural(0, 24)'),
                    Desc:'-',
                    Modifier:Mock.mock('@cname()'),
                    Founder:Mock.mock('@cname()'),
                    CreateTime:Random.datetime(),
                    UpdateDateTime:Random.now(),
                }
            })
            list=Mock.mock(list);
            res.objectlist=list;
            res.totalcount=Mock.mock('@natural(0, 65)');
            return { list:list,total:res.totalcount, loading: false }
        }
    }
  },

}, ProcessListState)
/*工艺项*/
const ProcessItemListState = {
  bomItemList: [],
  currentPage: 1,
  pageCount: 0,
  pageSize: 20,
  totalCount: 0,
}
export const processItem = handleActions({
  'request process item list'(state, action) {
    return { ...state, loading: true }
  },
  'receive process item list'(state, action) {
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
                    Name:'工艺'+index,

                    Number:'ws_'+index,
                    'TypeName|1':['自动组装车间','注塑车间','冲压车间'], //类别名称
                    Desc:'-',
                    Modifier:Mock.mock('@cname()'),
                    Founder:Mock.mock('@cname()'),
                    CreateTime:Random.datetime(),
                    UpdateDateTime:Random.now(),
                }
            })
            list=Mock.mock(list)
            res.objectlist=list;
            res.totalcount=Mock.mock('@natural(0, 65)');
            return { workshoplist:list,total:res.totalcount, loading: false }
        }
    }
  },

}, ProcessItemListState)

/**/
const WorkcenterListState = {
  workcenterList: [],
  currentPage: 1,
  pageCount: 0,
  pageSize: 20,
  totalCount: 0,
}
export const workcenter = handleActions({
  'request workcenter list'(state, action) {
    return { ...state, loading: true }
  },
  'receive workcenter list'(state, action) {
    const { req, res } = action.payload
    let list=[];
    if (hasResponseError(res)) {
      message.error(res.msg)
      return { ...state, loading: false }
    }
    else{
        if(!gconfig.isDemo_dev){
            console.log('返回工作中心数据:',res)
            return {
                workcenterList: res.obj.objectlist,
                pageindex: res.obj.pageindex,
                totalcount: res.obj.totalcount,
                loading: false
            }
        }
        else{
            list=res.objectlist.map((item,index)=>{
                return{
                    key: index,
                    // ID: item.ID,
                    ID: 'AUTO_SMT'+Mock.mock('@natural(1, 6)'),
                    UUID: item.UUID,
                    WorkshopUUID: Mock.mock('@natural(0, 65)'),
                    Name: "设备"+index,
                    Image:Random.image('200x100', '#4A7BF7', '设备图片'),

                    'TypeName|1':['自动组装中心','注塑中心','冲压中心'], //类别名称
                    'WorkshopName|1':['自动组装车间','注塑车间','冲压车间'], //类别名称
                    Desc:'-',
                    Note:'-',
                    Modifier:Mock.mock('@cname()'),
                    Founder:Mock.mock('@cname()'),
                    CreateTime:Random.datetime(),
                    UpdateDateTime:Random.now(),
                }
            })
            list=Mock.mock(list)
            res.objectlist=list;
            res.totalcount=Mock.mock('@natural(0, 65)');
            return { workcenterList:list,total:res.totalcount, loading: false }
        }
    }
  },

}, WorkcenterListState)

const wcTypeListState = {
  wcTypeList: [],
  currentPage: 1,
  pageCount: 0,
  pageSize: 20,
  totalCount: 0,
}
export const workcenterType = handleActions({
  'request workcenter type list'(state, action) {
    return { ...state, loading: true }
  },
  'receive workcenter type list'(state, action) {
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
                    'Name|1':['注塑','冲压','组装','质检','包装'],

                    // FactoryUUID: item.FactoryUUID,
                    // TypeUUID: item.TypeUUID,
                    // Name:item.Name,
                    ID:'wc_'+index,
                    Number:'ws_'+index,
                    'TypeName|1':['自动组装车间','注塑车间','冲压车间'], //类别名称
                    Desc:'-',
                    Modifier:Mock.mock('@cname()'),
                    Founder:Mock.mock('@cname()'),
                    CreateTime:Random.datetime(),
                    UpdateDateTime:Random.now(),
                    // Note:item.Note,
                    // TypeID:item.TypeID, //类别编号
                }
            })
            list=Mock.mock(list);
            res.objectlist=list;
            res.totalcount=Mock.mock('@natural(0, 65)');
            return { wcTypeList:list,total:res.totalcount, loading: false }
        }
    }
  },

}, wcTypeListState)

const DataList = JSON.parse(sessionStorage.getItem('MockDataList'));
// console.log('DataList',DataList)
const mqttData = {
    List: DataList ? DataList.List : [],
    stateCount: DataList ? DataList.stateCount :  [
        {
            x: '报警',
            y: 0
        },
        {
            x: '离线',
            y: 0
        },
        {
            x: '运行',
            y: 0
        },
        {
            x: '待机',
            y: 0
        }
    ]
}

export const MockMqttData = handleActions({
  'mock mqtt data'(state, action) {
    const { wclist } = action.payload
    // console.log('receive mock mqtt req',state,action)
    let list=[],
        stateCountList=[],
        objState={offLine:0,Standby:0,Run:0,Warning:0};

    if(!gconfig.isDemo_dev){
        return { obj:res.obj.objectlist, loading: false }
    }
    else{
        if(state.List.length==0){
            list=wclist.map((item,index)=>{
                console.log('devItem',item)
                return{
                    key:index,
                    'Status|1':[-1,0,1,2],
                    prod_count :Mock.mock('@natural(0, 200)') , //产量
                    prod_rate: Mock.mock('@natural(0, 65)'),//产能
                    plan : Mock.mock('@natural(5000, 50000)'), //计划
                    'product|1':['RCA3.0','Pma端子','USB2.0端子','RCA6.0','HDMI端子'],
                    ...item
                }

            })

        }
        else{
            list=wclist.map((item,index)=>{
                // console.log('devItem',item)
                state.List.forEach((listItem,j)=>{
                    if(item.UUID == listItem.UUID){
                        item.key = j
                        item.Status = listItem.Status
                        item.prod_count = listItem.prod_count+Mock.mock('@natural(0, 20)') //产量
                        item.prod_rate = Mock.mock('@natural(20, 45)') //产能
                        item.plan = listItem.plan //计划
                        item.product=listItem.product

                        listItem.Status==-1?
                            objState.offLine+=1:
                            listItem.Status==0?
                            objState.Standby+=1:
                            listItem.Status==1?
                            objState.Run+=1:
                            listItem.Status==2?
                            objState.Warning+=1:''
                        return item;
                    }
                    else return item;
                })
                return item;
            })

        }
        list=Mock.mock(list)
        stateCountList=state.stateCount.map((item,index)=>{
            // console.log('item',item)
            item.x=='报警'?item.y=objState.Warning:
                item.x=='离线'?item.y=objState.offLine:
                item.x=='运行'?item.y=objState.Run:
                item.x=='待机'?item.y=objState.Standby:'';
            return item
        })
        console.log('list',list,objState,stateCountList)

        sessionStorage.setItem('MockDataList', JSON.stringify({ List:list,stateCount:stateCountList}));
        // res.objectlist=list;
        // res.totalcount=Mock.mock('@natural(0, 65)');
        return { List:list,stateCount:stateCountList, loading: false }
    }

  },

}, mqttData)
