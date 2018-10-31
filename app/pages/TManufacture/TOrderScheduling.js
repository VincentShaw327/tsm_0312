import React, {Component} from 'react';
import { connect } from 'react-redux'
import moment from 'moment';
import {
    Table,
    Button,
    Icon,
    Radio,
    Row,
    Col,
    Divider,
    Select,
    List,
    Card,
    DatePicker,
    Input,
    message,
    Alert,
    Tag,
    Tooltip,
    Form,
    Switch,
    Popconfirm,
    Spin
} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const ButtonGroup = Button.Group;
import { fetchWorkcerList_forOrder } from 'actions/manufacture';
import {TPostData,TGetData, urlBase,TAjax} from 'utils/TAjax';
import PageHeaderLayout from '../../base/PageHeaderLayout';
import {CModal,UpdateModal} from 'components/TModal';
import SimpleTable from 'components/TTable/SimpleTable';
import {SimpleQForm,StandardQForm } from 'components/TForm';
import styles from './common.less';
import TableExport from 'tableexport';
import TaskView from './components/taskView'

let sess_info=sessionStorage.getItem('userinfo');

@connect( ( state, props ) => {
    console.log( 'state', state )
    return {
        Breadcrumb:state.Breadcrumb,
        device: state.device,
    }
}, )
export default class TstateTimeOverview extends Component {

    constructor(props) {
        super(props)
        this.state = {
            title: props.title,
            productOrderList:[],
            LotList: [],
            BSLotList: [],
            dispatchLotList: [],
            ProModelList: [],
            workshopList:[],
            lazyWSlist:[],
            ProModelSList: [],
            WorkCenterList: [],
            moldList:[],
            selectedRow: [],
            selectedRowKeys: [],
            DevTaskList:[],
            unscheduledNum:0,
            selectedProductID: -1,
            WorkshopID:'1',
            currentItemWSID:-1,
            updateFromItem: {},
            defaultBSLotList: [],
            DevTaskList:[],
            defaultBSNumber: 0,
            loading: true,
            CModalShow: false,
            UModalShow: false,
            SModalShow: false,
            BSModalShow: false,
            orderState:'-1',
            ProModelID: '',
            keyWord: '',
            bordered: false,
            size: "small",
            subTableSize: "default",
            scroll: undefined,
            hasAddBtn:false,
            total:0,
            current:1,
            pageSize:10,
            pageSizeOptions:['10','20','30','40','50'],
            IWSUUID:1,
            importing:false,
            StartDate:moment((new Date().getTime()) - (1000 * 60 * 60 * 24)).format("YYYY.MM.DD"),
            EndDate:moment((new Date().getTime())+(1000 * 60 * 60 * 24*3)).format("YYYY.MM.DD"),
            RDate:moment().format("YYYY.MM.DD"),
            // authInfo:this.props.userInfo,
            authInfo:JSON.parse(sess_info),
            cardContent: 'Scheduling',
        }
        this.url = '/api/tmanufacture/manufacture';
    }

    componentWillMount() {
        // this.getSubTableData();
        // this.getProModelList();
        this.getWorkCenterList();
        this.getWorkshopList();
        this.setDefaultWS();
        // this.getProductOrder();

    }

    componentDidMount() {}

    componentwillreceiveprops(){ }

    getProductOrder() {
        const {
            current,
            pageSize,
            ProModelID,
            WorkshopID,
            keyWord,
            orderState,
            StartDate,
            EndDate
        } = this.state;

        var dat = {
            PageIndex: current-1,
            PageSize: pageSize,
            ProductModelID:ProModelID,//产品编号
            ProductModelUUID:-1, //产品型号UUID
            WorkshopUUID: WorkshopID,    // 车间UUID
            WorkstationTypeUUID: -1,     //工作中心类型UUID
            Status: 1,          //生产订单状态
            StartDate:StartDate,
            EndDate:EndDate,
            KeyWord:keyWord
        }
        console.log("查询order",dat);
        TPostData( '/api/tmanufacture/manufacture', "ListProductOrder", dat,
            ( res ) => {
                console.log( '查询到订单列表', res );
                if(res.err==0){
                    var list = [],
                    Ui_list = res.obj.objectlist || [],
                    totalCount = res.obj.totalcount;
                    Ui_list.forEach( ( item, index ) => {
                        list.push( {
                            key: index,
                            UUID: item.UUID,
                            WorkshopUUID:item.WorkshopUUID,
                            ID: item.ID,
                            Name: item.Name,
                            Desc: item.Desc,
                            Note: item.Note,
                            ProductUUID: item.ProductUUID,
                            ProductModelID: item.ProductModelID,
                            ProductModelName: item.ProductModelName, //产品名称
                            WorkshopName:item.WorkshopName,
                            PlanNumber: item.PlanNumber, //计划产量
                            ScheduleNumber:item.ScheduleNumber,
                            Pro_node:item.ProductModelStandard,
                            FinishNumber: item.FinishNumber, //实际产量
                            RejectNumber: item.RejectNumber, //不合格数量
                            IssuedDateTime: item.IssuedDateTime.slice(0,10), //下单日期
                            PlanDeliverDate: item.PlanDeliverDate=="1970-01-01"?'-':item.PlanDeliverDate, //计划交期
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
                    this.setState({productOrderList:list,total: totalCount,loading:false});
                    if(this.state.hasAddBtn==false){
                        let tableDom=document.getElementById("lotListTableWrap")
                        .getElementsByClassName("ant-table-body")[0];
                        let btnWrap=document.getElementById("exportLotListMenu");
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
                    message.error("数据错误！");
                    this.setState({loading:false});
                }
            },
            ( error ) => {
                message.info( error );
            }
        );

    }

    getDeviceSchedule(){
        let WorkshopID=this.state.WorkshopID;
        var dat = {
            WorkshopUUID: WorkshopID=='-1'?'1':WorkshopID,    // 车间UUID
            WorkstationUUID: -1,     //工作中心类型UUID
        }
        TPostData( '/api/TReport/device_report', "GetDeviceSchedule", dat,
            ( res ) => {
                console.log( '查询到已排任务列表', res );
                let DevTaskList = [],
                    DevTask_List=res.obj.objectlist;

                if(res.err==0){
                    DevTask_List.forEach( ( item, index ) => {
                        let ScheduleList=item.ScheduleList;
                        if(ScheduleList&&ScheduleList.length){
                            ScheduleList.forEach((a,b)=>{
                                // if(a.Period==0) return;
                                DevTaskList.push({
                                    uuid:item.WorkstationUUID,
                                    task: item.WorkstationName,
                                    ID: item.WorkstationID,
                                    startTime:a.PlanStartDateTime,
                                    endTime:a.PlanFinishDateTime,
                                    PlanNumber:a.PlanNumber,
                                    // status:a.Status,
                                    // Period:a.Period,
                                    // field:a.ProductOrderID
                                    // field:a.ProductModelSpec
                                    field:"任务_"+b
                                    // field:a.Status==-1?'离线':
                                    //         a.Status==0?'待机':
                                    //         a.Status==1?'运行':
                                    //         a.Status==2?'告警':'其他'
                                })
                            })
                        }
                        else{
                            DevTaskList.push({
                                uuid:item.WorkstationUUID,
                                task: item.WorkstationName,
                                ID: item.WorkstationID,
                                startTime:this.state.RDate,
                                endTime:this.state.RDate,
                                // status:3,
                                field:''
                            })
                        }
                    } );

                    DevTaskList.sort((a,b)=>(b.uuid-a.uuid));
                    this.setState( {DevTaskList,loading:false },()=>{
                        console.log('DevTaskList',this.state.DevTaskList);
                    })
                }
                else{
                    message.error("数据错误！");
                    this.setState({loading:false});
                }
            },
            ( error ) => {
                message.info( error );
            }
        );
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
                        disabled:!this.disableWSItem(item.ID)
                    } )
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
        TPostData('/api/TProduct/product_model', "ListActive", dat, (res) => {
            var list = [],
                slist = [];
            console.log("查询到产品型号列表", res);
            var data_list = res.obj.objectlist || [];
            // var totalcount = res.obj.totalcount;
            data_list.forEach((item, index) => {
                list.push({
                    key: index,
                    UUID: item.UUID,
                    Name: item.Name,
                    TypeUUID: item.TypeUUID,
                    Image: item.Image,
                    Number: item.ID,
                    SN: item.SN,
                    Version: item.Version
                })
            })
            data_list.forEach((item, index) => {
                slist.push({key: index, value: item.UUID.toString(), text: item.Name})
            })
            this.setState({ProModelList: list, ProModelSList: slist});
        }, (error) => {
            message.info(error);
        })
    }

    getSubTableData() {
        var dat = {
            PageIndex: 0,              // 分页参数
            PageSize: -1,              // 分页参数
            ProductOrderUUID: -1,      // 生产订单UUID
            ProductModelUUID: -1,      // 生产订单产品型号UUID
            WorkshopUUID: -1,          // 车间UUID
            WorkstationTypeUUID: -1,   // 工作中心类型UUID
            WorkstationUUID: -1,       // 工作中心UUID
            MoldUUID: -1,              // 模具UUID
            Status: -1,                // 派工单状态
            KeyWord: ""                // 模糊查询
        }
        TPostData(this.url, "ListWorkOrder", dat, (res) => {
            console.log('查询到派工单列表:', res);
            var list = [],
                Ui_list = res.obj.objectlist || [];
            Ui_list.forEach((item, index) => {
                list.push({
                    key: index,
                    UUID: item.UUID,
                    LotUUID: item.LotUUID,
                    bomUUID: item.bomUUID,
                    lotJobID: item.ID,
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
                    UpdateDateTime: item.UpdateDateTime,
                    WorkstationID: item.WorkstationID,
                    WorkstationName: item.WorkstationName,
                    WorkstationUUID: item.WorkstationUUID
                })
            });
            this.setState({dispatchLotList: list});
        }, (error) => {
            message.info(error);
        })
    }

    getWorkCenterList(record) {
        let dat = {
            'PageIndex': 0,
            'PageSize': -1,
            'TypeUUID': -1,
            'ID': '',
            'WorkshopUUID': record?record.WorkshopUUID:-1,//this.state.currentItemWSID, //所属车间UUID，不作为查询条件时取值设为-1
            'KeyWord': ''
        }

        // TPostData('/api/TProcess/workcenter', "ListActive", dat, (res) => {
        TPostData('/api/TProcess/workcenter', "ListActiveForSchedule", dat, (res) => {
            var list = [];
            var Ui_list = res.obj.objectlist || [];
            // console.log('查询到工作中心列表', Ui_list);
            // var totalcount = res.obj.objectlist.length;
            // creatKeyWord = res.obj.objectlist.length;
            Ui_list.forEach((item, index) => {
                list.push({key: index, value: item.UUID.toString(), text: item.Name,ID:item.ID})
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
            })
            this.setState({WorkCenterList: list})
        }, (error) => {
            message.info(error);
        })

    }

    getMoldList(record){
        let dat = {
            PageIndex: 0,
            PageSize: -1,
            ModelUUID: -1,
            KeyWord: "",
            StorageUUID:record?record.WorkshopUUID:-1
        }
        TPostData('/api/TMold/mold', "ListActive", dat, (res) => {
            var list = [];
            var Ui_list = res.obj.objectlist || [];
            Ui_list.forEach((item, index) => {
                list.push({
                    key: index,
                    value: item.UUID.toString(),
                    text: item.ID,
                    // text: item.Name
                })
            })

            this.setState({moldList: list})
        }, (error) => {
            message.info(error);
        })
    }

    renderSubTable=(record)=> {
        // this.setState({loading:true});
        let list = [];
        console.log("record", record);
        const subcolumns = [
            {
                title: '工单号',
                dataIndex: 'lotJobID',
                key: 'lotJobID'
            }, {
                title: '产品名称',
                dataIndex: 'ProductModelName',
                key: 'BNum'
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
                key: 'WorkstationName'
            }, {
                title: '计划产量',
                dataIndex: 'PlanNumber',
                key: 'PlanNumber'
            }, {
                title: '工单状态',
                dataIndex: 'Status',
                key: 'Status',
                render: (e1, record) => {
                    // console.log('任务状态',record);
                    let status = '';
                    status = e1 == 0
                        ? (<span className="orderCancelled">已取消</span>)
                        : e1 == 1
                            ? (<span className="Unproduced">未生产</span>)
                            : e1 == 2
                                ? (<span className="Inproduction">生产中</span>)
                                : e1 == 3
                                    ? (<span className="Pausing">已暂停</span>)
                                    : e1 == 5
                                        ? (<span className="Submited">已报工</span>)
                                        : <span>{e1}</span>;
                                    // : e1 == 4
                                    //     ? (<span>生产挂起(4)</span>)
                                    //     : e1 == 5
                                    //         ? (<span>生产完成(5)</span>)
                                    //         : e1 == 6
                                    //             ? (<span>生产中(6)</span>)
                                    //             : e1 == 9
                                    //                 ? (<span>生产挂起(9)</span>)
                                    //                 : e1 == 10
                                    //                     ? (<span>已完成(10)</span>)
                                    //                     : e1 == 11
                                    //                         ? (<span>暂停中(11)</span>)
                                    //                         : <span>{e1}</span>
                    return status;
                }
            }, {
                title: '操作',
                dataIndex: 'UUID',
                type: 'operate',
                render: (e1, record, e3) => {
                    // console.log("record",record);
                    let operate = '';
                    if (record.Status && record.Status == 1) {
                        operate = (<span>
                            {/* <a onClick={this.toggleSModalShow.bind(this,record)} href="#">排产</a>
                                <span className="ant-divider"></span> */
                            }
                            <Popconfirm placement="topLeft" title="确定取消排产？" onConfirm={this.handleCancel.bind(this, record)} okText="确定" cancelText="取消">
                                <a href="#">取消排产</a>
                            </Popconfirm>
                        </span>)
                    } else
                        operate = (<span>无</span>);
                    return operate;
                }
            }
        ];

        var dat = {
            PageIndex: 0,              // 分页参数
            PageSize: -1,              // 分页参数
            ProductOrderUUID: record.UUID,      // 生产订单UUID
            ProductModelUUID: -1,      // 生产订单产品型号UUID
            WorkshopUUID: -1,          // 车间UUID
            WorkstationTypeUUID: -1,   // 工作中心类型UUID
            WorkstationUUID: -1,       // 工作中心UUID
            MoldUUID: -1,              // 模具UUID
            Status: -1,                // 派工单状态
            StartDate:'',
            EndDate:'',
            KeyWord: ""                // 模糊查询
        }

        TAjax('post',this.url,"ListWorkOrder",dat,
            (res)=>{
                console.log('1111',res);
                let  Ui_list = res.obj.objectlist || [];
                Ui_list.forEach((item, index) => {
                    list.push({
                        key: index,
                        UUID: item.UUID,
                        LotUUID: item.LotUUID,
                        bomUUID: item.bomUUID,
                        lotJobID: item.ID,
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
                        UpdateDateTime: item.UpdateDateTime,
                        WorkstationID: item.WorkstationID,
                        WorkstationName: item.WorkstationName,
                        WorkstationUUID: item.WorkstationUUID
                    })
                });
                // this.setState({loading:true});
            },
            (res)=>{
                console.log('失败',res);
            },
            false
        );
         return (<Table
                    columns={subcolumns}
                    dataSource={list}
                    bordered={false}
                    pagination={false}
                    // rowSelection={this.state.isSelection?rowSelection:null}
                    // loading={this.state.loading}
                    size={this.state.size}/>);
    }

    toggleUModalShow(record) {
        console.log("更新前", record);
        this.setState({
            UModalShow: !this.state.UModalShow,
            updateFromItem: record
        });
    }

    toggleSModalShow(record) {
        console.log("更新前", record);
        this.setState({SModalShow: !this.state.SModalShow});
        if(record){
            this.getWorkCenterList(record);
            this.getMoldList(record);
            this.setState({
                updateFromItem: record,
                unscheduledNum:record?(record.PlanNumber-record.ScheduleNumber):0
            });
        }
    }

    toggleBSModalShow(record) {
        const {selectedProductID, LotList, selectedRow} = this.state;
        let filterList = [],
            tempNumber = 0,
            tempList = [];
        console.log("批量操作前", LotList);
        // console.log("批量操作前多选项",selectedRow);
        console.log("批量操作前产品ID", selectedProductID);
        LotList.forEach((item, index) => {
            if (item.strStatus == 2 && item.ProductModelUUID == selectedProductID.toString()) {
                filterList.push({key: index, value: item.UUID.toString(), text: item.strID})
            }
        });
        tempList = selectedRow.map((item, index) => {
            /*return{
                key: index,
                value: item.UUID.toString(),
                text: item.strID
            }*/
            tempNumber += item.strPlanNumber;
            return item.UUID.toString();
        })
        console.log('defaultBSLot', tempList);
        console.log('filterList', filterList);
        // this.setState({BSModalShow:!this.state.BSModalShow,updateFromItem:record});
        this.setState({
            BSLotList: filterList,
            defaultBSLotList: tempList,
            defaultBSNumber: tempNumber,
            BSModalShow: !this.state.BSModalShow
        });
    }

    handleUpdate(data) {
        const {updateFromItem} = this.state;
        console.log('data', data);
        console.log('updateFromItem', updateFromItem);

        let dat = {
            UUID: updateFromItem.UUID, //加工订单UUID
            ID: data.strID, //加工订单ID
            Desc: data.strDesc, //加工订单描述
            Note: data.strNote //加工订单备注
        }
        TPostData(this.url, "UpdateLot", dat, (res) => {
            // callback(data)
            this.getProductOrder();
            message.success('更新成功');
        }, (err) => {
            console.log('err', err);
            message.error('更新失败');
        })
    }

    handleProfinish(record){

        TPostData(this.url, "CloseProductOrder", {UUID:record.UUID},
            () => {
                message.success('操作成功!');
                this.getProductOrder();
                // this.renderSubTable(data);
                // this.forceUpdate();
            },
            (err) => {
                message.error('操作失败！');
            }
        )
    }

    handleSchedul=(data)=> {
        const {updateFromItem,WorkCenterList} = this.state;
        let ws_ID='';
        WorkCenterList.forEach((item,index)=>{
            if(item.value==data.WorkstationUUID)
            ws_ID=item.ID;
        });
        let dat = {
            ProductOrderUUID: updateFromItem.UUID,                                  // 生产订单UUID
            WorkstationUUID: data.WorkstationUUID,//data.WorkstationUUID[1],                                   // 工作中心UUID
            MoldUUID: data.MoldUUID,//data.MoldUUID[1],                                              // 模具UUID
            ScheduleNumber: data.Number,                                     // 排产数量
            PlanStartDateTime: data.Date[0].format('YYYY-MM-DD hh:mm:ss'), //排程开始时间
            PlanFinishDateTime: data.Date[1].format('YYYY-MM-DD hh:mm:ss'), //排程结束时间[]
            // ID: data.dispatchID,                                                             // 派工单编号
            // ID: updateFromItem.ID+'_wl',`${moment(data.Date[0]).format('YY-MM-DD')}_${data.WorkstationUUID}`                                                          // 派工单编号
            ID:`${moment(data.Date[0]).format('YYMMDD')}_${ws_ID}_${updateFromItem.WorkshopUUID}`,// 派工单编号
            Insert: parseInt(data.insert)                                                  // 是否插单
        }
        console.log( '看看dat',data, dat );

        TPostData(this.url, "Schedule", dat, () => {
            message.success('排程成功!');
            this.getProductOrder();
            // this.renderSubTable(data);
            this.forceUpdate();
        }, (error) => {
            message.error('排程失败！');
        })
    }

    handleBSchedul(data) {
        const {updateFromItem} = this.state;
        console.log("表单数据", data);

        let dat = {
            // LotUUID: data.UUID, 加工订单UUID
            PlanNumber: data.Number, //排程产量
            ID: data.dispatchID,
            WorkstationUUID: data.WorkstationUUID, //工作中心UUID
            // MoldModelUUID: data.MoldModelUUID, 模具型号
            PlanStartTime: data.PlanStartTime.format('YYYY-MM-DD hh:mm:ss'), //排程开始时间
            PlanFinishTime: data.PlanFinishTime.format('YYYY-MM-DD hh:mm:ss'), //排程结束时间[]
            // LotList:updateFromItem.UUID,
            LotList: data.taskNuber
                ? data.taskNuber
                : [updateFromItem.UUID]
        }
        // console.log( '看看dat', dat );
        TPostData(this.url, "Schedule", dat, function(res) {
            message.success('批量排程成功');
        })
    }

    clearSelectedRow() {
        let clear = () => {
            let row = this.state.selectedRow;
            while (row && row.length > 0) {
                row.shift();
            }
            return;
        }
        this.setState({selectedRow: [], selectedRowKeys: [], selectedProductID: -1});
    }

    handleWSChange=(ele)=> {
        this.setState({WorkshopID:ele});
    }

    handleProChange(ele) {
        this.setState({ProModelID: ele});
    }

    handleStatusChange(ele) {
        this.setState({orderState: ele});
    }

    handleCancel(data) {
        console.log("取消排产的Data", data);
        let dat = {
            UUID: data.UUID, //订单UUID
        }
        TPostData(this.url, "UndoSchedule", dat, (res) => {
            message.success("暂停排产成功！")
            this.getProductOrder();
            this.renderSubTable(data)
            this.forceUpdate();
        }, (err) => {
            message.error("暂停排产失败！")
        })
    }

    handleClose(tag) {
        const {selectedRow, selectedRowKeys} = this.state;
        let tempSelectedRow = selectedRow,
            tempselectedRowKeys = selectedRowKeys,
            spliceRowIndex = 0,
            spliceRowKeyIndex = 0;

        spliceRowIndex = selectedRow.findIndex((ele, index) => {
            return ele.UUID == tag.UUID;
        });
        spliceRowKeyIndex = selectedRowKeys.findIndex((ele, index) => {
            return ele == tag.key;
        });
        tempSelectedRow.splice(spliceRowIndex, 1);
        tempselectedRowKeys.splice(spliceRowKeyIndex, 1);
        this.setState({selectedRow: tempSelectedRow, selectedRowKeys: tempselectedRowKeys});

        /* console.log('tag',tag);
        console.log('spliceIndex',spliceRowIndex);
        console.log('spliceRowKeyIndex',spliceRowKeyIndex);
        console.log("selectedRow",selectedRow);
        console.log("tempSelectedRow",tempSelectedRow);
        console.log("selectedRowKeys",selectedRowKeys);
        console.log("tempselectedRowKeys",tempselectedRowKeys); */
    }

    handleToggle = ( e ) => {
        // this.setState({ size: e.target.value });
        console.log( e.target.value );
        if ( e.target.value == "taskView" ){
            this.setState( { cardContent: "taskView" ,loading:true} );
            this.getDeviceSchedule();
        }
        else if ( e.target.value == "Scheduling" ) this.setState( { cardContent: "Scheduling" } );
    }

    handleToggleBorder(value) {
        console.log("ToggleBorder", value);
        this.setState({bordered: value});
    }

    handleScollChange(enable) {
        console.log("enable", enable);
        this.setState({
            scroll: enable
                ? {
                    scroll
                }
                : undefined
        });
    }

    handleSizeChange(e) {
        this.setState({size: e.target.value});
    }

    handleTableChange=(pagination)=>{
        // console.log('pagination',pagination);
        const {current,pageSize}=pagination;
        this.setState({current,pageSize,hasAddBtn:false,loading:true},()=>{
            this.getProductOrder();
        });
    }

    handleQuery=(data)=>{
        console.log("查询的值是:",data);
        const {WorkshopID,keyWord,orderState}=data;
        let {ProModelID}=data;
        let StartDate,EndDate;
        if(data.hasOwnProperty('Date')&&data.Date!=undefined){
            StartDate=data.Date[0].format('YYYY-MM-DD'); //排程开始时间
            EndDate=data.Date[1].format('YYYY-MM-DD');
            this.setState({StartDate,EndDate});
        }
        ProModelID=typeof(ProModelID)==='string'?ProModelID.trim():'';
        this.setState({current:1,hasAddBtn:false,ProModelID,currentItemWSID:WorkshopID,WorkshopID,keyWord,orderState},()=>{
            this.getProductOrder();
        });
    }

    setImportWS=(value)=>{
        this.setState({IWSUUID:value})
    }

    importOrder=()=>{
        console.log('开始导入');
        let currentID=this.state.IWSUUID,
            currentOP='';
        currentOP=(currentID==1)?':80/import_assemble.php':
        currentOP=(currentID==2)?':80/import_assemble2.php':
        (currentID==3)?':80/import_injection.php':
        (currentID==4)?':80/import_punch.php':':80/test_json.php';
        // (currentID==4)?':80/test_json.php':':80/import_punch.php';
        this.setState({importing:true});
        // TGetData(currentOP,'',{},
        TPostData(currentOP,'',{},
            (res) => {
                // message.success("暂停排产成功！")
                // this.renderSubTable(data)
                // this.forceUpdate();
                console.log('导入成功',res);
                this.setState({importing:false});
                message.success("导入成功");
                this.getProductOrder();
            },
            (err) => {
                // message.error("导入失败！");
                console.log(err);
                this.setState({importing:false});
            }
        )

    }

    disableWSItem=(wsid)=>{
        if(this.state.authInfo&&this.state.authInfo.hasOwnProperty('UserLevel')){
            let ULevel=this.state.authInfo.UserLevel,
                isHasAuth;
            // if(ULevel=='administor'||ULevel=='administor')
            console.log('disableWSItem',wsid,ULevel)
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
                    DefaultUUID='1';
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
        this.setState({WorkshopID:DefaultUUID,currentItemWSID:DefaultUUID},
            ()=>{
                this.getProductOrder();
                console.log('this.state',this.state)
            });

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
            productOrderList,
            LotList,
            BSLotList,
            ProModelList,
            ProModelSList,
            workshopList,
            WorkCenterList,
            moldList,
            selectedRowKeys,
            selectedRow,
            updateFromItem,
            UModalShow,
            SModalShow,
            BSModalShow,
            defaultBSLotList,
            defaultBSNumber,
            bordered,
            size,
            scroll,
            loading,
            current,total,pageSize,pageSizeOptions,
            unscheduledNum,
            importing,
            StartDate,
            EndDate,
            WorkshopID
        } = this.state;

        const columns = [
                {
                    title: '订单号',
                    dataIndex: 'ID',
                    type: 'string'
                },
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
                {
                    title: '产品编码',
                    dataIndex: 'Pro_node',
                    width: 120,
                },
                {
                    title: '所属车间',
                    dataIndex: 'WorkshopName',
                    width: 130,
                },
                {
                    title: '计划产量',
                    dataIndex: 'PlanNumber',
                    width: 80,
                },
                {
                    title: '已排产量',
                    dataIndex: 'ScheduleNumber',
                    width: 80,
                },
                {
                    title: '下单日期',
                    dataIndex: 'IssuedDateTime',
                    width: 100,
                },
                /*{
                    title: '计划交期',
                    dataIndex: 'PlanDeliverDate',
                    width: 100,
                },
                {
                    title: '计划完成时间',
                    dataIndex: 'PlanFinishDateTime',
                    type: 'string'
                },*/
                {
                    title: '订单状态',
                    dataIndex: 'Status',
                    // fixed: 'right',
                    type: 'string',
                    width: 100,
                    render: ( e1, record ) => {
                        /*let statusText='';
                        statusText=e1==0?'已取消':
                            e1==1?'未生产':
                            e1==2?'生产中':
                            e1==3?'已完成':e1;
                            // e1==4?'执行中':
                            // e1==5?'已完成':
                            // e1==6?'生产中':
                            // e1==9?'生产挂起':
                            // e1==10?'已完成':
                            // e1==11?'11':e1;
                        return  <span className="stateBotton">{statusText}</span>*/

                    let status='';
                        status=e1==0?(<span className="orderCancelled">已取消</span>):
                            e1==1?(<span className="Unproduced">处理中</span>):
                            e1==2?(<span className="Inproduction">处理中</span>):
                            e1==3?(<span className="Completed">已完成</span>):
                            // e1==4?(<span className="Submited">已报工(4)</span>):
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
                    // fixed: 'right',
                    width: 120,
                    render:(e1,record,e3)=>{
                        // console.log("行数据",e1,e2,e3);
                        let operate='';
                        if(record.hasOwnProperty('Status') &&(record.Status==1||record.Status==2)&&this.hasAuth()){
                            operate=(
                                <span>
                                    {
                                        (record.ScheduleNumber-record.PlanNumber)>=0?'':
                                        <span>
                                            <a onClick={this.toggleSModalShow.bind(this, record)}>排产</a>
                                            <span className="ant-divider"></span>
                                        </span>
                                    }
                                    {/* <a onClick={this.toggleSModalShow.bind(this, record)} href="#">排产</a>
                                    <span className="ant-divider"></span> */}
                                    <Popconfirm
                                        placement="topLeft"
                                        title="确定提交？"
                                        onConfirm={this.handleProfinish.bind(this,record)}
                                        okText="确定" cancelText="取消">
                                        <a href="#">关闭订单</a>
                                    </Popconfirm>
                                </span>
                            );
                        }
                        else operate=(<span>无</span>)
                        return operate;
                    }
                }
        ];

        const CFormItem = [
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
                        message: '用户名至少为 5 个字符'
                    }
                ]
            }, {
                name: 'ProductModelUUID',
                label: '产品型号',
                type: 'select',
                defaultValue: '1',
                rules: [
                    {
                        required: true,
                        message: '请选择产品型号'
                    }
                ],
                options: ProModelSList
                /*postJson: {
                    postUrl: '/api/tmanufacture/product_model',
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
                ]*/
            }, {
                name: 'Number',
                label: '计划产量',
                type: 'number',
                placeholder: '请输入计划产量',
                // help:"邮箱格式:12324@163.com",
                rules: [
                    {
                        required: true,
                        message: '请输入计划产量'
                    }
                ]
            }, {
                name: 'PlanDeliverDateTime',
                label: '计划交期',
                type: 'date',
                placeholder: '请输入计划交期',
                rules: [
                    {
                        required: true,
                        message: '请选择计划交期'
                    }
                ]
            }
        ]

        const UFormItem = [
            {
                name: 'strID',
                label: '订单号',
                type: 'string',
                placeholder: '请输入订单号',
                rules: [
                    {
                        required: true,
                        message: '请输入订单号'
                    }
                ]
            }, {
                name: 'strDesc',
                label: '订单描述',
                type: 'string',
                placeholder: '请输入订单描述',
                rules: [
                    {
                        required: true,
                        message: '请输入订单描述'
                    }
                ]
            }, {
                name: 'strNote',
                label: '订单备注',
                type: 'string',
                placeholder: '请输入计划产量'
            }
        ];

        const SFormItem = [
            {
                name: 'Number',
                label: '排程产量',
                type: 'number',
                placeholder: '请输入排程产量',
                rules: [
                    {
                        required: true,
                        message: '请输入排程产量',
                        type:'number',
                        min:1,
                        max:unscheduledNum
                    }
                ],
                help:(<span>未排数:<span style={{color:'#f5290d',fontWeight:'bolder'}}>{unscheduledNum}</span>,排产数不能超过未排数量不能少于等于0个</span>)
            }, /*{
                name: 'dispatchID',
                label: '派工单号',
                type: 'string',
                placeholder: '请输入派工单号',
                rules: [
                    {
                        required: true,
                        message: '派工单号不能为空'
                    }
                ]
            },*/{
                name: 'WorkstationUUID',
                label: '机台',
                // type: 'LazyCascader',
                type: 'select',
                options:WorkCenterList,
                resetValue:(value)=>{
                    // console.log("选择的工作中心是：",value);
                },
                fetchParameter:{
                    url:'/api/TProcess/workcenter',
                    op:"ListActive",
                    obj: {
                        'PageIndex': 0,
                        'PageSize': -1,
                        'TypeUUID': -1,
                        'KeyWord':'',
                        WorkshopUUID:updateFromItem.WorkshopUUID
                    },
                    lazyItem:'WorkshopUUID',
                },
                rules: [
                    {
                        required: true,
                        message: '请选择工作中心'
                    }
                ]
            },{
                name: 'MoldUUID',
                label: '模具',
                // type: 'LazyCascader',
                type: 'select',
                disabled:((WorkshopID=='1')||(WorkshopID=='2'))?true:false,
                defaultValue:((WorkshopID=='1')||(WorkshopID=='2'))?WorkshopID:'',
                // options:this.state.lazyWSlist,
                options:moldList,
                resetValue:(value)=>{
                    // console.log("选择的工作中心是：",value);
                },
                fetchParameter:{
                    url:'/api/TMold/mold',
                    op:"ListActive",
                    obj: {
                        PageIndex: 0,
                        PageSize: -1,
                        ModelUUID: -1,
                        KeyWord: ""
                    },
                    // lazyItem:'WorkshopUUID'
                    lazyItem:'StorageUUID'
                },
                rules: [
                    {
                        required: true,
                        message: '请选择模具'
                    }
                ]
            },
            {
                name: 'Date',
                label: '日期',
                type: 'rangeDate',
                placeholder: '请输入计划产量',
                disabledDate:(current)=> {
                  // Can not select days before today and today
                  return current && current < moment().subtract(1,'day');
                },
                rules: [
                    {
                        required: true,
                        message: '日期不能为空'
                    }
                ]
            },
            {
                name: 'insert',
                label: '是否插单',
                type: 'radio',
                // checked:'是',
                // unChecked:'否',
                defaultValue:'0',
                options:[{value:'0',text:'否'},{value:'1',text:'是'}]
            },
            /*{
                name: 'PlanStartTime',
                label: '起始时间',
                type: 'date',
                placeholder: '请输入计划产量'
            }, {
                name: 'PlanFinishTime',
                label: '结束时间',
                type: 'date',
                placeholder: '请输入计划产量'
            }*/
        ];

        const BSFormItem = [
            {
                name: 'dispatchID',
                label: '派工单号',
                type: 'string',
                placeholder: '请输入派工单号',
                rules: [
                    {
                        required: true,
                        message: '派工单号不能为空'
                    }
                ]
            }, {
                name: 'Number',
                label: '数量',
                type: 'string',
                defaultValue: defaultBSNumber,
                placeholder: '请输入订单编号',
                rules: [
                    {
                        required: true,
                        message: '数量不能为空'
                    }
                ]
            }, {
                name: 'WorkstationUUID',
                label: '工作中心',
                type: 'select',
                options: WorkCenterList,
                rules: [
                    {
                        required: true,
                        message: '请选择工作中心'
                    }
                ]
            }, {
                name: 'taskNuber',
                label: '工单号',
                type: 'multipleSelect',
                defaultValue: defaultBSLotList,
                options: BSLotList,
                rules: [
                    {
                        required: true,
                        message: '请选择模具型号'
                    }
                ]
            },
            /*{
                name: 'Date',
                label: '日期',
                type: 'RangePicker',
                placeholder: '请输入计划产量'
            },*/
            {
                name: 'PlanStartTime',
                label: '起始时间',
                type: 'date',
                placeholder: '请输入计划产量'
            }, {
                name: 'PlanFinishTime',
                label: '结束时间',
                type: 'date',
                placeholder: '请输入计划产量'
            }
        ];

        //查询的数据项
        const RFormItem= [
            /*{
                name: 'keyWord',
                label: '查询内容',
                type: 'string',
                width: 200,
                placeholder: '请输入搜索内容',
                defaultValue:this.state.keyWord
            },*/{
                name: 'ProModelID',
                label: '料号',
                type: 'string',
                width: 200,
                placeholder: '请输入搜索内容',
                // defaultValue:this.state.ProModelID
            },{
                name: 'WorkshopID',
                label: '车间',
                type: 'select',
                defaultValue: this.state.WorkshopID,
                hasAllButtom: true,
                width: 180,
                options:workshopList
            },/*{
                name: 'ProModelID',
                label: '产品',
                type: 'select',
                defaultValue: '-1',
                hasAllButtom: true,
                width: 200,
                options: ProModelList
            },*/{
                name: 'orderState',
                label: '订单状态',
                type: 'select',
                defaultValue: '-1',
                hasAllButtom: true,
                width: 180,
                options:[
                    /*{
                        value:0,
                        text:'已取消',
                        key:'2'
                    },*/
                    {
                        value:1,
                        text:'处理中',
                        // text:'未生产',
                        key:'3'
                    },
                    /*{
                        value:2,
                        text:'处理中',
                        // text:'生产中',
                        key:'4'
                    },*/
                    {
                        value:3,
                        text:'已完成',
                        key:'5'
                    }
                ]
            },
            {
                name: 'Date',
                label: '日期',
                type: 'rangeDate',
                format:"YYYY/MM/DD",
                defaultValue:{startDate:StartDate,endDate:EndDate},
                width:220,
                placeholder: '请输入计划产量',
            }
        ];

        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
                if (selectedRows.length)
                    this.setState({selectedRow: selectedRows, selectedRowKeys, selectedProductID: selectedRows[0].ProductModelUUID});
                else
                    this.setState({selectedRow: selectedRows, selectedRowKeys, selectedProductID: -1});
                    // console.log('selectedRow: ', this.state.selectedRow);
                }
            ,
            selectedRowKeys,
            // selectedRowKeys:this.state.selectedRow,
            // selections:[true,true,true],
            getCheckboxProps: (record, e2, e3) => {
                // console.log('Disabled User',record);
                // console.log('this.state.selectedProductID',this.state.selectedProductID);
                if (this.state.selectedProductID == -1)
                    return ({
                        disabled: record.strStatus !== 1 && record.strStatus !== 2
                    });
                return ({
                    disabled: (record.ProductModelUUID !== this.state.selectedProductID || (record.strStatus !== 2 && record.strStatus !== 1))
                });
            }
        };

        const AlertMessage = (
            <div>
                <span>已选择
                    <a style={{fontSize: 15,color: 'red'}}>{selectedRow.length}</a>项
                </span>
                <a
                    style={{marginLeft: 20}}
                    onClick={this.clearSelectedRow.bind(this)}>清除</a>
            </div>
        )

        let Data={
            list:productOrderList,
            pagination:{total,current,pageSize,pageSizeOptions}
        };

        const bcList = [{
          title:"首页",
          href: '/',
          }, {
          title: '生产管理',
          href: '/',
          }, {
          title: '任务排程',
          }];

        const HeadAction = (
            <div>
                <span>车间：
                    <Select defaultValue="1" style={{ width: 120,marginRight:20 }} onChange={this.setImportWS} >
                        <Option value="1">自动一车间</Option>
                        <Option value="2">自动二车间</Option>
                        <Option value="3">注塑车间</Option>
                        <Option value="4">冲压车间</Option>
                    </Select>
                </span>
                <Button onClick={this.importOrder} disabled={importing} type="primary" icon="download">导入</Button>
            </div>
        );

        const toggleView=this.state.cardContent;

        let localdata = [
            {
                "task": "task0",
                "startTime": "2018-04-18 00:17:12",
                "endTime": "2018-04-18 01:19:10",
                "status": 0
            }, {
                "task": "task0",
                "startTime": "2018-04-18 01:19:10",
                "endTime": "2018-04-18 02:19:10",
                "status": 1
            }, {
                "task": "task1",
                "startTime": "2018-04-18 01:18:15",
                "endTime": "2018-04-18 01:19:20",
                "status": 0
            }, {
                "task": "task1",
                "startTime": "2018-04-18 01:19:20",
                "endTime": "2018-04-18 06:19:20",
                "status": 1
            }, {
                "task": "task2",
                "startTime": "2018-04-18 02:11:32",
                "endTime": "2018-04-18 02:18:50",
                "status": 0
            }, {
                "task": "task3",
                "startTime": "2018-04-18 02:18:50",
                "endTime": "2018-04-18 03:16:38",
                "status": 0
            }, {
                "task": "task4",
                "startTime": "2018-04-18 02:19:48",
                "endTime": "2018-04-18 02:21:57",
                "status": 0
            }, {
                "task": "task5",
                "startTime": "2018-04-18 03:16:38",
                "endTime": "2018-04-18 03:19:38",
                "status": 1
            }, {
                "task": "task6",
                "startTime": "2018-04-18 03:19:38",
                "endTime": "2018-04-18 03:27:49",
                "status": 0
            }, {
                "task": "task7",
                "startTime": "2018-04-18 07:29:37",
                "endTime": "2018-04-18 07:33:01",
                "status": 0
            }, {
                "task": "task8",
                "startTime": "2018-04-18 03:27:49",
                "endTime": "2018-04-18 04:26:05",
                "status": 0
            }, {
                "task": "task9",
                "startTime": "2018-04-18 04:26:05",
                "endTime": "2018-04-18 06:06:36",
                "status": 0
            }, {
                "task": "task10",
                "startTime": "2018-04-18 06:06:36",
                "endTime": "2018-04-18 06:15:15",
                "status": 0
            }, {
                "task": "task11",
                "startTime": "2018-04-18 03:27:49",
                "endTime": "2018-04-18 03:34:50",
                "status": 0
            }
        ];

        return (
            <PageHeaderLayout
                title="任务排程"
                wrapperClassName="pageContent"
                BreadcrumbList={bcList}
                action={HeadAction}>
                <Spin  spinning={importing} tip="导入数据中...">
                    <div className="cardContent">
                        {/* <Card >
                            <Row gutter={16}>
                                <Col className="gutter-row" span={5}>
                                    <div className="gutter-box">
                                        <span style={{width: "35%"}}>搜索内容:</span>
                                        <Input style={{width: "65%"}} ref={(input) => {this.keyWordInput = input;}} placeholder="请输入搜索内容"/>
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
                                    <div className="gutter-box">
                                        <span style={{width: "40%"}}>订单状态:</span>
                                        <Select defaultValue="-1" style={{width: "60%"}} onChange={this.handleStatusChange.bind(this)}>
                                            <Option value="-1" key="all">全部</Option>
                                            <Option value="0" key="0">已取消</Option>
                                            <Option value="1" key="1">未排产</Option>
                                            <Option value="2" key="2">排产中</Option>
                                            <Option value="3" key="3">已完成</Option>
                                        </Select>
                                    </div>
                                </Col>
                                <Col className="gutter-row" span={3}>
                                    <div className="gutter-box">
                                        <Button onClick={this.getProductOrder.bind(this)} type="primary" icon="search">查询</Button>
                                    </div>
                                </Col>
                            </Row>
                            {
                                selectedRow.length
                                    ? <div>
                                            <Divider>批量操作</Divider>
                                            {
                                                selectedRow.map((tag, index) => {
                                                    const tagElem = (
                                                        <Tag key={tag.UUID} closable="closable" afterClose={() => this.handleClose(tag)}>
                                                            {tag.strID}
                                                        </Tag>
                                                    );
                                                    return tagElem;
                                                })
                                            }
                                            <div style={{
                                                    marginTop: 20
                                                }}>
                                                <ButtonGroup>
                                                    <Button onClick={this.toggleBSModalShow.bind(this)} type="primary" size="small">
                                                        <Icon type="schedule"/>批量排程
                                                    </Button>
                                                    <Button type="primary" size="small" onClick={this.clearSelectedRow.bind(this)}>
                                                        <Icon type="delete"/>清除
                                                    </Button>
                                                </ButtonGroup>
                                            </div>
                                        </div>
                                    : ''
                            }
                        </Card> */}
                        <StandardQForm
                            FormItem={RFormItem}
                            submit={this.handleQuery}
                            />
                        <div style={{margin: 20,overflow:'auto',zoom:1}}>
                            <div style={{float:'left'}}>
                                <Radio.Group value={toggleView}  onChange={this.handleToggle}>
                                    <Radio.Button value="Scheduling">订单排产</Radio.Button>
                                    <Radio.Button value="taskView">已排任务</Radio.Button>
                                </Radio.Group>
                            </div>
                            <div style={{float:'right'}}>
                                <Form layout="inline">
                                    <FormItem label="导出">
                                        <div className="exportMenuWrap" id="exportLotListMenu" style={{display:'flex'}}></div>
                                    </FormItem>
                                    <FormItem label="边框">
                                        <Switch checked={bordered} onChange={this.handleToggleBorder.bind(this)}/>
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
                        {
                            this.state.cardContent=="Scheduling"?
                            <div id="lotListTableWrap">
                                {/* <Table
                                    expandedRowRender={this.renderSubTable.bind(this)}
                                    rowSelection={rowSelection}
                                    dataSource={productOrderList}
                                    columns={columns}
                                    loading={this.state.loading}
                                    bordered={bordered}
                                    size={size}
                                    scroll={scroll}
                                    // pagination={pagination}
                                    // hideDefaultSelections={true}
                                    // size={this.state.tableSize}
                                    // scroll={{ x:1500 }}
                                    // onExpand={this.handleExpand}
                                /> */}
                                <SimpleTable
                                    expandedRowRender={this.renderSubTable}
                                    // rowSelection={rowSelection}
                                    // isHaveSelect={false}
                                    loading={loading}
                                    data={Data}
                                    columns={columns}
                                    bordered={bordered}
                                    size={size}
                                    // scroll={{x:1300}}
                                    // scroll={{x:900}}
                                    onChange={this.handleTableChange}
                                />
                            </div>:
                            <TaskView
                                // data={localdata}
                                data={this.state.DevTaskList}
                                height={900}
                                colors={['#6a6a6a','#0acb2e','#120dee','#e31111']}
                                values={['离线', '待机','运行','警告']}
                            />
                        }
                        <CModal FormItem={UFormItem} updateItem={updateFromItem} submit={this.handleUpdate.bind(this)} isShow={UModalShow} hideForm={this.toggleUModalShow.bind(this)}/>
                        <CModal title="任务排程" FormItem={SFormItem} updateItem={updateFromItem} submit={this.handleSchedul.bind(this)} isShow={SModalShow} hideForm={this.toggleSModalShow.bind(this)}/>
                        <CModal FormItem={BSFormItem} handleType="schedul" updateItem={updateFromItem} submit={this.handleBSchedul.bind(this)} isShow={BSModalShow} hideForm={this.toggleBSModalShow.bind(this)}/>
                    </div>
                </Spin>
            </PageHeaderLayout>
        )
    }
}
