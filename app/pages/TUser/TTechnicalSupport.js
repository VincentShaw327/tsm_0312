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
import PageHeaderLayout from '../../base/PageHeaderLayout';

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

        const bcList = [{
              title:"首页",
              href: '/',
              }, {
              title: '生产资料',
              href: '/',
              }, {
              title: '物料类别',
          }];
        return(
            <PageHeaderLayout title="物料类别" wrapperClassName="pageContent" BreadcrumbList={bcList}>
                <div className="cardContent">
                    <Form>
                        <FormItem
                            {...formItemLayout}
                            label="版权"
                            >
                            广东拓斯达科技股份有限公司/深圳市拓联智能信息技术有限公司
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="邮箱"
                            >
                            sales@top-link.me
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="固定电话"
                            >
                            (+86)0755-27217974
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="地址"
                            >
                            <div>
                                深圳市宝安区西乡街道宝源路1053号资信达大厦502室
                            </div>
                            <img src={"../../images/20170512173616_54939.png"} />
                        </FormItem>
                    </Form>
                </div>
            </PageHeaderLayout>

        )
    }
}
