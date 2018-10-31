import React from 'react';
import { Chart, Tooltip, Geom, Legend, Axis } from 'bizcharts';
import DataSet from '@antv/data-set';
import Slider from 'bizcharts-plugin-slider';
import autoHeight from '../autoHeight';
import styles from './index.less';

@autoHeight()
export default class FoldlineChart extends React.Component {
  render() {
    const {
      title,
      height = 400,
      forceFit = true,
      // padding = [0, 0, 0, 0],
      padding = [60, 20, 40, 80],
      titleMap = {
        y1: 'y1',
        y2: 'y2',
      },
      borderWidth = 2,
      data = [
        {
          x: 0,
          y1: 0,
          y2: 0,
        },
      ],
      cols = {
        timeScale: {
          type: 'time',
          tickCount: 10,
          mask: 'HH:MM',
          range: [0, 1],
        },
        value: {
          max,
          min: 0,
        },
      },
      fields=[ 'y1', 'y2' ]
    } = this.props;

    const {
        timeScale= {
          type: 'time',
          tickCount: 10,
          mask: 'HH:MM',
          range: [0, 1],
        },
    }=cols;

    // data.sort((a, b) => a.x - b.x);

    // let max;
    // if (data[0] && data[0].y1 && data[0].y2) {
    //   max = Math.max(
    //     [...data].sort((a, b) => b.y1 - a.y1)[0].y1,
    //     [...data].sort((a, b) => b.y2 - a.y2)[0].y2
    //   );
    // }

    const ds = new DataSet(
    //     {
    //   state: {
    //     start: data[0].x,
    //     end: data[data.length - 1].x,
    //   },
    // }
);

    const dv = ds.createView();
    dv
      .source(data)
      .transform({
        type: 'fold',
        fields: fields, // 展开字段集
        key: 'NumType', // key字段
        value: 'yield', // value字段
      });

/*    const timeScale = {
      type: 'time',
      tickCount: 10,
      mask: 'HH:MM',
      range: [0, 1],
    };

    const cols = {
      x: timeScale,
      value: {
        max,
        min: 0,
      },
    };*/

    const SliderGen = () => (
      <Slider
        padding={[0, padding[1] + 20, 0, padding[3]]}
        width="auto"
        height={26}
        xAxis="x"
        yAxis="y1"
        scales={{ x: timeScale }}
        data={data}
        start={ds.state.start}
        end={ds.state.end}
        backgroundChart={{ type: 'line' }}
        onChange={({ startValue, endValue }) => {
          ds.setState('start', startValue);
          ds.setState('end', endValue);
        }}
      />
    );

    return (
      <div className={styles.timelineChart} style={{ height: height + 30 }}>
        <div>
          {title && <h4>{title}</h4>}
          <Chart height={height} padding={padding} data={dv} scale={cols}  forceFit={forceFit}>
            <Axis name="x" />
            <Axis
                name="yield"
                position='left'
                visible={true}
                // title={true}
                line={{
                  stroke: 'dddddd',
                  fill: '#eeecec',
                  // lineDash: [2, 2, 3],
                  lineWidth: 1
                }}
                label={{formatter: val => `${val}/pcs`}}
            />
            <Tooltip />
            <Legend
                // name="key"
                position="top"
                // itemFormatter={(a,b)=>console.log('yield',a,b)}
            />
            <Geom
                type="line"
                position="x*yield"
                size={borderWidth}
                color="NumType" />
            {/* <Geom
                type='point'
                position="x*value"
                size={4}
                shape={'circle'}
                color={'NumType'}
                style={{ stroke: '#fff', lineWidth: 1}} /> */}
          </Chart>
          {/* <div style={{ marginRight: -20 }}>
            <SliderGen />
          </div> */}
        </div>
      </div>
    );
  }
}
