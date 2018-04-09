/**
 *这是用户列表页
 *添加日期:2018.03.03
 *添加人:shaw
 **/
import React, { Component } from 'react'
import { hashHistory, Link } from 'react-router'
import { Button, Icon ,message} from 'antd';
import FeatureSetConfig from '../../components/TCommon/tableConfig';
import MD5 from '../../components/TCommon/md5';
import { TPostData } from '../../utils/TAjax';

let seft;
let creatKeyWord;


export default class TAuthList extends Component {

    constructor( props ) {
        super( props )
        this.state = {}
        seft = this;
    }

    componentWillMount(){

        const config = {

            type: 'tableFeature',
            uProductUUID: 0,
            url: '/api/TUser/auth',

            columns: [
                {
                    title: '序号',
                    dataIndex: 'key',
                    type: 'string'
                },
                {
                    title: '权限名称',
                    dataIndex: 'Name',
                    type: 'string'
                }, {
                    title: '权限编号',
                    dataIndex: 'Code',
                    type: 'string'

                }, {
                    title: '备注',
                    dataIndex: 'Note',
                    type: 'string'
                }, {
                    title: '修改时间',
                    dataIndex: 'UpdateDateTime',
                    type: 'string'
                }, {
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
                        }
                    ]
                }
            ],

            UType: [
                {
                   name: 'Name',
                   label: '权限名称',
                   type: 'string',
                   placeholder: '请输入权限名称',
                   rules: [{required: true, message: '编号名不能为空'}]
               },
               {
                    name: 'Code',
                    label: '编号',
                    type: 'string',
                    placeholder: '请输入权限编号',
                    rules: [{required: true,message: '权限编号不能为空'}]
                },
                {
                    name: 'Desc',
                    label: '描述',
                    type: 'string',
                    placeholder: '请输入描述',
                },
                {
                    name: 'Note',
                    label: '备注',
                    type: 'string',
                    placeholder: '请输入备注',
                }
            ],

            CType: [
                {
                   name: 'Name',
                   label: '权限名称',
                   type: 'string',
                   placeholder: '请输入权限名称',
                   rules: [{required: true, message: '编号名不能为空'}]
               },
                {
                    name: 'Code',
                    label: '编号',
                    type: 'string',
                    placeholder: '请输入权限编号',
                    rules: [{required: true,message: '权限编号不能为空'}]
                }
            ],

            RType: [
                {
                    name: 'keyWord',
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
                            UUID : item.UUID, //UUID，后台使用的记录唯一编号，不需要在操作界面上显示，更改等等
                            Name : item.Name,//名称
                            Code : item.Code,//代码
                            Note : item.Note,//信息备注
                            UpdateDateTime : item.UpdateDateTime,//最后更新时间
                            Status :item.Status,
                            Desc :item.Desc,//详细描述
                            SystemUUID:item.SystemUUID //保留
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
                let password = MD5( data.Password );

                let dat = {
                    // key: keyWord,
                    Name: data.Name,
                    Code: data.Code,
                }

                TPostData( this.url, "Add", dat, function ( res ) {

                    callback( dat );
                } )
            },

            Update: function ( data, callback ) {
                let dat = {
                    UUID: data.UUID,
                    SystemUUID: 0,
                    Name: data.Name,
                    Code: data.Code,
                    Note: data.Note,
                    Desc: "--"
                }
                TPostData( this.url, "Update", dat, function ( res ) {
                    callback( data );
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
                    KeyWord: this.keyWord //模糊查询条件
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
