import React, { Component } from 'react';
import {Table, Button, Radio, Row, Col, Divider,Select,
    List, Timeline, Menu, Card, DatePicker,Input,Form,message,
    Switch,Icon,Popconfirm,Upload } from 'antd';
const Option = Select.Option;
const ButtonGroup = Button.Group;
const FormItem = Form.Item;
import { TPostData, urlBase } from '../../utils/TAjax';
import { CModal } from 'components/TModal';
import {SimpleQForm,StandardQForm } from 'components/TForm';
import styles from './common.less';
import TableExport from 'tableexport';

export default class TstateTimeOverview extends React.Component {

    constructor( props ) {
        super( props )
        this.state = {
            title: props.title,
            productOrderList:[],
            ProModelList: [],
            ProModelSList:[],
            lotListData:[],
            workshopList:[],
            updateFromItem:{},
            loading:true,
            CModalShow:false,
            UModalShow:false,
            SubUModalShow:false,
            bordered:false,
            scroll:false,
            orderState:'-1',
            ProModelID:'-1',
            WorkshopID:'-1',
            keyWord:'',
            bordered:false,
            size:"small",
            subTableSize:"default",
            scroll:undefined,
            exportMenu:'',
            hasAddBtn:false
        }
        this.url='/api/tmanufacture/manufacture';
        // this.DataTable = React.createRef();
    }

    componentWillMount() {
        this.getProductOrder();
        this.getSubTableData();
        this.getProModelList();
        this.getWorkshopList();
    }

    componentDidMount() {
        /*let csvDom=document.getElementsByClassName("ant-table-body")[0];
        let btnWrap=document.getElementById("exportOrderMenu");
        const btn=TableExport(csvDom.children[0]);
        let children= btn.selectors[0].children[0];
        let childNodes=children.getElementsByTagName('button');
        childNodes[0].innerHTML="xlsx";
        childNodes[1].innerHTML="csv";
        childNodes[2].innerHTML="txt";
        console.log("btn",children);
        console.log("childNodes",childNodes);
        btnWrap.appendChild(children);*/
    }

    getProductOrder() {
        const {ProModelID,keyWord,orderState}=this.state;
        // console.log("查询条件：",ProModelID,keyWord,orderState);
        // this.setState({keyWord:this.keyWordInput.input.value});

        var dat = {
            PageIndex: 0,
            PageSize: -1,
            ProductModelUUID:ProModelID, //产品型号UUID
            WorkshopUUID: -1,            // 车间UUID
            WorkstationTypeUUID: -1, //工作中心类型UUID
            Status: orderState, //生产订单状态
            KeyWord: this.keyWordInput?this.keyWordInput.input.value:''
        }
        TPostData( '/api/tmanufacture/manufacture', "ListProductOrder", dat,
            ( res ) => {
                console.log( '查询到订单列表', res );
                var list = [],
                    Ui_list = res.obj.objectlist || [],
                    totalCount = res.obj.totalcount;
                Ui_list.forEach( ( item, index ) => {
                    list.push( {
                        key: index,
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
                        IssuedDate: item.IssuedDate, //下单日期
                        PlanDeliverDate: item.PlanDeliverDate, //计划交期
                        DeliverDateTime: item.DeliverDateTime, //实际交期
                        PlanStartDateTime: item.PlanStartDateTime, //计划开始时间
                        StartDateTime: item.StartDateTime, //实际开始时间
                        PlanFinishDateTime: item.PlanFinishDateTime.slice(0,10), //计划完成时间
                        FinishDateTime: item.FinishDateTime, //实际完成时间
                        UpdateDateTime: item.UpdateDateTime, //更新时间
                        Status: item.Status
                        //状态：0 - 冻结，1-活跃，拆分 2 - 已拆分，未排程 2 - 已排程，未投产  3 - 投产，生产中   4 - 完成生产  5 - 取消/变更
                    } )
                } )
                this.setState({productOrderList:list,loading:false});
                if(this.state.hasAddBtn==false){
                    let csvDom=document.getElementById("orderTableWrap")
                    .getElementsByClassName("ant-table-body")[0];
                    let btnWrap=document.getElementById("exportOrderMenu");
                    const btn=TableExport(csvDom.children[0]);
                    let children= btn.selectors[0].children[0];
                    let childNodes=children.getElementsByTagName('button');
                    childNodes[0].innerHTML="xlsx";
                    childNodes[1].innerHTML="csv";
                    childNodes[2].innerHTML="txt";
                    // console.log("btn",children);
                    // console.log("childNodes",childNodes);
                    btnWrap.appendChild(children);
                }
                this.setState({hasAddBtn:true});
            },
            ( error ) => {
                message.info( error );
            }
        );
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
                var list = [];
                console.log( "查询到chejian列表", res );
                var data_list = res.obj.objectlist || [];
                data_list.forEach(( item, index )=> {
                    list.push({key: index,value:item.UUID.toString(), text: item.Name} )
                } )
                this.setState({workshopList:list});
            },
            ( error )=> {
                message.info( error );
            }
        )
    }

    getSubTableData (){

        var dat = {
            PageIndex: 0,                       // 分页参数
            PageSize: -1,                       // 分页参数
            ProductOrderUUID: -1,       // 生产订单UUID
            OrderModelUUID: -1,         // 生产订单产品型号UUID(*)
            LotModelUUID:-1,            // 生产任务单产品型号UUID
            WorkshopUUID: -1,           // 车间UUID
            WorkstationTypeUUID: -1,    // 工作中心类型UUID(*)
            Status: -1,                 // 生产任务单状态
            KeyWord: ""                 // 模糊查询
        }

        TPostData( this.url, "ListLot", dat,
            ( res) => {
                console.log( '查询到子订单列表', res );
                let Ui_list = res.obj.objectlist || [],
                    list = [],
                    totalCount = res.obj.totalcount;
                Ui_list.forEach( ( item, index ) => {
                    list.push( {
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
                        ScheduleNumber:item.ScheduleNumber,
                        strFinishNumber: item.FinishNumber, //完成产量
                        strRejectNumber: item.RejectNumber, //不良产量
                        strPlanStartDateTime: item.PlanStartDateTime, //计划开始时间
                        PlanFinishDateTime: item.PlanFinishDateTime, //计划开始时间
                        strStartDateTime: item.StartDateTime, //实际开始时间
                        strPlanDeliverDateTime: item.PlanDeliverDateTime, //计划交付时间
                        strDeliverDateTime: item.DeliverDateTime, //实际交付时间
                        strUpdateDateTime: item.UpdateDateTime, //加工订单更新时间
                        strStatus: item.Status, //状态：0 - 取消，1 - 未投产，2 - 生产中， 3 - 完成，4 - 暂停
                        strBomID: item.BomID, //BOM ID
                        strBomName: item.BomName ? item.BomName : '-', //BOM名称
                        strProductOrderID: item.ProductOrderID ? item.ProductOrderID : '-', //生产订单ID
                        strProductOrderName: item.ProductOrderName ? item.ProductOrderName : '-', //生产订单名称
                    } )
                } )
                this.setState({lotListData:list})
            },
            ( error ) => {
                message.info( error );
            }, false
        );
    }

    renderSubTable(record,e2,e3){
        // this.setState({loading:true});
        // console.log("record",record);
        let list=[];
        const {lotListData}=this.state;
        const subcolumns=[
                {
                    title: '任务单号',
                    dataIndex: 'strID',
                    type: 'string'
                },
                {
                    title: '计划产量',
                    dataIndex: 'strPlanNumber',
                    type: 'string'
                },
                {
                    title: '已排产量',
                    dataIndex: 'ScheduleNumber',
                    type: 'string'
                },
                {
                    title: '工作中心',
                    dataIndex: 'strWorkCenter',
                    type: 'string'
                },
                /*{
                    title: '已完成',
                    dataIndex: 'strFinishNumber',
                    type: 'string'
                },*/
                /*{
                  title: '计划开始',
                  dataIndex: 'strPlanStartDateTime',
                  type: 'string'
                },*/
                {
                    title: '计划完成日期',
                    dataIndex: 'PlanFinishDateTime',
                    type: 'string'
                },
                {
                    title: '订单状态',
                    dataIndex: 'strStatus',
                    type: 'string',
                    render: ( e1, record ) => {
                        let status='';
                        status=e1==0?(<span>已取消(0)</span>):
                            e1==1?(<span>未排产(1)</span>):
                            e1==2?(<span>排产中(2)</span>):
                            e1==3?(<span>已排产(3)</span>):
                            e1==4?(<span>暂停中(4)</span>):
                            e1==5?(<span>已完成(5)</span>):
                            e1==6?(<span>生产中(6)</span>):
                            e1==9?(<span>生产挂起(9)</span>):
                            e1==10?(<span>已完成(10)</span>):
                            e1==11?(<span>暂停中(11)</span>):
                            <span>{e1}</span>
                        return  status;
                    }
                },
                /*{
                    title: '操作',
                    dataIndex: 'uMachineUUID',
                    type: 'operate', // 操作的类型必须为 operate
                    render:(e1,e2,e3)=>{
                        // console.log("行数据",e1,e2,e3);
                        return(<a href="#" onClick={this.toggleSubUModalShow.bind(this,e2)}>编辑</a>)
                    }
                }*/
        ];
        lotListData.forEach((item,index)=>{
            if(item.ProductOrderUUID==record.UUID){
                list.push(item);
            }
        });

        return (
            <Table
                columns = { subcolumns }
                dataSource = {list }
                bordered={false}
                pagination = { false }
                // loading={this.state.loading}
                size={this.state.size}
            />
        );
    }

    toggleCModalShow(){
        this.setState({CModalShow:!this.state.CModalShow});
    }

    toggleUModalShow(record){
        console.log("更新前",record);
        this.setState({UModalShow:!this.state.UModalShow,updateFromItem:record});
    }

    toggleSubUModalShow(record){
        console.log("更新前",record);
        this.setState({SubUModalShow:!this.state.SubUModalShow,updateFromItem:record});
    }

    handleCreat(data){
        let dat = {
            key: '1000',
            ID: data.ID, //订单编号
            // Name: data.Name, //订单名称
            Name: '--', //订单名称
            ProductModelUUID: data.ProductModelUUID, //产品型号UUID
            PlanNumber: data.Number, //计划产量
            PlanDeliverDate: data.PlanDeliverDate.format( 'YYYY-MM-DD' ) //计划交期
        }
        console.log('data',dat);

        TPostData('/api/tmanufacture/manufacture', "AddProductOrder", dat,
            ( res )=> {
                message.success("创建新订单成功！")
                this.getSubTableData();
                this.getProductOrder();
            },
            (err)=>{
                message.error("创建新订单失败！")
            }
        )
    }

    handleUpdate(data){
        const {updateFromItem}=this.state;
        let dat = {
            UUID: updateFromItem.UUID,
            ID: data.ID,
            PlanNumber: data.PlanNumber, //计划产量
            PlanDeliverDateTime: data[ 'date-picker' ], //计划交期
            // Name: data.Name,
            Name: '-',
            Desc: "-",
            Note: "-",
        }
        console.log('data',data);
        console.log('updateFromItem',updateFromItem);
        TPostData( '/api/tmanufacture/manufacture', "UpdateProductOrder", dat,( res )=> {
            //这块请求更新数据 成功回调
            // alert('成功了!');
            this.getProductOrder()
            // callback( data )
        } )
    }

    handleSubUpdate(data){
        const {updateFromItem}=this.state;

        console.log('data',data);
        console.log('updateFromItem',updateFromItem);
        let dat = {
            UUID: updateFromItem.UUID, //加工订单UUID
            ID: data.strID, //加工订单ID
            Desc:data.Desc, //加工订单描述
            Note: "-", //加工订单备注
        }
        TPostData( this.url, "UpdateLot", dat, function ( res ) {
            //这块请求更新数据 成功回调
            // alert('成功了!');
            // callback( data )
        } )
    }

    handlePause(data){
        // console.log("pauseData",data);
        let dat = {
            UUID: data.UUID,  //订单UUID
            Force:0
        }
        TPostData(this.url, "PauseProductOrder", dat,
            ( res )=> {
                message.success("暂停订单成功！")
                this.getSubTableData();
                this.getProductOrder();
            },
            (err)=>{
                message.error("暂停订单失败！")
            }
        )
    }

    handleCancel(data){
        console.log("CancelData",data);
        let dat = {
            UUID: data.UUID,  //订单UUID
            Force:0
        }
        TPostData(this.url, "CancelProductOrder", dat,
            ( res )=> {
                message.success("取消订单成功！")
                this.getSubTableData();
                this.getProductOrder();
            },
            (err)=>{
                message.error("取消订单失败！")
            }
        )
    }

    handleRestart(data){
        // console.log("RestartData",data);
        let dat = {
            UUID: data.UUID,  //订单UUID
            Force:0
        }
        TPostData(this.url, "RestartProductOrder", dat,
            ( res )=> {
                message.success("重启订单成功！")
                this.getSubTableData();
                this.getProductOrder();
            },
            (err)=>{
                message.error("重启订单失败！")
            }
        )
    }

    handleProChange(ele) {
        this.setState({ProModelID:ele});
    }

    handleWSChange(ele) {
        this.setState({WorkshopID:ele});
    }

    handleStatusChange(ele) {
        this.setState({orderState:ele});
    }

    handleRetrieve(){
        const {ProModelID,keyWord,orderState}=this.state;
        console.log('查询',ProModelID,this.keyWordInput.input.value,orderState);
        this.setState({keyWord:this.keyWordInput.input.value});
        this.getProductOrder();
    }

    handleExport(){
        let csvDom=document.getElementsByClassName("ant-table-body")[0];
        let btnWrap=document.getElementById("exportOrderMenu");
        // console.log('csvDom',csvDom.children);
        // console.log('csvDom',csvDom.getElementsByTagName("table"));
        const btn=TableExport(csvDom.children[0]);
        // console.log("btn",btn.selectors[0].children[0]);
        btnWrap.appendChild(btn.selectors[0].children[0]);
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
            ProModelList,
            ProModelSList,
            PauseModalShow,
            bordered,
            size,
            scroll
        }=this.state;
        // ProModelList.map((item,index)=>({key: index,value:item.UUID.toString(), text: item.Name}))

        const columns = [
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
                /*{
                    title: '实际产量',
                    dataIndex: 'FinishNumber',
                    type: 'sort'
                },
                {
                    title: '次品数量',
                    dataIndex: 'RejectNumber',
                    type: 'sort'
                },*/
                {
                    title: '下单日期',
                    dataIndex: 'IssuedDate',
                    type: 'string'
                },
                {
                    title: '计划交期',
                    dataIndex: 'PlanDeliverDate',
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
                        let statusText='';
                        statusText=e1==0?'已取消':
                            e1==1?'未就绪':
                            e1==2?'未执行':
                            e1==3?'暂停中':
                            e1==4?'执行中':
                            e1==5?'已完成':
                            e1==6?'生产中':
                            e1==9?'生产挂起':
                            e1==10?'已完成':
                            e1==11?'11':e1;
                        return  <span className="stateBotton">{statusText}</span>
                    }
                },
                {
                    title: '操作',
                    dataIndex: 'uMachineUUID',
                    type: 'operate', // 操作的类型必须为 operate
                    multipleType: "orderList",
                    width: 200,
                    render:(e1,record,e3)=>{
                        // console.log("行数据",e1,e2,e3);
                        let operate='';
                        if(record.Status&&record.Status==2){
                            operate=(
                                <span>
                                    <Popconfirm
                                        placement="topRight"
                                        title="确定暂停订单？"
                                        onConfirm={this.handlePause.bind(this,record)}
                                        okText="确定" cancelText="取消">
                                        <a href="#">暂停</a>
                                    </Popconfirm>
                                        <span className="ant-divider"></span>
                                    <Popconfirm
                                        placement="topLeft"
                                        title="确定取消订单？"
                                        onConfirm={this.handleCancel.bind(this,record)}
                                        okText="确定" cancelText="取消">
                                        <a href="#">取消</a>
                                    </Popconfirm>
                                </span>
                            );
                        }
                        else if(record.Status&&record.Status==3){
                            operate=(
                                <span>
                                    <Popconfirm
                                        placement="topRight"
                                        title="确定重启订单？"
                                        onConfirm={this.handleRestart.bind(this,record)}
                                        okText="确定" cancelText="取消">
                                        <a href="#">重启</a>
                                    </Popconfirm>
                                        <span className="ant-divider"></span>
                                    <Popconfirm
                                        placement="topLeft"
                                        title="确定取消订单？"
                                        onConfirm={this.handleCancel.bind(this,record)}
                                        okText="确定" cancelText="取消">
                                        <a href="#">取消</a>
                                    </Popconfirm>
                                </span>
                            );
                        }
                        else operate=(<span>无</span>)
                        return operate;
                    }
                }
        ];

        const CFormItem=[
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
                defaultValue: '1',
                rules: [ { required: true, message: '请选择产品型号' } ],
                options:ProModelSList
            },
            {
                name: 'Number',
                label: '计划产量',
                type: 'number',
                placeholder: '请输入计划产量',
                // help:"邮箱格式:12324@163.com",
                rules: [{ required: true, message: '请输入计划产量' },]
            },
            {
                name: 'PlanDeliverDate',
                label: '计划交期',
                type: 'date',
                placeholder: '请输入计划交期',
                rules: [ { required: true, message: '请选择计划交期' } ]
            }
        ]

        const UFormItem= [
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
                rules: [ { required: true, min: 2, message: '用户名至少为 5 个字符' } ]
            },
            {
                name: 'PlanNumber',
                label: '计划产量',
                type: 'number',
                placeholder: '请输入计划产量',
                rules: [ { required: true, message: '用户名至少为 5 个字符' }, { pattern: /^[0-9]+.?[0-9]*$/, message: '产量必须是数字' } ]
            },
            {
                name: 'PlanDeliverDateTime',
                label: '计划交期',
                type: 'date',
                placeholder: '请输入计划交期',
                // rules: [{ required: true,message: '请选择日期'},{type:'date',message: '日期格式为...'}]
            }
        ];

        const SubUFormItem= [
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
        ];

        //查询的数据项
        const RFormItem= [
            {
                name: 'KeyWord',
                label: '搜索内容',
                type: 'string',
                placeholder: '请输入搜索内容'
            },{
                name: 'WorkshopUUID',
                label: '车间',
                type: 'select',
                defaultValue: '-1',
                hasAllButtom: true,
                width: 180,
                options:workshopList
            },{
                name: 'ProUUID',
                label: '产品',
                type: 'select',
                defaultValue: '-1',
                hasAllButtom: true,
                width: 200,
                options: ProModelList
            },{
                name: 'OrderStatus',
                label: '订单状态',
                type: 'select',
                defaultValue: '-1',
                hasAllButtom: true,
                width: 200,
                options:[
                    {
                        value:-1,
                        text:'全部'
                    },
                    {
                        value:0,
                        text:'已取消'
                    },
                    {
                        value:1,
                        text:'未就绪'
                    },
                    {
                        value:2,
                        text:'未执行'
                    },
                    {
                        value:3,
                        text:'暂停中'
                    },
                    {
                        value:4,
                        text:'执行中'
                    },
                    {
                        value:5,
                        text:'已完成'
                    }
                ]
            }
        ];

        const props = {
          name: 'file',
          action: '//jsonplaceholder.typicode.com/posts/',
          headers: {
            authorization: 'authorization-text',
          },
          onChange(info) {
            if (info.file.status !== 'uploading') {
              console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
              message.success(`${info.file.name} file uploaded successfully`);
            } else if (info.file.status === 'error') {
              message.error(`${info.file.name} file upload failed.`);
            }
          },
        };

            return (
                <div className="cardContent">
                    {/* <Card >
                        <Row gutter={8}>
                            <Col className="gutter-row" span={5}>
                                <div className="gutter-box"><span style={{ width: "40%" }}>搜索内容:</span>
                                    <Input style={{ width: "60%" }}
                                        ref={(input) => { this.keyWordInput = input; }}
                                        placeholder="请输入搜索内容" />
                                </div>
                            </Col>
                            <Col className="gutter-row" span={5}>
                                <div className="gutter-box"><span style={{ width: "40%" }}>产品:</span>
                                    <Select defaultValue="-1" style={{ width: "60%" }} onChange={this.handleProChange.bind(this)}>
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
                                <div className="gutter-box"><span style={{ width: "40%" }}>车间:</span>
                                    <Select defaultValue="-1" style={{ width: "60%" }} onChange={this.handleWSChange.bind(this)}>
                                        <Option value="-1" key="all">全部</Option>
                                        {
                                            this.state.workshopList.map((item,index)=>{
                                                    return (<Option value={item.UUID} key={item.key}>{item.text}</Option>)
                                            })
                                        }
                                    </Select>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={5}>
                                <div className="gutter-box"><span style={{ width: "40%" }}>订单状态:</span>
                                    <Select defaultValue="-1" style={{ width: "60%" }} onChange={this.handleStatusChange.bind(this)}>
                                        <Option value="-1" key="all">全部</Option>
                                        <Option value="0" key="0">已取消</Option>
                                        <Option value="1" key="1">未就绪</Option>
                                        <Option value="2" key="2">未执行</Option>
                                        <Option value="3" key="3">暂停中</Option>
                                        <Option value="4" key="4">执行中</Option>
                                        <Option value="5" key="5">已完成</Option>
                                    </Select>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={4}>
                                <div className="gutter-box">
                                    <Button onClick={this.getProductOrder.bind(this)} type="primary" icon="search">查询</Button>
                                </div>
                            </Col>
                        </Row>
                    </Card> */}
                    <StandardQForm
                        FormItem={RFormItem}
                        // submit={this.handleQuery}
                        />
                    <div style={{marginTop:20}}>
                            <ButtonGroup style={{verticalAlign:'bottom'}}>
                                <Button
                                    onClick={this.toggleCModalShow.bind(this)}
                                    icon="plus" type="primary">添加</Button>
                                {/* <Button onClick={this.handleExport.bind(this)}  icon="file-excel" type="primary">导出</Button> */}
                                <Upload {...props}><Button icon="file-excel" type="primary">导入</Button></Upload>
                            </ButtonGroup>
                        <div style={{float:'right'}}>
                            <Form layout="inline">
                                <FormItem label="导出">
                                    <div className="exportMenuWrap" id="exportOrderMenu" style={{display:'flex'}}></div>
                                </FormItem>
                                <FormItem label="边框">
                                    <Switch checked={bordered} onChange={this.handleToggleBorder.bind(this)} />
                                </FormItem>
                                <FormItem label="大小">
                                    <Radio.Group size="default" value={size} onChange={this.handleSizeChange.bind(this)}>
                                        <Radio.Button value="default">大</Radio.Button>
                                        <Radio.Button value="middle">中</Radio.Button>
                                        <Radio.Button value="small">小</Radio.Button>
                                    </Radio.Group>
                                </FormItem>
                            </Form>
                        </div>
                    </div>
                    <div id="orderTableWrap">
                        <Table
                          // rowSelection={this.state.isSelection?rowSelection:null}
                          expandedRowRender={this.renderSubTable.bind(this)}
                          dataSource={this.state.productOrderList}
                          columns={columns}
                          loading={this.state.loading}
                          bordered={bordered}
                          size={size}
                          scroll={scroll}
                          ref="dataTable"
                          className="dataTable"
                          // title={()=><span>订单列表</span>}
                          // {...tableStatus}
                          // pagination={pagination}
                          // hideDefaultSelections={true}
                          // scroll={{ x:1500 }}
                          // onExpand={this.handleExpand}
                          />
                    </div>
                    <CModal
                        FormItem={CFormItem}
                        submit={this.handleCreat.bind(this)}
                        isShow={this.state.CModalShow}
                        hideForm={this.toggleCModalShow.bind(this)}
                    />
                    <CModal
                        FormItem={UFormItem}
                        updateItem={this.state.updateFromItem}
                        submit={this.handleUpdate.bind(this)}
                        isShow={this.state.UModalShow}
                        hideForm={this.toggleUModalShow.bind(this)}
                    />
                    <CModal
                        FormItem={SubUFormItem}
                        // updateItem={this.state.updateFromItem}
                        submit={this.handleSubUpdate.bind(this)}
                        isShow={this.state.SubUModalShow}
                        hideForm={this.toggleSubUModalShow.bind(this)}
                    />
                </div>
            )
    }
}
