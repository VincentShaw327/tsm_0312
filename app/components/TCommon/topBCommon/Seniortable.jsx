
import React, {Component} from 'react'
import connect from 'mqtt';
import {
  Grid,
  Clearfix,
  ProgressBar,
  Popover,
  OverlayTrigger,
  popoverBottom,
  Label
} from 'react-bootstrap'
import {
  Button,
  Tabs,
  Icon,
  Row,
  Menu,
  Breadcrumb,
  Badge,
  Dropdown,
  Col,
  Tag,
  Progress,
  Table,
  Layout,
  Card,
  Spin,
  notification,
  Alert,
  Modal,
  Form,
  Input,
  Radio,
  Divider,
  Popconfirm
} from 'antd'
import {Link} from 'dva/router'
import Immutable from 'immutable';

import CFormItem from './CreateFormItem';
import CTextItem from './CreateTextItem';
// 搜索查询栏form 创建新item-form 更新form
import UForm from './UpdateForm';
import CForm from './CreateForm';
import RForm from './RetrieveForm';
import Tiltle from './Tiltle/Tiltle';

import ReactSVG from 'react-svg'

/***  自定义组件库  ***/
import { DoTopgo, DoToparrived } from './ProgressHandler';

const FormItem = Form.Item;

let self
let targeta

//模拟数据  数据模板
const data = [{
  key: 1,
  Name: '连体平眼镜片',
  Note: '-',
  Desc: '-',
  Version: '-',
  children: [{
    key: 11,
    Name: 'AV6-8.4-13',
    Note: '-',
    Version: '-',
  }, {
    key: 12,
    Name: '垫片',
    Note: '-',
    Version: '-',
    children: [{
      key: 121,
      Name: 'AV6-8.4-13',
      Note: '-',
      Version: '-',
    }],
  }, {
    key: 13,
    Name: 'AV6-8.4-13',
    Note: '-',
    Version: '-',
    children: [{
      key: 131,
      Name: 'AV6-8.4-13',
      Note: '-',
      Version: '-',
      children: [{
        key: 1311,
        Name: '垫片',
        Note: '-',
        Version: '-',
      }, {
        key: 1312,
        Name: 'AV2-8.4-13',
        Note: '-',
        Version: '-',
      }],
    }],
  }],
}, {
  key: 2,
  Name: '垫片',
  Note: '-',
  Version: '-',
}];

const CollectionCreateForm = Form.create()(
  (props) => {
    const { visible, onCancel, onCreate, form } = props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        visible={visible}
        title="创建子项"
        okText="确认"
        cancelText="取消"
        onCancel={onCancel}
        onOk={onCreate}>
        <Form layout="vertical">
          <FormItem label="名称">
            {getFieldDecorator('MtrlName', {
              rules: [{ required: true, message: 'Please input the title of collection!' }],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem label="类型">
            {getFieldDecorator('TypeName')(<Input />)}
          </FormItem>
          <FormItem label="版本">
            {getFieldDecorator('Version')(<Input />)}
          </FormItem>
          <FormItem label="使用量">
            {getFieldDecorator('UsedNumber')(<Input />)}
          </FormItem>
          <FormItem className="collection-create-form_last-form-item">
            {getFieldDecorator('modifier', {
              initialValue: 'public',
            })(
              <Radio.Group>
                <Radio value="public">基础物料项</Radio>
                <Radio value="private">半成品项</Radio>
              </Radio.Group>
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
);

const EditableCell = ({ editable, value, onChange }) => (
  <div style={{display: 'inline-block'}}>
    {editable
      ? <Input value={value} onChange={e => onChange(e.target.value)} />
      : value
    }
  </div>
);

export default class App extends Component {

    constructor( props ) {
        super( props )

        this.config = this.props.config

        this.columns = [
            {
              title: '类型',
              dataIndex: 'TypeName',
              key: 'TypeName',
              render: (text, record) => this.renderColumns(text, record, 'TypeName'),
            }, {
              title: '物料ID',
              dataIndex: 'ID',
              key: 'ID',
              render: (text, record) => this.renderColumns(text, record, 'ID'),
            }, {
              title: '物料名称',
              dataIndex: 'MtrlName',
              key: 'MtrlName',
              render: (text, record) => this.renderColumns(text, record, 'MtrlName'),
            }, {
              title: '使用量',
              dataIndex: 'UsedNumber',
              key: 'UsedNumber',
              render: (text, record) => this.renderColumns(text, record, 'UsedNumber'),
            }, {
              title: '单位',
              dataIndex: 'Unit',
              key: 'Unit',
              render: (text, record) => this.renderColumns(text, record, 'Unit'),
            }, {
              title: '操作',
              width: '10%',
              dataIndex: 'operation',
              render: (text, record) => {
                const { editable } = record;
                return (
                  <div className="editable-row-operations">
                    {
                      editable ?
                        <span>
                          <a onClick={() => this.save(record.key)}>保存</a><Divider type="vertical"/>
                          <Popconfirm title="确定取消?" onConfirm={() => this.cancel(record.key)}>
                            <a>取消</a>
                          </Popconfirm>
                        </span>
                        : <span>
                                <a onClick={() => { this.edit(record.key) } }>修改</a>
                                <Divider type="vertical"/>
                                <a onClick={() => this.addItem(record.key)}>添加子项</a>
                          </span>
                    }
                  </div>
                );
              },
            }
        ];

        this.state = {
            data: this.config.resultList || [],
            size: this.config.size ? this.config.size : 'middle', //table尺寸发小
            visible:  false,
            serverUrl: 'http://demo.sc.mes.top-link.me/service/Handler_Bom_V1.ashx',
            loading:  false,
            Version:     '',
            tableKey: 10000,
            target:      [],
            resultList:  [],
            bordered:  false
         };

        self = this;
    }

    render() {

        const pagination = {
            total: self.config.total,
            pageSize: self.config.pageSize,
            onChange: function(num){
                self.setState({
                    loading: true
                })
                self.getpageData(num)
            }
        }

        return (
            <div>
                <CollectionCreateForm
                  ref={this.saveFormRef}
                  visible={this.state.visible}
                  onCancel={this.handleCancel}
                  onCreate={this.handleCreate}/>

                <div style={{ display: 'flex', alignItems: 'center', position: 'relative', margin: '0.5% 0% 10px', borderBottom: '1.6px solid #e8e8e8', padding: '6px 0 6px' }}>
                    <span style={{ flexGrow: '1' }}><Tiltle typeIcon={'table'} centent={self.config.tableTiltle || '物料清单'}/></span>
                    <RForm RType={self.config.RType} submit={self.handleRetrieve} />
                    <CForm CType={self.config.CType} submit={self.handleCreate} />
                </div>

                <Table {...this.state}
                    onExpandedRowsChange={self.expandedRowRender}
                    loading={this.state.loading}
                    columns={this.columns}
                    pagination={pagination}
                    dataSource={self.state.resultList} />
            </div>
        )
    }

    componentWillMount () {
        DoTopgo()

        this.setState({
            loading: true,
        });
    }

    componentDidMount () {
        const self = this
        DoToparrived()
        // 处理接口分页的逻辑
        if(self.config.pageData){
            self.getpageData(1);
        }else{ // 处理 前端分页的逻辑
            self.config.initData(function(list){
                self.setState({
                    loading: false,
                    resultList: list
                })
            })
        }
    }

    /** 初始化数据 **/
    getpageData  = (num) => {
        const self = this
        self.setState({
          loading: true
        })

        self.config.pageData(num, function(list, info){
            self.setState({
                loading: false,
                resultList: list,
                total: info.total,
                pageSize: info.nPageSize || 10,
            })
            self.cacheData = list.map(item => ({ ...item }));
        })
    }

    saveFormRef = (form) => {
        this.form = form;
    }

    handleCancel = () => {
        this.setState({
          visible: false,
        });
    }

    handleCreate = () => {

        const form = this.form;
        form.validateFields((err, values) => {

          if (err) {
            return;
          }
          const newData = [...this.state.resultList];
          const target = this.findtarget(self.state.chancedkey, newData)

          if(target && target.children){
              target.children.push(
                  {
                      key: self.state.tableKey,
                      UUID: this.state.tableKey,
                      MtrlName: values.MtrlName,
                      TypeName: values.TypeName,
                      Unit: values.Unit,
                      UsedNumber: values.UsedNumber,
                      LossRate: values.LossRate,
                      TypeName: values.TypeName,
                      Version: values.Version
                  }
              )
              this.setState({ resultList: newData });
          }else if(target){
              target.children = []
              target.children.push(
                  {
                      key: this.state.tableKey,
                      UUID: this.state.tableKey,
                      MtrlName: values.MtrlName,
                      TypeName: values.TypeName,
                      Unit: values.Unit,
                      UsedNumber: values.UsedNumber,
                      LossRate: values.LossRate,
                      TypeName: values.TypeName,
                      Version: values.Version
                  }
              )

              this.setState({ resultList: newData });
          }

          console.log(self.state.tableKey)

          self.setState({
              tableKey: self.state.tableKey + 1
          })

          console.log(self.state.tableKey)

          form.resetFields();
          this.setState({ visible: false });
        });
    }

    handleRetrieve = () => {


    }

    renderColumns(text, record, column) {
        return (
          <EditableCell
            editable={record.editable}
            value={text}
            onChange={value => this.handleChange(value, record.key, column)}/>
        );
    }

    handleChange = (value, key, column) => {

        const newData = [...this.state.resultList];
        const target = this.findtarget(key, newData)
        if (target) {
          target[column] = value;
          this.setState({ resultList: newData });
        }
    }

    expandedRowRender = (key) => {

        // var bomQueryParams = {
        //     PageIndex : 0,                                                                    //分页：页序号，不分页时设为0
        //     PageSize : -1,                                                                    //分页：每页记录数，不分页时设为-1
        //     ProductModelUUID: -1,                                                    //产品型号UUID，不作为查询条件时取值设为-1
        //     KeyWord : ""                                                                        //模糊查询条件
        // }
        //
        // DoPost(self.state.serverUrl, "ListActive", bomQueryParams, function(res) {
        //     var list = [];
        //     var Ui_list = res.obj.objectlist || [];
        //
        //     var totalcount = res.obj.objectlist.length;
        //     creatKeyWord = res.obj.objectlist.length;
        //     Ui_list.forEach(function(item, index) {
        //         list.push({
        //             key: item.UUID,
        //             UUID: item.UUID,
        //             BomUUID: item.BomUUID,
        //             Type: item.Type,
        //             TypeName: (item.Type == 0) ? "物料" : "中间产品",
        //             ReplaceToUUID: item.ReplaceToUUID,
        //             MtrlUUID: item.MtrlUUID,
        //             Unit: item.Unit,
        //             UsedNumber: item.UsedNumber,
        //             LossRate: item.LossRate,
        //             ConstLossNumber: item.ConstLossNumber,
        //             UpdateDateTime: item.UpdateDateTime,
        //             Status: item.Status,
        //             MtrlID: item.MtrlID,
        //             MtrlName: item.MtrlName,
        //             children: []
        //         })
        //     })
        //     //list = _.sortBy(list, 'key')
        //     const pagination = {
        //         ...self.state.pagination
        //     }
        //
        //     pagination.total = totalcount;
        //     callback(list, {
        //         total: pagination.total,
        //         nPageSize: 8
        //     })
        // }, function(error) {
        //     message.info(error);
        // }, false)

    }

    edit = (key) => {
        const newData = [...this.state.resultList]

        const target = this.findtarget(key, newData)
        if (target) {
          target.editable = true;
          this.setState({ resultList: newData });
        }
    }

    addItem = (key) => {
        self.setState({
            chancedkey: key,
            visible: true
        })
    }

    save = (key) => {
        const newData = [...this.state.resultList];
        const target = this.findtarget(key, newData)
        if (target) {
          delete target.editable;
          this.setState({ resultList: newData });
          this.cacheData = newData.map(item => ({ ...item }));
        }
    }

    cancel = (key) => {
        const newData = [...this.state.resultList];
        const target = newData.filter(item => key === item.key)[0];
        if (target) {
          Object.assign(target, this.cacheData.filter(item => key === item.key)[0]);
          delete target.editable;
          this.setState({ resultList: newData });
        }
    }

    findtarget (key, array1) {

        for(var j = 0; j < array1.length; j++){
            let target = this.findcru(key, array1[j])

            if(target != 'undefined' && target != null){
                return target
                break;
            }
        }
    }

    findcru (key, array) {

        var target = {};
        targeta = 'undefined'

        if( array != 'undefined' && array.length >= 0 ){

            target = array.filter(function(item, i, arr){

                if(item.key === key){

                    self.setState({
                        target: item
                    })
                    targeta = item;
                    self.setState({
                        target: targeta
                    })
                }else if(item.children){
                    self.findcru( key, item.children )
                }
            })
        } else if(array != 'undefined') {

            if(array.key === key){
                self.setState({
                    target: array
                })
                targeta = array
                self.setState({
                    target: targeta
                })
            }else if(array.children){
                self.findcru( key, array.children )
            }
        }

        return targeta
    }
}
