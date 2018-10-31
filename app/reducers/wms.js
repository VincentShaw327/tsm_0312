import { handleActions } from 'redux-actions'
import { hasResponseError } from 'utils'
const Mock = require('mockjs');
var Random = Mock.Random;
// import moment from 'moment'
import { message } from 'antd'

const materialModelState = {
  mtrlModelList: [],
  currentPage: 1,
  pageCount: 0,
  pageSize: 20,
  totalCount: 0,
}
export const mtrlModel = handleActions({
  'request material model list'(state, action) {
    return { ...state, loading: true }
  },
  'receive material model list'(state, action) {
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
                    Name:Mock.mock('@cname')
                }
            })
            res.objectlist=list;
            res.totalcount=Mock.mock('@natural(0, 65)');
            return { mtrlModelList:list,total:res.totalcount, loading: false }
        }
    }
  },


}, materialModelState)


const materialTypeState = {
  mtrlTypeList: [],
  currentPage: 1,
  pageCount: 0,
  pageSize: 20,
  totalCount: 0,
}
export const mtrlType = handleActions({
  'request material type list'(state, action) {
    return { ...state, loading: true }
  },
  'receive material type list'(state, action) {
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
                    'Name|1':['基础物料','半成品物料'],

                    // FactoryUUID: item.FactoryUUID,
                    // TypeUUID: item.TypeUUID,
                    // Name:item.Name,
                    ID:'mtrl_'+index,
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
            return { mtrlTypeList:list,total:res.totalcount, loading: false }
        }
    }
  },


}, materialTypeState)
