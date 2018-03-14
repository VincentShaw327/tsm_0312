// 表单独立项 用于对于表单字段的创建
/** react官方 **/
import React from 'react';

/** 第三方 **/
import { Form, Select, Input, Button, Icon , DatePicker, TimePicker, Radio, Switch, Cascader, Checkbox, Upload, Modal, message } from 'antd';

import moment from 'moment';

/** 自定义 **/
import AntUploader from './Uploader/AntUploader';
// import BDUploader from './Uploader/BDUploader';
import CreateDate from './CreateDate';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;

// 对于使用默认的时间戳
const DefaultTime = new Date();

let CFormItem = React.createClass({
    getInitialState: function() {
        return {
            img_url:'',
            defaultValue: ''
        };
    },

    componentDidMount: function(){

    },

    shouldComponentUpdate: function(nextProps, nextState) {
        return true
    },

    render: function() {
        const getFieldDecorator = this.props.getFieldDecorator;
        const formItemLayout = this.props.formItemLayout || {};
        const item = this.props.item || {};
        let defaultValue = item.defaultValue || '';

        switch (item.type){
            case 'string':
                return <FormItem label={item.label}
                              key={item.name}
                                  {...formItemLayout}>
                                  {getFieldDecorator(item.name, {rules:item.rules, initialValue: defaultValue})(
                                      <Input placeholder={ item.placeholder||'' } />
                                  )}
                       </FormItem>
                break;

            case 'date':
                defaultValue = moment(defaultValue || DefaultTime, "YYYY-MM-DD hh:mm:ss");
                return <FormItem
                            label={item.label}
                            key={item.name}
                            {...formItemLayout}>
                            {getFieldDecorator(item.name, { initialValue: defaultValue})(
                                item.dataType ? <CreateDate dataType={item.dataType} /> : <DatePicker showTime format="YYYY-MM-DD hh:mm:ss" />
                            )}
                        </FormItem>
                break;

            case 'select':
              return <FormItem
                          label={item.label}
                          key={item.name}
                          {...formItemLayout}>
                          {getFieldDecorator(item.name, { initialValue: defaultValue })(
                              <Select style={{ width: item.width }} onChange={item.onChange || function(){}}>
                                  {
                                      item.options.map(function(item){
                                          return <Option key={item.value} value={item.value}>{item.text || item.value}</Option>
                                      })
                                  }
                              </Select>
                          )}
                      </FormItem>
                break;
            case 'cascader':
                return <FormItem
                          label={item.label}
                          key={item.name}
                          {...formItemLayout}>
                          {getFieldDecorator(item.name, { initialValue: defaultValue })(
                              <Cascader options={item.options} style={{ width: item.width }} changeOnSelect/>
                          )}
                       </FormItem>
                break;

            case 'radio':
                return <FormItem
                            label={item.label}
                            key={item.name}
                            {...formItemLayout}>

                            {getFieldDecorator(item.name, { initialValue: defaultValue })(
                                <RadioGroup>
                                    {
                                        item.options.map(function(item){
                                            return <Radio key={item.value} value={item.value}>{item.text || item.value}</Radio>
                                        })
                                    }
                                </RadioGroup>
                            )}
                        </FormItem>
                break;

            case 'checkbox':
                return <FormItem
                            label={item.label}
                            key={item.name}
                            {...formItemLayout}>

                            {getFieldDecorator(item.name, { initialValue: defaultValue })(
                                <Checkbox.Group options={item.options} />
                            )}
                        </FormItem>
                break;

            case 'switch':
                return <FormItem
                            label={item.label}
                            key={item.name}
                            {...formItemLayout}>

                            {getFieldDecorator(item.name, { initialValue: defaultValue})(
                                <Switch />
                            )}
                        </FormItem>
                break;

            case 'imageUpload':
                defaultValue = this.state.img_url || defaultValue || '';
                return <FormItem
                            label={item.label}
                            key={item.name}
                            {...formItemLayout}>

                            {getFieldDecorator(item.name, { initialValue:defaultValue})(
                                <Input onChange={this.changeImgUrl} />
                            )}
                            <img className="uploadImg" src={defaultValue}  style={{marginTop:"15px"}}/>

                            {/* <BDUploader success={this.uploadSuccess} /> */}
                        </FormItem>

                break;
            case 'antUpload':
                defaultValue = this.state.img_url || defaultValue || '';
                return <FormItem
                            label={item.label}
                            key={item.name}
                            {...formItemLayout}>
                            {getFieldDecorator(item.name, { initialValue:defaultValue})(
                                <AntUploader defaultUrl={defaultValue} actionUrl={item.url} onPathChange={this.changePathUrl} />
                            )}
                            {/* <img className="uploadImg" src={defaultValue}  style={{marginTop:"15px"}}/> */}
                        </FormItem>

                break;

            default:
                return '';
                break;
        }
    },
    uploadSuccess: function(url){
        this.setState({
            img_url: url
        })
    },
    changeImgUrl: function(e){
        this.setState({
            img_url: e.target.value
        })
    },
    changePathUrl: function(path){
        this.setState({
            img_url: path
        })
    }
});

export default CFormItem;
