import React, { Component } from 'react';
import {Table,Form,Select,Input,Button,Icon,Radio,Popconfirm,message,
    Breadcrumb,Tooltip} from 'antd';
import Immutable from 'immutable';
/*********************/
import UForm from './UpdateForm';
import CForm from './CreateForm';
import RForm from './RetrieveForm';
// import Tiltle from './Tiltle/Tiltle';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

export default class CommonTable extends Component{
    constructor(props) {
      super(props)
      this.state = {
        title: props.title,
        columns: [],
        resultList: [],
        loading: false,
        updateFromShow: false,
        placeFromShow: false,
        updateFromItem: {},
        total: 0,
        pageSize: 10,
        size: this.props.config.size
        ? this.props.config.size
        : 'middle',
        isSlider: this.props.config.isSlider,
        isUpdate: this.props.config.isUpdate,
        isSelection: this.props.config.isSelection
      }
    }

    componentWillMount(){
        this.setState({
            loading: true,
            columns: this.dealConfigColumns(this.props.config.columns)
        });
    }

    componentDidMount() {
        const self = this;
        // 处理接口分页的逻辑
        if (this.props.config.pageData) {
            self.getpageData(1);
        } else { // 处理 前端分页的逻辑
            this.props.config.initData(function(list) {
                self.setState({loading: false, resultList: list});
            });
        }
    }
    //获取数据
    getpageData(num) {
        const self = this
        self.setState({loading: true})
        this.props.config.pageData(num, function(list, info) {
            self.setState({
                loading: false,
                resultList: list,
                total: info.total,
                pageSize: info.nPageSize || 10,
                // size:'small'
            })
        })
    }

    dealConfigColumns(lists) {
        const self = this;
        let columns = [];
        lists.forEach((item) => {
            let column = {
                title: item.title,
                dataIndex: item.dataIndex,
                key: item.dataIndex,
                width: item.width
            }
            if (item.type === 'operate') {
                // 兼容单一形式与数组形式
                let btns = Array.isArray(item.btns)
                    ? item.btns
                    : [item.btns];
                // 处理表单 操作 栏目以及回调函数
                column.render = item.render || function(txt, record) {
                    return <span>
                        {
                            btns.map(function(btn, i) {
                                if (btn.text) {
                                    if (btn.havePopconfirm) {
                                        return (<span key={i}>
                                            <Popconfirm
                                                title={btn.popText}
                                                onConfirm={self.operateCallbacks.bind(self, record, btn)}
                                                onCancel={message.error('Click on No')}
                                                okText="Yes"
                                                cancelText="No">
                                                <Tooltip placement="right" title={btn.text}>
                                                    <a href="javascript:void 0;">
                                                        {
                                                            btn.icon
                                                                ? <Icon type={btn.icon}/>
                                                                : btn.text
                                                        }
                                                    </a>
                                                </Tooltip>
                                            </Popconfirm>
                                            {
                                                i !== btns.length - 1
                                                    ? <span className="ant-divider"></span>
                                                    : ''
                                            }
                                        </span>);
                                    }
                                    return (<span key={i}>
                                        {/* <a href="javascript:void 0;" onClick={self.operateCallbacks.bind(self, record, btn)}><Icon type={btn.type} /></a> */
                                        }
                                        <Tooltip placement="right" title={btn.text}>
                                            <a href="javascript:void 0;" onClick={self.operateCallbacks.bind(self, record, btn)}>
                                                {
                                                    btn.icon
                                                        ? <Icon type={btn.icon}/>
                                                        : btn.text
                                                }
                                            </a>
                                        </Tooltip>
                                        {
                                            i !== btns.length - 1
                                                ? <span className="ant-divider"></span>
                                                : ''
                                        }
                                    </span>);
                                } else if (btn.render) {
                                    return (<span key={i}>
                                        {btn.render(txt, record)}
                                        {
                                            i !== btns.length - 1
                                                ? <span className="ant-divider"></span>
                                                : ''
                                        }
                                    </span>);
                                }
                            })
                        }
                    </span>
                };
            }
            else if (!item.dataIndex) {
                item.dataIndex = 'NORMAL_INDEX';
                column.render = item.render;
            }
            else {
                column.render = item.render || ((text) => (<span>{text}</span>));
            }
            if (item.sort) {
                column.sorter = item.sorter || ((a, b) => a[item.dataIndex] - b[item.dataIndex]);
            }
            columns.push(column);
        });
        return columns;
    }

    handleCreate(info) {
        const self = this;
        this.props.config.Create(info, function(item) {
            self.getpageData();
        })
    }
    //提交之后的操作
    handleUpdate(info) {
        // console.log( '看看UPdate提交后的内容', info );
        const self = this;
        let result = Immutable.fromJS(self.state.resultList);
        let infoN = Immutable.fromJS(self.state.updateFromItem).merge(info).toJS();
        this.props.config.Update(infoN, function(item) {
            let resultList = result.map(function(v, i) {
                if (v.get('key') == item.key) {
                    return Immutable.fromJS(item)
                } else
                    return v;
                }
            );
            // message.success( '更新成功!' );
            self.setState({
                loading: false,
                updateFromShow: false,
                // resultList: resultList.toJS()
            });
            self.getpageData();
        });
        if (info.hasOwnProperty('uploadImg')) {
            this.props.config.UpdateImage(infoN, function(item) {
                /*let resultList = result.map( function ( v, i ) {
                if ( v.get( 'key' ) == item.key ) {
                    return Immutable.fromJS( item )
                }
                else return v;
            } );
            self.setState( {
                loading: false,
                updateFromShow: false,
                resultList: resultList.toJS()
            } );*/
                self.getpageData();
                // message.success( '更新成功!' );
            });
        }
    }
    //切换弹框显示
    hideUpdateForm() {
        this.setState({updateFromShow: false, placeFromShow: false, updateFromItem: {}})
    }
    // 搜索更新处理
    handleRetrieve(info) {
        const self = this;
        self.setState({loading: true});
        this.props.config.Retrieve(info, function(list) {
            self.setState({loading: false, resultList: list, total: list.length})
        })
    }
    //确认删除后的操作
    confirmDelete(item) {
        // message.success('Click on Yes');
        const self = this;
        let resultList;
        // let type = btn.type;
        let itemI = Immutable.fromJS(item);
        let result = Immutable.fromJS(self.state.resultList);
        this.setState({loading: true})
        this.props.config.Delete(itemI.toJS(), function() {
            resultList = result.filter(function(v, i) {
                if (v.get('key') !== itemI.get('key')) {
                    return true;
                }
            })
            message.success('删除成功');

            self.setState({loading: false, resultList: resultList.toJS()})
        })
    }
    // table 操作列回调处理
    operateCallbacks(item, btn) {
        const self = this;
        if (btn.type) {
            let resultList;
            let type = btn.type;
            let itemI = Immutable.fromJS(item);
            let result = Immutable.fromJS(self.state.resultList);
            // table 操作栏目通用设定为更新与删除两项
            if (type === 'edit') {
                this.setState({updateFromShow: true, updateFromItem: itemI.toJS()});
                // console.log("操作列回调处理item",this.state.updateFromItem);
            } else if (type === 'delete') {
                this.setState({loading: true})

                this.props.config.Delete(itemI.toJS(), function() {
                    resultList = result.filter(function(v, i) {
                        if (v.get('key') !== itemI.get('key')) {
                            return true;
                        }
                    })
                    message.success('删除成功');

                    self.setState({loading: false, resultList: resultList.toJS()})
                })
            } else if (type === 'bind') {
                this.setState({loading: true})
                this.props.config.bind(itemI.toJS(), function(isSucce) {
                    isSucce
                        ? message.success('添加成功')
                        : message.error('添加失败')
                    self.setState({loading: false})
                })
            }
        } else if (btn.callback) {
            btn.callback(item);
        }
    }

    render(){
        const self = this
        let table
        let Slider

        if (this.props.config.pageData) {
            const pagination = {
                total: this.state.total,
                pageSize: this.state.pageSize,
                onChange: function(num) {
                    self.setState({loading: true})
                    self.getpageData(num)
                }
            }
            table = <Table
                dataSource={this.state.resultList}
                columns={this.state.columns}
                loading={this.state.loading}
                pagination={pagination}
                size={this.state.size}/>;
        }
        else {
            table = <Table
                dataSource={this.state.resultList}
                columns={this.state.columns}
                loading={this.state.loading}
                size={this.state.size}/>;
        }

        return
            <div className={this.props.className}>
                <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        position: 'relative',
                        margin: '0.5% 0% 10px',
                        borderBottom: '1.6px solid #e8e8e8',
                        padding: '6px 0 6px'
                    }}>
                    <span style={{flexGrow: '1'}}>
                        {/* <Tiltle typeIcon={'table'} centent={'查询列表'}/> */}
                    </span>
                    <RForm RType={this.props.config.RType} submit={self.handleRetrieve}/>
                <CForm 
                    CType={this.props.config.CType}
                    submit={self.handleCreate}/>
                <UForm UType={this.props.config.UType}
                        submit={self.handleUpdate}
                        isShow={this.state.updateFromShow}
                        updateItem={this.state.updateFromItem}
                        hideForm={this.hideUpdateForm}/>
                </div>
                {table}
                <div style={{clear: 'both'}}></div>
            </div>
    }
}
