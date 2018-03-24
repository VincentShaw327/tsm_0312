import React from 'react';
import { Layout, Menu, Icon, Input, Row, Col, Avatar, Dropdown } from 'antd';

import LOGO from '../images/T-3.png';
import styles from './THeader.less'

const { Header, Content, Footer, Sider } = Layout;
const Search = Input.Search;

const userMenu = (
    <Menu>
        <Menu.Item>
            <Icon type="user"/>
            <span>个人中心</span>
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

const THeader = () => {

    return (
        <Header className="header">
          {/* <div className="logo" /> */}
          <Row gutter={16}>
              <Col span={9}>
                  {/* T-MES 智能制造生产系统 */}
                  <img src={LOGO} style={{width:'100%',maxWidth:450}}/>
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
              {/* <Col span={3}>
                  <div className="header-menu-wrap">
                      <span className='menu-item'>
                          <Dropdown overlay={userMenu}>
                            <Icon type="appstore" className="header-menu-icon"/>
                          </Dropdown>
                      </span>
                      <span className="menu-item">
                          <Dropdown overlay={userMenu}>
                            <Icon type="bell" className="header-menu-icon"/>
                          </Dropdown>
                      </span>
                      <span className="menu-item">
                          <Dropdown overlay={userMenu}>
                            <span>
                              <Avatar size="small" icon="user"/>
                              Admin
                            </span>
                          </Dropdown>
                      </span>
                  </div>
              </Col> */}
              <Col span={1}>
                <span className='menu-item'>
                    <Dropdown overlay={userMenu}>
                      <Icon type="appstore" className="header-menu-icon"/>
                    </Dropdown>
                </span>
              </Col>
              <Col span={1}>
                <span className="menu-item">
                    <Dropdown overlay={userMenu}>
                      <Icon type="bell" className="header-menu-icon"/>
                    </Dropdown>
                </span>
              </Col>
              <Col span={3} style={{border:'solid 0px'}}>
                  <span style={{width:"40%"}}>
                    <Dropdown overlay={userMenu}>
                      <span>
                        <Avatar size="small" icon="user"/>
                      </span>
                    </Dropdown>
                  </span>
                  <span style={{width:"60%",paddingLeft:"15%",color:'#fcfcfc',fontWeight:"bold"}}>
                    Admin
                  </span>
              </Col>
          </Row>

        </Header>
    );
};

THeader.propTypes = {};

export default THeader;
