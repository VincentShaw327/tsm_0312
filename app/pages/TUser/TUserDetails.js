/**
 *这是用户详情页
 *添加日期:2018.03.06
 *添加人:shaw
 **/

import React, { Component } from 'react';
import { Table, Button, Icon, Row, Col, message, Divider } from 'antd';
import FeatureSetConfig from '../../components/TCommon/shawCommon/tableConfig';
import { TPostData } from '../../utils/TAjax';
let seft
let creatKeyWord;
let UserUUID;


export default class TUserDetails extends Component {
    constructor( props ) {
        super( props )
        //组件外的指针.
        const {location}=this.props
        this.state = {
            pagination: {
                nPageIndex: '1',
                nPageSize: '8'
            },
            params: {
                nPageIndex: '1',
                nPageSize: '8',
                strKeyWord: ""
            },
            // UserUUID: this.props.queryUUID,
            UserUUID:location.state.UUID,
            Name: '',
            ID: '',
            Phone: '',
            Desc: '',
            Note: '',
            selGroupList:[]
        }
        //组件内的指针
        this.url='/api/TUser/account';
        seft = this;
        // console.log('传过来的数值是:',this.props);
        // console.log('传过来的数值是:',location);
        // console.log('UUID是:',this.state.UserUUID);
    }

    componentWillMount(){
        const config = {
            type: 'tableFeature',
            uProductUUID: 0,
            strKeyWord: '',
            isUpdate: true,
            url: '/api/TUser/group',
            // url: 'http://demo.sc.mes.top-link.me/service/Handler_Group_V1.ashx',
            columns: [
                {
                    title: '名称',
                    dataIndex: 'Name',
                    type: 'string'
                },
                {
                    title: '描述',
                    dataIndex: 'Desc',
                    type: 'string'
                }, {
                    title: '添加权限',
                    dataIndex: 'uMachineUUID',
                    type: 'operate', // 操作的类型必须为 operate
                    btns: [
                        {
                            text: '添加',
                            type: 'bind'
                        }
                    ]
                }
            ],

            UType: [
                {
                    name: 'Name',
                    label: '车间名称',
                    type: 'string',
                    placeholder: ' ',
                    rules: [
                        {
                            min: 5,
                            message: '用户名至少为 5 个字符'
                        }
                    ]
                }, {
                    name: 'ID',
                    label: '车间id',
                    type: 'string',
                    placeholder: ' ',
                    rules: [
                        {
                            min: 5,
                            message: '用户名至少为 5 个字符'
                        }
                    ]
                }, {
                    name: 'Desc',
                    label: '车间描述',
                    type: 'string',
                    placeholder: ' ',
                    rules: [
                        {
                            min: 5,
                            message: '用户名至少为 5 个字符'
                        }
                    ]
                }, {
                    name: 'Note',
                    label: '车间备注',
                    type: 'string',
                    placeholder: ' ',
                    rules: [
                        {
                            min: 5,
                            message: '用户名至少为 5 个字符'
                        }
                    ]
                }
            ],

            pageData: function ( num, callback ) {
                var dat = {
                    PageIndex: num - 1,
                    PageSize: 8
                };

                TPostData( this.url, "ListActive", dat, function ( res ) {

                    var list = [];
                    var Ui_list = res.obj.objectlist || [];

                    var totalcount = res.obj.totalcount;
                    creatKeyWord = totalcount;

                    Ui_list.forEach( function ( item, index ) {
                        list.push( {
                            key: index,

                            UUID: item.UUID,
                            Name: item.Name,
                            ID: item.ID,
                            Desc: item.Desc,
                            Note: item.Note
                        } )
                    } )

                    const pagination = {
                        ...seft.state.pagination
                    }

                    pagination.total = totalcount;

                    callback( list, {
                        total: pagination.total,
                        nPageSize: 8
                    } )
                }, function ( error ) {
                    message.info( error );
                } )
            },

            Create: function ( data, callback ) {
                creatKeyWord++;
                let keyWord = creatKeyWord;
                let dat = {
                    key: keyWord,
                    FactoryUUID: data.FactoryUUID,
                    TypeUUID: data.TypeUUID,
                    Name: data.Name,
                    ID: data.ID
                }
                HandleCreateform( this.url, "Add", dat, function ( res ) {
                    //这块请求更新数据 成功回调
                    callback( dat );
                } )
            },

            Update: function ( data, callback ) {
                let dat = {
                    UUID: data.UUID,
                    FactoryUUID: data.FactoryUUID,
                    TypeUUID: data.TypeUUID,
                    Name: data.Name,
                    ID: data.ID,
                    Desc: data.Desc,
                    Note: data.Note
                }
                TPostData( this.url, 'Update', dat, function ( res ) {
                    callback( data );
                } )
            },
            // 删除操作
            Delete: function ( data, callback ) {
                var dat = {
                    UUID: data.UUID,
                    GroupUUID: data.GroupUUID
                }
                TPostData( this.url, "RemoveGroup", dat, function ( res ) {
                    callback( data )
                } )

            },
            //绑定操作
            bind: function ( data, callback ) {
                var dat = {
                    UUID: seft.state.UserUUID,
                    GroupUUID: data.UUID
                }
                TPostData(this.url, "AddGroup", dat, function ( res ) {
                    if ( res.err === 0 ) {
                        seft.getUserAuthority();
                        callback( "success" );
                    } else if ( res.err === 1 ) {
                        callback( "repeat" );
                    } else {
                        callback( "error" );
                    }
                } )
            },

            Retrieve: function ( data, callback ) {
                this.strKeyWord = data.id;
                var dat = {
                    "nPageIndex": 0,
                    "nPageSize": -1,
                    "uFactoryUUID": -1,
                    "uWorkshopTypeUUID": this.strKeyWord == "" ?-1 :this.strKeyWord,
                    "uWorkshopAdminUUID": -1
                }
                this.uProductUUID = data.stype;
                TPostData( this.url, "Workshop_List", dat, function ( res ) {
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

        };
        this.feature = FeatureSetConfig( config );
    }

    componentDidMount() {
        TPostData( this.url, "ListActive", {PageIndex: 0,PageSize: -1},
            function ( res ) {
                var Ui_list = res.obj.objectlist || [];
                Ui_list.forEach( function ( item, index ) {
                    if ( item.UUID == seft.state.UserUUID ) {
                        seft.state.Name = item.Name,
                        seft.state.ID = item.ID,
                        seft.state.Phone = item.Phone,
                        seft.state.Desc = item.Desc,
                        seft.state.Note = item.Note
                    }
                } )
            },
            function ( error ) {
                message.info( error );
            },
            false
        )
        seft.getUserAuthority();
    }
    //解除绑定.
    unbind = ( res ) => {
        // var dat = {UUID: seft.state.UserUUID,GroupUUID: res}
        TPostData( this.url, "RemoveGroup", {UUID: seft.state.UserUUID,GroupUUID: res},
            function ( res ) {
                if ( res.err === 0 ) {
                    seft.getUserAuthority();
                    message.info( '解绑成功' );
                }
            },
            function ( error ) {
                message.info( error );
            }, false
        )
    }
    //用户权限组列表
    getUserAuthority = () => {
        var dat = {
            PageIndex: 0,
            PageSize: -1,
            UUID: seft.state.UserUUID
        }
        //用户组列表.
        TPostData( this.url, "GetGroups", dat, function ( res ) {
            var list = [];
            var Ui_list = res.obj.objectlist || [];
            //Desc ID Name Note UUID
            console.log("查询到权限组列表:",res);
            var totalcount = res.obj.totalcount;
            Ui_list.forEach( function ( item, index ) {
                list.push( {
                    key: index,

                    GroupName: item.GroupName,
                    GroupID: item.GroupID,
                    ID: item.ID,
                    LoginName: item.LoginName,
                    GroupUUID: item.GroupUUID,
                    UUID: item.UUID
                } )
            } )
            seft.setState( { selGroupList: list } )
        }, function ( error ) {
            message.info( error );
        }, false )
    }

    render() {
        let Feature=this.feature;
        const columns = [
            {
                title: '名称',
                dataIndex: 'GroupName',
                type: 'string'
            }, {
                title: '编号',
                dataIndex: 'GroupID',
                type: 'string'
            }, {
                title: '解除权限',
                dataIndex: 'operation',
                render: ( text, record ) => {
                    const { editable } = record;
                    return ( <div className="editable-row-operations">
                        <a onClick={() => seft.unbind(record.GroupUUID)}>解除</a>
                    </div> )
                }
            }
        ]
        return (
            <div style={{display: 'flex',flexFlow: 'column',minHeight: '734px'}}>
                <Row style={{marginTop: '2%',border: 'solid 1px #eeeeee99',padding: '0.3%',fontSize:15}}>
                    <Col span={4} offset={1}>用户名: {seft.state.Name}</Col>
                    <Col span={4}>编号:{seft.state.ID}</Col>
                    <Col span={4}>手机: {seft.state.Phone}</Col>
                    <Col span={4}>描述: {seft.state.Desc}</Col>
                    {/* <Col span={4}>备注: {seft.state.Note}</Col> marginTop:'1%'  */}
                </Row>
                <Divider />
                <Row>
                    <Col span={11} style={{border: 'solid 1px #80808099',padding: '0 1%'}}>
                        <Button type="primary" style={{padding: '1%'}}>用户拥有权限组</Button>
                        <Table  size='middle'  dataSource={seft.state.selGroupList} columns={columns} bordered={true}/>
                    </Col>
                    <Col span={1} style={{textAlign:'center'}}>
                        <Icon type="swap" style={{fontSize:25,textAlign:'center',color:'#46affb'}} />
                    </Col>
                    <Col span={12} style={{border: 'solid 1px #80808029',padding: '0 1%'}}>
                        <Button type="primary" >所有可选权限组</Button>
                        <Feature/>
                    </Col>
                    <Col span={1}></Col>
                </Row>
            </div>
        )
    }
}
