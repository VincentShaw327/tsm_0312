import fetch from 'isomorphic-fetch'
import { prefix, suffix } from '../config'

/* function buildParams(obj) {
  if (!obj) {
    return ''
  }
  const params = []
  for (const key of Object.keys(obj)) {
    const value = obj[key] === undefined ? '' : obj[key]
    params.push(`${key}=${encodeURIComponent(value)}`)
  }
  const arg = params.join('&')
  return arg
} */

// formdata的方式传输数据
/* export function fetchJSON(url, params) {
  params = {
    ...params,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      ...params.headers,
    },
  }
  url = `${prefix}${url}${suffix}`
  return fetch(url, params)
} */

export function fetchJSON(url, params, target) {
    console.log('请求的params',params)
    let {op='list',reqdata={}}=params;
    let reqObj={
        op:op,
        obj:JSON.stringify(reqdata)
    }
  const data = {
    method: 'POST',
    mode: 'cors',
    // 'Content-Type': 'application/json;charset=utf-8',
    // credentials: 'include',
    // body: JSON.stringify(params),
    body: JSON.stringify(reqObj),
    headers: {
        'Content-Type': 'application/json;charset=utf-8',
        // 'Accept-Type': 'application/json;charset=utf-8'
    }
  }
  let newUrl
  if (target) {
    newUrl = `${target}${url}${suffix}`
  } else {
    // newUrl = `${prefix}${url}${suffix}`
    newUrl = `${prefix}${url}`
  }
  return fetch(newUrl, data)
}


// eslint-disable-next-line arrow-parens
export const fetchJSONByPost = (url, target) => query =>
  // 下面是注释用formdata的方式传输数据
  /* const params = {
    method: 'POST',
    body: buildParams(query),
  }
  return fetchJSON(url, params) */
  fetchJSON(url, query, target)


/* export const fetchJSONStringByPost = url => (query) => {
  const params = {
    method: 'POST',
    body: query,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  }
  return fetchJSON(url, params)
}
 */
