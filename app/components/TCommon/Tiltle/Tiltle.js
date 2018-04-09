import React from 'react';
import { Menu, Icon, Breadcrumb } from 'antd';

const Tiltle = (props) => {

  return (
    <div style={{ backgroundColor: 'white', fontSize: '18px'}}>
        {
            props.typeIcon ? <Icon type={props.typeIcon} /> : ''
        }
        <span> {props.centent} </span>
    </div>
  )
}

export default Tiltle
