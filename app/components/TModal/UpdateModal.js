import React, { Component } from 'react';
import { Button, Card,Form, Modal, message } from 'antd';
// import CFormItem from './CreateFormItem';
import CFormItem from '../TForm/CreatFormItem/CreateFormItem';

export default class UpdateModal extends Component {

    constructor( props ) {
        super( props )
        this.state = {
            title: props.title,
            showModal:props.showModal||false
        }
    }

    componentWillMount() {}

    componentDidMount() {}

    resetItem=(str)=>{
        // this.setState({showModal:!this.state.showModal});
        // if(str&&str=='cancel') this.props.form.resetFields();
        this.props.form.resetFields();
        this.props.hideModal();
    }

    handleUpdate=()=> {
        this.props.form.validateFields( ( errors, values ) => {
            // console.log('收到表单值：', values);
            let subValue = {};
            if ( !!errors ) {
                console.log( 'Errors in form!!!' );
                message.error( '添加失败' );
                return;
            } else {
                this.props.submit( values );
                this.props.hideModal();
                this.props.form.resetFields();
                // this.toggleShow('cancel');
            }
        } );
    }

    render() {
        const self = this;
        const {
            handleType,
            FormItem,
            updateItem,
            form:{getFieldDecorator},
            title="更新对象"
        }=this.props;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 },
        };
        return (
            <div>
            <Modal
                title={title}
                visible={this.props.showModal}
                onOk={this.handleUpdate}
                onCancel={this.resetItem}>
                    <Form layout="horizontal">
                        {
                            FormItem.map(function(item,index){
                                if(updateItem&&handleType!='schedul')
                                    item.defaultValue = updateItem[item.name]||'';
                              return <CFormItem key={index} getFieldDecorator={getFieldDecorator} formItemLayout={formItemLayout} item={item} recordItem={updateItem}/>
                            })
                        }
                    </Form>
            </Modal>
        </div>
        )
    }
}
UpdateModal = Form.create()(UpdateModal);
