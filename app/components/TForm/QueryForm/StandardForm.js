import React, {Component} from 'react';
import {Button,Icon,Input,Select,Row,Col,Divider,
    List,Card,Form} from 'antd';
import CFormItem from '../CreatFormItem/CreateFormItem';
// import {TPostData, urlBase} from '../../utils/TAjax';
import styles from './simple.less';
const FormItem = Form.Item;

export default class StandardQForm extends Component {

    constructor(props) {
        super(props)
        this.state = {
            title: props.title,
            expandForm: false
        }
    }

    componentWillMount() {}

    componentDidMount() {}

    renderSimpleForm=()=> {
        const {FormItem, form: {getFieldDecorator}} = this.props;

        return (
            <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{md: 8,lg: 24,xl: 48}}>
                    <Col md={8} sm={24}>
                        <CFormItem getFieldDecorator={getFieldDecorator} item={FormItem[0]}/>
                    </Col>
                    <Col md={8} sm={24}>
                        <CFormItem getFieldDecorator={getFieldDecorator} item={FormItem[1]}/>
                    </Col>
                    <Col md={8} sm={24}>
                        <span className={styles.submitButtons}>
                            <Button type="primary" htmlType="submit">查询</Button>
                            <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>重置</Button>
                            <a style={{marginLeft: 8}} onClick={this.toggleForm}>
                                展开
                                <Icon type="down"/>
                            </a>
                        </span>
                    </Col>
                </Row>
            </Form>
        );
    }

    renderAdvancedForm=()=> {
        const {FormItem, form: {getFieldDecorator}} = this.props;
        let formItem=[];
        if(FormItem.length){
            let len=FormItem.length,
                rowNum=Math.ceil(len/3),
                itemNum=0;
            for (var i = 0; i < rowNum; i++) {
                itemNum=i*3;
                formItem.push(  <Row key={i} gutter={{md: 8,lg: 24,xl: 48}}>
                            <Col md={8} sm={24}>
                                <CFormItem getFieldDecorator={getFieldDecorator} item={FormItem[itemNum]}/>
                            </Col>
                            <Col md={8} sm={24}>
                                <CFormItem getFieldDecorator={getFieldDecorator} item={FormItem[++itemNum]}/>
                            </Col>
                            <Col md={8} sm={24}>
                                <CFormItem getFieldDecorator={getFieldDecorator} item={FormItem[++itemNum]}/>
                            </Col>
                        </Row>)
            }
        }

        return (
            <Form onSubmit={this.handleSearch} layout="inline">
                {
                    formItem.map((item,index)=>{
                        return item
                    })
                }
                <div style={{overflow: 'hidden'}}>
                    <span style={{float: 'right',marginBottom: 24}}>
                        <Button type="primary" htmlType="submit">查询</Button>
                        <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>重置</Button>
                        <a style={{marginLeft: 8}} onClick={this.toggleForm}>
                            收起
                            <Icon type="up"/>
                        </a>
                    </span>
                </div>
            </Form>
        );
    }

    toggleForm = () => {
        this.setState({
            expandForm: !this.state.expandForm
        });
    }

    handleFormReset = () => {
        const {form, dispatch} = this.props;
        form.resetFields();
        // this.setState({formValues: {}});
        // dispatch({type: 'rule/fetch', payload: {}});
    }

    render() {
        return (
            <div>
                <Card>
                    {
                        this.state.expandForm
                            ? this.renderAdvancedForm()
                            : this.renderSimpleForm()
                    }
                </Card>
            </div>
        )
    }
}
StandardQForm = Form.create()(StandardQForm);
