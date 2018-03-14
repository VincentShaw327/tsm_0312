/**
 *这是设备列表页
 *添加日期:2017.12.20
 *添加人:bhm
 **/
/******引入ant或其他第三方依赖文件*******************/
import React, {Component} from 'react'
import {browserHistory} from 'react-router'
import {Link} from 'dva/router';
import {Connector} from 'mqtt-react';
import {
	Layout,
	Tree,
	Table,
	Tabs,
	Button,
	Card,
	Menu,
	Icon,
	Modal,
	Row,
	Col,
	Pagination,
	Badge,
	Dropdown,
	Progress,
	Breadcrumb,
	Radio,
	Divider,
	Tag
} from 'antd';
/***  react 第三方 数据处理函数库  ***/
import { is, fromJS } from 'immutable';

var mqtt = require('mqtt')  //mqtt包导入

const {Header, Footer, Sider, Content} = Layout
const RadioGroup = Radio.Group;
const TreeNode = Tree.TreeNode
const TabPane = Tabs.TabPane
const SubMenu = Menu.SubMenu
const MenuItemGroup = Menu.ItemGroup
const confirm = Modal.confirm

/**   控制this作用域指针   **/
let self
let _storage = window.localStorage;

//mqtt消息连接建立
var client  = mqtt.connect('mqtt://47.91.154.238:9011')

export default class App extends Component {

	constructor(props) {
		super(props)
		this.state = {
			//单台机台数据状态
			Equip: this.props.Equip
		}

		self = this;
	}

    // shouldComponentUpdate(nextProps, nextState) {
    //     let thisEquip = fromJS(this.props.Equip)
    //     let nextEquip = fromJS(nextState.Equip)
    //     // console.log('this.props.Equip === nextProps.Equip=================', this.props.Equip === nextProps.Equip)
	// 	if(this.props.Equip.ID == 'HDMI-STATION-002'){
	// 		console.log('============HDMI-STATION-002===================', thisEquip.get('Badge'), '==================', thisEquip.get('prod_count'))
	// 		console.log('===========HDMI-STATION-002====================', nextEquip.get('Badge'), '==================', nextEquip.get('prod_count'))
	// 		console.log('===========HDMI-STATION-002====================', is(thisEquip, nextEquip))
    //
	// 	}
    //     if (is(thisEquip, nextEquip)) {
    //       return false;
    //     } else {
    //       return true;
    //     }
    // }

	render() {

        return (
            <Card key={self.state.Equip.key} className={self.state.Equip.style}
                  style={{ margin: '0.5% 0 0 0.5%', borderRadius: '3%' }}
                  bodyStyle={{ padding: '11px 4px 4px 0px' }}>
                <div className="custom-card">
                    <Row>
                        <Col span={16} offset={1}>
                            <Row>
                                <Col span={9}>
                                    <ul className="top-param-sty" style={{
                                        color: '#777777e0'
                                    }}>
                                        <li style={{
                                            textAlign: 'right'
                                        }}>工作中心 :&nbsp;&nbsp;
                                        </li>
                                        <li style={{
                                            textAlign: 'right'
                                        }}><Badge status={self.state.Equip.Badge} />订单号 :&nbsp;&nbsp;
                                        </li>
                                        <li style={{
                                            textAlign: 'right'
                                        }}>产品名称 :&nbsp;&nbsp;</li>
                                        <li style={{
                                            textAlign: 'right'
                                        }}>产&nbsp;&nbsp;&nbsp;量 :&nbsp;&nbsp;</li>
                                        <li style={{
                                            textAlign: 'right'
                                        }}>产&nbsp;&nbsp;&nbsp;能 :&nbsp;&nbsp;</li>
                                    </ul>
                                </Col>
                                <Col span={15}>
                                    <div className="custom-image">
                                        <ul className="top-param-sty">
                                            <li style={{
                                                color: 'rgba(0, 0, 0, 0.52)',
                                                fontWeight: 'bold'
                                            }}>{self.state.Equip.Name || '-'}</li>
                                            <li style={{
                                                fontSize: '14px',
                                                fontWeight: 'bold'
                                            }}> {self.state.Equip.task_no || '-'}</li>

                                            <li style={{
                                                color: 'rgba(0, 0, 0, 0.52)',
                                                fontWeight: 'bold'
                                            }}>{self.state.Equip.task_name || '-'}</li>
                                            <li style={{
                                                color: 'rgba(0, 0, 0, 0.52)',
                                                fontWeight: 'bold'
                                            }}>{self.state.Equip.prod_count || '-'}
                                                pcs</li>
                                            <li style={{
                                                color: 'rgba(0, 0, 0, 0.52)',
                                                fontWeight: 'bold'
                                            }}>{self.state.Equip.prod_rate || '-'}
                                                pcs/min</li>
                                        </ul>
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={7}>
                            <div className="custom-image" style={{
                                textAlign: 'center'
                            }}>
                                <ul className="top-param-sty" style={{
                                }}>
                                    {/* <li style={{ marginBottom: '6px' }}>
                                        <span className='devicelight'></span>
                                    </li> */}
                                    <li style={{}}>
                                        <Progress type="dashboard" width={55} percent={parseInt(self.state.Equip.task_progress || 0)} strokeWidth={8}/>
                                    </li>
                                    <li style={{lineHeight: '35px'}}>
                                        &nbsp;
                                    </li>
                                    <li style={{
                                        fontSize: '12px'
                                    }}>
                                        {
                                            parseInt(self.state.Equip.task_progress || 0) >= 100
                                            ? '已完成'
                                            : self.state.Equip.Status == '1'
                                                ? <Tag color="rgba(82, 196, 26, 0.84)" style={{marginRight: '0', fontSize: 'larger'}}>生产中</Tag>
                                                : self.state.Equip.Status == '2' ? <Tag color="#ffc069" style={{marginRight: '0', fontSize: 'larger'}}>告警</Tag>
                                                : <Tag color="#bfbfbf" style={{marginRight: '0', fontSize: 'larger'}}>待机</Tag>
                                        }
                                        &nbsp;&nbsp;
                                    </li>
                                </ul>
                            </div>
                        </Col>
                    </Row>
                </div>
            </Card>
        )
	}
}
