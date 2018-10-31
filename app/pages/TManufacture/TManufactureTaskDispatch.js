import React, { Component } from 'react';
import moment from 'moment';
import {Table, Button,Radio, Row, Col, Divider,Select,
     List, Card, DatePicker,Input,message,Form,Switch,Popconfirm,Badge  } from 'antd';
const Option = Select.Option;
const FormItem = Form.Item;
import { TPostData, urlBase,TAjax } from 'utils/TAjax';
import { CModal } from 'components/TModal';
import SimpleTable from 'components/TTable/SimpleTable';
import {SimpleQForm,StandardQForm } from 'components/TForm';
import TableExport from 'tableexport';
import PageHeaderLayout from 'base/PageHeaderLayout';


let sess_info=sessionStorage.getItem('userinfo');
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
            workshopList:[],
            lazyWSlist:[],
            updateFromItem:{},
            finishedNum:0,
            rejectNum:0,
            dispatchLotState:'-1',
            WorkshopID:'-1',
            ProModelID: '',
            keyWord:'',
            loading:true,
            DModalShow:false,
            startModalShow:false,
            pauseModalShow:false,
            topModalShow:false,
            submitModalShow:false,
            bordered:false,
            hasAddBtn:false,
            size:"small",
            subTableSize:"default",
            scroll:undefined,
            total:0,
            current:1,
            pageSize:10,
            StartDate:moment((new Date().getTime()) - (1000 * 60 * 60 * 24*30)).format("YYYY.MM.DD"),
            EndDate:moment((new Date().getTime()) + (1000 * 60 * 60 * 24*30)).format("YYYY.MM.DD"),
            // authInfo:this.props.userInfo
            authInfo:JSON.parse(sess_info),
        }
        this.url='/api/tmanufacture/manufacture';
    }

    componentWillMount() {
        this.getWorkCenterList();
        this.getWorkshopList();
        this.setDefaultWS();
        // this.getDispatchLotList();
        // this.getProModelList();
    }

    componentDidMount() {}

    componentwillreceiveprops(){}

    getDispatchLotList() {
        const {
            current,
            pageSize,
            ProModelID,
            WorkshopID,
            keyWord,
            dispatchLotState,
            StartDate,EndDate
        } = this.state;

        // console.log('查询',keyWord,dispatchLotState);

        var dat = {
            PageIndex: current-1,                       // 分页参数
            // PageSize: -1,                       // 分页参数
            PageSize: pageSize,             // 分页参数
            // ProductOrderUUID: 1,       // 生产订单UUID
            ProductOrderUUID: -1,       // 生产订单UUID
            ProductModelUUID: -1,      // 生产订单产品型号UUID
            ProductModelID:ProModelID,
            WorkshopUUID: WorkshopID,            // 车间UUID
            WorkstationTypeUUID: -1, // 工作中心类型UUID
            WorkstationUUID: -1,         // 工作中心UUID
            MoldUUID: -1,                    // 模具UUID
            Status:dispatchLotState,   // 派工单状态
            StartDate:StartDate,
            EndDate:EndDate,
            KeyWord: keyWord                        // 模糊查询                                                        // 是否插单
        }
        // "ListJobTask"
        TPostData( this.url, "ListWorkOrder", dat,
            ( res )=> {

                console.log( "查询到派工单列表:", res );

                let list = [],
                    Ui_list = res.obj.objectlist || [],
                    totalcount = res.obj.totalcount;

                if(res.err==0){
                    Ui_list.forEach( function ( item, index ) {
                        list.push( {
                            key: index,
                            UUID: item.UUID, //加工订单UUID
                            BomUUID: item.BomUUID,
                            lotJobID: item.ID,
                            ProductOrderID:item.ProductOrderID,
                            ProductModelSpec:item.ProductModelSpec,
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
                            PRI:item.PRI,
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
                        // console.log("btn",children);
                        // console.log("childNodes",childNodes);
                        const ishasChild=btnWrap.hasChildNodes();
                        if(ishasChild)btnWrap.innerHTML='';
                        btnWrap.appendChild(children);
                    }
                    this.setState({hasAddBtn:true});
                }
                else{
                    message.error("数据错误！");
                    this.setState({loading:false});
                }

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
                // console.log( "查询到chejian列表", res );
                var data_list = res.obj.objectlist || [];
                data_list.forEach(( item, index )=> {
                    list.push({
                        key: index,
                        value:item.UUID.toString(),
                        text: item.Name,
                        disabled:!this.disableWSItem(item.ID),
                    } );
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
                // console.log( '查询到工作中心列表', Ui_list );
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
        this.setState({current,pageSize,hasAddBtn:false,loading:true},()=>{
            this.getDispatchLotList();
        });
    }

    handleQuery=(data)=>{
        // console.log("查询的值是:",data);
        // ProModelID,WorkshopID,keyWord,orderState
        const {WorkshopID,keyWord,dispatchLotState}=data;
        let {ProModelID}=data;
        let StartDate,EndDate;
        if(data.hasOwnProperty('Date')&&data.Date!=undefined){
            StartDate=data.Date[0].format('YYYY-MM-DD'); //排程开始时间
            EndDate=data.Date[1].format('YYYY-MM-DD');
            this.setState({StartDate,EndDate});
        }
        ProModelID=typeof(ProModelID)==='string'?ProModelID.trim():'';
        this.setState({current:1,hasAddBtn:false,WorkshopID,ProModelID,keyWord,dispatchLotState},()=>{
            this.getDispatchLotList();
        });
    }

    disableWSItem=(wsid)=>{
        if(this.state.authInfo&&this.state.authInfo.hasOwnProperty('UserLevel')){
            let ULevel=this.state.authInfo.UserLevel,
                isHasAuth;
            switch (wsid) {
                case 'AutoSMT_01':
                    if(ULevel=='develop'||ULevel=='administor'||ULevel=='aw_manager3')
                        isHasAuth=true;
                    break;
                case 'AutoSMT_02':
                    if(ULevel=='develop'||ULevel=='administor'||ULevel=='aw_manager2')
                        isHasAuth=true;
                    break;
                case 'Injection':
                    if(ULevel=='develop'||ULevel=='administor'||ULevel=='iw_manager')
                        isHasAuth=true;
                    break;
                case 'Punch':
                    if(ULevel=='develop'||ULevel=='administor'||ULevel=='pw_manager')
                        isHasAuth=true;
                    break;
                default:
                    isHasAuth=false;

            }
            return isHasAuth;
        }
        else return false;
    }

    setDefaultWS=()=>{
        let ULevel=this.state.authInfo.UserLevel,
            DefaultUUID=-1;
        switch (ULevel) {
            case 'aw_manager3':
                    DefaultUUID=1;
                break;
            case 'aw_manager2':
                    DefaultUUID=2;
                break;
            case 'iw_manager':
                    DefaultUUID=3;
                break;
            case 'pw_manager':
                    DefaultUUID=4;
                break;
            default:
                DefaultUUID=-1;
        }
        this.setState({WorkshopID:DefaultUUID},()=>this.getDispatchLotList());
    }

    hasAuth=()=>{
        let ULevel=this.state.authInfo.UserLevel,
            hasAuth;
        if(this.state.authInfo&&this.state.authInfo.hasOwnProperty('UserLevel')){
            switch (ULevel) {
                case 'aw_manager2':
                    //     DefaultUUID=1;
                    // break;
                case 'aw_manager3':
                        // DefaultUUID=2;
                    // break;
                case 'iw_manager':
                        // DefaultUUID=3;
                    // break;
                case 'pw_manager':
                        // DefaultUUID=4;
                    // break;

                // case 'administor':

                case 'develop':

                    hasAuth=true;
                    break;
                default:
                    hasAuth=false;
            }
            return hasAuth;
        }
        else return false;
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
            total,current,pageSize,
            ProModelID,WorkshopID,keyWord,dispatchLotState,
            finishedNum,rejectNum,
            StartDate,
            EndDate
        }=this.state;

        const columns = [
            {
                title: '工单号',
                dataIndex: 'lotJobID',
                key: 'lotJobID',
                render:(value,record)=>{
                    let S_Order=record.PRI==1?
                        (<span><Badge status="success" />{value}</span>):
                        (<span>{value}</span>);
                    return S_Order;
                }
            },
            {
                title: '订单号',
                // dataIndex: 'ProductModelName',
                dataIndex: 'ProductOrderID',
            },
            {
                title: '产品编号',
                // dataIndex: 'ProductModelName',
                dataIndex: 'ProductModelSpec',
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
              title: '次品数量',
              dataIndex: 'RejectNumber',
              type: 'sort'
            },*/
            /*
            {
              title: '实际交期',
              dataIndex: 'DeliverDateTime',
              type: 'string'
            },*/
            {
              title: '计划产量',
              dataIndex: 'PlanNumber',
              width:90
            },
            {
              title: '当前产量',
              dataIndex: 'FinishNumber',
              width:90,
            },
            {
              title: '计划开始',
              dataIndex: 'PlanStartDateTime',
              width:90
            },
            /*{
              title: '实际开始',
              dataIndex: 'StartDateTime',
              type: 'string'
            },*/
            /*{
              title: '计划交期',
              dataIndex: 'PlanDeliverDateTime',
              type: 'string'
            },*/
            {
              title: '计划完成',
              dataIndex: 'PlanFinishDateTime',
              type: 'string',
              width:90
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
                fixed: 'right',
                width: 100,
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
            {
                title: '操作',
                dataIndex: 'uMachineUUID',
                width:150,
                fixed: 'right',
                render:(e1,record)=>{
                    let operate='';

                    if(record.hasOwnProperty('Status')&&record.Status==0&&this.hasAuth()){
                        operate=(
                            <span>
                                <a onClick={this.toggleModalShow.bind(this,'submitModalShow',record)}>报工</a>
                            </span>
                        )
                    }
                    else if(record.hasOwnProperty('Status')&&record.Status==1&&this.hasAuth()){
                        operate=(
                            /*<span>
                                <Popconfirm
                                    placement="topLeft"
                                    title="确定执行派工？"
                                    onConfirm={this.handleDispatch.bind(this,record)}
                                    okText="确定" cancelText="取消">
                                    <a href="#">派工</a>
                                </Popconfirm>
                            </span>*/
                            <span>
                                {/* <Popconfirm
                                    placement="topLeft"
                                    title="确定取消派工？"
                                    onConfirm={this.handleCancel.bind(this,record)}
                                    okText="确定" cancelText="取消">
                                    <a href="#">取消派工</a>
                                </Popconfirm>
                                <span className="ant-divider"></span> */}
                            <a onClick={this.toggleModalShow.bind(this,'startModalShow',record)}>开始生产</a>
                            </span>
                        )
                    }
                    else if(record.hasOwnProperty('Status')&&record.Status==2&&this.hasAuth()){
                        operate=(
                            <span>
                                {/* <Popconfirm
                                    placement="topLeft"
                                    title="确定取消派工？"
                                    onConfirm={this.handleCancel.bind(this,record)}
                                    okText="确定" cancelText="取消">
                                    <a href="#">取消派工</a>
                                </Popconfirm> */}
                                <a onClick={this.toggleModalShow.bind(this,'pauseModalShow',record)}>暂停</a>
                                <span className="ant-divider"></span>
                            <a onClick={this.toggleModalShow.bind(this,'stopModalShow',record)}>取消</a>
                                <span className="ant-divider"></span>
                                <a onClick={this.toggleModalShow.bind(this,'submitModalShow',record)}>报工</a>
                            </span>
                        )
                    }
                    else if(record.hasOwnProperty('Status')&&record.Status==3&&this.hasAuth()){
                        operate=(
                            <span>
                                <a onClick={this.toggleModalShow.bind(this,'startModalShow',record)}>开始</a>
                                <span className="ant-divider"></span>
                            <a onClick={this.toggleModalShow.bind(this,'stopModalShow',record)}>取消</a>
                                <span className="ant-divider"></span>
                            <a onClick={this.toggleModalShow.bind(this,'submitModalShow',record)}>报工</a>
                            </span>
                        )
                    }
                    else operate=(<span>无</span>)
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
                        // min:1,
                        max:finishedNum
                    }
                ],
                help:(<span>计划数:<span style={{color:'#f5290d',fontWeight:'bolder'}}>{finishedNum}</span>,完成数不能超过计划数量</span>)
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
                        // min:1,
                        max:finishedNum
                    }
                ],
                help:(<span>计划数:<span style={{color:'#f5290d',fontWeight:'bolder'}}>{finishedNum}</span>计划数不能超过计划数量</span>)
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
                        min:0,
                        max:finishedNum
                    }
                ],
                help:(<span>计划数:<span style={{color:'#f5290d',fontWeight:'bolder'}}>{finishedNum}</span>,完成数不能超过计划数量</span>)
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
                        min:0,
                        max:finishedNum
                    }
                ],
                help:(<span>计划数:<span style={{color:'#f5290d',fontWeight:'bolder'}}>{finishedNum}</span>,计划数不能超过计划数量</span>)
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
                // rules: [{required: true,message: '请输入完成产量'}]
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
                        // min:1,
                        max:finishedNum
                    }
                ],
                help:(<span>计划数:<span style={{color:'#f5290d',fontWeight:'bolder'}}>{finishedNum}</span>完成数不能超过计划数量</span>)
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
                        // min:1,
                        max:finishedNum
                    }
                ],
                help:(<span>计划数:<span style={{color:'#f5290d',fontWeight:'bolder'}}>{finishedNum}</span>计划数不能超过计划数量</span>)
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
            /*{
                name: 'keyWord',
                label: '搜索内容',
                type: 'string',
                width: 200,
                placeholder: '请输入搜索内容'
            },*/
            /*{
                name: 'ProModelID',
                label: '产量料号',
                type: 'string',
                width: 200,
                placeholder: '请输入搜索内容'
            },*/{
                name: 'WorkshopID',
                label: '车间',
                type: 'select',
                // defaultValue: '1',
                defaultValue: this.state.WorkshopID,
                hasAllButtom: true,
                width: 180,
                options:workshopList
            },{
                name: 'dispatchLotState',
                label: '派工单状态',
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
                        value:5,
                        text:'已报工',
                        key:'6'
                    }
                ]
            },{
                name: 'Date',
                label: '日期',
                type: 'rangeDate',
                format:"YYYY/MM/DD",
                defaultValue:{startDate:StartDate,endDate:EndDate},
                width:220,
            }
        ];

        let Data={
            list:dispatchLotList,
            pagination:{total,current,pageSize}
        };

        const bcList = [{
            title:"首页",
            href: '/',
            }, {
            title: '生产管理',
            href: '/task_dispatch',
            }, {
            title: '生产工单管理',
        }];

        return (
            <PageHeaderLayout title="生产工单管理" wrapperClassName="pageContent" BreadcrumbList={bcList}>
                <div className="cardContent">
                    {/* <Card>
                        <Row gutter={16}>
                            <Col className="gutter-row" span={5}>
                                <div className="gutter-box"><span style={{ width: "40%" }}>搜索内容:</span>
                                    <Input
                                        ref={(input) => { this.keyWordInput = input; }}
                                        placeholder="请输入搜索内容" style={{ width: "60%" }}/>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <div className="gutter-box">
                                    <span style={{ width: "35%" }}>车间:</span>
                                    <Select defaultValue="-1" style={{ width: "65%" }} onChange={this.handleWSChange.bind(this)}>
                                        <Option value="-1" key="all">全部</Option>
                                        {
                                            this.state.workshopList.map((item,index)=>{
                                                return <Option key={index} value={item.value}>{item.text}</Option>
                                            })
                                        }
                                    </Select>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={5}>
                                <div className="gutter-box">
                                    <span style={{width: "40%"}}>产品:</span>
                                    <Select defaultValue="-1" style={{width: "60%"}} onChange={this.handleProChange.bind(this)}>
                                        <Option value="-1" key="all">全部</Option>
                                        {
                                            this.state.ProModelSList.map((item, index) => {
                                                return (<Option value={item.value} key={index}>{item.text}</Option>)
                                            })
                                        }
                                    </Select>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={5}>
                                <div className="gutter-box"><span style={{ width: "40%" }}>派工单状态:</span>
                                <Select defaultValue="-1" style={{ width: "60%" }} onChange={this.handleChange.bind(this)}>
                                    <Option value="-1" key="all">全部</Option>
                                    <Option value="0" key="0">已取消</Option>
                                    <Option value="1" key="1">未生产</Option>
                                    <Option value="2" key="2">生产中</Option>
                                    <Option value="3" key="3">已暂停</Option>
                                    <Option value="4" key="4">已报工</Option>
                                </Select>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={3}>
                                <div className="gutter-box">
                                    <Button  onClick={this.handleRetrieve.bind(this)} type="primary" icon="search">查询</Button>
                                </div>
                            </Col>
                        </Row>
                    </Card> */}
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
                            loading={this.state.loading}
                            data={Data}
                            columns={columns}
                            bordered={bordered}
                            size={size}
                            onChange={this.handleTableChange}
                            scroll={{x:1300}}
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
                        title="取消生产"
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
            </PageHeaderLayout>
        )
    }
}
