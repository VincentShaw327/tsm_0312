import React, { Component } from 'react'
import { hashHistory, Link } from 'react-router'
import { Button, Icon,message } from 'antd';
import FeatureSetConfig from '../../components/TCommon/shawCommon/tableConfig';
import { TPostData } from '../../utils/TAjax';
// import FeatureSetConfig from '../topBCommon/FeatureSetConfig';
// import { CpTime } from '../topBCommon/utils/compareTime';

//作用域
let seft
let creatKeyWord;
export default class TWorkCenter extends Component {

    constructor( props ) {
        super( props )
        this.state = {
            server: props.server,
            siderInfo: props.siderInfo,
            loading: false
        }
        this.url='/api/TFactory/workshop';
        seft = this;
    }
    componentWillMount() {
        //工作中心类型下拉框
        let workCenterType = [],
        //车间数据下拉
            workshopList = [];
        /**** 拉取下拉款类型数据 *****/
        TPostData('/api/TProcess/workcenter_type', 'ListActive',
            {
                'PageIndex': 0,
                'PageSize': -1,
                'TypeUUID': -1
            },
            function ( res ) {
                let Ui_list = res.obj.objectlist || [];
                Ui_list.forEach( function ( item, index ) {
                    workCenterType.push( { key: index, value:item.UUID.toString(), text: item.Name} )
                } )
            },
            function ( error ) {
                message.info( error );
            }, false
        )
        /**** 拉取下拉关联工作车间数据 *****/
        TPostData( '/api/TFactory/workshop', 'ListActive', {
                'PageIndex': 0,
                'PageSize': 100,
                'TypeUUID': -1
            }, function ( res ) {
                var Ui_list = res.obj.objectlist || [];
                Ui_list.forEach( function ( item, index ) {
                    workshopList.push( { key: index, value:item.UUID.toString(), text: item.Name} )
                } )
            }, function ( error ) {
                message.info( error );
        }, true )

        const config = {
            type: 'tableFeature',
            strKeyWord: '',
            WorkTypeList: [],
            url: '/api/TProcess/workcenter',
            // url: seft.state.server.url + 'Handler_Workstation_V1.ashx',
            /*****  页面列名  ******/
            columns: [
                {
                    title: '序号',
                    dataIndex: 'key',
                    type: 'string'
                },
                {
                    title: '名称',
                    dataIndex: 'Name',
                    type: 'string'
                    // 车间描述,备注,
				}, {
                    title: '编号',
                    dataIndex: 'ID',
                    type: 'string'
                    // 车间描述,备注,
				}, {
                    title: '类型',
                    dataIndex: 'TypeName',
                    type: 'string'
				}, {
                    title: '所属车间',
                    dataIndex: 'WorkshopName',
                    type: 'string'
				}, /*{
                    title: '描述',
                    dataIndex: 'Desc',
                    type: 'string'
				},*/{
                    title: '备注',
                    dataIndex: 'Note',
                    type: 'string'
                },{
                    title: '修改时间',
                    dataIndex: 'UpdateDateTime',
                    type: 'string',
                    /*type: 'sort',
                    sorter: ( a, b ) => {
                        return CpTime( a, b )
                    }*/
                }, {
                    title: '操作',
                    dataIndex: 'Status',
                    width: '10%',
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
                                var path = {
                                    pathname: '/TWorkCenterDetail',
                                    state: {
                                        UUID: item.UUID
                                    }
                                }
                                return ( <span>
									<Link to={path}><Icon type="profile" /></Link>
								</span> )
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
                    placeholder: '修改名称时必填',
                    rules: [
                        {
                            required: true,
                            min: 1,
                            message: '名称不能为空'
                        }
                    ]
                },
                {
                    name: 'ID',
                    label: '编号',
                    type: 'string',
                    placeholder: '修改编号时必填',
                    rules: [
                        {
                            required: true,
                            min: 1,
                            message: '编号不能为空'
                        }
                    ]
                },
                {
                    name: 'TypeUUID',
                    label: '中心类型',
                    type: 'select',
                    defaultValue: '1',
                    options: workCenterType
                },
                {
                    name: 'WorkshopUUID',
                    label: '车间',
                    type: 'select',
                    defaultValue: '1',
                    options: workshopList
                },
                {
                    name: 'Desc',
                    label: '描述',
                    type: 'string',
                    placeholder: '修改描述时必填'
                },
                {
                    name: 'Note',
                    label: '备注',
                    type: 'string',
                    placeholder: '其它',
                }
            ],

            CType: [
                {
                    name: 'Name',
                    label: '名称',
                    type: 'string',
                    placeholder: '请输入名称',
                    rules: [{required: true,min: 1,message: '名称不能为空'}]
				}, {
                    name: 'ID',
                    label: '编号',
                    type: 'string',
                    placeholder: '请输入编号',
                    rules: [{required: true,message: '编号不能为空'}]
				}, {
                    name: 'TypeUUID',
                    label: '中心类型',
                    type: 'select',
                    // defaultValue: '1',
                    rules: [{required: true,message: '请选择工作中心类型'}],
                    options: workCenterType
				}, {
                    name: 'WorkshopUUID',
                    label: '车间',
                    type: 'select',
                    defaultValue: '1',
                    rules: [{required: true,message: '请选择所属车间'}],
                    options: workshopList
				}
			],

            RType: [
                {
                    name: 'KeyWord',
                    label: '搜索内容',
                    type: 'string',
                    placeholder: '请输入搜索内容'
                }, {
                    name: 'TypeUUID',
                    label: '中心类型',
                    type: 'select',
                    defaultValue: '-1',
                    hasAllButtom: true,
                    width: 230,
                    options: workCenterType
                }, {
                    name: 'WorkshopUUID',
                    label: '车间',
                    type: 'select',
                    defaultValue: '-1',
                    hasAllButtom: true,
                    width: 150,
                    options: workshopList
                }
            ],
            // 初始化页面的数据 回调函数传入 items 列表
            pageData: function ( num, callback ) {
                var dat = {
                    'PageIndex': 0,
                    'PageSize': -1,
                    'TypeUUID': -1
                }

                TPostData( this.url, "ListActive", dat, function ( res ) {
                    var list = [];
                    var Ui_list = res.obj.objectlist || [];
                    console.log('查询到工作中心列表',Ui_list);
                    var totalcount = res.obj.objectlist.length;
                    creatKeyWord = res.obj.objectlist.length;
                    Ui_list.forEach( function ( item, index ) {
                        list.push( {
                            key: index,
                            ID: item.ID,
                            UUID: item.UUID,
                            Name: item.Name,
                            TypeUUID:item.TypeUUID.toString(),
                            WorkshopUUID: item.WorkshopUUID.toString(),
                            WorkshopName: item.WorkshopName,
                            TypeName: item.TypeName,
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
                    ID: data.ID,
                    Name: data.Name,
                    TypeUUID: data.TypeUUID,
                    WorkshopUUID: data.WorkshopUUID //所属这几ID
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
                    TypeUUID: data.TypeUUID,
                    WorkshopUUID: data.WorkshopUUID,
                    Name: data.Name,
                    ID: data.ID,
                    Desc: data.Desc,
                    Note: data.Note
                }
                TPostData( this.url, 'Update', dat, function ( res ) {
                    //这块请求更新数据 成功回调
                    /****       修改成功后，更改回显数据到页面      ****/
                    workCenterType.forEach( function ( item, index ) {
                        if ( item.value == data.TypeUUID ) {
                            data.TypeName = item.text
                        }
                    } )
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
                var dat = {
                    "nPageIndex": 0,
                    "nPageSize": -1,
                    'ID': data.ID,
                    'WorkshopUUID': data.WorkshopUUID, //所属车间UUID，不作为查询条件时取值设为-1
                    'TypeUUID': data.TypeUUID,
                    'KeyWord': data.KeyWord
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
        };
        this.feature = FeatureSetConfig( config );
    }

    render() {
        let Feature=this.feature;
        const {detail}=this.props;
        // console.log('TWorkCenter children2',detail);
        if(detail){
            return (
                <div>
                    {detail}
                </div>
            )
        }
        else{
            return (
                <div>
                    <Feature/>
                    {/* {detail} */}
                </div>
            )
        }
    }
}
