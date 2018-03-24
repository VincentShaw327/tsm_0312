/**
 *这是工作中心详情页
 *添加日期:2018.03.06
 *添加人:shaw
 **/
import React, { Component } from 'react';
import FeatureSetConfig from '../../components/TCommon/shawCommon/tableConfig';
// import FeatureSetConfig from '../topBCommon/FeatureSetConfig';
import { TPostData } from '../../utils/TAjax';
import Immutable from 'immutable';
import { Table, Button, Icon, Row, Col, messag } from 'antd';
let seft

export default class TWorkCenterDetail extends Component {

    constructor( props ) {
        super( props )
        this.state = {
            UUID: props.workcenterUUID,
            title: props.title,
            bindedTablesize: 'small', //table尺寸大小
            selDevList: []
        }
        this.url1='/api/TProcess/workcenter';
        this.url2='/api/TDevice/device';
        seft = this;
    }
    componentWillMount(){
        const config = {
            type: 'tableFeature',
            size: 'small', // table每行尺寸
            url: '/api/TDevice/device',
            columns: [
                {
                    title: '名称',
                    dataIndex: 'Name',
                    type: 'string'
                    // 车间描述,备注,
                }, {
                    title: '类型',
                    dataIndex: 'TypeUUID',
                    type: 'string'
                }, {
                    title: '描述',
                    dataIndex: 'Desc',
                    type: 'string'
                }, {
                    title: '修改时间',
                    dataIndex: 'UpdateDateTime',
                    type: 'string'
                }, {
                    title: '备注',
                    dataIndex: 'Note',
                    type: 'string'
                }, {
                    title: '操作',
                    dataIndex: 'Status',
                    type: 'operate', // 操作的类型必须为 operate
                    btns: [
                        {
                            text: '绑定当前工作空间',
                            type: 'bind'
                        }
                    ]
                }
            ],
            RType: [
                {
                    name: 'KeyWord',
                    label: '搜索内容',
                    type: 'string',
                    placeholder: '请输入搜索内容'
                }
            ],
            // 初始化页面的数据 回调函数传入 items 列表
            pageData: function ( num, callback ) {
                var dat = {
                    'PageIndex': 0,
                    'PageSize': 10,
                    'ModelUUID': -1,
                    'WorkshopUUID': -1
                }

                TPostData( this.url, "ListActive", dat, function ( res ) {
                    var list = []
                    var Ui_list = res.obj.objectlist || []

                    var totalcount = res.obj.objectlist.length;
                    Ui_list.forEach( function ( item, index ) {
                        list.push( {
                            key: index,
                            ID: item.ID,
                            UUID: item.UUID,
                            Name: item.Name,
                            TypeUUID: item.TypeUUID,
                            Status: item.Status,
                            UpdateDateTime: item.UpdateDateTime,
                            Desc: item.Desc,
                            Note: item.Note
                        } )
                    } )

                    const pagination = {
                        ...seft.state.pagination
                    }
                    // Read total count from server
                    // pagination.total = data.totalCount;
                    pagination.total = totalcount;
                    callback( list, {
                        total: pagination.total,
                        nPageSize: 8
                    } )
                }, function ( error ) {
                    message.info( error );
                } )
            },
            // 查询操作回调
            Retrieve: function ( data, callback ) {
                var dat = {
                    "nPageIndex": 0,
                    "nPageSize": -1,
                    'ID': data.ID,
                    'KeyWord': data.KeyWord
                }
                this.uProductUUID = data.stype;
                TPostData( this.url, "ListActive", dat, function ( res ) {
                    var list = [],
                        Ui_list = res.obj.objectlist || [],
                        totalcount = res.obj.totalcount
                    let i = 0;
                    Ui_list.forEach( function ( ele ) {
                        ele.key = i++;
                    } );

                    // 查询成功 传入列表数据
                    callback( Ui_list );

                }, function ( error ) {
                    message.info( error );
                } )
            },
            //绑定工作中心
            bind: function ( data, callback ) {

                var dat = {
                        UUID: seft.state.UUID,
                        DeviceUUID: data.UUID
                    },
                    // 判断是否存在此设备
                    isExisted = false;
                seft.state.selDevList.forEach( function ( item ) {
                    if ( item.DeviceUUID == data.UUID ) {
                        isExisted = true
                        callback( false ) //已添加过此机台， 重复添加， 显示添加失败
                        return
                    }
                } );

                if ( !isExisted ) {
                    TPostData( seft.state.server.resUrl + 'Handler_Workstation_V1.ashx', "AddDevice", dat, function ( res ) {
                        //这块请求更新数据 成功回调
                        var newItem = {
                            key: seft.state.selDevList.length + 1,
                            DeviceName: data.Name,
                            DeviceUUID: data.UUID,
                            Name: seft.state.Name,
                            Note: data.Note
                        }

                        seft.state.selDevList.unshift( newItem );
                        let result = Immutable.fromJS( seft.state.selDevList )

                        let resultList = result.map( function ( v, i ) {
                            if ( v.get( 'key' ) == newItem.key ) {
                                return Immutable.fromJS( newItem )
                            } else {
                                return v
                            }
                        } )

                        seft.setState( { selDevList: resultList.toJS() } )
                        callback( true )
                    }, function ( error ) {
                        callback( false )
                    } )
                }
            }
        }
        this.feature = FeatureSetConfig( config );
    }

    componentDidMount() {
        //seft.UUID详情查询
        var dat = {
            UUID: seft.state.UUID
        }
        //获取工作详情
        TPostData(this.url1, "GetDetail", dat, function ( res ) {
            var WkItem = res.obj || {}
            seft.setState( {
                ID: WkItem.ID,
                UUID: WkItem.UUID,
                Name: WkItem.Name,
                TypeUUID: WkItem.TypeUUID,
                Status: WkItem.Status,
                UpdateDateTime: WkItem.UpdateDateTime,
                Desc: WkItem.Desc,
                Note: WkItem.Note
            } )
        }, function ( error ) {
            message.info( error );
        }, false )
        //获取工作中心设备
        TPostData( this.url1, "GetDefine", dat, function ( res ) {
            var list = [];
            var Ui_list = res.obj.objectlist || [];

            var totalcount = res.obj.objectlist.length;
            Ui_list.forEach( function ( item, index ) {
                list.push( {
                    key: index,
                    UUID: item.UUID,
                    DeviceUUID: item.DeviceUUID,
                    DeviceName: item.DeviceName,
                    Name: item.Name,
                    Note: item.Note
                } )
            } )

            seft.setState( { selDevList: list } )

        }, function ( error ) {
            message.info( error );
        }, false )
    }

    //解除设备UUID绑定
    Unbind = ( DeviceUUID ) => {

        var dat = {
                UUID: seft.state.UUID,
                DeviceUUID: DeviceUUID
            },
            deviceList = Immutable.fromJS( seft.state.selDevList ),
            resultList = [] // 判断是否存在此设备

        resultList = deviceList.filter( function ( v, i ) {
            if ( v.get( 'DeviceUUID' ) !== DeviceUUID ) {
                return true;
            }
        } )

        TPostData( seft.state.server.resUrl + 'Handler_Workstation_V1.ashx', "RemoveDevice", dat, function ( res ) {
            //这块请求更新数据 成功回调
            seft.setState( { selDevList: resultList.toJS() } )
            message.success( '解绑成功' );
        }, function ( error ) {
            message.error( '解绑失败' );
        } )
    }

    render() {
        let Feature=this.feature;
        //绑定设备列表列名
        const columns = [
            {
                title: '设备',
                dataIndex: 'DeviceName',
                key: 'DeviceName'
			}, {
                title: '工作中心',
                dataIndex: 'Name',
                key: 'Name'
			}, {
                title: '备注',
                dataIndex: 'Note',
                key: 'Note'
			}, {
                title: '解绑操作',
                dataIndex: 'operation',
                render: ( text, record ) => {
                    const { editable } = record;
                    return (
                        <div className="editable-row-operations">
                            <a onClick={() => seft.Unbind(record.DeviceUUID)}>解绑</a>
                        </div>
                    )
                }
            }
        ]

        return (
            <div style={{display: 'flex',flexFlow: 'column',minHeight: '734px'}}>
                <Row style={{marginTop: '1%',border: 'solid 1px #80808029',padding: '1%'}}>
                    <Col span={3} offset={1}>名称: {seft.state.Name}</Col>
                    <Col span={4}>中心类别:
                        <span style={{color: '#1fbf1f',fontSize: '15px'}}>
                            {seft.state.TypeUUID}
                        </span>
                    </Col>
                    <Col span={3}>状态: {seft.state.Status}</Col>
                    <Col span={5}>描述: {seft.state.Desc}</Col>
                    <Col span={4}>备注: {seft.state.Note}</Col>
                </Row>
                <Row style={{padding: '0%',marginTop: '1%'}}>
                    <Col span={12} style={{border: 'solid 1px #80808029',padding: '0 1%'}}>
                        <h4>已添加设备</h4>
                        <Table size={seft.state.bindedTablesize} dataSource={seft.state.selDevList} columns={columns}/>
                    </Col>
                    <Col span={1}></Col>
                    <Col span={11} style={{border: 'solid 1px #80808029',padding: '0 1%'}}>
                        <Feature/>
                    </Col>
                </Row>
            </div>
        )
    }
}
