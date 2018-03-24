/**
 *这是BOM管理
 *添加日期:2017.12.06
 *添加人:shaw
 **/
import React, { Component } from 'react'
import { hashHistory, Link } from 'react-router'
import { Button, Icon, Popover,message,Breadcrumb  } from 'antd';
import FeatureSetConfig from '../../components/TCommon/shawCommon/tableConfig';
import { TPostData } from '../../utils/TAjax';
import TBomDetail from './TBomDetail';
let seft
let creatKeyWord;

export default class TBomList extends Component {
    constructor( props ) {
        super( props )
        this.state = {
            showDetal:false,
            detailID:0
        }
        this.url='/api/TProduct/product_model'
    }

    componentWillMount() {
        let productModelList = [];

        TPostData( this.url, 'ListActive',
            {
                'PageIndex': 0,
                'PageSize': -1,
                "TypeUUID": -1,
                "KeyWord": ""
            },
            function ( res ) {
                var Ui_list = res.obj.objectlist || [];
                Ui_list.forEach( function ( item, index ) {
                    productModelList.push( { key: index, value: item.UUID.toString(), text: item.Name } )
                } )
            },
            function ( error ) {
                message.info( error );
            },
            false
        )

        const Config = {

            url: '/api/TBom/bom',

            columns: [
                {
                    title: '序号',
                    dataIndex: 'key',
                    type: 'string'
                },
                {
                    title: "名称",
                    dataIndex: "Name",
                    type: "string"
                },
                {
                    title: "编号",
                    dataIndex: "ID",
                    type: "string"
                },
                {
                    title: "版本",
                    dataIndex: "Version",
                    type: "string"
                },
                {
                    title: "型号编号",
                    dataIndex: "ProductModelID",
                    type: "string"
                },
                {
                    title: "产品名称",
                    dataIndex: "ProductModelName",
                    type: "string"
                },
                {
                    title: "描述",
                    dataIndex: "Desc",
                    type: "string"
                },
                {
                    title: "备注",
                    dataIndex: "Note",
                    type: "string"
                },
                {
                    title: "修改时间",
                    dataIndex: "UpdateDateTime",
                    type: "string",
                    /*type: 'sort',
                    sorter: ( a, b ) => {
                        return CpTime( a, b )
                    }*/
                },
                {
                    title: "操作",
                    dataIndex: "Status",
                    type: "operate", // 操作的类型必须为 operate
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
                        {
                            //详情页进行的跳转.
                            render: ( text, item ) => {
                                return (
                                    <a href="javascript:void 0;" onClick={this.toggleRender.bind(this,item)}>
                                        {/* <Link to={path}><Icon type="profile" /></Link> */}
                                        <Icon type="profile" />
                                    </a>
                                )
                            }
                        }
                    ]
                }
            ],

            UType: [
                {
                    name: 'Name',
                    label: '名称',
                    type: 'string',
                    rules: [{ required: true, message: '请输入BOM名称' }],
                    placeholder: '请输入名称'
                },
                {
                    name: 'ID',
                    label: '编号',
                    type: 'string',
                    rules: [{ required: true, message: '请输入编号' }],
                    placeholder: '请输入编号'
                },
                {
                    name: 'Version',
                    label: '版本',
                    type: 'string',
                    rules: [{ required: true, message: '请输入版本' }],
                    placeholder: '请输入版本'
                },
                {
                    name: 'Desc',
                    label: '描述',
                    type: 'string',
                    placeholder: '请输入描述'
                },
                {
                    name: 'Note',
                    label: '备注',
                    type: 'string',
                    placeholder: '请输入备注'
                }
            ],

            CType: [
                {
                    name: 'Name',
                    label: '名称',
                    type: 'string',
                    rules: [{ required: true, message: '请输入设备名称' }],
                    placeholder: '请输入名称'
                },
                {
                    name: 'ID',
                    label: '编号',
                    type: 'string',
                    rules: [{ required: true, message: '请输入编号' }],
                    placeholder: '请输入编号'
                },
                {
                    name: "ProductModelUUID",
                    label: "产品型号",
                    type: "select",
                    rules: [{ required: true, message: '请选择型号' }],
                    options: productModelList
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
                   name: 'ModelUUID',
                   label: '产品型号',
                   type: 'select',
                   hasAllButtom: true,
                   defaultValue: '-1',
                   width: 150,
                   options:productModelList
               },
            ],
            // 初始化页面的数据 回调函数传入 items 列表
            pageData: function ( num, callback ) {
                var dat = {
                    PageIndex: 0,
                    PageSize: -1,
                    ProductModelUUID: -1,
                    KeyWord: ""
                }
                TPostData( this.url, "ListActive", dat,  ( res )=> {
                    var list = [];
                    var Ui_list = res.obj.objectlist || [];
                    var totalcount = res.obj.totalcount;
                    creatKeyWord = res.obj.objectlist.length;
                    Ui_list.forEach( function ( item, index ) {
                        list.push( {
                            key: index,
                            UUID: item.UUID,
                            ProductModelUUID: item.ProductModelUUID,
                            Name: item.Name,
                            ID: item.ID,
                            Version: item.Version,
                            ProductModelID: item.ProductModelID,
                            ProductModelSN: item.ProductModelSN,
                            ProductModelName: item.ProductModelName,
                            Desc: item.Desc,
                            Note: item.Note,
                            UpdateDateTime: item.UpdateDateTime,
                            Status: item.Status,
                        } )
                    } )
                    /*const pagination = {
                        ...this.state.pagination
                    }*/
                    // pagination.total = totalcount;
                    callback( list, {
                        // total: pagination.total,
                        nPageSize: 10
                    } )
                }, function ( error ) {
                    message.info( error );
                } )
            },

            Create: function ( data, callback ) {
                creatKeyWord++;
                let dat = {
                    key: creatKeyWord,
                    ID: data.ID,
                    Name: data.Name,
                    ProductModelUUID: data.ProductModelUUID
                }
                TPostData( this.url, "Add", dat, function ( res ) {
                    //这块请求更新数据 成功回调
                    callback( dat );
                } )
            },
            //数据更新：提交回调
            Update: function ( data, callback ) {
                let dat = {
                    UUID: data.UUID,
                    ID: data.ID,
                    Name: data.Name,
                    Version: data.Version,
                    Desc: data.Desc,
                    Note: data.Note
                }

                TPostData( this.url, "Update", dat, function ( res ) {
                    //这块请求更新数据 成功回调
                    callback( data )
                } )
            },
            //删除记录：提交回调
            Delete: function ( data, callback ) {
                var dat = {
                    UUID: data.UUID,
                }
                TPostData( this.url, "Inactive", dat, function ( res ) {
                    callback( data )
                } )
            },

            Retrieve: function ( data, callback ) {
                var dat = {
                    PageIndex: 0,
                    PageSize: -1,
                    ProductModelUUID: data.ModelUUID,
                    KeyWord: data.KeyWord
                }
                TPostData( this.url, "ListActive", dat,  ( res )=> {
                    var list = [];
                    var Ui_list = res.obj.objectlist || [];
                    var totalcount = res.obj.totalcount;
                    creatKeyWord = res.obj.objectlist.length;
                    Ui_list.forEach( function ( item, index ) {
                        list.push( {
                            key: index,
                            UUID: item.UUID,
                            ProductModelUUID: item.ProductModelUUID,
                            Name: item.Name,
                            ID: item.ID,
                            Version: item.Version,
                            ProductModelID: item.ProductModelID,
                            ProductModelSN: item.ProductModelSN,
                            ProductModelName: item.ProductModelName,
                            Desc: item.Desc,
                            Note: item.Note,
                            UpdateDateTime: item.UpdateDateTime,
                            Status: item.Status,
                        } )
                    } )
                    /*const pagination = {
                        ...this.state.pagination
                    }*/
                    // pagination.total = totalcount;
                    callback( list, {
                        // total: pagination.total,
                        nPageSize: 10
                    } )
                }, function ( error ) {
                    message.info( error );
                } )
            }

        };
        this.feature = FeatureSetConfig( Config );
    }

    toggleRender(record){
        console.log("toggleRender",record);
        this.setState({showDetal:!this.state.showDetal,detailID:record.UUID})
    }


    render() {
        const {showDetal,detailID}=this.state;
        const {detail}=this.props;
        let Feature = this.feature;
        const BomDetail=(
            <div>
                <div>
                    <Breadcrumb style={{display:"inline-block"}}>
                        <Breadcrumb.Item>
                            <a onClick={this.toggleRender.bind(this)} href="#">BOM管理</a>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>BOM单详情</Breadcrumb.Item>
                    </Breadcrumb>
                    <span onClick={this.toggleRender.bind(this)} className="backup-button">
                        <Icon type="rollback" />
                    </span>
                </div>
                <TBomDetail UUID={detailID}/>
            </div>
        );
        return showDetal?BomDetail:<Feature/>;

        // return(
        //
        // )
    }
}
