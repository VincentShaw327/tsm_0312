/**
 *这是设备列表页
 *添加日期:2017.12.06
 *添加人:shaw
 **/
/******引入ant或其他第三方依赖文件*******************/
import React, { Component } from 'react'
// import FeatureSetConfig from '../../components/TCommon/tableConfig';
import { TPostData,urlBase } from '../../utils/TAjax';
import { Divider } from 'antd';
import Mock from 'mockjs';

let seft
let Dailychart
let Feature
let creatKeyWord;
let MtrlTpList = [];
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
            temp1 = { 'list|7': [ '@natural(140, 180)' ] },
            tempData1 = Mock.mock( temp1 )
            .list,
            temp2 = { 'list|7': [ '@natural(150, 190)' ] },
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
                            'deviceNum': 11,
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
        // console.log('dailyReport',dailyReport);
        const conf = {
            type: 'tableFeature',
            tableTiltle: '报表查询',
            size: 'small', // table每行尺寸
            strKeyWord: '',
            WorkTypeList: [],
            // url: seft.state.server.url + 'Handler_Workstation_V1.ashx',
            /*****  页面列名  ******/
            columns: [
                {
                    title: '日期',
                    dataIndex: 'Date',
                    type: 'string'
                    // 车间描述,备注,
                }, {
                    title: '时间',
                    dataIndex: 'Time',
                    type: 'string',
                    render: ( e ) => ( <span>{e}:00</span> )
                    // 车间描述,备注,
                }, {
                    title: '设备编号',
                    dataIndex: 'deviceNum',
                    type: 'string',
                    render: ( e ) => ( <span>#{e}</span> )
                }, {
                    title: '机身一段(℃)',
                    dataIndex: 'temp1',
                    type: 'string'
                }, {
                    title: '机身二段(℃)',
                    dataIndex: 'temp2',
                    type: 'string'
                }, {
                    title: '机身三段(℃)',
                    dataIndex: 'temp3',
                    type: 'string'
                }, {
                    title: '机颈(℃)',
                    dataIndex: 'temp4',
                    type: 'string'
                }, {
                    title: '口模(℃)',
                    dataIndex: 'temp5',
                    type: 'string'
                }, {
                    title: '转速(r/min)',
                    dataIndex: 'speed',
                    type: 'string'
                },
                /* {
                                    title: '良品率',
                                    dataIndex: 'gYield',
                                    type: 'string'
                                }, {
                                    title: '标准产能',
                                    dataIndex: 'sCapacity',
                                    type: 'string',
                                    // render: (text, record) => ('-')
                                }, {
                                    title: '实际产能',
                                    dataIndex: 'aCapacity',
                                    type: 'string',
                                    // render: (text, record) => ('-')
                                },  {
                                    title: 'OEE',
                                    dataIndex: 'OEE',
                                    type: 'string',
                                    // render: (text, record) => ('-')
                                }*/
            ],
            // 初始化页面的数据 回调函数传入 items 列表
            pageData: function ( num, callback ) {
                var dat = {
                    'PageIndex': 0,
                    'PageSize': 10,
                    'TypeUUID': -1
                }
                callback( self.state.dataList, {
                    // total: pagination.total,
                    nPageSize: 10
                } )
            },

        };
        // Feature = FeatureSetConfig( conf )

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
                let Random = Mock.Random;
                let option = {
                    title: {
                        text: '挤塑成型工艺参数'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: [ '机身一段', '机身二段', '机身三段', '机颈', '口模', '转速' ]
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
                        data: [ '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00' ]
                    },
                    yAxis: [
                        {
                            type: 'value',
                            name: '温度',
                            min: 100,
                            max: 200,
                            interval: 20,
                            axisLabel: {
                                formatter: '{value}℃'
                            }
                            },
                        {
                            type: 'value',
                            name: '转速',
                            min: 0,
                            max: 100,
                            interval: 10,
                            axisLabel: {
                                formatter: '{value} r/min'
                            }
                            }
                        ],
                    series: [
                        {
                            name: '机身一段',
                            type: 'line',
                            // stack: '总量',
                            // data:[120, 132, 101, 134, 90, 230, 210],
                            data: tempData1,
                            smooth: true
                            },
                        {
                            name: '机身二段',
                            type: 'line',
                            // stack: '总量',
                            // data:[220, 182, 191, 234, 290, 330, 310],
                            data: tempData2,
                            smooth: true
                            },
                        {
                            name: '机身三段',
                            type: 'line',
                            // stack: '总量',
                            // data:[150, 232, 201, 154, 190, 330, 410],
                            data: tempData3,
                            smooth: true
                            },
                        {
                            name: '机颈',
                            type: 'line',
                            // stack: '总量',
                            // data:[320, 332, 301, 334, 390, 330, 320],
                            data: tempData4,
                            smooth: true
                            },
                        {
                            name: '口模',
                            type: 'line',
                            // stack: '总量',
                            // data:[820, 932, 901, 934, 1290, 1330, 1320],
                            data: tempData5,
                            smooth: true
                            },
                        {
                            name: '转速',
                            type: 'line',
                            // stack: '总量',
                            // data:[820, 932, 901, 934, 1290, 1330, 1320],
                            yAxisIndex: 1,
                            data: tempData6,
                            smooth: true
                            }
                        ]
                };
                callback( option );
            }
        };

        // Dailychart = FeatureSetConfig( graph_conf )
    }

    render() {

        return (
            <div>
                <Dailychart/>
                <Divider>历史数据</Divider>
                <div style={{height: '320px',overflowX: 'auto'}}>
                    <Feature/>
                </div>
            </div>
        )
    }
}
