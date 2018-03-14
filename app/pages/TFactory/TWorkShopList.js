/**
 *这是车间列表页
 *添加日期:2018.03.02
 *添加人:shaw
 **/
/******引入ant或其他第三方依赖文件*******************/
import React, { Component } from 'react'
import FeatureSetConfig from '../../components/TCommon/shawCommon/tableConfig';
import { Table, Menu, Icon, Badge, Dropdown,message } from 'antd';
import { TPostData } from '../../utils/TAjax';

let seft
export default class DeviceList extends Component {

    constructor( props ) {
        super( props )
        this.state = {
            WSTypeList:[]
        }
        seft = this;
        this.url='/api/TFactory/workshop_type'
    }

    componentWillMount(){
        // let typeList=this.state.WSTypeList;
        let typeList=[];
        TPostData( this.url, "ListActive", {PageIndex: 0,PageSize: -1},
            ( res )=> {
                console.log("查询到车间类别列表", res);
                let data_list = res.obj.objectlist || [];
                data_list.forEach( function ( item, index ) {
                    typeList.push({key: index,value:item.UUID.toString(), text: item.Name})
                } )
            },
            ( error )=> {
              message.info( error );
            }
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
            url: '/api/TFactory/workshop',
            // url: this.props.server.url+'Handler_Workshop_V1.ashx',
            //table表格是否是可勾选
            isSelection: false,
            //table表格表头配置参数
            columns:[
                {
                    title: '序号',
                    dataIndex: 'key',
                    type: 'string'
                },
                {
                    title: '车间名称',
                    dataIndex: 'Name',
                    type: 'string'
                },
                {
                    title: '车间编号',
                    dataIndex: 'Number',
                    type: 'string'
                },
                {
                    title: '车间类别',
                    dataIndex: 'TypeName',
                    type: 'string'
                },
                {
                    title: '备注',
                    dataIndex: 'Desc',
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
            UType: [
                {
                    name: 'Name',
                    label: '车间名称',
                    type: 'string',
                    placeholder: '请输入车间名称',
                    rules: [{ required: true, message: '名称不能为空' }],
                },
                {
                    name: 'Number',
                    label: '车间编号',
                    type: 'string',
                    placeholder: '请输入车间编号',
                    rules: [{ required: true, message: '编号不能为空' }],
                },
                {
                    name: 'TypeUUID',
                    label: '车间类别',
                    type: 'select',
                    rules: [{ required: true, message: '请选择车间类别' }],
                    /*postJson: {
                        // postUrl: this.props.server.url+'Handler_WorkshopType_V1.ashx',
                        postUrl: '/api/TFactory/workshop',
                        method: 'ListActive',
                        dat: {
                            PageIndex: 0,
                            PageSize: -1
                        }
                    },
                    options: [{
                        text: "型号1",
                        value: '1'
                        }, {
                            text: "型号2",
                            value: '2'
                        }, {
                            text: "型号3",
                            value: '3'
                        }
                    ],*/
                    options:typeList
                },
                {
                    name: 'Desc',
                    label: '备注',
                    type: 'string',
                    placeholder: '',
                }
            ],
            //添加的弹出框菜单
            CType: [
                {
                    name: 'TypeUUID',
                    label: '车间类别',
                    type: 'select',
                    rules: [{ required: true, message: '请选择类别' }],
                    options:typeList
                },
                {
                    name: 'Name',
                    label: '车间名称',
                    type: 'string',
                    placeholder: '请输入车间名称',
                    rules: [{ required: true, message: '名称不能为空' }],
                },
                {
                    name: 'ID',
                    label: '车间编号',
                    type: 'string',
                    placeholder: '请输入车间编号',
                    rules: [{ required: true, message: '编号不能为空' }],
                },
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
                    label: '车间类别',
                    type: 'select',
                    hasAllButtom: true,
                    defaultValue: '-1',
                    width: 150,
                    options:typeList
                }
            ],
            /*==回调函数=======================================*/
            // 初始化页面的数据 回调函数传入 items 列表
            pageData: function ( num, callback ) {
                const dat = {
                    PageIndex : 0,       //分页：页序号，不分页时设为0
                    PageSize : -1,   //分页：每页记录数，不分页时设为-1
                    FactoryUUID: -1,    //所属工厂UUID，不作为查询条件时取值设为-1
                    TypeUUID: -1,  //类型UUID，不作为查询条件时取值设为-1
                    KeyWord : ""
                }
                TPostData( this.url, "ListActive", dat, function ( res ) {
                  var list = [];
                  console.log("查询到车间列表", res);
                  var data_list = res.obj.objectlist || [];
                  var totalcount = res.obj.totalcount;
                  data_list.forEach( function ( item, index ) {
                    list.push( {
                      key:index,
                      UUID :item.UUID,
                      FactoryUUID: item.FactoryUUID,
                      TypeUUID: item.TypeUUID,
                      Name:item.Name,
                      Number:item.ID,
                      TypeName:item.TypeName, //类别名称
                      Desc:item.Desc,
                      UpdateDateTime:item.UpdateDateTime,
                      Note:item.Note,
                      TypeID:item.TypeID, //类别编号
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
                    FactoryUUID: data.FactoryUUID,
                    TypeUUID: data.TypeUUID,
                    Name: data.Name,
                    ID: data.ID
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
                    TypeUUID: data.TypeUUID,
                    FactoryUUID:-1,
                    Name: data.Name,
                    ID: data.Number,
                    Desc: data.Desc,
                    Note: "---"
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
                    PageIndex : 0,       //分页：页序号，不分页时设为0
                    PageSize : -1,   //分页：每页记录数，不分页时设为-1
                    FactoryUUID: -1,    //所属工厂UUID，不作为查询条件时取值设为-1
                    TypeUUID: data.TypeUUID,  //类型UUID，不作为查询条件时取值设为-1
                    KeyWord : data.keyWord
                }

                TPostData( this.url, "ListActive", dat, function ( res ) {
                  var list = [];
                  var data_list = res.obj.objectlist || [];
                  var totalcount = res.obj.totalcount;
                  data_list.forEach( function ( item, index ) {
                    list.push( {
                        key:index,
                        UUID :item.UUID,
                        FactoryUUID: item.FactoryUUID,
                        TypeUUID: item.TypeUUID,
                        Name:item.Name,
                        Number:item.ID,
                        TypeName:item.TypeName, //类别名称
                        Desc:item.UpdateDateTime,
                        Desc:item.Desc,
                        Note:item.Note,
                        TypeID:item.TypeID, //类别编号
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
    }

    componentDidMount() {

    }


    render() {
        let Feature=this.feature;
        return (
            <div>
                <Feature />
            </div>
        )
    }
}
