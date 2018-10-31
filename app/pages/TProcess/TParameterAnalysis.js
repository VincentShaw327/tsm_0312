/**
 *这是设备列表页
 *添加日期:2017.12.06
 *添加人:shaw
 **/
/******引入ant或其他第三方依赖文件*******************/
import React, { Component } from 'react'
import { Row, Col, Divider } from 'antd';
// import FeatureSetConfig from '../../components/TCommon/tableConfig';
import { TPostData, urlBase } from '../../utils/TAjax';
import Mock from 'mockjs';

let seft
let Dailychart
let Feature
let creatKeyWord;
let MtrlTpList = []

export default class App extends Component {

    constructor( props ) {
        super( props )
        this.state = {
            server: this.props.server,
            dataList: [],
            loading: false
        }
        seft = this;
    }

    componentWillMount() {
        const self = this,
            Random = Mock.Random,
            machineType = [ '挤塑机系列', '拉线机系列', '绞线机系列', '绕包机系列' ],
            maintainType = [ '日常保养', '一级保养', '二级保养' ],
            temp1 = { 'list|12': [ '@float(120, 125)' ] },
            tempData1 = Mock.mock( temp1 )
            .list,
            temp2 = { 'list|12': [ '@natural(125, 130)' ] },
            tempData2 = Mock.mock( temp2 )
            .list,
            temp3 = { 'list|7': [ '@natural(145, 160)' ] },
            tempData3 = Mock.mock( temp3 )
            .list,
            temp4 = { 'list|7': [ '@natural(140, 175)' ] },
            tempData4 = Mock.mock( temp4 )
            .list,
            temp5 = { 'list|7': [ '@natural(145, 180)' ] },
            tempData5 = Mock.mock( temp5 )
            .list,
            temp6 = { 'list|7': [ '@natural(0, 100)' ] },
            tempData6 = Mock.mock( temp6 )
            .list,
            template = {
                obj: {
                    'objectlist|15': [
                        {
                            'Date': '2018-01-16',
                            'Time|+1': 7,
                            'deviceNum|+1': 1,
                            'temp1': `@natural(140, 180)`,
                            'temp2': `@natural(150, 190)`,
                            'temp3': `@natural(145, 160)`,
                            'temp4': `@natural(140, 175)`,
                            'temp5': `@natural(145, 180)`,
                            'speed': `@natural(0, 100)`,
                            'id|+1': 1,
                            'key|+1': 1,
                            'mName|+1': 1,
                            'task': `@natural(1, 15)`,
                            'machineType': `@pick(${machineType})`,
                            'maintainType': `@pick(${maintainType})`,
                            'planStart': '@date',
                            'now': `@now('day','yyyy-MM-dd')`,
                            // 'planEnd':`@now('day','yyyy-MM-dd')`,
                            'pMon': '@natural(02, 12)',
                            'pDay': '@natural(01, 30)',
                            'charger': '@cname',
                            'chargerNum': '@natural(1, 8)',
                            'age': '@natural(18, 45)',
                            'department': `@pick(['生产部','设备部','维修部'])`,
                            // 'cycle':'@natural(1, 5)',
                            'status': '@natural(1, 3)',
                            'cycle': function () {
                                if ( this.status == 2 ) this.pMon = '01'
                                if ( this.status == 1 ) this.pMon = '02';
                                if ( this.status == 3 ) this.pMon = '03';
                                if ( this.maintainType == '日常保养' ) return '1'
                                else if ( this.maintainType == '一级保养' ) return '2'
                                else if ( this.maintainType == '二级保养' ) return '3'
                            },
                            // 'unit':`@pick(['日','周','月','季','半年','年'])`,
                            'unit': function () {
                                if ( this.maintainType == '日常保养' ) return '日'
                                else if ( this.maintainType == '一级保养' ) return '周'
                                else if ( this.maintainType == '二级保养' ) return '月'
                            },
                            typeIndex: '1',
                            },
                        ]
                },
            },
            dailyReport = Mock.mock( template );
        this.setState( {
            dataList: dailyReport.obj.objectlist
        } )

        const graph_conf = {
            type: 'graphList', // tableList graphList simpleObject complexObject
            EchartStyle: {
                width: '100%',
                height: '330px'
            },
            // 初始化展现的数据，使用callback 回传列表数据
            // 需要手动添加唯一id key
            // callback 组件数据的回调函数(接受列表数据参数)
            initData: function ( callback ) {
                let option = {
                    title: {
                        text: '重量变化趋势'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: [ '参数一重量变化趋势', '参数二重量变化趋势', '视频广告', '直接访问', '搜索引擎' ]
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    toolbox: {
                        feature: {
                            saveAsImage: {}
                        }
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: [ '成品一', '成品二', '成品三', '成品四', '成品五', '成品六', '成品七', '成品八', '成品九', '成品十', '成品十一', '成品十二', ]
                    },
                    yAxis: {
                        type: 'value',
                        name: '重量',
                        min: 120,
                        max: 140,
                        interval: 2,
                        axisLabel: {
                            formatter: '{value}Kg'
                        }
                    },
                    series: [
                        {
                            name: '参数一重量变化趋势',
                            type: 'line',
                            // stack: '总量',
                            // data:[120, 132, 101, 134, 90, 230, 210],
                            data: tempData1,
                            smooth: true
                            },
                        {
                            name: '参数二重量变化趋势',
                            type: 'line',
                            // stack: '总量',
                            // data:[220, 182, 191, 234, 290, 330, 310],
                            data: tempData2,
                            smooth: true
                            },
                            /*{
                                name:'视频广告',
                                type:'line',
                                stack: '总量',
                                data:[150, 232, 201, 154, 190, 330, 410],
                                smooth: true
                            },
                            {
                                name:'直接访问',
                                type:'line',
                                stack: '总量',
                                data:[320, 332, 301, 334, 390, 330, 320],
                                smooth: true
                            },
                            {
                                name:'搜索引擎',
                                type:'line',
                                stack: '总量',
                                data:[820, 932, 901, 934, 1290, 1330, 1320],
                                smooth: true
                            }*/
                        ]
                };
                callback( option );
            }
        };
        // Dailychart = FeatureSetConfig( graph_conf )
        const graph_conf2 = {
            type: 'graphList', // tableList graphList simpleObject complexObject
            EchartStyle: {
                width: '100%',
                height: '330px'
            },
            // 初始化展现的数据，使用callback 回传列表数据
            // 需要手动添加唯一id key
            // callback 组件数据的回调函数(接受列表数据参数)
            initData: function ( callback ) {
                let option = {
                    title: {
                        text: '参数二重量变化趋势'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: [ '成品重量', '联盟广告', '视频广告', '直接访问', '搜索引擎' ]
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    toolbox: {
                        feature: {
                            saveAsImage: {}
                        }
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: [ '成品一', '成品二', '成品三', '成品四', '成品五', '成品六', '成品七', '成品八', '成品九', '成品十', '成品十一', '成品十二', ]
                    },
                    yAxis: {
                        type: 'value',
                        name: '重量',
                        min: 120,
                        max: 130,
                        interval: 2,
                        axisLabel: {
                            formatter: '{value}Kg'
                        }
                    },
                    series: [
                        {
                            name: '成品重量',
                            type: 'line',
                            stack: '总量',
                            // data:[120, 132, 101, 134, 90, 230, 210],
                            data: tempData2,
                            smooth: true
                            },
                            /*{
                                name:'联盟广告',
                                type:'line',
                                stack: '总量',
                                data:[220, 182, 191, 234, 290, 330, 310],
                                smooth: true
                            },
                            {
                                name:'视频广告',
                                type:'line',
                                stack: '总量',
                                data:[150, 232, 201, 154, 190, 330, 410],
                                smooth: true
                            },
                            {
                                name:'直接访问',
                                type:'line',
                                stack: '总量',
                                data:[320, 332, 301, 334, 390, 330, 320],
                                smooth: true
                            },
                            {
                                name:'搜索引擎',
                                type:'line',
                                stack: '总量',
                                data:[820, 932, 901, 934, 1290, 1330, 1320],
                                smooth: true
                            }*/
                        ]
                };
                callback( option );
            }
        };
        // this.Chart2 = FeatureSetConfig( graph_conf2 )
    }

    render() {
        let Chart2 = this.Chart2;
        return (
            <div>
                <Dailychart  />
                {/* <Row gutter={16}>
                  <Col className="gutter-row" span={12}>
                    <div className="gutter-box" style={{border:'solid 1px #b4b4b2',padding:3,borderRadius:5}} >
                    </div>
                  </Col>
                  <Col className="gutter-row" span={12}>
                    <div className="gutter-box" style={{border:'solid 1px #b4b4b2',padding:3,borderRadius:5}}>
                        <Chart2 />
                    </div>
                  </Col>
                </Row> */}
                {/* <Divider>历史数据</Divider> */}
                <Divider></Divider>
                <div style={{height: '525px',overflowX: 'auto'}}>
                    {/* <Feature/> */}
                </div>
            </div>
        )
    }
}
