import {
  createAction,
} from 'redux-actions'
import {
    mold
} from 'api'
import {
  createAjaxAction,
  fakeAjaxAction,
} from 'utils'


/*获取模具列表*/
export const requestMoldList = createAction('request mold list');
export const recevieMoldList = createAction('receive mold list');
export const fetchMoldList = !gconfig.isDemo_dev?createAjaxAction(
    mold.mold,
    requestMoldList,
    recevieMoldList
):fakeAjaxAction(
    mold.mold,
    requestMoldList,
    recevieMoldList
)

/*获取模具列表*/
export const requestMoldModel = createAction('request mold model list');
export const recevieMoldModel = createAction('receive mold model list');
export const fetchMoldModel = !gconfig.isDemo_dev?createAjaxAction(
    mold.mold_model,
    requestMoldModel,
    recevieMoldModel
):fakeAjaxAction(
    mold.mold_model,
    requestMoldModel,
    recevieMoldModel
)
