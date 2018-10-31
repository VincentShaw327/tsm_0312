import {
  createAction,
} from 'redux-actions'
import {
  warning
} from 'api'
import {
  createAjaxAction,
  fakeAjaxAction,
} from 'utils'

/*警告请求*/
export const requestWarningList = createAction('request warning list');
export const recevieWarningList = createAction('receive warning list');
export const fetchWarningList = !gconfig.isDemo_dev?createAjaxAction(
    warning.warning,
    requestWarningList,
    recevieWarningList
):fakeAjaxAction(
    warning.warning,
    requestWarningList,
    recevieWarningList
)

/*警告请求*/
export const requestWarningItemList = createAction('request warning item list');
export const recevieWarningItemList = createAction('receive warning item list');
export const fetchWarningItemList = !gconfig.isDemo_dev?createAjaxAction(
    warning.warning_item,
    requestWarningItemList,
    recevieWarningItemList
):fakeAjaxAction(
    warning.warning_item,
    requestWarningItemList,
    recevieWarningItemList
)
