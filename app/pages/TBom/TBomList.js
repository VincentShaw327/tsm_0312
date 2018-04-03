/**
 *这是BOM管理
 *添加日期:2017.12.06
 *添加人:shaw
 **/
import React, { Component } from 'react';
import { hashHistory, Link } from 'react-router';
import { Button, Icon, Popover,message,Breadcrumb,Table,
    Card,Row,Col,Select,Input,Popconfirm  } from 'antd';
import FeatureSetConfig from '../../components/TCommon/shawCommon/tableConfig';
import { TPostData } from '../../utils/TAjax';
import { CModal } from '../../components/TModal';
import TBomDetail from './TBomDetail';
const Option = Select.Option;

let seft
let creatKeyWord;

export default class TBomList extends Component {
    constructor( props ) {
        super( props )
        this.state = {
            ProModelList:[],
            BomList:[],
            showDetal:false,
            CModalShow:false,
            UModalShow:false,
            loading:false,
            detailMessage:{},
            updateFromItem:{},
            detailID:0,
            ProModelID:-1
        }
        this.url= '/api/TBom/bom'
    }

    componentWillMount() {
        // console.log("componentWillMount");
        this.getProModelList();
        this.getBOMList();
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
                    title: "产品型号",
                    dataIndex: "ProductModelName",
                    type: "string"
                },
                {
                    title: "产品序列号",
                    dataIndex: "ProductModelSN",
                    type: "string"
                },
                /*{
                    title: "描述",
                    dataIndex: "Desc",
                    type: "string"
                },*/
                {
                    title: "备注",
                    dataIndex: "Note",
                    type: "string"
                },
                /*{
                    title: "修改时间",
                    dataIndex: "UpdateDateTime",
                    type: "string",
                    type: 'sort',
                    sorter: ( a, b ) => {
                        return CpTime( a, b )
                    }
                },*/
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
                    options: this.state.ProModelList
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
                   options:this.state.ProModelList
                   // options:ProModelList
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
                    console.log("查询BOM列表：",res);
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
        // this.feature = FeatureSetConfig( Config );
    }

    getBOMList(){
        this.setState({loading:true});
        var dat = {
            PageIndex: 0,
            PageSize: -1,
            ProductModelUUID: this.state.ProModelID,
            KeyWord: this.keyWordInput?this.keyWordInput.input.value:''
        }
        TPostData( '/api/TBom/bom', "ListActive", dat,
            ( res )=> {
                console.log("查询BOM列表：",res);
                var list = [];
                var Ui_list = res.obj.objectlist || [];
                var totalcount = res.obj.totalcount;
                creatKeyWord = res.obj.objectlist.length;
                Ui_list.forEach( ( item, index )=> {
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
                }
                )
                this.setState({BomList:list,loading:false});
            },
            ( error )=> {
                message.info( error );
            }
        )
    }

    getProModelList(){
        TPostData( '/api/TProduct/product_model', 'ListActive',
            {
                'PageIndex': 0,
                'PageSize': -1,
                "TypeUUID": -1,
                "KeyWord": ""
            },
            ( res )=> {
                console.log("获取到产品型号：",res);
                var Ui_list = res.obj.objectlist || [];
                let list=[];
                Ui_list.forEach( function ( item, index ) {
                    list.push( { key: index, value: item.UUID.toString(), text: item.Name } )
                } );
                this.setState({ProModelList:list});
            },
            ( error )=>{
                message.info( error );
            }
        )
    }

    toggleRender(record){
        console.log("toggleRender",record);
        this.setState({
            showDetal:!this.state.showDetal,
            detailID:record.UUID,
            detailMessage:record
        })
    }

    toggleCModalShow(){
        this.setState({CModalShow:!this.state.CModalShow});
    }

    toggleUModalShow(record){
        // console.log("更新前",record);
        this.setState({UModalShow:!this.state.UModalShow,updateFromItem:record});
    }

    handleProChange(ele) {
        this.setState({ProModelID:ele});
    }

    handleCreat(data){
        // console.log('data',data);
        let dat = {
            ID: data.ID,
            Name: data.Name,
            ProductModelUUID: data.ProductModelUUID
        }
        TPostData( this.url, "Add", dat,
            ( res )=> {
                message.success("创建BOM成功！");
                this.getBOMList();
            } ,
            ( res )=> {
                message.error("创建BOM失败！");
            }
        )
    }

    handleUpdate(data){
        const {updateFromItem}=this.state;

        let dat = {
            UUID: updateFromItem.UUID,
            ID: data.ID,
            Name: data.Name,
            Version: data.Version,
            Desc: data.Desc,
            Note: data.Note
        }

        TPostData( this.url, "Update", dat,
            ( res )=> {
                message.success("编辑BOM成功！");
                this.getBOMList();
            },
            ( res )=> {
                message.error("编辑BOM失败！");
            }
        )
    }

    delete(data){
        var dat = {
            UUID: data.UUID,
        }
        TPostData( this.url, "Inactive", dat,
            ( res )=> {
                message.success('BOM删除成功！');
                this.getBOMList();
            } ,
            ( res )=> {
                message.error('BOM删除失败！');
            }
        )
    }

    render() {
        // let Feature = this.feature;
        const {showDetal,detailID,detailMessage}=this.state;
        const {detail}=this.props;
        const columns= [
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
                title: "产品型号",
                dataIndex: "ProductModelName",
                type: "string"
            },
            {
                title: "产品序列号",
                dataIndex: "ProductModelSN",
                type: "string"
            },
            {
                title: "备注",
                dataIndex: "Note",
                type: "string"
            },
            {
                title: "操作",
                dataIndex: "Status",
                width: 150,
                render: (text, record) => {
                    const {editable} = record;
                    return (
                        <div className="editable-row-operations">
                            <a onClick={() => this.toggleUModalShow(record)}>编辑</a>
                            <span className="ant-divider"></span>
                            <Popconfirm title="确定要删除?" onConfirm={() => this.delete(record)}>
                                    <a>删除</a>
                            </Popconfirm>
                            <span className="ant-divider"></span>
                            <a onClick={this.toggleRender.bind(this,record)}>详情</a>
                    </div>);
                }
            }
        ];

        const CFormItem=[
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
                options: this.state.ProModelList
            }
        ];

        const UFormItem= [
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
        ];


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
                <TBomDetail UUID={detailID} detailMessage={detailMessage}/>
            </div>
        );
        const BomListTable=(
            <div>
                <Card >
                    <Row gutter={16}>
                        <Col className="gutter-row" span={8}>
                            <div className="gutter-box"><span style={{ width: "40%" }}>搜索内容:</span>
                                <Input style={{ width: "60%" }}
                                    ref={(input) => { this.keyWordInput = input; }}
                                    placeholder="请输入搜索内容" />
                            </div>
                        </Col>
                        <Col className="gutter-row" span={8}>
                            <div className="gutter-box"><span style={{ width: "40%" }}>产品:</span>
                                <Select defaultValue="-1" style={{ width: "60%" }} onChange={this.handleProChange.bind(this)}>
                                    <Option value="-1" key="all">全部</Option>
                                    {
                                        this.state.ProModelList.map((item,index)=>{
                                                return (<Option value={item.value} key={index}>{item.text}</Option>)
                                        })
                                    }
                                </Select>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={8}>
                            <div className="gutter-box">
                                <Button onClick={this.getBOMList.bind(this)} type="primary" icon="search">查询</Button>
                            </div>
                        </Col>
                    </Row>
                </Card>
                <div style={{margin:"20px 0"}}>
                    <Button
                        onClick={this.toggleCModalShow.bind(this)}
                        icon="plus" type="primary">添加</Button>
                </div>
                <Table
                  // rowSelection={this.state.isSelection?rowSelection:null}
                  // expandedRowRender={this.renderSubTable.bind(this)}
                  dataSource={this.state.BomList}
                  columns={columns}
                  loading={this.state.loading}
                  // bordered={bordered}
                  size="middle"
                  // scroll={scroll}
                />
                <CModal
                    FormItem={CFormItem}
                    submit={this.handleCreat.bind(this)}
                    isShow={this.state.CModalShow}
                    hideForm={this.toggleCModalShow.bind(this)}
                />
                <CModal
                    FormItem={UFormItem}
                    updateItem={this.state.updateFromItem}
                    submit={this.handleUpdate.bind(this)}
                    isShow={this.state.UModalShow}
                    hideForm={this.toggleUModalShow.bind(this)}
                />
            </div>

        )
        return showDetal?BomDetail:BomListTable;
    }
}
