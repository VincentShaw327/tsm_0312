/**
 *这是设备列表页
 *添加日期:2017.12.06
 *添加人:shaw
 **/
import React, { Component } from 'react'
import { hashHistory, Link } from 'react-router'
import { Button, Icon,message } from 'antd';
import FeatureSetConfig from '../../components/TCommon/tableConfig';
import { TPostData } from '../../utils/TAjax';
let seft

export default class DeviceList extends Component {

    constructor( props ) {
        super( props )
        this.state = {
        }
        this.url='/api/TDevice/device_model'
        seft = this;
    }

    componentWillMount(){
        let DeviceModelList = [],
            DeviceTypeList=[];

        TPostData( this.url, 'ListActive', {
                PageIndex: 0,
                PageSize: -1,
                ParentUUID: -1
            },
            ( res )=> {
                let Ui_list = res.obj.objectlist || [];
                Ui_list.forEach( function ( item, index ) {
                    DeviceModelList.push( { key: index, value: item.UUID.toString(), text: item.Name } )
                } )
            },
            ( error )=> {
                message.info( error );
            }, false
        )

        TPostData('/api/TDevice/device_type', 'ListActive', {
                PageIndex: 0,
                PageSize: -1,
                ParentUUID: -1
            },
            ( res )=> {
                let Ui_list = res.obj.objectlist || [];
                Ui_list.forEach( function ( item, index ) {
                    DeviceTypeList.push( { key: index, value: item.UUID.toString(), text: item.Name } )
                } )
            },
            ( error )=> {
                message.info( error );
            }, false
        )

        const tableConfig = {
            /**
            *基础配置参数
            *1.type:表格类型
            *2.isSelection:table是否带勾选
            *3.url:查询的url
            *4.columns:table的表头参数
            *5.CType:create创建modal的数据项
            *6.UType:update更新modal的数据项
            *7.RType:查询的数据项
            ***/
            /*==配置参数=======================================*/
            //table类型
            type: 'tableFeature',
            //
            uProductUUID: 0,
            //请求url
            url: '/api/TDevice/device',
            // url: this.props.server.url+'Handler_Device_V1.ashx',
            // url: '  http://demo.sc.mes.top-link.me/service/Handler_Device_V1.ashx',
            //table表格是否是可勾选
            isSelection: false,
            //table表格表头配置参数
            columns: [
                {
                    title: '序号',
                    dataIndex: 'key',
                    type: 'string'
                },
                {
                    title: '名称',
                    dataIndex: 'strDeviceName',
                    type: 'string'
                }, {
                    title: '编号',
                    dataIndex: 'DeviceID',
                    type: 'string'
                }, {
                    title: '序列号',
                    dataIndex: 'strDeviceSN',
                    type: 'string'
                }, {
                    title: '类型',
                    dataIndex: 'strDeviceType',
                    type: 'string'
                }, {
                    title: '型号',
                    dataIndex: 'strDeviceModel',
                    type: 'string'
                },{
                      title: '标签',
                      dataIndex: 'strLabel',
                      type: 'string'
                },{
                    title: '操作',
                    dataIndex: 'operate',
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
                        /* {
                            text: '位置',
                            type: 'place'
                        }, */
                    ]
                }
            ],
            //更新弹框数据项
            UType: [{
                    name: 'strDeviceName',
                    label: '名称',
                    type: 'string',
                    placeholder: '请输入名称',
                    rules: [{ required: true, message: '请输入设备名称' }]
                  }, {
                    name: 'DeviceID',
                    label: '编号',
                    type: 'string',
                    placeholder: '请输入编号',
                    rules: [{ required: true, message: '请输入编号' }]
                  }, {
                    name: 'strDeviceSN',
                    label: '序列号',
                    type: 'string',
                    placeholder: '请输入序列号',
                    rules: [{ required: true, message: '请输入设备序列号' }]
                  },{
                    name: 'strLabel',
                    label: '标签',
                    type: 'string',
                    placeholder: '请输入标签',
                    rules: [{ required: true, message: '请输入标签' }]
                  },{
                    name: 'ModelUUID',
                    label: '设备型号',
                    type: 'select',
                    rules: [{ required: true, message: '请选择型号' }],
                    options:DeviceModelList
                  }
            ],
            //添加的弹出框菜单
            CType: [
                {
                    name: 'strDeviceName',
                    label: '名称',
                    type: 'string',
                    placeholder: '请输入名称',
                    rules: [{ required: true, message: '请输入名称' }]
                },{
                    name: 'strDeviceID',
                    label: '编号',
                    type: 'string',
                    placeholder: '请输入编号',
                    rules: [{ required: true, message: '请输入编号' }]
                }, {
                    name: 'strDeviceSN',
                    label: '序列号',
                    type: 'string',
                    placeholder: '请输入序列号',
                    rules: [{ required: true, message: '请输入序列号' }]
                }, {
                    name: 'strLabel',
                    label: '标签',
                    type: 'string',
                    placeholder: '请输入标签',
                    rules: [{ required: true, message: '请输入标签' }]
                }, {
                    name: 'ModelUUID',
                    label: '设备型号',
                    type: 'select',
                    defaultValue:'1',
                    rules: [{ required: true, message: '请选择设备型号' }],
                    options:DeviceModelList
                }
            ],
            //查询的数据项
            RType: [
                {
                    name: 'keyWord',
                    label: '搜索内容',
                    type: 'string',
                    placeholder: '请输入要搜索的内容'
                }, {
                    name: 'ModelUUID',
                    label: '设备型号',
                    type: 'select',
                    hasAllButtom: true,
                    defaultValue: '-1',
                    width: 150,
                    options:DeviceModelList
                }, {
                    name: 'TypeUUID',
                    label: '设备类别',
                    type: 'select',
                    hasAllButtom: true,
                    defaultValue: '-1',
                    width: 150,
                    options:DeviceTypeList
                },
            ],

            /*==回调函数=======================================*/
            // 初始化页面的数据 回调函数传入 items 列表
            pageData: function ( num, callback ) {
                const dat = {
                  nPageIndex: 0,
                  nPageSize: -1,
                  ModelUUID: -1,
                  // WorkshopUUID: -1,
                  TypeUUID: -1,
                  KeyWord: ""
                }
                TPostData( this.url, "ListActive", dat, function ( res ) {
                  var list = [];
                  console.log("查询到设备列表", res);
                  var device_list = res.obj.objectlist || [];
                  var totalcount = res.obj.totalcount;
                  device_list.forEach( function ( item, index ) {
                    list.push( {
                      key: index,
                      UUID: item.UUID,
                      ModelUUID: item.ModelUUID,
                      DeviceID: item.ID,
                      WorkshopUUID: item.WorkshopUUID,
                      strDeviceName: item.Name,
                      strDeviceModel: item.ModelName,
                      strDeviceSN: item.SN,
                      strDeviceType: item.TypeName,
                      strLabel: item.Label,
                      strDesc:item.Desc
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
                  ModelUUID: data.ModelUUID,
                  ID: data.strDeviceID,
                  Name: data.strDeviceName,
                  SN: data.strDeviceSN,
                  Label:data.strLabel
                }
                // console.log('创建后的数据是:', data);
                TPostData( this.url, "Add", dat, function ( res ) {
                  callback( dat );
                } )
            },
              //信息修改回调处理
            Update: function ( data, callback ) {
                // console.log("看看Device-UPDATE data", data);
                let dat = {
                  UUID: data.UUID,
                  ModelUUID: data.ModelUUID,
                  ID: data.DeviceID,
                  Name: data.strDeviceName,
                  SN: data.strDeviceSN,
                  Label:data.strLabel,
                  Desc: data.Desc,
                  Note: data.Note
                }
                console.log("看看Device-UPDATE data", dat);
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
                // console.log( '查询的内容:', data );
                const dat = {
                  nPageIndex: 0,
                  nPageSize: -1,
                  ModelUUID: data.ModelUUID,
                  TypeUUID: data.TypeUUID,
                  // WorkshopUUID: data.WorkshopUUID,
                  KeyWord: data.keyWord,
                }

                TPostData( this.url, "ListActive", dat, function ( res ) {
                  var list = [];
                  // console.log( "查询到设备列表", res );
                  var device_list = res.obj.objectlist || [];
                  var totalcount = res.obj.totalcount;
                  device_list.forEach( function ( item, index ) {
                    list.push( {
                      key: index,
                      UUID: item.UUID,
                      ModelUUID: item.ModelUUID,
                      DeviceID: item.ID,
                      strDeviceName: item.Name,
                      strDeviceModel: item.ModelName,
                      strDeviceSN: item.SN,
                      strDeviceType: item.TypeName,
                      // strOwnedWorkshop: item.WorkshopName,
                      strLabel: item.Label
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
        // const Feature = FeatureSetConfig( tableConfig );
    }


    render() {
        let Feature=this.feature;
        return (
            <div>
                {/* <PageTitle title={ '设备列表' } /> */}
                <Feature />
            </div>
        )
    }
}
