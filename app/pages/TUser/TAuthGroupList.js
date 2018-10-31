/**
 *这是权限组页
 *添加日期:2018.03.03
 *添加人:shaw
 **/
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { hashHistory, Link } from 'react-router';
import { Button, Icon, Popover,message,Breadcrumb,Divider,Table,Card,Row,Col,Select,Input,Popconfirm  } from 'antd';
import { fetchUserGroupList } from 'actions/user';
import { TPostData } from 'utils/TAjax';
import SimpleTable from 'components/TTable/SimpleTable';
import { CreateModal,UpdateModal } from 'components/TModal';
import {SimpleQForm,StandardQForm } from 'components/TForm';
import TUserAuthDetail from './TUserAuthDetail';
import PageHeaderLayout from '../../base/PageHeaderLayout';


@connect( ( state, props ) => {
    console.log( 'state', state )
    return {
        Breadcrumb:state.Breadcrumb,
        UserGroup: state.UserGroup,
    }
}, )
export default class TAuthGroupList extends Component {

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

            showDetal:false,
            detailID:0,
            detailMessage:{}
        }
        this.url= '/api/TUser/group';
    }

    componentWillMount() {
        this.getTableList();
        // this.props.dispatch( fetchUserGroupList( { current: 1 }, ( respose ) => {} ) )
    }

    getTableList(){
        const {current,pageSize,keyWord}=this.state;

        var dat = {
            PageIndex : current-1,       //分页：页序号，不分页时设为0
            PageSize:pageSize,
            KeyWord:keyWord
        }
        TPostData(this.url, "ListActive", dat,
            ( res )=> {
                console.log("查询权限组列表：",res);
                let list = [],
                    Ui_list = res.obj.objectlist || [],
                    totalcount = res.obj.totalcount;
                Ui_list.forEach(
                    ( item, index )=> {
                        list.push( {
                            key: index,
                            ID: item.ID,
                            UUID: item.UUID,
                            Name: item.Name,
                            Status: item.Status,
                            UpdateDateTime: item.UpdateDateTime,
                            Desc: item.Desc,
                            Note: item.Note
                        } );
                    }
                )
                this.setState({ tableDataList: list, total: totalcount, loading: false });
            },
            ( error )=> {
                message.info( error );
            }
        )

    }

    handleCreat(data){
        // console.log('data',data);
        let dat = {
            Name: data.Name,
            ID: data.ID
        }
        TPostData( this.url, "Add", dat,
            ( res )=> {
                message.success("创建成功！");
                this.getTableList();
            } ,
            ( res )=> {
                message.error("创建失败！");
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
            Name: data.Name,
            ID: data.ID,
            Note: data.Note,
            Desc:"-"
        }

        TPostData( this.url, "Update", dat,
            ( res )=> {
                message.success("编辑成功！");
                this.getTableList();
            },
            ( res )=> {
                message.error("编辑失败！");
            }
        )

    }

    handleQuery=(data)=>{
        const {keyWord}=data;
        this.setState({keyWord},()=>{
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
        // let Feature = this.feature;
        const {detail}=this.props;
        const {
            tableDataList,
            ProModelList,
            loading,
            current,
            total,
            pageSize,
            updateFromItem,
            UModalShow,
            showDetal,
            detailID,
            detailMessage
        } = this.state;
        const {Breadcrumb}=this.props;
        // const { list, total, loading } = this.props.UserGroup;
        let Data={
            list:tableDataList,
            // list:list,
            pagination:{total,current,pageSize}
        };


        const Tcolumns= [
            {
                title: '序号',
                dataIndex: 'key',
                type: 'string'
            },
            {
                title: '权限组名称',
                dataIndex: 'Name',
                type: 'string'
                // 车间描述,备注,
            }, {
                title: '权限组编号',
                dataIndex: 'ID',
                type: 'string'
            }, {
                title: '备注',
                dataIndex: 'Note',
                type: 'string'
            },
            {
                title: '修改时间',
                dataIndex: 'UpdateDateTime',
                type: 'sort',
                sorter: ( a, b ) => a.UpdateDateTime - b.UpdateDateTime
            }, {
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
                        <Divider type="vertical"/>
                        <a onClick={this.toggleRender.bind(this,record)}>详情</a>
                    </span>
                }
            }
        ];

        const UFormItem= [
            {
                name: 'Name',
                label: '名称',
                type: 'string',
                placeholder: '请输入名称',
                rules: [ { required: true, message: '名称不能为空' } ]
           },
            {
                name: 'ID',
                label: '编号',
                type: 'string',
                placeholder: '请输入编号',
                rules: [ { required: true, message: '编号不能为空' } ]
           },
           /*{
                name: 'Desc',
                label: '描述',
                type: 'string',
                placeholder: '描述',
                rules: [
                    {
                        min: 2,
                        message: '用户名至少为 2 个字符'
                    }
                ]
            },*/ {
                name: 'Note',
                label: '备注',
                type: 'string',
                placeholder: '其它'
            }
        ];

        const CFormItem= [
            {
                name: 'Name',
                label: '名称',
                type: 'string',
                placeholder: '请输入名称',
                rules: [ { required: true, message: '名称不能为空' } ]
           },
           {
                name: 'ID',
                label: '编号',
                type: 'string',
                placeholder: '请输入编号',
                rules: [ { required: true, message: '编号不能为空' } ]
            }
        ];

        const RFormItem= [
            {
                name: 'keyWord',
                label: '搜索内容',
                type: 'string',
                placeholder: '请输入搜索内容'
            }
        ];

        const AuthDetail=(
            <div className="cardContent">
                {/* <div>
                    <Breadcrumb style={{display:"inline-block"}}>
                        <Breadcrumb.Item>
                            <a onClick={this.toggleRender.bind(this)} href="#">BOM管理</a>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>权限组详情</Breadcrumb.Item>
                    </Breadcrumb>
                    <span onClick={this.toggleRender.bind(this)} className="backup-button">
                        <Icon type="rollback" />
                    </span>
                </div> */}
                <TUserAuthDetail detailMessage={detailMessage} UUID={detailID}/>
            </div>
        );
        const AuthListTable=(
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
        );

        const bcList = [{
          title:"首页",
          href: '/',
          }, {
          title: '系统设置',
          href: '/',
          }, {
          title: '权限组管理',
          },{
          title: showDetal?"权限组详情":"",
          }];

        const HeadAction=(
                // <span onClick={this.toggleRender.bind(this)} className="backup-button">
                //     <Icon type="rollback" />返回
                // </span>
                <Button onClick={this.toggleRender.bind(this)} type="primary" icon="rollback">返回</Button>
            );

        const HeadContent=(
            <div style={{
                    color:"#757879",
                    // border: 'solid 1px #80808029',
                    marginTop:12,
                    fontSize:20}}>
                <Row type="flex" justify="space-around" align="middle">
                    <Col span={8}>
                        <span>
                            名称:
                            <span style={{color:"#070808"}}>{detailMessage.Name}</span>
                        </span>
                    </Col>
                    <Col span={8}>
                        <span>
                            编号:
                            <span style={{color:"#070808"}}>{detailMessage.ID}</span>
                        </span>
                    </Col>
                    <Col span={8}>
                        <span>
                            描述:
                            <span style={{color:"#070808"}}>{detailMessage.Note}</span>
                        </span>
                    </Col>
                </Row>
            </div>
        );

        // return  showDetal?AuthDetail:AuthListTable;
        return(
            <PageHeaderLayout
                title={showDetal?"权限组详情":"权限组管理"}
                action={showDetal?HeadAction:''}
                content={showDetal?HeadContent:''}
                wrapperClassName="pageContent"
                BreadcrumbList={bcList}>
                    {/* <TWorkCenter/> */}
                    {showDetal?AuthDetail:AuthListTable}
            </PageHeaderLayout>
        );
    }
}
