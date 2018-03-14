/**
 *这是用户列表页
 *添加日期:2018.03.03
 *添加人:shaw
 **/
import React, { Component } from 'react'
import { hashHistory, Link } from 'react-router'
import { Button, Icon,Popover,message} from 'antd';
import FeatureSetConfig from '../../components/TCommon/shawCommon/tableConfig';
import MD5 from '../../components/TCommon/shawCommon/md5';
import { TPostData,urlBase } from '../../utils/TAjax';

let seft;
let creatKeyWord;


export default class TUserList extends Component {

    constructor( props ) {
        super( props )
        this.state = {}
        seft = this;
    }

    componentWillMount(){

        const config = {

            type: 'tableFeature',
            uProductUUID: 0,
            url: '/api/TUser/account',
            columns: [
                {
                    title: '用户头像',
                    dataIndex: 'Image',
                    render: ( e, record ) => {
                        // console.log('图片地址',e);
                        const content = (
                            <div>
                              <img width="300"  src={urlBase+e}/>
                            </div>
                        );
                        return (
                            <Popover placement="right"  content={content} trigger="hover">
                              {/* <Button>Right</Button> */}
                              <img height='50' src={urlBase+e}/>
                            </Popover>
                        )
                    }
                },
                {
                    title: '用户名',
                    dataIndex: 'Name',
                    type: 'string'
                }, {
                    name: 'LoginName',
                    label: '登录名',
                    type: 'string',
        		},{
                    name: 'Email',
                    label: '邮箱',
                    type: 'string',
        		}, {
                    title: '手机号',
                    dataIndex: 'Mobile',
                    type: 'string'
                }, {
                    title: '电话',
                    dataIndex: 'Phone',
                    type: 'string'
                },{
                    title: '用户启用时间',
                    dataIndex: 'ActiveDateTime',
                    type: 'string'
                },{
                    title: '用户冻结时间',
                    dataIndex: 'InactiveDateTime',
                    type: 'string'
                },{
                    title: '备注',
                    dataIndex: 'Note',
                    type: 'string'
                },{
                    title: '操作',
                    dataIndex: 'uMachineUUID',
                    type: 'operate',
                    btns: [
                        {
                            text: '修改',
                            type: 'edit',
                            icon: 'edit'
                        }, {
                            text: '删除',
                            type: 'delete',
                            icon: 'delete',
                            havePopconfirm: true,
                            popText: '确定要删除此记录吗?'
                        }, {
                                render: ( text, item ) => ( <span>
                                	<Link to={{
                                			// pathname: '/Feature8-30',
                                			pathname: `/TUserDetails`,
                                			// pathname: `/TUserDetails:${item.UUID}`,
                                			state: {
                                				UUID: item.UUID
                                			}
                                		}}>
                                		<Icon type="profile" />
                                	</Link>
                                </span> )
                            }
                    ]
                }
            ],

            UType: [
                 {
                    name: 'Name',
                    label: '用户名',
                    type: 'string',
                    placeholder: '请输入名字',
                    rules: [{required: true,message: '用户名不能为空'}]
        		}, {
                    name: 'LoginName',
                    label: '登录名',
                    type: 'string',
                    placeholder: '请输入名字',
                    rules: [{required: true,message: '登录名不能为空'}]
        		}, {
                    name: 'Email',
                    label: '邮箱',
                    type: 'string',
                    placeholder: '请输入Emial',
                    rules: [{required: true,message: '邮箱不能为空'}]
        		}, {
                    name: 'Mobile',
                    label: '手机号',
                    type: 'string',
                    placeholder: '请输入手机号码',
                    rules: [{required: true,message: '手机号不能为空'}]
        		}, {
                    name: 'Phone',
                    label: '电话',
                    type: 'string',
                    placeholder: '请输入电话',
                    rules: [{required: true,message: '电话不能为空'}]
        		}, {
                    name: 'Note',
                    label: '备注',
                    type: 'string',
                    placeholder: '请输入备注',
                },/*{
                    name: 'ID',
                    label: '编号',
                    type: 'string',
                    placeholder: '输入需要更改的ID',
        		}, {
                    name: 'Desc',
                    label: '描述',
                    type: 'string',
                    placeholder: '请输入描述',
        		},*/{
                    name: 'uploadImg',
                    label: '图片',
                    type: 'antUpload',
                    url: '/api/tupload/do',
                }
            ],

            CType: [
                 {
                    name: 'LoginName',
                    label: '登录名',
                    type: 'string',
                    placeholder: '请输入登录名',
                    rules: [{required: true,message: '登录名不能为空'}]
        		}, {
                    name: 'Password',
                    label: '密码',
                    type: 'string',
                    placeholder: '请输入密码',
                    rules: [{required: true,message: '密码不能为空'}]
                },/*{
                    name: 'ID',
                    label: '编号',
                    type: 'string',
                    placeholder: '请输入用户编号',
                    rules: [{required: true,message: '编号至少为 1 个字符'}]
                }*/
            ],

            RType: [
                {
                    name: 'id',
                    label: '搜索内容',
                    type: 'string',
                    placeholder: '请输入搜索内容'
                }
            ],

            pageData: function ( num, callback ) {

                var dat = {
                    PageIndex:0,
                    PageSize: -1
                }

                TPostData( this.url, "ListActive", dat, function ( res ) {
                    console.log( 'res', res );
                    var list = [];
                    var Ui_list = res.obj.objectlist || [];
                    var totalcount = res.obj.totalcount;
                    creatKeyWord = totalcount;
                    Ui_list.forEach( function ( item, index ) {
                        list.push( {
                            key: index,
                            Name: item.Name,
                            ID: item.ID,
                            Email: item.Email,
                            UUID: item.UUID,
                            Phone: item.Phone,
                            Image: item.Image,
                            Desc: item.Desc,
                            LoginName: item.LoginName,
                            Mobile: item.Mobile,
                            ActiveDateTime:item.ActiveDateTime,
                            InactiveDateTime:item.InactiveDateTime,
                            Note: item.Note
                        } )
                    } )
                    const pagination = {
                        ...seft.state.pagination
                    }
                    pagination.total = totalcount;
                    callback( list, {
                        total: pagination.total,
                        nPageSize: 10
                    } )
                }, function ( error ) {
                    message.info( error );
                } )
            },

            Create: function ( data, callback ) {

                creatKeyWord++;
                let keyWord = creatKeyWord;

                let password = MD5( data.Password );

                let dat = {
                    key: keyWord,
                    LoginName: data.LoginName,
                    Password: password,
                    ID: "-"
                }

                TPostData( this.url, "Add", dat, function ( res ) {

                    callback( dat );
                } )
            },

            Update: function ( data, callback ) {
                let dat = {
                    UUID: data.UUID,
                    ID: data.ID,
                    Name: data.Name,
                    Email: data.Email,
                    Mobile: data.Mobile,
                    Phone: data.Phone,
                    Desc: data.Desc,
                    Note: data.Note
                }
                TPostData( this.url, "Update", dat, function ( res ) {
                    callback( data );
                } )
            },

            UpdateImage: function ( data, callback ) {
                let dat = {
                    UUID: data.UUID,
                    Path: data.uploadImg
                }
                TPostData( this.url, "UpdateImage", dat, function ( res ) {
                    console.log( '路径设置成功', res );
                    callback( data );
                }, function ( error ) {
                    message.info( error );
                } )
            },

            Delete: function ( data, callback ) {
                var dat = {
                    UUID: data.UUID
                }
                TPostData( this.url, "Inactive", dat, function ( res ) {
                    callback( data );
                } )
            },

            Retrieve: function ( data, callback ) {
                this.KeyWord = data.id;
                var dat = {
                    PageIndex: 0, //分页：页序号，不分页时设为0
                    PageSize: -1, //分页：每页记录数，不分页时设为-1
                    KeyWord: this.KeyWord //模糊查询条件
                }
                this.uProductUUID = data.stype;
                TPostData( this.url, "ListActive", dat, function ( res ) {
                    console.log( 'ListActive', res );
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
            }

        };
        this.feature = FeatureSetConfig( config );

    }

    render() {
        const {detail}=this.props;
        let Feature=this.feature;
        if(detail){
            return (
                <div>{detail}</div>
            )
        }
        else{
            return (
                <div><Feature/></div>
            )
        }
    }
}
