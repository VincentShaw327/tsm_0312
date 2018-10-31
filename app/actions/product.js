import {
  createAction,
} from 'redux-actions'
import {
  product
} from 'api'
import {
  createAjaxAction,
  fakeAjaxAction,
} from 'utils'

/*工艺列表请求*/
export const requestProductModel = createAction('request product model list');
export const recevieProductModel = createAction('receive product model list');
export const fetchProductModel = !gconfig.isDemo_dev?createAjaxAction(
    product.product_model,
    requestProductModel,
    recevieProductModel
):fakeAjaxAction(
    product.product_model,
    requestProductModel,
    recevieProductModel
)
