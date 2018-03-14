import React, { Component } from 'react';
import { List,Card, Col, Row,Icon,Divider,Carousel} from 'antd';

export default class app extends Component {
    constructor(props){
        super(props);

    }

    render(){
        const data = [
          'Racing car sprays burning fuel into crowd.',
          'Japanese princess to wed commoner.',
          'Australian walks 100km after outback crash.',
          'Man charged over missing wedding girl.',
          'Los Angeles battles huge wildfires.',
        ];
        return(
                <div style={{padding:' 25px'}}>
                    {/* <h2 style={{textAlign:'center',marginBottom:20}}>
                        <span style={{background: '#ECECEC',padding:10,color:'blue'}}>自动装配车间一</span>
                    </h2> */}
                    <div style={{display:'flex','justify-content':'space-around'}}>
                        <div style={{ background: '#ECECEC', padding: '20px',marginBottom:15,width:'75%',borderRadius:8}}>
                            <Row gutter={16}>
                                <Col span={6}>
                                    <Card bordered={false} style={{fontSize:25}}>
                                        <p>总产线:<span>12</span></p>
                                        <p>生产中:<span>8</span></p>
                                        <p>停止中:<span>3</span></p>
                                        <p>故障中:<span>1</span></p>
                                    </Card>
                                </Col>
                                <Col span={6}>
                                    <Card  bordered={false}>
                                        <p>昨日总产量:<span>31200</span></p>
                                        <p>日同比:<span>8%<Icon type="caret-up" style={{color:'blue'}} /></span></p>
                                        <p>今日总排程:<span>60000</span></p>
                                        <p>今日当前产量:<span>21240</span></p>
                                    </Card>
                                </Col>
                                <Col span={6}>
                                    <Card bordered={false}>
                                        <p>上周总产量:<span>211200</span></p>
                                        <p>周同比:<span>2%<Icon type="caret-down" style={{color:'red'}} /></span></p>
                                    </Card>
                                </Col>
                                <Col span={6}>
                                    <Card  bordered={false}>
                                        <p>本周总排程:<span>2112000</span></p>
                                        <p>本周当前产量:<span>1312452</span></p>
                                        <p>完成度:<span>53%</span></p>
                                    </Card>
                                </Col>
                            </Row>
                        </div>
                        <div>
                            <div>
                                <p>日期:<span>2018.01.23</span><span style={{marginLeft:10}}>星期三</span></p>
                                <p>时间:<span>13:23:26</span></p>
                                <p>班次:<span>白班</span></p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div  style={{borderTop:'solid 1px #efefef',borderBottom:'solid 1px #efefef',padding:15}}>
                            <Row gutter={16}>
                                <Col className="gutter-row" span={4}>
                                    <p style={{fontSize:45,color:'#929299'}}>产线一</p>
                                </Col>
                                <Col style={{borderLeft:'solid 1px #efefef'}} className="gutter-row" span={16}>
                                    <Row gutter={16}>
                                        <Col className="gutter-row" span={8}>
                                            <p>订单号:<span>P542567</span></p>
                                            <p>工单号:<span>AGV-0283773</span></p>
                                            <p>产品型号:<span>AGV-06</span></p>
                                        </Col>
                                        <Col className="gutter-row" span={8}>
                                            <p>订单数量:<span>20000</span></p>
                                            <p>订单产量:<span>4000</span></p>
                                            <p>当前完成度:<span>20%</span></p>
                                        </Col>
                                        <Col className="gutter-row" span={8}>
                                            <p>计划交期:<span>2018.01.28</span></p>
                                            <p>当前滞后:<span>5%</span></p>
                                            <p>标准产能:<span>5000 pcs/day</span></p>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col style={{borderLeft:'solid 1px #efefef'}} className="gutter-row" span={4}>
                                    <p>今日排产:<span>1000</span></p>
                                    <p>今日当前产量:<span>400</span></p>
                                    <p>完成度:<span>40%</span></p>
                                </Col>
                            </Row>
                        </div>
                        <div  style={{borderTop:'solid 1px #efefef',borderBottom:'solid 1px #efefef',padding:15}}>
                            <Row gutter={16}>
                                <Col className="gutter-row" span={4}>
                                    <p style={{fontSize:45,color:'#929299'}}>产线二</p>
                                </Col>
                                <Col style={{borderLeft:'solid 1px #efefef'}} className="gutter-row" span={16}>
                                    <Row gutter={16}>
                                        <Col className="gutter-row" span={8}>
                                            <p>订单号:<span>P542567</span></p>
                                            <p>工单号:<span>AGV-0283773</span></p>
                                            <p>产品型号:<span>AGV-06</span></p>
                                        </Col>
                                        <Col className="gutter-row" span={8}>
                                            <p>订单数量:<span>20000</span></p>
                                            <p>订单产量:<span>4000</span></p>
                                            <p>当前完成度:<span>20%</span></p>
                                        </Col>
                                        <Col className="gutter-row" span={8}>
                                            <p>计划交期:<span>2018.01.28</span></p>
                                            <p>当前滞后:<span>5%</span></p>
                                            <p>标准产能:<span>5000 pcs/day</span></p>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col style={{borderLeft:'solid 1px #efefef'}} className="gutter-row" span={4}>
                                    <p>今日排产:<span>1000</span></p>
                                    <p>今日当前产量:<span>400</span></p>
                                    <p>完成度:<span>40%</span></p>
                                </Col>
                            </Row>
                        </div>
                        <div  style={{borderTop:'solid 1px #efefef',borderBottom:'solid 1px #efefef',padding:15}}>
                            <Row gutter={16}>
                                <Col className="gutter-row" span={4}>
                                    <p style={{fontSize:45,color:'#929299'}}>产线三</p>
                                </Col>
                                {/* <Divider type="vertical" /> */}
                                <Col style={{borderLeft:'solid 1px #efefef'}} className="gutter-row" span={16}>
                                    <Row gutter={16}>
                                        <Col className="gutter-row" span={8}>
                                            <p>订单号:<span>P542567</span></p>
                                            <p>工单号:<span>AGV-0283773</span></p>
                                            <p>产品型号:<span>AGV-06</span></p>
                                        </Col>
                                        <Col className="gutter-row" span={8}>
                                            <p>订单数量:<span>20000</span></p>
                                            <p>订单产量:<span>4000</span></p>
                                            <p>当前完成度:<span>20%</span></p>
                                        </Col>
                                        <Col className="gutter-row" span={8}>
                                            <p>计划交期:<span>2018.01.28</span></p>
                                            <p>当前滞后:<span>5%</span></p>
                                            <p>标准产能:<span>5000 pcs/day</span></p>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col style={{borderLeft:'solid 1px #efefef'}} className="gutter-row" span={4}>
                                    <p>今日排产:<span>1000</span></p>
                                    <p>今日当前产量:<span>400</span></p>
                                    <p>完成度:<span>40%</span></p>
                                </Col>
                            </Row>
                        </div>
                        <div  style={{borderTop:'solid 1px #efefef',borderBottom:'solid 1px #efefef',padding:15}}>
                            <Row gutter={16}>
                                <Col className="gutter-row" span={4}>
                                    <p style={{fontSize:45,color:'#929299'}}>产线四</p>
                                </Col>
                                <Col style={{borderLeft:'solid 1px #efefef'}} className="gutter-row" span={16}>
                                    <Row gutter={16}>
                                        <Col className="gutter-row" span={8}>
                                            <p>订单号:<span>P542567</span></p>
                                            <p>工单号:<span>AGV-0283773</span></p>
                                            <p>产品型号:<span>AGV-06</span></p>
                                        </Col>
                                        <Col className="gutter-row" span={8}>
                                            <p>订单数量:<span>20000</span></p>
                                            <p>订单产量:<span>4000</span></p>
                                            <p>当前完成度:<span>20%</span></p>
                                        </Col>
                                        <Col className="gutter-row" span={8}>
                                            <p>计划交期:<span>2018.01.28</span></p>
                                            <p>当前滞后:<span>5%</span></p>
                                            <p>标准产能:<span>5000 pcs/day</span></p>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col style={{borderLeft:'solid 1px #efefef'}} className="gutter-row" span={4}>
                                    <p>今日排产:<span>1000</span></p>
                                    <p>今日当前产量:<span>400</span></p>
                                    <p>完成度:<span>40%</span></p>
                                </Col>
                            </Row>
                        </div>
                    </div>
                    {/* <List
                        size="large"
                        header={<div>Header</div>}
                        footer={<div>Footer</div>}
                        bordered
                        dataSource={data}
                        renderItem={item => (<List.Item>{item}</List.Item>)}
                    /> */}
                </div>
        )
    }

}
