/**
 *这是设备列表页
 *添加日期:2017.12.20
 **/
/******引入ant或其他第三方依赖文件*******************/
import React, { Component } from 'react'
import {Layout,Card,Row,Col,Progress,Divider,Tag,Spin,List,message} from 'antd';
import FeatureSetConfig from '../../components/TCommon/shawCommon/tableConfig';
import { TPostData } from '../../utils/TAjax';
import devicePic from '../../images/assets/AM4.jpg';
var mqtt = require( 'mqtt' );
const { Header, Footer, Sider, Content } = Layout;

/**   控制this作用域指针   **/
let self

// let _storage = window.localStorage;  //暂时不启用缓存加载方式， 后端未推送离线状态，不易监控

var client //注塑车间消息订阅初始化变量

export default class TScadaWorkShop_Auto2 extends Component {

    constructor( props ) {
        super( props )
        this.state = {
            //单台机台数据状态
            aEquipList: [],
            onLine: '-',
            warning: '-',
            allQuery: '-',
            loading: true
        }
        self = this;
    }
    //查询工作中心
    componentWillMount() {
        let objectlist = [
            {
                machine_id: "HDMI-STATION-001", // 机器识别号
                data: {
                    machine_id: "HDMI-STATION-001", // 机器识别号
                    run_status: 1, // 0：空闲 1：正常运行 2：报警
                    prod_count: 234, // 产量：pcs
                    prod_rate: 35, // 产能：pcs/min
                    rej_count: 1, // 不良品：pcs
                    rej_rate: 1, // 不良率: pcs/10000，每一万片的不良数目
                    alarm: 0x0000, // 告警码 32bit
                },
                task: {
                    task_no: "T201470812554", // 工单号
                    task_name: "AV音视频端子", // 生产内容
                    task_progress: 90, // 生产进度:90%
                    task_finish: "15682/20000", // 生产完成比例
                    task_finishtime: "2017-09-03 10:15:33", // 结束时间
                }
            },
            {
                machine_id: "HDMI-STATION-002", // 机器识别号
                data: {
                    machine_id: "HDMI-STATION-002", // 机器识别号
                    run_status: 1, // 0：空闲 1：正常运行 2：报警
                    prod_count: 21, // 产量：pcs
                    prod_rate: 25, // 产能：pcs/min
                    rej_count: 1, // 不良品：pcs
                    rej_rate: 1, // 不良率: pcs/10000，每一万片的不良数目
                    alarm: 0x0000, // 告警码 32bit
                },
                task: {
                    task_no: "T201470812554", // 工单号
                    task_name: "AV音视频端子", // 生产内容
                    task_progress: 90, // 生产进度:90%
                    task_finish: "15682/20000", // 生产完成比例
                    task_finishtime: "2017-09-03 10:15:33", // 结束时间
                }
            },
            {
                machine_id: "HDMI-STATION-003", // 机器识别号
                data: {
                    machine_id: "HDMI-STATION-003", // 机器识别号
                    run_status: 1, // 0：空闲 1：正常运行 2：报警
                    prod_count: 21, // 产量：pcs
                    prod_rate: 25, // 产能：pcs/min
                    rej_count: 1, // 不良品：pcs
                    rej_rate: 1, // 不良率: pcs/10000，每一万片的不良数目
                    alarm: 0x0000, // 告警码 32bit
                },
                task: {
                    task_no: "T201470812554", // 工单号
                    task_name: "AV音视频端子", // 生产内容
                    task_progress: 90, // 生产进度:90%
                    task_finish: "15682/20000", // 生产完成比例
                    task_finishtime: "2017-09-03 10:15:33", // 结束时间
                }
            },
            {
                machine_id: "HDMI-STATION-004", // 机器识别号
                data: {
                    machine_id: "HDMI-STATION-002", // 机器识别号
                    run_status: 1, // 0：空闲 1：正常运行 2：报警
                    prod_count: 21, // 产量：pcs
                    prod_rate: 25, // 产能：pcs/min
                    rej_count: 1, // 不良品：pcs
                    rej_rate: 1, // 不良率: pcs/10000，每一万片的不良数目
                    alarm: 0x0000, // 告警码 32bit
                },
                task: {
                    task_no: "T201470812554", // 工单号
                    task_name: "AV音视频端子", // 生产内容
                    task_progress: 90, // 生产进度:90%
                    task_finish: "15682/20000", // 生产完成比例
                    task_finishtime: "2017-09-03 10:15:33", // 结束时间
                }
            },
            {
                machine_id: "HDMI-STATION-005", // 机器识别号
                data: {
                    machine_id: "HDMI-STATION-002", // 机器识别号
                    run_status: 1, // 0：空闲 1：正常运行 2：报警
                    prod_count: 21, // 产量：pcs
                    prod_rate: 25, // 产能：pcs/min
                    rej_count: 1, // 不良品：pcs
                    rej_rate: 1, // 不良率: pcs/10000，每一万片的不良数目
                    alarm: 0x0000, // 告警码 32bit
                },
                task: {
                    task_no: "T201470812554", // 工单号
                    task_name: "AV音视频端子", // 生产内容
                    task_progress: 90, // 生产进度:90%
                    task_finish: "15682/20000", // 生产完成比例
                    task_finishtime: "2017-09-03 10:15:33", // 结束时间
                }
            },
            {
                machine_id: "HDMI-STATION-006", // 机器识别号
                data: {
                    machine_id: "HDMI-STATION-002", // 机器识别号
                    run_status: 1, // 0：空闲 1：正常运行 2：报警
                    prod_count: 21, // 产量：pcs
                    prod_rate: 25, // 产能：pcs/min
                    rej_count: 1, // 不良品：pcs
                    rej_rate: 1, // 不良率: pcs/10000，每一万片的不良数目
                    alarm: 0x0000, // 告警码 32bit
                },
                task: {
                    task_no: "T201470812554", // 工单号
                    task_name: "AV音视频端子", // 生产内容
                    task_progress: 90, // 生产进度:90%
                    task_finish: "15682/20000", // 生产完成比例
                    task_finishtime: "2017-09-03 10:15:33", // 结束时间
                }
            },
            {
                machine_id: "HDMI-STATION-007", // 机器识别号
                data: {
                    machine_id: "HDMI-STATION-002", // 机器识别号
                    run_status: 1, // 0：空闲 1：正常运行 2：报警
                    prod_count: 21, // 产量：pcs
                    prod_rate: 25, // 产能：pcs/min
                    rej_count: 1, // 不良品：pcs
                    rej_rate: 1, // 不良率: pcs/10000，每一万片的不良数目
                    alarm: 0x0000, // 告警码 32bit
                },
                task: {
                    task_no: "T201470812554", // 工单号
                    task_name: "AV音视频端子", // 生产内容
                    task_progress: 90, // 生产进度:90%
                    task_finish: "15682/20000", // 生产完成比例
                    task_finishtime: "2017-09-03 10:15:33", // 结束时间
                }
            },
            {
                machine_id: "HDMI-STATION-008", // 机器识别号
                data: {
                    machine_id: "HDMI-STATION-002", // 机器识别号
                    run_status: 1, // 0：空闲 1：正常运行 2：报警
                    prod_count: 21, // 产量：pcs
                    prod_rate: 25, // 产能：pcs/min
                    rej_count: 1, // 不良品：pcs
                    rej_rate: 1, // 不良率: pcs/10000，每一万片的不良数目
                    alarm: 0x0000, // 告警码 32bit
                },
                task: {
                    task_no: "T201470812554", // 工单号
                    task_name: "AV音视频端子", // 生产内容
                    task_progress: 90, // 生产进度:90%
                    task_finish: "15682/20000", // 生产完成比例
                    task_finishtime: "2017-09-03 10:15:33", // 结束时间
                }
            },
            {
                machine_id: "HDMI-STATION-009", // 机器识别号
                data: {
                    machine_id: "HDMI-STATION-002", // 机器识别号
                    run_status: 1, // 0：空闲 1：正常运行 2：报警
                    prod_count: 21, // 产量：pcs
                    prod_rate: 25, // 产能：pcs/min
                    rej_count: 1, // 不良品：pcs
                    rej_rate: 1, // 不良率: pcs/10000，每一万片的不良数目
                    alarm: 0x0000, // 告警码 32bit
                },
                task: {
                    task_no: "T201470812554", // 工单号
                    task_name: "AV音视频端子", // 生产内容
                    task_progress: 90, // 生产进度:90%
                    task_finish: "15682/20000", // 生产完成比例
                    task_finishtime: "2017-09-03 10:15:33", // 结束时间
                }
            },
            {
                machine_id: "HDMI-STATION-010", // 机器识别号
                data: {
                    machine_id: "HDMI-STATION-002", // 机器识别号
                    run_status: 1, // 0：空闲 1：正常运行 2：报警
                    prod_count: 21, // 产量：pcs
                    prod_rate: 25, // 产能：pcs/min
                    rej_count: 1, // 不良品：pcs
                    rej_rate: 1, // 不良率: pcs/10000，每一万片的不良数目
                    alarm: 0x0000, // 告警码 32bit
                },
                task: {
                    task_no: "T201470812554", // 工单号
                    task_name: "AV音视频端子", // 生产内容
                    task_progress: 90, // 生产进度:90%
                    task_finish: "15682/20000", // 生产完成比例
                    task_finishtime: "2017-09-03 10:15:33", // 结束时间
                }
            },
        ]
        let obj = {
            dataList: objectlist
        }

        let testData = JSON.stringify( obj )
        // console.log('测试数据',testData);

        //获取机台数量临时变量
        let aEquipList = [];
        let dat = {
            PageIndex: 0,
            PageSize: -1,
            WorkshopUUID:2,  //所属车间UUID，不作为查询条件时取值设为-1
            TypeUUID: -1,   //类型UUID，不作为查询条件时取值设为-1
            KeyWord : ""
        };

        /**
        	从服务端获取工作中心记录数据,
        	确定机台数量, 以及默认机台状态
        **/
        TPostData( '/api/TProcess/workcenter', "ListActive", dat,  ( res )=> {
            var Ui_list = res.obj.objectlist || [];
            var totalcount = res.obj.objectlist.length;
            Ui_list.forEach( function ( item, index ) {

                aEquipList.push( {
                    key: index,
                    ID: item.ID,
                    UUID: item.UUID,
                    WorkshopUUID: item.WorkshopUUID,
                    Name: item.Name,
                    style: 'top-equip-light' //默认机台为离线状态
                } )
            } );
            this.setState( {
                aEquipList: aEquipList,
                loading: false
            } )
        }, function ( error ) {
            message.info( error );
        }, false )

        const graph_conf1 = {

            type: 'graphList', // tableList graphList simpleObject complexObject

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

            type: 'graphList', // tableList graphList simpleObject complexObject

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
        //mqtt消息连接建立
        client = mqtt.connect( 'mqtt://47.91.154.238:9011' );
        client.on( 'connect', function () {
            //订阅消息
            client.subscribe( 'topstarltd/iec/app/#' )
        } )
        let renderaEquip = [] //零时渲染变量

        client.on( 'message', function ( topic, payload ) {
            // 接收到mqtt消息推送数据
            let mqttData = JSON.parse( payload )
            let g = 0
            let w = 0
            console.log( '接收到MQTT信息', mqttData )
            // 判断消息包内有数据的情况下,把数据更新至组件.

            if ( mqttData && Array.isArray( mqttData.dataList ) ) {
                renderaEquip = self.state.aEquipList.map( function ( item, i ) {
                    //判断接受消息是哪一台机器
                    mqttData.dataList.forEach( ( mqttItem, index ) => {
                        if ( item.ID == mqttItem.machine_id ) {
                            item.key = i
                            item.Status = mqttItem.data.run_status
                            item.prod_count = mqttItem.data.prod_count //产量
                            item.prod_rate = mqttItem.data.prod_rate //产能
                            item.rej_count = mqttItem.data.rej_count //不良数
                            item.rej_rate = mqttItem.data.rej_rate //不良率
                            item.task_finish = mqttItem.task.task_finish //完成比例
                            item.task_progress = mqttItem.task.task_progress //完成进度
                            item.task_no = mqttItem.task.task_no //工单号
                            item.task_name = mqttItem.task.task_name //产品名称
                            item.Badge = mqttItem.run_status == '1' ?
                                'success' //运行
                                :
                                mqttItem.data.run_status == '0' ?
                                'default' //待机
                                :
                                'warning', //告警
                                /** 根据状态值确定样式 **/
                                item.style = mqttItem.data.run_status == '1' ?
                                'top-equip-nomal' //运行
                                :
                                mqttItem.data.run_status == '0' ?
                                'top-equip-light' //待机
                                :
                                'top-equip-warning' //告警
                            return item
                        } else {
                            return item
                        }

                    } )
                    return item;
                } )
                console.log( 'renderaEquip', renderaEquip )
                renderaEquip.forEach( function ( item, i ) {
                    if ( item.Status == '1' ) {
                        g = g + 1
                    } else if ( item.Status == '2' ) {
                        w = w + 1
                    }
                } )
                self.setState( {
                    loading: false, //加载完毕取消蒙城
                    aEquipList: renderaEquip,
                    allQuery: renderaEquip.length,
                    onLine: g,
                    warning: w,
                    offLine: renderaEquip.length - w - g
                } )
            }
        } )

    }

    componentWillUnmount() {
        client.end()
    }

    render() {
        const Dailychart = this.dailychart1;
        const Barchart = this.barChart;
        console.log( '工作中心列表:', this.state.aEquipList );
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
        )
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
                                    // stateObj.text="已完成";
                                    // stateObj.text="已完成";
                                else if(item.Status &&item.Status== 1)
                                stateObj={text:"生产中",color:'rgba(82, 196, 26, 0.84)'};
                                else if(item.Status &&item.Status== 2)
                                stateObj={text:"报警",color:'#ffc069'};
                                else
                                stateObj={text:"待机",color:'#bfbfbf'};

                                return(
                                        <List.Item>
                                            <Row gutter={16} type="flex" justify="space-around" align="middle" style={{border:'solid 0px',width:'100%'}}>
                                                <Col className="gutter-row" span={3}>
                                                    <div className="gutter-box">
                                                        <img src={devicePic} style={{width:"100%"}} />
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
                                                        <div>产品:{item.task_name?item.task_name:'-'}</div>
                                                    </div>
                                                </Col>
                                                <Col className="gutter-row" span={3}>
                                                    <div className="gutter-box">
                                                            <span>{item.prod_count?item.prod_count:'-'}</span>
                                                    </div>
                                                </Col>
                                                {/* <Col className="gutter-row" span={3}>
                                                <div className="gutter-box">产量:
                                                <span>{item.task_no?item.task_no:'-'}</span>
                                                </div>
                                                </Col> */}
                                                <Col className="gutter-row" span={3}>
                                                    <div className="gutter-box">
                                                        <span>{item.prod_rate?item.prod_rate:'-'}</span>
                                                    </div>
                                                </Col>
                                                <Col className="gutter-row" span={4}>
                                                    <div className="gutter-box">
                                                        <Progress
                                                            // type="dashboard"
                                                            // width={25}
                                                            percent={parseInt(item.task_progress || 15)}
                                                            strokeWidth={15}/>
                                                    </div>
                                                </Col>
                                                <Col className="gutter-row" span={2}>
                                                    <Tag
                                                        color={`${stateObj.color}`}
                                                        style={{marginTop:30, fontSize: 'larger'}}>{stateObj.text}</Tag>
                                                    {
                                                        // let stateObj={};
                                                        // parseInt(item.task_progress || 0) >= 100
                                                        // ? stateObj={text："已完成",color:'blue'}
                                                        // : item.Status == '1'
                                                        // ? <Tag color="rgba(82, 196, 26, 0.84)" style={{marginRight: '0', fontSize: 'larger'}}>生产中</Tag>
                                                        // : item.Status == '2' ? <Tag color="#ffc069" style={{marginRight: '0', fontSize: 'larger'}}>告警</Tag>
                                                        //     : <Tag color="#bfbfbf" style={{marginLeft:8, fontSize: 'larger'}}>待机</Tag>

                                                        // (<Tag color="#bfbfbf" style={{marginLeft:8, fontSize: 'larger'}}>待机</Tag>)
                                                    }
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
                            <Dailychart />
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
