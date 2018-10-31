/**
 *这是BOM管理
 *添加日期:2017.12.06
 *添加人:shaw
 **/
import React, { Component } from 'react';
import { hashHistory, Link } from 'react-router';
import { Button, Icon, Popover,message,Breadcrumb,Table,Card,Row,Col,Select,Input,Popconfirm  } from 'antd';
import { TPostData,urlBase } from '../../utils/TAjax';
import SimpleTable from 'components/TTable/SimpleTable';
import { CreateModal,UpdateModal } from 'components/TModal';
import {SimpleQForm,StandardQForm } from 'components/TForm';
import TBomDetail from './TBomDetail';
const Option = Select.Option;
import PageHeaderLayout from '../../base/PageHeaderLayout';

export default class TBomList extends Component {
    constructor( props ) {
        super( props )
        this.state = {
            tableDataList:[],
            total:0,
            current:1,
            pageSize:10,
            loading:true,

            ProModelList:[],
            BomList:[],
            showDetal:false,
            CModalShow:false,
            UModalShow:false,
            detailMessage:{},
            updateFromItem:{},
            detailID:0,
            ProModelUUID:-1
        }
        this.url= '/api/TBom/bom'
    }

    componentWillMount() {
        this.getTableList();
        this.getProModelList();
    }

    getTableList(){
        const {current,pageSize,ProModelUUID,keyWord}=this.state;

        var dat = {
            PageIndex : current-1,       //分页：页序号，不分页时设为0
            PageSize:pageSize,
            ProductModelUUID:ProModelUUID,
            KeyWord: keyWord
        }
        TPostData( '/api/TBom/bom', "ListActive", dat,
            ( res )=> {
                console.log("查询BOM列表：",res);
                let list = [],
                    Ui_list = res.obj.objectlist || [],
                    totalcount = res.obj.totalcount;

                Ui_list.forEach(
                    ( item, index )=> {
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
                this.setState({ tableDataList: list, total: totalcount, loading: false });
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
                this.getTableList();
            } ,
            ( res )=> {
                message.error("创建BOM失败！");
            }
        )
    }

    handleDelete=(data)=>{
        var dat = {
            UUID: data.UUID,
        }
        // console.log("看看data",data);
        TPostData( this.url, "Inactive", dat,
            ( res )=> {
                message.success("删除成功！");
                this.getTableList();
            },
            ( err )=> {
                message.error("删除失败！");
                console.log('err',err);
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
                this.getTableList();
            },
            ( res )=> {
                message.error("编辑BOM失败！");
            }
        )
    }

    handleQuery=(data)=>{
        const {keyWord,ProModelUUID}=data;
        this.setState({keyWord,ProModelUUID},()=>{
            this.getTableList();
        });
    }

    handleTableChange=(pagination)=>{
        // console.log('pagination',pagination);
        const {current,pageSize}=pagination;
        this.setState({current,pageSize},()=>{

            this.getTableList();
        });
    }

    toggleRender(record){
        // console.log("toggleRender",record);
        this.setState({
            showDetal:!this.state.showDetal,
            detailID:record.UUID,
            detailMessage:record
        })
    }

    toggleUModalShow=(record)=>{
        this.setState({UModalShow:!this.state.UModalShow,updateFromItem:record});
    }

    render() {
        const {detail}=this.props;
        const {tableDataList,ProModelList,loading,current,total,pageSize,updateFromItem,UModalShow,showDetal,detailID,detailMessage}=this.state;
        let Data={
            list:tableDataList,
            pagination:{total,current,pageSize}
        };

        const Tcolumns= [
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
                            <Popconfirm title="确定要删除?" onConfirm={() => this.handleDelete(record)}>
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
        //查询的数据项
        const RFormItem= [
            {
                name: 'keyWord',
                label: '搜索内容',
                type: 'string',
                placeholder: '请输入搜索内容'
            },{
                name: 'ProModelUUID',
                label: '产品型号',
                type: 'select',
                hasAllButtom: true,
                defaultValue: '-1',
                width: 150,
                options:ProModelList
            }
        ];

        const BomDetail=(<TBomDetail UUID={detailID} detailMessage={detailMessage}/>);

        const BomListTable=(
            <div className="cardContent">
                <SimpleQForm
                    FormItem={RFormItem}
                    submit={this.handleQuery}
                    />
                <CreateModal
                    FormItem={CFormItem}
                    submit={this.handleCreat.bind(this)}
                />
                <SimpleTable
                    loading={loading}
                    data={Data}
                    columns={Tcolumns}
                    isHaveSelect={false}
                    onChange={this.handleTableChange}
                />
                <UpdateModal
                    FormItem={UFormItem}
                    updateItem={updateFromItem}
                    submit={this.handleUpdate.bind(this)}
                    showModal={UModalShow}
                    hideModal={this.toggleUModalShow}
                />
            </div>
        )

        const bcList = [{
          title:"首页",
          href: '/',
          }, {
          title: '车间管理',
          href: '/',
          }, {
          title: '工作中心',
          }];

        const HeadAction=(
                <Button onClick={this.toggleRender.bind(this)} type="primary" icon="rollback">返回</Button>
            );

        const HeadContent=(
            <div style={{marginTop:15,height:80, border:'solid 0px #bbbbbb',borderRadius:6,paddingLeft:8}}>
                <Row  type="flex" justify="start" align="middle">
                    <Col span={8}>
                        <div style={{
                                fontSize:16,
                                display:'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-evenly',
                                height: 80}}>
                            <p>名称：<span>{detailMessage.Name}</span></p>
                            <p>编号：<span>{detailMessage.ID}</span></p>
                            <p>版本：<span>{detailMessage.Version}</span></p>
                        </div>
                    </Col>
                    <Col span={6}>
                        <div style={{
                                fontSize:16,
                                display:'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-evenly',
                                height: 80}}>
                            <p>产品型号：{detailMessage.ProductModelName}</p>
                            <p>产品序列号：{detailMessage.ProductModelSN}</p>
                            <p>备注：{detailMessage.Note}</p>
                        </div>
                    </Col>
                </Row>
            </div>
        );

        return(
            <PageHeaderLayout
                title={showDetal?"BOM列表":"BOM详情"}
                action={showDetal?HeadAction:''}
                content={showDetal?HeadContent:''}
                wrapperClassName="pageContent"
                BreadcrumbList={bcList}
                >
                    {showDetal?BomDetail:BomListTable}
            </PageHeaderLayout>
        );
    }
}
