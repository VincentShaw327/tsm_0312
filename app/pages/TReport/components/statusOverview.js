import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';
import { Fold } from 'components/BCComponents/Charts';

export default class statusOverview extends Component {

    constructor( props ) {
        super( props )
        this.state = {
            title: props.title,
        }
    }

    render() {
        const{workCenterList,data,height=800}=this.props;

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

        const salesData = [
            { 'State': 'WY', 'OfflineTime': 25635, 'ReadyTime': 1890, 'RunningTime': 9314 ,'WarningTime':2641},
            { 'State': 'DC', 'OfflineTime': 30352, 'ReadyTime': 20439, 'RunningTime': 10225 ,'WarningTime':2641},
            { 'State': 'VT', 'OfflineTime': 38253, 'ReadyTime': 42538, 'RunningTime': 15757 ,'WarningTime':2641},
            { 'State': 'ND', 'OfflineTime': 51896, 'ReadyTime': 67358, 'RunningTime': 18794 ,'WarningTime':2641},
            { 'State': 'AK', 'OfflineTime': 72083, 'ReadyTime': 85640, 'RunningTime': 22153,'WarningTime':2641 }
          ];

        // const stateType=['OfflineTime','ReadyTime','RunningTime','WarningTime'];
        const stateType=['离线时间','待机时间','运行时间','告警时间'];
        let colors=['#6a6a6a','#0acb2e','#120dee','#e31111'];
        return (
            <div>
              {/* <ReactEcharts
                  option={option1}
                  style={{height:550}}
                  className='react_for_echarts' /> */}
              <Fold
                height={height}
                title="设备状态总时间统计"
                // data={salesData}
                data={data}
                // colors={colors}
                fields={stateType}
              />
             </div>
        )
    }
}
