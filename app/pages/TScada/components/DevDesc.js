/**
 *这是设备监控详情页
 *添加日期:2018.08.27
 **/
/******引入ant或其他第三方依赖文件*******************/
import moment from 'moment';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Layout,Table,Card,Row,Col,Progress,Divider,Tag,Tabs ,Spin,List,message} from 'antd';
const TabPane = Tabs.TabPane;
import { TPostData,urlBase,TAjax } from 'utils/TAjax';
import StatusOverview from '../../TReport/components/statusOverview';
import TimeLineBar from '../../TReport/components/timeLinebar';
import NumGauge_B from '../../TReport/components/NumGauge/NumGauge_B';
import NumGauge_S from '../../TReport/components/NumGauge/NumGauge_S';
import { BarTimeLine } from 'components/BCComponents/Charts';

export default class TScadaInjectionWorkshop extends Component {

    constructor( props ) {
        super( props )
        this.state = {
            detailID:0,
            detailMessage:{},
            loading: true,
            HistoryListTLBar:[],
            HistoryList:[],
            StatList:[],
            WSUUID:'-1',
            WCUUID:this.props.UUID?this.props.UUID:'-1',
            WorkshopID:'-1',
            OEEDataWS:{},
            OEEData:{},
            workOrderList:[],
            RDate:moment().format('YYYY.MM.DD'),
            StartDate:moment((new Date().getTime()) - (1000 * 60 * 60 * 24*30)).format("YYYY.MM.DD"),
            EndDate:moment((new Date().getTime()) + (1000 * 60 * 60 * 24*30)).format("YYYY.MM.DD"),
            // authInfo:this.props.userInfo
        }
    }
    //查询工作中心
    componentWillMount() {
        this.getRunningRecord();
        this.getOEEReport();
        this.getProReport();
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    setCurrentRecord(){
        const {WSUUID,WCUUID,RDate}=this.state;
        let DataList=this.props.mqttData;

        DataList.forEach((item,index)=>{
            if ( item.UUID == WCUUID ){
                this.setState({mqtt})
            }
        })

        // let DataList=this.props.mqttData;
        let devRecord=DataList.filter((item)=>item.UUID==WCUUID);

    }

    getRunningRecord(){
        const {WSUUID,WCUUID,RDate}=this.state;

        const fnStatusHistory=(arr)=>{
            let A_data=arr.map((item)=>{
                return{
                    index : item.index,                       //顺序，从0开始
                    StartTime : item.StartTime,       // 起始时间
                    EndTime :item.EndTime,        // 结束时间
                    // min:item.min,
                    min:item.Period,
                    Status : item.Status,
                    type:item.Status==-1?'OffLine':
                         item.Status==0?'standby':
                         item.Status==1?'run':
                         item.Status==2?'waring':''
                }
            });
            return A_data.sort((a,b)=>(a.index-a.index))
        }

        const dat ={
            WorkshopUUID : WSUUID,
            WorkstationUUID : WCUUID,
            Date : RDate
        }
        /*  message.loading('Action in progress..', 2.5)
            .then((e) =>{
                console.log('e',e);
                message.success('Loading finished', 2.5)
            })
            .then(() => message.info('wanc', 2.5));*/

        // TPostData( '/api/TReport/device_report/GetWorkshopDayTrackReport', "GetWorkshopDayTrackReport", dat,
        TPostData( '/api/TReport/device_report', "GetWorkshopDayTrackReport", dat,
            ( res ) => {
                console.log( "查询到运行状态数据", res );
                let StatList = [],
                    HistoryList=[],
                    HistoryListTLBar=[],
                    Stat_List=res.obj.objectlist.StatusStatList,
                    History_List=res.obj.objectlist.StatusHistoryList,
                    History_List_tlbar=res.obj.objectlist.StatusHistoryList;

                if(res.err==0){
                    History_List.forEach( ( item, index ) => {
                        HistoryList.push( {
                            key: index,
                            UUID: item.WorkstationUUID,
                            Name: item.WorkstationName,
                            Number: item.ID,
                            StatusHistory:Array.isArray(item.StatusHistory)?fnStatusHistory(item.StatusHistory):[]
                        } )
                    } );

                    History_List_tlbar.forEach( ( item, index ) => {
                        let StatusHistory=item.StatusHistory;

                        if(StatusHistory&&StatusHistory.length){
                            StatusHistory.forEach((a,b)=>{
                                if(a.Period==0) return;
                                HistoryListTLBar.push({
                                    uuid:item.WorkstationUUID,
                                    task: item.WorkstationName,
                                    ID: item.WorkstationID,
                                    startTime:this.state.RDate+'  '+a.StartTime,
                                    endTime:this.state.RDate+'  '+a.EndTime,
                                    status:a.Status,
                                    Period:a.Period,
                                    field:a.Status==-1?'离线':
                                            a.Status==0?'待机':
                                            a.Status==1?'运行':
                                            a.Status==2?'告警':'其他'
                                })
                            })
                        }
                        else{
                            HistoryListTLBar.push({
                                uuid:item.WorkstationUUID,
                                task: item.WorkstationName,
                                ID: item.WorkstationID,
                                startTime:this.state.RDate,
                                endTime:this.state.RDate,
                                status:3,
                                field:''
                            })
                        }
                    } );

                    Stat_List.forEach( ( item, index ) => {
                        StatList.push( {
                            'key': index,
                            uuid:item.WorkstationUUID,
                            'WorkstationUUID' :item.WorkstationUUID,
                            'State':item.WorkstationName,
                            '总时间':item.TotalTime,
                            '离线时间':item.OfflineTime,
                            '待机时间':item.ReadyTime,
                            '运行时间':item.RunningTime,
                            '告警时间':item.WarningTime
                        } )
                    } );

                    HistoryListTLBar.sort((a,b)=>(b.uuid-a.uuid));
                    StatList.sort((a,b)=>(b.uuid-a.uuid));
                    this.setState( {HistoryList,HistoryListTLBar,StatList,loading:false },()=>{
                        console.log('HistoryListTLBar',this.state.HistoryListTLBar);
                        console.log('HistoryList',this.state.HistoryList);
                        console.log('StatList',this.state.StatList)
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
        )

    }

    getOEEReport(){
        const {WSUUID,WCUUID,RDate}=this.state;

        const dat ={
            WorkshopUUID : WSUUID,
            WorkstationUUID : WCUUID,
            Date : RDate
        }

        // TPostData( '/api/TReport/device_report/GetOEEReport', "GetOEEReport", dat,
        TPostData( '/api/TReport/device_report', "GetOEEReport", dat,
            ( res ) => {
                console.log( "查询到设备综合效率数据", res );
                var data_list = res.obj.objectlist || [],
                    OEEDataList=[],
                    OEEDataWS={};

                if(res.err==0){
                    data_list.forEach( ( item, index ) => {
                        if(item.WorkstationUUID=='-1'){
                            OEEDataWS=item;
                        }
                        else{
                            OEEDataList.push( {
                                key: index,
                                WorkshopUUID :item.WorkshopUUID,
                                WorkstationUUID :item.WorkstationUUID,
                                WorkshopName :item.WorkshopName,
                                WorkcenterName :item.WorkstationName,
                                TotalTime :item.TotalTime,
                                OfflineTime :item.OfflineTime,
                                ReadyTime :item.ReadyTime,
                                RunningTime :item.RunningTime,
                                WarningTime :item.WarningTime,
                                OEE :parseFloat(item.OEE).toFixed(2),
                                PRate :parseFloat(item.PRate).toFixed(2),
                                ARate :parseFloat(item.ARate).toFixed(2),
                                QRate :parseFloat(item.QRate).toFixed(2),
                            } )
                        }
                    } )
                    this.setState( { OEEDataList,OEEDataWS,loading:false},()=>console.log('OEEDataList',OEEDataList) );
                    if(Array.isArray(OEEDataList)&&OEEDataList.length==1){
                        let data=OEEDataList[0];
                        let OEEData={
                            OEE :parseFloat(data.OEE),
                            PRate :parseFloat(data.PRate),
                            ARate :parseFloat(data.ARate),
                            QRate :parseFloat(data.QRate),
                        }
                        this.setState({OEEData:OEEData})
                    }
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

    getDispatchLotList() {
        const {
            current,
            pageSize,
            ProModelID,
            WorkshopID,
            keyWord,
            dispatchLotState,
            StartDate,
            EndDate
        } = this.state;

        // console.log('查询',keyWord,dispatchLotState);

        var dat = {
            PageIndex: 0,                       // 分页参数
            PageSize: -1,             // 分页参数
            // ProductOrderUUID: 1,       // 生产订单UUID
            ProductOrderUUID: -1,       // 生产订单UUID
            ProductModelUUID: -1,      // 生产订单产品型号UUID
            ProductModelID:-1,
            WorkshopUUID: -1,            // 车间UUID
            WorkstationTypeUUID: -1, // 工作中心类型UUID
            WorkstationUUID: -1,         // 工作中心UUID
            MoldUUID: -1,                    // 模具UUID
            Status:-1,   // 派工单状态
            StartDate:StartDate,
            EndDate:EndDate,
            KeyWord: ''// 模糊查询                                                        // 是否插单
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
                    this.setState({workOrderList:list,loading:false});
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

    getProReport(){
        const {WSUUID,WCUUID,StartDate,RDate}=this.state;

        const dat ={
            WorkshopUUID : WSUUID,
            WorkstationUUID : WCUUID,
            ProductUUID : -1,
            StartDay : StartDate,
            EndDay : RDate,
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

    callback(key) {
      console.log(key);
    }

    render() {
        const{
            HistoryListTLBar,
            StatList,
            WSUUID,
            WCUUID,
            OEEData:{
                PRate=65,
                ARate=15,
                QRate=90,
                OEE=45,
                WorkshopName='未指定车间'
            },
            productionReport
        }=this.state;
        const {DetailMes,mqttData}=this.props;
        let DataList=this.props.mqttData;
        let devRecord=DataList.filter((item)=>item.UUID==WCUUID);
        devRecord=Array.isArray(devRecord)&&devRecord.length==1?devRecord[0]:{};
        console.log('DataList',DataList,devRecord)

        console.log('detailMessage',DetailMes);
        let colorsValues = ['离线', '待机','运行','警告'];
        let colors=['#6a6a6a','#0acb2e','#120dee','#e31111'];
        let stateObj={},
            Percent=parseFloat(((devRecord.prod_count/devRecord.plan )*100|| 0).toFixed(2));
        Percent=Percent>100?100:Percent;
        if(devRecord.task_progress &&devRecord.task_progress >= 100)
            stateObj={text:"已完成",color:'blue'};
        else if(devRecord.hasOwnProperty('Status')&&devRecord.Status== 1)
            stateObj={text:"生产中",color:'rgba(82, 196, 26, 0.84)'};
        else if(devRecord.hasOwnProperty('Status') &&devRecord.Status== 2)
            stateObj={text:"报警中",color:'#d52c21'};
        else if(devRecord.hasOwnProperty('Status')&&devRecord.Status== 0)
            stateObj={text:"待机中",color:'#4184de'};
        // else if(item.hasOwnProperty('Status')&&item.Status== -1)
        else
            stateObj={text:"离线中",color:'#8a8686'};

        //OEE
        const NGauge1={
            height:200,
            // height:103,
            percent:[{ value: OEE }],
            TArcData:{start:[ 0, 0.965 ],end:[ OEE, 0.965 ]},
            polarData:{
                type:'polar',
                // startAngle:-35,
                startAngle:-9 / 8 * Math.PI,
                endAngle:1 / 8 * Math.PI,
                radius:0.65
            },
            polarTitle:{
                title:'OEE',
                textStyle:'font-size:1.75em;color:rgba(0,0,0,0.43);margin: 0'
            }
        }
        //时间稼动率
        const NGauge2={
            height:200,
            percent:[{ value:ARate}],
            TopArcData:{start:[ 0, 0.965 ],end:[ ARate, 0.965 ]},
            ArcWidth:12,
            pointerWidth:2,
            polarData:{
                type:'polar',
                // startAngle:-35,
                startAngle:-9 / 8 * Math.PI,
                endAngle:1 / 8 * Math.PI,
                radius:0.50
            },
            polarTitle:{
                title:'时间稼动率',
                textStyle:'font-size:1.25em;color:rgba(0,0,0,0.43);margin: 60px 0',
                // valueStyle:'font-size:1.25em;color:rgba(0,0,0,0.43);margin: 0'
            }
        }
        //性能稼动率
        const NGauge3={
            height:200,
            percent:[{ value: PRate }],
            TopArcData:{start:[ 0, 0.965 ],end:[ PRate, 0.965 ]},
            ArcWidth:12,
            polarData:{
                type:'polar',
                // startAngle:-35,
                startAngle:-9 / 8 * Math.PI,
                endAngle:1 / 8 * Math.PI,
                radius:0.5
            },
            polarTitle:{
                title:'性能稼动率',
                textStyle:'font-size:1.25em;color:rgba(0,0,0,0.43);margin: 40px 0',
            }
        }
        //良品率
        const NGauge4={
            height:200,
            percent:[{ value: QRate }],
            TopArcData:{start:[ 0, 0.965 ],end:[ QRate, 0.965 ]},
            ArcWidth:12,
            polarData:{
                type:'polar',
                // startAngle:-35,
                startAngle:-9 / 8 * Math.PI,
                endAngle:1 / 8 * Math.PI,
                radius:0.5
            },
            polarTitle:{
                title:'良品率',
                textStyle:'font-size:1.25em;color:rgba(0,0,0,0.43);margin: 40px 0',
            }
        }

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

        return (
            <div style={{marginTop:15}}>
                <div>
                    <p>
                        <span style={{fontSize:20,fontWeight:'bold'}}>{DetailMes.Name}</span>
                        <span style={{marginLeft:10}}>{DetailMes.ID}</span>
                    </p>
                    <Row>
                        <Col span={6}>
                            <img src={urlBase+DetailMes.Image} style={{width:"100%"}} />
                        </Col>
                        <Col span={3}></Col>
                        <Col span={12}>
                            {/* <p>订单号:</p> */}
                            <p>产品编码:{devRecord.product?devRecord.product:'-'}</p>
                            <p>产量(pcs):{devRecord.prod_count?devRecord.prod_count:'-'}</p>
                            <p>产能(pcs/min):{devRecord.prod_rate?devRecord.prod_rate:'-'}</p>
                            <div ><Tag
                                color={`${stateObj.color}`}
                                style={{fontSize: 'larger'}}>{stateObj.text}</Tag></div>
                            <div style={{marginTop:20}}><Progress
                                // type="dashboard"
                                // width={25}
                                // percent={parseFloat(((item.prod_count/item.plan )*100|| 0).toFixed(2))}
                                percent={Percent}
                                strokeWidth={25}/></div>
                        </Col>
                    </Row>
                </div>
                <Divider/>
                <div>
                    <Tabs defaultActiveKey="1" onChange={this.callback}>
                      <TabPane tab="运行状态时间轴" key="1">
                          {/* <TimeLineBar data={HistoryListTLBar} /> */}
                          <BarTimeLine
                              height={200}
                              data={HistoryListTLBar}
                              colors={colors}
                              values={colorsValues}
                           />
                      </TabPane>
                      <TabPane tab="时间统计" key="2">
                        <StatusOverview data={StatList} height={200} />
                      </TabPane>
                      <TabPane tab="OEE" key="3">
                        <div style={{height:250}}>
                            <Row>
                                <Col span={6} style={{border:'solid 0px'}}>
                                    <NumGauge_B
                                        {...NGauge1}
                                    />
                                </Col>
                                <Col span={6}>
                                    <div style={{border:'solid 0px'}}>
                                        <NumGauge_S
                                            {...NGauge2}
                                        />
                                    </div>
                                </Col>
                                <Col span={6}>
                                    <NumGauge_S
                                        {...NGauge3}
                                    />
                                </Col>
                                <Col span={6}>
                                    <NumGauge_S
                                        {...NGauge4}
                                    />
                                </Col>
                            </Row>
                        </div>
                      </TabPane>
                      <TabPane tab="生产报表" key="4">
                      <Table
                          columns={columns}
                          dataSource={productionReport}
                          // dataSource={productData}
                          // dataSource={this.state.dispatchingList}
                          bordered={true}
                          size="small"
                          scroll={{x:1300}}
                      />
                      </TabPane>
                    </Tabs>
                </div>
            </div>
        )
    }
}
