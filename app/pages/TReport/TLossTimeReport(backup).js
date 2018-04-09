/**
 *这是设备列表页
 *添加日期:2017.12.06
 *添加人:shaw
 **/
/******引入ant或其他第三方依赖文件*******************/
import React, { Component } from 'react';
import { Row, Col, Divider, List } from 'antd';
import FeatureSetConfig from '../../components/TCommon/tableConfig';
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
                        'sTime|+1': 7,
                        'eTime|+1': 8,
                        'totalTime': 1440,
                        'deviceNum': '#11',
                        'planShutdown': '@natural(10, 20)',
                        'actualShutdown': '@natural(10, 20)',
                        'runTime': '@natural(600, 960)',
                        'actualPTime': '@natural(480, 720)',
                        'TRate': '@natural(40, 70)',
                        'PerformanceRate': '@natural(50, 75)',
                        'defective': '@natural(0, 150)',
                        'gYield': '@natural(80, 95)',
                        'sCapacity': 1200,
                        'aCapacity': '@natural(1000, 1200)',
                        'OEE': '@natural(60, 75)',
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
            // url: seft.state.server.url + 'Handler_Workstation_V1.ashx',
            url: '/api/TProcess/workcenter',
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
                        callback(self.state.dataList, {
                        	total: pagination.total,
                        	nPageSize: 10
                        })
                    }, function(error) {
                        message.info(error);
                    }
                )*/

                callback( self.state.dataList, {
                    total: 'pagination.total',
                    nPageSize: 10
                } )
            },

            /*****  页面列名  ******/
            columns: [
                {
                    title: '生产时段',
                    dataIndex: 'Time',
                    type: 'string',
                    render: ( e, record ) => ( <span>{record.sTime}:00~{record.eTime}:00</span> )
            	}, {
                    title: '工作中心编号',
                    dataIndex: 'deviceNum',
                    type: 'string'
            	}, {
                    title: '计划停机时间(min)',
                    dataIndex: 'planShutdown',
                    type: 'string'
            	}, {
                    title: '实际停机时间(min)',
                    dataIndex: 'actualShutdown',
                    type: 'string'
            	}, {
                    title: '时间稼动率',
                    dataIndex: 'TRate',
                    type: 'string'
            	}, {
                    title: '性能稼动率',
                    dataIndex: 'PerformanceRate',
                    type: 'string'
            	}, {
                    title: '良品率',
                    dataIndex: 'gYield',
                    type: 'string'
            	}, {
                    title: 'OEE',
                    dataIndex: 'OEE',
                    type: 'string',
                    // render: (text, record) => ('-')
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
            	},
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
                    name: 'workshop',
                    label: '车间',
                    type: 'select',
                    hasAllButtom: true,
                    defaultValue: '-1',
                    width: 150,
                    postJson: {
                        postUrl: '/api/TFactory/workshop',
                        method: 'ListActive',
                        dat: {
                            PageIndex: 0,
                            PageSize: -1,
                            FactoryUUID: -1,
                            TypeUUID: -1,
                            KeyWord: ""
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
                    name: 'workStation',
                    key: 'workStation',
                    label: '工作中心',
                    type: 'select',
                    hasAllButtom: true,
                    defaultValue: '-1',
                    width: 150,
                    postJson: {
                        postUrl:'/api/TProcess/workcenter',
                        method: 'ListActive',
                        dat: {
                            nPageIndex: 0,
                            nPageSize: -1,
                            ModelUUID: -1,
                            TypeUUID: -1,
                            KeyWord: ""
                        }
                    },
                    options: [
                        {
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
            	},
            ],
            // 查询操作回调
            //添加需要加上的变量.
            Retrieve: function ( data, callback ) {
                callback( self.state.dataList, {
                    total: 'pagination.total',
                    nPageSize: 10
                } )
            }
        };

        Feature = FeatureSetConfig( conf )

        const graph_conf = {
            type: 'graphList', // tableList graphList simpleObject complexObject
            EchartStyle: {
                width: '100%',
                height: '350px',
                border: '1px solid #e7e2e2',
                background: '#eeeeee',
                borderRadius: '6px'
            },
            // 初始化展现的数据，使用callback 回传列表数据
            // 需要手动添加唯一id key
            // callback 组件数据的回调函数(接受列表数据参数)
            initData: function ( callback ) {
                // 参考echarts 参数
                /*var labelTop = {
                	normal: {
                		label: {
                			show: true,
                			position: 'center',
                			formatter: '{b}',
                			textStyle: {
                				baseline: 'bottom'
                			}
                		},
                		labelLine: {
                			show: false
                		}
                	}
                };
                var labelFromatter = {
                	normal: {
                		label: {
                			formatter: function(params) {
                				return 100 - params.value + '%'
                			},
                			textStyle: {
                				baseline: 'top'
                			}
                		}
                	}
                }
                var labelBottom = {
                	normal: {
                		color: '#ccc',
                		label: {
                			show: true,
                			position: 'center'
                		},
                		labelLine: {
                			show: false
                		}
                	},
                	emphasis: {
                		color: 'rgba(0,0,0,0)'
                	}
                };
                var radius = [32, 45];
                var option = {
                    legend: {
                        x: 'left',
                        y: 'top',
                        data: ['时间稼动率', '性能稼动率', '良品率', 'OEE']
                    },
                    title: {
                        text: '',
                        subtext: '',
                        x: 'center'
                    },
                    toolbox: {
                        show: true,
                        feature: {
                            dataView: {
                            	show: true,
                            	readOnly: false
                            },
                            magicType: {
                            	show: true,
                            	type: [
                            		'pie', 'funnel'
                            	],
                            	option: {
                            		funnel: {
                            			width: '20%',
                            			height: '30%',
                            			itemStyle: {
                            				normal: {
                            					label: {
                            						formatter: function(params) {
                            							return 'other\n' + params.value + '%\n'
                            						},
                            						textStyle: {
                            							baseline: 'middle'
                            						}
                            					}
                            				}
                            			}
                            		}
                            	}
                            },
                            restore: {
                            	show: true
                            },
                            saveAsImage: {
                            	show: true
                            }
                        }
                    },
                    series: [
                    {
                    type: 'pie',
                    center: [
                    	'20%', '63%'
                    ],
                    radius: radius,
                    y: '26%', // for funnel
                    x: '10%', // for funnel
                    itemStyle: labelFromatter,
                    data: [
                    	{
                    		name: 'other',
                    		value: 11,
                    		itemStyle: labelBottom
                    	}, {
                    		name: '时间稼动率',
                    		value: 89,
                    		itemStyle: labelTop
                    	}
                    ]
                    }, {
                    type: 'pie',
                    center: [
                    	'40%', '63%'
                    ],
                    radius: radius,
                    y: '55%', // for funnel
                    x: '40%', // for funnel
                    itemStyle: labelFromatter,
                    data: [
                    	{
                    		name: 'other',
                    		value: 85,
                    		itemStyle: labelBottom
                    	}, {
                    		name: '性能稼动率',
                    		value: 15,
                    		itemStyle: labelTop
                    	}
                    ]
                    }, {
                    type: 'pie',
                    center: [
                    	'60%', '63%'
                    ],
                    radius: radius,
                    y: '55%', // for funnel
                    x: '60%', // for funnel
                    itemStyle: labelFromatter,
                    data: [
                    	{
                    		name: 'other',
                    		value: 27,
                    		itemStyle: labelBottom
                    	}, {
                    		name: '良品率',
                    		value: 73,
                    		itemStyle: labelTop
                    	}
                    ]
                    }, {
                    type: 'pie',
                    center: [
                    	'80%', '63%'
                    ],
                    radius: radius,
                    y: '55%', // for funnel
                    x: '80%', // for funnel
                    itemStyle: labelFromatter,
                    data: [
                    	{
                    		name: 'other',
                    		value: 5,
                    		itemStyle: labelBottom
                    	}, {
                    		name: 'OEE',
                    		value: 95,
                    		itemStyle: labelTop
                    	}
                    ]
                    }
                    ]
                };*/
                let option = {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            crossStyle: {
                                color: '#999'
                            }
                        }
                    },
                    toolbox: {
                        feature: {
                            dataView: { show: true, readOnly: false },
                            magicType: { show: true, type: [ 'line', 'bar' ] },
                            restore: { show: true },
                            saveAsImage: { show: true }
                        }
                    },
                    legend: {
                        data: [ '实际产量', '次品量', 'OEE' ]
                    },
                    xAxis: [
                        {
                            type: 'category',
                            data: [ '07:00~08:00', '08:00~09:00', '09:00~10:00', '10:00~11:00', '11:00~12:00', '12:00~13:00', '13:00~14:00', '14:00~15:00', '15:00~16:00', '16:00~17:00', '17:00~18:00', '18:00~19:00' ],
                            axisPointer: {
                                type: 'shadow'
                            }
                    }
                ],
                    yAxis: [
                        {
                            type: 'value',
                            name: '产量',
                            min: 0,
                            max: 1300,
                            interval: 200,
                            axisLabel: {
                                formatter: '{value} pcs'
                            }
                    },
                        {
                            type: 'value',
                            name: 'OEE',
                            min: 0,
                            max: 100,
                            interval: 10,
                            axisLabel: {
                                formatter: '{value} %'
                            }
                    }
                ],
                    series: [
                        {
                            name: '实际产量',
                            type: 'bar',
                            data: [ 1000, 1053, 1103, 956, 756, 1046, 1011, 1089, 1035, 1136, 1102, 1096 ]
                    },
                        {
                            name: '次品量',
                            type: 'bar',
                            data: [ 74, 53, 41, 39, 86, 70, 175, 182, 48, 30, 22, 26 ]
                    },
                        {
                            name: 'OEE',
                            type: 'line',
                            yAxisIndex: 1,
                            data: [ 63, 68, 36, 45, 63, 66, 50.3, 53.4, 53.0, 66.5, 52.0, 46.2 ]
                    }
                ]
                };

                callback( option );
            }
        };

        Dailychart = FeatureSetConfig( graph_conf )
    }

    render() {
        const data = [
            {
                title: '洪模具,',
                time: '16:32:45',
                space: 4
          },
            {
                title: '等模具/改制顶杆,',
                time: '17:54:15',
                space: 20
          },
            {
                title: '电加热故障,',
                time: '18:32:17',
                space: 6
          },
            {
                title: '调换产品,',
                time: '19:42:22',
                space: 14
          },
            {
                title: '斜模调整,',
                time: '22:46:05',
                space: 23
          },
            {
                title: '钢印调整/更换,',
                time: '07:31:11',
                space: 12
          },
            {
                title: '模具损坏/更换,',
                time: '19:52:51',
                space: 7
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
        return (
            <div>
                <Divider>状态统计</Divider>
                <Row gutter={16}>
                  <Col className="gutter-row" span={12}>
                    <div className="gutter-box">
                        <Dailychart/>
                    </div>
                  </Col>
                  <Col className="gutter-row" span={12}>
                    <div className="gutter-box">
                        <div style={{border:'1px solid #dcd9d9',height:350}}>
                            <div style={{borderBottom:'1px solid #dcd9d9',textAlign:'center',color:'#b84428',fontSize:22}}>停机日志</div>
                            <List
                              itemLayout="horizontal"
                              // size="small"
                              dataSource={data}
                              // pagination={pagination}
                              renderItem={item => (
                                <List.Item >
                                  {/* <List.Item.Meta
                                    avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                                    title={<a href="https://ant.design">{item.title}</a>}
                                    description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                                  /> */}
                                  <Row gutter={16} style={{border:'solid 0px',width:'100%'}}>
                                    <Col className="gutter-row" span={3}>
                                      <div className="gutter-box">
                                          <span>{item.time}</span>
                                      </div>
                                    </Col>
                                    <Col className="gutter-row" span={15}>
                                      <div className="gutter-box">
                                          <span style={{marginLeft:8}}>{item.title}<span style={{color:'red'}}>{item.space}</span>分钟;</span>
                                      </div>
                                    </Col>
                                  </Row>
                                </List.Item>
                              )}
                            />
                        </div>
                    </div>
                  </Col>
                </Row>
                <Divider>设备状态日志</Divider>
                <div style={{height: '240px',overflowX: 'auto',}}>
                    <Feature/>
                </div>
                {/* <Collapse bordered={false} defaultActiveKey={['1']} >
                    <Panel key="1" header="OEE统计图表" style={{borderRadius: '4px',border: '0',overflow: 'hidden',fontSize: '12px'}}>
                    </Panel>
                </Collapse> */}
            </div>
        )
    }
}
