import moment from 'moment';
import Mock from 'mockjs';
// import ReactEcharts from 'echarts-for-react';
import React, { Component } from 'react';
import { message,Button, Radio, Row, Col, Divider, List, Timeline, Menu,
     Card, DatePicker,Select,Form,Spin } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
import { TPostData,TPostMData, urlBase } from '../../utils/TAjax';
import {TimelineChart,IdentityChart,FoldlineChart} from 'components/BCComponents/Charts';
import PageHeaderLayout from '../../base/PageHeaderLayout';
// import {TimelineChart} from 'components/ant-design-pro/Charts';

let sess_info=sessionStorage.getItem('userinfo');

export default class timeLineChart extends Component {

    constructor( props ) {
        super( props )
        let startMon=moment((new Date().getTime()) - (1000 * 60 * 60 * 24*30*12)).format('YYYY.MM'),
            endMon=moment().format('YYYY.MM'),
            startWeek=moment((new Date().getTime()) - (1000 * 60 * 60 * 24*7*10)).format('YYYY.MM.DD'),
            endWeek=moment().format('YYYY.MM.DD'),
            startDate=moment((new Date().getTime()) - (1000 * 60 * 60 * 24*30)).format('YYYY.MM.DD'),
            endDate=moment().format('YYYY.MM.DD');
        this.state = {
            RType: 'RMonth',
            // trendReportMonth:[{x:'2002-05-14 08:43:59',y1:0,y2:0}],
            trendReportMonth:(()=>{
                let arr=[];
                for (var i = 0; i < 10; i++) {
                    arr.push({
                        x:(new Date().getTime()) - (1000 * 60 * 60 * 24*30*i),
                        // y1:Mock.mock('@natural(800, 1500)'),
                        // y2:Mock.mock('@natural(800, 1500)')
                        y1:0,
                        y2:0
                    })
                }
                return arr;
            })(),
            trendReportWeek:(()=>{
                let arr=[];
                for (var i = 0; i < 10; i++) {
                    arr.push({
                        x:(new Date().getTime()) - (1000 * 60 * 60 * 24*7*i),
                        // y1:Mock.mock('@natural(800, 1500)'),
                        // y2:Mock.mock('@natural(0, 30)')
                        y1:0,
                        y2:0
                    })
                }
                return arr;
            })(),
            trendReportDay:(()=>{
                let arr=[];
                for (var i = 0; i < 10; i++) {
                    arr.push({
                        x:(new Date().getTime()) - (1000 * 60 * 60 * 24*i),
                        // y1:Mock.mock('@natural(800, 1500)'),
                        // y2:Mock.mock('@natural(0, 30)'),
                        y1:0,
                        y2:0
                    })
                }
                return arr;
            })(),
            workshopList: [],
            workCenterList:[],
            WSUUID:'1',
            WCUUID:'-1',
            loading:true,
            MSDate:startMon,
            MEDate:endMon,
            WSDate:startWeek,
            WEDate:endWeek,
            Start_Day:startDate,
            End_Day:endDate,
            Start_Year:moment(startMon).format('YYYY'),
            End_Year:moment().format('YYYY'),
            Start_Month:moment(startMon).format('M'),
            End_Month:moment().format('M'),
            Start_Week:moment(startWeek).format('w'),
            End_Week:moment(endWeek).format('w'),
            authInfo:JSON.parse(sess_info),
            // authInfo:this.props.userInfo
        }
    }

    componentWillMount() {
        this.getWorkshopList();
        this.getWorkCenterList();
        // this.getTrentReportMon();
        this.setDefaultWS();
    }

    componentDidMount() {

    }

    getTrentReportMon(){
        const{WSUUID,WCUUID,Start_Year,End_Year,Start_Month,End_Month}=this.state;

        const dat ={
            WorkshopUUID : WSUUID,
            WorkstationUUID : WCUUID,
            StartYear : Start_Year,
            StartMonth : Start_Month,       // 起始月份
            EndYear : End_Year,
            EndMonth : End_Month        // 结束月份         // 0 - 按计划时间查询    1 - 按生产时间查询
        }

        // TPostData('/api/TReport/production_report/Month', "GetProductionReportMonth", dat,
        TPostData('/api/TReport/production_report', "GetProductionReportMonth", dat,
            ( res ) => {
                console.log( "查询到生产趋势月报表", res );
                var data_list = res.obj.objectlist || [],
                    trend_ReportMonth = [];
                    if(res.err==0){
                        data_list.forEach( ( item, index ) => {
                            trend_ReportMonth.push( {
                                key: index,
                                TimeDesc :item.TimeDesc,
                                UnitDesc :item.UnitDesc,
                                FinishNumber :item.FinishNumber,
                                RejectNumber :item.RejectNumber,
                                x:item.TimeDesc,
                                // x:moment(item.TimeDesc).format('YYYY/MM'),
                                // y1:item.FinishNumber,
                                // y2:item.RejectNumber,
                                '总产量':item.FinishNumber,
                                '次品量':item.RejectNumber
                            } )
                        } );
                        this.setState({loading:false});
                        if(trend_ReportMonth.length){
                            this.setState( {trendReportMonth:trend_ReportMonth },()=>console.log('trend_ReportMonth',this.state.trendReportMonth) );
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

    getTrentReportWeek(){
        const{WSUUID,WCUUID,Start_Year,End_Year,Start_Week,End_Week}=this.state;

        const dat ={
            WorkshopUUID : WSUUID,
            WorkstationUUID : WCUUID,
            StartYear : Start_Year,
            StartWeek : Start_Week,       // 起始周
            EndYear : End_Year,
            EndWeek : End_Week         // 结束周
        }

        TPostData('/api/TReport/production_report', "GetProductionReportWeek", dat,
            ( res ) => {
                console.log( "查询到生产趋势周报表", res );
                var data_list = res.obj.objectlist || [],
                    trend_ReportWeek = [];

                if(res.err==0){
                    data_list.forEach( ( item, index ) => {
                        trend_ReportWeek.push( {
                            key: index,
                            TimeDesc :item.TimeDesc,
                            UnitDesc :item.UnitDesc,
                            FinishNumber :item.FinishNumber,
                            RejectNumber :item.RejectNumber,
                            x:moment(item.TimeDesc).format('YYYY/MM/DD'),
                            // x:moment(item.TimeDesc).format('YYYY/WW'),
                            // y1:item.FinishNumber,
                            // y2:item.RejectNumber,
                            '总产量':item.FinishNumber,
                            '次品量':item.RejectNumber,
                        } )
                    } );
                    this.setState({loading:false});
                    if(trend_ReportWeek.length){
                        this.setState( { trendReportWeek:trend_ReportWeek} )
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

    getTrentReportDay(){
        const{WSUUID,WCUUID,Start_Day,End_Day}=this.state;

        const dat ={
            WorkshopUUID : WSUUID,
            WorkstationUUID : WCUUID,
            StartDay : Start_Day,
            EndDay : End_Day
        }

        TPostData('/api/TReport/production_report', "GetProductionReportDay", dat,
            ( res ) => {
                console.log( "查询到生产趋势日报表", res );
                var data_list = res.obj.objectlist || [],
                    trend_ReportDay = [];

                if(res.err==0){
                    data_list.forEach( ( item, index ) => {
                        trend_ReportDay.push( {
                            key: index,
                            TimeDesc :item.TimeDesc,
                            UnitDesc :item.UnitDesc,
                            FinishNumber :item.FinishNumber,
                            RejectNumber :item.RejectNumber,
                            x:moment(item.TimeDesc).format('YYYY/MM/DD'),
                            // x:item.DayDesc,
                            y1:item.FinishNumber,
                            y2:item.RejectNumber,
                            '总产量':item.FinishNumber,
                            '次品量':item.RejectNumber,
                        } )
                    } );
                    this.setState({loading:false});
                    if(trend_ReportDay.length){
                        this.setState( { trendReportDay: trend_ReportDay} );
                        console.log('trend_ReportDay',trend_ReportDay)
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
                        uuid: item.UUID.toString(),
                        Name: item.Name,
                    } )
                    // list.push( {key:index, Name: item.Name, UUID: item.UUID.toString() } );
                } )
                list.sort((a,b)=>(a.uuid-b.uuid))
                this.setState( { workCenterList: list } )
            },
            ( error ) => {
                message.info( error );
            }
        )
    }

    handleWSChange=(value)=>{
        this.setState({WSUUID:value},()=>{
            this.getWorkCenterList();
        })
    }

    handleWCChange=(value)=>{
        this.setState({WCUUID:value},()=>{
            // this.getWorkCenterList();
            console.log('WCChange',this.state.WCUUID);
        })
    }

    handleChangeMSDate=(data,string)=>{
        console.log(data,string,data.format('YYYY'),data.format('M'))
    }

    handleChangeMDDate=(data,string)=>{
        console.log(data,string)
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
                message.error('添加失败');
                return;
            } else {
                // this.props.submit(values);
                const {WSUUID,WCUUID,RDate,startDate,endDate}=values;
                let RType=this.state.RType;

                if(startDate==null||endDate==null){
                    message.error('请选择合适的日期');
                    return;
                }

                if(RType&&RType=='RMonth'&&startDate&&endDate){
                    let Start_Year=values.startDate.format("YYYY"),
                        End_Year=values.endDate.format("YYYY"),
                        Start_Month=values.startDate.format("M"),
                        End_Month=values.endDate.format("M");
                    this.setState(
                        {
                            WSUUID,
                            WCUUID,
                            Start_Year,
                            End_Year,
                            Start_Month,
                            End_Month
                        },
                        ()=>{
                        console.log('WSUUID,WCUUID,RDate',Start_Year,End_Year,Start_Month,End_Month);
                            // this.getOEEReport();
                            this.getTrentReportMon();
                        }
                    );
                }
                else if(RType&&RType=='RWeek'&&startDate&&endDate){
                    let Start_Year=values.startDate.format("YYYY"),
                        End_Year=values.endDate.format("YYYY"),
                        Start_Week=values.startDate.format("W"),
                        End_Week=values.endDate.format("W");
                    this.setState(
                        {
                            WSUUID,
                            WCUUID,
                            Start_Year,
                            End_Year,
                            Start_Week,
                            End_Week
                        },
                        ()=>{
                        // console.log('WSUUID,WCUUID,RDate',Start_Year,End_Year,Start_Week,End_Week);
                        // this.getOEEReport();
                        this.getTrentReportWeek();
                    });
                }
                else if(RType&&RType=='RDay'&&startDate&&endDate){
                    let Start_Day=values.startDate.format("YYYY.MM.DD"),
                        End_Day=values.endDate.format("YYYY.MM.DD");
                    this.setState(
                        {
                            WSUUID,
                            WCUUID,
                            Start_Day,
                            End_Day
                        },
                        ()=>{
                        // console.log('WSUUID,WCUUID,RDate',Start_Year,End_Year,Start_Week,End_Week);
                        // this.getOEEReport();
                        this.getTrentReportDay();
                        }
                    );
                }

            }
        });
    }

    handleChange=(value)=>{
        this.setState({WSUUID:value},()=>{
            this.getWorkCenterList();
        })
    }

    handleSizeChange = (e) => {
      this.setState({ RType: e.target.value,loading:true });

      let val=e.target.value;

      val=='RMonth'?
        this.getTrentReportMon():
        val=='RWeek'?
        this.getTrentReportWeek():
        val=='RDay'?
        this.getTrentReportDay():
        '';

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
        this.setState({WSUUID:DefaultUUID},()=>this.getTrentReportMon());
    }

    render() {
        const {
            trendReportMonth,
            trendReportWeek,
            trendReportDay,
            RType,
            WSUUID,
            MSDate,
            MEDate,
            WSDate,
            WEDate,
            Start_Day,
            End_Day
        }=this.state;

        const {form:{getFieldDecorator}}=this.props;

        const bcList = [{
          title:"首页",
          href: '/',
          }, {
          title: '报表中心',
          href: '/',
          }, {
          title: '产量趋势',
          }];

        const  Cols1 = {
            x: {
              type: 'time',
              tickCount: 10,
              // mask: 'HH:MM',
              mask: 'YYYY/MM',
              range: [0, 1],
            },
            // value: {
            //   // max,
            //   min: 0,
            // },
        };

        const  Cols2 = {
            x: {
              // type: 'identity',
              type: 'time',
              tickCount: 10,
              alias: '周',
              // mask: 'HH:MM',
              mask: 'YYYY,ww',
              range: [0, 1],
              // formatter:(v1,v2)=>console.log('v1:',v1,'v2:',v2)
              formatter:(v1,v2)=>moment(v1).format("YYYY/Wo")
            },
            value: {
              // max,
              min: 0,
            },
        };

        const  Cols3 = {
            x: {
              type: 'time',
              tickCount: 10,
              // mask: 'HH:MM',
              mask: 'YYYY/MM/DD',
              range: [0, 1],
            },
            value: {
              // max,
              min: 0,
            },
        };

        const formItemLayout = {
          labelCol: {
            xs: { span: 24 },
            sm: { span: 4 },
          },
          wrapperCol: {
            xs: { span: 24 },
            sm: { span: 20,type:'flex',justify:'end',align:'middle' },
          },
        };

        const MDateForm=(
            <FormItem label="日期" {...formItemLayout} >
                <Col span={11}>
                    <FormItem style={{marginRight:0}}>
                        {getFieldDecorator("startDate",{
                            initialValue:moment(MSDate),
                            // rules:[{required:true,message:'日期不能为空'}]
                        })(
                            // <DatePicker showTime format="YYYY/MM/DD" />
                            <MonthPicker format="YYYY/MM"/>
                        )}
                    </FormItem>
                </Col>
                <Col span={2}>
                    <span style={{ display: 'inline-block', width: '100%', textAlign: 'center' }}>
                        ~
                    </span>
                </Col>
                <Col span={11}>
                    <FormItem style={{marginRight:0}}>
                        {getFieldDecorator("endDate",{
                            initialValue:moment(MEDate),
                            // rules:[{required:true,message:'日期不能为空'}]
                        })(
                            <MonthPicker format="YYYY/MM"/>
                        )}
                    </FormItem>
                </Col>
            </FormItem>
        )

        const WDateForm=(
            <FormItem label="日期" {...formItemLayout} >
                <Col span={11}>
                    <FormItem style={{marginRight:0}}>
                        {getFieldDecorator("startDate",{initialValue:moment(WSDate)})(
                            <WeekPicker />
                        )}
                    </FormItem>
                </Col>
                <Col span={2}>
                    <span style={{ display: 'inline-block', width: '100%', textAlign: 'center' }}>
                        ~
                    </span>
                </Col>
                <Col span={11}>
                    <FormItem style={{marginRight:0}}>
                        {getFieldDecorator("endDate",{initialValue:moment(WEDate)})(
                            <WeekPicker />
                        )}
                    </FormItem>
                </Col>
            </FormItem>
        )

        const DayForm=(
            <FormItem label="日期" {...formItemLayout}>
                <Col span={11}>
                    <FormItem style={{marginRight:0}}>
                        {getFieldDecorator("startDate",{initialValue:moment(Start_Day)})(
                            <DatePicker showToday={false} />
                        )}
                    </FormItem>
                </Col>
                <Col span={2}>
                    <span style={{ display: 'inline-block', width: '100%', textAlign: 'center' }}>
                        ~
                    </span>
                </Col>
                <Col span={11}>
                    <FormItem style={{marginRight:0}}>
                        {getFieldDecorator("endDate",{initialValue:moment(End_Day)})(
                            <DatePicker showToday={false} />
                        )}
                    </FormItem>
                </Col>
            </FormItem>
        )

        const dataFields=['总产量','次品量']

        return (
            <PageHeaderLayout title="产量趋势" wrapperClassName="pageContent" BreadcrumbList={bcList}>
                <Spin spinning={this.state.loading}>
                <div className="cardContent">
                    <Radio.Group value={RType} onChange={this.handleSizeChange}>
                      <Radio.Button value="RMonth">月报</Radio.Button>
                      <Radio.Button value="RWeek">周报</Radio.Button>
                      <Radio.Button value="RDay">日报</Radio.Button>
                    </Radio.Group>

                    {/* <Card bordered={false}>
                        <Row gutter={16}>
                            <Col className="gutter-row" span={6}>
                                <div className="gutter-box"><span style={{ width: "40%" }}>车间:</span>
                                    <Select defaultValue={WSUUID} style={{ width: "60%" }} onChange={this.handleWSChange}>
                                        {
                                            this.state.workshopList.map((item,index)=>{
                                                return (<Option value={item.UUID} key={index}>{item.Name}</Option>)
                                            })
                                        }
                                    </Select>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <div className="gutter-box"><span style={{ width: "40%" }}>工作中心:</span>
                                    <Select defaultValue="-1" style={{ width: "60%" }} onChange={this.handleWCChange}>
                                        <Option value="-1" key="all">全部</Option>
                                        {
                                            this.state.workCenterList.map((item,index)=>{
                                                    return (<Option value={item.UUID} key={index}>{item.Name}</Option>)
                                            })
                                        }
                                    </Select>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={8}>
                                {
                                    RType=="RMonth"?
                                    <div className="gutter-box">
                                        <span style={{ width: "35%" }}>日期:</span>
                                        <MonthPicker   onChange={this.handleChangeMSDate}  placeholder="" style={{ width: "30%" }} />~
                                        <MonthPicker   onChange={this.handleChangeMEDate}  placeholder="" style={{ width: "30%" }} />
                                    </div>:
                                    RType=="RWeek"?
                                    <div className="gutter-box">
                                        <span style={{ width: "35%" }}>日期:</span>
                                        <WeekPicker  placeholder="" style={{ width: 110 }} />~
                                        <WeekPicker  placeholder="" style={{ width:110 }} />
                                    </div>:
                                    RType=="RDay"?
                                    <div className="gutter-box">
                                        <span style={{ width: "35%" }}>日期:</span>
                                        <DatePicker placeholder="" style={{ width: "30%" }} />~
                                        <DatePicker placeholder="" style={{ width: "30%" }} />
                                    </div>:''
                                }
                            </Col>
                            <Col className="gutter-row" span={4}>
                                <div className="gutter-box">
                                    <Button type="primary" icon="search">查询</Button>
                                </div>
                            </Col>
                        </Row>
                    </Card> */}

                    <Card bordered={false}>
                        <Form onSubmit={this.handleSearch} layout="inline">
                            <Row gutter={16}>
                                <Col className="gutter-row" span={6}>
                                    <div className="gutter-box">
                                        <FormItem label="车间" key="oeews">
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
                                        <FormItem label="工作中心" key="oeewc">
                                          {getFieldDecorator("WCUUID", {initialValue:'-1'})(
                                              <Select style={{width:160}}>
                                                  <Option value="-1" key="all">全部</Option>
                                                  {
                                                      this.
                                                        state.
                                                        workCenterList.
                                                        map((item,index)=>(<Option value={item.uuid} key={index}>{item.Name}</Option>))
                                                  }
                                              </Select>
                                          )}
                                        </FormItem>
                                    </div>
                                </Col>
                                <Col className="gutter-row" span={8}>
                                    <div className="gutter-box">

                                        {/* <FormItem label="日期" key="oeedate">
                                          {getFieldDecorator("RDate",{initialValue:moment(RDate)})(
                                              <DatePicker showTime format="YYYY/MM/DD" />
                                          )}
                                        </FormItem> */}
                                        {
                                            RType=="RMonth"?
                                            MDateForm:
                                            RType=="RWeek"?
                                            WDateForm:
                                            RType=="RDay"?
                                            DayForm:''
                                        }
                                        {/* <FormItem label="日期" >
                                        </FormItem> */}

                                    </div>
                                </Col>
                                <Col className="gutter-row" span={3}>
                                    <div className="gutter-box">
                                        <Button type="primary"  htmlType="submit">查询</Button>
                                        {/* <Button style={{
                                                marginLeft: 8
                                            }} onClick={this.handleFormReset}>重置</Button> */}
                                    </div>
                                </Col>
                            </Row>
                        </Form>
                    </Card>

                    <Card>
                        {
                            RType=="RMonth"?
                            // <TimelineChart
                            <FoldlineChart
                                height={500}
                                // data={chartData1}
                                data={trendReportMonth}
                                cols={Cols1}
                                fields={dataFields}
                                titleMap={{ y1: '完成数量', y2: '次品数量' }}
                            />:
                            RType=="RWeek"?
                            // <TimelineChart
                            <FoldlineChart
                            // <IdentityChart
                                height={500}
                                // data={chartData2}
                                data={trendReportWeek}
                                cols={Cols2}
                                fields={dataFields}
                                titleMap={{ y1: '完成数量', y2: '次品数量' }}
                            />:
                            RType=="RDay"?
                            // <TimelineChart
                            <FoldlineChart
                                height={500}
                                // data={chartData3}
                                data={trendReportDay}
                                cols={Cols3}
                                fields={dataFields}
                                titleMap={{ y1: '完成数量', y2: '次品数量' }}
                            />:''
                        }
                    </Card>
                </div>
                </Spin>
            </PageHeaderLayout>
        )
    }
}
timeLineChart = Form.create()(timeLineChart);
