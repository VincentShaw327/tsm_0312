import React from 'react';
import { browserHistory } from 'react-router'
import { Form, Modal, Button, message, Dropdown, Icon } from 'antd';
import CFormItem from './CreateFormItem';
import CreateMenu from './CreateMenu';

let self

let CForm = React.createClass({

    getInitialState: function() {
        return { visible: false }
    },

    render: function() {

        const CDropD = this.props.CDropD;

        const menulist = CDropD ? <CreateMenu menu={ CDropD.items } /> : []
        return  CDropD ?
                <div className="" style={{ marginRight: '25px' }}>
                    <Dropdown overlay={ menulist } trigger={['click']}>
                        <Button style={{ marginLeft: 8 }}>
                            { CDropD.title }切换 <Icon type="down" />
                        </Button>
                    </Dropdown>
                </div>:
                <span />
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
