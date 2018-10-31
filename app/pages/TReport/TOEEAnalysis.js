import moment from 'moment';
import React, { Component } from 'react'
import { message, Menu, Icon, Row, Col, Card, Table, Divider,
    Form,DatePicker,Button,Select,Spin} from 'antd';
import { TPostData } from '../../utils/TAjax';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
const { MonthPicker, RangePicker } = DatePicker;
import ReactEcharts from 'echarts-for-react';
import { Gauge } from 'components/ant-design-pro/Charts';
// import { NumGauge } from 'components/Chart';
import NumGauge_B from './components/NumGauge/NumGauge_B';
import NumGauge_S from './components/NumGauge/NumGauge_S';
import PageHeaderLayout from 'base/PageHeaderLayout';

const FormItem = Form.Item;
const Option = Select.Option;
import TableExport from 'tableexport';
let sess_info=sessionStorage.getItem('userinfo');

export default class TOEEAnalysis extends Component {
    constructor( props, context ) {
        super( props )
        this.state = {
            OEEDataList:[],
            OEEDataWS:{},
            workshopList: [],
            workCenterList: [],
            WSUUID:'1',
            WCUUID:'-1',
            RDate:moment().format('YYYY.MM.DD'),
            loading:true,
            hasAddBtn:false,
            authInfo:JSON.parse(sess_info),
            // authInfo:this.props.userInfo
        }
        // this.handleMenuClick.bind(this);
        // this.getWorkCenter.bind(this);
        this.url = '/api/TFactory/workshop';
        // this.workshopList =[];
        // this.getUserInfo = this.getUserInfo.bind(this)
    }

    componentWillMount() {
        this.getWorkshopList()
        this.getWorkCenterList();
        this.setDefaultWS();
        // this.getOEEReport();
    }

    // 组件已经加载到dom中
    componentDidMount() {
        // let csvDom=document.getElementById("OEETable")
        // .getElementsByClassName("ant-table-body")[0];
        // let btnWrap=document.getElementById("exportOEERep");
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
                    if(this.state.hasAddBtn==false){
                        let tableDom=document.getElementById("OEETable")
                        .getElementsByClassName("ant-table-body")[0];
                        let btnWrap=document.getElementById("exportOEERep");
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

    getWorkshopList(){
        const dat = {
            PageIndex: 0, //分页：页序号，不分页时设为0
            PageSize: -1, //分页：每页记录数，不分页时设为-1
            FactoryUUID: -1, //所属工厂UUID，不作为查询条件时取值设为-1
            TypeUUID: -1, //类型UUID，不作为查询条件时取值设为-1
            KeyWord: ""
        }
        TPostData( this.url, "ListActive", dat,
            ( res ) => {
                var list = [];
                console.log( "查询到车间列表", res );
                var data_list = res.obj.objectlist || [];
                data_list.forEach( ( item, index ) => {
                    list.push( {
                        key: index,
                        UUID:item.UUID.toString(),
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

    getWorkCenterList(UUID){
        var dat = {
            'PageIndex': 0,
            'PageSize': -1,
            WorkshopUUID: this.state.WSUUID,
            'TypeUUID': -1
        }
        TPostData('/api/TProcess/workcenter', "ListActive",dat,
            ( res )=> {
                var list = [];
                var Ui_list = res.obj.objectlist || [];
                // console.log( '查询到工作中心列表', Ui_list );
                Ui_list.forEach(( item, index )=> {
                    list.push( {
                        key: index,
                        Name: item.Name,
                        value:item.UUID,
                        ID: item.ID,
                        Time:"64%",
                        Performance:"67%",
                        Quality:"46%",
                        OEE:"53%",
                        // WorkshopName: item.WorkshopName,
                        // UUID: item.UUID,
                        // TypeUUID: item.TypeUUID.toString(),
                        // WorkshopUUID: item.WorkshopUUID.toString(),
                    } );
                    list.sort((a,b)=>(a.value-b.value));
                    this.setState( { workCenterList: list } )
                } )
            },
            ( error )=> {
                message.info( error );
            }
        )
    }

    handleMenuClick({ item, key, keyPath }){
        console.log("点击菜单之后",item,key,keyPath);
        this.getWorkCenter(key);
    }

    GetRandomInt(max,min){
        return parseInt(Math.random() * (max - min) + min);
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
                    Date:'',
                    Name:`工作中心${i}`,
                    ID:`workcenter-0${i}`,
                    Time:'67%',
                    Performance:'68%',
                    Quality:'88%',
                    OEE:'53%',
                    status:this.GetRandomInt(1,11)
                }
            )
        }
        return list;
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
                const {WSUUID,WCUUID,RDate}=values;
                this.setState({hasAddBtn:false,loading:true,WSUUID,WCUUID,RDate:RDate.format("YYYY.MM.DD")},()=>{
                    console.log('WSUUID,WCUUID,RDate',this.state.RDate);
                    this.getOEEReport();
                })
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
        this.setState({WSUUID:DefaultUUID},()=>this.getOEEReport());
    }

    render() {
        let {
            OEEDataList,
            RDate,
            WSUUID,
            OEEDataWS:{
                PRate=65,
                ARate=15,
                QRate=90,
                OEE=45,
                WorkshopName='未指定车间'
            }
        }=this.state;
        PRate=parseFloat(PRate.toFixed(2));
        ARate=parseFloat(ARate.toFixed(2));
        QRate=parseFloat(QRate.toFixed(2));
        OEE=parseFloat(OEE.toFixed(2));

        const OEEData=this.generate();

        const columns = [
            /*{
                title: '车间',
                dataIndex: 'WorkshopName',
                // width:200,
                key: 'Date',
            },*/
            {
                title: '工作中心',
                dataIndex: 'WorkcenterName',
                key: 'name',
                // render: text => <a href="#">{text}</a>,
            },
            /*{
                title: '工作中心编号',
                dataIndex: 'ID',
                key: 'ID',
            },*/
            {
                title: '时间稼动率(%)',
                dataIndex: 'ARate',
                key: 'Time',
            },
            {
                title: '性能稼动率(%)',
                dataIndex: 'PRate',
                key: 'PRate',
            },
            {
                title: '良品率(%)',
                dataIndex: 'QRate',
                key: 'QRate',
            },
            {
                title: 'OEE(%)',
                dataIndex: 'OEE',
                key: 'OEE',
            },
            {
                title: '离线时间(min)',
                dataIndex: 'OfflineTime',
                key: 'OfflineTime',
            },
            {
                title: '待机时间(min)',
                dataIndex: 'ReadyTime',
                key: 'ReadyTime',
            },
            {
                title: '运行时间(min)',
                dataIndex: 'RunningTime',
                key: 'RunningTime',
            },
            {
                title: '报警时间(min)',
                dataIndex: 'WarningTime',
                key: 'WarningTime',
            },
            /*{
                title: '操作',
                key: 'action',
                render: ( text, record ) => (
                    <span>
                      <a href="#">详情{record.name}</a>
                      <Divider type="vertical" />
                      <a href="#">删除</a>
                      <Divider type="vertical" />
                      <a href="#" className="ant-dropdown-link">
                        更多 <Icon type="down" />
                      </a>
                    </span>
                ),
            }*/
        ];

        const chartFour = {
            tooltip : {
                formatter: "{a} <br/>{b} : {c}%"
            },
            toolbox: {
                feature: {
                    // restore: {},
                    // saveAsImage: {}
                }
            },
            series: [
                {
                    name: '业务指标',
                    type: 'gauge',
                    detail: {formatter:'{value}%'},
                    data: [{value: 56, name: '时间稼动率'}]
                }
            ]
        };

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

        const {form:{getFieldDecorator}}=this.props;

        const bcList = [{
            title:"首页",
            href: '/',
            }, {
            title: '生产报表',
            // href: '/oee_report',
            }, {
            title: '设备综合效率',
        }];

        return (
            <PageHeaderLayout title="设备综合效率" wrapperClassName="pageContent" BreadcrumbList={bcList}>
                <div className="cardContent">
                    {/* <Card style={{marginBottom:20}}>
                        <Row gutter={16}>
                            <Col className="gutter-row" span={6}>
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
                            <Col className="gutter-row" span={6}>
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
                            <Col className="gutter-row" span={6}>
                                <div className="gutter-box"><span style={{ width: "40%" }}>日期:</span>
                                    <DatePicker style={{ width: "60%" }} />
                                </div>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <div className="gutter-box">
                                    <Button type="primary" icon="search">查询</Button>
                                </div>
                            </Col>
                        </Row>
                    </Card> */}
                    <Spin spinning={this.state.loading}>
                        <Card>
                            <Form onSubmit={this.handleSearch} layout="inline">
                                <Row gutter={16}>
                                    <Col className="gutter-row" span={7}>
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
                                                            map((item,index)=>(<Option value={item.value} key={index}>{item.Name}</Option>))
                                                      }
                                                  </Select>
                                              )}
                                            </FormItem>
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={6}>
                                        <div className="gutter-box">
                                            <FormItem label="日期" key="oeedate">
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
                        <div style={{border:'solid 0px #d7d9d8', marginBottom:30}}>
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
                                        {/* <Gauge
                                              title="核销率"
                                              height={164}
                                              percent={87}
                                            /> */}
                                        {/* <ReactEcharts
                                            option={chartFour}
                                            // style={{height:200}}
                                            className='react_for_echarts' /> */}

                                </Col>
                            </Row>
                        </div>
                        <div  style={{margin:'20px 0',overflow:'hidden'}}>
                            <Form className="ProReMenu" style={{float:'right'}} layout="inline">
                                <FormItem  label="导出">
                                    <div
                                        className="exportMenuWrap"
                                        id="exportOEERep"
                                        style={{display:'flex'}}/>
                                </FormItem>
                            </Form>
                        </div>
                        <div id="OEETable">
                            <Table
                                columns={columns}
                                // dataSource={OEEData}
                                dataSource={OEEDataList}
                                bordered={true}
                                title={()=>(<span>车间：{WorkshopName}</span>)}
                                size="small"
                              />
                        </div>
                    </Spin>
                </div>
            </PageHeaderLayout>
        )
    }
}
TOEEAnalysis = Form.create()(TOEEAnalysis);
