import React, { Component } from 'react';
import { message, Menu, Icon, Row, Col, Card, Table, Divider, DatePicker, Button } from 'antd';
import { TPostData } from '../../utils/TAjax';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

export default class TProductionReport extends Component {
    // 初始化页面常量 绑定事件方法
    constructor( props, context ) {
        super( props )
        this.state = {
            workshopList: [],
            workcenterList: []
        }
        this.url = '/api/TFactory/workshop';
        // this.workshopList =[];
        // this.getUserInfo = this.getUserInfo.bind(this)
    }

    componentWillMount() {
        const dat = {
            PageIndex: 0, //分页：页序号，不分页时设为0
            PageSize: -1, //分页：每页记录数，不分页时设为-1
            FactoryUUID: -1, //所属工厂UUID，不作为查询条件时取值设为-1
            TypeUUID: -1, //类型UUID，不作为查询条件时取值设为-1
            KeyWord: ""
        }
        TPostData( this.url, "ListActive", dat,
            ( res )=> {
                var list = [];
                console.log( "查询到车间列表", res );
                var data_list = res.obj.objectlist || [];
                data_list.forEach(  ( item, index )=> {
                    list.push( {
                        key: index,
                        Name: item.Name,
                        Number: item.ID
                    } )
                    this.setState({workshopList:list})
                } )
            },
            ( error )=> {
                message.info( error );
            }
        )
        this.getProductionReport();
    }

    componentDidMount() {
        // this.setState()
    }

    getProductionReport(){
        var dat = {
            PageIndex: 0,
            PageSize: -1,
            LotUUID: -1, //生产订单UUID
            Status: -1, //生产调度单状态
            KeyWord: "" //模糊查询条件
        }
        // "ListJobTask"
        TPostData('/api/TManufacture/manufacture', "ListLotJob", dat,(res)=> {
            console.log("查询到工单列表:", res);
            var list = [],
                Ui_list = res.obj.objectlist || [],
                totalcount = res.obj.totalcount;
            Ui_list.forEach((item, index)=> {
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

                this.setState({workcenterList:list});
            });
            /*const pagination = {
                ...seft.state.pagination
            }
            // Read total count from server;
            // pagination.total = data.totalCount;
            pagination.total = totalcount;
            callback(list, {
                total: pagination.total,
                nPageSize: 10
            })*/
        }, (error)=> {
            message.info(error);
        })
    }

    render() {

        const columns = [
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
                    // return <StateBotton stateType='workOrder' state = { record.Status }/>
                }
            }, {
                title: '操作',
                dataIndex: 'uMachineUUID',
                type: 'operate', // 操作的类型必须为 operate
                multipleType: "dispatch",
          }
        ];
        // console.log("workshopList",this.state.workshopList);
        return (
            <div>
                <Row gutter={16}>
                  <Col className="gutter-row" span={4}>
                    <Menu
                          // onClick={this.handleClick}
                          style={{ width: 256 }}
                          defaultSelectedKeys={['1']}
                          // defaultOpenKeys={['sub1']}
                          mode="inline"
                          >
                          {
                              this.state.workshopList.map((item,index)=>{
                                  return(<Menu.Item key={index}>{item.Name}</Menu.Item>)
                              })
                          }
                    </Menu>
                  </Col>
                  <Col span={20}>
                      <Table
                          columns={columns}
                          dataSource={this.state.workcenterList}
                          bordered={true}
                          size="small"
                      />
                  </Col>
                </Row>
            </div>
        )
    }
}
