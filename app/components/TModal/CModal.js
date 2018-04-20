import React, { Component } from 'react';
import { Button, Card, DatePicker,Form, Modal, message } from 'antd';
import { TPostData, urlBase } from '../../utils/TAjax';
// import CFormItem from './CreateFormItem';
import CFormItem from '../TForm/CreatFormItem/CreateFormItem';

export default class CModal extends Component {

    constructor( props ) {
        super( props )
        this.state = {
            title: props.title,
        }
    }

    componentWillMount() {

    }

    componentDidMount() {

    }

    handleCreate() {
        this.props.form.validateFields( ( errors, values ) => {
            console.log('收到表单值：', values);
            let subValue = {};
            if ( !!errors ) {
                console.log( 'Errors in form!!!' );
                message.error( '添加失败' )
                return;
            } else {

                this.props.submit( values );
                this.hideModal();
                // message.success('添加成功');
            }
        } );
    }

    handleReset() {
        this.props.form.resetFields()
        // this.props.resetIsplace();
    }
    hideModal() {
        this.props.hideForm()
        this.handleReset()
    }

    render() {
        const self = this;
        const { handleType }=this.props;
        const FormItem = this.props.FormItem;
        const updateItem = this.props.updateItem;
        // 详情见antd form 文档
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 },
        };
        // console.log('updateItem',updateItem);
        // console.log('handleType',handleType);
        return (
            <div>
            <Modal
                title="新建对象"
                visible={this.props.isShow}
                onOk={this.handleCreate.bind(this)}
                onCancel={this.hideModal.bind(this)}>
                    <Form layout="horizontal">
                        {
                            FormItem.map(function(item,index){
                                // let itemValue=Object.keys(updateItem);
                                if(updateItem&&handleType!='schedul')
                                    item.defaultValue = updateItem[item.name]||'';
                              // return self.dealConfigUType(item, defaultValue);
                              return <CFormItem key={index} getFieldDecorator={getFieldDecorator} formItemLayout={formItemLayout} item={item} recordItem={updateItem}/>
                            })
                        }
                    </Form>
            </Modal>
        </div>
        )
    }
}
CModal = Form.create()(CModal)
// export default CModal;
