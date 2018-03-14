/**
 *这是模具型号页
 *添加日期:2017.12
 *添加人:shaw
 **/
/******引入ant或其他第三方依赖文件*******************/
import React, { Component } from 'react'
import {Layout,Card,Row,Col,Progress,Divider,Tag,Spin,List,message} from 'antd';
// import EquipThunk from '../topBCommon/EquipThunk/EquipThunk';  暂时设备组件列表不做分离， 影响效率
/******引入自定义的依赖文件*******************/
import FeatureSetConfig from '../../components/TCommon/shawCommon/tableConfig';
// import PageTitle from '../TCommon/shawCommon/components/PageTitle';
import StateBotton from '../../components/TCommon/shawCommon/components/stateBottom';
import { TPostData } from '../../utils/TAjax';
// const confirm = Modal.confirm

let seft
// table配置对象

export default class App extends Component {

    constructor( props ) {
        super( props );
        this.state = {
            server:this.props.server

        }
        seft = this;
    }
    componentWillMount(){
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
            * **/
            //table类型
            type: 'OrderExpandTable',
            isSelection: false,
            isExpand: false,
            showBorder:false,
            pageTitle:'生产派工',
            uProductUUID: 0,
            url: '/api/TManufacture/manufacture',
            // url: this.props.server.url+'Handler_ProductCtrl_V1.ashx',
            // url: 'http://dev.top-link.me/dev/Handler_Plproject_V1.ashx',
            // url: 'http://demo.sc.mes.top-link.me/service/Handler_ProductCtrl_V1.ashx',
            //
            isSelection: false,
            //table表格表头配置参数
            columns: [
                {
                    title: '派工单号',
                    dataIndex: 'lotJobID',
                    key: 'lotJobID'
                },{
                    title: '产品名称',
                    dataIndex: 'ProductModelName',
                    key: 'BNum',
                },/*{
                    title: '产品编码',
                    dataIndex: 'ProductModelID',
                    key: 'ProductModelIDe',
                },{
                    title: '产品序列号',
                    dataIndex: 'ProductModelSN',
                    key: 'ProductModelSN'
                },*/  {
                    title: '工作中心',
                    dataIndex: 'WorkstationName',
                    key: 'WorkstationName',
                },/* {
                    title: '工作中心编码',
                    dataIndex: 'WorkstationID',
                    key: 'WorkstationName',
                },*/{
                  title: '计划产量',
                  dataIndex: 'PlanNumber',
                  type: 'sort'
                },{
                  title: '实际产量',
                  dataIndex: 'FinishNumber',
                  type: 'sort'
                },{
                  title: '次品数量',
                  dataIndex: 'RejectNumber',
                  type: 'sort'
                },/*{
                  title: '计划交期',
                  dataIndex: 'PlanDeliverDateTime',
                  type: 'string'
                },
                {
                  title: '实际交期',
                  dataIndex: 'DeliverDateTime',
                  type: 'string'
                },*/
                {
                  title: '计划开始',
                  dataIndex: 'PlanStartDateTime',
                  type: 'string'
                },{
                  title: '实际开始',
                  dataIndex: 'StartDateTime',
                  type: 'string'
                },{
                  title: '计划完成',
                  dataIndex: 'PlanFinishDateTime',
                  type: 'string'
                },{
                  title: '实际完成',
                  dataIndex: 'FinishDateTime',
                  type: 'string'
                },/* {
                    title: '更新时间',
                    dataIndex: 'UpdateDateTime',
                    key: 'UpdateDateTime',
                },*/ {
                    title: '工单状态',
                    dataIndex: 'Status',
                    key: 'Status',
                    render: (e1, record) => {
                        // console.log('工单状态',record);
                        return <StateBotton stateType='workOrder' state = { record.Status }/>
                    }
                }, {
                    title: '操作',
                    dataIndex: 'uMachineUUID',
                    type: 'operate', // 操作的类型必须为 operate
                    multipleType: "dispatch",
              }
            ],
            //嵌套table表格表头配置参数
            subcolumns: [
              {
                  title: '批次名称....',
                  dataIndex: 'BName',
                  key: 'BName',
              }, {
                  title: 'BOM类型',
                  dataIndex: 'materielType',
                  key: 'materielType',
              }, {
                  title: 'BOM编号',
                  dataIndex: 'BNum',
                  key: 'BNum',
              }, {
                  title: '色粉档案',
                  dataIndex: 'toner',
                  key: 'toner',
              }, {
                  title: '用料信息',
                  dataIndex: 'materiel',
                  key: 'materiel',
              }, {
                  title: '计划数量',
                  dataIndex: 'planQuantity',
                  key: 'planQuantity',
              }, {
                  title: '所需人员',
                  dataIndex: 'peopleNum',
                  key: 'peopleNum',
              }, {
                  title: '任务总数',
                  dataIndex: 'taskNum',
                  key: 'taskNum',
              }, {
                  title: '操作',
                  dataIndex: 'operation',
                  type: 'operate',
                  btns: [
                      {
                          text: '编辑',
                          type: 'update'
                  }, {
                          text: '拆分',
                          type: 'split'
                  }, {
                          text: '删除',
                          type: 'delete',
                          havePopconfirm: true,
                          popText: '您确定要删除此订单吗?'
                  }
                ], // 可选
                  /*render: () =>(
                    <span className = "table-operation" >
                      <a href = "#" > 编辑 </a>
                      <span className = "ant-divider" ></span>
                      <a href = "#" > 拆分 </a>
                      <span className = "ant-divider" ></span>
                      <a href = "#" >详情</a>
                    </span>
                    )*/
              }
            ],
            /****配置创建和修改的modal弹框数据项	*/
            //更新弹框数据项
            UType: [
              {
                name: 'PlanDeliverDateTime',
                label: '启动时间',
                type: 'date',
                placeholder: '请选择启动时间'
              }
            ],

            USubType: [
                {
                    name: 'Number',
                    label: '派工产量',
                    type: 'string',
                    placeholder: '请输入派工产量',
                    rules: [{required: true,message: '请输入派工产量'}]
                }, {
                    name: 'WorkstationUUID',
                    label: '工作中心',
                    type: 'select',
                    postJson: {
                        postUrl: '/api/TManufacture/manufacture',
                        method: 'ListActive',
                        dat: {
                            PageIndex: 0,
                            PageSize: -1,
                            TypeUUID: -1,
                            KeyWord: ""
                        }
                    },
                    options: [
                        {
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
                    ],
                    rules: [{required: true,message: '请选择工作中心'}]
                }, {
                    name: 'Date',
                    label: '日期',
                    type: 'RangePicker',
                    placeholder: '请输入计划产量'
                }
            ],
            //排程弹框数据项
            SType: [
              {
                  name: 'Number',
                  label: '排程产量',
                  type: 'string',
                  placeholder: '请输入订单编号',
                  rules: [{
                      required: true,
                      min: 2,
                      message: '用户名至少为 5 个字符'
                    }]
              }, {
                  name: 'WorkstationUUID',
                  label: '工作中心',
                  type: 'select',
                  postJson: {
                      postUrl: '/api/TProcess/workcenter',
                      method: 'ListActive',
                      dat: {
                          PageIndex: 0,
                          PageSize: -1,
                          TypeUUID: -1,
                          KeyWord: ""
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
                ],
                  rules: [{
                      required: true,
                      message: '请选择工作中心'
                    }]
              }, {
                  name: 'MoldModelUUID',
                  label: '模具型号',
                  type: 'select',
                  postJson: {
                      // postUrl: this.props.server.url+'Handler_MoldModel_V1.ashx',
                      postUrl: '/api/TMould/mould_model',
                      method: 'ListActive',
                      dat: {
                          PageIndex: 0,
                          PageSize: -1,
                          KeyWord: ""
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
                ],
                  rules: [{
                      required: true,
                      message: '请选择模具型号'
                    }]
              }, {
                  name: 'Date',
                  label: '日期',
                  type: 'RangePicker',
                  placeholder: '请输入计划产量'
              }
            ],
            //批量排程弹框数据项
            BSType: [
              {
                  name: 'WorkstationUUID',
                  label: '工作中心',
                  type: 'select',
                  postJson: {
                      postUrl: '/api/TProcess/workcenter',
                      method: 'ListActive',
                      dat: {
                          PageIndex: 0,
                          PageSize: -1,
                          TypeUUID: -1,
                          KeyWord: ""
                      }
                  },
                  options: [
                    {
                        text: "型号1",
                        value: '1'
                    }, {
                        text: "型号2",
                        value: '2'
                    }, {
                        text: "型号3",
                        value: '3'
                    }
                  ],
                  rules: [{
                      required: true,
                      message: '请选择工作中心'
                    }]
              }, {
                  name: 'taskNuber',
                  label: '任务编号',
                  type: 'multipleSelect',
                  postJson: {
                      postUrl: '/api/TManufacture/manufacture',
                      method: 'ListLot',
                      dat: {
                          PageIndex: 0,
                          PageSize: -1,
                          ProductOrderUUID: -1, //生产订单UUID
                          ProductModelUUID: -1, //产品UUID
                          KeyWord: ""
                      }
                  },
                  options: [
                    {
                        text: "型号1",
                        value: '1'
                    }, {
                        text: "型号2",
                        value: '2'
                    }, {
                        text: "型号3",
                        value: '3'
                    }
                  ],
                  rules: [
                      {
                          required: true,
                          message: '请选择模具型号'
                      }
                  ]
              }, {
                  name: 'Number',
                  label: '数量',
                  type: 'string',
                  placeholder: '请输入订单编号',
                  rules: [
                      {
                        required: true,
                        min: 2,
                        message: '用户名至少为 5 个字符'
                      }
                  ]
              }, {
                  name: 'Date',
                  label: '日期',
                  type: 'RangePicker',
                  placeholder: '请输入计划产量'
              }
            ],
            // 可设置的查询字段
            RType: [
              {
                  name: 'keyWord',
                  label: '关键字',
                  type: 'string',
                  placeholder: '请输入点什么...'
              },{
                name: 'status',
                label: '工单状态',
                type: 'select',
                defaultValue: '-1',
                hasAllButtom: true,
                width: 150,
                options: [
                  {
                    key: 1,
                    value: '0',
                    text: '未派工'
                  },
                  {
                    key: 2,
                    value: '1',
                    text: '已派工'
                  },
                  {
                    key: 3,
                    value: '2',
                    text: '已完成'
                  }
                ]
              }, {
                  name: 'ProductModel',
                  label: '产品型号',
                  type: 'select',
                  defaultValue: '-1',
                  hasAllButtom: true,
                  width: 150,
                  postJson: {
                      // postUrl: this.props.server.url+'Handler_ProductModel_V1.ashx',
                      postUrl: '/api/TProduct/product_model',
                      method: 'ListActive',
                      dat: {
                          PageIndex: 0,
                          PageSize: -1,
                          TypeUUID: -1,
                          KeyWord: ""
                      }
                  },
                  options: [
                      {
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
          // 初始化页面的数据 回调函数传入 items 列表
            pageData: function ( num, callback ) {
                var dat = {
                    PageIndex: 0,
                    PageSize: -1,
                    LotUUID: -1, //生产订单UUID
                    Status: -1, //生产调度单状态
                    KeyWord: "" //模糊查询条件
                }
                // "ListJobTask"
                TPostData(this.url, "ListLotJob", dat, function(res) {
                    console.log("查询到工单列表:", res);
                    var list = [],
                        Ui_list = res.obj.objectlist || [],
                        totalcount = res.obj.totalcount;
                    Ui_list.forEach(function(item, index) {
                        list.push({
                            key: index,
                            UUID: item.UUID, //加工订单UUID
                            BomUUID:item.BomUUID,
                            lotJobID:item.lotJobID?item.lotJobID:`#${index}`,
                            FinishDateTime:item.FinishDateTime?item.FinishDateTime:'2018-03-12',
                            FinishNumber:item.FinishNumber,
                            MoldModelUUID:item.MoldModelUUID,
                            PlanFinishDateTime:item.PlanFinishDateTime?item.PlanFinishDateTime:'2018-03-18',
                            PlanNumber:item.PlanNumber,
                            PlanStartDateTime:item.PlanStartDateTime?item.PlanStartDateTime:'2018-02-14',
                            ProductModelID:item.ProductModelID,
                            ProductModelName:item.ProductModelName,
                            ProductModelSN:item.ProductModelSN,
                            ProductModelUUID:item.ProductModelUUID,
                            RejectNumber:item.RejectNumber,
                            StartDateTime:item.StartDateTime?item.StartDateTime:'2018-02-14',
                            Status:item.Status,
                            UUID:item.UUID,
                            UpdateDateTime:item.UpdateDateTime,
                            WorkstationID:item.WorkstationID,
                            WorkstationName:item.WorkstationName,
                            WorkstationUUID:item.WorkstationUUID
                        })
                    });
                    const pagination = {
                        ...seft.state.pagination
                    }
                    // Read total count from server;
                    // pagination.total = data.totalCount;
                    pagination.total = totalcount;
                    callback(list, {
                        total: pagination.total,
                        nPageSize: 10
                    })
                }, function(error) {
                    message.info(error);
                })
            },
            //table展开后的数据显示
            expandedRowData: function ( record, callback ) {
                // console.log('kk  record',record);
                var dat = {
                  PageIndex: 0, //分页页序
                  PageSize: -1, //每页数量
                  LotUUID: record.UUID, //生产订单UUID
                  Status: -1, //生产调度单状态
                  StrKeyWord: "" //模糊查询条件
                }
                TPostData( this.url, "ListLotJob", dat, function ( res ) {
                  // console.log( "查询到派工订单列表:", res );
                  var list = [],
                    Ui_list = res.obj.objectlist || [],
                    totalcount = res.obj.totalcount;
                  Ui_list.forEach( function ( item, index ) {
                    list.push( {
                      key: index,
                    } )
                  } );
                  const pagination = {
                    ...seft.state.pagination
                  }
                  // Read total count from server;
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
                let dat = {
                    key: '1000',
                    uProductUUID: this.uProductUUID,
                    strMachineSN: data.strMachineSN,
                    dtMachineBornDatetime: data.dtMachineBornDatetime,
                    strMachineNote: data.strMachineNote
                }

                TPostData( this.url, "system_customer_add", dat, function ( res ) {
                  //这块请求更新数据 成功回调
                  callback( dat );
                } )
            },
            //客户信息修改
            Update: function ( data, callback ) {
                // console.log( 'Info', data );
                let dat = {
                  UUID : data.UUID,
                  StartTime : data['date-picker']
                }
                TPostData( this.url, "StartJobTask", dat, function ( res ) {
                  callback( data )
                } )
            },

            SubUpdate: function(data, callback) {
                console.log('Info', data);
                let dat = {
                    UUID: data.UUID, //生产调度单UUID
                    WorkstationUUID: data.WorkstationUUID, //工作中心UUID
                    PlanNumber: data.Number, //派工数量
                    PlanStartTime : data[ 'range-picker' ][ 0 ],         //计划开始时间
                    PlanFinishTime :data[ 'range-picker' ][ 1 ]      //计划结束时间
                }
                TPostData(this.url, "DeliverLotJob", dat, function(res) {
                    //这块请求更新数据 成功回调
                    // alert('成功了!');
                    callback(data)
                })
            },

            Schedul: function ( data, callback ) {
                // console.log( '看看Schedul提交后的内容', data );
                let dat = {
                    LotUUID: data.UUID, //加工订单UUID
                    Number: data.Number, //排程产量
                    WorkstationUUID: data.WorkstationUUID, //工作中心UUID
                    MoldModelUUID: data.MoldModelUUID, //模具型号
                    StartDateTime: data[ 'range-picker' ][ 0 ], //排程开始时间
                    FinishDateTime: data[ 'range-picker' ][ 1 ] //排程结束时间
                }
                TPostData( this.url, "GenLotJob", dat, function ( res ) {
                    callback( data )
                } )
            },
            // 删除操作
            Delete: function ( data, callback ) {
                var dat = {
                  uMachineUUID: data.uMachineUUID
                }
                TPostData( this.url, "system_customer_del", dat, function ( res ) {
                  //这块请求更新数据 成功回调
                  callback( data )
                } )
            },
            // 查询操作回调
            Retrieve: function ( data, callback ) {
                var dat = {
                    PageIndex: 0,
                    PageSize: -1,

                    LotUUID: -1, //生产订单UUID
                    Status: data.status, //生产调度单状态
                    KeyWord: data.keyWord //模糊查询条件
                }
                // "ListJobTask"
                TPostData(this.url, "ListLotJob", dat, function(res) {
                    console.log("查询到工单列表:", res);
                    var list = [],
                        Ui_list = res.obj.objectlist || [],
                        totalcount = res.obj.totalcount;
                    Ui_list.forEach(function(item, index) {
                        list.push({
                            key: index,
                            UUID: item.UUID, //加工订单UUID
                            BomUUID:item.BomUUID,
                            lotJobID:item.lotJobID?item.lotJobID:`#${index}`,
                            FinishDateTime:item.FinishDateTime?item.FinishDateTime:'2018-03-12',
                            FinishNumber:item.FinishNumber,
                            MoldModelUUID:item.MoldModelUUID,
                            PlanFinishDateTime:item.PlanFinishDateTime?item.PlanFinishDateTime:'2018-03-18',
                            PlanNumber:item.PlanNumber,
                            PlanStartDateTime:item.PlanStartDateTime?item.PlanStartDateTime:'2018-02-14',
                            ProductModelID:item.ProductModelID,
                            ProductModelName:item.ProductModelName,
                            ProductModelSN:item.ProductModelSN,
                            ProductModelUUID:item.ProductModelUUID,
                            RejectNumber:item.RejectNumber,
                            StartDateTime:item.StartDateTime?item.StartDateTime:'2018-02-14',
                            Status:item.Status,
                            UUID:item.UUID,
                            UpdateDateTime:item.UpdateDateTime,
                            WorkstationID:item.WorkstationID,
                            WorkstationName:item.WorkstationName,
                            WorkstationUUID:item.WorkstationUUID
                        })
                    });
                    const pagination = {
                        ...seft.state.pagination
                    }
                    // Read total count from server;
                    // pagination.total = data.totalCount;
                    pagination.total = totalcount;
                    callback(list, {
                        total: pagination.total,
                        nPageSize: 10
                    })
                }, function(error) {
                    message.info(error);
                })
            },

            producing:function (data) {
              var dat = {
                uMachineUUID: data.uMachineUUID
              }
              TPostData( this.url, "StartJobTask", dat, function ( res ) {
                //这块请求更新数据 成功回调
                callback( data )
              } )
            }
        };
        this.feature = FeatureSetConfig(tableConfig);
    }
    render() {
        let Feature=this.feature;
        return (
          <div>
              {/* <PageTitle title = { '生产派工' }/> */}
              <Feature/>
              {/* <Gantt /> */}
          </div>
        );
    }
}
