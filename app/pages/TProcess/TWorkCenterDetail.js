/**
 *这是工作中心详情页
 *添加日期:2018.03.06
 *添加人:shaw
 **/
import React, { Component } from 'react';
import { Table, Button, Icon, Row, Col, message } from 'antd';
// import FeatureSetConfig from '../../components/TCommon/tableConfig';
import { TPostData } from '../../utils/TAjax';
import Immutable from 'immutable';
import workCenterPic from '../../images/assets/AM1.jpg';
let seft

export default class TWorkCenterDetail extends Component {

    constructor( props ) {
        super( props )
        this.state = {
            UUID: props.workcenterUUID,
            title: props.title,
            bindedTablesize: 'small', //table尺寸大小
            workCenterDevList: [],
            deviceList:[]
        }
        this.url1='/api/TProcess/workcenter';
        this.url2='/api/TDevice/device';
        seft = this;
    }
    componentWillMount(){
        /*const config = {
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
                    PageIndex: 0,
                    PageSize: 10,
                    TypeUUID: -1,
                    ModelUUID: -1,
                    WorkshopUUID: -1
                }

                TPostData( this.url, "ListActive", dat, function ( res ) {
                    var list = []
                    var Ui_list = res.obj.objectlist || []
                    console.log("查询到设备列表",res);
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
                seft.state.workCenterDevList.forEach( function ( item ) {
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
                            key: seft.state.workCenterDevList.length + 1,
                            DeviceName: data.Name,
                            DeviceUUID: data.UUID,
                            Name: seft.state.Name,
                            Note: data.Note
                        }

                        seft.state.workCenterDevList.unshift( newItem );
                        let result = Immutable.fromJS( seft.state.workCenterDevList )

                        let resultList = result.map( function ( v, i ) {
                            if ( v.get( 'key' ) == newItem.key ) {
                                return Immutable.fromJS( newItem )
                            } else {
                                return v
                            }
                        } )

                        seft.setState( { workCenterDevList: resultList.toJS() } )
                        callback( true )
                    }, function ( error ) {
                        callback( false )
                    } )
                }
            }
        }
        this.feature = FeatureSetConfig( config );*/
        this.getDeviceList();
        this.getDefine();
    }

    componentDidMount() {
        /*var dat = {
            UUID: seft.state.UUID
        }
        //获取工作中心设备
        TPostData( this.url1, "GetDefine", dat, function ( res ) {
            console.log("查询到工作中心设备列表",res);

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

            seft.setState( { workCenterDevList: list } )

        }, function ( error ) {
            message.info( error );
        }, false )*/
    }

    getDeviceList(){
        var dat = {
            PageIndex: 0,
            PageSize: -1,
            TypeUUID: -1,
            ModelUUID: -1,
            WorkshopUUID: -1
        }
        TPostData( this.url2, "ListActive", dat,
            ( res )=> {
                console.log("查询到设备列表",res);
                let list = [],
                    Ui_list = res.obj.objectlist || [];
                Ui_list.forEach( function ( item, index ) {
                    list.push( {
                        key: index,
                        ID: item.ID,
                        deviceUUID: item.UUID,
                        Name: item.Name,
                        TypeUUID: item.TypeUUID,
                        Status: item.Status,
                        UpdateDateTime: item.UpdateDateTime,
                        Desc: item.Desc,
                        Note: item.Note
                    } )
                } );
                this.setState({deviceList:list});
            },
            ( error )=> {
                message.info( error );
            }
        )

    }

    getDefine(){

        let dat = {
            UUID: this.state.UUID
        }

        TPostData( this.url1, "GetDefine", dat,
            ( res )=> {
                console.log("查询到工作中心设备列表",res);
                var list = [];
                var Ui_list = res.obj.objectlist || [];
                Ui_list.forEach( function ( item, index ) {
                    list.push( {
                        key: index,
                        UUID: item.UUID,
                        DeviceUUID: item.DeviceUUID,
                        DeviceName: item.DeviceName,
                        DeviceID: item.DeviceID,
                        Note: item.Note
                    } )
                } );
                this.setState( { workCenterDevList: list } );
            },
            ( error )=> {
                message.info( error );
            }
        )
    }

    addDevice(DeviceUUID){
        var dat = {
            UUID: seft.state.UUID,
            DeviceUUID: DeviceUUID
        };
        TPostData(this.url1, "AddDevice", dat,
            ( res )=> {
                //这块请求更新数据 成功回调
                message.success( '添加设备成功');
                this.getDefine();
            },
            ( error )=> {
                message.error( '添加设备失败' );
            }
        )
    }
    //解除设备UUID绑定
    RemoveDevice ( DeviceUUID ){
        var dat = {
            UUID: seft.state.UUID,
            DeviceUUID: DeviceUUID
        };
        TPostData(this.url1, "RemoveDevice", dat,
            ( res )=> {
                //这块请求更新数据 成功回调
                message.success( '解绑设备成功');
                this.getDefine();
            },
            ( error )=> {
                message.error( '解绑设备失败' );
            }
        )
    }

    render() {
        let Feature=this.feature;
        const {detailMessage}=this.props;

        const columns = [
            {
                title: '名称',
                dataIndex: 'DeviceName',
                key: 'DeviceName'
            },
            {
                title: '编号',
                dataIndex: 'DeviceID',
                key: 'DeviceID'
            },
            {
                title: '解绑操作',
                dataIndex: 'DeviceUUID',
                render: ( DeviceUUID, record ) => {
                    return <a onClick={this.RemoveDevice.bind(this,DeviceUUID)}>解绑</a>
                }
            }
        ];
        const deviceColumns = [
            {
                title: '名称',
                dataIndex: 'Name',
                key: 'DeviceName'
            },
            {
                title: '编号',
                dataIndex: 'ID',
                key: 'Name'
            },
            {
                title: '添加设备',
                dataIndex: 'deviceUUID',
                render: ( deviceUUID, record ) => {
                    return <a onClick={this.addDevice.bind(this,deviceUUID)}>添加</a>
                }
            }
        ];

        return (
            <div>
                {/* <div style={{marginTop:25,height:180}}>
                    <Row  type="flex" justify="start" align="middle">
                        <Col span={5}><img width={'85%'} src={workCenterPic}/></Col>
                        <Col span={6}>
                            <div style={{
                                    fontSize:16,
                                    display:'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-evenly',
                                    height: 180}}>
                                <p>名称：<span>{detailMessage.Name}</span></p>
                                <p>编号：<span>{detailMessage.ID}</span></p>
                                <p>类型：<span>{detailMessage.TypeName}</span></p>
                            </div>
                        </Col>
                        <Col>
                            <div style={{
                                    fontSize:16,
                                    display:'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-evenly',
                                    height: 180}}>
                                <p>所属车间：{detailMessage.WorkshopName}</p>
                                <p>备注：{detailMessage.Note}</p>
                            </div>
                        </Col>
                    </Row>
                </div> */}
                <div>
                    <Row>
                        <Col span={12}>
                            <h4>已添加设备</h4>
                            <Table
                                size={this.state.bindedTablesize}
                                dataSource={this.state.workCenterDevList}
                                columns={columns}/>
                        </Col>
                        <Col span={1} style={{textAlign:'center'}}>
                            <Icon type="swap" style={{fontSize:25,textAlign:'center',color:'#46affb'}} />
                        </Col>
                        <Col span={11}>
                            {/* <Feature/> */}
                            <span style={{padding:6,fontSize:16}}>设备列表</span>
                            <Table
                                size={seft.state.bindedTablesize}
                                dataSource={this.state.deviceList}
                                columns={deviceColumns}/>
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }
}
