/**
 *这是冲压车间监控页
 *添加日期:2018.03.07
 **/
/******引入ant或其他第三方依赖文件*******************/
import React, { Component } from 'react'
import {Card,Row,Col,Divider,Tag,List} from 'antd';
import { TPostData } from '../../utils/TAjax';
import devicePic from '../../images/assets/AM1.jpg';


export default class TTechnicalSupport extends Component {
    constructor( props ) {
        super( props )
        //组件外的指针.
        this.state = {

        }
        this.url='/api/TUser/auth';
    }

    render(){

        return(
            <div>这是技术支持页</div>
        )
    }
}
