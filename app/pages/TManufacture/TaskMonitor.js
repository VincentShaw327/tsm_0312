import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Table, Button,Radio, Row, Col, Divider,Select,
     List, Card, DatePicker,Input,message,Form,Switch,Popconfirm,Modal ,Progress} from 'antd';
const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;
import { fetchTaskList } from 'actions/manufacture';
import { TPostData, urlBase,TAjax } from 'utils/TAjax';
import { CModal } from 'components/TModal';
import SimpleTable from 'components/TTable/SimpleTable';
import {SimpleQForm,StandardQForm } from 'components/TForm';
import PageHeaderLayout from '../../base/PageHeaderLayout';
import TableExport from 'tableexport';


@connect( ( state, props ) => {
    console.log( 'state', state )
    return {
        Breadcrumb:state.Breadcrumb,
        productTask: state.productTask,
    }
}, )
export default class taskMonitor extends Component {

    constructor( props ) {
        super( props )
        this.state = {
            title: props.title,
            dispatchLotList:[],
            lotListData:[],
            ProModelList: [],
            ProModelSList:[],
            WorkCenterList:[],
            workshopList:[],
            lazyWSlist:[],
            updateFromItem:{},
            finishedNum:0,
            rejectNum:0,
            dispatchLotState:'-1',
            WorkshopID:'-1',
            ProModelID: '-1',
            keyWord:'',
            loading:true,
            DModalShow:false,
            startModalShow:false,
            pauseModalShow:false,
            topModalShow:false,
            submitModalShow:false,
            bordered:false,
            hasAddBtn:false,
            showDetail:false,
            size:"small",
            subTableSize:"default",
            scroll:undefined,
            total:0,
            current:1,
            pageSize:10
        }
        this.url='/api/tmanufacture/manufacture';
    }

    componentWillMount() {
        // this.getDispatchLotList();
        // this.getProModelList();
        // this.getWorkCenterList();
        // this.getWorkshopList();
        this.props.dispatch( fetchTaskList( { current: 1 }, ( respose ) => {} ) );
    }

    componentDidMount() {
        // console.log('查询',this.keyWordInput.value);
        this.timer=setInterval(()=>{
            this.props.dispatch( fetchTaskList( {}, ( respose ) => {} ))
        },5000)

    }

    componentWillUnmount() {
        // client.end()
        clearInterval(this.timer)
    }


    getDispatchLotList() {
        const {current,pageSize,ProModelID,WorkshopID,keyWord,dispatchLotState}=this.state;

        console.log('查询',keyWord,dispatchLotState);

        var dat = {
            PageIndex: current-1,                       // 分页参数
            PageSize: pageSize,                       // 分页参数
            ProductOrderUUID: -1,       // 生产订单UUID
            ProductModelUUID: ProModelID,      // 生产订单产品型号UUID
            WorkshopUUID: WorkshopID,            // 车间UUID
            WorkstationTypeUUID: -1, // 工作中心类型UUID
            WorkstationUUID: -1,         // 工作中心UUID
            MoldUUID: -1,                    // 模具UUID
            Status:dispatchLotState,                           // 派工单状态
            KeyWord: keyWord                        // 模糊查询                                                        // 是否插单
        }
        // "ListJobTask"
        TPostData('/api/tmanufacture/manufacture/taskMonitor', "ListWorkOrder", dat,
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
                        WorkstationUUID: item.WorkstationUUID,
                        pro_progress:item.pro_progress,
                        rej_progress:item.rej_progress,
                        restTime:item.restTime
                    } )
                } );
                this.setState({dispatchLotList:list,total: totalcount, loading:false});
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

    getWorkshopList() {
        const dat = {
            PageIndex : 0,       //分页：页序号，不分页时设为0
            PageSize : -1,   //分页：每页记录数，不分页时设为-1
            FactoryUUID: -1,    //所属工厂UUID，不作为查询条件时取值设为-1
            TypeUUID: -1,  //类型UUID，不作为查询条件时取值设为-1
            KeyWord : ""
        }
        TPostData( '/api/TFactory/workshop', "ListActive", dat,
            ( res )=>{
                var list = [],
                    slist=[];
                console.log( "查询到chejian列表", res );
                var data_list = res.obj.objectlist || [];
                data_list.forEach(( item, index )=> {
                    list.push({key: index,value:item.UUID.toString(), text: item.Name} )
                    slist.push({key: index,value:item.UUID.toString(), label: item.Name,isLeaf:false} )
                } )
                this.setState({workshopList:list,lazyWSlist:slist});
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

    toggleModalShow(modaltype,record){
        console.log("派工前",modaltype,record);
        // finishedNum  rejectNum
        this.setState({finishedNum:record.PlanNumber,rejectNum:record.RejectNumber});
        switch (modaltype) {
            case 'startModalShow':
                this.setState({startModalShow:true,updateFromItem:record});
                break;
            case 'pauseModalShow':
                this.setState({pauseModalShow:true,updateFromItem:record});
                break;
            case 'stopModalShow':
                this.setState({stopModalShow:true,updateFromItem:record});
                break;
            case 'submitModalShow':
                this.setState({submitModalShow:true,updateFromItem:record});
                break;
            case 'DModalShow':
                this.setState({DModalShow:true,updateFromItem:record});
                break;
            default:
                '';
        }
    }

    hideModal=()=>{
        this.setState({
            startModalShow:false,
            pauseModalShow:false,
            stopModalShow:false,
            submitModalShow:false,
            DModalShow:false
        })
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
        // UndoSchedule   UndoDispatch
        TPostData(this.url, "UndoSchedule", dat,
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

    handleWSChange=(ele)=> {
        this.setState({WorkshopID:ele});
    }

    handleProChange(ele) {
        this.setState({ProModelID: ele});
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

    SubmitWorkOrder=(data)=>{
        const dat={
            UUID: this.state.updateFromItem.UUID,                                        //派工单UUID
            SubmitDateTime:data.submitDate.format('YYYY-MM-DD hh:mm:ss') ,    //暂停时间
            FinishNumber:data.FinishNumber,                              //完成产量
            RejectNumber:data.RejectNumber
        }
        console.log('submitdate',dat);
        TPostData(this.url, "SubmitWorkOrder", dat,
            ( res )=> {
                message.success("操作成功！")
                this.getDispatchLotList();
            },
            (err)=>{
                message.error("操作失败！")
            }
        )
    }

    StartWorkOrder=(data)=>{
        const dat={
            UUID: this.state.updateFromItem.UUID,                                        //派工单UUID
            StartDateTime:data.startDate.format('YYYY-MM-DD hh:mm:ss')     //暂停时间
        }
        TPostData(this.url, "StartWorkOrder", dat,
            ( res )=> {
                message.success("操作成功！")
                this.getDispatchLotList();
            },
            (err)=>{
                message.error("操作失败！")
            }
        )
    }

    PauseWorkOrder=(data)=>{
        const dat={
            UUID: this.state.updateFromItem.UUID,                                        //派工单UUID
            PauseDateTime:data.pauseDate.format('YYYY-MM-DD hh:mm:ss') ,    //暂停时间
            FinishNumber:data.FinishNumber,                              //完成产量
            RejectNumber:data.RejectNumber                             //不良数量
        }
        TPostData(this.url, "PauseWorkOrder", dat,
            ( res )=> {
                message.success("操作成功！")
                this.getDispatchLotList();
            },
            (err)=>{
                message.error("操作失败！")
            }
        )
    }

    StopWorkOrder=(data)=>{
        const dat={
            UUID: this.state.updateFromItem.UUID,                                        //派工单UUID
            StopDateTime:data.stopDate.format('YYYY-MM-DD hh:mm:ss') ,    //暂停时间
            FinishNumber:data.FinishNumber,                              //完成产量
            RejectNumber:data.RejectNumber,
            Desc:data.Desc
        }
        console.log("stopwork",dat);

        TPostData(this.url, "StopWorkOrder", dat,
            ( res )=> {
                message.success("操作成功！");
                this.getDispatchLotList();
            },
            (err)=>{
                message.error("操作失败！");
            }
        )
    }

    handleTableChange=(pagination)=>{
        // console.log('pagination',pagination);
        const {current,pageSize}=pagination;
        this.setState({current,pageSize,loading:true},()=>{
            this.getDispatchLotList();
        });
    }

    handleQuery=(data)=>{
        console.log("查询的值是:",data);
        // ProModelID,WorkshopID,keyWord,orderState
        const {ProModelID,WorkshopID,keyWord,dispatchLotState}=data;
        this.setState({ProModelID,WorkshopID,keyWord,dispatchLotState},()=>{
            this.getDispatchLotList();
        });
    }

    render() {

        const {
            dispatchLotList,
            ProModelList,
            ProModelSList,
            WorkCenterList,
            workshopList,
            DModalShow,
            startModalShow,
            pauseModalShow,
            stopModalShow,
            submitModalShow,
            bordered,size,scroll,
            // total,
            current,pageSize,
            ProModelID,WorkshopID,keyWord,dispatchLotState,
            finishedNum,rejectNum
        }=this.state;
        const {Breadcrumb}=this.props;
        const { productTaskList, total, loading } = this.props.productTask;

        const columns = [
            {
                title: '派工单号',
                dataIndex: 'lotJobID',
                key: 'lotJobID'
            },
            {
                title: '产品',
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
              title: '当前产量',
              dataIndex: 'FinishNumber',
              type: 'sort'
            },
            {
              title: '次品数量',
              dataIndex: 'RejectNumber',
              type: 'sort'
            },
            {
              title: '次品率',
              dataIndex: 'rej_progress',
              type: 'string',
              render:(val,record)=>{
                  return(<Progress type="circle" percent={val} width={40} />)
              }
            },
            /*{
              title: '派工时间',
              dataIndex: 'PlanStartDateTime',
              type: 'string'
            },*/
            {
              title: '开始时间',
              dataIndex: 'StartDateTime',
              type: 'string'
            },
            {
              title: '剩余时间(h)',
              dataIndex: 'restTime',
              type: 'string'
            },
            {
              title: '计划完成时间',
              dataIndex: 'PlanFinishDateTime',
              type: 'string'
            },
            /*{
              title: '实际完成',
              dataIndex: 'FinishDateTime',
              type: 'string'
            },*/
            {
              title: '生产进度',
              dataIndex: 'pro_progress',
              type: 'string',
              render:(val,record)=>{
                  return(<Progress percent={val} />)
              }
            },

            {
                title: '派工单状态',
                dataIndex: 'Status',
                key: 'Status',
                render: (e1, record) => {
                    // console.log('任务状态',record);
                    let status='';
                    status=e1==0?(<span className="orderCancelled">已取消</span>):
                        e1==1?(<span className="Unproduced">未生产</span>):
                        e1==2?(<span className="Inproduction">生产中</span>):
                        e1==3?(<span className="Pausing">已暂停</span>):
                        e1==4?(<span className="Submited">已报工</span>):
                        // e1==5?(<span>生产完成(5)</span>):
                        // e1==6?(<span>生产中(6)</span>):
                        // e1==9?(<span>生产挂起(9)</span>):
                        // e1==10?(<span>已完成(10)</span>):
                        // e1==11?(<span>暂停中(11)</span>):
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
                    return (<a>工单详情</a>)
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

        const SFormItem= [
            {
                name: 'startDate',
                label: '开始日期',
                type: 'date',
                placeholder: '请输入计划产量',
                rules: [{required: true,message: '请选择日期'}]
            }
        ];

        const PFormItem= [
            {
                name: 'FinishNumber',
                label: '完成产量',
                type: 'number',
                placeholder: '请输入完成产量',
                rules: [
                    {
                        required: true,
                        message: '请输入完成产量',
                        type:'number',
                        min:1,
                        max:finishedNum
                    }
                ],
                help:(<span>计划数:<span style={{color:'#f5290d',fontWeight:'bolder'}}>{finishedNum}</span>,完成数不能超过计划数量不能少于等于0个</span>)
            },
            {
                name: 'RejectNumber',
                label: '不良产量',
                type: 'number',
                placeholder: '请输入不良产量',
                rules: [
                    {
                        required: true,
                        message: '请输入完成产量',
                        type:'number',
                        min:1,
                        max:finishedNum
                    }
                ],
                help:(<span>计划数:<span style={{color:'#f5290d',fontWeight:'bolder'}}>{finishedNum}</span>,计划数不能超过计划数量不能少于等于0个</span>)
            },
            {
                name: 'pauseDate',
                label: '暂停日期',
                type: 'date',
                placeholder: '请选择日期',
                rules: [
                    {
                        required: true,
                        message: '请选择日期',
                        // type:'date'
                    }
                ],
            }
        ];

        const StopFormItem= [
            {
                name: 'FinishNumber',
                label: '完成产量',
                type: 'number',
                placeholder: '请输入完成产量',
                rules: [
                    {
                        required: true,
                        message: '请输入完成产量',
                        type:'number',
                        min:1,
                        max:finishedNum
                    }
                ],
                help:(<span>计划数:<span style={{color:'#f5290d',fontWeight:'bolder'}}>{finishedNum}</span>,完成数不能超过计划数量不能少于等于0个</span>)
            },
            {
                name: 'RejectNumber',
                label: '不良产量',
                type: 'number',
                placeholder: '请输入不良产量',
                rules: [
                    {
                        required: true,
                        message: '请输入完成产量',
                        type:'number',
                        min:1,
                        max:finishedNum
                    }
                ],
                help:(<span>计划数:<span style={{color:'#f5290d',fontWeight:'bolder'}}>{finishedNum}</span>,计划数不能超过计划数量不能少于等于0个</span>)
            },
            {
                name: 'stopDate',
                label: '停止日期',
                type: 'date',
                placeholder: '请输入计划产量',
                rules: [{required: true,message: '请选择日期'}]
            },
            {
                name: 'Desc',
                label: '停止原因',
                type: 'string',
                placeholder: '请输入完成产量',
                rules: [{required: true,message: '请输入完成产量'}]
            }
        ];

        const SubmitFormItem= [
            {
                name: 'FinishNumber',
                label: '完成产量',
                type: 'number',
                placeholder: '请输入完成产量',
                rules: [
                    {
                        required: true,
                        message: '请输入完成产量',
                        type:'number',
                        min:1,
                        max:finishedNum
                    }
                ],
                help:(<span>计划数:<span style={{color:'#f5290d',fontWeight:'bolder'}}>{finishedNum}</span>,完成数不能超过计划数量不能少于等于0个</span>)
            },
            {
                name: 'RejectNumber',
                label: '不良产量',
                type: 'number',
                placeholder: '请输入不良产量',
                rules: [
                    {
                        required: true,
                        message: '请输入完成产量',
                        type:'number',
                        min:1,
                        max:finishedNum
                    }
                ],
                help:(<span>计划数:<span style={{color:'#f5290d',fontWeight:'bolder'}}>{finishedNum}</span>,计划数不能超过计划数量不能少于等于0个</span>)
            },
            {
                name: 'submitDate',
                label: '报工日期',
                type: 'date',
                placeholder: '请输入计划产量',
                rules: [{required: true,message: '请选择日期'}]
            },
        ];
        // ProModelID,WorkshopID,keyWord,dispatchLotState
        //查询的数据项
        const RFormItem= [
            {
                name: 'keyWord',
                label: '搜索内容',
                type: 'string',
                width: 200,
                placeholder: '请输入搜索内容'
            },{
                name: 'WorkshopID',
                label: '车间',
                type: 'select',
                defaultValue: '-1',
                hasAllButtom: true,
                width: 180,
                options:workshopList
            },{
                name: 'ProModelID',
                label: '产品',
                type: 'select',
                defaultValue: '-1',
                hasAllButtom: true,
                width: 200,
                options: ProModelList
            },{
                name: 'dispatchLotState',
                label: '订单状态',
                type: 'select',
                defaultValue: '-1',
                hasAllButtom: true,
                width: 180,
                options:[
                    /*{
                        value:-1,
                        text:'全部',
                        key:'1'
                    },*/
                    {
                        value:0,
                        text:'已取消',
                        key:'2'
                    },
                    {
                        value:1,
                        text:'未生产',
                        key:'3'
                    },
                    {
                        value:2,
                        text:'生产中',
                        key:'4'
                    },
                    {
                        value:3,
                        text:'已暂停',
                        key:'5'
                    },
                    {
                        value:4,
                        text:'已报工',
                        key:'6'
                    }
                ]
            }
        ];

        let Data={
            // list:dispatchLotList,
            list:productTaskList,
            pagination:{total,current,pageSize}
        };

        const bcList = [{
            title:"首页",
            href: '/',
            }, {
            title: '生产资料',
            href: '/',
            }, {
            title: '物料类别',
        }];

        const workOrderList=(
            <div className="cardContent">
                <StandardQForm
                    FormItem={RFormItem}
                    submit={this.handleQuery}
                />
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
                    {/* <Table
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
                    /> */}
                    <SimpleTable
                        loading={loading}
                        data={Data}
                        columns={columns}
                        bordered={bordered}
                        size={size}
                        onChange={this.handleTableChange}
                    />
                </div>
                <CModal
                    FormItem={DFormItem}
                    submit={this.handleDispatch.bind(this)}
                    isShow={DModalShow}
                    hideForm={this.toggleModalShow.bind(this)}
                />
                <CModal
                    title="开始生产"
                    FormItem={SFormItem}
                    submit={this.StartWorkOrder}
                    isShow={startModalShow}
                    hideForm={this.hideModal}
                />
                <CModal
                    title="暂停生产"
                    FormItem={PFormItem}
                    submit={this.PauseWorkOrder}
                    isShow={pauseModalShow}
                    hideForm={this.hideModal}
                />
                <CModal
                    title="停止生产"
                    FormItem={StopFormItem}
                    submit={this.StopWorkOrder}
                    isShow={stopModalShow}
                    hideForm={this.hideModal}
                />
                <CModal
                    title="生产报工"
                    FormItem={SubmitFormItem}
                    submit={this.SubmitWorkOrder}
                    isShow={submitModalShow}
                    hideForm={this.hideModal}
                />
            </div>
        );

        const workOrderDetail=(
            <div>详情</div>
        )

        return (
            <PageHeaderLayout title="生产派工" wrapperClassName="pageContent" BreadcrumbList={Breadcrumb.BCList}>
                {
                    !this.state.showDetail?workOrderList:workOrderDetail
                    // workOrderList
                }

            </PageHeaderLayout>
        )
    }
}
