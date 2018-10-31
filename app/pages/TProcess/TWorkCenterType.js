/**
 *这是工作中心类别页
 *添加日期:2017.12.05
 *添加人:shaw
 **/
import React, { Component } from 'react';
import { Table,Modal, Menu, Icon, Badge, Dropdown,message,Divider,Popconfirm } from 'antd';
// import FeatureSetConfig from '../../components/TCommon/tableConfig';
import { TPostData } from '../../utils/TAjax';
import SimpleTable from 'components/TTable/SimpleTable';
import { CreateModal,UpdateModal } from 'components/TModal';
import {SimpleQForm,StandardQForm } from 'components/TForm';
import PageHeaderLayout from '../../base/PageHeaderLayout';
const confirm = Modal.confirm;
let seft

export default class workstationType extends Component {

    constructor(props) {
        super(props)
        this.state = {
            tableDataList:[],
            wsTypeList:[],
            updateFromItem:{},
            total:0,
            current:1,
            pageSize:10,
            UModalShow:false,
            loading:true,
        }
        this.url='/api/TProcess/workcenter_type'
        seft = this;
    }

    componentWillMount(){
        this.getTableList();

        const tableConfig = {

            //table类别
            type: 'tableFeature',
            //请求url
            url: '/api/TProcess/workcenter_type',
            // url: this.props.server.url+'Handler_WorkstationType_V1.ashx',
            // url: 'http://demo.sc.mes.top-link.me/service/Handler_WorkstationType_V1.ashx',
            //table表格表头配置参数
            columns: [
                {
                    title: '序号',
                    dataIndex: 'key',
                    type: 'string'
                },
                {
                    title: '名称',
                    dataIndex: 'Name',
                    // width:150,
                    type: 'string'
                }, /*{
                    title: '编号',
                    dataIndex: 'ID',
                    // width:150,
                    type: 'string'
                },*/ {
                    title: '描述',
                    dataIndex: 'Desc',
                    // width:150,
                    type: 'string'
                }, {
                    title: '备注',
                    dataIndex: 'Note',
                    // width:150,
                    type: 'string'
                },  {
                    title: '修改时间',
                    dataIndex: 'UpdateDateTime',
                    type: 'string'
                },{
                    title: '操作',
                    dataIndex: 'uMachineUUID',
                    type: 'operate', // 操作的类别必须为 operate
                    // width:80,
                    btns: [
                        {
                            text: '修改',
                            type: 'edit',
                            icon:'edit'
                        },
                        {
                            text: '删除',
                            type: 'delete',
                            icon:'delete',
                            havePopconfirm: true,
                            popText: '确定要删除此记录?'
                        }
                    ]
                }
            ],
            //更新弹框数据项
            UType: [
                {
                    name: 'Name',
                    label: '名称',
                    type: 'string',
                    placeholder: '请输入工作中心名称',
                    rules: [{ required: true, message: '请输入名称' }]
                },/* {
                    name: 'ID',
                    label: '编号',
                    type: 'string',
                    placeholder: '请输入编码',
                    rules: [{ required: true, message: '请输入编码' }]
                },*/ {
                    name: 'Desc',
                    label: '描述',
                    type: 'string',
                    placeholder: '请输入描述',
                    // rules: [{ required: true, message: '请输入工作中心编号,工作中心编号至少2个字符' }]
                }, {
                    name: 'Note',
                    label: '备注',
                    type: 'string',
                    placeholder: '请输入详情'
                }
            ],
            // 可设置的查询字段
            CType: [
                {
                    name: 'Name',
                    label: '名称',
                    type: 'string',
                    placeholder: '请输入名称',
                    rules: [{ required: true, message: '请输入名称' }]
                }/*,{
                    name: 'ID',
                    label: '编号',
                    type: 'string',
                    placeholder: '请输入编码',
                    rules: [{ required: true, message: '请输入编码' }]
                }*/
            ],
            //查询的数据项
            RType: [
                {
                    name: 'keyWord',
                    label: '搜索内容',
                    type: 'string',
                    placeholder: '请输入要搜索的内容'
                }
            ],
            /*==回调函数=======================================*/
            // 初始化页面的数据 回调函数传入 items 列表
            pageData: function(num, callback) {

                const dat = {
                    PageIndex: 0,
                    PageSize: -1,
                    KeyWord: ""
                }

                TPostData(this.url, "ListActive", dat, function(res) {
                    var list = [];
                    console.log( "查询到工作学习类别", res );
                    var workstation_list = res.obj.objectlist || [];
                    var totalCount = res.obj.totalcount;
                    workstation_list.forEach(function(item, index) {
                        list.push({
                            key: index,
                            Name: item.Name,
                            ID: item.ID,
                            Desc: item.Desc,
                            Note: item.Note,
                            UUID: item.UUID,
                            UpdateDateTime:item.UpdateDateTime
                        })
                    })
                    callback(list, {
                        total: totalCount,
                        nPageSize: 10
                    })
                }, function(error) {
                    message.info(error);
                })
            },
            // 模拟添加数据的接口 回调
            Create: function(data, callback) {
                let dat = {
                    key: '1000',
                    // ID: data.ID,
                    ID: "-",
                    Name: data.Name
                }

                TPostData(this.url, "Add", dat, function(res) {
                    callback(dat);
                })
            },
            //客户信息修改
            Update: function(data, callback) {
                let dat = {
                    UUID: data.UUID,
                    Name: data.Name,
                    // ID: data.ID,
                    ID: "-",
                    Desc: data.Desc,
                    Note: data.Note,
                }

                TPostData(this.url, "Update", dat, function(res) {
                    //这块请求更新数据 成功回调
                    callback(data)
                })
            },
            // 删除操作
            Delete: function(data, callback) {
                var dat = {
                    UUID: data.UUID,
                    // Status: 0
                }
                TPostData(this.url, "Inactive", dat, function(res) {
                    //这块请求更新数据 成功回调
                    callback(data);
                })
            },
            // 创建项目所需的字段 与 更新项目所需的字段
            // rules 规范可见 https://github.com/yiminghe/async-validator
            // 查询操作回调
            Retrieve: function(data, callback) {
                const dat = {
                    nPageIndex: 0,
                    nPageSize: -1,
                    KeyWord: data.keyWord
                }

                TPostData(this.url, "ListActive", dat, function(res) {
                    var list = [];
                    // console.log("查询到工作学习类别", res);
                    var workstation_list = res.obj.objectlist || [];
                    var totalCount = res.obj.totalcount;
                    workstation_list.forEach(function(item, index) {
                        list.push({
                            key: index,
                            Name: item.Name,
                            ID: item.ID,
                            Desc: item.Desc,
                            Note: item.Note,
                            UUID: item.UUID,
                            UpdateDateTime:item.UpdateDateTime
                        })
                    })
                    callback(list, {
                        total: totalCount,
                        nPageSize: 10
                    })
                }, function(error) {
                    message.info(error);
                })
            },
        };
        // this.feature = FeatureSetConfig(tableConfig);
    }

    getTableList(que){
        const {current,pageSize}=this.state;
        const dat = {
            PageIndex : current-1,       //分页：页序号，不分页时设为0
            PageSize:pageSize,   //分页：每页记录数，不分页时设为-1
            // FactoryUUID: -1,    //所属工厂UUID，不作为查询条件时取值设为-1
            // TypeUUID: que?que.TypeUUID:-1,  //类型UUID，不作为查询条件时取值设为-1
            KeyWord : que?que.keyWord:''
        }

        TPostData( this.url, "ListActive", dat,
            (res) => {
                var list = [];
                console.log("查询到工作中心类别列表", res);
                var data_list = res.obj.objectlist || [];
                var totalcount = res.obj.totalcount;
                data_list.forEach((item, index)=> {
                    list.push({
                        key: index,
                        Name: item.Name,
                        ID: item.ID,
                        Desc: item.Desc,
                        Note: item.Note,
                        UUID: item.UUID,
                        UpdateDateTime: item.UpdateDateTime
                    })
                })
                this.setState({ tableDataList: list, total: totalcount, loading: false });
            },
            ( error )=> {
              message.info( error );
            }
        )

    }

    handleCreat=(data)=>{
        let dat = {
             // ID: data.ID,
             ID: "-",
             Name: data.Name
        }
        TPostData( this.url, "Add", dat,
            ( res )=> {
                message.success("创建成功！");
                this.getTableList();
            },
            ( err )=> {
                message.error("创建失败！");
                console.log('err',err);
            }
        )
    }

    handleQuery=(data)=>{
        console.log("查询的值是:",data);
        const {keyWord,TypeUUID}=data;
        // this.setState({keyWord,TypeUUID});
        this.getTableList({keyWord,TypeUUID});
    }

    handleUpdate=(data)=>{
        let dat = {
            UUID: this.state.updateFromItem.UUID,
            Name: data.Name,
            // ID: data.ID,
            ID: "-",
            Desc: data.Desc,
            Note: data.Note,
        }

        TPostData( this.url, "Update", dat,
            ( res )=> {
                message.success("更新成功！");
                this.getTableList();
            },
            ( err )=> {
                message.error("更新失败！");
                console.log('err',err);
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

    handleTableChange=(pagination)=>{
        // console.log('pagination',pagination);
        const {current,pageSize}=pagination;
        this.setState({current,pageSize,loading:true},()=>{
            this.getTableList();
        });
    }

    toggleUModalShow=(record)=>{
        this.setState({UModalShow:!this.state.UModalShow,updateFromItem:record});
    }



    render() {
        let Feature=this.feature;
        const {wsTypeList,tableDataList,loading,current,total,pageSize,updateFromItem,UModalShow}=this.state;
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
                title: '名称',
                dataIndex: 'Name',
                // width:150,
                type: 'string'
            }, /*{
                title: '编号',
                dataIndex: 'ID',
                // width:150,
                type: 'string'
            },*/ {
                title: '描述',
                dataIndex: 'Desc',
                // width:150,
                type: 'string'
            }, {
                title: '备注',
                dataIndex: 'Note',
                // width:150,
                type: 'string'
            },  {
                title: '修改时间',
                dataIndex: 'UpdateDateTime',
                type: 'string'
            },{
                title: '操作',
                dataIndex: 'uMachineUUID',
                render:(txt,record)=>{
                    return <span>
                        <a onClick={this.toggleUModalShow.bind(this,record)}>编辑</a>
                        <Divider type="vertical"/>
                        <Popconfirm
                            placement="topRight"
                            title="确定删除此项数据？"
                            onConfirm={this.handleDelete.bind(this,record)}
                            okText="确定" cancelText="取消">
                            <a href="#">删除</a>
                        </Popconfirm>
                    </span>
                }
            }
        ];
        //更新弹框数据项
        const UFormItem= [
            {
                name: 'Name',
                label: '名称',
                type: 'string',
                placeholder: '请输入工作中心名称',
                rules: [{ required: true, message: '请输入名称' }]
            },/* {
                name: 'ID',
                label: '编号',
                type: 'string',
                placeholder: '请输入编码',
                rules: [{ required: true, message: '请输入编码' }]
            },*/ {
                name: 'Desc',
                label: '描述',
                type: 'string',
                placeholder: '请输入描述',
                // rules: [{ required: true, message: '请输入工作中心编号,工作中心编号至少2个字符' }]
            }, {
                name: 'Note',
                label: '备注',
                type: 'string',
                placeholder: '请输入详情'
            }
        ];
        // 可设置的查询字段
        const CFormItem= [
            {
                name: 'Name',
                label: '名称',
                type: 'string',
                placeholder: '请输入名称',
                rules: [{ required: true, message: '请输入名称' }]
            }/*,{
                name: 'ID',
                label: '编号',
                type: 'string',
                placeholder: '请输入编码',
                rules: [{ required: true, message: '请输入编码' }]
            }*/
        ];
        //查询的数据项
        const RFormItem= [
            {
                name: 'keyWord',
                label: '搜索内容',
                type: 'string',
                placeholder: '请输入要搜索的内容'
            }
        ];

        const bcList = [{
          title:"首页",
          href: '/',
          }, {
          title: '生产资料',
          href: '/',
          }, {
          title: '物料类别',
          }];

        return (
            <PageHeaderLayout title="物料类别" wrapperClassName="pageContent" BreadcrumbList={bcList}>
                <div className="cardContent">
                    {/* <SimpleQForm
                        FormItem={RFormItem}
                        submit={this.handleQuery}
                    /> */}
                    <CreateModal
                        FormItem={CFormItem}
                        submit={this.handleCreat.bind(this)}
                    />
                    <SimpleTable
                        size="middle"
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
            </PageHeaderLayout>
        )
    }
}
