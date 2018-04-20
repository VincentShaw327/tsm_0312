import React from 'react';
import PropTypes from 'prop-types';
import { Layout, Menu, Icon,Switch } from 'antd';
import { hashHistory, Link } from 'react-router';
import { Scrollbars } from 'react-custom-scrollbars';
import TFooter from './TFooter';
import THeader from './Header/THeader';
import TTabMain from './TTabMain';
import { TPostData } from '../utils/ajax';
import LOGO from '../images/SCLOGO1.png';
const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;

export default class TIndexPage extends React.Component {

    constructor( props ) {
        super( props );
        this.state={
            siderTheme:false,
            minHeight:0,
            maxHeight:0
        }
    }

    componentWillMount(){   }

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

    onOpenChange = ( openKeys ) => {
        // console.log('openKeys',openKeys);
        const latestOpenKey = openKeys.find( key => this.state.openKeys.indexOf( key ) === -1 );
        if ( this.rootSubmenuKeys.indexOf( latestOpenKey ) === -1 ) {
            this.setState( { openKeys } );
        } else {
            this.setState( {
                openKeys: latestOpenKey ? [ latestOpenKey ] : [],
            } )
        }
    }

    // 调用子组件方法获取孩子名字
    THandleClick = ( e ) => {
        this._child.TPageOpen( e.key );
    }

    handleScroll(e){
        console.log("Scroll",e);
    }

    toggleTheme(value){
        this.setState({siderTheme:value});
    }

    render() {
        const { children } = this.props
        return (
            <Layout style={{height:"100%"}}>
                <THeader  />
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
                              <Menu.Item key="THome">
                                <Icon type="home" />
                                <span className="nav-text">系统首页</span>
                              </Menu.Item>

                              <SubMenu
                                    key="TScada"
                                    title={<span><Icon type="laptop" /><span>车间监控</span></span>}
                                  >
                                    <Menu.Item key="TScadaWorkShop_Auto">
                                        <span>自动化装配车间一</span>
                                      {/* <Link to={'/monitor1'}>
                                       </Link> */}
                                    </Menu.Item>
                                    <Menu.Item key="TScadaWorkShop_Auto2">
                                        <span>自动化装配车间二</span>
                                          {/* <Link to={'/monitor2'}>
                                         </Link> */}
                                    </Menu.Item>
                                    <Menu.Item key="TScada_ZS">注塑车间</Menu.Item>
                                    <Menu.Item key="TScada_CY">冲压车间</Menu.Item>
                              </SubMenu>

                              <SubMenu
                                    key="TManufacture"
                                    title={<span><Icon type="schedule" /><span>生产管理</span></span>}
                                  >
                                    <Menu.Item key="TManufactureOrder">
                                        <span>订单管理</span>
                                        {/* <Link to={'/TManufactureOrder'}>
                                        </Link> */}
                                    </Menu.Item>
                                    <Menu.Item key="TManufactureTask">
                                        <span>任务排程</span>
                                        {/* <Link to={'/TOrderScheduling'}>
                                        </Link> */}
                                    </Menu.Item>
                                    <Menu.Item key="TManufactureTaskDispatch">
                                        <span>生产派工</span>
                                        {/* <Link to={'/TManufactureTaskDispatch'}>
                                        </Link> */}
                                    </Menu.Item>
                                    {/* <Menu.Item key="TManufactureTaskQuery">工单查询</Menu.Item> */}
                              </SubMenu>

                              <SubMenu
                                    key="TWorkshop"
                                    title={<span><Icon type="idcard" /><span>车间管理</span></span>}
                                  >
                                    <Menu.Item key="TWorkShopType">
                                        <span>车间类别</span>
                                        {/* <Link to={'/TWorkShopType'}>
                                        </Link> */}
                                    </Menu.Item>
                                    <Menu.Item key="TWorkShopList">
                                        <span>车间列表</span>
                                        {/* <Link to={'/TWorkShopList'}>
                                        </Link> */}
                                    </Menu.Item>
                                    <Menu.Item key="TWorkCenterType">
                                        <span>工作中心类别</span>
                                        {/* <Link to={'/TWorkCenterType'}>
                                        </Link> */}
                                    </Menu.Item>
                                    <Menu.Item key="TWorkCenter">
                                        <span>工作中心</span>
                                        {/* <Link to={'/TWorkCenter'}>
                                        </Link> */}
                                    </Menu.Item>
                              </SubMenu>

                              <SubMenu
                                    key="TDevice"
                                    title={<span><Icon type="database" /><span>设备管理</span></span>}
                                  >
                                    <Menu.Item key="TDeviceCategory">
                                        <span>设备类别</span>
                                        {/* <Link to={'/TDeviceType'}>
                                        </Link> */}
                                    </Menu.Item>
                                    <Menu.Item key="TDeviceModel">
                                        <span>设备型号</span>
                                        {/* <Link to={'/TDeviceModel'}>
                                        </Link> */}
                                    </Menu.Item>
                                    <Menu.Item key="TDeviceList">
                                        <span>设备列表</span>
                                        {/* <Link to={'/TDeviceList'}>
                                        </Link> */}
                                    </Menu.Item>
                              </SubMenu>

                              <SubMenu
                                    key="TMould"
                                    title={<span><Icon type="hdd" /><span>模具管理</span></span>}
                                  >
                                <Menu.Item key="TMouldModel">
                                    <span>模具型号</span>
                                    {/* <Link to={'/TMouldModel'}>
                                    </Link> */}
                                </Menu.Item>
                                <Menu.Item key="TMouldList">
                                    <span>模具列表</span>
                                    {/* <Link to={'/TMouldList'}>
                                    </Link> */}
                                </Menu.Item>
                                {/* <Menu.Item key="TMouldCategory">模具类别</Menu.Item>
                                <Menu.Item key="TMouldList_ZS">注塑模具</Menu.Item>
                                <Menu.Item key="TMouldList_CY">冲压模具</Menu.Item>
                                <Menu.Item key="TMouldUserHistory">模具使用</Menu.Item> */}
                              </SubMenu>

                              <SubMenu
                                    key="TMaterial"
                                    title={<span><Icon type="shop" /><span>生产资源</span></span>}
                                  >
                                    <Menu.Item key="TMaterialType">
                                        <span>物料类别</span>
                                        {/* <Link to={'/TMaterialType'}>
                                        </Link> */}
                                    </Menu.Item>
                                    <Menu.Item key="TMaterialModel">
                                        <span>物料型号</span>
                                        {/* <Link to={'/TMaterialModel'}>
                                        </Link> */}
                                    </Menu.Item>
                                    <Menu.Item key="TProductModel">
                                      {/* <Icon type="user" /> */}
                                      <span className="nav-text">产品型号</span>
                                        {/* <Link to={'/TProductModel'}></Link> */}
                                    </Menu.Item>
                                    <Menu.Item key="TBomList">
                                      {/* <Icon type="user" /> */}
                                      <span className="nav-text">BOM管理</span>
                                      {/* <Link to={'/TBomList'}></Link> */}
                                    </Menu.Item>
                              </SubMenu>

                              {/* <SubMenu
                                    key="TProduct"
                                    title={<span><Icon type="user" /><span>产品定义</span></span>}
                                  >
                                    <Menu.Item key="TProductCategory">产品类别</Menu.Item>
                                    <Menu.Item key="TProductModel">产品型号</Menu.Item>
                                    <Menu.Item key="TProductList">产品列表</Menu.Item>
                              </SubMenu> */}

                              {/* <SubMenu
                                key="TWarning"
                                title={<span><Icon type="user" /><span>报警管理</span></span>}
                                >
                                 <Menu.Item key="TWarningItem">报警内容</Menu.Item>
                                <Menu.Item key="TWarningHistory">
                                    <span>报警历史</span>
                                </Menu.Item>
                              </SubMenu> */}

                              {/* <SubMenu
                                key="TProcess"
                                title={<span><Icon type="user" /><span>工艺分析</span></span>}
                                >
                                <Menu.Item key="TParameterList"><span>工艺参数列表</span></Menu.Item>
                                <Menu.Item key="TModifyRecord"><span>参数修改记录</span></Menu.Item>
                                <Menu.Item key="TParameterScada"><span>工艺参数监控</span></Menu.Item>
                                <Menu.Item key="TParameterAnalysis"><span>工艺优化分析</span></Menu.Item>
                              </SubMenu> */}

                              <SubMenu
                                    key="TReport"
                                    title={<span><Icon type="bar-chart" /><span>报表中心</span></span>}
                                  >
                                      {/* <Menu.Item key="TReportOEE_General">OEE概览</Menu.Item> */}
                                      <Menu.Item key="TTimeStatusReport">车间状态统计</Menu.Item>
                                      <Menu.Item key="TLossTimeReport">生产追踪</Menu.Item>
                                      <Menu.Item key="TProductionReport">生产报表</Menu.Item>
                                      <Menu.Item key="TOEEAnalysis">OEE分析</Menu.Item>
                                      <Menu.Item key="TWarningHistory">报警历史</Menu.Item>
                                  {/* <SubMenu
                                    key="TReportManufactory"
                                    title={<span><Icon type="user" /><span>生产报表</span></span>}
                                    >
                                     <Menu.Item key="TReportManufactory_Day">生产日报</Menu.Item>
                                     <Menu.Item key="TReportManufactory_Week">生产周报</Menu.Item>
                                    <Menu.Item key="TReportManufactory_Month">生产月报</Menu.Item>
                                    <Menu.Item key="TReportManufactory_Year">生产年报</Menu.Item>
                                  </SubMenu> */}
                                  {/* <SubMenu
                                    key="TReportProduction"
                                    title={<span><Icon type="user" /><span>产能分析</span></span>}
                                    >
                                     <Menu.Item key="TReportProduction_Auto">自动组装机</Menu.Item>
                                     <Menu.Item key="TReportProduction_CY">冲床</Menu.Item>
                                    <Menu.Item key="TReportProduction_ZS">注塑机</Menu.Item>
                                  </SubMenu> */}
                                  {/* <Menu.Item key="TReportQuality">品质趋势</Menu.Item> */}
                              </SubMenu>

                              <SubMenu
                                    key="TSystemSetting"
                                    title={<span><Icon type="setting" /><span>系统设置</span></span>}
                                  >
                                    <Menu.Item key="TUserList">
                                        <span>用户列表</span>
                                        {/* <Link to={'/TUserList'}>
                                        </Link> */}
                                    </Menu.Item>
                                    <Menu.Item key="TAuthList">
                                        <span>权限列表</span>
                                        {/* <Link to={'/TUserAuthList'}>
                                        </Link> */}
                                    </Menu.Item>
                                    <Menu.Item key="TAuthGroupList">
                                        <span>权限组管理</span>
                                        {/* <Link to={'/TUserAuthList'}>
                                        </Link> */}
                                    </Menu.Item>
                                    <Menu.Item key="TWarningConfig">
                                        <span>报警配置</span>
                                        {/* <Link to={'/TWarningConfig'}>
                                        </Link> */}
                                    </Menu.Item>
                                    <Menu.Item key="TDA_Terminal">
                                        <span>终端管理</span>
                                    </Menu.Item>
                                    {/* <Menu.Item key="TWorkShopCategory">车间类型</Menu.Item>
                                    <Menu.Item key="TWorkCenterCategory">工作中心类型</Menu.Item> */}
                              </SubMenu>

                              {/* <SubMenu
                                    key="XXXXX"
                                    title={<span><Icon type="user" /><span>XXXXXXX</span></span>}
                                  >
                                    <Menu.Item key="XXXX">XXXXX</Menu.Item>
                                    <Menu.Item key="XXXX">XXXXX</Menu.Item>
                                    <Menu.Item key="XXXX">XXXXX</Menu.Item>
                                    <Menu.Item key="XXXX">XXXXX</Menu.Item>
                                  </SubMenu> */}

                              <Menu.Item key="TAboutSupport">
                                <Icon type="user" />
                                <span className="nav-text">技术支持</span>
                              </Menu.Item>

                              <Menu.Item key="TDemo">
                                <Icon type="appstore" />
                                <span className="nav-text">组件DEMO</span>
                              </Menu.Item>
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
                        <Layout >
                            <Content style={{ margin: '24px 16px 0' }}>
                        <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
                            <TTabMain ref={child => this._child = child} content ={children} />
                            {/* {children} */}
                        </div>
                        <TFooter />
                      </Content>
                        </Layout>
                    </Scrollbars>
                </Layout>
             </Layout>
        );
    }
}

TIndexPage.propTypes = {
};
