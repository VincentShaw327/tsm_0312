/**
 *这是权限组页
 *添加日期:2018.03.03
 *添加人:shaw
 **/
import React, { Component } from 'react'
import { hashHistory, Link } from 'react-router'
import { Button, Icon, message,Breadcrumb } from 'antd';
import FeatureSetConfig from '../../components/TCommon/shawCommon/tableConfig';
import { TPostData } from '../../utils/TAjax';
import TUserAuthDetail from './TUserAuthDetail';

let seft
let creatKeyWord;
export default class TAuthGroupList extends Component {

    constructor( props ) {
        super( props )
        this.state = {
            showDetal:false,
            detailID:0
        }
        seft = this;
    }

    componentWillMount() {

        const config = {

            type: 'tableFeature',
            strKeyWord: '',
            url: '/api/TUser/group',
            // url: 'http://demo.sc.mes.top-link.me/service/Handler_Group_V1.ashx',

            columns: [
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
                    dataIndex: 'Status',
                    type: 'operate', // 操作的类型必须为 operate
                    btns: [
                        {
                            text: '修改',
                            type: 'edit',
                            icon: 'edit'
                        }, {
                            text: '删除',
                            type: 'delete',
                            icon: 'delete',
                            havePopconfirm: true,
                            popText: '确定要删除此记录吗?'
                        }, {
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
                    placeholder: '请输入名称',
                    rules: [ { required: true, message: '名称不能为空' } ]
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
            ],

            CType: [
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
            ],

            RType: [
                {
                    name: 'keyWord',
                    label: '搜索内容',
                    type: 'string',
                    placeholder: '请输入搜索内容'
                }
            ],
            // 初始化页面的数据 回调函数传入 items 列表
            pageData: function ( num, callback ) {
                var dat = {
                    'PageIndex': 0,
                    'PageSize': -1
                }
                TPostData( this.url, "ListActive", dat, function ( res ) {
                    var list = [];
                    var Ui_list = res.obj.objectlist || [];

                    var totalcount = res.obj.objectlist.length;
                    creatKeyWord = res.obj.objectlist.length;

                    Ui_list.forEach( function ( item, index ) {
                        list.push( {
                            key: index,
                            ID: item.ID,
                            UUID: item.UUID,
                            Name: item.Name,
                            Status: item.Status,
                            UpdateDateTime: item.UpdateDateTime,
                            Desc: item.Desc,
                            Note: item.Note
                        } )
                    } )

                    const pagination = {
                        ...seft.state.pagination
                    }
                    // Read total count from server
                    // pagination.total = data.totalCount;
                    pagination.total = totalcount;
                    callback( list, {
                        total: pagination.total,
                        nPageSize: 10
                    } )
                }, function ( error ) {
                    message.info( error );
                } )
            },
            // 模拟添加数据的接口 回调
            Create: function ( data, callback ) {
                creatKeyWord++;
                let keyWord = creatKeyWord;

                let dat = {
                    key: keyWord,
                    Name: data.Name,
                    ID: data.ID
                }

                TPostData( this.url, "Add", dat, function ( res ) {
                    //这块请求更新数据 成功回调
                    callback( dat );
                } )
            },
            //信息修改
            Update: function ( data, callback ) {

                let dat = {
                    UUID: data.UUID,
                    Name: data.Name,
                    ID: data.ID,
                    Note: data.Note,
                    Desc:"-"
                }
                TPostData( this.url, 'Update', dat, function ( res ) {
                    //这块请求更新数据 成功回调
                    callback( data );
                } )
            },
            // 删除操作
            Delete: function ( data, callback ) {
                var dat = {
                    UUID: data.UUID
                }

                TPostData( this.url, "Inactive", dat, function ( res ) {
                    //这块请求更新数据 成功回调
                    callback( data )
                } )
            },
            // 查询操作回调
            Retrieve: function ( data, callback ) {
                this.strKeyWord = data.id;
                var dat = {
                    "nPageIndex": 0,
                    "nPageSize": -1,
                    'keyWord': data.keyWord
                }
                TPostData( this.url, "ListActive", dat, function ( res ) {

                    var list = [],
                        Ui_list = res.obj.objectlist || [],
                        totalcount = res.obj.totalcount
                    let i = 0;
                    Ui_list.forEach( function ( ele ) {
                        ele.key = i++;
                    } );

                    // 查询成功 传入列表数据
                    callback( Ui_list );

                }, function ( error ) {
                    message.info( error );
                } )
            }

        }
        this.feature = FeatureSetConfig( config );

    }

    toggleRender(record){
        // console.log("toggleRender",record);
        this.setState({showDetal:!this.state.showDetal,detailID:record.UUID})
    }

    render() {
        const {showDetal,detailID}=this.state;
        const {detail}=this.props;
        let Feature = this.feature;
        const AuthDetail=(
            <div>
                <div>
                    <Breadcrumb style={{display:"inline-block"}}>
                        <Breadcrumb.Item>
                            <a onClick={this.toggleRender.bind(this)} href="#">BOM管理</a>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>权限组详情</Breadcrumb.Item>
                    </Breadcrumb>
                    <span onClick={this.toggleRender.bind(this)} className="backup-button">
                        <Icon type="rollback" />
                    </span>
                </div>
                <TUserAuthDetail UUID={detailID}/>
            </div>
        );
        return  showDetal?AuthDetail:<Feature/>;
        // return  AuthDetail;
    }
}
