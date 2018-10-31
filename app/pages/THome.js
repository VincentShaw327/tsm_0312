import React, { Component } from 'react';
import { List, Card, message ,Tooltip ,Icon} from 'antd';
import ReactEcharts from 'echarts-for-react';

// import {NumberCard} from "../components/ChartCards";

export default class THome extends Component {
    // 初始化页面常量 绑定事件方法
    constructor( props, context ) {
        super( props )
        this.state = {
            data: {},
        }

    }

    // 组件已经加载到dom中
    componentDidMount() {

    }


    render() {
        const data = [
            {
                title: '总设备数',
                content:()=>{

                    var options = {
                        /*title : {
                            text: '状态统计分布',
                            subtext: '纯属虚构',
                            x:'right'
                        },*/
                        tooltip: {
                            trigger: 'item',
                            formatter: "{a} <br/>{b} : {c} ({d}%)"
                        },
                        legend: {
                            orient: 'vertical',
                            left: 'left',
                            data: [ '停机中', '运行中', '报警中' ]
                        },
                        series: [
                            {
                                name: '访问来源',
                                type: 'pie',
                                radius: '55%',
                                center: [ '50%', '60%' ],
                                data: [
                                    { value: 3, name: '停机中' },
                                    { value: 6, name: '运行中' },
                                    { value: 1, name: '报警中' },
                                ],
                                itemStyle: {
                                    emphasis: {
                                        shadowBlur: 10,
                                        shadowOffsetX: 0,
                                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                                    }
                                }
                            }
                        ]
                    };

                    return(<ReactEcharts
                        option={options}
                        style={{height:200,width:'90%'}}
                        className='react_for_echarts' />)
                }
            },
            {
                title: 'Title 2',
                content:()=>{}
            },
            {
                title: 'Title 3',
            },
            {
                title: 'Title 4',
            },
        ];
        return (
            <div className="cardContent" style={{background: '#fff'}}>
                  <List
                      grid={{ gutter: 16, column: 4 }}
                      dataSource={data}
                      renderItem={item => (
                        <List.Item>
                          <Card title={item.title}>{item.content&&item.content()}</Card>
                        </List.Item>
                      )}
                    />
            </div>
        )
    }
}
