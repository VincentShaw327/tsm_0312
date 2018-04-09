/**
 *这是设备列表页
 *添加日期:2017.12.06
 *添加人:shaw
 **/
import React, { Component } from 'react'
import { hashHistory, Link } from 'react-router'
import { Button, Icon,Popover ,message} from 'antd';
import FeatureSetConfig from '../../components/TCommon/tableConfig';
import { TPostData,urlBase } from '../../utils/TAjax';
let seft

export default class DeviceList extends Component {

    constructor( props ) {
        super( props )
        this.state = {}
        this.url='/api/TDevice/device_type';
        seft = this;
    }

    componentWillMount() {
        let DeviceTypeList = [];

        TPostData( this.url, 'ListActive', {
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
            //请求url
            url: '/api/TDevice/device_model',
            // url: this.props.server.url + 'Handler_DevModel_V1.ashx',
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
                    title: '图片',
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
                    title: '型号',
                    dataIndex: 'Name',
                    type: 'string'
                },
                {
                    title: '编号',
                    dataIndex: 'Number',
                    type: 'string'
                },
                {
                    title: '类别',
                    dataIndex: 'TypeName',
                    type: 'string'
                },
                {
                    title: '备注',
                    dataIndex: 'Desc',
                    type: 'string'
                },
                {
                    title: '更新时间',
                    dataIndex: 'UpdateDateTime',
                    type: 'string'
                },
                {
                    title: '操作',
                    dataIndex: 'operate',
                    type: 'operate', // 操作的类型必须为 operate
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
                        },
                        /* {
                            text: '位置',
                            type: 'place'
                        }, */
                    ]
                }
            ],
            //更新弹框数据项
            UType: [
                {
                    name: 'Name',
                    label: '型号名称',
                    type: 'string',
                    placeholder: '请输入型号名称',
                    rules: [ { required: true, message: '名称不能为空' } ],
                },
                {
                    name: 'Number',
                    label: '型号编号',
                    type: 'string',
                    placeholder: '请输入型号编号',
                    rules: [ { required: true, message: '编号不能为空' } ],
                },
                {
                    name: 'TypeUUID',
                    label: '设备类别',
                    type: 'select',
                    rules: [ { required: true, message: '请选择类别' } ],
                    options: DeviceTypeList
                },
                {
                    name: 'Desc',
                    label: '备注',
                    type: 'string',
                },
                {
                    name: 'Image',
                    label: '图片',
                    type: 'antUpload',
                    url: '/api/tupload/do',
                }
            ],
            //添加的弹出框菜单
            CType: [
                {
                    name: 'Name',
                    label: '型号名称',
                    type: 'string',
                    placeholder: '请输入型号名称',
                    rules: [ { required: true, message: '名称不能为空' } ],
                },
                {
                    name: 'Number',
                    label: '型号编号',
                    type: 'string',
                    placeholder: '请输入型号编号',
                    rules: [ { required: true, message: '编号不能为空' } ],
                },
                {
                    name: 'TypeUUID',
                    label: '设备类别',
                    rules: [ { required: true, message: '请选择类别' } ],
                    type: 'select',
                    options: DeviceTypeList,
                },
                {
                    name: 'Image',
                    label: '图片',
                    type: 'antUpload',
                    url: '/api/tupload/do',
                }
            ],
            //查询的数据项
            RType: [
                {
                    name: 'keyWord',
                    label: '搜索内容',
                    type: 'string',
                    placeholder: '请输入要搜索的内容'
                },
                {
                    name: 'TypeUUID',
                    label: '设备类别',
                    type: 'select',
                    hasAllButtom: true,
                    defaultValue: '-1',
                    width: 150,
                    options: DeviceTypeList
                }
            ],
            /*==回调函数=======================================*/
            // 初始化页面的数据 回调函数传入 items 列表
            pageData: function ( num, callback ) {
                const dat = {
                    PageIndex: 0,
                    PageSize: -1,
                    TypeUUID: -1,
                    CategoryUUID: -1,
                    VendorUUID: -1,
                    KeyWord: ""
                }
                TPostData( this.url, "ListActive", dat, function ( res ) {
                    var list = [];
                    console.log( "查询到设备型号列表", res );
                    var data_list = res.obj.objectlist || [];
                    var totalcount = res.obj.totalcount;
                    data_list.forEach( function ( item, index ) {
                        list.push( {
                            key: index,
                            UUID: item.UUID,
                            TypeUUID: item.TypeUUID,
                            Image: item.Image,
                            Name: item.Name,
                            Number: item.ID,
                            TypeName: item.TypeName,
                            Desc: item.Desc,
                            UpdateDateTime: item.UpdateDateTime,

                            TypeID: "-",
                            Status: 1,
                            Note: "-",
                            CategoryUUID: 0, //保留字段
                            VendorUUID: 0, //保留字段
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
                console.log("设备型号创建的data",data);
                let dat = {
                    key: '1000',
                    Name: data.Name,
                    ID: data.Number,
                    TypeUUID: data.TypeUUID,
                    CategoryUUID: -1,
                    VendorUUID: -1,
                    Path :data.Image
                }
                TPostData( this.url, "Add", dat, function ( res ) {
                    callback( dat );
                } )
            },
            //信息修改回调处理
            Update: function ( data, callback ) {
                console.log("设备型号编辑的data",data);

                let dat = {
                    UUID: data.UUID,
                    Name: data.Name,
                    ID: data.Number,
                    TypeUUID: data.TypeUUID,
                    Desc: data.Desc,
                    Note: '-',
                    CategoryUUID: -1,
                    VendorUUID: -1,
                    Path :data.Image
                }
                TPostData( this.url, "Update", dat, function ( res ) {
                    //这块请求更新数据 成功回调
                    callback( data )
                } )
            },

            /*UpdateImage: function ( data, callback ) {
                let dat = {
                    UUID: data.UUID,
                    Path: data.Image
                }
                TPostData( this.url, "UpdateImage", dat, function ( res ) {
                    console.log( '路径设置成功', res );
                    callback( data );
                }, function ( error ) {
                    message.info( error );
                } )
            },*/
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
                const dat = {
                    PageIndex: 0,
                    PageSize: -1,
                    TypeUUID: data.TypeUUID,
                    CategoryUUID: -1,
                    VendorUUID: -1,
                    KeyWord: data.keyWord
                }
                TPostData( this.url, "ListActive", dat, function ( res ) {
                    var list = [];
                    console.log( "查询到设备型号列表", res );
                    var data_list = res.obj.objectlist || [];
                    var totalcount = res.obj.totalcount;
                    data_list.forEach( function ( item, index ) {
                        list.push( {
                            key: index,
                            UUID: item.UUID,
                            TypeUUID: item.TypeUUID,
                            Image: item.Image,
                            Name: item.Name,
                            Number: item.ID,
                            TypeName: item.TypeName,
                            Desc: item.Desc,
                            UpdateDateTime: item.UpdateDateTime,

                            TypeID: "-",
                            Status: 1,
                            Note: "-",
                            CategoryUUID: 0, //保留字段
                            VendorUUID: 0, //保留字段
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
        this.feature = FeatureSetConfig( tableConfig );
    }


    render() {
        let Feature = this.feature;
        return (
            <div>
                <Feature />
            </div>
        )
    }
}
