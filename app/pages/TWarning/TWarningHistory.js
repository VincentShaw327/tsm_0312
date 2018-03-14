/**
 *这是报警历史页
 *添加日期:2018.03.03
 *添加人:shaw
 **/
import React, { Component } from 'react'
import { hashHistory, Link } from 'react-router'
import { Button, Icon,message } from 'antd';
import FeatureSetConfig from '../../components/TCommon/shawCommon/tableConfig';
import { TPostData } from '../../utils/TAjax';
let seft;
let creatKeyWord;

//设备型号,获取

export default class TWarningHistory extends Component {

    constructor( props ) {
        super( props )
        console.log( this.props );
        this.state = {}
        this.url='/api/TDevice/device_model'
        seft = this;
    }

    componentWillMount(){
        let devModuleList = [];
        TPostData( this.url, 'ListActive', {
                PageIndex: 0, //分页：页序号，不分页时设为0
                PageSize: -1, //分页：每页记录数，不分页时设为-1
                TypeUUID: -1, //类型UUID，不作为查询条件时设为-1
                CategoryUUID: -1, //保留字段，设为-1
                VendorUUID: -1, //保留字段，设为-1
                KeyWord: "" //模糊查询条件
            },
            function ( res ) {
                console.log( '查询到设备型号:', res );
                let Ui_list = res.obj.objectlist || [];
                Ui_list.forEach( function ( item, index ) {
                    devModuleList.push( { key: index, value: item.UUID.toString(), text: item.Name } )
                } )
            },
            function ( error ) {
                message.info( error );
            },
            false
        )

        const config = {
            type: 'tableList',
            url: '/api/TWarning/warning',
            // url: 'http://demo.sc.mes.top-link.me/service/Handler_Warning_V1.ashx',
            columns: [
                {
                    title: '序号',
                    dataIndex: 'key',
                    type: 'string'
                },
                {
                    title: '报警内容',
                    dataIndex: 'WarnItemName',
                    type: 'string',
                    // sorter: (a, b) => a.Name.length - b.Name.length
                },
                {
                    title: '报警码',
                    dataIndex: 'WarnItemID',
                    type: 'string',
                    // sorter: (a, b) => a.Name.length - b.Name.length
                },
                {
                    title: '设备型号',
                    dataIndex: 'DeviceModel',
                    type: 'string'
                },
                {
                    title: '设备编号',
                    dataIndex: 'DeviceNumber',
                    type: 'string'
                },
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
                    title: '报警时间',
                    dataIndex: 'StartDateTime',
                    type: 'string'
                },
                {
                    title: '解除时间',
                    dataIndex: 'EndDateTime',
                    type: 'string'
                },
            ],

            UType: [
                {
                    name: 'ID',
                    label: '编码',
                    type: 'string',
                    placeholder: '请输入编码',
                },
                {
                    name: 'Name',
                    label: '名称',
                    type: 'string',
                    placeholder: '请输入车间类别名称',
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

            RType: [
                {
                    name: 'KeyWord',
                    label: '搜索内容',
                    type: 'string',
                    placeholder: '请输入搜索内容'
                },
                {
                    name: 'DeviceUUID',
                    label: '设备型号',
                    type: 'select',
                    hasAllButtom: true,
                    defaultValue: '-1',
                    width: 150,
                    options: devModuleList
                }
            ],

            pageData: function ( num, callback ) {
                var dat = {
                    PageIndex: 0, //分页：页序号，不分页时设为0
                    PageSize: -1, //分页：每页记录数，不分页时设为-1
                    DeviceUUID: -1, //设备UUID
                    // KeyWord : ""                                                                        //模糊查询条件
                }
                TPostData( this.url, "List", dat, function ( res ) {
                    console.log( '查询到报警历史列表:', res );
                    var list = [];
                    var Ui_list = res.obj.objectlist || [];
                    var totalcount = res.obj.totalcount;
                    creatKeyWord = res.obj.objectlist.length;
                    Ui_list.forEach( function ( item, index ) {
                        list.push( {
                            key: index,
                            WarnItemUUID: item.WarnItemUUID,
                            DeviceNumber: item.DeviceNumber?item.DeviceNumber:"-",
                            DeviceModel: item.DeviceModel?item.DeviceModel:"-",
                            WarnCode: item.WarnCode,
                            MatchType: item.MatchType,
                            WarnItemID: item.WarnItemID,
                            WarnItemName: item.WarnItemName,
                            WarnItemDesc: item.WarnItemDesc,
                            StartDateTime:item.StartDateTime,
                            EndDateTime:item.EndDateTime
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

            Retrieve: function ( data, callback ) {
                var dat = {
                    PageIndex: 0,
                    PageSize: -1,
                    DeviceUUID: data.DeviceUUID,
                    KeyWord: data.KeyWord
                }
                TPostData( this.url, "List", dat, function ( res ) {
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
        let Feature=this.feature
        return (
            <Feature />
        )
    }
}
