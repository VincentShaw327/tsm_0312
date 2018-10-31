import React, { Component } from 'react';
import {Cascader,message} from 'antd';
import { TPostData,urlBase } from '../../utils/TAjax';


export default class LazyCascader extends React.Component {
    constructor( props ) {
        super( props )
        this.state = {
            options:this.props.options,
            lazyItemID:0,
            selectedOptions:{}
        }
    }

  onChange = (value, selectedOptions) => {
    // console.log(value, selectedOptions);
    console.log("结束");
    this.setState({
        lazyItemID:value[0],
        // options
    });
    this.props.onChange(value);
  }

  resetValue=(v)=>{
      if(v){
          let options=this.state.options,
              tempList=[];
          tempList=options.map((item,index)=>{
              return {
                        value: item.value,
                        label: item.label,
                        isLeaf: false
                    }
            });
          this.setState({
              options:tempList
          });
      }
  }

  loadData = (selectedOptions) => {
      // console.log("selectedOptions",selectedOptions);
      console.log("开始");
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    const {url,op,obj,lazyItem}=this.props.fetchParameter;
    obj[lazyItem]=targetOption.value;
    TPostData(url,op, obj,
        (res) => {
            console.log("chaxun到里列表：",res);
            var list = [];
            var Ui_list = res.obj.objectlist || [];
            Ui_list.forEach((item, index) => {
                list.push({
                    key: index,
                    value: item.UUID.toString(),
                    label: item.Name})
            })
            // this.setState({WorkCenterList: list});
            targetOption.loading = false;
            targetOption.children=list;
            this.setState({
              options: [...this.state.options],
              selectedOptions:targetOption
            });
        },
        (error) => {
            message.info(error);
        }
    )
  }

  render() {
    return (
      <Cascader
        options={this.state.options}
        loadData={this.loadData}
        onChange={this.onChange}
        // changeOnSelect={false}
        onPopupVisibleChange={this.resetValue}
      />
    );
  }
}
