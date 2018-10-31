import { ajax } from 'utils'

export const workshop = ajax.fetchJSONByPost('api/workshop')
export const workcenter = ajax.fetchJSONByPost('api/workcenter')
