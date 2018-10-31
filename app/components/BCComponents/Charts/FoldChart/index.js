import React, { Component } from 'react';
import { Chart, Axis, Tooltip, Geom, Coord, Legend } from 'bizcharts';
import DataSet from '@antv/data-set';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';
import autoHeight from '../autoHeight';
import styles from '../index.less';

@autoHeight()
class Fold extends Component {
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

  render() {

    const {
      height,
      title,
      forceFit = true,
      data,
      fields=['f1','f2','f3'],
      // color = 'rgba(24, 144, 255, 0.85)',
      colors ,
      padding,
    } = this.props;

    var ds = new DataSet();
    var dv = ds.createView().source(data);
    dv.transform({
      type: 'fold',
      // fields: ['小于5岁', '5至13岁', '14至17岁',''], // 展开字段集
      fields:fields,
      // key: '年龄段', // key字段
      key: 'field', // key字段
      value: 'fieldVal', // value字段
      retains: ['State'] // 保留字段集，默认为除fields以外的所有字段
    });

    const { autoHideXLabels } = this.state;

    const scale = {
      x: {
        type: 'cat',
      },
      y: {
        min: 0,
      },
    };

    const tooltip = [
      'x*y',
      (x, y) => ({
        name: x,
        value: y,
      }),
    ];

    return (
      <div className={styles.chart} style={{ height }} ref={this.handleRoot}>
         <div ref={this.handleRef}>
           {title && <h4 style={{ marginBottom: 20 }}>{title}</h4>}
          <Chart
            // scale={scale}
            height={title ? height - 41 : height}
            forceFit={forceFit}
            data={dv}
            padding={padding || 'auto'}
          >
            <Legend />
            <Coord transpose />
            <Axis
              name="State"
              label={{offset: 12}}
              // title={false}
              // label={autoHideXLabels ? false : {}}
              // tickLine={autoHideXLabels ? false : {}}
            />
            <Axis name="fieldVal" />
            <Tooltip
                // showTitle={false}
                // crosshairs={false}
            />
            <Geom
                type="intervalStack"
                // position="x*y"
                position="State*fieldVal"
                // color={color}
                color={['field',colors]}
                // color={'年龄段'}
                // tooltip={tooltip}
                tooltip={['State*fieldVal*field', (State,fieldVal,field) => {
                    // console.log('State*fieldVal*field',State,fieldVal,field);
                    // let startTime=moment(range[0]).format('HH:mm:ss'),
                    //     endTime=moment(range[1]).format('HH:mm:ss');
                  return {
                    //自定义 tooltip 上显示的 title 显示内容等。
                    name: field,
                    title:State,
                    // value:`${range[0]}~${range[1]}`
                    value:`${fieldVal}/min`
                  };
                }]}
            />
          </Chart>
         </div>
       </div>
    );
  }
}

export default Fold;
