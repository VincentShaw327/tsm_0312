import React, {Component} from 'react';
import {browserHistory} from 'react-router';
// import {Link} from 'dva/router';
import { Table, Tabs, Button,  Menu, Icon, Row, Col,Divider,Progress } from 'antd';
import Reqwest from 'reqwest';
import G2 from '@antv/g2';
import { DataSet } from '@antv/data-set';
//自定义组件
// import {DoPost} from '../../server';
// import FormG from '../common/FormG';
// import FeatureSetConfig from '../topBCommon/FeatureSetConfig';
import BoardTable from './BoardTable';
/** 初始化变量 **/
let seft

export default class App extends Component {

    constructor(props) {
        super(props)
        this.state = {
            server: {
                resUrl: 'http://demo.sc.mes.top-link.me/service/',
                status: 'dev'
            },
            loading: false
        }
        seft = this;
    }

    componentDidMount () {
        const { DataView } = DataSet;
        const data = [
          { item: '全自动', count: 45 },
          { item: '半自动', count: 25 },
          { item: '紧急停止', count: 17 },
          { item: '停机', count: 13 },
        ];
        const dv = new DataView();
        dv.source(data).transform({
          type: 'percent',
          field: 'count',
          dimension: 'item',
          as: 'percent'
        });
        const chart = new G2.Chart({
          container: 'mountNode',
          forceFit: true,
          width:400,
          height:300
        });
        chart.source(dv, {
          percent: {
            formatter: val => {
              val = (val * 100) + '%';
              return val;
            }
          }
        });
        chart.coord('theta', {
          radius: 0.75,
          innerRadius: 0.6
        });
        chart.tooltip({
          showTitle: false,
          itemTpl: '<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
        });
        // 辅助文本
        chart.guide().html({
          position: [ '50%', '50%' ],
          html: '<div style="color:#8c8c8c;font-size: 14px;text-align: center;width: 10em;">自动化车间<br><span style="color:#8c8c8c;font-size:20px">200</span>台</div>',
          alignX: 'middle',
          alignY: 'middle'
        });
        chart.intervalStack()
          .position('percent')
          .color('item')
          .label('percent', {
            formatter: (val, item) => {
              return item.point.item + ': ' + val;
            }
          })
          .tooltip('item*percent', (item, percent) => {
            percent = percent * 100 + '%';
            return {
              name: item,
              value: percent
            };
          })
          .style({
            lineWidth: 1,
            stroke: '#fff'
          });
        chart.render();

        const dataWorkTime = [
          { 'State': '#20', '全自动': 6, '半自动': 4, '紧急停止': 8, '停止': 6 },
          { 'State': '#21', '全自动': 10, '半自动': 4, '紧急停止': 4, '停止': 6 },
          { 'State': '#22', '全自动': 6, '半自动': 5, '紧急停止': 7, '停止': 6 },
          { 'State': '#23', '全自动': 6, '半自动': 4, '紧急停止': 8, '停止': 6 },
          { 'State': '#24', '全自动': 6, '半自动': 4, '紧急停止': 8, '停止': 6 },
          { 'State': '#25', '全自动': 6, '半自动': 4, '紧急停止': 8, '停止': 6 }
        ]

        const dvWorkTime = new DataView()
        dvWorkTime.source(dataWorkTime).transform({
          type: 'fold',
          fields: [ '全自动', '半自动', '紧急停止', '停止' ], // 展开字段集
          key: '运行模式', // key字段
          value: '运行时间', // value字段
          retains: [ 'State' ], // 保留字段集，默认为除fields以外的所有字段
          as: 'fold'
        })

        const chartWorkTime = new G2.Chart({
          container: 'Worktime',
          forceFit: true,
          width:400,
          height:300
        })
        chartWorkTime.source(dvWorkTime, {
          fold: {
            formatter: val => {
              val =  + 'h';
              return val;
            }
          }
        })
        chartWorkTime.coord().transpose();
        chartWorkTime.axis('State', {
          label: {
            offset: 6
          }
        })
        chartWorkTime.intervalStack()
        .position('State*运行时间')
        .tooltip('State*运行时间', (State, hour) => {
          hour = hour + 'h';
          return {
            name: State,
            value: hour
          };
        }).color('运行模式');
        chartWorkTime.render();
    }

	render() {

        const boardColumns=[
            {
                render:(record)=>{
                    console.log('test record',record);
                    if(record.status==0)return <Icon type="exclamation-circle" />
                    if(record.status==1)return <Icon type="play-circle" />
                    if(record.status==2)return <Icon type="pause-circle" />
                }
            },
            {title:'序号',dataIndex:'order'},
            {
                title:'设备类型',
                dataIndex:'deviceType',
                render:(record)=>{
                    if(record.deviceType==1)return <span>外壳组装机</span>
                    if(record.deviceType==2)return <span>色母垫片组装机</span>
                    if(record.deviceType==3)return <span>CCD检测</span>
                }
            },
            {title:'设备名称',dataIndex:'name'},
            {
                title:'设备状态',
                dataIndex:'status',
                render:(record)=>{
                    if(record.status==0)return <span>故障中</span>
                    if(record.status==1)return <span>运行中</span>
                    if(record.status==2)return <span>停止中</span>
                }
            },
            {title:'加工产品',dataIndex:'product'},
            // {title:'加工时间',dataIndex:'time'},
            {title:'报警号',dataIndex:'alarm'},
            // {title:'产量',dataIndex:'pCount'},
            // {title:'产能',dataIndex:'pRate'},
            {
                title:'不良率',
                dataIndex:'adverseRate',
                render:(record)=>{
                    return (

                            <Progress style={{background:'white',borderRadius:6}} type="circle" percent={30} width={50} />

                    )
                }
            },
        ]
        const boardData=[
            {order:'1',deviceType:'1',name:'自动机1',status:'1',product:'AGV音视频端子',time:'2018.01.11',alarm:'a-3243'},
            {order:'2',deviceType:'1',name:'自动机2',status:'1',product:'AGV音视频端子',time:'2018.01.11',alarm:'a-3243'},
            {order:'3',deviceType:'1',name:'自动机3',status:'1',product:'AGV音视频端子',time:'2018.01.11',alarm:'a-3243'},
            {order:'4',deviceType:'2',name:'自动机4',status:'1',product:'AGV音视频端子',time:'2018.01.11',alarm:'a-3243'},
            {order:'5',deviceType:'3',name:'自动机5',status:'1',product:'AGV音视频端子',time:'2018.01.11',alarm:'a-3243'},
            {order:'6',deviceType:'2',name:'自动机6',status:'2',product:'光纤水晶头',time:'2018.01.11',alarm:'a-3243'},
            {order:'7',deviceType:'3',name:'自动机7',status:'1',product:'AGV音视频端子',time:'2018.01.11',alarm:'a-3243'},
            {order:'8',deviceType:'2',name:'自动机8',status:'2',product:'HDMI端子',time:'2018.01.11',alarm:'a-3243'},
            {order:'9',deviceType:'2',name:'自动机9',status:'0',product:'AGV音视频端子',time:'2018.01.11',alarm:'a-3243'},
        ]

        return  (<div>
                    <div style={{width:'40%',float:'right',fontSize:25}}>
                        <div>
                          <Row gutter={8}>
                            <Col className="gutter-row" span={8}>
                              <div className="gutter-box">日期:2018.01.21</div>
                            </Col>
                            <Col className="gutter-row" span={7}>
                              <div className="gutter-box">时间:<span>13:35:45</span></div>
                            </Col>
                            <Col className="gutter-row" span={4}>
                              <div className="gutter-box">星期<span>三</span></div>
                            </Col>
                            <Col className="gutter-row" span={5}>
                              <div className="gutter-box">班次:<span>白班</span></div>
                            </Col>
                          </Row>
                        </div>
                    </div>
                    <Divider style={{ margin: '10px 0',fontSize:35 }}>设备状态看板</Divider>
                    <div>

                        <Row gutter={24}>
                          <Col className="gutter-row" span={18} >
                              <div style={{border:'solid 1px #8d8888',padding:15,borderRadius:8,boxShadow:'0px 0px 8px 5px #aaa1a1'}}>
                                  <BoardTable columns={boardColumns} data={boardData} BodyFontsize={18} />
                              </div>
                          </Col>
                          <Col className="gutter-row" span={6}>
                            {/* <div className="gutter-box">时间:<span>13:35:45</span></div> */}
                            <Divider style={{ margin: '10px 0' }}><Icon type="pie-chart" />&nbsp;机器运行时间分布</Divider>
                            <div style={{border:'solid 1px #8d8888',padding:15,borderRadius:8,'box-shadow':'0px 0px 8px 5px #aaa1a1'}}>
                                <div id="mountNode"></div>
                            </div>
                            <Divider style={{ margin: '10px 0' }}><Icon type="bar-chart" />&nbsp;机器作业时间</Divider>
                            <div style={{border:'solid 1px #8d8888',borderRadius:8,'box-shadow':'0px 0px 8px 5px #aaa1a1'}}>
                                <div id="Worktime"> </div>
                            </div>
                          </Col>
                        </Row>
                    </div>
                </div>)
    }
}
