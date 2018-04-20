import React from 'react';
import { Tabs, Button,Icon } from 'antd';
import PropTypes from 'prop-types';
import styles from './index.less';
import {
    THome,
    TScadaWorkShop_Auto,
    TScadaWorkShop_Auto2,
    TScadaPunchingworkshop,
    TScadaInjectionWorkshop,
    TManufactureOrder,
    TOrderScheduling,
    TManufactureTaskDispatch,
    TDeviceList,
    TDeviceModel,
    TDeviceType,
    TWorkCenter,
    TWorkCenterType,
    TWorkShopList,
    TWorkShopType,
    TMouldList,
    TMouldModel,
    TAuthGroupList,
    TUserList,
    TAuthList,
    TWarningConfig,
    TWarningHistory,
    TMaterialModel,
    TMaterialType,
    TProductModel,
    TBomList,
    TParameterList,
    TModifyRecord,
    TParameterScada,
    TParameterAnalysis,
    TLossTimeReport,
    TStateTimeOverview,
    TOEEReport,
    TTechnicalSupport,
    TProductionReport,
    TOEEAnalysis,
    TDA_Terminal
} from '../pages/index.js'
import ComponentsDemo from '../components/componentDemo'
const TabPane = Tabs.TabPane;

export default class TTabMain extends React.Component {

    constructor( props ) {
        super( props );
        this.newTabIndex = 0;
        const panes = [
            { title: '首页', key: 'THome', data: 'TMain' },
        ];
        this.state = {
            // activeKey: '',
            activeKey: panes[ 0 ].key,
            panes,
        };
    }

    onChange = ( activeKey ) => {
        this.setState( { activeKey } );
    }

    onEdit = ( targetKey, action ) => {
        this[ action ]( targetKey );
    }

    add = () => {
        const panes = this.state.panes;
        const activeKey = `newTab${this.newTabIndex++}`;
        panes.push( { title: 'nwe-' + panes.length + 1, data: 'TWorkShopList', key: activeKey } );
        // console.log('panes', panes );
        this.setState( { panes, activeKey } );
    }

    remove = ( targetKey ) => {
        let activeKey = this.state.activeKey;
        let lastIndex;
        this.state.panes.forEach( ( pane, i ) => {
            if ( pane.key === targetKey ) {
                lastIndex = i - 1;
            }
        } );

        // 罗世洲:添加 TMain过滤:首页不关闭
        if ( targetKey == 'THome' ) {
            return;
        }

        const panes = this.state.panes.filter( pane => pane.key !== targetKey );
        if ( lastIndex >= 0 && activeKey === targetKey ) {
            activeKey = panes[ lastIndex ].key;
        }
        this.setState( { panes, activeKey } );
    }

    clearTab(){
        const panes = this.state.panes.filter( pane => pane.key == 'THome' );
        // if ( lastIndex >= 0 && activeKey === targetKey ) {
        //     activeKey = panes[ lastIndex ].key;
        // }
        this.setState( { panes,activeKey: panes[ 0 ].key,} );
    }

    TPageOpen = ( key ) => { // 调用子组件方法获取孩子名字
        const panes = this.state.panes;
        const activeKey = key;
        let isRepeat = false;
        //panes.push({ title: 'New Tab', content: 'New Tab Pane', key: activeKey });
        //let newComponent = require('./THeader');
        //console.log("key in child");
        if ( panes.length <= 100 ) {
            panes.forEach( ( item, index ) => {
                if ( item.key == activeKey ) {
                    isRepeat = true;
                    return;
                }
            } )
            isRepeat == false ? panes.push( { title: '?', key: activeKey, data: '?' } ) : '';
        } else {
            //todo:切换当前激活的页面
        }
        this.setState( { panes, activeKey } );
        // console.log( 'panes', this.state.panes );
    }

    render() {
        const { content } = this.props;
        return (
            <div>
                {/* <div style={{ marginBottom: 16 }}>
                  <Button onClick={this.add}>ADD</Button>
                </div> */}
                <Tabs
                  hideAdd
                  onChange={this.onChange}
                  activeKey={this.state.activeKey}
                  type="editable-card"
                  onEdit={this.onEdit}
                  tabBarExtraContent={
                      (<span><Icon
                          type="close"
                          className="clearTabBottom"
                          onClick={this.clearTab.bind(this)}/></span>)
                  }
                >
                  {/* {this.state.panes.map(pane => <TabPane tab={pane.title} key={pane.key}>{pane.content}</TabPane>)} */}
                    {
                      this.state.panes.map(function(pane){
                        switch(pane.key){
                          case "THome":return <TabPane tab='首页' key={pane.key}><THome/></TabPane>; break;
                          case "TScadaWorkShop_Auto":
                            return(<TabPane tab='自动车间一' key={pane.key}>
                                    <TScadaWorkShop_Auto/>
                                </TabPane>);
                              break;
                          case "TScadaWorkShop_Auto2":
                              return(<TabPane tab='自动车间二' key={pane.key}>
                                    <TScadaWorkShop_Auto2/>
                                </TabPane>)
                                break;
                          case "TScada_CY":
                              return(<TabPane tab='冲压车间' key={pane.key}><TScadaPunchingworkshop/></TabPane>)
                            break;
                          case "TScada_ZS":
                              return(<TabPane tab='注塑车间' key={pane.key}><TScadaInjectionWorkshop/></TabPane>)
                            break;
                          case "TManufactureOrder":
                              return(<TabPane tab='订单管理' key={pane.key}>
                                      <TManufactureOrder/>
                                  </TabPane>);
                              break;
                          case "TManufactureTask":
                            return(<TabPane tab='任务排程' key={pane.key}>
                                    <TOrderScheduling/>
                                </TabPane>);
                            break;
                          case "TManufactureTaskDispatch":
                              return (<TabPane tab='生产派工' key={pane.key}>
                                          <TManufactureTaskDispatch/>
                                      </TabPane>);
                                      break;
                          case "TWorkShopType":
                            return (<TabPane tab='车间类别' key={pane.key}>
                                    <TWorkShopType/>
                                    </TabPane>);
                                    break;
                          case "TWorkShopList":
                            return <TabPane tab='车间列表' key={pane.key}><TWorkShopList/></TabPane>; break;
                          case "TWorkCenterType":
                          return <TabPane tab='工作中心类别' key={pane.key}><TWorkCenterType/></TabPane>; break;
                          case "TWorkCenter":
                          return <TabPane tab='工作中心' key={pane.key}><TWorkCenter detail={content}/></TabPane>; break;
                          case "TDeviceCategory":
                          return <TabPane tab='设备类别' key={pane.key}><TDeviceType/></TabPane>; break;
                          case "TDeviceModel":
                          return <TabPane tab='设备型号' key={pane.key}><TDeviceModel/></TabPane>; break;
                          case "TDeviceList":
                          return <TabPane tab='设备列表' key={pane.key}><TDeviceList/></TabPane>; break;
                          case "TMouldModel":
                          return <TabPane tab='模具列表' key={pane.key}><TMouldModel/></TabPane>; break;
                          case "TMouldList":
                          return <TabPane tab='模具型号' key={pane.key}><TMouldList/></TabPane>; break;
                          case "TMaterialType":
                          return <TabPane tab='物料类别' key={pane.key}><TMaterialType/></TabPane>; break;
                          case "TMaterialModel":
                          return <TabPane tab='物料型号' key={pane.key}><TMaterialModel/></TabPane>; break;
                          case "TProductModel":
                          return <TabPane tab='产品型号' key={pane.key}><TProductModel/></TabPane>; break;
                          case "TBomList":
                          return <TabPane tab='BOM管理' key={pane.key}><TBomList detail={content}/></TabPane>; break;
                          case "TWarningHistory":
                          return <TabPane tab='报警记录' key={pane.key}><TWarningHistory/></TabPane>; break;
                          case "TUserList":
                          return <TabPane tab='用户列表' key={pane.key}><TUserList detail={content}/></TabPane>; break;
                          case "TAuthList":
                          return <TabPane tab='权限列表' key={pane.key}><TAuthList detail={content}/></TabPane>; break;
                          case "TAuthGroupList":
                          return <TabPane tab='权限组管理' key={pane.key}><TAuthGroupList detail={content}/></TabPane>; break;
                          case "TWarningConfig":
                                return <TabPane tab='报警配置' key={pane.key}><TWarningConfig/></TabPane>; break;
                          case "TParameterList":
                                return <TabPane tab='参数列表' key={pane.key}><TParameterList/></TabPane>; break;
                          case "TModifyRecord":
                                return <TabPane tab='修改记录' key={pane.key}><TModifyRecord/></TabPane>; break;
                          case "TParameterScada":
                                return <TabPane tab='参数监控' key={pane.key}><TParameterScada/></TabPane>; break;
                          case "TParameterAnalysis":
                                return <TabPane tab='参数分析' key={pane.key}><TParameterAnalysis/></TabPane>; break;
                          case "TLossTimeReport":
                                return <TabPane tab='损失时间报表' key={pane.key}><TLossTimeReport/></TabPane>; break;
                          case "TTimeStatusReport":
                                return <TabPane tab='时间状态报表' key={pane.key}><TStateTimeOverview/></TabPane>; break;
                          case "TReportOEE_General":
                                return <TabPane tab='OEE报表' key={pane.key}><TOEEReport/></TabPane>; break;
                          case "TProductionReport":
                                return <TabPane tab='生产报表' key={pane.key}><TProductionReport/></TabPane>; break;
                          case "TOEEAnalysis":
                                return <TabPane tab='OEE分析报表' key={pane.key}><TOEEAnalysis/></TabPane>; break;
                          case "TAboutSupport":
                                return <TabPane tab='技术支持' key={pane.key}><TTechnicalSupport/></TabPane>; break;
                          case "TDA_Terminal":
                                return <TabPane tab='终端管理' key={pane.key}><TDA_Terminal/></TabPane>; break;
                          case "TDemo":
                                return <TabPane tab='组件DEMO' key={pane.key}><ComponentsDemo/></TabPane>; break;
                          default:return <TabPane tab='未知' key={pane.key}></TabPane>;
                       }
                     })
                    }
                </Tabs>
            </div>
        );
    }

}
