import { handleActions } from 'redux-actions'
import { hasResponseError } from 'utils'
const Mock = require('mockjs');
var Random = Mock.Random;
// import moment from 'moment'
import { message } from 'antd'

const DeviceListState = {
  list: [],
  currentPage: 1,
  pageCount: 0,
  pageSize: 20,
  totalCount: 0,
}
export const device = handleActions({
  'request device list'(state, action) {
    return { ...state, loading: true }
  },
  'receive device list'(state, action) {
    const { req, res } = action.payload
    console.log('receive device list',action)
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
                    strDeviceName:'设备_'+index,

                    DeviceID:'device_'+index,
                    SN:Mock.mock('@string(5)'),
                    Label:Mock.mock('@string(5)'),
                    'DeviceType|1':['注塑类','冲压类','自动组装类'],
                    DeviceModel:'device_model'+index,
                    'TypeName|1':['注塑类','冲压类','自动组装类'], //类别名称
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

}, DeviceListState)

const DeviceModelListState = {
  list: [],
  currentPage: 1,
  pageCount: 0,
  pageSize: 20,
  totalCount: 0,
}
export const deviceModel = handleActions({
  'request device model list'(state, action) {
    return { ...state, loading: true }
  },
  'receive device model list'(state, action) {
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
                    Name:'型号_'+index,

                    Number:'model_'+index,
                    'TypeName|1':['注塑类','冲压类','自动组装类'], //类别名称
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
            // res.totalcount=Mock.mock('@natural(0, 65)');
            res.totalcount=20;
            return { list:list,total:res.totalcount, loading: false }
        }
    }
  },


}, DeviceModelListState)


const DeviceTypeListState = {
  deviceTypeList: [],
  currentPage: 1,
  pageCount: 0,
  pageSize: 20,
  totalCount: 0,
}
export const deviceType = handleActions({
  'request device type list'(state, action) {
      console.log('yuyu8979 gg')
    return { ...state, loading: true }
  },
  'receive device type list'(state, action) {
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
                    'Name|1':['注塑设备','冲压设备','自动组装设备'],

                    // FactoryUUID: item.FactoryUUID,
                    // TypeUUID: item.TypeUUID,
                    // Name:item.Name,
                    ID:'devType_'+index,
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
            return { deviceTypeList:list,total:res.totalcount, loading: false }
        }
    }
  },


}, DeviceTypeListState)
