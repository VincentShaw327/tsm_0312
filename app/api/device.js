import { ajax } from 'utils'

export const device = ajax.fetchJSONByPost('api/device')
export const device_model = ajax.fetchJSONByPost('api/device_model')
export const device_type = ajax.fetchJSONByPost('api/device_type')
