import axios from 'axios'
import qs from 'qs'
import jsonp from 'jsonp'
import lodash from 'lodash'
import pathToRegexp from 'path-to-regexp'
import {Toast} from 'antd-mobile'
import config from './config'
import {getHashRoute} from './index'
const {YQL, CORS, baseURL} = config
axios.defaults.baseURL = baseURL
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
const fetch = (options) => {
  let {
    method = 'get',
    data,
    fetchType,
    url,
  } = options
  const cloneData = lodash.cloneDeep(data)

  try {
    let domin = ''
    if (url.match(/[a-zA-z]+:\/\/[^/]*/)) {
      domin = url.match(/[a-zA-z]+:\/\/[^/]*/)[0]
      url = url.slice(domin.length)
    }
    const match = pathToRegexp.parse(url)
    //console.info(match)
    url = pathToRegexp.compile(url)(data)
    for (let item of match) {
      if (item instanceof Object && item.name in cloneData) {
        delete cloneData[item.name]
      }
    }
    url = domin + url
  } catch (e) {
    Toast.fail(e.message)
  }

  if (fetchType === 'JSONP') {
    return new Promise((resolve, reject) => {
      jsonp(url, {
        param: `${qs.stringify(data)}&callback`,
        name: `jsonp_${new Date().getTime()}`,
        timeout: 4000,
      }, (error, result) => {
        if (error) {
          reject(error)
        }
        resolve({statusText: 'OK', status: 200, data: result})
      })
    })
  } else if (fetchType === 'YQL') {
    url = `http://query.yahooapis.com/v1/public/yql?q=select * from json where url='${options.url}?${encodeURIComponent(qs.stringify(options.data))}'&format=json`
    data = null
  }
  let formData = new FormData()
  if (method.toLowerCase() === 'upload') {
    for (let name in cloneData) {
      formData.append(name, cloneData[name])
    }
  }
  // console.info('url---请求数据',url,cloneData)
  switch (method.toLowerCase()) {
    case 'get':
      return axios.get(url, {
        params: cloneData,
      })
    case 'post':
      const postData = qs.stringify(cloneData,{arrayFormat: 'repeat',encode: false})
      // console.info('提交的数据',postData)
      return axios.post(url, postData)
    case 'upload':
      return axios.post(url, formData, {
        headers: {'Content-Type': 'multipart/form-data;charset=UTF-8'},
      })
    case 'delete':
      return axios.delete(url, {
        data: cloneData,
      })
    case 'put':
      return axios.put(url, cloneData)
    case 'patch':
      return axios.patch(url, cloneData)
    default:
      return axios(options)
  }
}

export default function request(options) {
  if (options.url && options.url.indexOf('//') > -1) {
    const origin = `${options.url.split('//')[0]}//${options.url.split('//')[1].split('/')[0]}`
    if (window.location.origin !== origin) {
      if (CORS && CORS.indexOf(origin) > -1) {
        options.fetchType = 'CORS'
      } else if (YQL && YQL.indexOf(origin) > -1) {
        options.fetchType = 'YQL'
      } else {
        options.fetchType = 'JSONP'
      }
    }
  }

  return fetch(options).then((response) => {
    const {statusText, status} = response
    let data = options.fetchType === 'YQL' ? response.data.query.results.json : response.data
    // console.info('返回成功数据',response)
    //判断是否有权限
    if(data.result&&data.result.permission!== undefined &&!data.result.permission){
      window.location = `${location.origin+location.pathname}#/refused`;
      return {
        success:false,
        message:'无此权限',
        status,
        ...data
      }
    }
    return {
      success: true,
      message: statusText,
      status,
      ...data,
    }
  }).catch((error) => {
    const {response} = error
    // console.info('返回失败数据',response)
    let msg
    let status
    let otherData = {}
    if (response) {
      const {data, statusText} = response
      otherData = data
      status = response.status
      msg = data.msg || statusText
      if(status===401){ //登录过期
        localStorage.setItem('curUser','')
        let from = getHashRoute()||'/loan'
        if (from.indexOf('/login')<0) {
          window.location = `${location.origin+location.pathname}#/login?from=${from}`
        }
      }
    } else {
      status = 600
      msg = 'Network Error'
    }
    Toast.fail(msg)
    return {success: false, status, message: msg, ...otherData}
  })
}
