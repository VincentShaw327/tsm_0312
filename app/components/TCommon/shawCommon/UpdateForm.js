import React from 'react';
import { Form, Modal, message } from 'antd';

import CFormItem from './CreateFormItem';

let UForm = React.createClass({
    getInitialState: function() {
        return {

        }
    },

    render: function() {
        const self = this;
        const UType = this.props.UType;
        const updateItem = this.props.updateItem;
        // 详情见antd form 文档
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 },
        };

        return  UType ?
                <div className="f-update">
                    <Modal title="更新对象" visible={this.props.isShow} onOk={this.handleUpdate} onCancel={this.hideModal}>
                        <Form layout="horizontal">
                            {
                                UType.map(function(item){
                                  // console.log('updateItem[item.name]========', updateItem);
                                  if(item.type!="multipleSelect")
                                  item.defaultValue = updateItem[item.name]||'';
                                  //return self.dealConfigUType(item, defaultValue);
                                  return <CFormItem key={item.name} getFieldDecorator={getFieldDecorator} formItemLayout={formItemLayout} item={item} recordItem={updateItem}/>
                                })
                            }
                        </Form>
                    </Modal>
                </div>:
                <div></div>
    },

    handleUpdate: function(){
        this.props.form.validateFields((errors, values) => {
            // console.log('收到表单值：', values);
            let subValue={};
            if (!!errors) {
                console.log('Errors in form!!!');
                message.error('添加失败')
                return;
            }else{
                if(values.hasOwnProperty('range-pick')){
                    subValue={
                        ...values,
                        'range-picker': [values['range-pick'][0].format('YYYY-MM-DD'), values['range-pick'][1].format('YYYY-MM-DD')],
                    }
                }else if(values.hasOwnProperty('date-picker')){
                    subValue={
                        ...values,
                        'date-picker': values['date-picker'].format('YYYY-MM-DD'),
                    }
                }else{
                    subValue={
                        ...values,
                    }
                }
                this.props.submit(subValue);
                this.hideModal();
                // message.success('添加成功');
            }
        });
    },
    handlePlace: function(){
        this.props.placeSubmit(this.props.form.getFieldsValue())
        // console.log("place的提交值是",this.props.form.getFieldsValue());
    },

    handleReset: function() {
        this.props.form.resetFields()
        // this.props.resetIsplace();
    },
    hideModal: function() {
        this.props.hideForm()
        this.handleReset()
    }
})

UForm = Form.create()(UForm)

export default UForm
