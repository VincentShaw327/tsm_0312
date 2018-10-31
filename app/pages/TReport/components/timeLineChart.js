import React, { Component } from 'react';
import { Button, Radio, Row, Col, Divider, List, Timeline, Menu, Card, DatePicker } from 'antd';
import ReactEcharts from 'echarts-for-react';
// import { TPostData, urlBase } from '../../utils/TAjax';
import {TimelineChart} from '../../../components/ant-design-pro/Charts';

export default class timeLineChart extends Component {

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

    handleChange() {

    }

    render() {

        const optionData = {
            xAxis: {
                type: 'category',
                data: [ '00:00','01:00','02:00','03:00','04:00',
                '50:00','06:00','07:00','08:00','09:00','10:00',
                '11:00','12:00','13:00','14:00','15:00','16:00']
            },
            yAxis: {
                type: 'value'
            },
            series: [ {
                data: [ 820, 932, 901, 934, 1290, 1330, 1320,864,934,1124,996,1423,1352,1023,1034 ],
                type: 'line',
                smooth: true
          } ]
        };

        const chartData = [];
        for (let i = 0; i < 20; i += 1) {
          chartData.push({
            x: (new Date().getTime()) + (1000 * 60 * 30 * i),
            y1: Math.floor(Math.random() * 100) + 1000,
            y2: Math.floor(Math.random() * 100) + 10,
          });
        }

        return (
            <div>
            <Card>
                {/* <ReactEcharts
                    option={optionData}
                    style={{height:500}}
                    className='react_for_echarts' /> */}
                <TimelineChart
                  height={400}
                  data={chartData}
                  titleMap={{ y1: '产量', y2: '产能' }}
                />
            </Card>
        </div>
        )
    }
}
