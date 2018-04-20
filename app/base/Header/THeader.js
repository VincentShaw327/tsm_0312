import React, { Component ,createElement} from 'react';
import PropTypes from 'prop-types';
import { Layout, Menu, Icon, Input, Row, Col, Avatar, Dropdown } from 'antd';

import LOGO from '../../images/T-3.png';
import styles from './THeader.less';
import HeaderSearch from '../../components/ant-design-pro/HeaderSearch';
const { Header, Content, Footer, Sider } = Layout;
const Search = Input.Search;
const userMenu = (
    <Menu className="userlistMenu">
        <Menu.Item>
            <Icon type="user"/>
            <span className="itemTxt">个人中心</span>
        </Menu.Item>
        <Menu.Item>
            <Icon type="logout" />
            <span className="itemTxt">退出登录</span>
        </Menu.Item>
        <Menu.Item>
            <Icon type="setting" />
            <span className="itemTxt">设置</span>
        </Menu.Item>
    </Menu>
)

const setMenu = (
    <Menu>
        <Menu.Item >
            <Icon type="arrows-alt" />
            <span >全屏</span>
        </Menu.Item>
        <Menu.Item>
            <Icon type="setting" />
            <span>设置</span>
        </Menu.Item>
        <Menu.Item>
            <Icon type="setting" />
            <span>退出登录</span>
        </Menu.Item>
    </Menu>
)

export default class THeader extends React.Component {
    constructor( props ) {
        super( props );
        this.state={
            isFullScreen:false
        }
        this.fullScreen.bind(this);
        this.exitScreen.bind(this);
    }

    fullScreen(ele) {
        console.log('ele', ele);
        this.setState({isFullScreen: true});
        var el = document.documentElement;
        var rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullScreen;
        if (typeof rfs != "undefined" && rfs) {
            rfs.call(el);
        }
        else if (typeof window.ActiveXObject != "undefined") {
            //for IE，这里其实就是模拟了按下键盘的F11，使浏览器全屏
            var wscript = new ActiveXObject("WScript.Shell");
            if (wscript != null) {
                wscript.SendKeys("{F11}");
            }
        }
    }
    //退出全屏
    exitScreen(){
        this.setState({isFullScreen: false});
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
        else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        }
        else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        }
        else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
        if(typeof cfs != "undefined" && cfs) {
            cfs.call(el);
        }
    }

    render(){

        return (
            <Header className="header">
              {/* <div className="logo" /> */}
              <Row gutter={16}>
                  <Col span={9}>
                      <div className="header-title">
                            <span>T-MES智能制造执行系统</span>
                            {/* <img src={LOGO} style={{width:'100%',maxWidth:450}}/> */}
                      </div>
                  </Col>
                  <Col span={10}>
                      <heard-seach>
                          <Search
                              placeholder="输入..."
                              onSearch={value => console.log(value)}
                              // enterButton
                              // style={{ width: 800 }}
                          />
                      </heard-seach>
                  </Col>
                  {/* <Col span={1}>
                    <span className='menu-item'>
                        <Dropdown overlay={setMenu}>
                          <Icon type="appstore" className="header-menu-icon"/>
                        </Dropdown>
                    </span>
                  </Col> */}
                  <Col span={1}>
                    <div className='menu-item'>
                        {
                            this.state.isFullScreen?
                            <Icon
                                onClick={this.exitScreen.bind(this)}
                                className="header-menu-icon"
                                type="shrink"/>:
                            <Icon
                                onClick={this.fullScreen.bind(this)}
                                className="header-menu-icon"
                                type="arrows-alt"/>
                        }
                    </div>
                  </Col>
                  {/* <Col span={1}>
                    <span className="menu-item">
                        <Dropdown overlay={userMenu}>
                          <Icon type="bell" className="header-menu-icon"/>
                        </Dropdown>
                    </span>
                  </Col> */}
                  <Col span={3} style={{border:'solid 0px'}}>
                      <div className="menu-item">
                          <Dropdown overlay={userMenu}>
                              <div>
                                  <span style={{width:"40%"}}>
                                      <span>
                                        <Avatar size="small" icon="user"/>
                                      </span>
                                  </span>
                                  <span style={{width:"60%",paddingLeft:"10%",color:'#fcfcfc',fontWeight:"bold"}}>
                                    Admin
                                  </span>
                              </div>
                          </Dropdown>
                      </div>
                  </Col>
              </Row>
            </Header>
        );
    }
};
THeader.propTypes = {

};
