
import React, { Component } from 'react';
import moment from 'moment';
import { Form, Select, Input, Button, Icon , DatePicker, TimePicker, Radio, Switch, Cascader, Checkbox,message} from 'antd';
// import AntUploader from './AntUploader';
import AntUploader from '../../TCommon/AntUploader';
const RangePicker = DatePicker.RangePicker;
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const DefaultTime = new Date();
// import { TPostData } from '../../../utils/TAjax';

export default class CFormItem extends Component{
    constructor( props ) {
        super( props )
        this.state = {
            img_url:''
        }
    }
    changePathUrl=(path)=>{
        this.setState({
            img_url: path
        })
    }

    render() {
        const {
            getFieldDecorator,
            formItemLayout,
            item
        }=this.props;

        // const formItemLayout = formItemLayout || {};
        // const item = item || {};
        let defaultValue = item.defaultValue || (item.type=='number'?0:'');
        switch (item.type){

            case 'string':
                return <FormItem label={item.label}
                                 key={item.name}
                                 {...formItemLayout}>
                                {getFieldDecorator(item.name, {rules:item.rules, initialValue:defaultValue})(
                                  <Input placeholder={item.placeholder||'' } />
                                )}
                        </FormItem>
                break;

            case 'number':
                return <FormItem label={item.label}
                                 key={item.name}
                                 help={item.help}
                                 {...formItemLayout}>
                                {getFieldDecorator(item.name, {rules:item.rules, initialValue:defaultValue})(
                                  <Input placeholder={item.placeholder||'' } />
                                )}
                        </FormItem>
                break;

            case 'date':
                defaultValue = moment(defaultValue || DefaultTime, "YYYY-MM-DD hh:mm:ss");
                return <FormItem
                            label={item.label}
                            key={item.name}
                            {...formItemLayout}>
                            {getFieldDecorator(item.name, {rules:item.rules,initialValue: defaultValue})(
                                <DatePicker showTime format="YYYY/MM/DD" />
                            )}
                        </FormItem>
                break;

            case 'RangePicker':
                defaultValue = moment(defaultValue || DefaultTime, "YYYY-MM-DD hh:mm:ss");
                const rangeConfig = {
                  rules: [{ type: 'array', required: true, message: '请选择日期' }],
                };
                return <FormItem
                            label={item.label}
                            key={item.name}
                            {...formItemLayout}>
                            {getFieldDecorator(item.name, rangeConfig )(
                                <RangePicker
                                    ranges={{ Today: [moment(), moment()], 'This Month': [moment(), moment().endOf('month')] }}
                                    // showTime
                                    format="YYYY/MM/DD HH:mm:ss"
                                    // onChange={onChange}
                                    />
                            )}
                        </FormItem>
                break;

            case 'select':
              return <FormItem
                        label={item.label}
                        key={item.name}
                        {...formItemLayout}>
                        {getFieldDecorator(item.name, {rules:item.rules, initialValue: defaultValue.toString()})(
                            <Select style={{ width: item.width }}>
                                {item.hasAllButtom?<Option key="1000" value="-1" style={{borderBottom:'solid 1px #a4a4a9'}}>全部</Option>:null}
                                {
                                    item.options.map(function(item, i,arr){
                                        return <Option key={i} value={item.value}>{item.text || item.value}</Option>
                                    })
                                }
                            </Select>
                        )}
                      </FormItem>
                break;

            case 'multipleSelect':
              return <FormItem
                        label={item.label}
                        key={item.name}
                        {...formItemLayout}>
                        {getFieldDecorator(item.name, { initialValue: defaultValue})(
                            <Select  mode="multiple" style={{ width: item.width }} onChange={item.onChange || this.props.onSlectChange}>
                                {
                                    item.options.map(function(item, i,arr){

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
                            {
                                getFieldDecorator(item.name, { initialValue: defaultValue })(
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
    }
}
