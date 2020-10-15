import {get} from './ajax'

// 获取接口数据
export function getData (){
  return get('/_doc_api/data')
}