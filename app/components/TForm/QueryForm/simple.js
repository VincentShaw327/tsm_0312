import React, {Component} from 'react';
import {
    Button,
    Row,
    Col,
    Divider,
    List,
    Timeline,
    Menu,
    Card,
    Form
} from 'antd';
// import { TPostData, urlBase } from '../../utils/TAjax';
import CFormItem from '../CreatFormItem/CreateFormItem';
import styles from './simple.less';

export default class SimpleQForm extends Component {

    constructor(props) {
        super(props)
        this.state = {
            title: props.title,
            expandForm: false
        }
    }

    componentWillMount() {}

    handleFormReset = () => {
        this.props.form.resetFields();
        // this.props.submit();
        this.handleSearch();
    }

    handleSearch = (e) => {
        this.props.form.validateFields((errors, values) => {
            let subValue = {};
            console.log('handleSearch',e);
            e?e.preventDefault():'';
            // e.preventDefault();
            if (!!errors) {
                console.log('Errors in form!!!');
                message.error('添加失败');
                return false;
            } else {
                this.props.submit(values);
                return false;
            }
        });
    }

    render() {
        const {isBordered=true,FormItem, form: {getFieldDecorator}} = this.props;

        return (
            <div>
                <Card bordered={isBordered}>
                    <Form onSubmit={this.handleSearch} layout="inline">
                        <Row gutter={{
                                md: 8,
                                lg: 24,
                                xl: 48
                            }}>
                            <Col md={8} sm={24}>
                                <CFormItem getFieldDecorator={getFieldDecorator} item={FormItem[0]}/>
                            </Col>
                            {
                                FormItem[1]
                                    ? <Col md={8} sm={24}>
                                            <CFormItem getFieldDecorator={getFieldDecorator} item={FormItem[1]}/>
                                        </Col>
                                    : null
                            }
                            <Col md={8} sm={24}>
                                <span className={styles.submitButtons}>
                                    <Button type="primary" htmlType="submit">查询</Button>
                                    <Button style={{
                                            marginLeft: 8
                                        }} onClick={this.handleFormReset}>重置</Button>
                                </span>
                            </Col>
                        </Row>
                    </Form>
                </Card>
            </div>
        )
    }
}
SimpleQForm = Form.create()(SimpleQForm);
