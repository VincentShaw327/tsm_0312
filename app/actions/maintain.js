import {
  createAction,
} from 'redux-actions'
import {
    maintain
} from 'api'
import {
  createAjaxAction,
  fakeAjaxAction,
} from 'utils'


/*网关设备请求*/
export const requestMaintain = createAction('request maintain list');
export const recevieMaintain = createAction('receive maintain list');
export const fetchMaintain = !gconfig.isDemo_dev?createAjaxAction(
    maintain.maintain,
    requestMaintain,
    recevieMaintain
):fakeAjaxAction(
    maintain.maintain,
    requestMaintain,
    recevieMaintain
)
