import React, { Component } from 'react'
import { Layout, Menu, Icon } from 'antd';
const SubMenu = Menu.SubMenu;
import { Menu, Icon, Spin } from 'antd'
// import { updateTabList } from 'actions/tabList'


export default class LeftNav extends Component {
    constructor(props, context) {
      super(props, context)

      const { pathname } = props.location
      this.state = {
        current: pathname,
        openKeys: ['sub1'],
        isLeftNavMini: false,
      }

      this._handleClick = this._handleClick.bind(this)
    }
    _handleClick = (e)=>{ // 调用子组件方法获取孩子名字

      console.log(e);

            //this.refs["TTabMain"].TPageOpen(key);
            this._child.TPageOpen(e.key);

           // console.log("call in father");

            // onClick={(c)=>this.TPageOpen('TWorkShopList')}

            console.log('click ', e);

    }

    render() {
      const selectedKeys = [this.props.location.pathname.replace('/', '')]
      return (
          <Sider
            breakpoint="lg"
            collapsedWidth="0"
            onCollapse={(collapsed, type) => { console.log(collapsed, type); }}
              >
            <div className="logo" onClick={this.TFetchTest}>
              T-MES
            </div>
            <Menu theme="dark" mode="inline" defaultSelectedKeys={['4']}  onClick={this.THandleClick}>
              <Menu.Item key="8">
                <Icon type="TTabMain" />
                <span className="nav-text">系统首页</span>
              </Menu.Item>
              <SubMenu
                    key="TScada"
                    title={<span><Icon type="user" /><span>车间监控</span></span>}
                  >
                    <Menu.Item key="TScadaWorkShop_Auto">自动车间一</Menu.Item>
                    <Menu.Item key="TScada_Auto2">自动车间二</Menu.Item>
                    <Menu.Item key="TScada_CY">冲压车间</Menu.Item>
                    <Menu.Item key="TScada_ZS">注塑车间一</Menu.Item>
                  </SubMenu>

              <SubMenu
                    key="TManufacture"
                    title={<span><Icon type="user" /><span>生产管理</span></span>}
                  >
                    <Menu.Item key="TManufactureOrder">生产订单</Menu.Item>
                    <Menu.Item key="TManufactureTask">任务排程</Menu.Item>
                    <Menu.Item key="TManufactureTaskDispatch">派工</Menu.Item>
                    <Menu.Item key="TManufactureTaskQuery">工单查询</Menu.Item>
                  </SubMenu>

              <SubMenu
                    key="TDevice"
                    title={<span><Icon type="user" /><span>设备管理</span></span>}
                  >
                    <Menu.Item key="TDeviceCategory">设备类别</Menu.Item>
                    <Menu.Item key="TDeviceModel">设备型号</Menu.Item>
                    <Menu.Item key="TDeviceList">设备列表</Menu.Item>
                  </SubMenu>

              <SubMenu
                    key="TMould"
                    title={<span><Icon type="user" /><span>模具管理</span></span>}
                  >
                    <Menu.Item key="TMouldCategory">模具类别</Menu.Item>
                    <Menu.Item key="TMouldList_ZS">注塑模具</Menu.Item>
                    <Menu.Item key="TMouldList_CY">冲压模具</Menu.Item>
                    <Menu.Item key="TMouldUserHistory">模具使用</Menu.Item>
                  </SubMenu>


              <SubMenu
                    key="TProduct"
                    title={<span><Icon type="user" /><span>产品定义</span></span>}
                  >
                    <Menu.Item key="TProductCategory">产品类别</Menu.Item>
                    <Menu.Item key="TProductModel">产品型号</Menu.Item>
                    <Menu.Item key="TProductList">产品列表</Menu.Item>
                  </SubMenu>

              <SubMenu
                    key="TMaterial"
                    title={<span><Icon type="user" /><span>物料管理</span></span>}
                  >
                    <Menu.Item key="TMaterialCategory">物料类别</Menu.Item>
                    <Menu.Item key="TMaterialCode">物料编码</Menu.Item>
                  </SubMenu>

              <Menu.Item key="TBom">
                <Icon type="user" />
                <span className="nav-text">BOM管理</span>
              </Menu.Item>


                  <SubMenu
                    key="TWarning"
                    title={<span><Icon type="user" /><span>报警管理</span></span>}
                  >
                     <Menu.Item key="TWarningItem">报警内容</Menu.Item>
                    <Menu.Item key="TWarningHistory">报警历史记录</Menu.Item>
                  </SubMenu>

              <SubMenu
                    key="TReport"
                    title={<span><Icon type="user" /><span>报表中心</span></span>}
                  >
                  <SubMenu
                    key="TReportOEE"
                    title={<span><Icon type="user" /><span>设备OEE</span></span>}
                  >
                     <Menu.Item key="TReportOEE_General">OEE概览</Menu.Item>
                     <Menu.Item key="TReportOEE_Auto">自动组装OEE</Menu.Item>
                    <Menu.Item key="TReportOEE_CY">冲床OEE</Menu.Item>
                    <Menu.Item key="TReportOEE_ZS">注塑OEE</Menu.Item>
                  </SubMenu>


                   <SubMenu
                    key="TReportManufactory"
                    title={<span><Icon type="user" /><span>生产报表</span></span>}
                  >
                     <Menu.Item key="TReportManufactory_Day">生产日报</Menu.Item>
                     <Menu.Item key="TReportManufactory_Week">生产周报</Menu.Item>
                    <Menu.Item key="TReportManufactory_Month">生产月报</Menu.Item>
                    <Menu.Item key="TReportManufactory_Year">生产年报</Menu.Item>
                  </SubMenu>

                   <SubMenu
                    key="TReportProduction"
                    title={<span><Icon type="user" /><span>产能分析</span></span>}
                  >
                     <Menu.Item key="TReportProduction_Auto">自动组装机</Menu.Item>
                     <Menu.Item key="TReportProduction_CY">冲床</Menu.Item>
                    <Menu.Item key="TReportProduction_ZS">注塑机</Menu.Item>
                  </SubMenu>

                  <Menu.Item key="TReportQuality">品质趋势</Menu.Item>

                    {/* <Menu.Item key="XXXX">生产报表</Menu.Item>
                    <Menu.Item key="XXXX">XXXXX</Menu.Item>
                    <Menu.Item key="XXXX">XXXXX</Menu.Item>
                    <Menu.Item key="XXXX">XXXXX</Menu.Item> */}
                  </SubMenu>


              <SubMenu
                    key="TSystemSetting"
                    title={<span><Icon type="user" /><span>系统设置</span></span>}
                  >
                    <Menu.Item key="TUserAccountList">用户管理</Menu.Item>
                    <Menu.Item key="TUserAuthList">权限组</Menu.Item>
                    <Menu.Item key="TWorkShopCategory">车间类型</Menu.Item>
                    <Menu.Item key="TWarningConfig">报警配置</Menu.Item>
                    <Menu.Item key="TWorkCenterCategory">工作中心类型</Menu.Item>
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
            </Menu>
          </Sider>
      )
    }
}
