/**
 *这是工作中心详情页
 *添加日期:2018.03.06
 *添加人:shaw
 **/
import React, { Component } from 'react';
import { Table, Button, Icon, Row, Col, message } from 'antd';
import { TPostData } from '../../utils/TAjax';
// import workCenterPic from '../../images/assets/AM1.jpg';
let seft

export default class TerminalDetail extends Component {

    constructor( props ) {
        super( props )
        this.state = {
            UUID: props.UUID,
            title: props.title,
            bindedTablesize: 'small', //table尺寸大小
            deviceList:[],
            TDeviceList:[]
        }
        this.url1='/api/TProcess/workcenter';
        this.url2='/api/TIot/dau';
        seft = this;
    }
    componentWillMount(){

        this.getDeviceList();
        this.getDevice();
    }

    componentDidMount() {

    }

    getDeviceList(){
        var dat = {
            PageIndex: 0,
            PageSize: -1,
            TypeUUID: -1,
        }
        TPostData( this.url1, "ListActive", dat,
            ( res )=> {
                console.log("查询到工作中心列表",res);
                let list = [],
                    Ui_list = res.obj.objectlist || [];
                Ui_list.forEach( function ( item, index ) {
                    list.push( {
                        key: index,
                        UUID: item.UUID,
                        Name: item.Name,
                        ID: item.ID,
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

    getDevice(){

        let dat = {
            UUID: this.state.UUID
        }

        TPostData( this.url2, "GetDevice", dat,
            ( res )=> {
                console.log("查询到终端设备列表",res);
                var list = [];
                var Ui_list = res.obj||{};
                this.setState( { TDeviceList:[{...Ui_list,key:'one'}]  } );
            },
            ( error )=> {
                message.info( error );
            }
        )
    }

    addDevice(DeviceUUID){
        var dat = {
            UUID: this.state.UUID,
            DeviceUUID: DeviceUUID
        };
        TPostData(this.url1, "AddDevice", dat,
            ( res )=> {
                //这块请求更新数据 成功回调
                message.success( '添加设备成功');
                this.getDevice();
            },
            ( error )=> {
                message.error( '添加设备失败' );
            }
        )
    }
    //解除设备UUID绑定
    RemoveDevice ( DeviceUUID ){
        var dat = {
            UUID: this.state.UUID,
            // DeviceUUID: DeviceUUID
        };
        TPostData(this.url1, "RemoveDevice", dat,
            ( res )=> {
                //这块请求更新数据 成功回调
                message.success( '解绑设备成功');
                this.getDevice();
            },
            ( error )=> {
                message.error( '解绑设备失败' );
            }
        )
    }

    render() {
        const {detailMessage}=this.props;

        const columns = [
            {
                title: '名称',
                dataIndex: 'Name',
                key: 'Name'
            },
            {
                title: '编号',
                dataIndex: 'ID',
                key: 'ID'
            },
            {
                title: '解绑操作',
                dataIndex: 'UUID',
                render: ( UUID, record ) => {
                    return <a onClick={this.RemoveDevice.bind(this,UUID)}>解绑</a>
                }
            }
        ];
        const deviceColumns = [
            {
                title: '名称',
                dataIndex: 'Name',
                key: 'Name'
            },
            {
                title: '编号',
                dataIndex: 'ID',
                key: 'ID'
            },
            {
                title: '添加设备',
                dataIndex: 'UUID',
                key: 'UUID',
                render: ( UUID, record ) => {
                    return <a onClick={this.addDevice.bind(this,UUID)}>添加</a>
                }
            }
        ];
        return (
            <div>
                {/* <p>基本详情</p> */}
                {/* <div style={{marginTop:25,height:180}}>
                    <Row  type="flex" justify="start" align="middle">
                        <Col span={6}>
                            <div style={{
                                    fontSize:16,
                                    display:'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-evenly',
                                    height: 180}}>
                                <p>编号：<span>{detailMessage.ID}</span></p>
                                <p>IMEI：<span>{detailMessage.IMEI}</span></p>
                            </div>
                        </Col>
                        <Col span={6}>
                            <div style={{
                                    fontSize:16,
                                    display:'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-evenly',
                                    height: 180}}>
                                <p>序列号：<span>{detailMessage.SN}</span></p>
                                <p>SimCard号：<span>{detailMessage.SimCardNo}</span></p>
                            </div>
                        </Col>
                        <Col span={6}>
                            <div style={{
                                    fontSize:16,
                                    display:'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-evenly',
                                    height: 180}}>
                                    <p>出厂日期：<span>{detailMessage.BornDateTime_UTC}</span></p>
                                    <p>激活日期：<span>{detailMessage.ActiveDateTimeB_UTC}</span></p>
                            </div>
                        </Col>
                    </Row>
                </div> */}
                <div>
                    <Row>
                        <Col span={12}>
                            <h4>已绑定的设备</h4>
                            <Table
                                size={this.state.bindedTablesize}
                                dataSource={this.state.TDeviceList}
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
