import moment from 'moment';
import React, { Component } from 'react';
import { message, Menu, Icon, Row, Col, Card, Table, Divider,
    Form, DatePicker, Button, Select,Spin } from 'antd';
import { TPostData } from '../../utils/TAjax';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
const RangePicker = DatePicker.RangePicker;
const FormItem = Form.Item;
const Option = Select.Option;
import SimpleTable from 'components/TTable/SimpleTable';
import TableExport from 'tableexport';
import './index.less';
import PageHeaderLayout from 'base/PageHeaderLayout';

let sess_info=sessionStorage.getItem('userinfo');

export default class TProductionReport extends Component {
    // 初始化页面常量 绑定事件方法
    constructor( props, context ) {
        super( props )
        this.state = {
            productionReport:[],
            workshopList: [],
            dispatchingList: [],
            workCenterList: [],
            ProModelList: [],
            WSUUID:'1',
            WCUUID:'-1',
            hasAddBtn:false,
            RDate:moment().format('YYYY.MM.DD'),
            RSDate:moment((new Date().getTime()) - (1000 * 60 * 60 * 24*30)).format("YYYY.MM.DD"),
            REDate:moment(new Date().getTime()).format("YYYY.MM.DD"),
            loading:true,
            // authInfo:this.props.userInfo,
            authInfo:JSON.parse(sess_info),
        }
        this.url = '/api/TFactory/workshop';
        // this.workshopList =[];
        // this.getUserInfo = this.getUserInfo.bind(this)
    }

    componentWillMount() {
        this.getWorkshopList();
        this.getWorkCenterList();
        // this.getDispatchingList();
        // this.getProModelList();
        // this.getProReport();
        this.setDefaultWS();
    }

    componentDidMount() {
        // let csvDom=document.getElementById("productionTable")
        // .getElementsByClassName("ant-table-body")[0];
        // let btnWrap=document.getElementById("exportProductRep");
        // const btn=TableExport(csvDom.children[0]);
        // let children= btn.selectors[0].children[0];
        // let childNodes=children.getElementsByTagName('button');
        // childNodes[0].innerHTML="xlsx";
        // childNodes[1].innerHTML="csv";
        // childNodes[2].innerHTML="txt";
        // // console.log("btn",children);
        // // console.log("childNodes",childNodes);
        // btnWrap.appendChild(children);
    }

    getProReport(){
        const {WSUUID,WCUUID,RSDate,REDate}=this.state;

        const dat ={
            WorkshopUUID : WSUUID,
            WorkstationUUID : WCUUID,
            ProductUUID : -1,
            StartDay : RSDate,
            EndDay : REDate,
            Type : 0  // 0 - 按计划时间查询    1 - 按生产时间查询
        }
        console.log('ProductionOrder',dat)
        // TPostData('/api/TReport/production_report/orderReport', "GetProductionOrderReport", dat,
        TPostData('/api/TReport/production_report', "GetProductionOrderReport", dat,
            ( res ) => {
                console.log( "查询到生产报表", res );
                let data_list = res.obj.objectlist || [],
                    pro_report = [];

                if(res.err==0){
                    data_list.forEach( ( item, index ) => {
                        pro_report.push( {
                            key: index,
                            ProductOrderUUID :item.ProductOrderUUID ,
                            WorkstationUUID :item.WorkstationUUID ,
                            MoldUUID :item.MoldUUID ,
                            PlanNumber :item.PlanNumber ,
                            FinishNumber :item.FinishNumber ,
                            RejectNumber :item.RejectNumber ,
                            ProductOrderID :item.ProductOrderID ,
                            ProductModelUUID :item.ProductModelUUID ,
                            ProductModelName :item.ProductModelName ,
                            ProductModelID :item.ProductModelID ,
                            ProductModelStandard :item.ProductModelStandard ,
                            WorkshopUUID :item.WorkshopUUID ,
                            WorkshopID :item.WorkshopID ,
                            WorkshopName :item.WorkshopName ,
                            WorkstationTypeUUID :item.WorkstationTypeUUID ,
                            WorkstationID :item.WorkstationID ,
                            WorkstationName :item.WorkstationName ,
                            MoldID :item.MoldID ,
                            MoldName :item.MoldName ,
                            MoldLabel :item.MoldLabel ,
                            MoldCavity :item.MoldCavity ,
                            WorkOrderUUID :item.WorkOrderUUID ,
                            WorkOrderID :item.WorkOrderID ,
                            WorkOrderDesc :item.WorkOrderDesc ,
                            WorkOrderStatus :item.WorkOrderStatus ,
                            PlanStartDateTime :item.PlanStartDateTime ,
                            PlanFinishDateTime :item.PlanFinishDateTime ,
                            StartDateTime :item.StartDateTime ,
                            FinishDateTime :item.FinishDateTime ,
                            UpdateDateTime :item.UpdateDateTime ,
                            PRI : 0
                        } )
                    } )
                    this.setState( { productionReport: pro_report,loading:false } );
                    if(this.state.hasAddBtn==false){
                        let tableDom=document.getElementById("productionTable")
                        .getElementsByClassName("ant-table-body")[0];
                        let btnWrap=document.getElementById("exportProductRep");
                        const btn=TableExport(tableDom.children[0]);
                        let children= btn.selectors[0].children[0];
                        let childNodes=children.getElementsByTagName('button');
                        childNodes[0].innerHTML="xlsx";
                        childNodes[1].innerHTML="csv";
                        childNodes[2].innerHTML="txt";
                        const ishasChild=btnWrap.hasChildNodes();
                        if(ishasChild)btnWrap.innerHTML='';
                        btnWrap.appendChild(children);
                    }
                    this.setState({hasAddBtn:true});
                }
                else{
                    message.error("服务端数据错误！");
                    this.setState({loading:false});
                }

            },
            ( error ) => {
                message.info( error );
            }
        )

    }

    getProModelList() {
        const dat = {
            PageIndex: 0,
            PageSize: -1,
            TypeUUID: -1,
            KeyWord: ""
        }
        TPostData( '/api/TProduct/product_model', "ListActive", dat,
            ( res )=>{
                var list = [];
                console.log( "查询到产品型号列表", res );
                var data_list = res.obj.objectlist || [];
                // var totalcount = res.obj.totalcount;
                data_list.forEach(( item, index )=> {
                    list.push( {
                        key: index,
                        UUID: item.UUID,
                        Name: item.Name,
                        TypeUUID: item.TypeUUID,
                        Image: item.Image,
                        Number: item.ID,
                        SN: item.SN,
                        Version: item.Version,
                    } )
                } )
                this.setState({ProModelList:list});
            },
            ( error )=> {
                message.info( error );
            }
        )
    }

    getWorkshopList() {

        const dat = {
            PageIndex: 0, //分页：页序号，不分页时设为0
            PageSize: -1, //分页：每页记录数，不分页时设为-1
            FactoryUUID: -1, //所属工厂UUID，不作为查询条件时取值设为-1
            TypeUUID: -1, //类型UUID，不作为查询条件时取值设为-1
            KeyWord: ""
        }
        TPostData( '/api/TFactory/workshop', "ListActive", dat,
            ( res ) => {
                var list = [];
                console.log( "查询到车间列表", res );
                var data_list = res.obj.objectlist || [];
                data_list.forEach( ( item, index ) => {
                    list.push( {
                        key: index,
                        UUID: item.UUID.toString(),
                        Name: item.Name,
                        Number: item.ID
                    } )
                    this.setState( { workshopList: list } )
                } )
            },
            ( error ) => {
                message.info( error );
            }
        )

    }

    getWorkCenterList() {
        var dat = {
            'PageIndex': 0,
            'PageSize': -1,
            WorkshopUUID: this.state.WSUUID,
            'TypeUUID': -1
        }
        TPostData( '/api/TProcess/workcenter', "ListActive", dat,
            ( res ) => {
                var list = [];
                var Ui_list = res.obj.objectlist || [];
                console.log( '查询到工作中心列表', Ui_list );
                Ui_list.forEach( ( item, index ) => {
                    list.push( {
                        key: index,
                        ID: item.ID,
                        value: item.UUID.toString(),
                        Name: item.Name,
                    } )
                    // list.push( {key:index, Name: item.Name, UUID: item.UUID.toString() } );
                } );
                list.sort((a,b)=>(a.value-b.value));
                this.setState( { workCenterList: list } )
            },
            ( error ) => {
                message.info( error );
            }
        )
    }

    getDispatchingList() {
        var dat = {
            PageIndex: 0,
            PageSize: -1,
            LotUUID: -1, //生产订单UUID
            Status: -1, //生产调度单状态
            KeyWord: "" //模糊查询条件
        }
        // "ListJobTask"
        TPostData( '/api/TManufacture/manufacture', "ListLotJob", dat, ( res ) => {
            console.log( "查询到工单列表:", res );
            var list = [],
                Ui_list = res.obj.objectlist || [],
                totalcount = res.obj.totalcount;
            Ui_list.forEach( ( item, index ) => {
                list.push( {
                    key: index,
                    UUID: item.UUID, //加工订单UUID
                    BomUUID: item.BomUUID,
                    lotJobID: item.lotJobID ? item.lotJobID : `#${index}`,
                    FinishNumber: item.FinishNumber,
                    MoldModelUUID: item.MoldModelUUID,
                    PlanFinishDateTime: item.PlanFinishDateTime.slice(0,10),
                    FinishDateTime: item.FinishDateTime.slice(0,10),
                    PlanStartDateTime: item.PlanStartDateTime.slice(0,10) ,
                    StartDateTime: item.StartDateTime.slice(0,10),
                    PlanNumber: item.PlanNumber,
                    ProductModelID: item.ProductModelID,
                    ProductModelName: item.ProductModelName,
                    ProductModelSN: item.ProductModelSN,
                    ProductModelUUID: item.ProductModelUUID,
                    RejectNumber: item.RejectNumber,
                    Status: item.Status,
                    UUID: item.UUID,
                    UpdateDateTime: item.UpdateDateTime,
                    WorkstationID: item.WorkstationID,
                    WorkstationName: item.WorkstationName,
                    WorkstationUUID: item.WorkstationUUID
                } )

                this.setState( { dispatchingList: list } );
            } );
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
        }, ( error ) => {
            message.info( error );
        } )
    }

    GetRandomInt(max,min){
        return parseInt(Math.random() * (max - min) + min);
    }

    handleFormReset = () => {
        this.props.form.resetFields();
        // this.props.submit();
        // this.handleSearch();
    }

    handleSearch = (e) => {
        this.props.form.validateFields((errors, values) => {
            console.log("表单查询值",values);
            e.preventDefault();
            if (!!errors) {
                console.log('Errors in form!!!');
                message.error('查询失败');
                return;
            } else {
                // this.props.submit(values);
                const {WSUUID,WCUUID,RDate}=values;
                let RSDate,REDate;
                if(RDate&&RDate!=undefined){
                    RSDate=RDate[0].format('YYYY-MM-DD'); //排程开始时间
                    REDate=RDate[1].format('YYYY-MM-DD');
                    this.setState({RSDate,REDate});
                }
                this.setState({hasAddBtn:false,WSUUID,WCUUID},()=>{
                    console.log('WSUUID,WCUUID,RDate',this.state.RDate);
                    // this.getOEEReport();
                    this.getProReport();
                })
            }
        });
    }

    handleChange=(value)=>{
        this.setState({WSUUID:value},()=>{
            this.getWorkCenterList();
        })
    }


    generate(){
        let list=[],
            periodStart='',
            periodEnd='';
        for (let i=0;i<24;i++) {
            periodEnd=i+1;
            periodStart=i<10?'0'+i:i;
            periodEnd=periodEnd<10?'0'+periodEnd:periodEnd;
            list.push(
                {
                    key:i,
                    lotJobID:'Task001',
                    ProductModelName:"RCA音视频端子",
                    WorkstationName:"自动机001",
                    PlanNumber:213000,
                    FinishNumber:3457,
                    RejectNumber:153,
                    PlanStartDateTime:"2018/04/16",
                    StartDateTime:"2018/04/26",
                    PlanFinishDateTime:"2018/04/29",
                    FinishDateTime:"-",
                    status:this.GetRandomInt(1,11)
                }
            )
        }
        return list;
    }

    setDefaultWS=()=>{
        let ULevel=this.state.authInfo.UserLevel,
            DefaultUUID=-1;

        switch (ULevel) {
            case 'aw_manager3':
                    DefaultUUID='1';
                break;
            case 'aw_manager2':
                    DefaultUUID='2';
                break;
            case 'iw_manager':
                    DefaultUUID='3';
                break;
            case 'pw_manager':
                    DefaultUUID='4';
                break;
            default:
                DefaultUUID='1';
        }
        this.setState({WSUUID:DefaultUUID},()=>this.getProReport());
    }

    render() {
        const {productionReport,RDate,RSDate,REDate,WSUUID}=this.state;
        const columns = [
            {
                title: '工单号',
                dataIndex: 'WorkOrderID',
                key: 'lotJobID'
            }, {
                title: '产品名称',
                dataIndex: 'ProductModelName',
                key: 'BNum',
            },
            /*{
                title: '产品编码',
                dataIndex: 'ProductModelID',
                key: 'ProductModelIDe',
            },{
                title: '产品序列号',
                dataIndex: 'ProductModelSN',
                key: 'ProductModelSN'
            },*/
            {
                title: '工作中心',
                dataIndex: 'WorkstationName',
                key: 'WorkstationName',
                width:150,
            },
            /* {
                title: '工作中心编码',
                dataIndex: 'WorkstationID',
                key: 'WorkstationName',
            },*/
            {
                title: '计划产量',
                dataIndex: 'PlanNumber',
                width:120,
                type: 'sort'
            }, {
                title: '实际产量',
                dataIndex: 'FinishNumber',
                width:120,
                type: 'sort'
            }, /*{
                title: '次品数量',
                dataIndex: 'RejectNumber',
                type: 'sort'
            },*/
            /*{
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
            }, {
                title: '实际开始',
                dataIndex: 'StartDateTime',
                type: 'string'
            }, {
                title: '计划完成',
                dataIndex: 'PlanFinishDateTime',
                type: 'string'
            }, {
                title: '实际完成',
                dataIndex: 'FinishDateTime',
                // width:120,
                type: 'string'
            },
            /* {
                title: '更新时间',
                dataIndex: 'UpdateDateTime',
                key: 'UpdateDateTime',
            },*/
            {
                title: '工单状态',
                dataIndex: 'WorkOrderStatus',
                key: 'status',
                width:100,
                render: (e1, record) => {
                    // console.log('任务状态',record);
                    let status='';
                    status=e1==0?(<span className="orderCancelled">已取消</span>):
                        e1==1?(<span className="Unproduced">未生产</span>):
                        e1==2?(<span className="Inproduction">生产中</span>):
                        e1==3?(<span className="Pausing">已暂停</span>):
                        e1==5?(<span className="Submited">已报工</span>):
                        // e1==5?(<span>生产完成(5)</span>):
                        // e1==6?(<span>生产中(6)</span>):
                        // e1==9?(<span>生产挂起(9)</span>):
                        // e1==10?(<span>已完成(10)</span>):
                        // e1==11?(<span>暂停中(11)</span>):
                        <span>{e1}</span>
                    return  status;
                }
            },
            /*{
                title: '操作',
                dataIndex: 'uMachineUUID',
                type: 'operate', // 操作的类型必须为 operate
                multipleType: "dispatch",
            }*/
        ];
        const productData=this.generate();

        const {form:{getFieldDecorator}}=this.props;
        const formItemLayout1 = {
          labelCol: {
            xs: { span: 24 },
            sm: { span: 5 },
          },
          wrapperCol: {
            xs: { span: 24 },
            sm: { span: 19},
          },
        };
        const formItemLayout2 = {
          labelCol: {
            xs: { span: 24 },
            sm: { span: 7 },
          },
          wrapperCol: {
            xs: { span: 24 },
            sm: { span: 16},
          },
        };

        const bcList = [{
            title:"首页",
            href: '/',
            }, {
            title: '报表中心',
            // href: '/',
            }, {
            title: '生产报表',
        }];

        return (
            <PageHeaderLayout title="生产报表" wrapperClassName="pageContent" BreadcrumbList={bcList}>
                <div className="cardContent">
                    <Spin spinning={this.state.loading}>
                      {/* <Card style={{marginBottom:20}}>
                          <Row gutter={16}>
                              <Col className="gutter-row" span={5}>
                                  <div className="gutter-box"><span style={{ width: "40%" }}>车间:</span>
                                      <Select defaultValue="-1" style={{ width: "60%" }} onChange={this.handleChange}>
                                          <Option value="-1" key="all">全部</Option>
                                          {
                                              this.state.workshopList.map((item,index)=>{
                                                      return (<Option value={item.UUID} key={index}>{item.Name}</Option>)
                                              })
                                          }
                                      </Select>
                                  </div>
                              </Col>
                              <Col className="gutter-row" span={5}>
                                  <div className="gutter-box"><span style={{ width: "40%" }}>产品:</span>
                                      <Select defaultValue="-1" style={{ width: "60%" }} onChange={this.handleChange}>
                                          <Option value="-1" key="all">全部</Option>
                                          {
                                              this.state.ProModelList.map((item,index)=>{
                                                      return (<Option value={item.UUID} key={index}>{item.Name}</Option>)
                                              })
                                          }
                                      </Select>
                                  </div>
                              </Col>
                              <Col className="gutter-row" span={5}>
                                  <div className="gutter-box"><span style={{ width: "40%" }}>工作中心:</span>
                                      <Select defaultValue="-1" style={{ width: "60%" }} onChange={this.handleChange}>
                                          <Option value="-1" key="all">全部</Option>
                                          {
                                              this.state.workCenterList.map((item,index)=>{
                                                      return (<Option value={item.UUID} key={index}>{item.Name}</Option>)
                                              })
                                          }
                                      </Select>
                                  </div>
                              </Col>
                              <Col className="gutter-row" span={5}>
                                  <div className="gutter-box"><span style={{ width: "40%" }}>日期:</span>
                                      <DatePicker style={{ width: "60%" }} />
                                  </div>
                              </Col>
                              <Col className="gutter-row" span={4}>
                                  <div className="gutter-box">
                                      <Button type="primary" icon="search">查询</Button>
                                  </div>
                              </Col>
                          </Row>
                      </Card> */}
                      <Card>
                          <Form onSubmit={this.handleSearch} layout="inline">
                              <Row gutter={16}>
                                  <Col className="gutter-row" span={6}>
                                      <div className="gutter-box">
                                          <FormItem {...formItemLayout1} label="车间" key="oeews">
                                            {getFieldDecorator("WSUUID", {initialValue:WSUUID})(
                                                <Select style={{width:150}} onChange={this.handleChange}>
                                                    {/* <Option value="-1" key="all">全部</Option> */}
                                                    {
                                                        this.state.workshopList.map((item,index)=>{
                                                          return (<Option value={item.UUID} key={index}>{item.Name}</Option>)
                                                        })
                                                    }
                                                </Select>
                                            )}
                                          </FormItem>
                                      </div>
                                  </Col>
                                  <Col className="gutter-row" span={6}>
                                      <div className="gutter-box">
                                          <FormItem {...formItemLayout2} label="工作中心" key="oeewc">
                                            {getFieldDecorator("WCUUID", {initialValue:'-1'})(
                                                <Select style={{width:160}}>
                                                    <Option value="-1" key="all">全部</Option>
                                                    {
                                                        this.
                                                          state.
                                                          workCenterList.
                                                          map((item,index)=>(<Option value={item.value} key={index}>{item.Name}</Option>))
                                                    }
                                                </Select>
                                            )}
                                          </FormItem>
                                      </div>
                                  </Col>
                                  <Col className="gutter-row" span={8}>
                                      <div className="gutter-box">
                                          <FormItem {...formItemLayout2} label="日期" key="oeedate">
                                            {getFieldDecorator("RDate",{
                                                initialValue:[moment(RSDate),moment(REDate)],
                                                rules:[{required:true,message:'日期不能为空'}]
                                            })(
                                                <RangePicker style={{width:'100%'}}  format="YYYY/MM/DD" />
                                            )}
                                          </FormItem>
                                      </div>
                                  </Col>
                                  <Col className="gutter-row" span={4}>
                                      <div className="gutter-box">
                                          <Button type="primary"  htmlType="submit">查询</Button>
                                          <Button style={{
                                                  marginLeft: 8
                                              }} onClick={this.handleFormReset}>重置</Button>
                                      </div>
                                  </Col>
                              </Row>
                          </Form>
                      </Card>

                      <div  style={{margin:'20px 0',overflow:'hidden'}}>
                          <Form className="ProReMenu" style={{float:'right'}} layout="inline">
                              <FormItem  label="导出">
                                  <div
                                      className="exportMenuWrap"
                                      id="exportProductRep"
                                      style={{display:'flex'}}/>
                              </FormItem>
                          </Form>
                      </div>
                      <div id="productionTable">
                          <Table
                              columns={columns}
                              dataSource={productionReport}
                              // dataSource={productData}
                              // dataSource={this.state.dispatchingList}
                              bordered={true}
                              size="small"
                              scroll={{x:1300}}
                          />
                      </div>
                    </Spin>
                </div>
            </PageHeaderLayout>
        )
    }
}
TProductionReport = Form.create()(TProductionReport);
