import React, { Component } from 'react';
import {Table, Button,Radio, Row, Col, Divider,Select,
     List, Card, DatePicker,Input,message,Form,Switch,Popconfirm } from 'antd';
const Option = Select.Option;
const FormItem = Form.Item;
import { TPostData, urlBase } from '../../utils/TAjax';
import { CModal } from '../../components/TModal';
import TableExport from 'tableexport';

export default class TstateTimeOverview extends Component {

    constructor( props ) {
        super( props )
        this.state = {
            title: props.title,
            dispatchLotList:[],
            lotListData:[],
            ProModelList: [],
            ProModelSList:[],
            WorkCenterList:[],
            updateFromItem:{},
            dispatchLotState:'-1',
            keyWord:'',
            loading:true,
            DModalShow:false,
            bordered:false,
            hasAddBtn:false,
            size:"small",
            subTableSize:"default",
            scroll:undefined
        }
        this.url='/api/tmanufacture/manufacture';
    }

    componentWillMount() {
        this.getDispatchLotList();
        this.getProModelList();
        this.getWorkCenterList();
    }

    componentDidMount() {
        // console.log('查询',this.keyWordInput.value);

    }

    getDispatchLotList() {
        const {keyWord,dispatchLotState}=this.state;
        console.log('查询',keyWord,dispatchLotState);

        var dat = {
            PageIndex: 0,
            PageSize: -1,
            LotUUID: -1, //生产订单UUID
            Status:dispatchLotState, //生产调度单状态
            KeyWord:keyWord //模糊查询条件
        }
        // "ListJobTask"
        TPostData( this.url, "ListLotJob", dat,
            ( res )=> {
                console.log( "查询到派工单列表:", res );
                var list = [],
                    Ui_list = res.obj.objectlist || [],
                    totalcount = res.obj.totalcount;
                Ui_list.forEach( function ( item, index ) {
                    list.push( {
                        key: index,
                        UUID: item.UUID, //加工订单UUID
                        BomUUID: item.BomUUID,
                        lotJobID: item.ID,
                        FinishDateTime: item.FinishDateTime,
                        FinishNumber: item.FinishNumber,
                        MoldModelUUID: item.MoldModelUUID,
                        PlanStartDateTime: item.PlanStartDateTime,
                        PlanFinishDateTime: item.PlanFinishDateTime,
                        PlanNumber: item.PlanNumber,
                        ProductModelID: item.ProductModelID,
                        ProductModelName: item.ProductModelName,
                        ProductModelSN: item.ProductModelSN,
                        ProductModelUUID: item.ProductModelUUID,
                        RejectNumber: item.RejectNumber,
                        StartDateTime: item.StartDateTime ,
                        Status: item.Status,
                        UUID: item.UUID,
                        UpdateDateTime: item.UpdateDateTime,
                        WorkstationID: item.WorkstationID,
                        WorkstationName: item.WorkstationName,
                        WorkstationUUID: item.WorkstationUUID
                    } )
                } );
                this.setState({dispatchLotList:list,loading:false});
                if(this.state.hasAddBtn==false){
                    let tableDom=document.getElementById("dispatchTableWrap")
                    .getElementsByClassName("ant-table-body")[0];
                    let btnWrap=document.getElementById("exportDispatchMenu");
                    const btn=TableExport(tableDom.children[0]);
                    let children= btn.selectors[0].children[0];
                    let childNodes=children.getElementsByTagName('button');
                    childNodes[0].innerHTML="xlsx";
                    childNodes[1].innerHTML="csv";
                    childNodes[2].innerHTML="txt";
                    console.log("btn",children);
                    console.log("childNodes",childNodes);
                    btnWrap.appendChild(children);
                }
                this.setState({hasAddBtn:true});
            },
            ( error )=> {
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
                var list = [],
                    slist=[];
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
                data_list.forEach(( item, index )=> {
                    slist.push({key: index,value:item.UUID.toString(), text: item.Name} )
                } )
                this.setState({ProModelList:list,ProModelSList:slist});
            },
            ( error )=> {
                message.info( error );
            }
        )
    }

    getWorkCenterList() {
        let dat = {
            'PageIndex': 0,
            'PageSize': -1,
            'TypeUUID': -1
        }

        TPostData('/api/TProcess/workcenter', "ListActive", dat,
            ( res )=> {
                var list = [];
                var Ui_list = res.obj.objectlist || [];
                console.log( '查询到工作中心列表', Ui_list );
                // var totalcount = res.obj.objectlist.length;
                // creatKeyWord = res.obj.objectlist.length;
                Ui_list.forEach(( item, index )=> {
                    list.push(
                        {
                            key: index,
                            value:item.UUID.toString(),
                            text: item.Name
                        }
                    )
                    /*list.push( {
                        key: index,
                        ID: item.ID,
                        UUID: item.UUID,
                        Name: item.Name,
                        TypeUUID: item.TypeUUID.toString(),
                        WorkshopUUID: item.WorkshopUUID.toString(),
                        WorkshopName: item.WorkshopName,
                        TypeName: item.TypeName,
                        Status: item.Status,
                        UpdateDateTime: item.UpdateDateTime,
                        Desc: item.Desc,
                        Note: item.Note
                    } )*/
                } )
                this.setState({WorkCenterList:list})
            },
            ( error )=> {
                message.info( error );
            }
        )

    }

    toggleDModalShow(record){
        console.log("派工前",record);
        this.setState({DModalShow:!this.state.DModalShow,updateFromItem:record});
    }

    handleDispatch(data){
        const {updateFromItem}=this.state;
        let dat = {
            UUID: data.UUID,  //订单UUID
        }
        TPostData(this.url, "Dispatch", dat,
            ( res )=> {
                message.success("派工成功！")
                this.getDispatchLotList();
            },
            (err)=>{
                message.error("派工失败！")
            }
        )
    }

    handleCancel(data){
        let dat = {
            UUID: data.UUID,  //订单UUID
        }
        TPostData(this.url, "UndoDispatch", dat,
            ( res )=> {
                message.success("取消派工成功！")
                this.getDispatchLotList();
            },
            (err)=>{
                message.error("取消派工失败！")
            }
        )
    }

    handleChange(ele) {
        this.setState({dispatchLotState:ele});
    }

    handleRetrieve(){
        // const {keyWord,dispatchLotState}=this.state;
        // console.log('查询',this.keyWordInput.input.value,dispatchLotState);
        this.setState({keyWord:this.keyWordInput.input.value});
        this.getDispatchLotList();
    }

    handleToggleBorder(value){
        console.log("ToggleBorder",value);
        this.setState({bordered:value});
    }

    handleScollChange(enable){
        console.log("enable",enable);
        this.setState({ scroll: enable ? {scroll }: undefined });
    }

    handleSizeChange(e){
          this.setState({ size: e.target.value });
    }

    render() {

        const {
            dispatchLotList,
            ProModelList,
            ProModelSList,
            WorkCenterList,
            DModalShow,bordered,size,scroll
        }=this.state;

        const columns = [
            {
                title: '派工单号',
                dataIndex: 'lotJobID',
                key: 'lotJobID'
            },
            {
                title: '产品名称',
                dataIndex: 'ProductModelName',
                key: 'BNum',
            },
            /*{
                title: '产品编码',
                dataIndex: 'ProductModelID',
                key: 'ProductModelIDe',
            },
            {
                title: '产品序列号',
                dataIndex: 'ProductModelSN',
                key: 'ProductModelSN'
            },*/
            {
                title: '工作中心',
                dataIndex: 'WorkstationName',
                key: 'WorkstationName',
            },
            /* {
                title: '工作中心编码',
                dataIndex: 'WorkstationID',
                key: 'WorkstationName',
            },*/
            /*{
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
              title: '计划产量',
              dataIndex: 'PlanNumber',
              type: 'sort'
            },
            {
              title: '计划开始时间',
              dataIndex: 'PlanStartDateTime',
              type: 'string'
            },
            /*{
              title: '实际开始',
              dataIndex: 'StartDateTime',
              type: 'string'
            },*/
            {
              title: '计划完成时间',
              dataIndex: 'PlanFinishDateTime',
              type: 'string'
            },
            /*{
              title: '实际完成',
              dataIndex: 'FinishDateTime',
              type: 'string'
            },
             */
            {
                title: '派工单状态',
                dataIndex: 'Status',
                key: 'Status',
                render: (e1, record) => {
                    // console.log('任务状态',record);
                    let status='';
                    status=e1==0?(<span>生产取消(0)</span>):
                        e1==1?(<span>未派工(1)</span>):
                        e1==2?(<span>已派工(2)</span>):
                        e1==3?(<span>生产中(3)</span>):
                        e1==4?(<span>生产挂起(4)</span>):
                        e1==5?(<span>生产完成(5)</span>):
                        e1==6?(<span>生产中(6)</span>):
                        e1==9?(<span>生产挂起(9)</span>):
                        e1==10?(<span>已完成(10)</span>):
                        e1==11?(<span>暂停中(11)</span>):
                        <span>{e1}</span>
                    return  status;
                }
            },
            {
                title: '操作',
                dataIndex: 'uMachineUUID',
                type: 'operate', // 操作的类型必须为 operate
                // multipleType: "dispatch",
                render:(e1,record)=>{
                    let operate='';
                    if(record.Status&&record.Status==1){
                        operate=(
                            <span>
                                <Popconfirm
                                    placement="topLeft"
                                    title="确定执行派工？"
                                    onConfirm={this.handleDispatch.bind(this,record)}
                                    okText="确定" cancelText="取消">
                                    <a href="#">派工</a>
                                </Popconfirm>
                            </span>
                        )
                    }
                    else if(record.Status&&record.Status==2){
                        operate=(
                            <span>
                                <Popconfirm
                                    placement="topLeft"
                                    title="确定取消派工？"
                                    onConfirm={this.handleCancel.bind(this,record)}
                                    okText="确定" cancelText="取消">
                                    <a href="#">取消派工</a>
                                </Popconfirm>
                            </span>
                        )
                    }
                    return operate;
                }
            }
        ];

        const DFormItem= [
            {
                name: 'Number',
                label: '派工产量',
                type: 'string',
                placeholder: '请输入派工产量',
                rules: [{required: true,message: '请输入派工产量'}]
            },
            {
                name: 'WorkstationUUID',
                label: '工作中心',
                type: 'select',
                options:WorkCenterList,
                /*postJson: {
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
                ],*/
                rules: [{required: true,message: '请选择工作中心'}]
            },
            {
                name: 'Date',
                label: '日期',
                type: 'RangePicker',
                placeholder: '请输入计划产量'
            }
        ];

            return (
                <div>
                    <Card>
                        <Row gutter={16}>
                            <Col className="gutter-row" span={6}>
                                <div className="gutter-box"><span style={{ width: "40%" }}>搜索内容:</span>
                                    <Input
                                        // defaultValue={this.state.keyWord}
                                        ref={(input) => { this.keyWordInput = input; }}
                                        placeholder="请输入搜索内容" style={{ width: "60%" }}/>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <div className="gutter-box"><span style={{ width: "40%" }}>派工单状态:</span>
                                <Select defaultValue="-1" style={{ width: "60%" }} onChange={this.handleChange.bind(this)}>
                                    <Option value="-1" key="all">全部</Option>
                                    <Option value="0" key="0">已取消</Option>
                                    <Option value="1" key="1">未派工</Option>
                                    <Option value="2" key="2">已派工</Option>
                                    <Option value="3" key="3">生产中</Option>
                                    <Option value="4" key="4">生产挂起</Option>
                                    <Option value="5" key="5">生产完成</Option>
                                </Select>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <div className="gutter-box">
                                    <Button  onClick={this.handleRetrieve.bind(this)} type="primary" icon="search">查询</Button>
                                </div>
                            </Col>
                        </Row>
                    </Card>
                    <div style={{margin:'20px 0',overflow:'auto',zoom:1}}>
                        <div style={{float:'right'}}>
                            <Form layout="inline">
                                <FormItem label="导出">
                                    <div className="exportMenuWrap" id="exportDispatchMenu" style={{display:'flex'}}></div>
                                </FormItem>
                                <FormItem label="边框">
                                    <Switch checked={bordered} onChange={this.handleToggleBorder.bind(this)} />
                                </FormItem>
                                <FormItem label="大小">
                                    <Radio.Group size="default" value={size} onChange={this.handleSizeChange.bind(this)}>
                                        {/* <Radio.Button value="biger">大</Radio.Button> */}
                                        <Radio.Button value="default">大</Radio.Button>
                                        <Radio.Button value="middle">中</Radio.Button>
                                        <Radio.Button value="small">小</Radio.Button>
                                    </Radio.Group>
                                </FormItem>
                            </Form>
                        </div>
                    </div>
                    <div id="dispatchTableWrap">
                        <Table
                          dataSource={dispatchLotList}
                          columns={columns}
                          loading={this.state.loading}
                          bordered={bordered}
                          size={size}
                          scroll={scroll}
                          // expandedRowRender={this.renderSubTable.bind(this)}
                          // rowSelection={this.state.isSelection?rowSelection:null}
                          // pagination={pagination}
                          // hideDefaultSelections={true}
                          // onExpand={this.handleExpand}
                          />
                    </div>
                    <CModal
                        FormItem={DFormItem}
                        submit={this.handleDispatch.bind(this)}
                        isShow={DModalShow}
                        hideForm={this.toggleDModalShow.bind(this)}
                        />
                </div>
            )
    }
}
