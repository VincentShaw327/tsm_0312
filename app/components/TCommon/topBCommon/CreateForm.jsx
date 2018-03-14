import React from 'react';
import { browserHistory } from 'react-router'
import { Form, Modal, Button, message } from 'antd';
import CFormItem from './CreateFormItem';
import { plInfo, HandleCreate } from '../../server'

let MeduleInfo
let self

let CForm = React.createClass({

    getInitialState: function() {
        return { visible: false }
    },

    render: function() {

        MeduleInfo = this.props.MeduleInfo
        const CType = this.props.CType;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 18 },
        }
        return  CType ?
                <div className="create create-extra">
                  <Button type="primary" icon="plus-circle-o" onClick={this.showModal}>添加</Button>
                  <Modal title='添加新对象'
                         okText="确认"
                         cancelText="取消"
                         visible={this.state.visible}
                         onOk={this.handleCreate}
                         onCancel={this.hideModal}>
                    <Form layout="horizontal">
                      {
                        CType.map(function(item, index){
                          //return self.dealConfigCType(item);
                          return <CFormItem key={index} getFieldDecorator={getFieldDecorator} formItemLayout={formItemLayout} item={item}/>
                        })
                      }
                    </Form>
                  </Modal>
                </div>:
                <div></div>
    },

    handleCreate: function(){
      this.props.form.validateFields((errors, values) => {
          if (!!errors) {
              message.error('添加失败')
              return;
          }else{
              this.props.submit(values)
              this.hideModal();
              message.success('添加成功')
          }
      });
    },

    handleReset: function() {
        this.props.form.resetFields()
    },

    showModal: function() {
        this.setState({ visible: true })
    },

    hideModal: function() {
        this.setState({ visible: false })
        this.handleReset();
    }
});

CForm = Form.create()(CForm);

export default CForm;
