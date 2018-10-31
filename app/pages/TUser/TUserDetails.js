/**
 *这是用户详情页
 *添加日期:2018.03.06
 *添加人:shaw
 **/

import React, { Component } from 'react';
import { Table, Button, Icon, Row, Col, message, Divider ,Tag  } from 'antd';
import { TPostData,urlBase } from '../../utils/TAjax';
import avatarPic from '../../images/men01.jpg';
import PageHeaderLayout from '../../base/PageHeaderLayout';

export default class TUserDetails extends Component {
    constructor( props ) {
        super( props )
        //组件外的指针.
        const {location}=this.props
        this.state = {
            UserUUID:this.props.UUID,
            groupList:[],
            userGroupList:[]
        }
        //组件内的指针
        this.url='/api/TUser/account';
        this.groupUrl='/api/TUser/group';
        this.addGroup=this.addGroup.bind(this);
    }

    componentWillMount(){
        this.getGroupList();
        this.getUserGroupList();
    }

    componentDidMount() {
    }

    getGroupList(){
        var dat = {
            PageIndex: 0,
            PageSize: -1,
            KeyWord: ""
        }
        //用户组列表.
        TPostData( this.groupUrl, "ListActive", dat,
            (res)=>{
                var list = [];
                var Ui_list = res.obj.objectlist || [];
                console.log("查询到权限组列表:",res);
                var totalcount = res.obj.totalcount;
                Ui_list.forEach(( item, index )=> {
                    list.push( {
                        key: index,
                        groupUUID: item.UUID,
                        Name: item.Name,
                        ID: item.ID,
                        Note: item.Note,
                        Desc: item.Desc
                    } )
                } );
                this.setState( {groupList: list } )
            },
            (error)=> {
                message.info( error );
            }
        )
    }
    //用户权限组列表
    getUserGroupList (){
        var dat = {
            PageIndex: 0,
            PageSize: -1,
            UUID: this.state.UserUUID
        }
        //用户组列表.
        TPostData( this.url, "GetGroups", dat,
            ( res )=> {
                console.log("查询到用户权限组列表:",res);

                var list = [];
                var Ui_list = res.obj.objectlist || [];
                var totalcount = res.obj.totalcount;
                Ui_list.forEach(( item, index )=> {
                    list.push( {
                        key: index,
                        GroupUUID: item.UUID,
                        GroupName: item.GroupName,
                        GroupID: item.GroupID,
                        ID: item.ID,
                        LoginName: item.LoginName,
                        GroupUUID: item.GroupUUID
                    } )
                } );
                this.setState( { userGroupList: list } );
            },
            ( error )=> {
                message.info( error );
            }
        )
    }

    addGroup(GroupUUID){
        var dat = {
            UUID: this.state.UserUUID,
            GroupUUID: GroupUUID
        }
        TPostData(this.url, "AddGroup", dat,
            ( res )=> {
                if ( res.err === 0 ) {
                    message.success("绑定权限组成功！");
                    this.getUserGroupList();
                }
            },
            (err)=>{
                message.error("绑定权限组失败！");
            }
        )
    }
    //解除绑定.
    removeGroup ( GroupUUID ){
        let obj={
            UUID: this.state.UserUUID,
            GroupUUID: GroupUUID
        };

        TPostData( this.url, "RemoveGroup",obj ,
            ( res )=>{
                if ( res.err === 0 ) {
                    message.success( '解绑成功!');
                    this.getUserGroupList();
                }
            },
            ( error )=> {
                message.info( error );
            }
        )
    }

    render() {
        const {detailMessage}=this.props;
        const columns = [
            {
                title: '名称',
                dataIndex: 'GroupName',
                type: 'string'
            }, {
                title: '编号',
                dataIndex: 'GroupID',
                type: 'string'
            },
            {
                title: '解除权限',
                dataIndex: 'GroupUUID',
                render: ( GroupUUID, record ) => {
                    const { editable } = record;
                    return <a onClick={this.removeGroup.bind(this,GroupUUID)}>解除</a>
                }
            }
        ];

        const groupColumns= [
            {
                title: '名称',
                dataIndex: 'Name',
                type: 'string'
            },
            {
                title: '编号',
                dataIndex: 'ID',
                type: 'string'
            },
            {
                title: '添加权限',
                dataIndex: 'groupUUID',
                type: 'operate',
                render:(item1)=>{
                    // console.log("groupUUID",item1);
                    return <a src="#" onClick={this.addGroup.bind(this,item1)}>添加</a>
                }
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
                <div>
                    <h1>用户权限组管理</h1>
                    <Divider />
                    <Row>
                        <Col span={11}>
                            <div style={{border: 'solid 0px #80808099'}}>
                                <span style={{padding:6,fontSize:16}}>用户拥有的权限组</span>
                                <Table
                                    size='middle'
                                    dataSource={this.state.userGroupList}
                                    columns={columns}
                                    bordered={true}
                                />
                            </div>
                        </Col>
                        <Col span={1} style={{textAlign:'center'}}>
                            <Icon type="swap" style={{fontSize:25,textAlign:'center',color:'#46affb'}} />
                        </Col>
                        <Col span={12}>
                            <div style={{border: 'solid 0px #80808029'}}>
                                {/* <Button type="primary" >所有可选权限组</Button> */}
                                <span style={{padding:6,fontSize:16}}>所有可选权限组</span>
                                <Table
                                    size='middle'
                                    dataSource={this.state.groupList}
                                    columns={groupColumns}
                                    bordered={true}
                                />
                            </div>
                        </Col>
                    </Row>
                </div>
            </PageHeaderLayout>
        )
    }
}
