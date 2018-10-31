import { ajax } from 'utils'

export const production_report = ajax.fetchJSONByPost('api/production_report')
export const device_report = ajax.fetchJSONByPost('api/device_report')
