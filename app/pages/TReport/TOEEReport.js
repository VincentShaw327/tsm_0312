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
        let self = this;
        let Random = Mock.Random;
        let machineType = [ '挤塑机系列', '拉线机系列', '绞线机系列', '绕包机系列' ],
            maintainType = [ '日常保养', '一级保养', '二级保养' ];
        const template = {
            obj: {
                'objectlist|15': [
                    {
                        'key|+1': 1,
                        'Time|+1': 19,
                        'totalTime': 1440,
                        'planShutdown': '@natural(480, 600)',
                        'totalShutdown': '@natural(300, 420)',
                        'runTime': '@natural(600, 960)',
                        'actualPTime': '@natural(480, 720)',
                        'TRate': '@natural(40, 70)',
                        'PerformanceRate': '@natural(50, 75)',
                        'defective': '@natural(0, 150)',
                        'gYield': '@natural(80, 95)',
                        'sCapacity': 1200,
                        'aCapacity': '@natural(1000, 1200)',
                        'OEE': '@natural(60, 75)',

                        'machineType': `@pick(${machineType})`,
                        'maintainType': `@pick(${maintainType})`,
                        'planStart': '@date',
                        'now': `@now('day','yyyy-MM-dd')`,
                        'pMon': '@natural(02, 12)',
                        'pDay': '@natural(01, 30)',
                        'charger': '@cname',
                        'age': '@natural(18, 45)',
                        'department': `@pick(['生产部','设备部','维修部'])`,
                    },
                ]
            },
        }
        const dailyReport = Mock.mock( template );
        // console.log('dailyReport',dailyReport);
        this.setState( {
            // dataList:JSON.parse(Jlist).list
            dataList: dailyReport.obj.objectlist
        } )
        const conf = {
            type: 'tableFeature',
            tableTiltle: '报表查询',
            size: 'small', // table每行尺寸
            strKeyWord: '',
            WorkTypeList: [],
            url: '/api/TProcess/workcenter',
            // url: seft.state.server.url + 'Handler_Workstation_V1.ashx',
            // 初始化页面的数据 回调函数传入 items 列表
            pageData: function ( num, callback ) {
                var dat = {
                    'PageIndex': 0,
                    'PageSize': 10,
                    'TypeUUID': -1
                }

                /*DoPost(this.url, "ListActive", dat, function(res) {
            		var list = [];
            		var Ui_list = res.obj.objectlist || [];

            		var totalcount = res.obj.objectlist.length;
            		creatKeyWord = res.obj.objectlist.length;

            		Ui_list.forEach(function(item, index) {
            			list.push({
            				key: index,
            				ID: item.ID,
            				UUID: item.UUID,
            				Name: item.Name,
            				TypeUUID: item.TypeUUID,
            				Status: item.Status,
            				UpdateDateTime: item.UpdateDateTime,
            				Desc: item.Desc,
            				Note: item.Note
            			})
            		})

            		const pagination = {
            			...seft.state.pagination
            		}
            		// Read total count from server
            		// pagination.total = data.totalCount;
            		pagination.total = totalcount;
            		callback(list, {
            			total: pagination.total,
            			nPageSize: 10
            		})
            	}, function(error) {
            		message.info(error);
            	})*/
                callback( self.state.dataList, {
                    // total: pagination.total,
                    nPageSize: 10
                } )
            },
            /*****  页面列名  ******/
            columns: [
                {
                    title: '日期',
                    dataIndex: 'Time',
                    type: 'string',
                    render: ( e ) => ( <span>2018-01-{e}</span> )
                    // 车间描述,备注,
                }, {
                    title: '总可用时间(min)',
                    dataIndex: 'totalTime',
                    type: 'string'
                    // 车间描述,备注,
                }, {
                    title: '计划停机时间(min)',
                    dataIndex: 'planShutdown',
                    type: 'string'
                }, {
                    title: '总停机时间(min)',
                    dataIndex: 'totalShutdown',
                    type: 'string'
                }, {
                    title: '运转时间(min)',
                    dataIndex: 'runTime',
                    type: 'string'
                }, {
                    title: '实际生产时间(min)',
                    dataIndex: 'actualPTime',
                    type: 'string'
                }, {
                    title: '标准产能(pcs)',
                    dataIndex: 'sCapacity',
                    type: 'string',
                    // render: (text, record) => ('-')
                }, {
                    title: '实际产能(pcs)',
                    dataIndex: 'aCapacity',
                    type: 'string',
                    // render: (text, record) => ('-')
                }, {
                    title: '次品量(pcs)',
                    dataIndex: 'defective',
                    type: 'string'
                }, {
                    title: '时间稼动率',
                    dataIndex: 'TRate',
                    type: 'string',
                    render: ( e ) => ( <span>{e}%</span> )
                }, {
                    title: '性能稼动率',
                    dataIndex: 'PerformanceRate',
                    type: 'string',
                    render: ( e ) => ( <span>{e}%</span> )
                }, {
                    title: '良品率',
                    dataIndex: 'gYield',
                    type: 'string',
                    render: ( e ) => ( <span>{e}%</span> )
                }, {
                    title: 'OEE',
                    dataIndex: 'OEE',
                    type: 'string',
                    render: ( e ) => ( <span>{e}%</span> )
                }
            ],
            //信息修改
            Update: function ( data, callback ) {

                let dat = {
                    UUID: data.UUID,
                    TypeUUID: data.TypeUUID,
                    Name: data.Name,
                    ID: data.ID,
                    Desc: data.Desc,
                    Note: data.Note
                }
                DoPost( this.url, 'Update', dat, function ( res ) {
                    //这块请求更新数据 成功回调
                    callback( data );
                } )
            },

            // 删除操作
            Delete: function ( data, callback ) {
                var dat = {
                    UUID: data.UUID
                }

                DoPost( this.url, "Inactive", dat, function ( res ) {
                    //这块请求更新数据 成功回调
                    callback( data )
                } )
            },
            // 创建项目所需的字段 与 更新项目所需的字段
            // rules 规范可见 https://github.com/yiminghe/async-validator
            UType: [
                {
                    name: 'Name',
                    label: '名称',
                    type: 'string',
                    placeholder: '修改车间id时必填',
                    rules: [
                        {
                            min: 5,
                            message: '用户名至少为 5 个字符'
            			}
            		]
            	}, {
                    name: 'TypeUUID',
                    label: '中心类型',
                    type: 'select',
                    options: MtrlTpList
            	}, {
                    name: 'Desc',
                    label: '描述',
                    type: 'string',
                    placeholder: '修改车间id时必填',
                    rules: [
                        {
                            min: 5,
                            message: '用户名至少为 5 个字符'
            			}
            		]
            	}, {
                    name: 'Note',
                    label: '备注',
                    type: 'string',
                    placeholder: '修改车间id时必填',
                    rules: [
                        {
                            min: 1,
                            message: '用户名至少为 5 个字符'
            			}
            		]
            	}
            ],
            RType: [
                {
                    name: 'ModelUUID',
                    label: '工作中心',
                    type: 'select',
                    // hasAllButtom: true,
                    // defaultValue: '-1',
                    width: 180,
                    postJson: {
                        postUrl: '/api/TProcess/workcenter',
                        method: 'ListActive',
                        dat: {
                            PageIndex: 0,
                            PageSize: -1,
                            TypeUUID: -1,
                            CategoryUUID: -1,
                            VendorUUID: -1
                        }
                    },
                    options: [ {
                            text: "型号1",
                            value: '1'
                     },
                        {
                            text: "型号2",
                            value: '2'
                     },
                        {
                            text: "型号3",
                            value: '3'
                     }
                 ]
                },
                {
                    key: '1',
                    name: 'ID',
                    label: '日期',
                    type: 'date',
                    placeholder: '请输入搜索内容'
            	}
            ],
            // 查询操作回调
            //添加需要加上的变量.
            Retrieve: function ( data, callback ) {
                /*this.strKeyWord = data.id;
                var dat = {
                	"nPageIndex": 0,
                	"nPageSize": -1,
                	'ID': data.ID
                }
                this.uProductUUID = data.stype;
                DoPost(this.url, "ListActive", dat, function(res) {

                	var list = [],
                		Ui_list = res.obj.objectlist || [],
                		totalcount = res.obj.totalcount
                	let i = 0;
                	Ui_list.forEach(function(ele) {
                		ele.key = i++;
                	});

                	// 查询成功 传入列表数据
                	callback(Ui_list);

                }, function(error) {
                	message.info(error);
                })*/
                callback( self.state.dataList, {
                    // total: pagination.total,
                    nPageSize: 10
                } )
            }

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
                let app = {};
                var posList = [
                    'left', 'right', 'top', 'bottom',
                    'inside',
                    'insideTop', 'insideLeft', 'insideRight', 'insideBottom',
                    'insideTopLeft', 'insideTopRight', 'insideBottomLeft', 'insideBottomRight'
                ];
                app.configParameters = {
                    rotate: {
                        min: -90,
                        max: 90
                    },
                    align: {
                        options: {
                            left: 'left',
                            center: 'center',
                            right: 'right'
                        }
                    },
                    verticalAlign: {
                        options: {
                            top: 'top',
                            middle: 'middle',
                            bottom: 'bottom'
                        }
                    },
                    /*position: {
                        options: echarts.util.reduce(posList, function (map, pos) {
                            map[pos] = pos;
                            return map;
                        }, {})
                    },*/
                    distance: {
                        min: 0,
                        max: 100
                    }
                };
                app.config = {
                    rotate: 90,
                    align: 'left',
                    verticalAlign: 'middle',
                    position: 'insideBottom',
                    distance: 15,
                    onChange: function () {
                        var labelOption = {
                            normal: {
                                rotate: app.config.rotate,
                                align: app.config.align,
                                verticalAlign: app.config.verticalAlign,
                                position: app.config.position,
                                distance: app.config.distance
                            }
                        };
                        myChart.setOption( {
                            series: [ {
                                label: labelOption
                            }, {
                                label: labelOption
                            }, {
                                label: labelOption
                            }, {
                                label: labelOption
                            } ]
                        } );
                    }
                };
                var labelOption = {
                    normal: {
                        show: true,
                        position: app.config.position,
                        distance: app.config.distance,
                        align: app.config.align,
                        verticalAlign: app.config.verticalAlign,
                        rotate: app.config.rotate,
                        formatter: '{c}  {name|{a}}',
                        fontSize: 16,
                        rich: {
                            name: {
                                textBorderColor: '#fff'
                            }
                        }
                    }
                };
                let option = {
                    color: [ '#003366', '#006699', '#4cabce', '#e5323e' ],
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    legend: {
                        data: [ '时间稼动率', '性能稼动率', '良品率', 'OEE' ]
                    },
                    toolbox: {
                        show: true,
                        orient: 'vertical',
                        left: 'right',
                        top: 'center',
                        feature: {
                            mark: { show: true },
                            dataView: { show: true, readOnly: false },
                            magicType: { show: true, type: [ 'line', 'bar', 'stack', 'tiled' ] },
                            restore: { show: true },
                            saveAsImage: { show: true }
                        }
                    },
                    calculable: true,
                    xAxis: [
                        {
                            type: 'category',
                            axisTick: { show: false },
                            data: [ '2018-01-19', '2018-01-20', '2018-01-21', '2018-01-22', '2018-01-23' ]
                        }
                    ],
                    yAxis: [
                        /*{
                            type: 'value'
                        }*/
                        {
                            type: 'value',
                            name: '百分比',
                            min: 0,
                            max: 100,
                            interval: 10,
                            axisLabel: {
                                formatter: '{value}%'
                            }
                        },
                    ],
                    series: [
                        {
                            name: '时间稼动率',
                            type: 'bar',
                            barGap: 0,
                            // label: labelOption,
                            data: [ 42, 52, 51, 54, 69 ]
                        },
                        {
                            name: '性能稼动率',
                            type: 'bar',
                            // label: labelOption,
                            data: [ 62, 48, 69, 53, 59 ]
                        },
                        {
                            name: '良品率',
                            type: 'bar',
                            // label: labelOption,
                            data: [ 75, 93, 90, 85, 89 ]
                        },
                        /*{
                            name: 'OEE',
                            type: 'bar',
                            label: labelOption,
                            data: [58, 57, 61, 69, 60]
                        },*/
                        {
                            name: 'OEE',
                            type: 'line',
                            // yAxisIndex: 1,
                            // label: labelOption,
                            data: [ 58, 57, 61, 69, 60 ]
                            // data:[63, 68, 36, 45, 63, 66, 50.3, 53.4, 53.0, 66.5, 52.0, 46.2]
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
                {/* <Collapse bordered={false} defaultActiveKey={['1']} style={{ marginTop: '1%'}}>
                    <Panel key="1" header="OEE统计图表" style={{borderRadius: '4px',border: '0',overflow: 'hidden',fontSize: '12px'}}>
                    </Panel>
                </Collapse> */}
                {/* <Dailychart/> */}
                <Divider>历史数据</Divider>
                <div style={{height: '320px',overflowX: 'auto'}}>
                    {/* <Feature/> */}
                </div>
            </div>
        )
    }
}
