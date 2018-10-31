import React, { Fragment }  from 'react';
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import { Layout, Menu, Icon,Switch } from 'antd';
import { hashHistory,History , Link } from 'react-router';
import { Scrollbars } from 'react-custom-scrollbars';
import { updateTabList } from 'actions/tabList';
import { updateBreadcrumbList } from 'actions/common';
import TFooter from './TFooter';
import GlobalFooter from 'components/ant-design-pro/GlobalFooter';
import THeader from './Header/THeader';
import TTabMain from './TTabMain';
import PageHeaderLayout from './PageHeaderLayout';
import { TPostData } from 'utils/ajax';
import LOGO from '../images/SCLOGO1.png';
const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;


@connect((state, props) => ({
  config: state.config,
  tabListResult:state.tabListResult,
}))
export default class TIndexPage extends React.Component {

    constructor( props ) {
        super( props );
        this.state={
            siderTheme:false,
            minHeight:0,
            maxHeight:0,
        }
    }

    componentWillMount(){ }

    componentDidMount(){
        this.setState({maxHeight:innerHeight-64,minHeight:innerHeight-64});
        window.onresize=(e)=>{
            // console.log('e',e);
            // console.log("innerHeight",innerHeight);
            this.setState({
                maxHeight:innerHeight-64,
                minHeight:innerHeight-64})
        }
    }

    // 调用子组件方法获取孩子名字
    THandleClick = ( e,key,keyPath ) => {
        console.log("TPageOpen( e.key )",e,key,keyPath)
        hashHistory.push(e.key)
        // this._child.TPageOpen( e.key );
        // this._child.TPageOpen1( e.item.props );
        this.props.dispatch(updateTabList({ title: e.item.props.name, content: '', key: e.key }))
        this.props.dispatch(updateBreadcrumbList({ title: e.item.props.name,href:e.key }))

    }

    handleScroll(e){
        console.log("Scroll",e);
    }

    toggleTheme(value){
        this.setState({siderTheme:value});
    }

    // 二级菜单的生成
    renderLeftNav(options) {
      const self = this
      return options.map((item, index) => {
        if (!item.children) {
          return (
            // <SubMenu key={index} title={item.name}>
            <Menu.Item key={item.key ? item.key : item.url} name={item.name}>
                {item.icon?<Icon type={item.icon} title={item.name} />:''}
              <span
                  className="menu-name"
                  >{item.name}</span>
            </Menu.Item>
            // </SubMenu>
          )
        }
        return (
          // <SubMenu key={`sub${index}`}
          <SubMenu key={item.key ? item.key : item.url}
            title={
              <span>
                <Icon type={item.icon} title={item.name} />
                <span className="menu-name">{item.name}</span>
              </span>}
          >
            {
              // item.url ?
                // <Menu.Item key={item.key ? item.key : item.url} name={item.name}>
                //   {/* <Icon type={item.icon} title={item.name} /> */}
                //   {/* <span className="menu-name">{item.name}</span> */}
                //   {item.name}
                // </Menu.Item> : null
            }

            {
              item.children && item.children.length > 0 ? self.renderLeftNav(item.children) : null
            }
          </SubMenu>
        )
      })
    }

    render() {
        const { children } = this.props
        return (
            <Layout style={{height:"100%"}}>
                <THeader handleSearch={this._child}  />
                <Layout>
                      <Sider
                        breakpoint="md"
                        collapsedWidth="0"
                        onCollapse={(collapsed, type) => { console.log(collapsed, type); }}>
                        {/* <div style={{background: `url(${LOGO})`,backgroundSize:'200px 85px',height:96}}></div> */}
                        <Scrollbars
                            autoHide
                            autoHideTimeout={1000}
                            autoHideDuration={200}
                            autoHeight
                            autoHeightMin={500}
                            autoHeightMax={this.state.maxHeight}
                            thumbMinSize={30}
                            universal={true}
                            >
                            <Menu
                                theme="light"
                                mode="inline"
                                defaultSelectedKeys={['4']}
                                onClick={this.THandleClick}>
                                {this.renderLeftNav(this.props.config.nav || [])}

                              {/* <Menu.Item key="TAboutSupport">
                                <Icon type="tec-support" />
                                <span className="nav-text">技术支持</span>
                              </Menu.Item> */}
                              {/* <Menu.Item key="TDemo">
                                <Icon type="appstore" />
                                <span className="nav-text">组件DEMO</span>
                              </Menu.Item> */}
                            </Menu>
                        </Scrollbars>
                      </Sider>
                    {/* <THeader /> */}
                    <Scrollbars
                      autoHide
                      autoHideTimeout={1000}
                      autoHideDuration={200}
                      autoHeight
                      autoHeightMin={500}
                      // autoHeightMax={560}
                      autoHeightMax={this.state.maxHeight}
                      thumbMinSize={30}
                      universal={true}
                      >
                        <Layout style={{border:'solid 0px' }}>
                            {/* <Content style={{ margin: '24px 16px 0',border:'solid 0px' }}> */}
                            <Content style={{ margin: '0',border:'solid 0px' }}>
                                {/* <div style={{ padding: 24, background: '#fff', minHeight: 360 }}> */}
                                <div style={{ minHeight: 360 }}>
                                    <TTabMain
                                        ref={child => this._child = child}
                                        content ={children}
                                    />
                                    {children}
                                </div>
                                {/* <TFooter /> */}
                            </Content>
                            <Footer style={{ padding: 0 }}>
                                <GlobalFooter
                                    className="globalFooter"
                                /*  links={[{
                                    key: 'Pro 首页',
                                    title: 'Pro 首页',
                                    href: 'http://pro.ant.design',
                                    blankTarget: true,
                                  }, {
                                    key: 'github',
                                    title: <Icon type="github" />,
                                    href: 'https://github.com/ant-design/ant-design-pro',
                                    blankTarget: true,
                                  }, {
                                    key: 'Ant Design',
                                    title: 'Ant Design',
                                    href: 'http://ant.design',
                                    blankTarget: true,
                                  }]}*/
                                  copyright={
                                    <Fragment>
                                      Copyright <Icon type="copyright" />广东拓斯达科技股份有限公司
                                    </Fragment>
                                  }
                                />
                            </Footer>
                        </Layout>
                    </Scrollbars>
                </Layout>
             </Layout>
        );
    }
}

TIndexPage.propTypes = {
};
