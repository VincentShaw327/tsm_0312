/**
 *这是设备列表页
 *添加日期:2017.12.20
 **/
/******引入ant或其他第三方依赖文件*******************/
import React, { Component } from 'react'
import {Card,Row,Col,Progress,Divider,Tag,Spin,Alert,List,message} from 'antd';
import FeatureSetConfig from '../../components/TCommon/tableConfig';
import { TPostData,urlBase } from '../../utils/TAjax';
import {  yuan,Pie} from '../../components/ant-design-pro/Charts';
// var mqtt = require( 'mqtt' );
import mqtt from 'mqtt';

let self

var client //注塑车间消息订阅初始化变量

export default class TScadaWorkShop_Auto extends Component {

    constructor( props ) {
        super( props )
        this.state = {
            //单台机台数据状态
            aEquipList: [],
            stateCount:[],
            onLine: '-',
            warning: '-',
            allQuery: '-',
            loading: true
        }
        self = this;
    }
    //查询工作中心
    componentWillMount() {

        // 获取相应车间的工作中心
        let aEquipList = [];
        let dat = {
            PageIndex: 0,
            PageSize: -1,
            WorkshopUUID:1,  //所属车间UUID，不作为查询条件时取值设为-1
            TypeUUID: -1,   //类型UUID，不作为查询条件时取值设为-1
            KeyWord : ""
        };
        TPostData( '/api/TProcess/workcenter', "ListActive", dat,
            ( res )=> {
                console.log("工作中心列表===",res);
                var Ui_list = res.obj.objectlist || [];
                var totalcount = res.obj.objectlist.length;
                Ui_list.forEach(( item, index )=> {
                    aEquipList.push( {
                        key: index,
                        ID: item.ID,
                        UUID: item.UUID,
                        WorkshopUUID: item.WorkshopUUID,
                        Name: item.Name,
                        Image:item.Image,
                        style: 'top-equip-light'
                    } )
                } );
                this.setState( {
                    aEquipList: aEquipList,
                    loading: false
                } )
            },
            ( error )=>{
                message.info( error );
            }
        )

        const graph_conf1 = {
            type: 'graphList',
             // tableList graphList simpleObject complexObject
            EchartStyle: {
                width: '100%',
                height: '250px'
            },
            // 初始化展现的数据，使用callback 回传列表数据
            // 需要手动添加唯一id key
            // callback 组件数据的回调函数(接受列表数据参数)
            initData: function ( callback ) {
                // 参考echarts 参数
                var option = {
                    /*title : {
                        text: '状态统计分布',
                        subtext: '纯属虚构',
                        x:'right'
                    },*/
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
                callback( option );
            }
        };

        const graph_conf2 = {
            type: 'graphList',
            EchartStyle: {
                width: '100%',
                height: '250px'
            },
            // 初始化展现的数据，使用callback 回传列表数据
            // 需要手动添加唯一id key
            // callback 组件数据的回调函数(接受列表数据参数)
            initData: function ( callback ) {
                // 参考echarts 参数
                // app.title = '堆叠条形图';
                const option = {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: { // 坐标轴指示器，坐标轴触发有效
                            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    legend: {
                        data: [ '停机', '故障', '调机', '保养', '运行' ]
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'value'
                    },
                    yAxis: {
                        type: 'category',
                        data: [ '1#', '2#', '3#', '4#', '5#', '6#', '7#' ]
                    },
                    series: [
                        {
                            name: '停机',
                            type: 'bar',
                            stack: '总量',
                            /*label: {
                                normal: {
                                    show: true,
                                    position: 'insideRight'
                                }
                            },*/
                            data: [ 320, 302, 301, 334, 390, 330, 320 ]
                        },
                        {
                            name: '故障',
                            type: 'bar',
                            stack: '总量',
                            /*label: {
                                normal: {
                                    show: true,
                                    position: 'insideRight'
                                }
                            },*/
                            data: [ 120, 132, 101, 134, 90, 230, 210 ]
                        },
                        {
                            name: '调机',
                            type: 'bar',
                            stack: '总量',
                            /*label: {
                                normal: {
                                    show: true,
                                    position: 'insideRight'
                                }
                            },*/
                            data: [ 220, 182, 191, 234, 290, 330, 310 ]
                        },
                        {
                            name: '保养',
                            type: 'bar',
                            stack: '总量',
                            /*label: {
                                normal: {
                                    show: true,
                                    position: 'insideRight'
                                }
                            },*/
                            data: [ 150, 212, 201, 154, 190, 330, 410 ]
                        },
                        {
                            name: '运行',
                            type: 'bar',
                            stack: '总量',
                            /*label: {
                                normal: {
                                    show: true,
                                    position: 'insideRight'
                                }
                            },*/
                            data: [ 820, 832, 901, 934, 1290, 1330, 1320 ]
                        }
                    ]
                };
                callback( option );
            }
        };

        this.dailychart1 = FeatureSetConfig( graph_conf1 );

        this.barChart = FeatureSetConfig( graph_conf2 );
    }

    componentDidMount() {
        /*{
            data: [
                {
                    capacity: 0,
                    finished: 1,
                    order_status: "success",
                    plan: 1,
                    product: "",
                    run_status:-1,
                    title:"HDMI全自动机001",
                    workstation:10
                }, {
                    capacity: 46,
                    finished: 3741,
                    order_status: "success",
                    plan: 211000,
                    product: "11号接插件"
                }, {
                    capacity: 0,
                    finished: 1,
                    order_status: "success",
                    plan: 1,
                    product: ""
                }, {
                    capacity: 19,
                    finished: 1177,
                    order_status: "success",
                    plan: 213000,
                    product: "13号接插件"
                }, {
                    capacity: 37,
                    finished: 3366,
                    order_status: "success",
                    plan: 214000,
                    product: "14号接插件"
                }, {
                    capacity: 0,
                    finished: 1,
                    order_status: "success",
                    plan: 1,
                    product: ""
                }, {
                    capacity: 0,
                    finished: 1,
                    order_status: "success",
                    plan: 1,
                    product: ""
                }, {
                    capacity: 0,
                    finished: 1,
                    order_status: "success",
                    plan: 1,
                    product: ""
                }, {
                    capacity: 36,
                    finished: 3678,
                    order_status: "success",
                    plan: 218000,
                    product: "18号接插件"
                }, {
                    capacity: 29,
                    finished: 3043,
                    order_status: "success",
                    plan: 219000,
                    product: "19号接插件"
                }, {
                    capacity: 53,
                    finished: 2859,
                    order_status: "success",
                    plan: 220000,
                    product: "20号接插件"
                }, {
                    capacity: 37,
                    finished: 3229,
                    order_status: "success",
                    plan: 221000,
                    product: "21号接插件"
                }, {
                    capacity: 0,
                    finished: 1,
                    order_status: "success",
                    plan: 1,
                    product: ""
                }, {
                    capacity: 0,
                    finished: 1194,
                    order_status: "success",
                    plan: 223000,
                    product: "23号接插件"
                }, {
                    capacity: 0,
                    finished: 1,
                    order_status: "success",
                    plan: 1,
                    product: ""
                }, {
                    capacity: 26,
                    finished: 1925,
                    order_status: "success",
                    plan: 225000,
                    product: "25号接插件"
                }
            ],
            statics: {
                failure: 0,
                offline: 7,
                running: 7 ,
                stopped: 2
            }
        }*/

        //mqtt消息连接建立
        client = mqtt.connect( 'ws://192.168.200.3:9011' );
        // client = mqtt.connect( 'mqtt://192.168.200.3:9011' );
        client.on( 'connect', function () {
            //订阅消息
            client.subscribe( '0101/086325608001/201712290001/kanban/01/B' );
            // client.subscribe( "0101/086325608001/201712290001/kanban/01/A" );
            // client.subscribe( 'topstarltd/iec/app/#' )
        } )
        let renderaEquip = [];
        client.on( 'message',( topic, payload )=> {
            // 接收到mqtt消息推送数据
            let mqttData = JSON.parse( payload );
            console.log( '接收到MQTT信息', mqttData );
            // 判断消息包内有数据的情况下,把数据更新至组件.
            if ( mqttData && Array.isArray( mqttData.data ) ) {
                renderaEquip = this.state.aEquipList.map(( item, i )=> {
                    //判断接受消息是哪一台机器
                    mqttData.data.forEach( ( mqttItem, index ) => {
                        if ( item.UUID == mqttItem.workstation ) {
                            item.key = i
                            item.Status = mqttItem.run_status
                            item.prod_count = mqttItem.finished //产量
                            item.prod_rate = mqttItem.capacity //产能
                            item.plan = mqttItem.plan //计划
                            item.product=mqttItem.product
                            // item.rej_count = mqttItem.data.rej_count //不良数
                            // item.rej_rate = mqttItem.data.rej_rate //不良率
                            // item.task_finish = mqttItem.task.task_finish //完成比例
                            // item.task_progress = mqttItem.finished_ratio //完成进度
                            // item.task_no = mqttItem.task.task_no //工单号
                            // item.task_name = mqttItem.task.task_name //产品名称
                            return item;
                        }
                        else {
                            return item
                        }
                    } )
                    return item;
                } )
                // console.log( 'renderaEquip', renderaEquip );

                this.setState( {
                    loading: false, //加载完毕取消蒙城
                    aEquipList: renderaEquip,
                    // allQuery: renderaEquip.length,
                    // onLine: g,
                    // warning: w,
                    // offLine: renderaEquip.length - w - g
                } )
            }
            if(mqttData&&mqttData.statics){
                let Mstatics=mqttData.statics;
                let MstateCount=[
                    {
                        x:'报警',
                        y:Mstatics.failure
                    },
                    {
                        x:'离线',
                        y:Mstatics.offline
                    },
                    {
                        x:'运行',
                        y:Mstatics.running
                    },
                    {
                        x:'待机',
                        y:Mstatics.stopped
                    }
                ];
                this.setState({stateCount:MstateCount});
            }
        } );

        // let topicA="0101/086325608001/201712290001/kanban/01/A";
        // client.on( 'message',(topicA , payload )=> {
        //     let mqttData = JSON.parse( payload );
        //     console.log( '接收到MQTT---A信息', mqttData );
        // });
    }

    componentWillUnmount() {
        client.end()
    }

    render() {
        // console.log( '工作中心列表:', this.state.aEquipList );
        const Dailychart = this.dailychart1;
        const Barchart = this.barChart;
        const ListHeader = (
            <Row gutter={16} style={{fontSize:16}}>
              <Col className="gutter-row" span={3}>
                <div className="gutter-box">图片</div>
              </Col>
              <Col className="gutter-row" span={5}>
                <div className="gutter-box">工作中心</div>
              </Col>
              <Col className="gutter-row" span={3}>
                <div className="gutter-box">生产信息</div>
              </Col>
              <Col className="gutter-row" span={3}>
                <div className="gutter-box">产量<span style={{fontSize:10}}>(pcs)</span></div>
              </Col>
              <Col className="gutter-row" span={4}>
                <div className="gutter-box">产能<span style={{fontSize:10}}>(pcs/min)</span></div>
              </Col>
              <Col className="gutter-row" span={4}>
                <div className="gutter-box">生产进度</div>
              </Col>
              <Col className="gutter-row" span={2}>
                <div className="gutter-box">状态</div>
              </Col>
            </Row>
        );

        const salesPieData = [
          {
            x: '家用电器',
            y: 4544,
          },
          {
            x: '食用酒水',
            y: 3321,
          },
          {
            x: '个护健康',
            y: 3113,
          },
          {
            x: '服饰箱包',
            y: 2341,
          },
          {
            x: '母婴产品',
            y: 1231,
          },
          {
            x: '其他',
            y: 1231,
          },
        ];

        return (
            <div style={{marginTop:15}}>
                <Row gutter={16}>
                  <Col className="gutter-row" span={18}>
                    <div className="gutter-box">
                        <List
                            // style={{width:'75%'}}
                            header={ListHeader}
                            // footer={<div>Footer</div>}
                            loading={this.state.loading}
                            bordered
                            dataSource={this.state.aEquipList}
                            renderItem={item => {
                                let stateObj={};
                                if(item.task_progress &&item.task_progress >= 100)
                                stateObj={text:"已完成",color:'blue'};
                                else if(item.hasOwnProperty('Status')&&item.Status== 1)
                                stateObj={text:"生产中",color:'rgba(82, 196, 26, 0.84)'};
                                else if(item.hasOwnProperty('Status') &&item.Status== 2)
                                stateObj={text:"报警中",color:'#ffc069'};
                                else if(item.hasOwnProperty('Status')&&item.Status== 0)
                                stateObj={text:"待机中",color:'#4184de'};
                                else if(item.hasOwnProperty('Status')&&item.Status== -1)
                                stateObj={text:"离线中",color:'#bfbfbf'};

                                return(
                                        <List.Item>
                                            <Row gutter={16} type="flex" justify="space-around" align="middle" style={{border:'solid 0px',width:'100%'}}>
                                                <Col className="gutter-row" span={3}>
                                                    <div className="gutter-box">
                                                        <img src={urlBase+item.Image} style={{width:"100%"}} />
                                                    </div>
                                                </Col>
                                                <Col className="gutter-row" span={5}>
                                                    <div className="gutter-box">
                                                        <p>{item.Name}</p>
                                                        <p>{item.ID}</p>
                                                    </div>
                                                </Col>
                                                <Col className="gutter-row" span={4}>
                                                    <div className="gutter-box">
                                                        <div style={{color:'#1b8ff6',fontSize:20}}>{item.task_no?item.task_no:'P20180207'}</div>
                                                        <div>产品:{item.product?item.product:'-'}</div>
                                                    </div>
                                                </Col>
                                                <Col className="gutter-row" span={3}>
                                                    <div className="gutter-box">
                                                        <span>{item.hasOwnProperty('prod_count')?item.prod_count:'-'}</span>
                                                    </div>
                                                </Col>
                                                <Col className="gutter-row" span={3}>
                                                    <div className="gutter-box">
                                                        <span>{item.hasOwnProperty('prod_rate')?item.prod_rate:'-'}</span>
                                                    </div>
                                                </Col>
                                                <Col className="gutter-row" span={4}>
                                                    <div className="gutter-box">
                                                        <span>{item.prod_count||0}/{item.plan||0}</span>
                                                        <Progress
                                                            // type="dashboard"
                                                            // width={25}
                                                            percent={parseFloat(((item.prod_count/item.plan )*100|| 0).toFixed(2))}
                                                            strokeWidth={15}/>
                                                    </div>
                                                </Col>
                                                <Col className="gutter-row" span={2}>
                                                    <Tag
                                                        color={`${stateObj.color}`}
                                                        style={{marginTop:30, fontSize: 'larger'}}>{stateObj.text}</Tag>
                                                    &nbsp;&nbsp;
                                                </Col>
                                            </Row>
                                        </List.Item>
                                    )
                                }
                            }
                            />
                    </div>
                  </Col>
                  <Col className="gutter-row" span={6}>
                    <div className="gutter-box">
                        <Card title="状态统计">
                            {/* <Dailychart /> */}
                            <Pie
                              hasLegend
                              title="销售额"
                              subTitle="设备状态"
                              // total={yuan(salesPieData.reduce((pre, now) => now.y + pre, 0))}
                              total={"总共"+ this.state.stateCount.reduce((pre, now) => now.y + pre, 0)+"台"}
                              // total={()=>{
                              //   let total=this.state.stateCount.reduce((pre, now) => now.y + pre, 0);
                              //   return <span>{total}</span>
                              // }}
                              data={this.state.stateCount}
                              valueFormat={val =>('&nbsp;&nbsp'+val+'台')}
                              // valueFormat={val => yuan(val)}
                              height={294}
                            />
                        </Card>
                        <Card title="时间统计"  style={{marginTop:20}}>
                            <Barchart />
                        </Card>
                    </div>
                  </Col>
                </Row>
            </div>
        )
    }
}
