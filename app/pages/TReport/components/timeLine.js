import React, { Component } from 'react';
import styles from './timeLine.less';

export default class statusOverview extends Component {

    constructor( props ) {
        super( props )
        this.state = {
            title: props.title,
        }
    }

    componentDidMount(){
/*        var canvas1=document.getElementById("xAxis");
        var context=canvas1.getContext("2d");

        var x0=0.1*canvas1.width;
        var y0=0.9*canvas1.height;
        //the begin of the axis
        var widthAx=0.8*canvas1.width;
        var heightAx=0.8*canvas1.height;
        //the width and height of the axis system

        context.moveTo(0,0.5*canvas1.height);
        context.lineTo(1*canvas1.width,0.5*canvas1.height);
        context.strokeStyle='black';
        context.lineWidth=5;
        context.stroke();
        // context.beginPath();
        context.moveTo(0,0.5*canvas1.height);
        context.lineWidth=1;
        // context.strokeStyle='black';
        let textX=[0,1,2,3,4],
                ax0=0,
                ay0=0;
        for (var i = 0; i <12; i++) {
            context.lineTo(0.08333*i*canvas1.width,0.1*canvas1.height);
            ax0=0.08333*i*canvas1.width;
            ay0=0.7*canvas1.height;
            // context.stroke();
            // context.beginPath();
            context.font="12px normal";
            context.fillText(textX[i],ax0,ay0);
            context.moveTo(0.08333*(i+1)*canvas1.width,0.5*canvas1.height);
        }
        context.stroke();*/

    }

    render() {
        const{lineLabelList}=this.props;

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
                {min:198,type:'waring'},
                {min:148,type:'OffLine'},
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

        const timeData=[
            {
                min:118,
                type:'run'
            },
            {
                min:198,
                type:'waring'
            },
            {
                min:148,
                type:'OffLine'
            },
            {
                min:218,
                type:'standby'
            },
            {
                min:432,
                type:'run'
            },
            {
                min:188,
                type:'OffLine'
            },
            {
                min:3,
                type:'waring'
            },
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
        console.log('lineLabelList',lineLabelList);
        const timeLineItem=(timeData,index)=>{

            return  (
                <div className="timeLineItem"  key={index}>
                    <span className="LineLabel">
                        {
                            lineLabelList.length?lineLabelList[index].Name:''
                        }
                    </span>
                    <div className="stateTime">
                        {
                            timeData.map((item,index)=>{
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
                    timeDataList.map((item,index)=>{
                        // lineWidth=Math.round((item.min/1440)*100);
                        // console.log('lineWidth',lineWidth);
                        return timeLineItem(item,index)
                    })
                }
                {/* <div className="xAxis" id="xAxis" /> */}
                <canvas className="xAxis" id="xAxis" />

            </div>
        )
    }
}
