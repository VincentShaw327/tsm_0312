/**
 *这是生产排程页
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

export default class TOrderScheduling extends Component {

    constructor(props) {
        super(props);
        this.state = {
            /*pagination: {
                nPageIndex: '1',
                nPageSize: '8'
            },*/
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
            isSelection: true,
            isExpand: true,
            showBorder:false,
            pageTitle:'生产排程',
            uProductUUID: 0,
            url: '/api/TManufacture/manufacture',
            // url: this.props.server.url+'Handler_ProductCtrl_V1.ashx',
            // url: 'http://demo.sc.mes.top-link.me/service/Handler_ProductCtrl_V1.ashx',
            //table表格表头配置参数
            columns: [
                {
                  title: '工单号',
                  dataIndex: 'strID',
                  type: 'string'
                },
                {
                    title: '产品名称',
                    dataIndex: 'strProductModelName',
                    key: 'BNum',
                },
                {
                    title: '工作中心',
                    dataIndex: 'strWorkstationName',
                    key: 'WorkstationName',
                },
                {
                  title: 'BOM单',
                  dataIndex: 'strBomName',
                  type: 'string'
                },
                /*{
                  title: '订单号',
                  dataIndex: 'strProductOrderID',
                  type: 'string'
                },
                {
                  title: '订单名称',
                  dataIndex: 'strProductOrderName',
                  type: 'string'
                },*/
                {
                    title: '计划数量',
                    dataIndex: 'strPlanNumber',
                    type: 'string'
                },
                {
                    title: '已排数量',
                    dataIndex: 'strScheduleNumber',
                    type: 'string'
                },
                {
                    title: '已完成',
                    dataIndex: 'strFinishNumber',
                    type: 'string'
                },
                {
                    title: '次品数量',
                    dataIndex: 'strRejectNumber',
                    type: 'string'
                },
                {
                    title: '计划开始',
                    dataIndex: 'strPlanStartDateTime',
                    type: 'string'
                },
                {
                    title: '实际开始',
                    dataIndex: 'strStartDateTime',
                    type: 'string'
                },
                /*{
                    title: '计划交期',
                    dataIndex: 'strPlanDeliverDateTime',
                    type: 'string'
                },
                {
                    title: '实际交期',
                    dataIndex: 'strDeliverDateTime',
                    type: 'string'
                },
                {
                    title: '更新时间',
                    dataIndex: 'strUpdateDateTime',
                    type: 'string'
                },*/
                {
                    title: '任务状态',
                    dataIndex: 'strStatus',
                    type: 'string',
                    render: (e1, record) => {
                        // console.log('任务状态',record);
                        return <StateBotton stateType='task' state = { record.strStatus }/>
                    }
                },
                {
                    title: '操作',
                    dataIndex: 'uMachineUUID',
                    type: 'operate', // 操作的类型必须为 operate
                    multipleType: "Scheduling",
                }
            ],
            //嵌套table表格表头配置参数
            subcolumns: [
                {
                    title: '派工单号',
                    dataIndex: 'lotJobID',
                    key: 'lotJobID'
                },{
                    title: '产品名称',
                    dataIndex: 'ProductModelName',
                    key: 'BNum',
                },{
                    title: '产品编码',
                    dataIndex: 'ProductModelID',
                    key: 'ProductModelIDe',
                },{
                    title: '产品序列号',
                    dataIndex: 'ProductModelSN',
                    key: 'ProductModelSN'
                },  {
                    title: '工作中心',
                    dataIndex: 'WorkstationName',
                    key: 'WorkstationName',
                }, {
                    title: '工作中心编码',
                    dataIndex: 'WorkstationID',
                    key: 'WorkstationName',
                }, {
                    title: '工单状态',
                    dataIndex: 'Status',
                    key: 'Status',
                    render: (e1, record) => {
                        // console.log('工单状态',record);
                        return <StateBotton stateType='workOrder' state = { record.Status }/>
                    }
                }, {
                    title: '操作',
                    dataIndex: 'operation',
                    type: 'operate',
                    multipleType: "dispatch",
                    // btns: [
                    //     {
                    //         text: '派工',
                    //         type: 'deliver',
                    //         icon:'cloud-upload'
                    //     }
                    // ],
                }
            ],
            /****配置创建和修改的modal弹框数据项	*/
            //更新弹框数据项
            UType: [
                {
                    name: 'strID',
                    label: '订单号',
                    type: 'string',
                    placeholder: '请输入订单号',
                    rules: [{required: true,message: '请输入订单号'}]
                }, {
                    name: 'strDesc',
                    label: '订单描述',
                    type: 'string',
                    placeholder: '请输入订单描述',
                    rules: [{required: true,message: '请输入订单描述'}]
                }, {
                    name: 'strNote',
                    label: '订单备注',
                    type: 'string',
                    placeholder: '请输入计划产量'
                }
            ],
            //
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
                    placeholder: '请输入排程产量',
                    rules: [
                        {
                            required: true,
                            message: '请输入排程产量'
                        }
                    ]
                },
                {
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
                },
                /*{
                    name: 'MoldModelUUID',
                    label: '模具型号',
                    type: 'select',
                    postJson: {
                        postUrl: this.props.server.url+'Handler_MoldModel_V1.ashx',
                        method: 'ListActive',
                        dat: {
                            PageIndex: 0,
                            PageSize: -1,
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
                    rules: [
                        {
                            required: true,
                            message: '请选择模具型号'
                        }
                    ]
                },*/
                {
                    name: 'Date',
                    label: '日期',
                    type: 'RangePicker',
                    placeholder: '请输入计划产量',
                }
            ],
            //批量排程弹框数据项
            BSType: [
                {
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
                    rules: [
                        {
                            required: true,
                            message: '请选择工作中心'
                        }
                    ]
                },
                {
                    name: 'taskNuber',
                    label: '工单号',
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
                    rules: [{required: true,message: '请选择模具型号'}]
                },
                {
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
                },
                {
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
                    placeholder: '请输入搜索内容'
                },
                {
                  name: 'status',
                  label: '工单状态',
                  type: 'select',
                  defaultValue: '-1',
                  hasAllButtom: true,
                  // defaultItemValue: '0',
                  width: 150,
                  options: [
                    {
                      key: 1,
                      value: '1',
                      text: '未排产'
                    },
                    {
                      key: 2,
                      value: '2',
                      text: '已排产'
                    },
                    {
                      key: 3,
                      value: '3',
                      text: '已派工'
                    },
                  ]
                },
                {
                    name: 'ProductModel',
                    label: '产品型号',
                    type: 'select',
                    defaultValue: '-1',
                    hasAllButtom: true,
                    width: 150,
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
                    ]
                }
            ],
            // 初始化页面的数据 回调函数传入 items 列表
            pageData: function(num, callback) {

                var dat = {
                    PageIndex: 0,
                    PageSize: -1,
                    ProductOrderUUID: -1, //生产订单UUID
                    ProductModelUUID: -1, //产品UUID
                    KeyWord: "" //模糊查询条件
                }

                TPostData(this.url, "ListLot", dat, function(res) {
                    // console.log("查询到加工订单列表:", res);
                    var list = [],
                        Ui_list = res.obj.objectlist || [],
                        totalcount = res.obj.totalcount;

                    Ui_list.forEach(function(item, index) {
                        list.push({
                            key: index,
                            UUID: item.UUID, //加工订单UUID
                            ProductOrderUUID: item.ProductOrderUUID, //生产订单UUID
                            strID: item.ID, //加工订单ID
                            strDesc: item.Desc, //加工订单描述
                            strNote: item.Note, //加工订单备注
                            BomUUID: item.BomUUID, //BOM UUID
                            MoldModelUUID: item.MoldModelUUID, //模具型号UUID
                            ProductModelUUID: item.ProductModelUUID, //产品型号UUID
                            strProductModelName:'---',
                            strWorkstationName:'---',
                            strPlanNumber: item.PlanNumber, //计划产量
                            strScheduleNumber:'---',
                            strFinishNumber: item.FinishNumber, //完成产量
                            strRejectNumber: item.RejectNumber, //不良产量
                            // strPlanStartDateTime: item.PlanStartDateTime, //计划开始时间
                            strPlanStartDateTime: '2018-02-11', //计划开始时间
                            // strStartDateTime: item.StartDateTime, //实际开始时间
                            strStartDateTime: '2018-02-14', //实际开始时间
                            strPlanDeliverDateTime: item.PlanDeliverDateTime?item.PlanDeliverDateTime:'2018-04-23', //计划交付时间
                            strDeliverDateTime: item.DeliverDateTime?item.DeliverDateTime:'-', //实际交付时间
                            strUpdateDateTime: item.UpdateDateTime, //加工订单更新时间
                            strStatus: item.Status, //状态：0 - 取消，1 - 未投产，2 - 生产中， 3 - 完成，4 - 暂停
                            strBomID: item.BomID, //BOM ID
                            strBomName: item.BomName?item.BomName:'-', //BOM名称
                            strProductOrderID: item.ProductOrderID?item.ProductOrderID:'-', //生产订单ID
                            strProductOrderName: item.ProductOrderName?item.ProductOrderName:'-', //生产订单名称
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
            expandedRowData: function(record, callback) {
                // console.log('kk  record', record);
                var dat = {
                    PageIndex: 0, //分页页序
                    PageSize: -1, //每页数量
                    LotUUID: record.UUID, //生产订单UUID
                    Status: -1, //生产调度单状态
                    KeyWord: "" //模糊查询条件
                }

                TPostData(this.url, "ListLotJob", dat, function(res) {
                    console.log('查询到派工单:', res.obj.objectlist );
                    var list = [],
                        Ui_list = res.obj.objectlist || [],
                        totalcount = res.obj.totalcount;

                    Ui_list.forEach(function(item, index) {
                        list.push({
                            key: index,
                            bomUUID: item.bomUUID,
                            FinishDateTime: item.FinishDateTime,
                            FinishNumber: item.FinishNumber,
                            MoldModelUUID: item.MoldModelUUID,
                            PlanFinishDateTime: item.PlanFinishDateTime,
                            PlanNumber: item.PlanNumber,
                            PlanStartDateTime: item.PlanStartDateTime,
                            ProductModelID: item.ProductModelID,
                            ProductModelName: item.ProductModelName,
                            ProductModelSN: item.ProductModelSN,
                            ProductModelUUID: item.ProductModelUUID,
                            RejectNumber: item.RejectNumber,
                            StartDateTime: item.StartDateTime,
                            Status: item.Status,
                            UUID: item.UUID,
                            UpdateDateTime: item.UpdateDateTime,
                            WorkstationID: item.WorkstationID,
                            WorkstationName: item.WorkstationName,
                            WorkstationUUID: item.WorkstationUUID,
                            lotJobID:item.lotJobID?item.lotJobID:'-'
                        })
                    });
                    const pagination = {
                        ...seft.state.pagination
                    }
                    pagination.total = totalcount;
                    callback(list, {
                        total: pagination.total,
                        nPageSize: 10
                    })
                }, function(error) {
                    message.info(error);
                }, false)
            },
            //客户信息修改
            Update: function(data, callback) {
                console.log('Info', data);
                let dat = {
                    UUID: data.UUID, //加工订单UUID
                    ID: data.strID, //加工订单ID
                    Desc: data.strDesc, //加工订单描述
                    Note: data.strNote //加工订单备注
                }
                TPostData(this.url, "UpdateLot", dat, function(res) {
                    callback(data)
                })
            },
            //子订单派工
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

            Schedul: function(data, callback) {
                // console.log('看看Schedul提交后的内容', data);
                let dat = {
                    // LotUUID: data.UUID, //加工订单UUID
                    Number: data.Number, //排程产量
                    WorkstationUUID: data.WorkstationUUID, //工作中心UUID
                    // MoldModelUUID: data.MoldModelUUID, //模具型号
                    StartDateTime: data['range-picker'][0], //排程开始时间
                    FinishDateTime: data['range-picker'][1], //排程结束时间[]
                    LotList: data.taskNuber?data.taskNuber:[data.UUID]
                }
                // console.log( '看看dat', dat );
                TPostData(this.url, "GenLotJob", dat, function(res) {
                    callback(data)
                })
            },
            // 删除操作
            Delete: function(data, callback) {
                var dat = {
                    uMachineUUID: data.uMachineUUID
                }
                TPostData(this.url, "system_customer_del", dat, function(res) {
                    //这块请求更新数据 成功回调
                    callback(data)
                })
            },
            // 查询操作回调
            Retrieve: function(data, callback) {
                var dat = {
                    PageIndex: 0,
                    PageSize: -1,
                    ProductOrderUUID: -1, //生产订单UUID
                    ProductModelUUID: data.ProductModel, //产品UUID
                    Status:data.status,
                    KeyWord: data.keyWord //模糊查询条件
                }
                // console.log('查询条件',data);
                TPostData(this.url, "ListLot", dat, function(res) {
                    console.log("查询到加工订单列表:", res);
                    var list = [],
                        Ui_list = res.obj.objectlist || [],
                        totalcount = res.obj.totalcount;
                    Ui_list.forEach(function(item, index) {
                        list.push({
                            key: index,
                            UUID: item.UUID, //加工订单UUID
                            ProductOrderUUID: item.ProductOrderUUID, //生产订单UUID
                            strID: item.ID, //加工订单ID
                            strDesc: item.Desc, //加工订单描述
                            strNote: item.Note, //加工订单备注
                            BomUUID: item.BomUUID, //BOM UUID
                            MoldModelUUID: item.MoldModelUUID, //模具型号UUID
                            ProductModelUUID: item.ProductModelUUID, //产品型号UUID
                            strPlanNumber: item.PlanNumber, //计划产量
                            strFinishNumber: item.FinishNumber, //完成产量
                            strRejectNumber: item.RejectNumber, //不良产量
                            strPlanStartDateTime: item.PlanStartDateTime, //计划开始时间
                            strStartDateTime: item.StartDateTime, //实际开始时间
                            strPlanDeliverDateTime: item.PlanDeliverDateTime, //计划交付时间
                            strDeliverDateTime: item.DeliverDateTime, //实际交付时间
                            strUpdateDateTime: item.UpdateDateTime, //加工订单更新时间
                            strStatus: item.Status, //状态：0 - 取消，1 - 未投产，2 - 生产中， 3 - 完成，4 - 暂停
                            strBomID: item.BomID, //BOM ID
                            strBomName: item.BomName, //BOM名称
                            strProductOrderID: item.ProductOrderID, //生产订单ID
                            strProductOrderName: item.ProductOrderName, //生产订单名称
                        })
                    });
                    const pagination = { ...seft.state.pagination
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

        };
        this.feature = FeatureSetConfig(tableConfig);
    }
    render() {
        let Feature=this.feature;
        return (
          <div>
            {/* <PageTitle title={ '生产排程' }/> */}
            <Feature/>
             {/* <Gantt /> */}
          </div>
        );
    }
}
