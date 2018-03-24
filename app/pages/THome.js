import React, {Component} from 'react';
import {
    List,
    Card,
    message,
    Tooltip,
    Icon,
    Tabs,
    DatePicker,
    Row,
    Col
} from 'antd';
import ReactEcharts from 'echarts-for-react';
import styles from "./THome.less";
const TabPane = Tabs.TabPane;
import moment from 'moment';
import echarts from 'echarts';
import G2 from '@antv/g2';
// echarts = require('echarts');
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

        // 基于准备好的dom，初始化echarts实例
        // var myChart = echarts.init(document.getElementById('tend-charts'));
        // 指定图表的配置项和数据
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
                title: '总设备数',
                /*content:()=>{
                    var options = {
                        title : {
                            text: '状态统计分布',
                            subtext: '纯属虚构',
                            x:'right'
                        },
                        tooltip: {
                            trigger: 'item',
                            formatter: "{a} <br/>{b} : {c} ({d}%)"
                        },
                        legend: {
                            orient: 'vertical',
                            left: 'left',
                            data: [ '停机中', '运行中', '报警中' ]
                        },
                        series: [
                            {
                                name: '访问来源',
                                type: 'pie',
                                radius: '55%',
                                center: [ '50%', '60%' ],
                                data: [
                                    { value: 3, name: '停机中' },
                                    { value: 6, name: '运行中' },
                                    { value: 1, name: '报警中' },
                                ],
                                itemStyle: {
                                    emphasis: {
                                        shadowBlur: 10,
                                        shadowOffsetX: 0,
                                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                                    }
                                }
                            }
                        ]
                    };

                    return(<ReactEcharts
                        option={options}
                        style={{height:200,width:'90%'}}
                        className='react_for_echarts' />)
                }*/
                content: () => {
                    return (<div>
                        <p>生产订单</p>
                    </div>)
                }
            }, {
                title: 'Title 2',
                content: () => {
                    return (<div>
                        <p>出货量</p>
                    </div>)
                }
            }, {
                title: 'Title 3',
                content: () => {
                    return (<div>
                        <p>返货量</p>
                    </div>)
                }
            }, {
                title: 'Title 4',
                content: () => {
                    return (<div>
                        <p>次品量</p>
                    </div>)
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
                    sm: 1,
                    md: 1,
                    lg: 4,
                    xl: 4,
                    xxl: 4
                }} dataSource={data} renderItem={item => (<List.Item>
                    <Card bodyStyle={{
                            height: 150
                        }}>
                        {item.content && item.content()}
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
