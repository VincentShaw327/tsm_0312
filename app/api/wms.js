import { ajax } from 'utils'

export const material_model = ajax.fetchJSONByPost('api/material_model')
export const material_type = ajax.fetchJSONByPost('api/material_type')
