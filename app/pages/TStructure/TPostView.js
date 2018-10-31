/**
 *这是车间列表页
 *添加日期:2018.03.02
 *添加人:shaw
 **/
/******引入ant或其他第三方依赖文件*******************/
import React, { Component } from 'react'
import { Table, Menu, Icon, Badge, Dropdown,message,Divider,Popconfirm } from 'antd';
import { TPostData } from 'utils/TAjax';
import SimpleTable from 'components/TTable/SimpleTable';
import { CreateModal,UpdateModal } from 'components/TModal';
import {SimpleQForm,StandardQForm } from 'components/TForm';
import PageHeaderLayout from '../../base/PageHeaderLayout';

export default class DeviceList extends Component {

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
        this.url='/api/TFactory/workshop'
    }

    componentWillMount(){
        this.getWSTypeList();
        this.getTableList();
    }

    componentDidMount() {}

    getTableList(que){
        const {current,pageSize,TypeUUID,keyWord}=this.state;
        const dat = {
            PageIndex : current-1,       //分页：页序号，不分页时设为0
            PageSize:pageSize,   //分页：每页记录数，不分页时设为-1
            FactoryUUID: -1,    //所属工厂UUID，不作为查询条件时取值设为-1
            TypeUUID:TypeUUID,  //类型UUID，不作为查询条件时取值设为-1
            KeyWord :keyWord
        }

        TPostData( this.url, "ListActive", dat,
            ( res )=> {
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
              this.setState({tableDataList:list,total:totalcount,loading:false});
            },
            ( error )=> {
              message.info( error );
            }
        )

    }

    getWSTypeList(str){
        const dat = {
            PageIndex:0,
            pageSize:-1,
            KeyWord:''
        }
        TPostData('/api/TFactory/workshop_type', "ListActive", dat,
            ( res )=> {
                var list = [];
                console.log( "查询到车间类别列表", res );
                var data_list = res.obj.objectlist || [];
                var totalcount = res.obj.totalcount;
                data_list.forEach( ( item, index )=> {
                    list.push( {
                        key: index,
                        value: item.UUID.toString(),
                        text: item.Name,
                    } )
                } );
                this.setState({wsTypeList:list});
            },
            ( error )=> {
                message.info( error );
            }
        )
    }

    handleCreat=(data)=>{
        let dat = {
            FactoryUUID: data.FactoryUUID,
            TypeUUID: data.TypeUUID,
            Name: data.Name,
            ID: data.ID
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
        const {keyWord,TypeUUID}=data;
        this.setState({keyWord,TypeUUID},()=>{
            this.getTableList({keyWord,TypeUUID});
        });
    }

    handleUpdate=(data)=>{
        let dat = {
            UUID: this.state.updateFromItem.UUID,
            TypeUUID: data.TypeUUID,
            FactoryUUID:-1,
            Name: data.Name,
            ID: data.Number,
            Desc: data.Desc,
            Note: "---"
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
        const {
            wsTypeList,
            tableDataList,
            loading,
            current,
            total,
            pageSize,
            updateFromItem,
            UModalShow
        }=this.state;
        let Data={
            list:tableDataList,
            pagination:{total,current,pageSize}
        };

        const Tcolumns=[
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
        //更新弹框数据项
        const UFormItem= [
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
                options:wsTypeList
            },
            {
                name: 'Desc',
                label: '备注',
                type: 'string',
                placeholder: '',
            }
        ];
        //添加的弹出框菜单
        const CFormItem= [
            {
                name: 'TypeUUID',
                label: '车间类别',
                type: 'select',
                rules: [{ required: true, message: '请选择类别' }],
                options:wsTypeList
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
        ];
        //查询的数据项
        const RFormItem=[
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
                options:wsTypeList
            }
        ];

        const bcList = [{
          title:"首页",
          href: '/',
          }, {
          title: '组织架构',
          href: '/',
          }, {
          title: '车间列表',
          }];

        return (
            <PageHeaderLayout
                title="车间列表"
                wrapperClassName="pageContent"
                BreadcrumbList={bcList}>
                <div className="cardContent">
                    <SimpleQForm
                        FormItem={RFormItem}
                        submit={this.handleQuery}
                        // isBordered={false}
                    />
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
