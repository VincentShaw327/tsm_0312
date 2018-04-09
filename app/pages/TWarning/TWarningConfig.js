/**
 *这是报警配置页
 *添加日期:2018.03.03
 *添加人:shaw
 **/
import React, { Component } from 'react'
import { hashHistory, Link } from 'react-router'
import { Button, Icon,message } from 'antd';
import FeatureSetConfig from '../../components/TCommon/tableConfig';
import { TPostData } from '../../utils/TAjax';

let seft;
let creatKeyWord;
//请求设备型号.  DevModelUUID

export default class TWarningConfig extends Component {

    constructor( props ) {
        super( props )
        this.state = {}
        this.url='/api/TDevice/device_model'
        seft = this;
    }

    componentWillMount(){
        let DevModelList = [];
        TPostData(this.url, 'ListActive',
            {
                PageIndex: 0,
                PageSize: 100,
                TypeUUID: -1,
                CategoryUUID: -1,
                VendorUUID: -1
            },
            function ( res ) {
                var Ui_list = res.obj.objectlist || [];
                Ui_list.forEach( function ( item, index ) {
                    DevModelList.push( { key: index, value: item.UUID.toString(), text: item.Name } )
                } )
            },
            function ( error ) {
                message.info( error );
            },
            false
        )

        const config = {

            type: 'tableList',
            uProductUUID: 0,
            //告警配置管理url.
            url: '/api/TWarning/warning_item',
            // url: 'http://demo.sc.mes.top-link.me/service/Handler_WarnItem_V1.ashx',
            columns: [
                {
                    title: '序号',
                    dataIndex: 'key',
                    type: 'string'
                },
                {
                    title: '报警内容',
                    dataIndex: 'Name',
                    type: 'string',
                    // sorter: (a, b) => a.Name.length - b.Name.length
                },
                {
                    title: '报警码',
                    dataIndex: 'ID',
                    type: 'string',
                    // sorter: (a, b) => a.Name.length - b.Name.length
                },
                {
                    title: '设备型号',
                    dataIndex: 'DeviceModel',
                    type: 'string'
                },
                /*{
                    title: '设备编号',
                    dataIndex: 'DeviceNumber',
                    type: 'string'
                },*/
                {
                    title: '匹配类型',
                    dataIndex: 'MatchType',
                    type: 'string',
                    render:(item,arr)=>{
                        if(item==0)return (<span>按Bit匹配</span>)
                        else if(item==1)return (<span>按码值匹配</span>)
                    }
                },
                {
                    title: '备注',
                    dataIndex: 'Note',
                    type: 'string'
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
                        },
                    ],
                }
            ],

            UType: [
                {
                    name: 'Name',
                    label: '报警内容',
                    type: 'string',
                    placeholder: '请输入报警内容',
                    rules: [{required: true,message: '报警码内容不能为空'}]
                },
                {
                    name: 'ID',
                    label: '报警码',
                    type: 'string',
                    placeholder: '请输入报警码',
                    rules: [{required: true,message: '报警码不能为空'}]
                },
                {
                    name: 'DevModelUUID',
                    label: '设备型号',
                    type: 'select',
                    rules: [{required: true,message: '请选择设备型号'}],
                    options: DevModelList
                },
                {
                    name: 'MatchType',
                    label: '报警匹配类型',
                    type: 'select',
                    rules: [{required: true,message: '请选择报警配类型'}],
                    options: [ { key: 0, value: '0', text: '按bit匹配' }, { key: 1, value: '1', text: '按码值匹配' } ],
                    defaultValue: '请选择告警码类型',
                },
                {
                    name: 'Note',
                    label: '备注',
                    type: 'string',
                    placeholder: '请输入备注',
                }
                /*{
                    name: 'Code',
                    label: '告警码',
                    type: 'string',
                    placeholder: '请输入告警码',
                    rules: [{required: true,message: '请选择设备型号'}]
                }
                {
                    name: 'Desc',
                    label: '描述',
                    type: 'string',
                    placeholder: '请输入备注',
                },*/
            ],

            CType: [
                {
                    name: 'Name',
                    label: '报警内容',
                    type: 'string',
                    placeholder: '请输入报警内容',
                    rules: [{required: true,message: '报警码内容不能为空'}]
                },
                {
                    name: 'ID',
                    label: '报警码',
                    type: 'string',
                    placeholder: '请输入报警码',
                    rules: [{required: true,message: '报警码不能为空'}]
                },
                {
                    name: 'DevModelUUID',
                    label: '设备型号',
                    type: 'select',
                    rules: [{required: true,message: '请选择设备型号'}],
                    options: DevModelList
                },
                {
                    name: 'MatchType',
                    label: '报警匹配类型',
                    type: 'select',
                    rules: [{required: true,message: '请选择报警配类型'}],
                    // defaultValue: '请选择告警码类型',
                    options: [ { key: 0, value: '0', text: '按bit匹配' }, { key: 1, value: '1', text: '按码值匹配' } ],
                },
                /*{
                    name: 'Code',
                    label: '告警码',
                    type: 'string',
                    placeholder: '请输入告警码',
                    rules: [{required: true,message: '请选择设备型号'}]
                }*/
            ],

            RType: [
                {
                    name: 'keyWord',
                    label: '搜索内容',
                    type: 'string',
                    placeholder: '请输入搜索内容'
                },
                {
                    name: 'DevModelUUID',
                    label: '设备型号',
                    type: 'select',
                    hasAllButtom: true,
                    defaultValue: '-1',
                    width: 150,
                    options: DevModelList
                }
            ],

            pageData: function ( num, callback ) {

                var dat = {
                    PageIndex:0, //分页：页序号，不分页时设为0
                    PageSize: -1, //分页：每页记录数，不分页时设为-1
                    DevModelUUID: -1 //设备型号UUID
                    // KeyWord : ""                                                                        //模糊查询条件
                }

                TPostData( this.url, "ListActive", dat, function ( res ) {
                    console.log( '查询到报警配置列表:', res );
                    var list = [];
                    var Ui_list = res.obj.objectlist || [];

                    var totalcount = res.obj.totalcount;
                    creatKeyWord = res.obj.objectlist.length;

                    Ui_list.forEach( function ( item, index ) {
                        list.push( {
                            key: index,
                            UUID: item.UUID,
                            DevModelUUID:item.DevModelUUID,
                            Name: item.Name,
                            ID: item.ID,
                            DeviceNumber: item.DeviceNumber?item.DeviceNumber:"-",
                            DeviceModel: item.DeviceModel?item.DeviceModel:"-",
                            Code: item.Code,
                            MatchType: item.MatchType.toString(),
                            Note: item.Note,
                            Desc: item.Desc
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
                        nPageSize: 10
                    } )
                }, function ( error ) {
                    message.info( error );
                } )
            },

            Create: function ( data, callback ) {
                creatKeyWord++;
                let keyWord = creatKeyWord;
                // 新增告警配置.
                let dat = {
                    key: keyWord,
                    DevModelUUID: data.DevModelUUID,
                    Name: data.Name,
                    ID: data.ID,
                    Code:0,
                    MatchType: data.MatchType,
                    // Code: data.Code,
                }
                TPostData( this.url, "Add", dat, function ( res ) {
                    //这块请求更新数据 成功回调
                    callback( dat );
                } )
            },

            Update: function ( data, callback ) {
                //修改报警配置.
                let dat = {
                    UUID: data.UUID,
                    DevModelUUID: data.DevModelUUID,
                    Name: data.Name,
                    ID: data.ID,
                    MatchType:parseInt(data.MatchType),
                    Note: data.Note,
                    Code: '0',
                    Desc:"--"
                    // Code: data.Code,
                }
                console.log("data值是:",data);

                TPostData( this.url, "Update", dat, function ( res ) {
                    callback( data )
                } )

            },
            // 删除报警配置.
            Delete: function ( data, callback ) {
                // 逻辑删除
                var dat = {
                    UUID: data.UUID,
                }
                TPostData( this.url, "Inactive", dat, function ( res ) {
                    console.log( 'res', res );
                    callback( data )
                } )
            },

            Retrieve: function ( data, callback ) {
                var dat = {
                    PageIndex: 0, //分页：页序号，不分页时设为0
                    PageSize: -1, //分页：每页记录数，不分页时设为-1
                    DevModelUUID: data.DevModelUUID, //设备型号UUID
                    KeyWord : data.keyWord                                                                        //模糊查询条件
                }
                TPostData( this.url, "ListActive", dat, function ( res ) {
                    console.log( '查询到报警配置列表:', res );
                    var list = [];
                    var Ui_list = res.obj.objectlist || [];

                    var totalcount = res.obj.totalcount;
                    creatKeyWord = res.obj.objectlist.length;

                    Ui_list.forEach( function ( item, index ) {
                        list.push( {
                            key: index,
                            UUID: item.UUID,
                            DevModelUUID:item.DevModelUUID,
                            Name: item.Name,
                            ID: item.ID,
                            DeviceNumber: item.DeviceNumber?item.DeviceNumber:"-",
                            DeviceModel: item.DeviceModel?item.DeviceModel:"-",
                            Code: item.Code,
                            MatchType: item.MatchType.toString(),
                            Desc: item.Desc,
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
                        nPageSize: 10
                    } )
                }, function ( error ) {
                    message.info( error );
                } )
            }

        };
        this.feature = FeatureSetConfig( config );

    }

    render() {
        let Feature=this.feature;
        return (<Feature />)
    }
}
