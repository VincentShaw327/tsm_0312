/**
 *这是设备类别页
 *添加日期:2017.12.05
 *添加人:shaw
 **/
import React, { Component } from 'react'
import { hashHistory, Link } from 'react-router'
import { Button, Icon,message } from 'antd';
import FeatureSetConfig from '../../components/TCommon/shawCommon/tableConfig';
import { TPostData } from '../../utils/TAjax';
let seft;

export default class TDeviceType extends Component {

    constructor( props ) {
        super( props )
        this.state = {

        }
        seft = this;
    }

    componentWillMount(){
        const config = {

            type: 'tableFeature',
            uProductUUID: 0,
            KeyWord: '',
            url: '/api/TDevice/device_type',
            // url: 'http://demo.sc.mes.top-link.me/service/Handler_DevType_V1.ashx',
            columns: [
                {
                    title: '序号',
                    dataIndex: 'key',
                    type: 'string'
                },
                {
                    title: '名称',
                    dataIndex: 'Name',
                    type: 'string'
        		},
                /*{
                    title: '编号',
                    dataIndex: 'ID',
                    type: 'string'
        		},
                {
                    title: '描述',
                    dataIndex: 'Note',
                    type: 'string'
        		},*/
                {
                    title: '备注',
                    dataIndex: 'Desc',
                    type: 'string'
        		},
                {
                    title: '修改时间',
                    dataIndex: 'UpdateDateTime',
                    type: 'string',
                    /*type: 'sort',
                    sorter: ( a, b ) => {
                        return CpTime( a, b )
                    }*/
                },
                {
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
                    label: '名称',
                    type: 'string',
                    placeholder: '请输入管理者编号',
                    rules: [{required: true,min: 1,message: '名称不能为空'}]
                },/*{
                    name: 'ID',
                    label: '编号',
                    type: 'string',
                    placeholder: '请输入管理者编号'
                }, {
                    name: 'Note',
                    label: '描述',
                    type: 'string',
                    placeholder: '请输入描述',
                }, */{
                    name: 'Desc',
                    label: '备注',
                    type: 'string',
                    placeholder: '请输入备注',
                }
            ],

            CType: [
                {
                    name: 'Name',
                    label: '类别名称',
                    type: 'string',
                    placeholder: '请输入类别名称',
                    rules: [{required: true,min: 1,message: '名称不能为空'}]
                },
                /*{
                    name: 'ID',
                    label: '编号',
                    type: 'string',
                    placeholder: '编号',
                    rules: [{required: true,min: 1,message: '名称不能为空'}]
                }*/
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
                const dat = {
                  nPageIndex: 0,
                  nPageSize: -1,
                  ParentUUID : -1,
                  KeyWord: ""
                }
                TPostData( this.url, "ListActive", dat, function ( res ) {
                  var list = [];
                  console.log("查询到设备类别列表", res);
                  var device_list = res.obj.objectlist || [];
                  var totalcount = res.obj.totalcount;
                  device_list.forEach( function ( item, index ) {
                    list.push( {
                      key: index,
                      Desc: item.Desc,
                      Name: item.Name,
                      ID: item.ID,
                      Note: item.Note,
                      ParentUUUID: item.ParentUUUID,
                      Status: item.Status,
                      UUID: item.UUID,
                      UpdateDateTime: item.UpdateDateTime
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
                  Name : data.Name,
                  ParentUUID : 0,
                  ID : "-",
                  // ID : data.ID,
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
                  ParentUUID : 0,
                  Name: data.Name,
                  Desc: data.Desc,
                  ID: "-",
                  Note: "-"
                  /*ID: data.DeviceID,
                  Desc: data.Desc,
                  Note: data.Note*/
                }
                TPostData( this.url, "Update", dat, function ( res ) {
                  //这块请求更新数据 成功回调
                  callback( data )
                } )
            },
            //修改设备所属车间回调
            Place: function ( data, callback ) {
                // console.log("看看Device-Place data", data);
                let dat = {
                  UUID: data.UUID,
                  WorkshopUUID: data.WorkshopUUID,
                }
                TPostData( this.url, "Place", dat, function ( res ) {
                  //这块请求更新数据 成功回调
                  callback( data )
                } )
            },
            // 删除操作
            Delete: function ( data, callback ) {
                var dat = {
                  UUID: data.UUID,
                  // Status: 0
                }
                // console.log("看看data",data);
                TPostData( this.url, "Inactive", dat, function ( res ) {
                  //这块请求更新数据 成功回调
                  callback( data );
                } )
            },
            // 查询操作回调
            Retrieve: function ( data, callback ) {
                const dat = {
                  nPageIndex: 0,
                  nPageSize: -1,
                  ParentUUID : -1,
                  KeyWord: data.keyWord
                }
                TPostData( this.url, "ListActive", dat, function ( res ) {
                  var list = [];
                  console.log("查询到设备类别列表", res);
                  var device_list = res.obj.objectlist || [];
                  var totalcount = res.obj.totalcount;
                  device_list.forEach( function ( item, index ) {
                    list.push( {
                      key: index,
                      Desc: item.Desc,
                      Name: item.Name,
                      ID: item.ID,
                      Note: item.Note,
                      ParentUUUID: item.ParentUUUID,
                      Status: item.Status,
                      UUID: item.UUID,
                      UpdateDateTime: item.UpdateDateTime
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
        this.feature = FeatureSetConfig( config );
    }

    render() {
        let Feature=this.feature;
        return ( <Feature/> )
    }

}
