import React, { Component } from 'react';
import {Table, Button, Radio, Row, Col, Divider,Timeline, Card } from 'antd';
// import { TPostData, urlBase } from '../../utils/TAjax';

export default class TimelineDataTable extends Component {

    constructor( props ) {
        super( props )
        this.state = {
            title: props.title,
        }
    }

    componentWillMount() {

    }

    componentDidMount() {

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
                    period:`${periodStart}:00~${periodEnd}:00`,
                    orderNumber:'Task001',
                    product:"RCA音视频端子",
                    capacity:'1200',
                    yield:this.GetRandomInt(800,1200),
                    OEE:`${this.GetRandomInt(40,90)}%`,
                    status:this.GetRandomInt(0,1)
                }
            )
        }
        return list;
    }

    GetRandomInt(max,min){
        return parseInt(Math.random() * (max - min) + min);
    }

    handleChange() {

    }

    render() {

        const columns = [
            {
                title: '生产时间',
                dataIndex: 'period',
                key: 'lotJobID'
            }, {
                title: '工单号',
                dataIndex: 'orderNumber',
                key: 'orderNumber',
            },
            {
                title: '产品',
                dataIndex: 'product',
                key: 'product',
            },
            {
                title: '产能',
                dataIndex: 'capacity',
                type: 'capacity'
            }, {
                title: '产量',
                dataIndex: 'yield',
                type: 'yield'
            }, {
                title: 'OEE(%)',
                dataIndex: 'OEE',
                type: 'OEE'
            },
            {
                title: '工单状态',
                dataIndex: 'Status',
                key: 'Status',
                render: ( e, record ) => {
                    let status;
                    status=e==0?<span>生产中</span>:<span>已完成</span>;
                    return status;
                    // return <StateBotton stateType='workOrder' state = { record.Status }/>
                }
            }
        ];

        const productData=this.generate();

        return (
            <div>
                <Row gutter={16}>
                    <Col span={16}>
                        <Table
                            columns={columns}
                            dataSource={productData}
                            bordered={true}
                            size="small"
                        />
                    </Col>
                    <Col span={8}>
                        <Card>
                            <Timeline>
                              <Timeline.Item color="green">创建服务现场 2015-09-01</Timeline.Item>
                              <Timeline.Item color="green">创建服务现场 2015-09-01</Timeline.Item>
                              <Timeline.Item color="red">
                                <p>初步排除网络异常1</p>
                                <p>初步排除网络异常2</p>
                                <p>初步排除网络异常3 2015-09-01</p>
                              </Timeline.Item>
                              <Timeline.Item>
                                <p>技术测试异常1</p>
                                <p>技术测试异常2</p>
                                <p>技术测试异常3 2015-09-01</p>
                              </Timeline.Item>
                            </Timeline>
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }
}
