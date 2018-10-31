import React, {Component} from 'react';
import {List,Card,message,Tooltip,Icon,Tabs,
    DatePicker,Row,Col,Divider,Form,Spin} from 'antd';
import ReactEcharts from 'echarts-for-react';
import styles from "./THome.less";
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
import moment from 'moment';
// import echarts from 'echarts';
import G2 from '@antv/g2';
const {MonthPicker, RangePicker} = DatePicker;
import { Bar} from 'components/ant-design-pro/Charts';
import { TPostData, urlBase,TAjax } from '../../utils/TAjax';
import PageHeaderLayout from 'base/PageHeaderLayout';

// import {NumberCard} from "../components/ChartCards";

export default class THome extends Component {
    // 初始化页面常量 绑定事件方法
    constructor(props, context) {
        super(props)
        let startDate=(new Date().getFullYear())+'-01-01';
        // let startDate='2017-01-01';
        this.state = {
            option: {},
            monthOrderList:[],
            dayOrderList:[],
            mode:['month','month'],
            loading:true,
            Date_month:true,
            // MSDate:moment(startDate).format('YYYY.MM'),
            MSDate:moment((new Date().getTime()) - (1000 * 60 * 60 * 24*30*12)).format('YYYY.MM.'),
            MEDate:moment().format('YYYY.MM'),
            Start_Day:moment((new Date().getTime()) - (1000 * 60 * 60 * 24*30)).format('YYYY.MM.DD'),
            End_Day:moment().format('YYYY.MM.DD')
        }
    }

    componentWillMount() {
        this.getMonthOrderNum();
        this.getDayOrderNum();
    }

    // 组件已经加载到dom中
    componentDidMount() {
        // this.getMonthOrderNum();
        // this.getDayOrderNum();
        // var plotHeight = (window.innerHeight - 180) / 4;
        // var plotHeight =38,
        //     chartWidth=40;
        // var c0Types = [ 'interval','line','area' ];
        /*var c0Data = [
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
        });*/
        /**************************************/
        /*const chartOption = {
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
        };*/
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
        /*const chart = new G2.Chart({
            container: 'tend-charts', forceFit: true,
            // height: window.innerHeight
        });
        chart.source(data);
        chart.scale('sales', {tickInterval: 20});
        chart.interval().position('year*sales');
        chart.render();*/
    }

    getMonthOrderNum=()=>{
        const{MSDate,MEDate}=this.state;
        var dat = {
            Type:2,
            StartDate:MSDate,
            EndDate:MEDate                                                  // 是否插单
        }
        console.log('MonthOrder_dat',dat)
        TPostData('/api/tmanufacture/manufacture', "ListIssuedProductOrder", dat,
            ( res )=> {
                console.log( "查询到月订单数量列表:", res );
                let monthOrder_List = [],
                    Ui_list = res.obj.objectlist || [];
                Ui_list.forEach((item,index)=>{
                    if(index>=30) return;
                    monthOrder_List.push({
                        x:moment(item.StartDate).format('YYYY/MM'),
                        y:item.Count
                    })
                });
                this.setState({monthOrderList:monthOrder_List,loading:false});
            },
            ( error )=> {
                message.info( error );
            }
        )
    }

    getDayOrderNum=()=>{
        const{Start_Day,End_Day}=this.state;

        var dat = {
            Type:0,
            StartDate:Start_Day,
            EndDate:End_Day                                                  // 是否插单
        }
        console.log('DayOrder_dat',dat)
        TPostData('/api/tmanufacture/manufacture', "ListIssuedProductOrder", dat,
            ( res )=> {
                console.log( "查询到日订单数量列表:", res );
                let dayOrder_List = [],
                    Ui_list = res.obj.objectlist;
                Ui_list.forEach((item,index)=>{
                    if(index>=30) return;
                    dayOrder_List.push( {
                        x:moment(item.StartDate).format('MM/DD'),
                        y:item.Count
                    } )
                })
                this.setState({dayOrderList:dayOrder_List});
            },
            ( error )=> {
                message.info( error );
            }
        )
    }

    handleSearch = () => {
        // this.props.form.validateFields((errors, values) => {
        //     console.log("表单查询值",values);
        //     if (!!errors) {
        //         console.log('Errors in form!!!');
        //         message.error('添加失败');
        //         return;
        //     } else {
        //         // this.props.submit(values);
        //         const {WSUUID,WCUUID,RDate}=values;
        //         this.setState({WSUUID,WCUUID,RDate:RDate.format("YYYY.MM.DD")},()=>{
        //             console.log('WSUUID,WCUUID,RDate',this.state.RDate);
        //             // this.getOEEReport();
        //             this.getProReport();
        //         })
        //     }
        // });
    }

    onTabChange = (key) => {
        console.log('key', key);
        console.log('istrue', key=='MonthBarChart');
        if(key=='MonthBarChart'){
            this.setState({mode:['month', 'month']});
            this.setState({Date_month:true});
        }
        else{
            this.setState({Date_month:false});
            this.setState({mode:['date','date']});
        }

    }

    onPanelChange = (value,mode)=>{
        console.log('onPanelChange',value,mode);
        this.setState({
          mode: [
            mode[0] === 'date' ? 'month' : mode[0],
            mode[1] === 'date' ? 'month' : mode[1],
          ],
      },()=>console.log(this.state.mode));
    }

    handleDateChange = (a,b,c)=>{
        console.log('date_change',a,b,c);
        if(this.state.Date_month){
            console.log('b0',b[0])
            console.log('b1',b[1])
            this.setState({
                MSDate:moment(b[0]).format('YYYY.MM'),
                MEDate:moment(b[1]).format('YYYY.MM')
            },function(){
                console.log('MSDate',this.state.MSDate)
                console.log('MEDate',this.state.MEDate)
                this.getMonthOrderNum();
            })
        }
        else{
            this.setState({
                Start_Day:moment(b[0]).format('YYYY.MM.DD'),
                End_Day:moment(b[1]).format('YYYY.MM.DD')
            },()=>this.getDayOrderNum())
        }
    }

    disabledDate = (current)=> {
      // Can not select days before today and today
      return current && current < moment().endOf('day');
    }

    render() {
        const{
            monthOrderList,
            dayOrderList,
            mode,
            Date_month,
            MSDate,
            MEDate,
            Start_Day,
            End_Day,
            loading
        }=this.state;
        // const {form:{getFieldDecorator}}=this.props;
        // console.log("datalist",monthOrderList,dayOrderList);

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

        const formItemLayout = {
          labelCol: {
            xs: { span: 24 },
            sm: { span: 4 },
          },
          wrapperCol: {
            xs: { span: 24 },
            sm: { span: 20,type:'flex',justify:'end',align:'middle' },
          },
        };

        /*const MDateForm=(
            <FormItem label="日期" {...formItemLayout} >
                <Col span={11}>
                    <FormItem style={{marginRight:0}}>
                        {getFieldDecorator("MSDate",{initialValue:moment(MSDate)})(
                            // <DatePicker showTime format="YYYY/MM/DD" />
                        )}
                        <MonthPicker format="YYYY/MM"/>
                    </FormItem>
                </Col>
                <Col span={2}>
                    <span style={{ display: 'inline-block', width: '100%', textAlign: 'center' }}>
                        ~
                    </span>
                </Col>
                <Col span={11}>
                    <FormItem style={{marginRight:0}}>
                        {getFieldDecorator("MEDate",{initialValue:moment(MEDate)})(
                            <MonthPicker format="YYYY/MM"/>
                        )}
                    </FormItem>
                </Col>
            </FormItem>
        )

        const DayForm=(
            <FormItem label="日期" {...formItemLayout}>
                <Col span={11}>
                    <FormItem style={{marginRight:0}}>
                        {getFieldDecorator("MSDate",{initialValue:moment(Start_Day)})(
                            <DatePicker />
                        )}
                    </FormItem>
                </Col>
                <Col span={2}>
                    <span style={{ display: 'inline-block', width: '100%', textAlign: 'center' }}>
                        ~
                    </span>
                </Col>
                <Col span={11}>
                    <FormItem style={{marginRight:0}}>
                        {getFieldDecorator("MEDate",{initialValue:moment(End_Day)})(
                            <DatePicker />
                        )}
                    </FormItem>
                </Col>
            </FormItem>
        )*/

        const ExtraContent = (
            <div >
                {/* <div className="order-extra-cycle">
                    <a className="cycle-item">今日</a>
                    <a className="cycle-item">本周</a>
                    <a className="cycle-item">本月</a>
                    <a className="cycle-item">全年</a>
                </div> */}
                <span>日期：</span>
                        <RangePicker
                            // mode={Date_month?['month','month']:['date','date']}
                            // mode={this.state.mode}
                            value={Date_month?[moment(MSDate),moment(MEDate)]:[moment(Start_Day),moment(End_Day)]}
                            // defaultValue={Date_month?[moment(MSDate),moment(MEDate)]:[moment(Start_Day),moment(End_Day)]}
                            format={Date_month?'YYYY/MM':'YYYY/MM/DD'}
                            // showTime
                            onOk={(a,b,c)=>console.log('onOK',a,b,c)}
                            onChange={this.handleDateChange}
                            onPanelChange={this.onPanelChange}
                            onCalendarChange={(a,b,c)=>console.log('onCalendarChange',a,b,c)}
                            onOpenChange={(a,b,c)=>console.log('onOpenChange',a,b,c)}
                        />
                    {/* {
                        Date_month?
                        <RangePicker
                            // mode={Date_month?['month','month']:['date','date']}
                            // mode={this.state.mode}
                            mode={['month','month']}
                            value={[moment(MSDate),moment(MEDate)]}
                            // defaultValue={[moment(MSDate),moment(MEDate)]}
                            format={'YYYY/MM'}
                            showTime
                            onOk={(a,b,c)=>console.log('onOK',a,b,c)}
                            onChange={this.handleDateChange}
                            onPanelChange={this.onPanelChange}
                            onCalendarChange={(a,b,c)=>console.log('onCalendarChange',a,b,c)}
                            onOpenChange={(a,b,c)=>console.log('onOpenChange',a,b,c)}
                        />:
                        <RangePicker
                            // mode={Date_month?['month','month']:['date','date']}
                            // mode={this.state.mode}
                            mode={['date','date']}
                            // value={Date_month?[moment(MSDate),moment(MEDate)]:[moment(Start_Day),moment(End_Day)]}
                            defaultValue={[moment(Start_Day),moment(End_Day)]}
                            format={Date_month?'YYYY/MM':'YYYY/MM/DD'}
                            showTime
                            onOk={(a,b,c)=>console.log('onOK',a,b,c)}
                            onChange={this.handleDateChange}
                            onPanelChange={this.onPanelChange}
                            onCalendarChange={(a,b,c)=>console.log('onCalendarChange',a,b,c)}
                            onOpenChange={(a,b,c)=>console.log('onOpenChange',a,b,c)}
                        />
                    } */}

                {/* {
                    Date_month?MDateForm:DayForm
                } */}
            </div>);

        const salesData = [];
        for (let i = 0; i < 12; i += 1) {
          salesData.push({
            x: `${i + 1}月`,
            y: Math.floor(Math.random() * 1000) + 200,
          });
        }

        const orderMContent = (<div className="order-tend">
            <Row>
                <Col span={24}>
                    {/* <div className="tend-charts" id="tend-charts">
                        <ReactEcharts
                            className='react_for_echarts'
                            option={this.state.option}
                            lazyUpdate={true}
                            style={{height:350,border:'solid 0px'}}
                            />
                    </div> */}
                    <Bar
                      height={300}
                      // title="销售额趋势"
                      // data={salesData}
                      data={monthOrderList}
                    />
                </Col>
                {/* <Col span={6}>
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
                </Col> */}
            </Row>
        </div>)

        const orderDContent = (<div className="order-tend">
            <Row>
                <Col span={24}>
                    {/* <div className="tend-charts" id="tend-charts">
                        <ReactEcharts
                            className='react_for_echarts'
                            option={this.state.option}
                            lazyUpdate={true}
                            style={{height:350,border:'solid 0px'}}
                            />
                    </div> */}
                    <Bar
                      height={300}
                      // title="销售额趋势"
                      // data={salesData}
                      data={dayOrderList}
                    />
                </Col>
                {/* <Col span={6}>
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
                </Col> */}
            </Row>
        </div>)

        return (
            <PageHeaderLayout title="首页" wrapperClassName="pageContent">
                <Spin spinning={loading}>
                    <div >
                        {/* <List
                            grid={{
                                gutter: 16,
                                xs: 1,
                                sm: 2,
                                md: 2,
                                lg: 4,
                                xl: 4,
                                xxl: 4
                            }}
                            dataSource={data}
                            renderItem={item => (
                            <List.Item>
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
                            </List.Item>)}/> */}
                        {/* <Row>
                            <Col  xl={6} lg={6} md={6} sm={24} xs={24}>
                            </Col>
                            <Col  xl={18} lg={18} md={18} sm={24} xs={24}>
                                <div style={{border:'solid 1px #e6e5e2',borderRadus:8,padding:16}}>
                                    <Bar height={295} title="销售额趋势" data={salesData} />
                                </div>
                            </Col>
                        </Row> */}
                        <Card style={{width: '100%'}}
                            // title={ExtraContent}
                            // title="订单量趋势"
                            // extra={ExtraContent}
                            // tabList={tabList}
                            // onTabChange={(key) => { this.onTabChange(key, 'key'); }}
                          >
                            <Tabs
                                onChange={this.onTabChange}
                                tabBarExtraContent={ExtraContent}
                                defaultActiveKey="1">
                                <TabPane tab="月订单趋势" key="MonthBarChart">
                                    {orderMContent}
                                </TabPane>
                                <TabPane tab="日订单趋势" key="DayBarChart">
                                    {orderDContent}
                                </TabPane>
                            </Tabs>
                        </Card>
                    </div>
                </Spin>
            </PageHeaderLayout>
        )
    }
}
// THome = Form.create()(THome);
