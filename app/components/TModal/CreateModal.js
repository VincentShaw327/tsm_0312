import React, { Component } from 'react';
import { Button, Card,Form, Modal, message } from 'antd';
// import CFormItem from './CreateFormItem';
import CFormItem from '../TForm/CreatFormItem/CreateFormItem';

export default class CreateModal extends Component {

    constructor( props ) {
        super( props )
        this.state = {
            title: props.title,
            showModal:false
        }
    }

    componentWillMount() {}

    componentDidMount() {}

    toggleShow=(str)=>{
        this.setState({showModal:!this.state.showModal});
        if(str&&str=='cancel') this.props.form.resetFields();
    }

    handleCreate=()=> {
        this.props.form.validateFields( ( errors, values ) => {
            // console.log('收到表单值：', values);
            let subValue = {};
            if ( !!errors ) {
                console.log( 'Errors in form!!!' );
                message.error( '添加失败' )
                return;
            } else {
                this.props.submit( values );
                this.toggleShow('cancel');
                // message.success('添加成功');
            }
        } );
    }

    render() {
        const self = this;
        const {
            handleType,
            FormItem,
            updateItem,
            form:{getFieldDecorator}
        }=this.props;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 },
        };
        return (
            <div>
                <div style={{margin:'20px 0'}}>
                    <Button
                        onClick={this.toggleShow}
                        icon="plus" type="primary">添加</Button>
                </div>
            <Modal
                title="新建对象"
                visible={this.state.showModal}
                onOk={this.handleCreate}
                onCancel={this.toggleShow.bind(this,'cancel')}>
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
CreateModal = Form.create()(CreateModal);
