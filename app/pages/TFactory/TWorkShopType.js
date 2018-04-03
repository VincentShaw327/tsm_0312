/**
 *这是车间类别页
 *添加日期:2018.03.02
 *添加人:shaw
 **/
import React, { Component } from 'react'
// import {CommonTable} from '../../components/TTable';
import FeatureSetConfig from '../../components/TCommon/shawCommon/tableConfig';
import { Table, Menu, Icon, Badge, Dropdown,message } from 'antd';
import { TPostData } from '../../utils/TAjax';
let seft;

// const Feature = FeatureSetConfig( conf );

export default class App extends Component {

    constructor( props ) {
        super( props )
        this.state = {}
        seft = this;
    }

    componentWillMount() {
        const tableConfig = {

            type: 'tableList',
            uProductUUID: 0,
            // url: 'http://demo.sc.mes.top-link.me/service/Handler_WorkshopType_V1.ashx',
            url: '/api/TFactory/workshop_type',

            columns: [
                {
                    title: '序号',
                    dataIndex: 'key',
                    type: 'string'
                },
                {
                    title: '类别名称',
                    dataIndex: 'Name',
                    type: 'string',
                    // sorter: (a, b) => a.Name.length - b.Name.length
                },
                /*{
                    title: '编号',
                    dataIndex: 'ID',
                    type: 'string',
                },
                {
                    title: '描述',
                    dataIndex: 'Desc',
                    type: 'string',
                    // 车间描述,备注,
                },*/
                {
                    title: '备注',
                    dataIndex: 'Note',
                    type: 'string',
                },
                {
                    title: '修改时间',
                    dataIndex: 'UpdateDateTime',
                    type: 'string',
                },
                {
                    title: '操作',
                    dataIndex: 'status',
                    type: 'operate', // 操作的类型必须为 operate
                    btns: [
                        {
                            text: '修改',
                            type: 'edit',
                            icon:'edit'
                        }, {
                            text: '删除',
                            type: 'delete',
                            icon:'delete',
                            havePopconfirm: true,
                            popText: '确定要删除此记录吗?'
                        }

                    ], // 可选

                }
            ],
            //车间ID以编码来表示。这个是指车间的id编码和UUUID是不一样的。
            UType: [
                {
                    name: 'Name',
                    label: '类别名称',
                    type: 'string',
                    rules: [{ required: true, message: '名称不能为空' }],
                    placeholder: '请输入车间类别名称'
                },
                /*{
                    name: 'ID',
                    label: '编码',
                    type: 'string',
                    placeholder: '请输入编码',
                },*/
                {
                    name: 'Desc',
                    label: '描述',
                    type: 'string',
                    placeholder: '请输入描述',
                },
                /*{
                    name: 'Note',
                    label: '备注',
                    type: 'string',
                    placeholder: '请输入备注',
                }*/
            ],

            CType: [
                {
                    name: 'Name',
                    label: '名称',
                    type: 'string',
                    placeholder: '请输入车间类别名称',
                    rules: [
                        {
                            required: true,
                            min: 1,
                            message: '编号至少为 1 个字符'
                        }
                    ]
                },
                /*{
                    name: 'ID',
                    label: '编码',
                    type: 'string',
                    placeholder: '请输入编码',
                    rules: [
                        {
                            required: true,
                            min: 1,
                            message: '编号至少为 1 个字符'
                        }
                    ]
                }*/
            ],

            RType: [
                {
                    name: 'keyWord',
                    label: '搜索内容',
                    type: 'string',
                    placeholder: '请输入搜索内容'
              },

            ],

            pageData: function ( num, callback ) {
                const dat = {
                    PageIndex: 0, //分页：页序号，不分页时设为0
                    PageSize: -1, //分页：每页记录数，不分页时设为-1
                    KeyWord: ""
                }
                TPostData( this.url, "ListActive", dat, function ( res ) {
                    var list = [];
                    console.log( "查询到车间类别列表", res );
                    var data_list = res.obj.objectlist || [];
                    var totalcount = res.obj.totalcount;
                    data_list.forEach( function ( item, index ) {
                        list.push( {
                            key: index,
                            UUID: item.UUID,
                            Name: item.Name,
                            Number: item.ID,
                            Desc: item.Desc,
                            UpdateDateTime: item.UpdateDateTime,
                            Note: item.Note,
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
            //创建表单的回调处理函数
            Create: function ( data, callback ) {
                let dat = {
                    key: '1000',
                    Name: data.Name,
                    ID: "---"
                    // ID: data.ID
                }
                // console.log('创建后的数据是:', data);
                TPostData( this.url, "Add", dat, function ( res ) {
                    callback( dat );
                } )
            },
            //信息修改回调处理
            Update: function ( data, callback ) {
                let dat = {
                    UUID: data.UUID,
                    Name: data.Name,
                    Desc: data.TypeName,
                    ID: "--",
                    Note: "--",
                    // ID: data.Number,
                    // Note: data.Desc,
                }
                TPostData( this.url, "Update", dat, function ( res ) {
                    //这块请求更新数据 成功回调
                    callback( data )
                } )
            },
            //修改设备所属车间回调
            // 删除操作
            Delete: function ( data, callback ) {
                var dat = {
                    UUID: data.UUID,
                }
                // console.log("看看data",data);
                TPostData( this.url, "Inactive", dat, function ( res ) {
                    //这块请求更新数据 成功回调
                    callback( data );
                } )
            },
            // 查询操作回调
            Retrieve: function ( data, callback ) {
                // console.log( '查询的内容:', data );
                const dat = {
                    PageIndex: 0, //分页：页序号，不分页时设为0
                    PageSize: -1, //分页：每页记录数，不分页时设为-1
                    KeyWord: data.keyWord
                }

                TPostData( this.url, "ListActive", dat, function ( res ) {
                    var list = [];
                    var data_list = res.obj.objectlist || [];
                    var totalcount = res.obj.totalcount;
                    data_list.forEach( function ( item, index ) {
                        list.push( {
                            key: index,
                            UUID: item.UUID,
                            FactoryUUID: item.FactoryUUID,
                            TypeUUID: item.TypeUUID,
                            Name: item.Name,
                            Number: item.ID,
                            TypeName: item.TypeName, //类别名称
                            Desc: item.UpdateDateTime,
                            Desc: item.Desc,
                            Note: item.Note,
                            TypeID: item.TypeID, //类别编号
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
            }

        };
        this.feature = FeatureSetConfig(tableConfig);
        // this.config=tableConfig;
    }

    render() {
        let Feature=this.feature;
        // console.log('CommonTable',CommonTable);
        // <CommonTable config={this.config} />
        return (
            <Feature />
        )
    }
}
