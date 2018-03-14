import React from 'react';
import { Layout, Menu, Icon,Input,Row, Col ,Avatar,Dropdown } from 'antd';

import LOGO from '../images/T-3.png'

const { Header, Content, Footer, Sider } = Layout;
const Search = Input.Search;
const userMenu=(
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
          <Row>
              <Col span={9}>
                  {/* T-MES 智能制造生产系统 */}
                  <img src={LOGO} style={{width:'100%',maxWidth:450}}/>
              </Col>
              <Col span={12}>
                  <heard-seach>
                      <Search
                          placeholder="输入..."
                          onSearch={value => console.log(value)}
                          enterButton
                          // style={{ width: 800 }}
                      />
                  </heard-seach>
              </Col>
              <Col span={3}>
                  <Menu
                    // theme="dark"
                    mode="horizontal"
                    // defaultSelectedKeys={['2']}
                    selectable={false}
                    style={{ lineHeight: '64px',background: '#1890ff' }}
                   >
                    {/* <Menu.Item key="1"> T-MES 智能制造生产系统</Menu.Item> */}
                    <Menu.Item key="2">
                    </Menu.Item>
                    <Menu.Item key="3"></Menu.Item>
                    <Menu.Item key="4"></Menu.Item>
                    <Menu.Item key="5">
                        <Dropdown overlay={userMenu}>
                            <div>
                                <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                                Admin
                            </div>
                        </Dropdown>
                    </Menu.Item>
                  </Menu>
              </Col>
          </Row>

        </Header>
  );
};

THeader.propTypes = {
};

export default THeader;
