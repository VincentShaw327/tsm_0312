import {
  createAction,
} from 'redux-actions'
import {
  crafts
} from 'api'
import {
  createAjaxAction,
  fakeAjaxAction,
} from 'utils'

/*工艺列表请求*/
export const requestProcess = createAction('request process list');
export const recevieProcess = createAction('receive process list');
export const fetchProcessList = !gconfig.isDemo_dev?createAjaxAction(
    crafts.crafts,
    requestProcess,
    recevieProcess
):fakeAjaxAction(
    crafts.crafts,
    requestProcess,
    recevieProcess
)

/*工艺_gongxu列表请求*/
export const requestProcessItem = createAction('request process item list');
export const recevieProcessItem = createAction('receive process item list');
export const fetchProcessItem = !gconfig.isDemo_dev?createAjaxAction(
    crafts.crafts_item,
    requestProcessItem,
    recevieProcessItem
):fakeAjaxAction(
    crafts.crafts_item,
    requestProcessItem,
    recevieProcessItem
)

/*工作中心列表请求*/
export const requestWorkcenterList = createAction('request workcenter list');
export const recevieWorkcenterList = createAction('receive workcenter list');
export const fetchWorkcenterList = !gconfig.isDemo_dev?createAjaxAction(
    crafts.workcenter,
    requestWorkcenterList,
    recevieWorkcenterList
):fakeAjaxAction(
    crafts.workcenter,
    requestWorkcenterList,
    recevieWorkcenterList
)

/*工作中心类别列表请求*/
export const requestWorkcenterTypeList = createAction('request workcenter type list');
export const recevieWorkcenterTypeList = createAction('receive workcenter type list');
export const fetchWorkcenterTypeList = !gconfig.isDemo_dev?createAjaxAction(
    crafts.workcenter_type,
    requestWorkcenterTypeList,
    recevieWorkcenterTypeList
):fakeAjaxAction(
    crafts.workcenter_type,
    requestWorkcenterTypeList,
    recevieWorkcenterTypeList
)


/*模拟mqtt发送消息*/
export const mockMqttData = createAction('mock mqtt data');
