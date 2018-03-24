/**
 *这是设备列表页
 *添加日期:2017.12.06
 *添加人:shaw
 **/
/******引入ant或其他第三方依赖文件*******************/
import React, { Component } from 'react';
import { Button, Radio, Row, Col, Divider, List, Timeline, Menu, Card, DatePicker } from 'antd';
import FeatureSetConfig from '../../components/TCommon/shawCommon/tableConfig';
import { TPostData, urlBase } from '../../utils/TAjax';
import StatusOverview from './components/statusOverview';
import TimeLine from './components/timeLine';
import Mock from 'mockjs';
import ReactEcharts from 'echarts-for-react';

let seft
let Feature
let creatKeyWord;
let MtrlTpList = []


export default class App extends Component {

    constructor( props ) {
        super( props )
        this.state = {
            server: this.props.server,
            loading: false,
            workshopList: [],
            workCenterList: [],
            Dailychart: {},
            cardContent: 'timeLine'
        }
        seft = this;
    }

    componentWillMount() {
        this.getWorkCenterList();
        // this.Dailychart = FeatureSetConfig( graph_conf );
        // this.setState({Dailychart:FeatureSetConfig( graph_conf )});
        this.getWorkshopList();
    }

    getWorkshopList() {

        const dat = {
            PageIndex: 0, //分页：页序号，不分页时设为0
            PageSize: -1, //分页：每页记录数，不分页时设为-1
            FactoryUUID: -1, //所属工厂UUID，不作为查询条件时取值设为-1
            TypeUUID: -1, //类型UUID，不作为查询条件时取值设为-1
            KeyWord: ""
        }
        TPostData( '/api/TFactory/workshop', "ListActive", dat,
            ( res ) => {
                var list = [];
                console.log( "查询到车间列表", res );
                var data_list = res.obj.objectlist || [];
                data_list.forEach( ( item, index ) => {
                    list.push( {
                        key: index,
                        UUID: item.UUID,
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

    }

    getWorkCenterList() {
        var dat = {
            'PageIndex': 0,
            'PageSize': -1,
            WorkshopUUID: 1,
            'TypeUUID': -1
        }
        TPostData( '/api/TProcess/workcenter', "ListActive", dat,
            ( res ) => {
                var list = [];
                var Ui_list = res.obj.objectlist || [];
                console.log( '查询到工作中心列表', Ui_list );
                Ui_list.forEach( ( item, index ) => {
                    /*list.push( {
                        key: index,
                        ID: item.ID,
                        UUID: item.UUID,
                        Name: item.Name,
                    } )*/
                    list.push( item.Name );
                } )
                this.setState( { workCenterList: list } )
            },
            ( error ) => {
                message.info( error );
            }
        )
    }

    handleMenuClick( { item, key, keyPath } ) {
        console.log( "点击菜单之后", item, key, keyPath );
        // this.getWorkCenter(key);
    }

    handleToggle = ( e ) => {
        // this.setState({ size: e.target.value });
        console.log( e.target.value );
        if ( e.target.value == "overView" ) this.setState( { cardContent: "overView" } );
        else if ( e.target.value == "timeLine" ) this.setState( { cardContent: "timeLine" } );
    }

    render() {
        // console.log( "工作中心列表是:",this.state.workCenterList );
        let option1 = {
            tooltip: {
                trigger: 'axis',
                axisPointer: { // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            legend: {
                data: [ '离线', '待机', '运行中', '报警' ]
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'value',
                axisLabel: {
                    formatter: function ( value, index ) {
                        // 格式化成月/日，只在第一个刻度显示年份
                        /*var date = new Date(value);
                        var texts = [(date.getMonth() + 1), date.getDate()];
                        if (index === 0) {
                            texts.unshift(date.getYear());
                        }*/
                        // return texts.join('/');
                        let t = Math.floor( value / 60 );
                        let min = value % 60;
                        if ( min < 10 ) min = '0' + min;
                        if ( t < 10 ) t = '0' + t;
                        return `${t}:${min}`;
                    }
                }
            },
            yAxis: {
                type: 'category',
                // data: [ '周一', '周二', '周三', '周四', '周五', '周六', '周日' ]
                data: this.state.workCenterList
            },
            series: [
                {
                    name: '离线',
                    type: 'bar',
                    stack: '总量',
                    label: {
                        normal: {
                            show: true,
                            position: 'insideRight'
                        }
                    },
                    data: [ 482, 102, 131, 34, 90, 30, 20, 136, 86, 39, 29, 482, 482, 482, 482 ],
                },
                {
                    name: '待机',
                    type: 'bar',
                    stack: '总量',
                    label: {
                        normal: {
                            show: true,
                            position: 'insideRight'
                        }
                    },
                    data: [ 120, 132 ]
                },
                {
                    name: '运行中',
                    type: 'bar',
                    stack: '总量',
                    label: {
                        normal: {
                            show: true,
                            position: 'insideRight'
                        }
                    },
                    data: [ 630, 680, 680, 680 ]
                },
                {
                    name: '报警',
                    type: 'bar',
                    stack: '总量',
                    label: {
                        normal: {
                            show: true,
                            position: 'insideRight'
                        }
                    },
                    data: []
                }
            ]
        };

        const toggleView=this.state.cardContent;
        const data = [
            {
                title: '洪模具,',
                time: '16:32:45',
                space: 4,
                status: 1
            },
            {
                title: '等模具/改制顶杆,',
                time: '17:54:15',
                space: 20,
                status: 1
            },
            {
                title: '电加热故障,',
                time: '18:32:17',
                space: 6,
                status: 0
            },
            {
                title: '调换产品,',
                time: '19:42:22',
                space: 14,
                status: 1
            },
            {
                title: '斜模调整,',
                time: '22:46:05',
                space: 23,
                status: 0
            },
            {
                title: '钢印调整/更换,',
                time: '07:31:11',
                space: 12,
                status: 2
            },
            {
                title: '模具损坏/更换,',
                time: '19:52:51',
                space: 7,
                status: 2
            },
        ];
        const pagination = {
            total: 12,
            pageSize: 5,
            onChange: function ( num ) {
                self.setState( {
                    loading: true
                } )
                self.getpageData( num )
            }
        }

        const titleContent = (
            <div>
                <p>工作中心状态预览</p>
                <Row>
                    <Col span={6}>
                        <Radio.Group value={toggleView}  onChange={this.handleToggle}>
                            <Radio.Button value="timeLine">时间轴</Radio.Button>
                            <Radio.Button value="overView">状态统计</Radio.Button>
                            {/* <Radio.Button value="small">Small</Radio.Button> */}
                        </Radio.Group>
                    </Col>
                    <Col span={18}>日期:
                        <DatePicker  />
                    </Col>
                </Row>
            </div>
        )


        return (
            <div>
                {/* <Divider>状态统计</Divider> */}
                <Row gutter={16}>
                  <Col span={4}>
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
                  </Col>
                  <Col className="gutter-row" span={19}>
                    <div className="gutter-box">
                        <Card title={titleContent}>
                            {/* <ReactEcharts
                                option={option1}
                                style={{height:550}}
                                className='react_for_echarts' /> */}
                            {
                                this.state.cardContent=="timeLine"?
                                <StatusOverview workCenterList={this.state.workCenterList} />:
                                <TimeLine workCenterList={this.state.workCenterList} />
                            }
                        </Card>
                    </div>
                  </Col>
                  <Col className="gutter-row" span={1}>
                    <div className="gutter-box">
                        {/* <Timeline>
                            {
                                data.map((item,index)=>{
                                    let circleColor='';
                                    if(item.status==1)circleColor="green"
                                    else if(item.status==0)circleColor="red"
                                    else if(item.status==2)circleColor="blue"
                                    return(
                                        <Timeline.Item  color={circleColor}><span>{item.title}</span><span>{item.time}</span></Timeline.Item>);
                                })
                            }
                        </Timeline> */}
                    </div>
                  </Col>
                </Row>
                {/* <Divider>设备状态日志</Divider>
                <div style={{height: '240px',overflowX: 'auto',}}>
                    <Feature/>
                </div> */}
                {/* <Collapse bordered={false} defaultActiveKey={['1']} >
                    <Panel key="1" header="OEE统计图表" style={{borderRadius: '4px',border: '0',overflow: 'hidden',fontSize: '12px'}}>
                    </Panel>
                </Collapse> */}
            </div>
        )
    }
}
