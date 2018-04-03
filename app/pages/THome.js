import React, {Component} from 'react';
import {List,Card,message,Tooltip,Icon,Tabs,
    DatePicker,Row,Col,Divider} from 'antd';
import ReactEcharts from 'echarts-for-react';
import styles from "./THome.less";
const TabPane = Tabs.TabPane;
import moment from 'moment';
// import echarts from 'echarts';
import G2 from '@antv/g2';
const {MonthPicker, RangePicker} = DatePicker;

// import {NumberCard} from "../components/ChartCards";

export default class THome extends Component {
    // 初始化页面常量 绑定事件方法
    constructor(props, context) {
        super(props)
        this.state = {
            key: 0,
            option: {}
        }
        this.orderRenderData = {};
    }

    componentWillMount() {}

    // 组件已经加载到dom中
    componentDidMount() {

        // var plotHeight = (window.innerHeight - 180) / 4;
        var plotHeight =38,
            chartWidth=40;
        var c0Types = [ 'interval','line','area' ];
        var c0Data = [
            [
                16, 17, 18, 19, 20, 21, 21, 22, 23, 22,
                19, 20, 20, 21
            ],
            [
                 936, 968, 1025, 999, 998, 1014, 1017, 1010, 1010, 1007,
                 1004, 988, 1005, 958, 953
            ],
            [
                71, 70, 69, 68, 65, 60, 55, 55, 50, 52,
                73, 72, 72, 71, 68, 63, 57, 58, 53, 55,
                63, 59, 61, 64, 58, 53, 48, 48, 45, 45,
                63, 64, 63, 67, 58, 56, 53, 59, 51, 54
            ]
        ];
        c0Data.forEach(function (values, index) {
            var data = values.map(function (value, i) {
                return {
                    x: '' + i,
                    y: value
                };
            });
            var chart = new G2.Chart({
                container: 'miniChart' + index,
                forceFit: true,
                height: plotHeight,
                width:chartWidth,
                padding: 0
            });
            chart.source(data);
            chart.axis(false);
            chart.legend(false);
            chart.tooltip({
                showTitle: false,
            });
            chart[c0Types[index]]()
                .position('x*y');
            chart.render();
        });
        /**************************************/
        const chartOption = {
            xAxis: {
                type: 'category',
                data: [
                    'Mon',
                    'Tue',
                    'Wed',
                    'Thu',
                    'Fri',
                    'Sat',
                    'Sun'
                ]
            },
            yAxis: {
                type: 'value',
                // positon:'right',
                offset: 0
            },
            series: [
                {
                    data: [
                        120,
                        200,
                        150,
                        80,
                        70,
                        110,
                        130
                    ],
                    type: 'bar'
                }
            ]
        };
        this.setState({option: chartOption})
        var option = {
            xAxis: {
                type: 'category',
                data: [
                    'Mon',
                    'Tue',
                    'Wed',
                    'Thu',
                    'Fri',
                    'Sat',
                    'Sun'
                ]
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    data: [
                        120,
                        200,
                        150,
                        80,
                        70,
                        110,
                        130
                    ],
                    type: 'bar'
                }
            ]
        };
        // 使用刚指定的配置项和数据显示图表。
        // myChart.setOption(option);
        // window.onresize=()=>{console.log('onresize');}
        /**************************************/
        const data = [
            {
                year: '1951 年',
                sales: 38
            }, {
                year: '1952 年',
                sales: 52
            }, {
                year: '1956 年',
                sales: 61
            }, {
                year: '1957 年',
                sales: 145
            }, {
                year: '1958 年',
                sales: 48
            }, {
                year: '1959 年',
                sales: 38
            }, {
                year: '1960 年',
                sales: 38
            }, {
                year: '1962 年',
                sales: 38
            }
        ];
        const chart = new G2.Chart({
            container: 'tend-charts', forceFit: true,
            // height: window.innerHeight
        });
        chart.source(data);
        chart.scale('sales', {tickInterval: 20});
        chart.interval().position('year*sales');
        chart.render();

    }

    onTabChange = (key, type) => {
        console.log(key, type);
        this.setState({[type]: key});
    }

    render() {

        const tabList = [
            {
                key: 'tab1',
                tab: '订单量'
            }, {
                key: 'tab2',
                tab: '返货量'
            }
        ];

        const contentList = {
            tab1: <p>content1</p>,
            tab2: <p>content2</p>
        };

        const data = [
            {
                title: '总产量',
                content: () => {
                    return (
                        <div>
                            <div style={{fontSize:25,color:'#000000'}}>
                                223433<span style={{marginLeft:8}}>pcs</span>
                            </div>
                            <div>周同比<span style={{marginLeft:8}}>12%<Icon style={{color:'#f01212'}} type="caret-up" /></span></div>
                            <div>日同比<span style={{marginLeft:8}}>11%<Icon type="caret-down" /></span></div>
                        </div>
                    )
                },
                footer:()=>{
                    return(
                        <div>
                            日均产量<span>234</span><span>pcs</span>
                        </div>
                    )
                }
            },
            {
                title: '出货量',
                content: () => {
                    return (
                        <div>
                            <div style={{fontSize:25,color:'#000000'}}>3451</div>
                            <div style={{width:200}} id="miniChart0"></div>
                        </div>
                    )
                },
                footer:()=>{
                    return(
                        <div>
                            日订单量<span>234</span><span>pcs</span>
                        </div>
                    )
                }
            },
            {
                title: '良品量',
                content: () => {
                    return (
                        <div>
                            <div style={{fontSize:25,color:'#000000'}}>351</div>
                            <div style={{width:200}} id="miniChart1"></div>
                        </div>
                    )
                },
                footer:()=>{
                    return(
                        <div>
                            日均良品率<span>93</span><span>%</span>
                        </div>
                    )
                }
            },
            {
                title: '机器故障率',
                content: () => {
                    return (
                        <div>
                            <div style={{fontSize:25,color:'#000000'}}>3%</div>
                            <div id="miniChart2"></div>
                        </div>
                    )
                },
                footer:()=>{
                    return(
                        <div>
                            故障率<span>3</span><span>%</span>
                        </div>
                    )
                }
            }
        ];

        const rankingList = ['HDMI端子', 'USB2.0', '光纤端子', 'RGB6Pin音视频端子', 'RGB3Pin音视频端子'];

        const ExtraContent = (<div className="home-order-extra">
            <div className="order-extra-cycle">
                <a className="cycle-item">今日</a>
                <a className="cycle-item">本周</a>
                <a className="cycle-item">本月</a>
                <a className="cycle-item">全年</a>
            </div>
            <RangePicker defaultValue={[
                    moment('2015/01/01', dateFormat),
                    moment('2015/01/01', dateFormat)
                ]} format={dateFormat}/>
        </div>);

        const dateFormat = 'YYYY/MM/DD';

        const orderContent = (<div className="order-tend">
            <Row>
                <Col span={18}>
                    <div className="tend-charts" id="tend-charts">
                        {/* <ReactEcharts
                    className='react_for_echarts'
                    option={this.state.option}
                    lazyUpdate={true}
                    style={{height:350,border:'solid 0px'}}
                    /> */
                        }
                    </div>
                </Col>
                <Col span={6}>
                    <div className="ranking">
                        <List size="small" header={<div> 产品订单排名</div>}
                            // footer={<div>Footer</div>}
                            bordered="bordered" dataSource={rankingList} renderItem={(item, index) => (<List.Item>
                                <span style={{
                                        marginRight: 8
                                    }}>{index}</span>
                                {item}
                            </List.Item>)}/>
                    </div>
                </Col>
            </Row>
            {/* <div className="tend-charts">
              </div> */
            }
        </div>)

        return (<div className="home-content">
            <List grid={{
                    gutter: 16,
                    xs: 1,
                    sm: 2,
                    md: 2,
                    lg: 4,
                    xl: 4,
                    xxl: 4
                }} dataSource={data} renderItem={item => (<List.Item>
                    <Card bodyStyle={{
                            // height: 150
                        }}>
                        <p>{item.title}</p>
                        <div>
                            {item.content && item.content()}
                        </div>
                        <Divider/>
                        <div>
                            {item.footer&&item.footer()}
                        </div>
                    </Card>
                </List.Item>)}/>
            <Card style={{width: '100%'}}
                // title={ExtraContent}
                // extra={ExtraContent}
                // tabList={tabList}
                // onTabChange={(key) => { this.onTabChange(key, 'key'); }}
              >
                {/* {contentList[this.state.key]} */}
                <Tabs tabBarExtraContent={ExtraContent} defaultActiveKey="1">
                    <TabPane tab="订单量" key="1">
                        {orderContent}
                    </TabPane>
                    <TabPane tab="返货量" key="2">Content of Tab Pane 2</TabPane>
                </Tabs>
            </Card>
        </div>)
    }
}
