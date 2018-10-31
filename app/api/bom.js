import { ajax } from 'utils'

export const bom = ajax.fetchJSONByPost('api/bom')
export const bom_item = ajax.fetchJSONByPost('api/bom_item')
