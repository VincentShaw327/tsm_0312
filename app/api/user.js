import { ajax } from 'utils'

export const account = ajax.fetchJSONByPost('api/account')
export const group = ajax.fetchJSONByPost('api/group')
export const auth = ajax.fetchJSONByPost('api/auth')
