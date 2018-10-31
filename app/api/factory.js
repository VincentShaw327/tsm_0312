import { ajax } from 'utils'

export const workshop = ajax.fetchJSONByPost('api/workshop')
export const workshop_type = ajax.fetchJSONByPost('api/workshop_type')
export const factory = ajax.fetchJSONByPost('api/factory')
export const factory_type = ajax.fetchJSONByPost('api/factory_type')
export const workcenter = ajax.fetchJSONByPost('api/workcenter')
