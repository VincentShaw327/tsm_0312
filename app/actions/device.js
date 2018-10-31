import {
  createAction,
} from 'redux-actions'
import {
  device
} from 'api'
import {
  createAjaxAction,
  fakeAjaxAction,
} from 'utils'

/*Device列表数据请求*/
export const requestDeviceList = createAction('request device list');
export const recevieDeviceList = createAction('receive device list');
export const fetchDeviceList = !gconfig.isDemo_dev?createAjaxAction(
    device.device,
    requestDeviceList,
    recevieDeviceList
):fakeAjaxAction(
    device.device,
    requestDeviceList,
    recevieDeviceList
)

/*Device_model列表数据请求*/
export const requestDeviceModelList = createAction('request device model list');
export const recevieDeviceModelList = createAction('receive device model list');
export const fetchDeviceModelList = !gconfig.isDemo_dev?createAjaxAction(
    device.device_model,
    requestDeviceModelList,
    recevieDeviceModelList
):fakeAjaxAction(
    device.device_model,
    requestDeviceModelList,
    recevieDeviceModelList
)

/*Device_type列表数据请求*/
export const requestDeviceTypeList = createAction('request device type list');
export const recevieDeviceTypeList = createAction('receive device type list');
export const fetchDeviceTypeList = !gconfig.isDemo_dev?createAjaxAction(
    device.device_type,
    requestDeviceTypeList,
    recevieDeviceTypeList
):fakeAjaxAction(
    device.device_type,
    requestDeviceTypeList,
    recevieDeviceTypeList
)
