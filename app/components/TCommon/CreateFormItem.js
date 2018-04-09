// 表单独立项 用于对于表单字段的创建

import React from 'react';
import { Form, Select, Input, Button, Icon , DatePicker, TimePicker, Radio, Switch, Cascader, Checkbox,message} from 'antd';
// import BDUploader from './BDUploader';
import AntUploader from './AntUploader';
import { TPostData } from '../../utils/TAjax';
const RangePicker = DatePicker.RangePicker;
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

// 对于使用默认的时间戳
const DefaultTime = new Date();

let CFormItem = React.createClass({
    getInitialState: function() {
        return {
            img_url:'',
            toSavePath:''
        };
        this.savePath='';
    },
    componentWillReceiveProps:function(){
        // console.log("componentWillReceiveProps");
        this.setState?this.setState({toSavePath:''}):''
    },
    /*shouldComponentUpdate:function(){
        console.log("shouldComponentUpdate",this);
    },*/
    componentWillUpdate:function(){
        // console.log("componentWillUpdate");
        // this.setState?this.setState({toSavePath:''}):''

    },
    componentDidUpdate :function(){
        // console.log("componentDidUpdate");
        // this.setState?this.setState({toSavePath:''}):''

    },
    render: function() {
        this.savePath='';
        const getFieldDecorator = this.props.getFieldDecorator;
        const formItemLayout = this.props.formItemLayout || {};
        const item = this.props.item || {};
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
                            {getFieldDecorator('date-picker', {rules:item.rules,initialValue: defaultValue})(
                                <DatePicker  showTime format="YYYY-MM-DD HH:mm:ss" />
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
                            {getFieldDecorator('range-pick', rangeConfig )(
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
              if( item.postJson != '' && typeof(item.postJson) != 'undefined' ){
                TPostData(item.postJson.postUrl, item.postJson.method, item.postJson.dat, function(res) {
                     var Ui_list = res.obj.objectlist || [];
                     var list = []
                     // console.log("查询到类别列表",res);
                     Ui_list.forEach(function(item, index) {
                      list.push({
                        key: index,
                        value: item.UUID.toString(),
                        text: item.Name
                      })
                    })
                    item.options = list
                  }, function(error) {
                    message.info(error);
                  },
                  false
                )
              }
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
              if( item.postJson != '' && typeof(item.postJson) != 'undefined' ){
                TPostData(item.postJson.postUrl, item.postJson.method, item.postJson.dat, function(res) {
                     var Ui_list = res.obj.objectlist || [];
                     // console.log('查询到类别列表',Ui_list);
                     var list = []
                     Ui_list.forEach(function(item, index) {
                      list.push({
                        key: index,
                        value: item.UUID.toString(),
                        text: item.Name||item.ID
                      })
                    })
                    item.options = list
                  }, function(error) {
                    message.info(error);
                  },
                  false
                )
              }
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
                defaultValue =this.state.toSavePath|| defaultValue|| '';
                // console.log("defaultPath",defaultValue);
                // this.setState({img_url:defaultValue})
                // this.changePathUrl(defaultValue);
                return <FormItem
                            label={item.label}
                            key={item.name}
                            {...formItemLayout}>
                            {getFieldDecorator(item.name, { initialValue:defaultValue})(
                                <AntUploader
                                    defaultUrl={defaultValue}
                                    actionUrl={item.url}
                                    onPathChange={this.changePathUrl} />
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
        console.log("路径是：",path);
        // this.savePath=path;
        this.setState({
            // img_url: path
            toSavePath:path
        })
    }
});

export default CFormItem;
