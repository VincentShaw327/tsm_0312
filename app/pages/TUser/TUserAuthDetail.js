/**
 *这是权限组详情页
 *添加日期:2018.03.06
 *添加人:shaw
 **/
import React, { Component } from 'react';
import { Table, Button, Icon, Row, Col, message, Divider } from 'antd';
import { TPostData } from '../../utils/TAjax';
import PageHeaderLayout from '../../base/PageHeaderLayout';

export default class TUserAuthDetail extends Component {

    constructor( props ) {
        super( props )
        const {location,UUID}=this.props
        //组件外的指针.
        this.state = {
            AuthorityGroupUUID:UUID,
            authList:[],
            groupAuthList:[]
        }
        // this.url='/api/TUser/auth';
        this.url='/api/TUser/group';
    }

    componentWillMount(){
        this.getAuthList();
        this.getGroupAuthList();
    }

    componentDidMount() {}

    getAuthList(){
        var dat = {
            PageIndex: 0, //分页：页序号，不分页时设为0
            PageSize: -1 //分页：每页记录数，不分页时设为-1
        };
        //权限列表
        TPostData('/api/TUser/auth', "ListActive", dat,
            ( res )=> {
                console.log("获取到权限列表",res);
                var list = [];
                var Ui_list = res.obj.objectlist || [];
                Ui_list.forEach( function ( item, index ) {
                    list.push( {
                        key: index,
                        AuthUUID: item.UUID,
                        Name: item.Name,
                        ID: item.ID,
                        Desc: item.Desc,
                        Note: item.Note,
                        UpdateDateTime: item.UpdateDateTime
                    } )
                } )
                this.setState({authList:list});
            },
            ( error )=> {
                message.info( error );
            }
        )
    }

    getGroupAuthList(){
        var dat = {
            PageIndex: 0,
            PageSize: -1,
            UUID: this.state.AuthorityGroupUUID
        }
        TPostData('/api/TUser/group' , "GetAuthority", dat,
            ( res )=> {
                console.log("获取到权限组权限列表",res);
                var list = [];
                var Ui_list = res.obj.objectlist || [];
                Ui_list.forEach(( item, index )=> {
                    list.push( {
                        key: index,
                        AuthorityName: item.AuthorityName,
                        AuthorityUUID: item.AuthorityUUID,
                        AuthorityCode: item.AuthorityCode,
                        ID: item.ID,
                        Name: item.Name,
                        SystemUUID: item.SystemUUID,
                        Desc: item.Desc,
                        UUID: item.UUID
                    } )
                } )
                this.setState( { groupAuthList: list } )
            },
            ( error )=> {
                message.info( error );
            }
        )
    }

    addAuth(AuthUUID){
        var dat = {
            UUID: this.state.AuthorityGroupUUID,
            AuthorityUUID: AuthUUID
        }
        TPostData(this.url, "AddAuthority", dat,
            ( res )=> {
                if ( res.err === 0 ) {
                    message.success("添加权限成功！");
                    this.getGroupAuthList();
                }
            },
            (err)=>{
                message.error("添加权限失败！");
            }
        )
    }
    //解除绑定.
    removeAuth( res ){
        //res
        var dat = {
            UUID: this.state.AuthorityGroupUUID,
            AuthorityUUID: res
        }
        TPostData(this.url, "RemoveAuthority", dat,
            ( res )=> {
                if ( res.err === 0 ) {
                    this.getGroupAuthList();
                    message.info( "解绑成功" );
                }
            },
            ( error )=> {
                message.info( error );
            }
        )
    }

    //获取用户,获取用户组,
    render() {
        const {detailMessage}=this.props;
        const {groupAuthList,authList}=this.state;
        const columns = [
            {
                title: '名称',
                dataIndex: 'AuthorityName',
                type: 'string'
            }, {
                title: '编码',
                dataIndex: 'AuthorityCode',
                type: 'string'
            }, {
                title: '解除权限',
                dataIndex: 'AuthorityUUID',
                render: ( AuthorityUUID, record ) => {
                    const { editable } = record;
                    return ( <div className="editable-row-operations">
                        <a onClick={this.removeAuth.bind(this,AuthorityUUID)}>解除</a>
                    </div> )
                }
            }
        ];
        const authColumns= [
            {
                title: '名称',
                dataIndex: 'Name',
                type: 'string'
            },
            {
                title: '描述',
                dataIndex: 'Desc',
                type: 'string'
            },
            {
                title: '添加权限',
                dataIndex: 'AuthUUID',
                type: 'operate', // 操作的类型必须为 operate
                render:(AuthUUID)=>{
                    return <a onClick={this.addAuth.bind(this,AuthUUID)}>添加</a>
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
                <Divider>权限管理</Divider>
                <div>
                    <Row >
                        <Col span={11} >
                            <Button type="primary" >权限组拥有权限</Button>
                            <Table
                                size='middle'
                                dataSource={groupAuthList}
                                columns={columns}
                                bordered={true} />
                        </Col>
                        <Col span={1} style={{textAlign:'center'}}>
                            <Icon type="swap" style={{fontSize:25,textAlign:'center',color:'#46affb'}} />
                        </Col>
                        <Col span={12}>
                            <Button type="primary" >所有可选权限</Button>
                            <Table
                                size='middle'
                                dataSource={authList}
                                columns={authColumns}
                                bordered={true} />
                        </Col>
                        <Col span={1}></Col>
                    </Row>
                </div>
            </PageHeaderLayout>
        )
    }
}
