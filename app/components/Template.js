import React, {Component} from 'react';
import { Button, Radio,Row, Col, Divider, List, Timeline, Menu,Card,DatePicker } from 'antd';
import { TPostData, urlBase } from '../../utils/TAjax';

export default class TstateTimeOverview extends Component{

  constructor(props) {
    super(props)
    this.state = {
      title: props.title,
    }
  }

  componentWillMount(){

  }

  componentDidMount(){

  }

  handleChange(){

  }

  render(){
    return(
        <div>
            <Card>
                <div>
                    <Select defaultValue="lucy" style={{ width: 120 }} onChange={handleChange}>
                      <Option value="jack">Jack</Option>
                      <Option value="lucy">Lucy</Option>
                      <Option value="disabled" disabled>Disabled</Option>
                      <Option value="Yiminghe">yiminghe</Option>
                    </Select>
                </div>
            </Card>
        </div>
    )
  }
}
