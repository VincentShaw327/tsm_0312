import {
  createAction,
} from 'redux-actions'
import {
    bom
} from 'api'
import {
  createAjaxAction,
  fakeAjaxAction,
} from 'utils'

/*BOM列表数据请求*/
export const requestBOMList = createAction('request bom list');
export const recevieBOMList = createAction('receive bom list');
export const fetchBOMList = !gconfig.isDemo_dev?createAjaxAction(
    bom.bom,
    requestBOMList,
    recevieBOMList
):fakeAjaxAction(
    bom.bom,
    requestBOMList,
    recevieBOMList
)

/*BOM item列表数据请求*/
export const requestBOMItemList = createAction('request bom item list');
export const recevieBOMList = createAction('receive bom item list');
export const fetchBOMItemList = !gconfig.isDemo_dev?createAjaxAction(
    bom.bom_item,
    requestBOMItemList,
    recevieBOMItemList
):fakeAjaxAction(
    bom.bom,
    requestBOMItemList,
    recevieBOMItemList
)
