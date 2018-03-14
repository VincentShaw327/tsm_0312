import React from 'react';
import { Menu, Icon, Breadcrumb } from 'antd';
import {_topfClone} from '../../topBCommon/utils/dataHandle/arrayHandle';
import "./TopBreadcrumb.less"

const TopBreadcrumb = (props) => {
  return (
    <div className="breadcrumb">
          <Breadcrumb style={{fontSize: 14}}>
          {
              props.title.map(function(item, i){

                return (
                  <Breadcrumb.Item key={i}>
                       { item.icon ? <Icon type={ item.icon } /> : '' } { item.text }
                  </Breadcrumb.Item>
                )
              })
          }
          </Breadcrumb>
          <h2 style={{ marginTop: '1.26%' }}>{ props.title[props.title.length - 1].text }</h2>
    </div>
  )
}

export default TopBreadcrumb
