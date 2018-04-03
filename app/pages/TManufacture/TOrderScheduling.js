import React, {Component} from 'react';
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
    Popconfirm
} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const ButtonGroup = Button.Group;
import {TPostData, urlBase} from '../../utils/TAjax';
import {CModal} from '../../components/TModal';
import styles from './common.less';
import TableExport from 'tableexport';

export default class TstateTimeOverview extends Component {

    constructor(props) {
        super(props)
        this.state = {
            title: props.title,
            LotList: [],
            BSLotList: [],
            dispatchLotList: [],
            ProModelList: [],
            ProModelSList: [],
            WorkCenterList: [],
            selectedRow: [],
            selectedRowKeys: [],
            selectedProductID: -1,
            updateFromItem: {},
            defaultBSLotList: [],
            defaultBSNumber: 0,
            loading: true,
            CModalShow: false,
            UModalShow: false,
            SModalShow: false,
            BSModalShow: false,
            LotState: '-1',
            ProModelID: '-1',
            keyWord: '',
            bordered: false,
            size: "small",
            subTableSize: "default",
            scroll: undefined,
            hasAddBtn:false
        }
        this.url = '/api/tmanufacture/manufacture';
    }

    componentWillMount() {
        this.getLotlist();
        this.getSubTableData();
        this.getProModelList();
        this.getWorkCenterList();
    }

    componentDidMount() {}

    getLotlist() {
        const {ProModelID, keyWord, LotState} = this.state;
        console.log("查询条件：", ProModelID, keyWord, LotState);
        var dat = {
            PageIndex: 0,
            PageSize: -1,
            ProductOrderUUID:-1,
            ProductModelUUID: ProModelID, //产品型号UUID
            Status: parseInt(LotState), //生产订单状态
            KeyWord: this.keyWordInput
                ? this.keyWordInput.input.value
                : ''
        }
        TPostData('/api/tmanufacture/manufacture', "ListLot", dat, (res) => {
            console.log('查询到子订单列表', res);
            var list = [],
                Ui_list = res.obj.objectlist || [],
                totalCount = res.obj.totalcount;
            Ui_list.forEach(function(item, index) {
                list.push({
                    key: item.UUID, UUID: item.UUID, //加工订单UUID
                    ProductOrderUUID: item.ProductOrderUUID, //生产订单UUID
                    strID: item.ID, //加工订单ID
                    strDesc: item.Desc, //加工订单描述
                    strNote: item.Note, //加工订单备注
                    BomUUID: item.BomUUID, //BOM UUID
                    MoldModelUUID: item.MoldModelUUID, //模具型号UUID
                    ProductModelUUID: item.ProductModelUUID, //产品型号UUID
                    strProductModelName: '---',
                    strWorkstationName: '---',
                    strPlanNumber: item.PlanNumber, //计划产量
                    strScheduleNumber: item.ScheduleNumber,
                    strFinishNumber: item.FinishNumber, //完成产量
                    strRejectNumber: item.RejectNumber, //不良产量
                    // strPlanStartDateTime: item.PlanStartDateTime, 计划开始时间
                    strPlanStartDateTime: '2018-02-11', //计划开始时间
                    // strStartDateTime: item.StartDateTime, 实际开始时间
                    strStartDateTime: '2018-02-14', //实际开始时间
                    strPlanDeliverDateTime: item.PlanDeliverDateTime
                        ? item.PlanDeliverDateTime
                        : '2018-04-23', //计划交付时间
                    strDeliverDateTime: item.DeliverDateTime
                        ? item.DeliverDateTime
                        : '-', //实际交付时间
                    strUpdateDateTime: item.UpdateDateTime, //加工订单更新时间
                    strStatus: item.Status, //状态：0 - 取消，1 - 未投产，2 - 生产中， 3 - 完成，4 - 暂停
                    strBomID: item.BomID, //BOM ID
                    strBomName: item.BomName
                        ? item.BomName
                        : '-', //BOM名称
                    strProductOrderID: item.ProductOrderID
                        ? item.ProductOrderID
                        : '-', //生产订单ID
                    strProductOrderName: item.ProductOrderName
                        ? item.ProductOrderName
                        : '-', //生产订单名称
                })
            });
            this.setState({LotList: list, loading: false});
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
                console.log("btn",children);
                console.log("childNodes",childNodes);
                btnWrap.appendChild(children);
            }
            this.setState({hasAddBtn:true});
        }, (error) => {
            message.info(error);
        });
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
            PageIndex: 0, //分页页序
            PageSize: -1, //每页数量
            LotUUID: -1, //生产订单UUID
            // LotUUID: record.UUID, 生产订单UUID
            Status: -1, //生产调度单状态
            KeyWord: "" //模糊查询条件
        }
        TPostData(this.url, "ListLotJob", dat, (res) => {
            console.log('查询到派工单列表:', res.obj.objectlist);
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

    getWorkCenterList() {
        let dat = {
            'PageIndex': 0,
            'PageSize': -1,
            'TypeUUID': -1
        }

        TPostData('/api/TProcess/workcenter', "ListActive", dat, (res) => {
            var list = [];
            var Ui_list = res.obj.objectlist || [];
            console.log('查询到工作中心列表', Ui_list);
            // var totalcount = res.obj.objectlist.length;
            // creatKeyWord = res.obj.objectlist.length;
            Ui_list.forEach((item, index) => {
                list.push({key: index, value: item.UUID.toString(), text: item.Name})
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

    renderSubTable(record, e2, e3) {
        // this.setState({loading:true});
        let list = [];
        const {dispatchLotList} = this.state;
        console.log("record", record);
        // console.log("dispatchLotList",dispatchLotList);
        const subcolumns = [
            {
                title: '派工单号',
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
                        ? (<span>生产取消(0)</span>)
                        : e1 == 1
                            ? (<span>未派工(1)</span>)
                            : e1 == 2
                                ? (<span>已派工(2)</span>)
                                : e1 == 3
                                    ? (<span>生产中(3)</span>)
                                    : e1 == 4
                                        ? (<span>生产挂起(4)</span>)
                                        : e1 == 5
                                            ? (<span>生产完成(5)</span>)
                                            : e1 == 6
                                                ? (<span>生产中(6)</span>)
                                                : e1 == 9
                                                    ? (<span>生产挂起(9)</span>)
                                                    : e1 == 10
                                                        ? (<span>已完成(10)</span>)
                                                        : e1 == 11
                                                            ? (<span>暂停中(11)</span>)
                                                            : <span>{e1}</span>
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

        dispatchLotList.forEach((item, index) => {
            console.log("dispatchLotUUID", item.LotUUID);
            if (item.LotUUID == record.UUID) {
                list.push(item);
            }
        })

        return (<Table columns={subcolumns} dataSource={list} bordered={false} pagination={false}
            // rowSelection={this.state.isSelection?rowSelection:null}

            // loading={this.state.loading}
            size={this.state.size}/>);
    }

    toggleCModalShow() {
        this.setState({
            CModalShow: !this.state.CModalShow
        });
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
        this.setState({
            SModalShow: !this.state.SModalShow,
            updateFromItem: record
        });
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

    handleCreat(data) {
        console.log('data', data);
        let dat = {
            key: '1000',
            ID: data.ID, //订单编号
            // Name: data.Name, 订单名称
            Name: '--', //订单名称
            ProductModelUUID: data.ProductModelUUID, //产品型号UUID
            PlanNumber: data.Number, //计划产量
            PlanDeliverTime: data['date-picker'] //计划交期
        }
        TPostData('/api/tmanufacture/manufacture', "AddProductOrder", dat, (res) => {
            //这块请求更新数据 成功回调
            // callback( dat );
            this.getProductOrder()
        })
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
            this.getLotlist();
            message.success('更新成功');
        }, (err) => {
            console.log('err', err);
            message.error('更新失败');
        })
    }

    handleSchedul(data) {
        const {updateFromItem} = this.state;
        // console.log("批量排程数据",updateFromItem,selectedRow,selectedRowKeys);

        let dat = {
            PlanNumber: data.Number, //排程产量
            ID: data.dispatchID,
            WorkstationUUID: data.WorkstationUUID, //工作中心UUID
            // MoldModelUUID: data.MoldModelUUID, 模具型号
            PlanStartDateTime: data.PlanStartTime.format('YYYY-MM-DD hh:mm:ss'), //排程开始时间
            PlanFinishDateTime: data.PlanFinishTime.format('YYYY-MM-DD hh:mm:ss'), //排程结束时间[]
            LotList: [updateFromItem.UUID]
            // LotList: data.taskNuber?data.taskNuber:[data.UUID]
        }
        // console.log("表单数据",data);
        // console.log( '看看dat', dat );

        TPostData(this.url, "Schedule", dat, () => {
            message.success('排程成功!');
            this.getLotlist();
            this.getSubTableData();
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

    handleProChange(ele) {
        this.setState({ProModelID: ele});
    }

    handleStatusChange(ele) {
        this.setState({LotState: ele});
    }

    handleCancel(data) {
        console.log("取消排产的Data", data);
        let dat = {
            UUID: data.UUID, //订单UUID
        }
        TPostData(this.url, "UndoSchedule", dat, (res) => {
            message.success("暂停排产成功！")
            this.getLotlist();
            this.getSubTableData();
        }, (err) => {
            message.error("暂停排产失败！")
        })
    }

    handleRetrieve() {
        const {ProModelID, keyWord, LotState} = this.state;
        console.log('查询', ProModelID, this.keyWordInput.input.value, LotState);
        this.setState({keyWord: this.keyWordInput.input.value});
        this.getLotlist();
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

    render() {

        const {
            LotList,
            BSLotList,
            ProModelList,
            ProModelSList,
            WorkCenterList,
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
            scroll
        } = this.state;

        // ProModelList.map((item,index)=>({key: index,value:item.UUID.toString(), text: item.Name}))
        const columns = [
            {
                title: '生产任务单',
                dataIndex: 'strID',
                type: 'string'
            }, {
                title: '产品名称',
                dataIndex: 'strProductModelName',
                key: 'BNum'
            },
            /*{
                title: '工作中心',
                dataIndex: 'strWorkstationName',
                key: 'WorkstationName',
            },*/
            /*{
              title: 'BOM单',
              dataIndex: 'strBomName',
              type: 'string'
            },*/
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
            }, {
                title: '已排数量',
                dataIndex: 'strScheduleNumber',
                type: 'string'
            },
            /*{
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
            },*/
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
                    let status = '';
                    status = e1 == 0
                        ? (<span>已取消(0)</span>)
                        : e1 == 1
                            ? (<span>未排产(1)</span>)
                            : e1 == 2
                                ? (<span>排产中(2)</span>)
                                : e1 == 3
                                    ? (<span>已排产(3)</span>)
                                    : e1 == 4
                                        ? (<span>暂停中(4)</span>)
                                        : e1 == 5
                                            ? (<span>已完成(5)</span>)
                                            : e1 == 6
                                                ? (<span>生产中(6)</span>)
                                                : e1 == 9
                                                    ? (<span>生产挂起(9)</span>)
                                                    : e1 == 10
                                                        ? (<span>已完成(10)</span>)
                                                        : e1 == 11
                                                            ? (<span>暂停中(11)</span>)
                                                            : <span>{e1}</span>
                    return status;
                }
            }, {
                title: '操作',
                dataIndex: 'uMachineUUID',
                type: 'operate', // 操作的类型必须为 operate
                multipleType: "Scheduling",
                render: (e1, record, e3) => {
                    // console.log("record",record);
                    let operate = '';
                    if (record.strStatus && record.strStatus == 1) {
                        operate = (<span>
                            <a onClick={this.toggleSModalShow.bind(this, record)} href="#">排产</a>
                        </span>)
                    } else if (record.strStatus && record.strStatus == 2) {
                        operate = (<span>
                            <a onClick={this.toggleSModalShow.bind(this, record)} href="#">排产</a>
                            {/* <span className="ant-divider"></span>
                                <Popconfirm
                                    placement="topLeft"
                                    title="确定取消排产？"
                                    onConfirm={this.handleCancel.bind(this,record)}
                                    okText="确定" cancelText="取消">
                                    <a href="#">取消排产</a>
                                </Popconfirm> */
                            }
                        </span>)
                    } else if (record.strStatus && record.strStatus == 4) {
                        /*operate=(
                            <span>
                                <Popconfirm
                                    placement="topLeft"
                                    title="确定取消排产？"
                                    onConfirm={this.handleCancel.bind(this)}
                                    okText="确定" cancelText="取消">
                                    <a href="#">取消排产</a>
                                </Popconfirm>
                            </span>
                        )*/
                    } else
                        operate = (<span>无</span>);
                    return operate;
                    // <a href="#" onClick={this.toggleUModalShow.bind(this,e2)}>编辑</a>
                    // <a href="#" onClick={this.toggleSModalShow.bind(this,e2)}>排产</a>
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
                type: 'string',
                placeholder: '请输入排程产量',
                rules: [
                    {
                        required: true,
                        message: '请输入排程产量'
                    }
                ]
            }, {
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
            },
            /*{
                name: 'Date',
                label: '日期',
                type: 'RangePicker',
                placeholder: '请输入计划产量',
            }*/
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

        return (
            <div>
                <Card >
                    <Row gutter={16}>
                        <Col className="gutter-row" span={6}>
                            <div className="gutter-box">
                                <span style={{width: "40%"}}>搜索内容:</span>
                                <Input style={{width: "60%"}} ref={(input) => {this.keyWordInput = input;}} placeholder="请输入搜索内容"/>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={6}>
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
                        <Col className="gutter-row" span={6}>
                            <div className="gutter-box">
                                <span style={{width: "40%"}}>订单状态:</span>
                                <Select defaultValue="-1" style={{width: "60%"}} onChange={this.handleStatusChange.bind(this)}>
                                    <Option value="-1" key="all">全部</Option>
                                    <Option value="0" key="0">已取消</Option>
                                    <Option value="1" key="1">未排产</Option>
                                    <Option value="2" key="2">排产中</Option>
                                    <Option value="3" key="3">已排产</Option>
                                    <Option value="4" key="4">暂停中</Option>
                                    <Option value="5" key="5">已完成</Option>
                                </Select>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={6}>
                            <div className="gutter-box">
                                <Button onClick={this.getLotlist.bind(this)} type="primary" icon="search">查询</Button>
                            </div>
                        </Col>
                    </Row>
                    {
                        selectedRow.length
                            ? <div>
                                    <Divider>批量操作</Divider>
                                    {
                                        selectedRow.map((tag, index) => {
                                            // const isLongTag = tag.length > 20;
                                            const tagElem = (<Tag key={tag.UUID} closable="closable" afterClose={() => this.handleClose(tag)}>
                                                {/* {isLongTag ? `${tag.slice(0, 20)}...` : tag} */}
                                                {tag.strID}
                                            </Tag>
                                            /*  <Tag key={tag} closable={index !== 0} afterClose={() => this.handleClose(tag)}>
                                                {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                                                </Tag> */);
                                            return tagElem;
                                            // return isLongTag ? <Tooltip title={tag} key={tag}>{tagElem}</Tooltip> : tagElem;
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
                </Card>
                <div style={{margin: 20,overflow:'auto',zoom:1}}>
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
                <div id="lotListTableWrap">
                    <Table
                        expandedRowRender={this.renderSubTable.bind(this)}
                        rowSelection={rowSelection}
                        dataSource={LotList}
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
                    />
                </div>
                <CModal FormItem={UFormItem} updateItem={updateFromItem} submit={this.handleUpdate.bind(this)} isShow={UModalShow} hideForm={this.toggleUModalShow.bind(this)}/>
                <CModal FormItem={SFormItem} updateItem={updateFromItem} submit={this.handleSchedul.bind(this)} isShow={SModalShow} hideForm={this.toggleSModalShow.bind(this)}/>
                <CModal FormItem={BSFormItem} handleType="schedul" updateItem={updateFromItem} submit={this.handleBSchedul.bind(this)} isShow={BSModalShow} hideForm={this.toggleBSModalShow.bind(this)}/>
            </div>
        )
    }
}
