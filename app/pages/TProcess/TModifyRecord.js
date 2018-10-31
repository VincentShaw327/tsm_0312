/**
 *这是设备列表页
 *添加日期:2017.12.06
 *添加人:shaw
 **/
/******引入ant或其他第三方依赖文件*******************/
import React, { Component } from 'react';
import Mock from 'mockjs';
// import FeatureSetConfig from '../../components/TCommon/tableConfig';
import { TPostData,urlBase } from '../../utils/TAjax';

let seft

export default class DeviceList extends Component {

    constructor( props ) {
        super( props )
        this.state = {
            showModal: this.props.showModal,
            dataList:[]
        }
        seft = this;
    }

    componentWillMount(){
        let bdate=[
                {
                    'mName':'方案一',
                    'task':'机油保养',
                    'way':'换机油',
                    'method':'倒掉旧机油,导入新机油',
                    'type':'机械维护',
                    'cycle':'3',
                    'unit':'周',
                    'effectiveTime':'4',
                    typeIndex:'1',
                    key:'wersdg'
                },
                {
                    'mName':'方案二',
                    'task':'机油保养',
                    'way':'换机油',
                    'method':'倒掉旧机油,导入新机油',
                    'type':'机械维护',
                    'cycle':'3',
                    'unit':'周',
                    'effectiveTime':'4',
                    typeIndex:'2',
                    key:'wesdfr'
                },
                {
                    'mName':'方案三',
                    'task':'机油保养',
                    'way':'换机油',
                    'method':'倒掉旧机油,导入新机油',
                    'type':'机械维护',
                    'cycle':'3',
                    'unit':'周',
                    'effectiveTime':'4',
                    typeIndex:'3',
                    key:'we56r'
                },
                {
                    'mName':'方案一',
                    'task':'机油保养',
                    'way':'换机油',
                    'method':'倒掉旧机油,导入新机油',
                    'type':'机械维护',
                    'cycle':'3',
                    'unit':'周',
                    'effectiveTime':'4',
                    typeIndex:'1',
                    key:'we678r'
                },
                {
                    'mName':'方案二',
                    'task':'机油保养',
                    'way':'换机油',
                    'method':'倒掉旧机油,导入新机油',
                    'type':'机械维护',
                    'cycle':'3',
                    'unit':'周',
                    'effectiveTime':'4',
                    typeIndex:'2',
                    key:'w78er'
                },
                {
                    'mName':'方案二',
                    'task':'机油保养',
                    'way':'换机油',
                    'method':'倒掉旧机油,导入新机油',
                    'type':'机械维护',
                    'cycle':'3',
                    'unit':'周',
                    'effectiveTime':'4',
                    typeIndex:'2',
                    key:'wedfgr'
                },
                {
                    'mName':'方案三',
                    'task':'机油保养',
                    'way':'换机油',
                    'method':'倒掉旧机油,导入新机油',
                    'type':'机械维护',
                    'cycle':'3',
                    'unit':'周',
                    'effectiveTime':'4',
                    typeIndex:'3',
                    key:'we57r'
                },
                {
                    'mName':'方案一',
                    'task':'机油保养',
                    'way':'换机油',
                    'method':'倒掉旧机油,导入新机油',
                    'type':'机械维护',
                    'cycle':'3',
                    'unit':'周',
                    'effectiveTime':'4',
                    typeIndex:'1',
                    key:'we89r'
                },
                {
                    'mName':'方案二',
                    'task':'机油保养',
                    'way':'换机油',
                    'method':'倒掉旧机油,导入新机油',
                    'type':'机械维护',
                    'cycle':'3',
                    'unit':'周',
                    'effectiveTime':'4',
                    typeIndex:'2',
                    key:'w54er'
                },
                {
                    'mName':'方案二',
                    'task':'机油保养',
                    'way':'换机油',
                    'method':'倒掉旧机油,导入新机油',
                    'type':'机械维护',
                    'cycle':'3',
                    'unit':'周',
                    'effectiveTime':'4',
                    typeIndex:'2',
                    key:'w123er'
                },
                {
                    'mName':'方案二',
                    'task':'机油保养',
                    'way':'换机油',
                    'method':'倒掉旧机油,导入新机油',
                    'type':'机械维护',
                    'cycle':'3',
                    'unit':'周',
                    'effectiveTime':'4',
                    typeIndex:'2',
                    key:'wedfr'
                },
                {
                    'mName':'方案一',
                    'task':'机油保养',
                    'way':'换机油',
                    'method':'倒掉旧机油,导入新机油',
                    'type':'机械维护',
                    'cycle':'3',
                    'unit':'周',
                    'effectiveTime':'4',
                    typeIndex:'1',
                    key:'wdfer'
                },
                {
                    'mName':'方案一',
                    'task':'机油保养',
                    'way':'换机油',
                    'method':'倒掉旧机油,导入新机油',
                    'type':'机械维护',
                    'cycle':'3',
                    'unit':'周',
                    'effectiveTime':'4',
                    typeIndex:'1',
                    key:'wgfer'
                },
                {
                    'mName':'方案一',
                    'task':'机油保养',
                    'way':'换机油',
                    'method':'倒掉旧机油,导入新机油',
                    'type':'机械维护',
                    'cycle':'3',
                    'unit':'周',
                    'effectiveTime':'4',
                    typeIndex:'1',
                    key:'weerr'
                },

        ]
        let dateItem=[];
        var Random = Mock.Random;
        let name=Random.name();
        // let email1=Mock.mock('@name')
        bdate.forEach((item,index)=>{
            item.mName=`工艺${index+1}`;
            item.key=`#${index}`;
            // item.person=Mock.mock('@name');
            item.person=Mock.mock('@cfirst')+Mock.mock('@clast');
            item.dateTime=Mock.mock('@datetime');
            // item.dateTime=Random.datetime();
            dateItem.push(item)
        })
        var data = Mock.mock({
            // 属性 list 的值是一个数组，其中含有 1 到 10 个元素
            'list|1': [
                /*{
                // 属性 id 是一个自增数，起始值为 1，每次增 1
                'maintainName|1': arr,
                'task|1':'@name',
                'ways|1':''
                }*/
                dateItem
            ]

        })
        // 输出结果
        // console.log('mock数据',JSON.stringify(data, null, 4))
        let Jlist=JSON.stringify(data, null, 4);
        this.setState({
            dataList:JSON.parse(Jlist).list
        })
        // let dataList=JSON.parse(Jlist)
        const tableConfig = {
            /**
            *基础配置参数
            *1.type:表格类型
            *2.isSelection:table是否带勾选
            *3.url:查询的url
            *4.columns:table的表头参数
            *5.CType:create创建modal的数据项
            *6.UType:update更新modal的数据项
            *7.RType:查询的数据项
            ***/
            /*==配置参数=======================================*/
            //table类型
            type: 'tableFeature',
            //
            uProductUUID: 0,
            //请求url
            url: '/api/TDevice/device',
            // url: syscfInfo.server.url+'Handler_Device_V1.ashx',
            // url: '  http://demo.sc.mes.top-link.me/service/Handler_Device_V1.ashx',
            //table表格是否是可勾选
            isSelection: false,
            //table表格表头配置参数
            columns: [
                {
                    title: '工艺名称',
                    dataIndex: 'mName',
                    type: 'string'
                }, {
                    title: '工艺编号',
                    dataIndex: 'task',
                    type: 'string'
                },  {
                    title: '修改人',
                    dataIndex: 'person',
                    type: 'string'
                },{
                    title: '修改时间',
                    dataIndex: 'dateTime',
                    type: 'string'
                },{
                    title: '操作',
                    dataIndex: 'operate',
                    type: 'operate', // 操作的类型必须为 operate
                    btns: [
                        {
                            text: '修改',
                            type: 'edit',
                            icon:'edit'
                        }, {
                            text: '删除',
                            type: 'delete',
                            icon:'delete',
                            havePopconfirm: true,
                            popText: '确定要删除此记录吗?'
                        },
                        /* {
                            text: '位置',
                            type: 'place'
                        }, */
                    ]
                }
            ],

            UType: [{
                    name: 'strDeviceName',
                    label: '名称',
                    type: 'string',
                    placeholder: '请输入名称',
                    // rules: [{ required: true, message: '请输入设备名称' }]
                  }, {
                    name: 'DeviceID',
                    label: '编码',
                    type: 'string',
                    placeholder: '请输入编码',
                    // rules: [{ required: true, message: '请输入编码' }]
                  }, {
                    name: 'strDeviceSN',
                    label: '序列号',
                    type: 'string',
                    placeholder: '请输入序列号',
                    // rules: [{ required: true, message: '请输入设备序列号' }]
                  },{
                    name: 'strLabel',
                    label: '标签',
                    type: 'string',
                    placeholder: '请输入标签',
                    // rules: [{ required: true, message: '请输入标签' }]
                  },{
                    name: 'ModelUUID',
                    label: '设备型号',
                    type: 'select',
                    // rules: [{ required: true, message: '请选择型号' }],
                    postJson: {
                        postUrl:'/api/TDevice/device_model',
                        method: 'ListActive',
                        dat: {
                            PageIndex: 0,
                            PageSize: -1,
                            TypeUUID: -1,
                            CategoryUUID: -1,
                            VendorUUID: -1
                        }
                    },
                    options: [{
                            text: "型号1",
                            value: '1'
                          }, {
                            text: "型号2",
                            value: '2'
                          }, {
                            text: "型号3",
                            value: '3'
                          }
                      ]
                  }
            ],
            //添加的弹出框菜单
            CType: [
                {
                    name: 'strDeviceName',
                    label: '名称',
                    type: 'string',
                    placeholder: '请输入名称',
                    rules: [{ required: true, message: '请输入名称' }]
                },{
                    name: 'strDeviceID',
                    label: '编码',
                    type: 'string',
                    placeholder: '请输入编码',
                    rules: [{ required: true, message: '请输入编码' }]
                }, {
                    name: 'strDeviceSN',
                    label: '序列号',
                    type: 'string',
                    placeholder: '请输入序列号',
                    rules: [{ required: true, message: '请输入序列号' }]
                }, {
                    name: 'strLabel',
                    label: '标签',
                    type: 'string',
                    placeholder: '请输入标签',
                    rules: [{ required: true, message: '请输入标签' }]
                }, {
                    name: 'ModelUUID',
                    label: '设备型号',
                    type: 'select',
                    postJson: {
                        postUrl: '/api/TDevice/device_model',
                        method: 'ListActive',
                        dat: {
                            PageIndex: 0,
                            PageSize: -1,
                            TypeUUID: -1,
                            CategoryUUID: -1,
                            VendorUUID: -1
                        }
                    },
                    defaultValue:'1',
                    rules: [{ required: true, message: '请选择设备型号' }],
                    options: [{
                            text: "型号1",
                            value: '1'
                          }, {
                            text: "型号2",
                            value: '2'
                          }, {
                            text: "型号3",
                            value: '3'
                          }
                    ]
                }
            ],
            //查询的数据项
            RType: [
                {
                    name: 'keyWord',
                    label: '搜索内容',
                    type: 'string',
                    placeholder: '请输入要搜索的内容'
                }, {
                    name: 'ModelUUID',
                    label: '设备型号',
                    type: 'select',
                    hasAllButtom: true,
                    defaultValue: '-1',
                    width: 150,
                    postJson: {
                        postUrl:'/api/TDevice/device_model',
                        method: 'ListActive',
                        dat: {
                            PageIndex: 0,
                            PageSize: -1,
                            TypeUUID: -1,
                            CategoryUUID: -1,
                            VendorUUID: -1
                        }
                    },
                    options: [{
                            text: "型号1",
                            value: '1'
                      },
                        {
                            text: "型号2",
                            value: '2'
                      },
                        {
                            text: "型号3",
                            value: '3'
                      }
                  ]
                }, /*{
                    name: 'WorkshopUUID',
                    label: '所属车间',
                    type: 'select',
                    hasAllButtom: true,
                    defaultValue: '-1',
                    width: 150,
                    postJson: {
                        postUrl: 'http://demo.sc.mes.top-link.me/service/Handler_Workshop_V1.ashx',
                        method: 'ListActive',
                        dat: {
                            PageIndex: 0, //分页：页序号，不分页时设为0
                            PageSize: -1, //分页：每页记录数，不分页时设为-1
                            FactoryUUID: -1, //所属工厂UUID，不作为查询条件时取值设为-1
                            TypeUUID: -1, //类型UUID，不作为查询条件时取值设为-1
                            KeyWord: ""
                        }
                    },
                    options: [
                        {
                            text: "型号1",
                            value: '1'
                        }
                    ]
                },*/
            ],

            /*==回调函数=======================================*/
            // 初始化页面的数据 回调函数传入 items 列表
            pageData:  ( num, callback )=> {

                const dat = {
                  nPageIndex: 0,
                  nPageSize: -1,
                  ModelUUID: -1,
                  // WorkshopUUID: -1,
                  TypeUUID: -1,
                  KeyWord: ""
                }
                /*DoPost( this.url, "ListActive", dat,  ( res )=> {
                  var list = [];
                  console.log("查询到设备列表", res);
                  var device_list = res.obj.objectlist || [];
                  var totalcount = res.obj.totalcount;
                  device_list.forEach( function ( item, index ) {
                    list.push( {
                      key: index,
                      UUID: item.UUID,
                      ModelUUID: item.ModelUUID,
                      DeviceID: item.ID,
                      WorkshopUUID: item.WorkshopUUID,
                      strDeviceName: item.Name,
                      strDeviceModel: item.ModelName,
                      strDeviceSN: item.SN,
                      strDeviceType: item.TypeName,
                      strLabel: item.Label,
                      strDesc:item.Desc
                    } )
                  } )
                  const pagination = {
                    ...seft.state.pagination
                  }
                  pagination.total = totalcount;
                  alert('23432')
                  callback( this.state.dataList, {
                    total: pagination.total,
                    nPageSize: 10
                  } )
                }, function ( error ) {
                  message.info( error );
                } )*/

                callback( this.state.dataList, {
                  total: this.state.dataList.length,
                  nPageSize: 10
                } )
            },
              //创建表单的回调处理函数
            Create: function ( data, callback ) {
                let dat = {
                  key: '1000',
                  ModelUUID: data.ModelUUID,
                  ID: data.strDeviceID,
                  Name: data.strDeviceName,
                  SN: data.strDeviceSN,
                  Label:data.strLabel
                }
                // console.log('创建后的数据是:', data);
                DoPost( this.url, "Add", dat, function ( res ) {
                  callback( dat );
                } )
            },
              //信息修改回调处理
            Update: function ( data, callback ) {
                // console.log("看看Device-UPDATE data", data);
                let dat = {
                  UUID: data.UUID,
                  ModelUUID: data.ModelUUID,
                  ID: data.DeviceID,
                  Name: data.strDeviceName,
                  SN: data.strDeviceSN,
                  Label:data.strLabel,
                  Desc: data.Desc,
                  Note: data.Note
                }
                console.log("看看Device-UPDATE data", dat);
                DoPost( this.url, "Update", dat, function ( res ) {
                  //这块请求更新数据 成功回调
                  callback( data )
                } )
            },
            //修改设备所属车间回调
            Place: function ( data, callback ) {
                // console.log("看看Device-Place data", data);
                let dat = {
                  UUID: data.UUID,
                  WorkshopUUID: data.WorkshopUUID,
                }
                DoPost( this.url, "Place", dat, function ( res ) {
                  //这块请求更新数据 成功回调
                  callback( data )
                } )
            },
            // 删除操作
            Delete: function ( data, callback ) {
                var dat = {
                  UUID: data.UUID,
                  // Status: 0
                }
                // console.log("看看data",data);
                DoPost( this.url, "Inactive", dat, function ( res ) {
                  //这块请求更新数据 成功回调
                  callback( data );
                } )
            },
            // 查询操作回调
            Retrieve: function ( data, callback ) {
                // console.log( '查询的内容:', data );
                const dat = {
                  nPageIndex: 0,
                  nPageSize: -1,
                  ModelUUID: data.ModelUUID,
                  TypeUUID: -1,
                  // WorkshopUUID: data.WorkshopUUID,
                  KeyWord: data.keyWord,
                }

                DoPost( this.url, "ListActive", dat, function ( res ) {
                  var list = [];
                  // console.log( "查询到设备列表", res );
                  var device_list = res.obj.objectlist || [];
                  var totalcount = res.obj.totalcount;
                  device_list.forEach( function ( item, index ) {
                    list.push( {
                      key: index,
                      UUID: item.UUID,
                      ModelUUID: item.ModelUUID,
                      DeviceID: item.ID,
                      strDeviceName: item.Name,
                      strDeviceModel: item.ModelName,
                      strDeviceSN: item.SN,
                      strDeviceType: item.TypeName,
                      // strOwnedWorkshop: item.WorkshopName,
                      strLabel: item.Label
                    } )
                  } )

                  const pagination = {
                    ...seft.state.pagination
                  }
                  pagination.total = totalcount;
                  callback( list, {
                    total: pagination.total,
                    nPageSize: 10
                  } )
                }, function ( error ) {
                  message.info( error );
                } )
            }

        };
        // this.feature = FeatureSetConfig(tableConfig);
        // const Feature = FeatureSetConfig( tableConfig );
    }
    componentDidMount(){
/*        var Random = Mock.Random;
        let Random1=Random.email();
            // => "n.clark@miller.io"
        let email1=Mock.mock('@email')
            // => "y.lee@lewis.org"
        let email2=Mock.mock( { email: '@email' } )
            // => { email: "v.lewis@hall.gov" }
        Random.extend({
            constellation: function(date) {
                var constellations = ['白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座', '天秤座', '天蝎座', '射手座', '摩羯座', '水瓶座', '双鱼座']
                return this.pick(constellations)
            }
        });
        let cons1=Random.constellation()
            // => "水瓶座"
        let cons2=Mock.mock('@CONSTELLATION')
            // => "天蝎座"
        let cons3=Mock.mock({
                constellation: '@CONSTELLATION'
            })
            // => { constellation: "射手座" }*/
        // console.log('datalist',JSON.parse(Jlist))

/*        console.log('Random',Random)
        console.log('Random1',Random1)
        console.log('email1',email1)
        console.log('email2',email2)
        // console.log('cons',cons)
        console.log('cons1',cons1)
        console.log('cons2',cons2)
        console.log('cons3',cons3)*/
    }


    render() {
        console.log('datalist',this.state.dataList)

        let Feature=this.feature;
        return (
            <div>
                {/* <PageTitle title={ '设备列表' } /> */}
                {/* <Feature /> */}
            </div>
        )
    }
}
