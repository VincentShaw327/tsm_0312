import {
  createAction,
} from 'redux-actions'
import {
    Iot
} from 'api'
import {
  createAjaxAction,
  fakeAjaxAction,
} from 'utils'


/*网关设备请求*/
export const requestIotList = createAction('request iot list');
export const recevieIotList = createAction('receive iot list');
export const fetchIotList = !gconfig.isDemo_dev?createAjaxAction(
    Iot.dau,
    requestIotList,
    recevieIotList
):fakeAjaxAction(
    Iot.dau,
    requestIotList,
    recevieIotList
)
