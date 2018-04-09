import React, { Component } from 'react'
import { hashHistory, Link } from 'react-router'
import { Button, Icon,message,Breadcrumb,Popover } from 'antd';
import FeatureSetConfig from '../../components/TCommon/tableConfig';
import { TPostData,TPPostData,urlBase } from '../../utils/TAjax';
import TWorkCenterDetail from './TWorkCenterDetail';

//作用域
let seft
let creatKeyWord;
export default class TWorkCenter extends Component {

    constructor( props ) {
        super( props )
        this.state = {
            server: props.server,
            siderInfo: props.siderInfo,
            loading: false,
            showDetal:false,
            detailID:0,
            detailMessage:{},
            workshopList:[]
        }
        this.url='/api/TFactory/workshop';
        seft = this;
    }
    componentWillMount  () {
        //工作中心类型下拉框
        let workCenterType = [],
            workshopList=[];
        //车间数据下拉
        // this.state.workshopList = [];
        /**** 拉取下拉款类型数据 *****/
        TPostData('/api/TProcess/workcenter_type', 'ListActive',
            {
                'PageIndex': 0,
                'PageSize': -1,
                'TypeUUID': -1
            },
            function ( res ) {
                // console.log("workcenter_type",res);
                let Ui_list = res.obj.objectlist || [];
                Ui_list.forEach( function ( item, index ) {
                    workCenterType.push( { key: index, value:item.UUID.toString(), text: item.Name} )
                } )
            },
            function ( error ) {
                message.info( error );
                console.log("发生错误了");
            }
        )
        /**** 拉取下拉关联工作车间数据 *****/
        const data={
                'PageIndex': 0,
                'PageSize': 100,
                'TypeUUID': -1
            };

        /*TPostData( '/api/TFactory/workshop', 'ListActive', data,
            function ( res ){
                console.log("查询到车间列表：",res);
                var Ui_list = res.obj.objectlist || [];
                Ui_list.forEach( function ( item, index ) {
                    workshopList.push( { key: index, value:item.UUID.toString(), text: item.Name} )
                } )
            },
            function ( error ) {
                message.info( error );
            }
        )*/

        TPPostData( '/api/TFactory/workshop', 'ListActive', {
                'PageIndex': 0,
                'PageSize': 100,
                'TypeUUID': -1
            }).then((res)=>{
            console.log("workshopData====:",res);
            var Ui_list = res.obj.objectlist || [];
            let list=[];
            Ui_list.forEach((item,index)=>{
                workshopList.push(
                    {
                        key: index,
                        value:item.UUID.toString(),
                        text: item.Name
                    }
                );
            });
            // this.setState({workshopList:list});
            return workshopList;
        }).then((data)=>{
            console.log("workshopList resoved:",data);
        })

        // this.getWorkShopList();

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
                    title: '图片',
                    dataIndex: 'Image',
                    render: ( e, record ) => {
                        // console.log('图片地址',e);
                        const content = (
                            <div>
                              <img width="300"  src={urlBase+e} alt="这是工作中心图片"/>
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
                },/*{
                    title: '修改时间',
                    dataIndex: 'UpdateDateTime',
                    type: 'string',
                },*/ {
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
                    placeholder: '修改名称时必填',
                    rules: [{required: true,message: '名称不能为空'}]
                },
                {
                    name: 'ID',
                    label: '编号',
                    type: 'string',
                    placeholder: '修改编号时必填',
                    rules: [{required: true,min: 1,message: '编号不能为空'}]
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
                    options:workshopList
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
                },
                {
                    name: 'Image',
                    label: '图片',
                    type: 'antUpload',
                    url: '/api/tupload/do',
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
                    options:workshopList
                },
                {
                    name: 'Image',
                    label: '图片',
                    type: 'antUpload',
                    url: '/api/tupload/do',
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
                    options:workshopList
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
                            UUID: item.UUID,
                            TypeUUID:item.TypeUUID.toString(),
                            WorkshopUUID: item.WorkshopUUID.toString(),
                            Name: item.Name,
                            ID: item.ID,
                            TypeName: item.TypeName,
                            WorkshopName: item.WorkshopName,
                            Image:item.Image,
                            Note: item.Note,
                            Desc: item.Desc,
                            UpdateDateTime: item.UpdateDateTime,
                            Status: item.Status
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
                    Path:data.Image,
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
                    Path:data.Image,
                    ID: data.ID,
                    Desc: data.Desc,
                    Note: data.Note
                }
                TPostData( this.url, 'Update', dat, function ( res ) {
                    //这块请求更新数据 成功回调
                    /****       修改成功后，更改回显数据到页面      ****/
                    /*workCenterType.forEach( function ( item, index ) {
                        if ( item.value == data.TypeUUID ) {
                            data.TypeName = item.text
                        }
                    } )*/
                    callback( data );
                } )
            },

            /*UpdateImage: function ( data, callback ) {
                console.log("UpdateImage",data);
                let dat = {
                    UUID: data.UUID,
                    Path: data.Image
                }
                TPostData('/api/TProcess/workcenter', "UpdateImage", dat, function ( res ) {
                    console.log( '路径设置成功', res );
                    callback( data );
                }, function ( error ) {
                    message.info( error );
                } )
            },*/
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

    getWorkCenterType(){

    }

    async getWorkShopList(){
        let data={
                'PageIndex': 0,
                'PageSize': -1,
                'TypeUUID': -1
            };
        let wsList=await TPPostData( '/api/TFactory/workshop', 'ListActive',data)
        /*.then((res)=>{
            console.log("workshopList",res);
            let list=[];
            var Ui_list = res.obj.objectlist || [];
            Ui_list.forEach((item,index)=>{
                list.push(
                    {
                        key: index,
                        value:item.UUID.toString(),
                        text: item.Name
                    }
                );
            })
            this.setState({workshopList:list});
        })*/
        // .catch(err=>console.log('err',err));
        console.log('wsList',wsList);
        let list=[];
        var Ui_list = wsList.obj.objectlist || [];
        Ui_list.forEach((item,index)=>{
            list.push(
                {
                    key: index,
                    value:item.UUID.toString(),
                    text: item.Name
                }
            );
        });
        this.setState({workshopList:list});
    }

    toggleRender(record){
        this.setState({
            showDetal:!this.state.showDetal,
            detailID:record.UUID,
            detailMessage:record
        })
    }

    render() {
        const {showDetal,detailID,detailMessage}=this.state;
        let Feature=this.feature;
        const {detail}=this.props;
        const WorkCenterDetail=(
            <div>
                <div>
                    <Breadcrumb style={{display:"inline-block"}}>
                        <Breadcrumb.Item>
                            <a onClick={this.toggleRender.bind(this)} href="#">工作中心</a>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>工作中心详情</Breadcrumb.Item>
                    </Breadcrumb>
                    <span onClick={this.toggleRender.bind(this)} className="backup-button">
                        <Icon type="rollback" />
                    </span>
                </div>
                <TWorkCenterDetail detailMessage={detailMessage} workcenterUUID={detailID}/>
            </div>
        );
        return showDetal?WorkCenterDetail:<Feature/>;

    }
}
