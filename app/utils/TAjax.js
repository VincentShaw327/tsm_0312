// import fetch from 'dva/fetch';
import fetch from 'isomorphic-fetch';
import { format } from 'upath';
import { ENOPROTOOPT, EOPNOTSUPP } from 'constants';

// let urlBase = 'http://localhost:8888';
export  let urlBase = 'http://localhost:9000';
// export  let urlBase = 'http://192.168.200.5';
// export  let urlBase = 'http://demo.mes.top-link.me';
 // urlBase;

function parseJSON(response) {
  return response.json();
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function TFetch(url, options) {
  return fetch(url, options)
    .then(checkStatus)
    .then(parseJSON)
    .then(data => ({ data }))
    .catch(err => ({ err }));
}



// res 实际上该规范定义的 Response 对象，它有如下方法

// arrayBuffer()
// blob()
// json()
// text()
// formData()
export function TPostForm(url, form_id)
{
  // 获取dat
    let dat = new FormData(document.getElementById(form_id));
    let options = {
      method: "POST",
      mode: "cors",
      headers:{
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' ,
        'Accept-Type' : 'application/json;charset=utf-8'
      },
      body: dat
    };

    return TFetch(url,options);
}


export function TPostData(url,op,obj,cb,ecb)
{
    let reqObj = {
        op : op,
        obj : JSON.stringify(obj)
    }

  fetch(urlBase + url, {
    method: 'POST',
    mode: 'cors',
    body:JSON.stringify(reqObj),
    headers:{
      'Content-Type': 'application/json;charset=utf-8' ,
      'Accept-Type' : 'application/json;charset=utf-8'
    }
})    .then(checkStatus)
.then(parseJSON)
//.then(data => ({ data }))
//.catch(err => ({ err }));

 .then((json)=>{
   cb(json);
 })
 .catch(err => {
     ecb(err);
 })
}

export function TPPostData(url, op, obj, cb, ecb) {
    let reqObj = {
        op: op,
        obj: JSON.stringify(obj)
    }

    return new Promise((resolve, reject)=>{
        fetch(urlBase + url, {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify(reqObj),
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'Accept-Type': 'application/json;charset=utf-8'
            }
        })
        .then(checkStatus)
        .then(parseJSON)
        .then((json) => {
            // cb(json);
            // resolve(cb(json));
            resolve(json);
        })
        .catch(err =>{
            // ecb(err)
            // reject(ecb(err));
            reject(err);
        });
    })
}
