/**
 *这是冲压车间监控页
 *添加日期:2018.03.07
 **/
/******引入ant或其他第三方依赖文件*******************/
import React, { Component } from 'react'
import {Card,Row,Col,Divider,Tag,List,Form} from 'antd';
const FormItem = Form.Item;
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

        const formItemLayout = {
            labelCol: {
              xs: { span: 24 },
              sm: { span: 2 },
            },
            wrapperCol: {
              xs: { span: 24 },
              sm: { span: 22 },
            },
          };

        return(
            <div>
                <Form >
                    <FormItem
                        {...formItemLayout}
                        label="版权"
                        >
                        深圳市拓联智能信息技术有限公司
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="地址"
                        >
                        深圳市宝安西乡坪洲资信达大厦502
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="邮箱"
                        >
                        213456546@gmail.com
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="电话"
                        >
                        213456546
                    </FormItem>
                </Form>
            </div>
        )
    }
}
