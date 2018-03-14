/**
 *这是订单管理页
 *添加日期:2017.12
 *添加人:shaw
 **/
/******引入ant或其他第三方依赖文件*******************/
import React, { Component } from 'react';
import { Table, Card, Menu, Icon, Modal, Dropdown, Popover,message } from 'antd'
/******引入自定义的依赖文件*******************/
import FeatureSetConfig from '../../components/TCommon/shawCommon/tableConfig';
// import PageTitle from '../TCommon/shawCommon/components/PageTitle';
import StateBotton from '../../components/TCommon/shawCommon/components/stateBottom';
import { TPostData } from '../../utils/TAjax';
// import { TPostData } from '../../server';
// import config from '../../config';
const confirm = Modal.confirm

let seft

export default class TManufactureOrder extends Component {
    constructor( props ) {
        super( props )
        this.state = {
            server:this.props.server

        }
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
          //
          isSelection: false,
          isExpand: true,
          showBorder:false,
          pageTitle:'订单管理',
          //table是否带勾选
          uProductUUID: 0,
          //请求url
          // url:'Handler_ProductCtrl_V1.ashx',
          // url: 'http://demo.sc.mes.top-link.me/service/Handler_ProductCtrl_V1.ashx',
          url: '/api/TManufacture/manufacture',
          //table表格表头配置参数
          columns: [
            {
              title: '订单号',
              dataIndex: 'ID',
              type: 'string'
            },
            /*{
              title: '订单名称',
              dataIndex: 'Name',
              type: 'string'
            },*/
            {
              title: '产品名称',
              dataIndex: 'ProductModelName',
              type: 'string',
              /*type: 'filter',
             filters: [
                {
                  text: 'HDMI接口',
                  value: 'HDMI接口'
                        },
                {
                  text: 'USB接口',
                  value: 'USB接口'
                },
              ],
              filteredValue: filteredInfo.productName || null,
              onFilter: ( value, record ) => record.productName.includes( value ),
             sorter: (a, b) => a.name.length - b.name.length,
              sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,*/
            },
            /*{
              title: '产品编号',
              dataIndex: 'ProductModelID',
              type: 'string'
            },*/
            {
              title: '计划产量',
              dataIndex: 'PlanNumber',
              type: 'sort'
            },
            {
              title: '实际产量',
              dataIndex: 'FinishNumber',
              type: 'sort'
            },
            {
              title: '次品数量',
              dataIndex: 'RejectNumber',
              type: 'sort'
            },
            {
              title: '下单日期',
              dataIndex: 'IssuedDateTime',
              type: 'string'
            },
            {
              title: '计划交期',
              dataIndex: 'PlanDeliverDateTime',
              type: 'string'
            },
            /*{
              title: '实际交期',
              dataIndex: 'DeliverDateTime',
              type: 'string'
            },
            {
              title: '计划开始时间',
              dataIndex: 'PlanStartDateTime',
              type: 'string'
            },
            {
              title: '实际开始时间',
              dataIndex: 'StartDateTime',
              type: 'string'
            },*/
            {
              title: '计划完成时间',
              dataIndex: 'PlanFinishDateTime',
              type: 'string'
            },
            /*{
              title: '实际完成时间',
              dataIndex: 'FinishDateTime',
              type: 'string'
            },*/
            {
              title: '订单状态',
              dataIndex: 'Status',
              type: 'string',
              width: 120,
              render: ( e1, record ) => {
                // console.log('record',record);
                return <StateBotton stateType='order' state = { record.Status }/>
              }
            },
            {
              title: '操作',
              dataIndex: 'uMachineUUID',
              type: 'operate', // 操作的类型必须为 operate
              multipleType: "orderList",
              width: 200,
            }
          ],

          subcolumns: [
            {
              title: '工单号',
              dataIndex: 'strID',
              type: 'string'
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
              title: '计划产量',
              dataIndex: 'strPlanNumber',
              type: 'string'
            },
            {
              title: '已完成',
              dataIndex: 'strFinishNumber',
              type: 'string'
            },
            /*{
              title: '计划开始',
              dataIndex: 'strPlanStartDateTime',
              type: 'string'
            },*/
            {
              title: '计划交货日期',
              dataIndex: 'strPlanDeliverDateTime',
              type: 'string'
            },
            {
              title: '订单状态',
              dataIndex: 'strStatus',
              type: 'string',
              render: ( e1, record ) => {
                // console.log('record',record);
                return <StateBotton stateType='task' state = { record.strStatus }/>
              }
            },
            {
              title: '操作',
              dataIndex: 'uMachineUUID',
              type: 'operate', // 操作的类型必须为 operate
              btns: [
                {
                  text: '更新',
                  type: 'update',
                  icon:'edit',
                }
              ], // 可选
            }
          ],

          CType: [
            /*{
                name: 'Name',
                label: '订单名称',
                type: 'string',
                placeholder: '请输入订单名称',
                rules: [{required: true,message: '请输入生产订单名称'}]
            },*/
            {
              name: 'ID',
              label: '订单号',
              type: 'string',
              placeholder: '请输入订单编号',
              rules: [
                {
                  required: true,
                  min: 2,
                  message: '用户名至少为 5 个字符',
                }
              ]
            },
            {
              name: 'ProductModelUUID',
              label: '产品型号',
              type: 'select',
              defaultValue:'1',
              rules: [{required: true,message: '请选择产品型号'}],
              postJson: {
                postUrl:'/api/tmanufacture/manufacture',
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
            },
            {
              name: 'Number',
              label: '计划产量',
              type: 'number',
              placeholder: '请输入计划产量',
              // help:"邮箱格式:12324@163.com",
              rules: [
                  {required: true,message: '请输入计划产量'},//
                  // {pattern:/^[0-9]+.?[0-9]*$/,message: '产量必须是数字'},//
                  // {pattern:/^0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/,message: '请输入正确的电话号码'},//
                  // {pattern: /^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/,message: '请输入正确的手机号'},//
                  // {pattern:/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,message: '请输入正确的邮箱地址'},
                  // {type: 'array',message: '***必须为数组'},
              ]
              // {type:'number',transform:(value)=>{return parseInt(value)},message: '必须是数字'}
            },
            {
              name: 'PlanDeliverDateTime',
              label: '计划交期',
              type: 'date',
              placeholder: '请输入计划交期',
              rules: [{required: true,message: '请选择计划交期'}]
            }
          ],
          //更新弹框数据项
          UType: [
            /*{
                name: 'Name',
                label: '订单名称',
                type: 'string',
                placeholder: '请输入生产订单名称',
                rules: [{required: true,min: 5,message: '用户名至少为 5 个字符'}]
            },*/
            {
              name: 'ID',
              label: '订单号',
              type: 'string',
              placeholder: '请输入订单编号',
              rules: [{ required: true,min: 2, message: '用户名至少为 5 个字符'}]
            },
            {
              name: 'PlanNumber',
              label: '计划产量',
              type: 'number',
              placeholder: '请输入计划产量',
              rules: [{ required: true,message: '用户名至少为 5 个字符'},{pattern:/^[0-9]+.?[0-9]*$/,message: '产量必须是数字'}]
            },
            {
              name: 'PlanDeliverDateTime',
              label: '计划交期',
              type: 'date',
              placeholder: '请输入计划交期',
              // rules: [{ required: true,message: '请选择日期'},{type:'date',message: '日期格式为...'}]
            }
            ],

          USubType: [
            {
              name: 'strID',
              label: '加工订单ID',
              type: 'string',
              placeholder: '请输入订单编号',
              rules: [
                {
                  required: true,
                  message: '请输入订单编号'
                }
              ]
            },
            {
              name: 'strDesc',
              label: '订单描述',
              type: 'string',
              placeholder: '请输入生产订单名称',
              rules: [
                {
                  required: true,
                  message: '请输入生产订单名称'
                        }
                    ]
                },
            {
              name: 'strNote',
              label: '订单备注',
              type: 'string',
              placeholder: '请输入计划产量'
                }
          ],
          // 可设置的查询字段
          RType: [
            {
              name: 'keyWord',
              label: '搜索内容',
              type: 'string',
              placeholder: '请输入搜索内容'
            },
            {
              name: 'status',
              label: '订单状态',
              type: 'select',
              defaultValue: '-1',
              hasAllButtom: true,
              // defaultItemValue: '0',
              width: 150,
              options: [
                {
                  key: 1,
                  value: '0',
                  text: '冻结中'
                },
                {
                  key: 2,
                  value: '1',
                  text: '活跃中'
                },
                {
                  key: 3,
                  value: '2',
                  text: '已拆分'
                },
                {
                  key: 4,
                  value: '3',
                  text: '已排程'
                },
                {
                  key: 5,
                  value: '4',
                  text: '生产中'
                },
                {
                  key: 6,
                  value: '5',
                  text: '已完成'
                }
              ]
            },
            {
              name: 'ProductModel',
              label: '产品型号',
              type: 'select',
              hasAllButtom: true,
              defaultValue: '-1',
              width: 150,
              postJson: {
                postUrl:'/api/tmanufacture/manufacture',
                method: 'ListActive',
                dat: {
                  PageIndex: 0,
                  PageSize: -1,
                  TypeUUID: -1,
                  KeyWord: ""
                }
              },
              options: [ {
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
          /*==回调函数=======================================*/
          // 初始化页面的数据 回调函数传入 items 列表
          pageData: function ( num, callback ) {
            var dat = {
              PageIndex: 0,
              PageSize: -1,
              ProductModelUUID: -1, //产品型号UUID
              Status: -1, //生产订单状态
              KeyWord: ""
            }
            TPostData( '/api/tmanufacture/manufacture', "ListProductOrder", dat, function ( res ) {
              console.log( '查询到订单列表', res );
              var list = [],
                Ui_list = res.obj.objectlist || [],
                totalCount = res.obj.totalcount;
              Ui_list.forEach( function ( item, index ) {
                list.push( {
                  key: index,
                  /*********/
                  UUID: item.UUID,
                  ID: item.ID,
                  Name: item.Name,
                  Desc: item.Desc,
                  Note: item.Note,
                  ProductUUID: item.ProductUUID,
                  ProductModelID: item.ProductModelID,
                  ProductModelName: item.ProductModelName, //产品名称
                  PlanNumber: item.PlanNumber, //计划产量
                  FinishNumber: item.FinishNumber, //实际产量
                  RejectNumber: item.RejectNumber, //不合格数量
                  IssuedDateTime: item.IssuedDateTime, //下单日期
                  IssuedDateTime: '2018-02-12', //下单日期
                  // PlanDeliverDateTime: item.PlanDeliverDateTime, //计划交期
                  PlanDeliverDateTime: '2017-03-24', //计划交期
                  // DeliverDateTime: item.DeliverDateTime, //实际交期
                  DeliverDateTime: '2017-03-28', //实际交期
                  PlanStartDateTime: '2017-03-28', //计划开始时间
                  StartDateTime: '2017-03-28', //实际开始时间
                  PlanFinishDateTime: '2017-03-28', //计划完成时间
                  FinishDateTime: '2017-03-28', //实际完成时间
                  UpdateDateTime: item.UpdateDateTime, //更新时间
                  Status: item.Status
                  //状态：0 - 冻结，1-活跃，拆分 2 - 已拆分，未排程 2 - 已排程，未投产  3 - 投产，生产中   4 - 完成生产  5 - 取消/变更
                } )
              } )
              callback( list, {
                nPageSize: 10,
                total: totalCount
              } )
            }, function ( error ) {
              message.info( error );
            } );
          },
          //table展开后的数据显示
          expandedRowData: function ( record, callback ) {
            // console.log('record',record);
            var dat = {
              PageIndex: 0,
              PageSize: -1,
              ProductOrderUUID: record.UUID, //生产订单UUID
              ProductModelUUID: -1, //产品UUID
              KeyWord: "" //模糊查询条件
            }
            TPostData( this.url, "ListLot", dat, function ( res ) {
              console.log( '查询到加工订单列表', res );
              var list = [],
                Ui_list = res.obj.objectlist || [],
                totalCount = res.obj.totalcount;
              Ui_list.forEach( function ( item, index ) {
                list.push( {
                  key: index,
                  UUID: item.UUID, //加工订单UUID
                  ProductOrderUUID: item.ProductOrderUUID, //生产订单UUID
                  strID: item.ID?item.ID:'-', //加工订单ID
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
                  strPlanDeliverDateTime: item.PlanDeliverDateTime?item.PlanDeliverDateTime:'-', //计划交付时间
                  strDeliverDateTime: item.DeliverDateTime, //实际交付时间
                  strUpdateDateTime: item.UpdateDateTime, //加工订单更新时间
                  strStatus: item.Status, //状态：0 - 取消，1 - 未投产，2 - 生产中， 3 - 完成，4 - 暂停
                  strBomID: item.BomID, //BOM ID
                  strBomName: item.BomName?item.BomName:'-', //BOM名称
                  strProductOrderID: item.ProductOrderID?item.ProductOrderID:'-', //生产订单ID
                  strProductOrderName: item.ProductOrderName?item.ProductOrderName:'-', //生产订单名称
                } )
              } )
              callback( list, {
                nPageSize: 10,
                total: totalCount
              } )
            }, function ( error ) {
              message.info( error );
          }, false );
          },
          // 模拟添加数据的接口回调
          Create: function ( data, callback ) {
            // console.log( 'data', data );
            let dat = {
              key: '1000',
              ID: data.ID, //订单编号
              // Name: data.Name, //订单名称
              Name: '--', //订单名称
              ProductModelUUID: data.ProductModelUUID, //产品型号UUID
              PlanNumber: data.Number, //计划产量
              PlanDeliverTime: data[ 'date-picker' ] //计划交期
            }
            TPostData( this.url, "AddProductOrder", dat, function ( res ) {
              //这块请求更新数据 成功回调
              callback( dat );
            } )
          },
          //客户信息修改
          Update: function ( data, callback ) {
            // console.log( 'tiaojiaodaohoutaidezhi', data );
            let dat = {
              UUID: data.UUID,
              ID: data.ID,
              // Name: data.Name,
              Name: '-',
              Desc: "-",
              Note: "-",
              PlanNumber: data.PlanNumber, //计划产量
              PlanDeliverDateTime: data[ 'date-picker' ] //计划交期
            }
            TPostData( this.url, "UpdateProductOrder", dat, function ( res ) {
              //这块请求更新数据 成功回调
              // alert('成功了!');
              callback( data )
            } )
          },

          SubUpdate: function ( data, callback ) {
            // console.log( 'Info', data );
            let dat = {
              UUID: data.UUID, //加工订单UUID
              ID: data.strID, //加工订单ID
              Desc: "-", //加工订单描述
              Note: "-", //加工订单备注
            }
            TPostData( this.url, "UpdateLot", dat, function ( res ) {
              //这块请求更新数据 成功回调
              // alert('成功了!');
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
          // 拆分操作
          Split: function ( item, callback ) {
            var dat = {
              UUID: item.UUID, //生产订单UUID
              Type: 0 //拆分类型：0 - 一级拆分；1 - 拆分到底
            }
            TPostData( this.url, "GenLot", dat, function ( res ) {
              //这块请求更新数据 成功回调
              callback( res )
            } )
          },

          cancelSplit: function ( item, callback ) {
            var dat = {
              UUID: item.UUID, //生产订单UUID
              // Type:0 //拆分类型：0 - 一级拆分；1 - 拆分到底
            }
            TPostData( this.url, "UndoGenLot", dat, function ( res ) {
              //这块请求更新数据 成功回调
              callback( res )
            } )
          },

          cancelOrder: function ( item, callback ) {
            var dat = {
              UUID: item.UUID, //生产订单UUID
              Force: 0 //0 - 参考订单状态；1 - 强制取消，不管当前状态
            }
            TPostData( this.url, "CancelProductOrder", dat, function ( res ) {
              //这块请求更新数据 成功回调
              callback( res )
            } )
          },

          pauseOrder: function ( item, callback ) {
            var dat = {
              UUID: item.UUID, //生产订单UUID
              Force: 0 //0 - 参考订单状态；1 - 强制取消，不管当前状态
            }
            TPostData( this.url, "PauseProductOrder", dat, function ( res ) {
              //这块请求更新数据 成功回调
              callback( res )
            } )
          },

          restartOrder: function ( item, callback ) {
            var dat = {
              UUID: item.UUID, //生产订单UUID
              Force: 0 //0 - 参考订单状态；1 - 强制取消，不管当前状态
            }
            TPostData( this.url, "RestartProductOrder", dat, function ( res ) {
              //这块请求更新数据 成功回调
              callback( res )
            } )
          },
          // 查询操作回调
          Retrieve: function ( data, callback ) {
            // console.log( data )
            var dat = {
              PageIndex: 0,
              PageSize: -1,
              ProductModelUUID: data.ProductModel, //产品型号UUID
              Status: data.status, //生产订单状态
              KeyWord: data.KeyWord
            }
            TPostData( this.url, "ListProductOrder", dat, function ( res ) {
              console.log('查询到订单列表', res);
              var list = [],
                Ui_list = res.obj.objectlist || [],
                totalCount = res.obj.totalcount;
              Ui_list.forEach( function ( item, index ) {
                list.push( {
                  key: index,
                  /*********/
                  UUID: item.UUID,
                  ID: item.ID,
                  Name: item.Name,
                  Desc: item.Desc,
                  Note: item.Note,
                  ProductUUID: item.ProductUUID,
                  ProductID: item.ProductID,
                  ProductModelName: item.ProductModelName, //产品名称
                  PlanNumber: item.PlanNumber, //计划产量
                  FinishNumber: item.FinishNumber, //实际产量
                  RejectNumber: item.RejectNumber, //不合格数量
                  IssuedDateTime: item.IssuedDateTime, //下单日期
                  PlanDeliverDateTime: item.PlanDeliverDateTime, //计划交期
                  DeliverDateTime: item.DeliverDateTime, //实际交期
                  PlanStartDateTime: item.PlanStartDateTime, //计划开始时间
                  StartDateTime: item.StartDateTime, //实际开始时间
                  PlanFinishDateTime: item.PlanFinishDateTime, //计划完成时间
                  FinishDateTime: item.FinishDateTime, //实际完成时间
                  UpdateDateTime: item.UpdateDateTime, //更新时间
                  Status: item.Status
                  //状态：0 - 冻结，1-活跃，拆分 2 - 已拆分，未排程 2 - 已排程，未投产  3 - 投产，生产中   4 - 完成生产  5 - 取消/变更
                } )
              } )
              callback( list, {
                nPageSize: 10,
                total: totalCount
              } )
            }, function ( error ) {
              message.info( error );
            } );
          },
          //勾选操作后回调处理
          handleSelect: function ( selectedKeys ) {
            let dat = {
              nPageIndex: 0,
              nPageSize: -1,
              strKeyWord: "",
              uProductUUID: -1,
              uProductCategoryUUID: selectedKeys[ 0 ],
              strProductModel: ""
            }
            TPostData( 'http://iec.topstarltd.com/admin/Handler_Product_V1.ashx', "product_list", dat, function ( res ) {
              var Ui_list = res.obj.objectlist || [],
                totalcount = res.obj.totalcount
              Ui_list.forEach( function ( item, index ) {
                window.productOptions.push( {
                  key: item.uProductUUID,
                  value: item.uProductUUID.toString(),
                  text: item.strProductName_cn
                } )
              } )
              seft.setState( {
                isUpdate: !seft.state.isUpdate
              } )
            }, function ( error ) {
              message.info( error );
            } )
          }
        };
        this.feature = FeatureSetConfig(tableConfig);
    }
    render() {
        let Feature=this.feature;
        return (
          <div>
                {/* <PageTitle title={ '订单管理' } /> */}
                <Feature/>
            </div>
        )
    }
}
