import React, { Component } from 'react';
import { Button, Card, DatePicker,Form, Modal, message } from 'antd';
import { TPostData, urlBase } from '../../utils/TAjax';
import CFormItem from './CreateFormItem';

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
            // console.log('收到表单值：', values);
            let subValue = {};
            if ( !!errors ) {
                console.log( 'Errors in form!!!' );
                message.error( '添加失败' )
                return;
            } else {
                if ( values.hasOwnProperty( 'range-pick' ) ) {
                    subValue = {
                        ...values,
                        'range-picker': [ values[ 'range-pick' ][ 0 ].format( 'YYYY-MM-DD' ), values[ 'range-pick' ][ 1 ].format( 'YYYY-MM-DD' ) ],
                    }
                } else if ( values.hasOwnProperty( 'date-picker' ) ) {
                    subValue = {
                        ...values,
                        'date-picker': values[ 'date-picker' ].format( 'YYYY-MM-DD' ),
                    }
                } else {
                    subValue = {
                        ...values,
                    }
                }
                this.props.submit( subValue );
                this.hideModal();
                // message.success('添加成功');
            }
        } );
    }
    handlePlace() {
        this.props.placeSubmit( this.props.form.getFieldsValue() )
        // console.log("place的提交值是",this.props.form.getFieldsValue());
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
        const FormItem = this.props.FormItem;
        const updateItem = this.props.updateItem;
        // 详情见antd form 文档
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 },
        };

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

                              // return self.dealConfigUType(item, defaultValue);
                              return <CFormItem key={index} getFieldDecorator={getFieldDecorator} formItemLayout={formItemLayout} item={item}/>
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
