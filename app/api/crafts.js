import { ajax } from 'utils'

export const crafts = ajax.fetchJSONByPost('api/process')
export const crafts_item = ajax.fetchJSONByPost('api/process_item')
export const workcenter = ajax.fetchJSONByPost('/api/TProcess/workcenter')
export const workcenter_type = ajax.fetchJSONByPost('api/workcenter_types')
