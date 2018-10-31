import React, { Component } from 'react';
import styles from './timeLine.less';
import ReactEcharts from 'echarts-for-react';

export default class statusOverview extends Component {

    constructor( props ) {
        super( props )
        this.state = {
            title: props.title,
        }
    }

    componentDidMount(){
        /*var canvas1=document.getElementById("xAxis");
        var context=canvas1.getContext("2d");

        // var x0=0.1*canvas1.width;
        // var y0=0.9*canvas1.height;
        //the begin of the axis
        // var widthAx=0.8*canvas1.width;
        // var heightAx=0.8*canvas1.height;
        //the width and height of the axis system

        context.beginPath();
        context.moveTo(0,0.5*canvas1.height);
        context.lineTo(1*canvas1.width,0.5*canvas1.height);
        context.strokeStyle='black';
        context.lineWidth=1;
        context.stroke();
        context.closePath();

        context.beginPath();
        context.moveTo(Math.floor(0.08333*canvas1.width)+0.5,0.5*canvas1.height);
        // context.lineWidth=1;
        // context.strokeStyle='black';
        let textX=[0,1,2,3,4,5,6,7,8,9,10,11,12],
                ax0=0,
                ay0=0;
        for (var i = 1; i <12; i++) {
            context.lineTo(Math.floor(0.08333*i*canvas1.width)+0.5, 0.1*canvas1.height);
            console.log("canvas1.width",Math.floor(0.08333*i*canvas1.width)+0.5);
            ax0=0.08333*i*canvas1.width;
            ay0=0.6*canvas1.height;
            // context.stroke();
            // context.beginPath();
            context.font="22px normal";
            context.fillText(textX[i],ax0,ay0);
            context.moveTo(Math.floor(0.08333*(i+1)*canvas1.width)+0.5,0.5*canvas1.height);
        }
        // context.moveTo(0.75*canvas1.width,0.5*canvas1.height);
        // context.lineTo(0.75*canvas1.width,0.8*canvas1.height);
        context.lineWidth=1;
        context.strokeStyle='black';
        context.fillStyle='#4c3571';
        context.stroke();
        // context.fill();
        // context.closePath();*/
    }

    render() {
        const{data,lineLabelList}=this.props;

        const timeDataList=[
            [
                {min:118,type:'run'},
                {min:198,type:'waring'},
                {min:148,type:'OffLine'},
                {min:218,type:'standby'},
                {min:432,type:'run'},
                {min:188,type:'OffLine'},
                {min:13,type:'waring'}
            ],
            [
                {min:108,type:'run'},
                {min:58,type:'waring'},
                {min:18,type:'OffLine'},
                {min:188,type:'standby'},
                {min:432,type:'run'},
                {min:188,type:'OffLine'},
                {min:3,type:'waring'}
            ],
            [
                {min:118,type:'run'},
                {min:198,type:'waring'},
                {min:148,type:'OffLine'},
                {min:218,type:'standby'},
                {min:432,type:'run'},
                {min:188,type:'OffLine'},
                {min:3,type:'waring'}
            ],
            [
                {min:118,type:'run'},
                {min:198,type:'waring'},
                {min:148,type:'OffLine'},
                {min:218,type:'standby'},
                {min:432,type:'run'},
                {min:188,type:'OffLine'},
                {min:3,type:'waring'}
            ],
            [
                {min:118,type:'run'},
                {min:198,type:'waring'},
                {min:148,type:'OffLine'},
                {min:218,type:'standby'},
                {min:432,type:'run'},
                {min:188,type:'OffLine'},
                {min:3,type:'waring'}
            ],
            [
                {min:118,type:'run'},
                {min:198,type:'waring'},
                {min:148,type:'OffLine'},
                {min:218,type:'standby'},
                {min:432,type:'run'},
                {min:188,type:'OffLine'},
                {min:3,type:'waring'}
            ],
            [
                {min:118,type:'run'},
                {min:198,type:'waring'},
                {min:148,type:'OffLine'},
                {min:218,type:'standby'},
                {min:432,type:'run'},
                {min:188,type:'OffLine'},
                {min:3,type:'waring'}
            ],
            [
                {min:118,type:'run'},
                {min:198,type:'waring'},
                {min:148,type:'OffLine'},
                {min:218,type:'standby'},
                {min:432,type:'run'},
                {min:188,type:'OffLine'},
                {min:3,type:'waring'}
            ],
            [
                {min:118,type:'run'},
                {min:198,type:'waring'},
                {min:148,type:'OffLine'},
                {min:218,type:'standby'},
                {min:432,type:'run'},
                {min:188,type:'OffLine'},
                {min:3,type:'waring'}
            ],
        ];

        let lineWidth=0;

        /*const timeLineItem=(
            <div className="timeLineItem" >
                {
                    timeData.map((item,index)=>{
                        lineWidth=Math.round((item.min/1440)*100);
                        console.log('lineWidth',lineWidth);
                        return <span
                                    key={index}
                                    className={item.type}
                                    style={{width:`${lineWidth}%`}}
                                    >{item.type}</span>
                    })
                }
            </div>
        )*/
        // console.log('lineLabelList',lineLabelList);

        const timeLineItem=(timeData,index)=>{

            return  (
                <div className="timeLineItem"  key={index}>
                    <span className="LineLabel">
                        {
                            // lineLabelList.length?lineLabelList[index].Name:''
                            // lineLabelList.length?lineLabelList[index].ID:''
                            timeData.Name
                        }
                    </span>
                    <div className="stateTime">
                        {
                            // timeData.map((item,index)=>{
                            timeData.StatusHistory.map((item,index)=>{
                                lineWidth=Math.round((item.min/1440)*100);
                                // console.log('lineWidth',lineWidth);
                                return <span
                                    key={index}
                                    className={item.type}
                                    style={{width:`${lineWidth}%`}}
                                    ></span>
                            })
                        }
                    </div>
                </div>
            )
        }

        var hours = ['12a', '1a', '2a', '3a', '4a', '5a', '6a',
                '7a', '8a', '9a','10a','11a',
                '12p', '1p', '2p', '3p', '4p', '5p',
                '6p', '7p', '8p', '9p', '10p', '11p'];
        var hours1=[0,60,120,180,240,300,360,420,480,540,600,660,720,780,840,900,960,1020,1080,1140,1200,1260,1320,1380,1440];
        const timeLineAxis={
            tooltip: {
                position: 'top'
            },
            title: [{
                textBaseline: 'middle',
                // text: 'day'
            }],
            singleAxis: [{
                // left: 150,
                left: '12%',
                width:'88%',
                type: 'category',
                boundaryGap: false,
                maxInterval: 3600 * 24 * 1000,
                interval:120,
                data: hours1,
                // top: (idx * 100 / 7 + 5) + '%',
                height: (100 / 7 - 10) + '%',
                axisLabel: {
                    // interval: 2,
                    formatter: function ( value, index ) {
                        let t = Math.floor( value / 60 );
                        let min = value % 60;
                        if ( min < 10 ) min = '0' + min;
                        if ( t < 10 ) t = '0' + t;
                        return `${t}:${min}`;
                    }
                }
            }],
            series: [{
                // singleAxisIndex: idx,
                coordinateSystem: 'singleAxis',
                type: 'scatter',
                // type: 'line',
                itemStyle:{
                    'opacity':0,
                    color:'blue'
                },
                data: [],
                // symbolSize: function (dataItem) {
                //     return dataItem[1] * 4;
                // }
            }]
        };

        return (
            <div className="timeLine">
                <div className="tooltip">
                    <span className="tooltip-item">
                        <span className="tip-run" />
                        <span className="tip-txt">
                            运行中
                        </span>
                    </span>
                    <span className="tooltip-item">
                        <span className="tip-offline"/>
                        <span className="tip-txt">离线中</span>
                    </span>
                    <span className="tooltip-item">
                        <span className="tip-waring"/>
                        <span className="tip-txt">报警中</span>
                    </span>
                    <span className="tooltip-item">
                        <span className="tip-standby"/>
                        <span className="tip-txt">待机中</span>
                    </span>
                </div>
                {
                    data.map((item,index)=>{
                    // timeDataList.map((item,index)=>{
                        // lineWidth=Math.round((item.min/1440)*100);
                        // console.log('lineWidth',lineWidth);
                        return timeLineItem(item,index)
                    })
                }
                {/* <div className="xAxis" id="xAxis" /> */}
                {/* <canvas className="xAxis" id="xAxis" /> */}
                <ReactEcharts
                    option={timeLineAxis}
                    style={{height:35,border:'solid 0px'}}
                    className='react_for_echarts' />
            </div>
        )
    }
}
