import { handleActions } from 'redux-actions'
import { hasResponseError } from 'utils'
const Mock = require('mockjs');
var Random = Mock.Random;
// import moment from 'moment'
import { message } from 'antd'

const WorkshopListState = {
  workshoplist: [],
  currentPage: 1,
  pageCount: 0,
  pageSize: 20,
  totalCount: 0,
}
export const workshop = handleActions({
  'request workshop list'(state, action) {
    return { ...state, loading: true }
  },
  'receive workshop list'(state, action) {
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
                    index:index,
                    key:index,
                    Name:'车间'+index,

                    // FactoryUUID: item.FactoryUUID,
                    // TypeUUID: item.TypeUUID,
                    // Name:item.Name,
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
            return { workshoplist:list,total:res.totalcount, loading: false }
        }
    }
  },

}, WorkshopListState)

const wsTypeListState = {
  workshopTypeList: [],
  currentPage: 1,
  pageCount: 0,
  pageSize: 20,
  totalCount: 0,
}
export const workshopType = handleActions({
  'request workshop type list'(state, action) {
    return { ...state, loading: true }
  },
  'receive workshop type list'(state, action) {
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
                    'Name|1':['自动组装车间','注塑车间','冲压车间'],

                    // FactoryUUID: item.FactoryUUID,
                    // TypeUUID: item.TypeUUID,
                    // Name:item.Name,
                    ID:'wsType_'+index,
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
            return { workshopTypeList:list,total:res.totalcount, loading: false }
        }
    }
  },


}, wsTypeListState)

const factoryTypeState = {
  factoryTypeList: [],
  currentPage: 1,
  pageCount: 0,
  pageSize: 20,
  totalCount: 0,
}
export const factoryType = handleActions({
  'request factory type list'(state, action) {
    return { ...state, loading: true }
  },
  'receive factory type list'(state, action) {
    const { req, res } = action.payload
    console.log('receive factoryType list',action)
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
                    'Name|1':['自动组装车间','注塑车间','冲压车间'],

                    Number:'ws_'+index,
                    'TypeName|1':['自动组装车间','注塑车间','冲压车间'], //类别名称
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
            return { factoryTypeList:list,total:res.totalcount, loading: false }
        }
    }
  },


}, factoryTypeState)
