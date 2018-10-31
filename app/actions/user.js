import {
  createAction,
} from 'redux-actions'
import {
  user
} from 'api'
import {
  createAjaxAction,
  fakeAjaxAction,
} from 'utils'

/*用户账户请求*/
export const requestUserAccountList = createAction('request user account list');
export const recevieUserAccountList = createAction('receive user account list');
export const fetchUserAccountList = !gconfig.isDemo_dev?createAjaxAction(
    user.account,
    requestUserAccountList,
    recevieUserAccountList
):fakeAjaxAction(
    user.account,
    requestUserAccountList,
    recevieUserAccountList
)

/*用户组请求*/
export const requestUserGroupList = createAction('request user group list');
export const recevieUserGroupList = createAction('receive user group list');
export const fetchUserGroupList = !gconfig.isDemo_dev?createAjaxAction(
    user.group,
    requestUserGroupList,
    recevieUserGroupList
):fakeAjaxAction(
    user.group,
    requestUserGroupList,
    recevieUserGroupList
)


/*用户权限请求*/
export const requestUserAuthList = createAction('request user auth list');
export const recevieUserAuthList = createAction('receive user auth list');
export const fetchUserAuthList = !gconfig.isDemo_dev?createAjaxAction(
    user.auth,
    requestUserAuthList,
    recevieUserAuthList
):fakeAjaxAction(
    user.auth,
    requestUserAuthList,
    recevieUserAuthList
)
