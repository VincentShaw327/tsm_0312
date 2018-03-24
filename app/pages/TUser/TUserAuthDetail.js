/**
 *这是权限组详情页
 *添加日期:2018.03.06
 *添加人:shaw
 **/
import React, { Component } from 'react';
import { Table, Button, Icon, Row, Col, message, Divider } from 'antd';
import FeatureSetConfig from '../../components/TCommon/shawCommon/tableConfig';
import { TPostData } from '../../utils/TAjax';

let seft
let creatKeyWord;
let AuthorityGroupUUID;


export default class TUserAuthDetail extends Component {

    constructor( props ) {
        super( props )
        const {location,UUID}=this.props
        //组件外的指针.
        this.state = {
            // AuthorityGroupUUID: location.state.UUID,
            AuthorityGroupUUID:UUID,
            // UserUUID:location.state.UUID,
            Name: '',
            ID: '',
            Phone: '',
            Desc: '',
            Note: '',
            Rerender: 0,
            countnum: 0
        }
        // this.url='/api/TUser/auth';
        this.url='/api/TUser/group';
        seft = this;
    }

    componentWillMount(){
        const config = {
            type: 'tableFeature',
            uProductUUID: 0,
            strKeyWord: '',
            url: '/api/TUser/auth',
            // url: 'http://demo.sc.mes.top-link.me/service/Handler_User_V1.ashx',
            // url: 'http://demo.sc.mes.top-link.me/service/Handler_Authority_V1.ashx',
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
                    PageIndex: 0, //分页：页序号，不分页时设为0
                    PageSize: -1 //分页：每页记录数，不分页时设为-1
                };
                //权限列表
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
                            Note: item.Note,
                            UpdateDateTime: item.UpdateDateTime
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

                TPostData( this.url, "Add", dat, function ( res ) {
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
                    //这块请求更新数据 成功回调
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
                    UUID: seft.state.AuthorityGroupUUID,
                    AuthorityUUID: data.UUID
                }
                // console.log("绑定操作的表单,",data,dat);
                //往权限组中添加权限.
                TPostData( '/api/TUser/group', "AddAuthority", dat, function ( res ) {
                    if ( res.err === 0 ) {
                        seft.getAuthority();
                        callback( "success" );
                    } else if ( res.err === 1 ) {
                        callback( "repeat" );
                    } else {
                        callback( "error" );
                    }

                }, function ( error ) {
                    message.info( error );
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
        //获取头部信息
        var dat = {
            PageIndex: 0, //分页：页序号，不分页时设为0
            PageSize: -1, //分页：每页记录数，不分页时设为-1
            SystemUUID: -1, //保留，不作为查询条件，取值设为-1
            KeyWord: "" //模糊查询条件
        }
        TPostData(this.url, "ListActive", dat, function ( res ) {
            var Ui_list = res.obj.objectlist || [];
            Ui_list.forEach( function ( item, index ) {
                if ( item.UUID == seft.state.AuthorityGroupUUID ) {
                    seft.state.Name = item.Name,
                    seft.state.ID = item.ID,
                    seft.state.Desc = item.Desc,
                    seft.state.Note = item.Note
                }
            } )
        }, function ( error ) {
            message.info( error );
        }, false )
        seft.getAuthority();
    }
    //解除绑定.
    unbind = ( res ) => {
        //res
        var dat = {
            UUID: seft.state.AuthorityGroupUUID,
            AuthorityUUID: res
        }
        TPostData(this.url, "RemoveAuthority", dat, function ( res ) {
            if ( res.err === 0 ) {
                seft.getAuthority();
                message.info( "解绑成功" );
            }
        }, function ( error ) {
            message.info( error );
        }, false )
    }

    getAuthority = () => {
        var dat = {
            PageIndex: 0,
            PageSize: -1,
            UUID: seft.state.AuthorityGroupUUID
        }
        TPostData( this.url, "GetAuthority", dat, function ( res ) {
            var list = [];
            var Ui_list = res.obj.objectlist || [];
            //Desc ID Name Note UUID
            var totalcount = res.obj.totalcount;
            Ui_list.forEach( function ( item, index ) {
                list.push( {
                    key: index,
                    AuthorityName: item.AuthorityName,
                    AuthorityUUID: item.AuthorityUUID,
                    AuthorityCode: item.AuthorityCode,
                    ID: item.ID,
                    Name: item.Name,
                    SystemUUID: item.SystemUUID,
                    Desc: item.Desc,
                    UUID: item.UUID
                } )
            } )
            seft.setState( { selGroupList: list } )
        }, function ( error ) {
            message.info( error );
        }, false )
    }

    //获取用户,获取用户组,
    render() {
        let Feature=this.feature;
        const columns = [
            {
                title: '名称',
                dataIndex: 'AuthorityName',
                type: 'string'
            }, {
                title: '编码',
                dataIndex: 'AuthorityCode',
                type: 'string'
            }, {
                title: '解除权限',
                dataIndex: 'operation',
                render: ( text, record ) => {
                    const { editable } = record;
                    return ( <div className="editable-row-operations">
                        {/* <a onClick={() => seft.AddGroup(record.UUID)}>解绑</a> */}
                        <a onClick={() => seft.unbind(record.AuthorityUUID)}>解除</a>
                    </div> )
                }
            }
        ]

        return (
            <div style={{display: 'flex',flexFlow: 'column',minHeight: '734px'}}>
                <Row style={{marginTop: '2%',border: 'solid 1px #80808029',padding: '0.3%',fontSize:15}}>
                    <Col span={4} offset={1}>名称: {seft.state.Name}</Col>
                    <Col span={4}>编号:{seft.state.ID}</Col>
                    {/* <Col span={4}>手机: {seft.state.Phone}</Col> */}
                    <Col span={4}>描述: {seft.state.Desc}</Col>
                    <Col span={4}>备注: {seft.state.Note}</Col>
                </Row>
                <Divider />
                <Row>
                    <Col span={11} style={{border: 'solid 1px #80808029',padding: '0 1%'}}>
                        <Button type="primary" >权限组拥有权限</Button>
                        <Table  size='middle'  dataSource={seft.state.selGroupList} columns={columns} bordered={true} />
                    </Col>
                    <Col span={1} style={{textAlign:'center'}}>
                        <Icon type="swap" style={{fontSize:25,textAlign:'center',color:'#46affb'}} />
                    </Col>
                    <Col span={12} style={{border: 'solid 1px #80808029',padding: '0 1%'}}>
                        <Button type="primary" >所有可选权限</Button>
                        <Feature/>
                    </Col>
                    <Col span={1}></Col>
                </Row>
            </div>
        )
    }
}
