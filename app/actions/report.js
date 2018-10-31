import {
  createAction,
} from 'redux-actions'
import {
  report
} from 'api'
import {
  createAjaxAction,
  fakeAjaxAction,
} from 'utils'

/*生产报表请求*/
export const requestProductReport = createAction('request product report  list');
export const recevieProductReport = createAction('receive product report  list');
export const fetchProductReport = !gconfig.isDemo_dev?createAjaxAction(
    report.product_report,
    requestProductReport,
    recevieProductReport
):fakeAjaxAction(
    report.product_report,
    requestProductReport,
    recevieProductReport
)


/*设备报表*/
export const requestDeviceReport = createAction('request device report  list');
export const recevieDeviceReport = createAction('receive device report  list');
export const fetchDeviceReport = !gconfig.isDemo_dev?createAjaxAction(
    report.device_report,
    requestDeviceReport,
    recevieDeviceReport
):fakeAjaxAction(
    report.device_report,
    requestDeviceReport,
    recevieDeviceReport
)
