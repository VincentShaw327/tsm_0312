/**
 *
 *添加日期:2018.06.07
 *添加人:shaw
 **/
import React, { Component } from 'react'
import { Table, Menu, Icon, Badge, Dropdown,message,Divider,Popconfirm } from 'antd';
import { TPostData ,TPostMock,mockUrlBase} from 'utils/TAjax';
import SimpleTable from 'components/TTable/SimpleTable';
import { CreateModal,UpdateModal } from 'components/TModal';
import {SimpleQForm,StandardQForm } from 'components/TForm';
import PageHeaderLayout from '../../base/PageHeaderLayout';

export default class App extends Component {

    constructor( props ) {
        super( props )
        this.state = {
            tableDataList:[],
            updateFromItem:{},
            total:0,
            current:1,
            pageSize:10,
            keyWord:'',
            UModalShow:false,
            loading:true,
        }
        this.url='/api/TFactory/workshop_type';
    }

    componentWillMount() {
        this.getWSTypeList();
    }

    componentDidMount(){}

    getWSTypeList(str){
        const {current,pageSize}=this.state;
        const dat = {
            PageIndex:current-1,
            pageSize,
            KeyWord: str||''
        }
        // '/api/TFactory/workshop_type'
        TPostMock('/mt_planlist', "ListActive", dat,
            ( res )=> {
                var list = [];
                console.log( "测试MOCK数据", res );
                var data_list = res.obj.objectlist || [];
                var totalcount = res.obj.totalCount;
                data_list.forEach( ( item, index )=> {
                    list.push( {
                        key: index,
                        UUID: item.UUID,
                        Name: item.Name,
                        Number: item.ID,
                        Desc: item.Desc,
                        UpdateDateTime: item.UpdateDateTime,
                        Note: item.Note,

                        pro_Name:item.pro_Name,
                        dev_Type:item.dev_Type,
                        mt_Type:item.mt_Type,
                        DatumTime:item.DatumTime,
                        mt_cycle:item.mt_cycle,
                        cycle_unit:item.cycle_unit,
                        EffectiveTime:item.EffectiveTime
                    } )
                } );
                this.setState({tableDataList:list,total:totalcount,loading:false});
            },
            ( error )=> {
                message.info( error );
            }
        )
    }

    handleCreat=(data)=>{
        let dat = {
            Name: data.Name,
            ID: "---"
        }
        console.log('创建后的数据是:', data);
        TPostData( this.url, "Add", dat,
            ( res )=> {
                message.success("创建车间成功！");
                this.getWSTypeList();
            },
            ( err )=> {
                message.error("创建车间失败！");
                console.log('err',err);
            }
        )
    }

    handleQuery=(data)=>{
        // console.log("查询的只是:",data.keyWord);
        // this.setState({keyWord:data.keyWord});
        this.getWSTypeList(data.keyWord);
    }

    handleUpdate=(data)=>{
        let dat = {
            UUID: this.state.updateFromItem.UUID,
            Name: data.Name,
            Desc: data.Desc,
            ID: "--",
            Note: "--"
        }
        TPostData( this.url, "Update", dat,
            ( res )=> {
                message.success("更新成功！");
                this.getWSTypeList();
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
                this.getWSTypeList();
            },
            ( err )=> {
                message.error("删除失败！");
                console.log('err',err);
            }
        )
    }

    handleTableChange=(pagination)=>{
        const {current,pageSize}=pagination;
        this.setState({current,pageSize});
        this.getWSTypeList();
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
        const Tcolumns =[
            {
                title: '序号',
                dataIndex: 'key',
                type: 'string'
            },
            {
                title: '方案名称',
                dataIndex: 'pro_Name',
                type: 'string',
                // sorter: (a, b) => a.Name.length - b.Name.length
            },
            {
                title: '设备类别',
                dataIndex: 'dev_Type',
                type: 'string',
            },
            {
                title: '保养类别',
                dataIndex: 'mt_Type',
                type: 'string',
            },
            {
                title: '基准时间',
                dataIndex: 'DatumTime',
                type: 'string',
            },
            {
                title: '保养周期',
                dataIndex: 'mt_cycle',
                type: 'string',
            },
            {
                title: '周期单位',
                dataIndex: 'cycle_unit',
                type: 'string',
            },
            {
                title: '有效时间',
                dataIndex: 'EffectiveTime',
                type: 'string',
            },
            {
                title: '操作',
                dataIndex: 'UUID',
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

        const RFormItem=[
            {
                name: 'keyWord',
                label: '搜索内容',
                type: 'string',
                placeholder: '请输入搜索内容'
          }
        ];

        const CFormItem= [
            {
                name: 'Name',
                label: '名称',
                type: 'string',
                placeholder: '请输入车间类别名称',
                rules: [{required: true,message: '名称不能为空'}]
            }
        ];
        const UFormItem= [
            {
                name: 'Name',
                label: '类别名称',
                type: 'string',
                rules: [{ required: true, message: '名称不能为空' }],
                placeholder: '请输入车间类别名称'
            },
            {
                name: 'Desc',
                label: '描述',
                type: 'string',
                placeholder: '请输入描述',
            },
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
            <PageHeaderLayout title="保养计划" wrapperClassName="pageContent" BreadcrumbList={bcList}>
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
                        loading={loading}
                        size="middle"
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
