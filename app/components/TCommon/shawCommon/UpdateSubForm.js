import React from 'react';
import { Form, Modal, message } from 'antd';

import CFormItem from './CreateFormItem';


let UForm = React.createClass({
    getInitialState: function() {
        return {

        }
    },

    render: function() {
        // const self = this;
        // const USubType = this.props.USubType;
        // const updateItem = this.props.updateItem;
        // const PType = this.props.PType;
        // const isPlace=this.props.isPlace;

        // 详情见antd form 文档
        // const { getFieldDecorator } = this.props.form;
        const {USubType,updateItem,getFieldDecorator}=this.props;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 },
        };

        return  USubType ?
                <div className="f-update">
                    <Modal title="更新对象" visible={this.props.isShow} onOk={this.handleUpdate} onCancel={this.hideModal}>
                        <Form layout="horizontal">
                            {
                                UType.map(function(item){
                                  item.defaultValue = updateItem[item.name]||'';
                                  return <CFormItem key={item.name} getFieldDecorator={getFieldDecorator} formItemLayout={formItemLayout} item={item}/>
                                })
                            }
                        </Form>
                    </Modal>
                </div>:
                <div></div>
    },

    handleUpdate: function(){
        this.props.submit(this.props.form.getFieldsValue())
    },
    handlePlace: function(){
        this.props.placeSubmit(this.props.form.getFieldsValue())
        // console.log("place的提交值是",this.props.form.getFieldsValue());
    },

    handleReset: function() {
        this.props.form.resetFields()
        this.props.resetIsplace()
    },

    hideModal: function() {
        this.props.hideForm()
        this.handleReset()
    }
})

UForm = Form.create()(UForm)

export default UForm
