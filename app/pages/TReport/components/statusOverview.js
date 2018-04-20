import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';

export default class statusOverview extends Component {

    constructor( props ) {
        super( props )
        this.state = {
            title: props.title,
        }
    }

    render() {
        const{workCenterList}=this.props;

        let option1 = {
            tooltip: {
                trigger: 'axis',
                axisPointer: { // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            legend: {
                data: [ '离线', '待机', '运行中', '报警' ]
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'value',
                /*axisLabel: {
                    formatter: function ( value, index ) {
                        let t = Math.floor( value / 60 );
                        let min = value % 60;
                        if ( min < 10 ) min = '0' + min;
                        if ( t < 10 ) t = '0' + t;
                        return `${t}:${min}`;
                    }
                }*/
            },
            yAxis: {
                type: 'category',
                // data: [ '周一', '周二', '周三', '周四', '周五', '周六', '周日' ]
                data:workCenterList
            },
            series: [
                {
                    name: '离线',
                    type: 'bar',
                    stack: '总量',
                    /*label: {
                        normal: {
                            show: true,
                            position: 'insideRight'
                        }
                    },*/
                    data: [ 182, 102, 131, 34, 90, 30, 20, 136, 86, 39, 29, 282, 122, 182, 212 ],
                },
                {
                    name: '待机',
                    type: 'bar',
                    stack: '总量',
                    /*label: {
                        normal: {
                            show: true,
                            position: 'insideRight'
                        }
                    },*/
                    data: [ 120, 132,254,234,34,34,52,24,152 ]
                },
                {
                    name: '运行中',
                    type: 'bar',
                    stack: '总量',
                    /*label: {
                        normal: {
                            show: true,
                            position: 'insideRight'
                        }
                    },*/
                    data: [ 630, 680, 680, 680,456,345,345,482 ]
                },
                {
                    name: '报警',
                    type: 'bar',
                    stack: '总量',
                    /*label: {
                        normal: {
                            show: true,
                            position: 'insideRight'
                        }
                    },*/
                    data: [34,53,13,65,123,24,52,52,14,23]
                },
          ]
        };

        return (
            <div>
              <ReactEcharts
                  option={option1}
                  style={{height:550}}
                  className='react_for_echarts' />
             </div>
        )
    }
}
