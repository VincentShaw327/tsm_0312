/**
 *这是设备列表页
 *添加日期:2017.12.20
 **/
/******引入ant或其他第三方依赖文件*******************/
import React, { Component } from 'react'
import { connect } from 'react-redux'
import {Card,Row,Col,Progress,Divider,Tag,Spin,Alert,List,message,Button} from 'antd';
import { fetchWorkcenterList } from 'actions/process'
import { TPostData,urlBase } from 'utils/TAjax';
import {  yuan,Pie} from 'components/ant-design-pro/Charts';
import mqtt from 'mqtt';
import PageHeaderLayout from '../../base/PageHeaderLayout';
import DevDesc from './components/DevDesc';


var client //注塑车间消息订阅初始化变量

@connect( ( state, props ) => {
    console.log('workcenter',state);
    return {
        Breadcrumb:state.Breadcrumb,
        workcenter: state.workcenter,
    }
}, )
export default class TScadaWorkShop_Auto extends Component {

    constructor( props ) {
        super( props )
        this.state = {
            //单台机台数据状态
            aEquipList: [],
            stateCount:[],
            onLine: '-',
            warning: '-',
            allQuery: '-',
            loading: true,
            showDetal:false
        }
    }
    //查询工作中心
    componentWillMount() {
        // this.getWorkCenterList();
        let req={
            op:'ListActive',
            reqdata:{
                PageIndex: 0,
                PageSize: -1,
                WorkshopUUID:1,  //所属车间UUID，不作为查询条件时取值设为-1
                TypeUUID: -1,   //类型UUID，不作为查询条件时取值设为-1
                KeyWord : ""
            }
        };
        this.props.dispatch( fetchWorkcenterList( req, ( respose ) => {
            console.log('respose===',respose)
            let list=[];
            respose.obj.objectlist.forEach((item,index)=>{
                list.push({
                    key: index,
                    ID: item.ID,
                    UUID: item.UUID,
                    WorkshopUUID: item.WorkshopUUID,
                    Name: item.Name,
                    Image:item.Image,
                });
            });
            let InitstateCount=[
                {
                    x:'报警',
                    y:0
                },
                {
                    x:'离线',
                    y:respose.obj.objectlist.length
                },
                {
                    x:'运行',
                    y:0
                },
                {
                    x:'待机',
                    y:0
                },
                {
                    x:'调机',
                    y:0
                }
            ];
            list.sort((a,b)=>(a.UUID-b.UUID));
            this.setState({
                aEquipList:list,
                // aEquipList:respose.obj.objectlist,
                stateCount:InitstateCount
            })
        } ) )

    }

    componentDidMount() {
        //mqtt消息连接建立
        // client = mqtt.connect( 'mqtt://122.239.140.82:29011' );
        // client = mqtt.connect( 'mqtt://47.91.154.238:9011' );
        client = mqtt.connect( 'ws://192.168.1.250:9011' );
        // client = mqtt.connect( 'mqtt://192.168.200.3:9011' );
        client.on( 'connect', function () {
            //订阅消息
            client.subscribe( '0101/086325608001/201712290001/kanban/01/B' );
            // client.subscribe( "0101/086325608001/201712290001/kanban/01/A" );
            // client.subscribe( 'topstarltd/iec/app/#' )
        } )
        let renderaEquip = [];
        client.on( 'message',( topic, payload )=> {
            // 接收到mqtt消息推送数据
            let mqttData = JSON.parse( payload );
            console.log( '接收到MQTT信息', mqttData );
            // 判断消息包内有数据的情况下,把数据更新至组件.
            if ( mqttData && Array.isArray( mqttData.data ) ) {
                renderaEquip = this.state.aEquipList.map(( item, i )=> {
                    //判断接受消息是哪一台机器
                    mqttData.data.forEach( ( mqttItem, index ) => {
                        if ( item.UUID == mqttItem.workstation ) {
                            item.key = i
                            item.Status = mqttItem.run_status
                            item.prod_count = mqttItem.finished //产量
                            item.prod_rate = mqttItem.capacity //产能
                            item.plan = mqttItem.plan //计划
                            item.product=mqttItem.product
                            item.finished_order=mqttItem.finished_order
                            item.orderid=mqttItem.orderid==''?'-':mqttItem.orderid
                            // item.rej_count = mqttItem.data.rej_count //不良数
                            // item.rej_rate = mqttItem.data.rej_rate //不良率
                            // item.task_finish = mqttItem.task.task_finish //完成比例
                            // item.task_progress = mqttItem.finished_ratio //完成进度
                            // item.task_no = mqttItem.task.task_no //工单号
                            // item.task_name = mqttItem.task.task_name //产品名称
                            return item;
                        }
                        else {
                            return item
                        }
                    } )
                    return item;
                } )
                // console.log( 'renderaEquip', renderaEquip );

                this.setState( {
                    loading: false, //加载完毕取消蒙城
                    aEquipList: renderaEquip,
                    // allQuery: renderaEquip.length,
                    // onLine: g,
                    // warning: w,
                    // offLine: renderaEquip.length - w - g
                } )
            }
            if(mqttData&&mqttData.statics){
                let Mstatics=mqttData.statics;
                let MstateCount=[
                    {
                        x:'报警',
                        y:Mstatics.failure
                    },
                    {
                        x:'离线',
                        y:Mstatics.offline
                    },
                    {
                        x:'运行',
                        y:Mstatics.running
                    },
                    {
                        x:'待机',
                        y:Mstatics.stopped
                    },
                    {
                        x:'调机',
                        y:Mstatics.debug
                    }
                ];
                this.setState({stateCount:MstateCount});
            }
        } );

        // let topicA="0101/086325608001/201712290001/kanban/01/A";
        // client.on( 'message',(topicA , payload )=> {
        //     let mqttData = JSON.parse( payload );
        //     console.log( '接收到MQTT---A信息', mqttData );
        // });
    }

    getWorkCenterList(){
        // 获取相应车间的工作中心
        let aEquipList = [];
        let dat = {
            PageIndex: 0,
            PageSize: -1,
            WorkshopUUID:1,  //所属车间UUID，不作为查询条件时取值设为-1
            TypeUUID: -1,   //类型UUID，不作为查询条件时取值设为-1
            KeyWord : ""
        };

        TPostData( '/api/TProcess/workcenter', "ListActive", dat,
            ( res )=> {
                console.log("工作中心列表===",res);
                var Ui_list = res.obj.objectlist || [];
                var totalcount = res.obj.objectlist.length;
                if(res.err==0){
                    Ui_list.forEach(( item, index )=> {
                        aEquipList.push( {
                            key: index,
                            ID: item.ID,
                            UUID: item.UUID,
                            WorkshopUUID: item.WorkshopUUID,
                            Name: item.Name,
                            Image:item.Image,
                            style: 'top-equip-light'
                        } )
                    } );
                    //初始化设备状态图标
                    let InitstateCount=[
                        {
                            x:'报警',
                            y:0
                        },
                        {
                            x:'离线',
                            y:aEquipList.length
                        },
                        {
                            x:'运行',
                            y:0
                        },
                        {
                            x:'待机',
                            y:0
                        }
                    ];

                    aEquipList.sort((a,b)=>(a.UUID-b.UUID));

                    this.setState( {
                        aEquipList: aEquipList,
                        stateCount:InitstateCount,
                        loading: false
                    } )

                }
                else{
                    message.error("服务器数据错误！");
                    this.setState({loading:false});
                }

            },
            ( error )=>{
                message.error( error );
                this.setState({loading:false});
            }
        )

    }

    componentWillUnmount() {
        client.end()
    }

    toggleRender(record){
        this.setState({
            showDetal:!this.state.showDetal,
            detailID:record.UUID,
            detailMessage:record
        })
    }

    render() {
        const {showDetal,detailID,detailMessage,aEquipList}=this.state;
        const {workcenter}=this.props;
        const ListHeader = (
            <Row gutter={16} style={{fontSize:16}}>
              <Col className="gutter-row" span={3}>
                <div className="gutter-box">图片</div>
              </Col>
              <Col className="gutter-row" span={5}>
                <div className="gutter-box">工作中心/编号</div>
              </Col>
              {/* <Col className="gutter-row" span={4}>
                <div className="gutter-box">工单号<span style={{fontSize:10}}></span></div>
              </Col> */}
              <Col className="gutter-row" span={3}>
                {/* <div className="gutter-box">生产信息</div> */}
                <div className="gutter-box">产品</div>
              </Col>
              <Col className="gutter-row" span={3}>
                <div className="gutter-box">产量<span style={{fontSize:10}}>(pcs)</span></div>
              </Col>
              <Col className="gutter-row" span={4}>
                <div className="gutter-box">产能<span style={{fontSize:10}}>(pcs/min)</span></div>
              </Col>
              <Col className="gutter-row" span={4}>
                <div className="gutter-box">生产进度</div>
              </Col>
              <Col className="gutter-row" span={2}>
                <div className="gutter-box">状态</div>
              </Col>
            </Row>
        );

        const bcList1 = [{
          title:"首页",
          href: '/',
          }, {
          title: '车间监控',
          href: '/',
          }, {
          title: '自动化装配车间一',
          }];

        const HeadContent=(
              <div style={{height:100}}>
                  <Row  type="flex" justify="start" align="middle">
                      <Col span={5}>
                          <Progress type="circle" percent={100} />
                      </Col>
                      <Col span={6}>
                          <Progress type="circle" percent={100} />
                      </Col>
                      <Col span={6}></Col>
                      <Col span={6}></Col>
                  </Row>
              </div>
          );

        const DevMonitorList=(
            <div style={{marginTop:15}}>
                <Row gutter={16}>
                  <Col className="gutter-row" span={18}>
                    <div className="gutter-box" style={{background: '#fff'}}>
                        <List
                            // style={{width:'75%'}}
                            header={ListHeader}
                            // footer={<div>Footer</div>}
                            // loading={this.state.loading}
                            loading={workcenter.loading}
                            bordered
                            dataSource={this.state.aEquipList}
                            renderItem={item => {
                                let stateObj={},
                                    Percent=parseFloat(((item.prod_count/item.plan )*100|| 0).toFixed(2));
                                Percent=Percent>100?100:Percent;
                                // if(item.task_progress &&item.task_progress >= 100)
                                if(item.plan!=0&&item.prod_count>=item.plan)
                                    stateObj={text:"已完成",color:'#8f910c'};
                                else if(item.hasOwnProperty('Status')&&item.Status== 1)
                                    stateObj={text:"生产中",color:'rgba(82, 196, 26, 0.84)'};
                                else if(item.hasOwnProperty('Status') &&item.Status== 2)
                                    stateObj={text:"报警中",color:'#d52c21'};
                                else if(item.hasOwnProperty('Status') &&item.Status== 3)
                                    stateObj={text:"调机中",color:'#0ab490'};
                                else if(item.hasOwnProperty('Status')&&item.Status== 0)
                                    stateObj={text:"待机中",color:'#4184de'};
                                // else if(item.hasOwnProperty('Status')&&item.Status== -1)
                                else
                                    stateObj={text:"离线中",color:'#8a8686'};

                                return(
                                        <List.Item>
                                            <Row gutter={16} type="flex" justify="space-around" align="middle" style={{border:'solid 0px',width:'100%'}}>
                                                <Col className="gutter-row" span={3}>
                                                    <div className="gutter-box">
                                                        <a href="javascript:void 0;" onClick={this.toggleRender.bind(this,item)}>
                                                            <img src={urlBase+item.Image} style={{width:"100%"}} />
                                                        </a>
                                                    </div>
                                                </Col>
                                                <Col className="gutter-row" span={5}>
                                                    <div className="gutter-box">
                                                        <p>{item.Name}</p>
                                                        <p>{item.ID}</p>
                                                    </div>
                                                </Col>
                                                {/* <Col className="gutter-row" span={4}>
                                                    <div className="gutter-box">
                                                        <span>{item.hasOwnProperty('orderid')?item.orderid:'-'}</span>
                                                    </div>
                                                </Col> */}
                                                <Col className="gutter-row" span={4}>
                                                    <div className="gutter-box">
                                                        {/* <div style={{color:'#1b8ff6',fontSize:20}}>{item.task_no?item.task_no:'P20180207'}</div> */}
                                                        <div>{item.product?item.product:'-'}</div>
                                                    </div>
                                                </Col>
                                                <Col className="gutter-row" span={3}>
                                                    <div className="gutter-box">
                                                        {/* <span>{item.hasOwnProperty('prod_count')?item.prod_count:'-'}</span> */}
                                                        <span>{item.hasOwnProperty('finished_order')?item.finished_order:'-'}</span>
                                                    </div>
                                                </Col>
                                                <Col className="gutter-row" span={3}>
                                                    <div className="gutter-box">
                                                        <span>{item.hasOwnProperty('prod_rate')?item.prod_rate:'-'}</span>
                                                    </div>
                                                </Col>
                                                <Col className="gutter-row" span={4}>
                                                    <div className="gutter-box">
                                                        <span>{item.prod_count||0}/{item.plan||0}</span>
                                                        <Progress
                                                            // type="dashboard"
                                                            // width={25}
                                                            // percent={parseFloat(((item.prod_count/item.plan )*100|| 0).toFixed(2))}
                                                            percent={Percent}
                                                            strokeWidth={15}/>
                                                    </div>
                                                </Col>
                                                <Col className="gutter-row" span={2}>
                                                    <Tag
                                                        color={`${stateObj.color}`}
                                                        style={{marginTop:30, fontSize: 'larger'}}>{stateObj.text}</Tag>
                                                    &nbsp;&nbsp;
                                                </Col>
                                            </Row>
                                        </List.Item>
                                    )
                                }
                            }
                            />
                    </div>
                  </Col>
                  <Col className="gutter-row" span={6}>
                    <div className="gutter-box">
                        <Card title="状态统计">
                            {/* <Dailychart /> */}
                            <Pie
                              hasLegend
                              title="销售额"
                              subTitle="设备状态"
                              colors={ ['#d52c21', '#caced4','#42d930','#4184de','#8f910c']}
                              // total={yuan(salesPieData.reduce((pre, now) => now.y + pre, 0))}
                              total={"总共"+ this.state.stateCount.reduce((pre, now) => now.y + pre, 0)+"台"}
                              // total={()=>{
                              //   let total=this.state.stateCount.reduce((pre, now) => now.y + pre, 0);
                              //   return <span>{total}</span>
                              // }}
                              data={this.state.stateCount}
                              valueFormat={val =>('&nbsp;&nbsp'+val+'台')}
                              // valueFormat={val => yuan(val)}
                              height={294}
                            />
                        </Card>
                        {/* <Card title="时间统计"  style={{marginTop:20}}>
                            <Barchart />
                        </Card> */}
                    </div>
                  </Col>
                </Row>
            </div>
        );

        const DevMonitorDesc=(
            <div className="cardContent">
                <DevDesc UUID={detailID} DetailMes={detailMessage} mqttData={aEquipList} />
            </div>
        );

        const HeadAction=(
                <Button onClick={this.toggleRender.bind(this)} type="primary" icon="rollback">返回</Button>
            );

        console.log('auto1_state:',this.state)
        return (
            <PageHeaderLayout
                title="自动化装配车间一"
                wrapperClassName="pageContent"
                // content={HeadContent}
                action={showDetal?HeadAction:''}
                BreadcrumbList={bcList1}>
                {showDetal?DevMonitorDesc:DevMonitorList}
            </PageHeaderLayout>
        )
    }
}
