/**
 *这是设备列表页
 *添加日期:2017.12.06
 *添加人:shaw
 **/
 import React, { Component } from 'react'
 import { hashHistory, Link } from 'react-router'
import { Table, Menu, Icon, Badge,Popover, Dropdown,message,Divider,Popconfirm } from 'antd';
 import { TPostData,TPostMock } from 'utils/TAjax';
 import SimpleTable from 'components/TTable/SimpleTable';
import { CreateModal,UpdateModal } from 'components/TModal';
import {SimpleQForm,StandardQForm } from 'components/TForm';
import PageHeaderLayout from '../../base/PageHeaderLayout';


export default class TDefectiveType extends Component {

    constructor( props ) {
        super( props )
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
        this.url= '/api/TWms/material_type';
    }

    componentWillMount(){
        this.getTableList();
    }

    getTableList(que){
        const {current,pageSize,keyWord}=this.state;
        const dat = {
            PageIndex : current-1,       //分页：页序号，不分页时设为0
            PageSize:pageSize,   //分页：每页记录数，不分页时设为-1
            ParentUUID: -1, //保留字段，取值设为-1
            KeyWord :keyWord,
        }

        TPostMock( '/defe_type', "ListActive", dat,
            (res) => {
                var list = [];
                console.log("查询到工作中心类别列表", res);
                var data_list = res.obj.objectlist || [];
                var totalcount = res.obj.totalCount;
                data_list.forEach((item, index)=> {
                    list.push( {
                        key:index,
                        UUID : item.UUID,
                        Name:item.Name,
                        ID:item.ID,
                        Founder:item.Founder,
                        CreatDateTime:item.CreatDateTime,
                        Renewing:item.Renewing,
                        UpdateDateTime:item.UpdateDateTime,
                      } )
                })
                this.setState({ tableDataList: list, total: totalcount, loading: false });
            },
            ( error )=> {
              message.error( error );
              this.setState({loading:true});
            }
        )

    }

    handleCreat=(data)=>{
        let dat = {
            Name:data.Name,
            ID:data.Number,
            ParentUUID: -1, //保留字段，取值设为-1
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

    handleUpdate=(data)=>{
        let dat = {
            UUID: this.state.updateFromItem.UUID,
            ParentUUID: -1, //保留字段，取值设为-1
            Name:data.Name,
            ID:data.Number,
            Desc : data.Desc,
            Note : '-',
        }
        console.log('dat',dat,this.state.updateFromItem.UUID)
        TPostData( this.url, "Update", dat,
            ( res )=> {
                message.success("更新成功！");
                this.getTableList();
            },
            ( err )=> {
                message.error("更新失败！",err);
                console.log('err',err);
            }
        )
    }

    handleDelete=(data)=>{
        var dat = {
            UUID: data.UUID,
        }
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

    handleQuery=(data)=>{
        console.log("查询的值是:",data);
        const {keyWord,TypeUUID}=data;
        this.setState({keyWord,TypeUUID},()=>{
            this.getTableList();
        });
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
        const {tableDataList,loading,current,total,pageSize,updateFromItem,UModalShow}=this.state;
        let Data={
            list:tableDataList,
            pagination:{total,current,pageSize}
        };

        //table表格表头参数
        const Tcolumns=[
            {
                title: '序号',
                dataIndex: 'key',
                type: 'string'
            },
            {
                title: '区域类型',
                dataIndex: 'Name',
                type: 'string'
            },
            {
                title: '编号',
                dataIndex: 'ID',
                type: 'string'
            },
            {
                title: '创建人',
                dataIndex: 'Founder',
                type: 'string'
            },
            {
                title: '创建时间',
                dataIndex: 'CreatDateTime',
                type: 'string'
            },
            {
                title: '修改人',
                dataIndex: 'Renewing',
                type: 'string'
            },
            {
                title: '修改时间',
                dataIndex: 'UpdateDateTime',
                type: 'string'
            },
            {
                title: '操作',
                dataIndex: 'UUID',
                render:(UUID,record)=>{
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
                label: '型号名称',
                type: 'string',
                placeholder: '请输入型号名称',
                rules: [{ required: true, message: '名称不能为空' }],
            },
            {
                name: 'Number',
                label: '型号编号',
                type: 'string',
                placeholder: '请输入模具编号',
                rules: [{ required: true, message: '编号不能为空' }],
            },
            {
                name: 'Desc',
                label: '备注',
                type: 'string',
            }
        ];
        //添加的弹出框菜单
        const CFormItem= [
            {
                name: 'Name',
                label: '名称',
                type: 'string',
                placeholder: '请输入型号名称',
                rules: [{ required: true, message: '名称不能为空' }],
            },
            {
                name: 'Number',
                label: '编号',
                type: 'string',
                placeholder: '请输入型号编号',
                rules: [{ required: true, message: '编号不能为空' }],
            }
        ];
        //查询的数据项
        const RFormItem=  [
            {
                name: 'keyWord',
                label: '搜索内容',
                type: 'string',
                placeholder: '请输入要搜索的内容'
            },
        ];

        const bcList = [{
          title:"首页",
          href: '/',
          }, {
          title: '基础数据',
          href: '/',
          }, {
          title: '不良类别',
          }];
        return (
            <PageHeaderLayout title="不良类别" wrapperClassName="pageContent" BreadcrumbList={bcList}>
                <div className="cardContent">
                    {/* <Feature /> */}
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
