/**
 *这是设备列表页
 *添加日期:2017.12.06
 *添加人:shaw
 **/
/******引入ant或其他第三方依赖文件*******************/
import moment from 'moment';
import React, { Component } from 'react';
import { Button, Radio, Row, Col, Divider, List, Timeline, Menu, Card,
    DatePicker,Select ,message,Form,Spin} from 'antd';
import { TPostData, urlBase } from '../../utils/TAjax';
import StatusOverview from './components/statusOverview';
import TimeLine from './components/timeLine';
import TimeLineBar from './components/timeLinebar';
import Mock from 'mockjs';
import ReactEcharts from 'echarts-for-react';
import PageHeaderLayout from 'base/PageHeaderLayout';
const FormItem = Form.Item;
const Option = Select.Option;


let sess_info=sessionStorage.getItem('userinfo');

export default class Dev_running_record extends Component {

    constructor( props ) {
        super( props )
        this.state = {
            server: this.props.server,
            loading: true,
            HistoryListTLBar:[],
            HistoryList:[],
            StatList:[],
            workshopList: [],
            workCenterList: [],
            Dailychart: {},
            cardContent: 'timeLine',
            WSUUID:'1',
            WCUUID:'-1',
            WorkshopID:'-1',
            RDate:moment().format('YYYY.MM.DD'),
            // authInfo:this.props.userInfo
            authInfo:JSON.parse(sess_info),
        }
    }

    componentWillMount() {
        // this.getRunningRecord();
        // console.log('destroy',message);
        this.getWorkshopList();
        this.getWorkCenterList();
        this.setDefaultWS();
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
                        value: item.UUID,
                        Name: item.Name,
                    } )
                    // list.push( item.Name );
                } );
                list.sort((a,b)=>(a.value-b.value));
                this.setState( { workCenterList: list, } )
            },
            ( error ) => {
                message.info( error );
            }
        )
    }

    handleMenuClick( { item, key, keyPath } ) {
        console.log( "点击菜单之后", item, key, keyPath );
        // this.getWorkCenter(key);
    }

    handleToggle = ( e ) => {
        // this.setState({ size: e.target.value });
        console.log( e.target.value );
        if ( e.target.value == "overView" ) this.setState( { cardContent: "overView" } );
        else if ( e.target.value == "timeLine" ) this.setState( { cardContent: "timeLine" } );
    }

    handleFormReset = () => {
        this.props.form.resetFields();
        return false;
        // this.props.submit();
        // this.handleSearch();
    }

    handleSearch = (e) => {
        this.props.form.validateFields((errors, values) => {
            console.log("表单查询值",values);
            e.preventDefault();
            if (!!errors) {
                console.log('Errors in form!!!');
                message.error('添加失败');
                return false;
            } else {
                // this.props.submit(values);
                const {WSUUID,WCUUID,RDate}=values;
                this.setState({loading:true,WSUUID,WCUUID,RDate:RDate.format("YYYY.MM.DD")},()=>{
                    console.log('WSUUID,WCUUID,RDate',this.state.RDate);
                    this.getRunningRecord();
                });
                return false;
            }
        });
    }

    handleChange=(value)=>{
        this.setState({WSUUID:value},()=>{
            this.getWorkCenterList();
        })
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
        this.setState({WSUUID:DefaultUUID},()=>this.getRunningRecord());
    }


    render() {
        const{HistoryListTLBar,HistoryList,StatList,RDate,WSUUID}=this.state;
        // console.log( "工作中心列表是:",this.state.workCenterList );
        const defaultSelectedWS=(()=>{
            let wsList=this.state.workshopList,
                defaultValue='';
            if(wsList.length){
                defaultValue=wsList[0].hasOwnProperty('UUID')?wsList[0].UUID:'-1'
            }
            else{
                defaultValue='-1';

            }
            return defaultValue;
        })();

        const toggleView=this.state.cardContent;

        const formItemLayout = {
          labelCol: {
            xs: { span: 24 },
            sm: { span: 8 },
          },
          wrapperCol: {
            xs: { span: 24 },
            sm: { span: 16 },
          },
        };

        const {form:{getFieldDecorator}}=this.props;

        const bcList = [{
            title:"首页",
            href: '/',
            }, {
            title: '报表中心',
            href: '/',
            }, {
            title: '车间设备装态',
        }];

        return (
            <PageHeaderLayout title="车间设备装态" wrapperClassName="pageContent" BreadcrumbList={bcList}>
                <div className="cardContent">
                    <Spin spinning={this.state.loading}>
                        <Card>
                            <Form onSubmit={this.handleSearch} layout="inline">
                                <Row gutter={16}>
                                    <Col className="gutter-row" span={7}>
                                        <div className="gutter-box">
                                            <FormItem label="车间" key="drws">
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
                                    <Col className="gutter-row" span={7}>
                                        <div className="gutter-box">
                                            <FormItem label="工作中心" key="drwc">
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
                                    <Col className="gutter-row" span={6}>
                                        <div className="gutter-box">
                                            <FormItem label="日期" key="drdate">
                                              {getFieldDecorator("RDate",{initialValue:moment(RDate)})(
                                                  <DatePicker showTime format="YYYY/MM/DD" />
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
                        <div style={{margin:'20px 0'}}>
                            <Radio.Group value={toggleView}  onChange={this.handleToggle}>
                                <Radio.Button value="timeLine">时间轴</Radio.Button>
                                <Radio.Button value="overView">时间统计</Radio.Button>
                            </Radio.Group>
                        </div>
                        {
                            this.state.cardContent=="timeLine"?
                            // <TimeLine data={HistoryList} lineLabelList={this.state.workCenterList} />:
                            <TimeLineBar data={HistoryListTLBar} />:
                            <StatusOverview data={StatList} workCenterList={this.state.workCenterList} />
                        }
                    </Spin>
                </div>
            </PageHeaderLayout>
        )
    }
}
Dev_running_record = Form.create()(Dev_running_record);
