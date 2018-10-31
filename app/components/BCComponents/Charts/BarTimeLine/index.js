import moment from 'moment';
import React, { Component } from 'react';
import {Button} from 'antd';
import { Chart, Axis, Tooltip,Coord, Geom,Label,Legend } from 'bizcharts';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';
import { DataView } from '@antv/data-set';
import autoHeight from '../autoHeight';
import styles from '../index.less';

@autoHeight()
class BarTimeLine extends Component {
  state = {
    autoHideXLabels: false,
  };

  componentDidMount() {
    window.addEventListener('resize', this.resize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  @Bind()
  @Debounce(400)
  resize() {
    if (!this.node) {
      return;
    }
    const canvasWidth = this.node.parentNode.clientWidth;
    const { data = [], autoLabel = true } = this.props;
    if (!autoLabel) {
      return;
    }
    const minWidth = data.length * 30;
    const { autoHideXLabels } = this.state;

    if (canvasWidth <= minWidth) {
      if (!autoHideXLabels) {
        this.setState({
          autoHideXLabels: true,
        });
      }
    } else if (autoHideXLabels) {
      this.setState({
        autoHideXLabels: false,
      });
    }
  }

  handleRoot = (n) => {
    this.root = n;
  };

  handleRef = (n) => {
    this.node = n;
  };
  export=()=>{
      this.g2Chart.downloadImage();
  }

  render() {
    const {
      height,
      title,
      forceFit = true,
      data,
      color = 'rgba(24, 144, 255, 0.85)',
      // padding=[20,20,20,20],
      padding,
      colors,
      values
    } = this.props;

    const { autoHideXLabels } = this.state;



    const tooltip = [
      'x*y',
      (x, y) => ({
        name: x,
        value: y,
      }),
    ];

    const dv = new DataView();
    dv.source(data).transform({
        type: 'map',
        callback(row) { // 加工数据后返回新的一行，默认返回行数据本身
          row.range = [ row.startTime, row.endTime ];
          row.status=values[row.status];
          row.Period=row.Period;
          return row;
        }
    });

    const scale = {
      range: {
        type: 'time',
        // range:[0,1]
        // mask:'hh:mm:ss',
        nice:true,
        tickCount:10,
        formatter: function(a,b){
            // console.log("formatter",a,);
            return moment(a).format('HH:mm:ss');
            // return a;
        }
      },
      // y: {
      //   min: 0,
      // },
    };

    return (
      <div className={styles.chart} style={{ height }} ref={this.handleRoot}>
        <div ref={this.handleRef}>
          {title && <h4 style={{ marginBottom: 20 }}>{title}</h4>}
          <Chart
            scale={scale}
            height={title ? height - 41 : height}
            forceFit={forceFit}
            // data={data}
            data={dv}
            padding={padding || 'auto'}
            onGetG2Instance={g2Chart => {
              // g2Chart.animate(false);
              this.g2Chart=g2Chart;
              console.log(g2Chart);
            }}
          >
            <Coord transpose />
            <Axis
                name="range"
                title={true}
                position='top'
                subTickCount={1}
            />
            <Axis
              name="task"
              // position='left'
              label={{offset: 12}}
            />
            {/* <Tooltip
                showTitle={false}
                // crosshairs={false}
                crosshairs={{
                  //rect: 矩形框,x: 水平辅助线,y: 垂直辅助线,cross: 十字辅助线。
                  // type: 'rect' || 'x' || 'y' || 'cross',
                  type: 'y'||'rect'||'cross'|| 'x',
                  style: {
                    lineWidth:1,
                    stroke:"#ff0000",
                  }
                }}
            /> */}
            <Geom type="interval"
                position="task*range"
                // color={['field', colors]}
                color={['field', (field)=>{
                    //some code
                    if(field =='离线')return '#010101';
                    else if(field =='待机')return '#318c42';
                    else if(field =='运行')return '#0086bf';
                    else if(field =='告警')return '#e31111';
                    else if(field =='其他')return '#ffffff';
                }]}
                // shape='field'
                // tooltip={tooltip}
                // tooltip={['range*Period*task', (range,Period,task) => {
                //     console.log('task*range',range,Period,task);
                //     let startTime=moment(range[0]).format('HH:mm:ss'),
                //         endTime=moment(range[1]).format('HH:mm:ss');
                //   return {
                //     // 自定义 tooltip 上显示的 title 显示内容等。
                //     // name: field,
                //     title:task,
                //     // value:`${range[0]}~${range[1]}`
                //     value:`${startTime}~${endTime}`
                //   };
                // }]}
                >
                {/* <Label
                    // content="range*field"
                    offset={0}
                    content={["range*field", (range, field)=>{
                        let startUTime=moment(range[0]).format('X'),
                            endUTime=moment(range[1]).format('X'),
                            startTime=moment(range[0]).format('HH:mm:ss'),
                            endTime=moment(range[1]).format('HH:mm:ss'),
                            HTimePeriod=(endUTime-startUTime)/360;

                        // console.log('range',range,(endUTime-startUTime),HTimePeriod);
                        if(HTimePeriod<1) return'';
                        else return `${startTime}~${endTime}`;
                    }]}
                /> */}
                <Legend positon="top" />
            </Geom>
          </Chart>
        </div>
      </div>
    );
  }
}

export default BarTimeLine;
