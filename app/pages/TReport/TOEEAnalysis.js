import React, { Component } from 'react'
import { message, Menu, Icon, Row, Col, Card, Table, Divider, DatePicker,Button} from 'antd'
import { TPostData } from '../../utils/TAjax';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
const { MonthPicker, RangePicker } = DatePicker;
import ReactEcharts from 'echarts-for-react';

export default class TOEEAnalysis extends Component {
    constructor( props, context ) {
        super( props )
        this.state = {
            workshopList: [],
            workCenterList: []
        }
        // this.handleMenuClick.bind(this);
        // this.getWorkCenter.bind(this);
        this.url = '/api/TFactory/workshop';
        // this.workshopList =[];
        // this.getUserInfo = this.getUserInfo.bind(this)
    }

    componentWillMount() {
        const dat = {
            PageIndex: 0, //分页：页序号，不分页时设为0
            PageSize: -1, //分页：每页记录数，不分页时设为-1
            FactoryUUID: -1, //所属工厂UUID，不作为查询条件时取值设为-1
            TypeUUID: -1, //类型UUID，不作为查询条件时取值设为-1
            KeyWord: ""
        }
        TPostData( this.url, "ListActive", dat,
            ( res ) => {
                var list = [];
                console.log( "查询到车间列表", res );
                var data_list = res.obj.objectlist || [];
                data_list.forEach( ( item, index ) => {
                    list.push( {
                        key: index,
                        UUID:item.UUID,
                        Name: item.Name,
                        Number: item.ID
                    } )
                    this.setState( { workshopList: list } )
                } )
            },
            ( error ) => {
                message.info( error );
            }
        )

        this.getWorkCenter();
    }

    // 组件已经加载到dom中
    componentDidMount() {

    }

    getWorkCenter(UUID){
        TPostData('/api/TProcess/workcenter', "ListActive",
            { 'PageIndex': 0, 'PageSize': -1,WorkshopUUID:UUID?UUID:-1, 'TypeUUID': -1, KeyWord:'' },
            ( res )=> {
                var list = [];
                var Ui_list = res.obj.objectlist || [];
                // console.log( '查询到工作中心列表', Ui_list );
                Ui_list.forEach(( item, index )=> {
                    list.push( {
                        key: index,
                        Name: item.Name,
                        ID: item.ID,
                        Time:"64%",
                        Performance:"67%",
                        Quality:"46%",
                        OEE:"53%",
                        // WorkshopName: item.WorkshopName,
                        // UUID: item.UUID,
                        // TypeUUID: item.TypeUUID.toString(),
                        // WorkshopUUID: item.WorkshopUUID.toString(),
                    } )
                    this.setState( { workCenterList: list } )
                } )
            },
            ( error )=> {
                message.info( error );
            }
        )
    }

    handleMenuClick({ item, key, keyPath }){
        console.log("点击菜单之后",item,key,keyPath);
        this.getWorkCenter(key);
    }

    render() {

        const columns = [
            {
                title: '工作中心',
                dataIndex: 'Name',
                key: 'name',
                // render: text => <a href="#">{text}</a>,
            },
            {
                title: '工作中心编号',
                dataIndex: 'ID',
                key: 'ID',
            },
            {
                title: '时间稼动率(%)',
                dataIndex: 'Time',
                key: 'Time',
            },
            {
                title: '性能稼动率(%)',
                dataIndex: 'Performance',
                key: 'Performance',
            },
            {
                title: '良品率(%)',
                dataIndex: 'Quality',
                key: 'Quality',
            },
            {
                title: 'OEE(%)',
                dataIndex: 'OEE',
                key: 'OEE',
            },
            {
                title: '操作',
                key: 'action',
                render: ( text, record ) => (
                    <span>
                      <a href="#">详情{record.name}</a>
                      <Divider type="vertical" />
                      <a href="#">删除</a>
                      <Divider type="vertical" />
                      <a href="#" className="ant-dropdown-link">
                        更多 <Icon type="down" />
                      </a>
                    </span>
                ),
            }
        ];

        const data = [
            {
                key: '1',
                name: 'John Brown',
                age: 32,
                address: 'New York No. 1 Lake Park',
            },
            {
                key: '2',
                name: 'Jim Green',
                age: 42,
                address: 'London No. 1 Lake Park',
            },
            {
                key: '3',
                name: 'Joe Black',
                age: 32,
                address: 'Sidney No. 1 Lake Park',
            }
        ];

        const chartOne = {
            tooltip : {
                formatter: "{a} <br/>{b} : {c}%"
            },
            toolbox: {
                feature: {
                    // restore: {},
                    // saveAsImage: {}
                }
            },
            series: [
                {
                    name: '业务指标',
                    type: 'gauge',
                    detail: {formatter:'{value}%'},
                    data: [{value: 56, name: '时间稼动率'}]
                }
            ]
        };

        const chartTwo = {
            tooltip : {
                formatter: "{a} <br/>{b} : {c}%"
            },
            toolbox: {
                feature: {
                    // restore: {},
                    // saveAsImage: {}
                }
            },
            series: [
                {
                    name: '业务指标',
                    type: 'gauge',
                    detail: {formatter:'{value}%'},
                    data: [{value: 61, name: '性能稼动率'}]
                }
            ]
        };

        const chartThree = {
            tooltip : {
                formatter: "{a} <br/>{b} : {c}%"
            },
            toolbox: {
                feature: {
                    // restore: {},
                    // saveAsImage: {}
                }
            },
            series: [
                {
                    name: '业务指标',
                    type: 'gauge',
                    detail: {formatter:'{value}%'},
                    data: [{value: 87, name: '良品率'}]
                }
            ]
        };

        const chartFour = {
            tooltip : {
                formatter: "{a} <br/>{b} : {c}%"
            },
            toolbox: {
                feature: {
                    // restore: {},
                    // saveAsImage: {}
                }
            },
            series: [
                {
                    name: '业务指标',
                    type: 'gauge',
                    detail: {formatter:'{value}%'},
                    data: [{value: 67, name: 'OEE'}]
                }
            ]
        };

        return (
            <div>
                <Row gutter={16}>
                  <Col className="gutter-row" span={4} style={{border:'solid 0px'}}>
                      <div className="gutter-box">
                          <Menu
                              onClick={this.handleMenuClick.bind(this)}
                              style={{ width: '100%' }}
                              // defaultSelectedKeys={[this.state.workshopList[0].UUID]}
                              // defaultOpenKeys={[this.state.workCenterList[0].UUID]}
                              mode="inline"
                              >
                                  {
                                      this.state.workshopList.map((item,index)=>{
                                          return(<Menu.Item key={item.UUID}>{item.Name}</Menu.Item>)
                                      })
                                  }
                             </Menu>
                      </div>
                  </Col>
                  <Col className="gutter-row" span={20}>
                      <div className="gutter-box">
                            <Row>
                                <Col span={7}>
                                    <Menu
                                        // onClick={this.handleClick}
                                        // selectedKeys={[this.state.current]}
                                        style={{lineHeight:'30px'}}
                                        mode="horizontal"
                                        >
                                        <Menu.Item key="mail">
                                            <Icon type="appstore" />今日
                                        </Menu.Item>
                                        <Menu.Item key="app">
                                            <Icon type="appstore" />本周
                                        </Menu.Item>
                                        <Menu.Item key="alipay">
                                            <Icon type="appstore" />本月
                                        </Menu.Item>
                                    </Menu>
                                </Col>
                                <Col span={5}>
                                    <RangePicker />
                                </Col>
                                <Col span={3}>
                                    <Button>查询</Button>
                                </Col>
                            </Row>
                          <Card>
                                {/* <Divider /> */}
                              <Card style={{ marginBottom:30}}>
                                  <Row>
                                    <Col span={6}>
                                        <ReactEcharts
                                            option={chartOne}
                                            // style={{height:250}}
                                            className='react_for_echarts' />
                                    </Col>
                                    <Col span={6}>
                                      <ReactEcharts
                                          option={chartTwo}
                                          // style={{height:200}}
                                          className='react_for_echarts' />
                                    </Col>
                                    <Col span={6}>
                                      <ReactEcharts
                                          option={chartThree}
                                          // style={{height:200}}
                                          className='react_for_echarts' />
                                    </Col>
                                    <Col span={6}>
                                      <ReactEcharts
                                          option={chartFour}
                                          // style={{height:200}}
                                          className='react_for_echarts' />
                                    </Col>
                                  </Row>
                              </Card>
                              <Table
                                  columns={columns}
                                  dataSource={this.state.workCenterList}
                                  bordered={true}
                                  size="small"
                              />
                          </Card>
                      </div>
                  </Col>
                </Row>
            </div>
        )
    }
}
