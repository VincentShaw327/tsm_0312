/**
 *这是设备列表页
 *添加日期:2017.12.20
 **/
/******引入ant或其他第三方依赖文件*******************/
import React, { Component } from 'react';
import { connect } from 'react-redux'
import {Layout,Card,Row,Col,Progress,Divider,Tag,Spin,List,message,Button} from 'antd';
import { fetchWorkcenterList } from 'actions/process'
import { TPostData ,TPostMock,urlBase} from 'utils/TAjax';
import {  yuan,Pie} from 'components/ant-design-pro/Charts';
import PageHeaderLayout from '../../base/PageHeaderLayout';
import DevDesc from './components/DevDesc';
import mqtt from 'mqtt';
let client
import AM2 from '../../images/assets/1527821614_6.jpg'


@connect( ( state, props ) => {
    return {
        Breadcrumb:state.Breadcrumb,
        workcenter: state.workcenter,
    }
}, )
export default class TScadaWorkShop_Auto2 extends Component {
    constructor( props ) {
        super( props )
        this.state = {
            //单台机台数据状态
            aEquipList: [],
            stateCount:[],
            onLine: '-',
            warning: '-',
            allQuery: '-',
            loading: props.workcenter.loading
        }
    }

    componentWillMount() {
        // this.getWorkcenterList();
        let req={
            op:'ListActive',
            reqdata:{
                PageIndex: 0,
                PageSize: -1,
                WorkshopUUID:2,  //所属车间UUID，不作为查询条件时取值设为-1
                TypeUUID: -1,   //类型UUID，不作为查询条件时取值设为-1
                KeyWord : ""
            }
        };
        this.props.dispatch( fetchWorkcenterList( req, ( respose ) => {
            console.log('respose',respose)
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
        // client = mqtt.connect( 'mqtt://47.91.154.238:9011' );
        client = mqtt.connect( 'ws://192.168.200.3:9011' );

        client.on( 'connect', ()=> {
            //订阅消息
            client.subscribe("0101/086325608001/201712290001/kanban/02/B");
        } );
        let renderaEquip = [];
        client.on( 'message',( topic, payload )=> {
            // 接收到mqtt消息推送数据
            let mqttData = JSON.parse( payload );
            // console.log( '接收到MQTT_02B信息', mqttData );
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
                            return item
                        }
                        else {
                            return item
                        }
                    } )
                    return item;
                } )
                // console.log( 'renderaEquip', renderaEquip );
                this.setState( {
                    loading: false,
                    aEquipList: renderaEquip,
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

        } )
    }

    componentWillUnmount() {
        client.end();
    }

    getWorkcenterList(){
        //获取机台数量临时变量
        let aEquipList = [];
        let dat = {
            PageIndex: 0,
            PageSize: -1,
            WorkshopUUID:2,  //所属车间UUID，不作为查询条件时取值设为-1
            TypeUUID: -1,   //类型UUID，不作为查询条件时取值设为-1
            KeyWord : ""
        };
        TPostMock( '/wc_list02', "ListActive", dat,
            ( res )=> {
                var Ui_list = res.obj.objectlist || [];
                var totalcount = res.obj.objectlist.length;
                Ui_list.forEach( function ( item, index ) {
                    aEquipList.push( {
                        key: index,
                        ID: item.ID,
                        UUID: item.UUID,
                        WorkshopUUID: item.WorkshopUUID,
                        Image:item.Image,
                        Name: item.Name,
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
                    },
                    {
                        x:'调机',
                        y:0
                    }
                ];
                this.setState( {
                    aEquipList: aEquipList,
                    stateCount:InitstateCount,
                    loading: false
                } );
            },
            ( error )=> {
                message.error( error );
                this.setState({loading:false});
            }
        )
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
        const {workcenter,Breadcrumb}=this.props;
        // const Dailychart = this.dailychart1;
        // const Barchart = this.barChart;
        const ListHeader = (
            <Row gutter={16} style={{fontSize:16}}>
              <Col className="gutter-row" span={3}>
                <div className="gutter-box">图片</div>
              </Col>
              <Col className="gutter-row" span={5}>
                <div className="gutter-box">工作中心/编号</div>
              </Col>
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
        )

        const bcList = [ {
            title: "首页",
            href: '/',
          }, {
            title: '车间监控',
            href: '/',
          }, {
            title: '自动化装配车间二',
          } ];

        const DevMonitorDesc=(
            <div className="cardContent">
                <DevDesc UUID={detailID} DetailMes={detailMessage} mqttData={aEquipList} />
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
                                let stateObj={};
                                // if(item.task_progress &&item.task_progress >= 100)
                                if(item.plan!=0&&item.prod_count>=item.plan)
                                    stateObj={text:"已完成",color:'blue'};
                                else if(item.hasOwnProperty('Status')&&item.Status== 1)
                                    stateObj={text:"生产中",color:'rgba(82, 196, 26, 0.84)'};
                                else if(item.hasOwnProperty('Status') &&item.Status== 2)
                                    stateObj={text:"报警中",color:'#ffc069'};
                                else if(item.hasOwnProperty('Status')&&item.Status== 0)
                                    stateObj={text:"待机中",color:'#4184de'};
                                else if(item.hasOwnProperty('Status') &&item.Status== 3)
                                    stateObj={text:"调机中",color:'#0ab490'};
                                else
                                    stateObj={text:"离线中",color:'#bfbfbf'};

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
                                                <Col className="gutter-row" span={4}>
                                                    <div className="gutter-box">
                                                        {/* <div style={{color:'#1b8ff6',fontSize:20}}>{item.task_no?item.task_no:'P20180207'}</div> */}
                                                        <div>{item.product?item.product:'-'}</div>
                                                    </div>
                                                </Col>
                                                <Col className="gutter-row" span={3}>
                                                    <div className="gutter-box">
                                                        <span>{item.hasOwnProperty('prod_count')?item.prod_count:'-'}</span>
                                                    </div>
                                                </Col>
                                                {/* <Col className="gutter-row" span={3}>
                                                <div className="gutter-box">产量:
                                                <span>{item.task_no?item.task_no:'-'}</span>
                                                </div>
                                                </Col> */}
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
                                                            // percent={parseInt(item.task_progress || 0)}
                                                            percent={parseFloat(((item.prod_count/item.plan )*100|| 0).toFixed(2))}
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
                              total={"总共"+ this.state.stateCount.reduce((pre, now) => now.y + pre, 0)+"台"}
                              data={this.state.stateCount}
                              valueFormat={val =>('&nbsp;&nbsp'+val+'台')}
                              height={294}
                            />
                        </Card>
                        <Card title="时间统计"  style={{marginTop:20}}>
                            {/* <Barchart /> */}
                        </Card>
                    </div>
                  </Col>
                </Row>
            </div>
        )

        const HeadAction=(
            <Button
                onClick={this.toggleRender.bind(this)}
                type="primary"
                icon="rollback"
                >
                返回
            </Button>
        );

        return (
            <PageHeaderLayout
            title="自动化装配车间二"
            wrapperClassName="pageContent" 
            action={showDetal?HeadAction:''}
            BreadcrumbList={Breadcrumb.BCList}>
                {showDetal?DevMonitorDesc:DevMonitorList}
            </PageHeaderLayout>
        )
    }
}
