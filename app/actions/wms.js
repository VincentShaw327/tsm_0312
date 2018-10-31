import {
  createAction,
} from 'redux-actions'
import {
  wms
} from 'api'
import {
  createAjaxAction,
  fakeAjaxAction,
} from 'utils'

/*物料型号请求*/
export const requestMaterialModelList = createAction('request material model list');
export const recevieMaterialModelList = createAction('receive material model list');
export const fetchMaterialModelList = !gconfig.isDemo_dev?createAjaxAction(
    wms.material_model,
    requestMaterialModelList,
    recevieMaterialModelList
):fakeAjaxAction(
    wms.material_model,
    requestMaterialModelList,
    recevieMaterialModelList
)

/*物料类别请求*/
export const requestMaterialTypeList = createAction('request material type list');
export const recevieMaterialTypeList = createAction('receive material type list');
export const fetchMaterialTypeList = !gconfig.isDemo_dev?createAjaxAction(
    wms.material_type,
    requestMaterialTypeList,
    recevieMaterialTypeList
):fakeAjaxAction(
    wms.material_type,
    requestMaterialTypeList,
    recevieMaterialTypeList
)
