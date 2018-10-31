import { handleActions } from 'redux-actions'
import { hasResponseError } from 'utils'
const Mock = require('mockjs');
var Random = Mock.Random;
// import moment from 'moment'
import { message } from 'antd'

const listResultState = {
  workshoplist: [],
  workcenterlist: [],
  currentPage: 1,
  pageCount: 0,
  pageSize: 20,
  totalCount: 0,
}

export const basic_type_data = handleActions({
  'request Workshop list'(state, action) {
    return { ...state, loading: true }
  },
  'receive workshop list'(state, action) {
    const { req, res } = action.payload
    console.log('receive Workshop list',action)
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
            return { workshoplist:list,total:res.totalcount, loading: false }
        }
    }
  },
  /*'request workcenter list'(state, action) {
    return { ...state, loading: true }
  },*/
  /*'receive workcenter list'(state, action) {
    const { req, res } = action.payload
    console.log('receive workcenter list',action)
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
            return { workcenterlist:list,total:res.totalcount, loading: false }
        }
    }
  },*/




}, listResultState)

const queryResultState = () => ({
  keyword: { value: '' },
  division: { value: '' },
  institutions: { value: '' },
  houseStatus: { value: '' },
  addressType: { value: '' },
})

export const houseCheckSearchQuery = handleActions({
  'update houseCheck search query'(state, action) {
    return { ...state, ...action.payload }
  },
  'reset houseCheck search query'(state, action) {
    return { ...queryResultState() }
  },
}, queryResultState())
