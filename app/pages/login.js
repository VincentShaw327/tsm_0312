import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import MD5 from 'components/TCommon/md5';
import {connect} from 'react-redux';
import {hashHistory, Link} from 'react-router';
import {
    Spin,
    message,
    Form,
    Icon,
    Input,
    Button,
    Row,
    Col
} from 'antd'
import {fetchLogin, userInfo} from 'actions/common';
import styles from './login.less';
import { TPostData,urlBase } from 'utils/TAjax';
const FormItem = Form.Item

@Form.create({
    onFieldsChange(props, items) {}
})


export default class Login extends Component {
    // 初始化页面常量 绑定事件方法
    constructor(props, context) {
        super(props)
        this.state = {
            loading: false
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.checkPass = this.checkPass.bind(this)
        this.checkName = this.checkName.bind(this)
        this.noop = this.noop.bind(this)
    }

    setLevel=(username)=>{
        let UserLevel;
        switch (username) {
            case 'dev':
                UserLevel='develop';
                break;
            case 'admin':
                UserLevel='administor';
                break;
            case 'punch':
                UserLevel='pw_manager';
                break;
            case 'inject':
                UserLevel='iw_manager';
                break;
            case 'autosmt2':
                UserLevel='aw_manager2';
                break;
            case 'autosmt3':
                UserLevel='aw_manager3';
                break;
            default:
                UserLevel='visit';
        }
        return UserLevel;
    }

    handleSubmit(e) {
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if (!err) {

                //字符去空
                Object.keys(values).map(key => values[key] = (values[key] && values[key].trim()));
                console.log('values2',values);
                let password = MD5( values.password );
                let dat = {
                    LoginName: values.username,
                    Password: password,
                }
                // console.log('denglu',dat);
                TPostData('/api/TUser/account', "Login", dat,
                    ( res )=> {
                        // message.success("成功！");
                        console.log('登陆成功',res);
                        if(res.err==0){
                            const userinfo={
                                account:values.username,
                                img:"img/avtar01.png",
                                UserLevel:this.setLevel(values.username),
                                PermissionList:['edit','add','delete',]
                            }
                            sessionStorage.setItem('userinfo', JSON.stringify(userinfo));
                            // sessionStorage.setItem('userinfo', userinfo);
                            hashHistory.push('/');
                        }
                        else{
                            message.error("登陆失败,账户名或密码错误！");
                        }
                    } ,
                    ( res )=> {
                        message.error("登陆失败");
                    }
                )

            }
        })
    }

    // 组件已经加载到dom中
    componentDidMount() {
        // this.props.dispatch(fetchLogin({ currentPage: 1 }))
    }

    checkName = (rule, value, callback) => {
        // const { validateFields } = this.props.form
        // console.log('checkName rule',callback);
        // console.log('checkName value',callback);
        // console.log('checkName callback',callback);

        if (value) {
            // validateFields([''])
        }
        callback()
    }

    checkPass = (rule, value, callback) => {
        // const { validateFields } = this.props.form
        if (value) {
            // validateFields([''])
        }
        callback()
    }

    noop = () => false

    render() {
        const {getFieldDecorator} = this.props.form
        return (<div className="login">
            <div className="sy_top"/>
            <div className="btmLogin">
                <div className="sy_bottom">
                    <h1 id="PerformName">T-MES智能制造执行系统</h1>
                    <Row className="ul-wrap">
                        <Col span={24}>
                            <Spin spinning={this.state.loading}>
                                <Form onSubmit={this.handleSubmit}>
                                    <FormItem hasFeedback="hasFeedback">
                                        {
                                            getFieldDecorator('username', {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '请输入用户名'
                                                    }, {
                                                        validator: this.checkName
                                                    },
                                                    // { pattern: regExpConfig.IDcardTrim, message: '身份证号格式不正确' }
                                                ],
                                                // validateTrigger: 'onBlur',
                                            })(<Input prefix={<Icon type = "user" style = {{ fontSize: 13 }}/>} placeholder="请输入用户名" type="text"/>)
                                        }
                                    </FormItem>
                                    <FormItem hasFeedback="hasFeedback">
                                        {
                                            getFieldDecorator('password', {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '请输入密码'
                                                    },
                                                    // { pattern: regExpConfig.pwd, message: '密码只能是6-16个数字或者字母组成' }
                                                ],
                                                // validateTrigger: 'onBlur',
                                            })(<Input prefix={<Icon type = "lock" style = {{ fontSize: 13 }}/>} placeholder="请输入密码" type="password"/>)
                                        }

                                    </FormItem>
                                    <FormItem>
                                        <Button className="loginBtn" type="primary" htmlType="submit">登录</Button>
                                        {/* <Link to="/register">注册</Link> */}
                                    </FormItem>
                                </Form>
                            </Spin>
                        </Col>
                    </Row>
                </div>
            </div>
        </div>)
    }
}
