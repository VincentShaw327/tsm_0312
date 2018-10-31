/**
 *这是设备列表页
 *添加日期:2017.12.06
 *添加人:shaw
 **/
 import React, { Component } from 'react'
 import { hashHistory, Link } from 'react-router'
import { Table, Menu, Icon, Badge, Dropdown,Popover,message,Divider,Popconfirm } from 'antd';
 // import FeatureSetConfig from '../../components/TCommon/tableConfig';
 import { TPostData,urlBase } from '../../utils/TAjax';
 import SimpleTable from 'components/TTable/SimpleTable';
import { CreateModal,UpdateModal } from 'components/TModal';
import {SimpleQForm,StandardQForm } from 'components/TForm';

export default class ProductModel extends Component {

    constructor( props ) {
        super( props )
        this.state = {
            tableDataList:[],
            updateFromItem:{},
            total:0,
            current:1,
            pageSize:10,
            UModalShow:false,
            loading:true,
        }
        this.url= '/api/TProduct/product_model';
    }

    componentWillMount(){
        this.getTableList();
    }

    getTableList(que){
        const {current,pageSize,TypeUUID,keyWord}=this.state;
        const dat = {
            PageIndex : current-1,       //分页：页序号，不分页时设为0
            PageSize:pageSize,   //分页：每页记录数，不分页时设为-1
            TypeUUID:TypeUUID,  //类型UUID，不作为查询条件时取值设为-1
            KeyWord :keyWord,
            // KeyWord : que?que.keyWord:''
        }

        TPostData( this.url, "ListActive", dat,
            (res) => {
                var list = [];
                console.log("查询到工作中心类别列表", res);
                var data_list = res.obj.objectlist || [];
                var totalcount = res.obj.totalcount;
                data_list.forEach((item, index)=> {
                    list.push( {
                        key:index,
                        UUID : item.UUID,
                        TypeUUID: item.TypeUUID,
                        Image:item.Image,
                        Name:item.Name,
                        Number:item.ID,
                        SN:item.SN,
                        Version:item.Version,
                        Desc:item.Desc,
                        UpdateDateTime:item.UpdateDateTime,

                        Status :1,
                        Note : "-",
                      } )
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
            Name:data.Name,
            ID:data.Number,
            Path:data.Image,
            TypeUUID : '0',
            SN:data.SN
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
            Name:data.Name,
            ID:data.Number,
            Path:data.Image,
            SN:data.SN,
            Desc : data.Desc,
            Version:data.Version,
            TypeUUID : '0',
            Note : '-',
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
        // let Feature=this.feature;
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
                title: '图片',
                dataIndex: 'Image',
                render:(e,record)=>{
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
                title: '名称',
                dataIndex: 'Name',
                type: 'string'
            },
            {
                title: '编号',
                dataIndex: 'Number',
                type: 'string'
            },
            {
                title: '序列号',
                dataIndex: 'SN',
                type: 'string'
            },
            {
                title: '版本号',
                dataIndex: 'Version',
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
                placeholder: '请输入型号编号',
                rules: [{ required: true, message: '编号不能为空' }],
            },
            {
                name: 'SN',
                label: '序列号',
                type: 'string',
                placeholder: '请输入序列号',
                rules: [{ required: true, message: '序列号不能为空' }],
            },
            {
                name: 'Version',
                label: '版本号',
                type: 'string',
                placeholder: '请输入版本号',
                rules: [{ required: true, message: '版本号不能为空' }],
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
        ];
        //添加的弹出框菜单
        const CFormItem= [
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
                placeholder: '请输入型号编号',
                rules: [{ required: true, message: '编号不能为空' }],
            },
            {
                name: 'SN',
                label: '序列号',
                type: 'string',
                placeholder: '请输入序列号',
                rules: [{ required: true, message: '序列号不能为空' }],
            },
            {
                 name: 'Image',
                 label: '图片',
                 type: 'antUpload',
                 url: '/api/tupload/do',
            }
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

        return (
            <div className="cardContent">
                {/* <Feature /> */}
                <SimpleQForm
                    FormItem={RFormItem}
                    submit={this.handleQuery}
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
        )
    }
}
