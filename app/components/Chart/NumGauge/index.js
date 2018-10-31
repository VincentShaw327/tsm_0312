import React from 'react';
import { Chart, Geom, Axis, Coord, Guide, Shape } from 'bizcharts';
import autoHeight from '../autoHeight';

const { Arc, Html, Line } = Guide;

const defaultFormatter = (val) => {
  switch (val) {
    case '2':
      return '差';
    case '4':
      return '中';
    case '6':
      return '良';
    case '8':
      return '优';
    default:
      return '';
  }
};



@autoHeight()
export default class NumGauge extends React.Component {
  render() {

    // const {
    //     pointerWidth=5
    // }=this.props;

    Shape.registerShape('point', 'pointer', {
        drawShape(cfg, group) {
            let point = cfg.points[0]; // 获取第一个标记点
            point = this.parsePoint(point);
            const center = this.parsePoint({ // 获取极坐标系下画布中心点
                x: 0,
                y: 0
            });
            // 绘制指针
            group.addShape('line', {
                attrs: {
                    x1: center.x,
                    y1: center.y,
                    x2: point.x,
                    y2: point.y - 0,
                    // y2: point.y - 20,
                    stroke: cfg.color,
                    lineWidth: pointerWidth,
                    lineCap: 'round'
                }
            });

            return group.addShape('circle', {
                attrs: {
                    x: center.x,
                    y: center.y,
                    r: 12,
                    stroke: cfg.color,
                    lineWidth: pointerWidth-0.5,
                    fill: '#fff'
                }
            });

        }
    });

    const {
      polarTitle:{
          title,
          textStyle='font-size:1.75em;color:rgba(0,0,0,0.43);margin: 0',
          valueStyle='font-size:22px;margin: 0'
      },
      height,
      percent,
      polarData,
      BArcData,
      TopArcData={start:[ 0, 0.965 ],end:[ percent[0].value, 0.965 ]},
      ArcWidth=18,
      forceFit = true,
      formatter = defaultFormatter,
      color = '#2F9CFF',
      bgColor = '#F0F2F5',
      pointerWidth=2
    } = this.props;

    const data = [{ value: 56 }];

    const cols = {
      'value': {
        min: 0,
        max: 100,
        tickInterval: 10,
        nice: false
      }
    };

    return (
        <Chart height={height} data={percent} scale={cols}
            padding={[-16, 0, 16, 0]}
            // padding={[-16, 0, 16, 0]}
            // style={{border:'solid 1px'}}
            forceFit>
         <Coord
            // type='polar'
            // startAngle={-9 / 8 * Math.PI}
            // endAngle={1 / 8 * Math.PI}
            // radius={0.75}
            {...polarData}
         />
         <Axis name='value'
           zIndex={2}
           line={null}
           label={{
               offset: -16,
               textStyle: {fontSize: 18,fill: 'rgba(0, 0, 0, 0.25)',textAlign: 'center',textBaseline: 'middle'}
            }}
           subTickCount={4}
           subTickLine={{length: -8,stroke: '#fff',strokeOpacity: 1}}
           tickLine={{length: -18,stroke: '#fff',strokeOpacity: 1}}
         />
         <Axis name="1" visible ={false} />
         <Guide>
            <Arc
                zIndex={0}
                start={[ 0, 0.965 ]}
                // end={[ 9, 0.965 ]}
                end={[ 99, 0.965 ]}
                style={{stroke: '#000',lineWidth: ArcWidth,opacity: 0.09}}// 底灰色
            />
            <Arc
                zIndex={1}
                // start={[ 0, 0.965 ]}
                // end={[ data[0].value, 0.965 ]}
                {...TopArcData}
                style={{stroke: '#1890FF',lineWidth: ArcWidth,}}
            />
            <Html
                position={[ '50%', '95%' ]}
                html={() => {
                    return (
                        `<div style="width:300px;text-align:center;font-size: 12px;">
                            <p style=${textStyle}>
                                ${title}
                            </p>
                            <p style=${valueStyle}>
                                ${percent[0].value}%
                            </p>
                        </div>`
                    )
                }}
            />
         </Guide>
          <Geom type="point" position="value*1" shape='pointer' color='#1890FF' active={false} style={{stroke: '#fff',lineWidth: 1}}/>
        </Chart>
    );
  }
}
