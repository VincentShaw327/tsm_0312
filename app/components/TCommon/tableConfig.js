// 纯数据展现情况列表
/********************/
import React from 'react';
import {Table,Form,Select,Input,Button,Icon,Radio,Popconfirm,message,Breadcrumb,Tooltip} from 'antd';
import ReactEcharts from 'echarts-for-react';
import Immutable from 'immutable';
/*********************/
import Expand from './Expandtable';
import OrderExpand from './OrderExpandTable';
// 搜索查询栏form 创建新item-form 更新form
import UForm from './UpdateForm';
// import PForm from './UpdateForm';
import CForm from './CreateForm';
import RForm from './RetrieveForm';
import Tiltle from './Tiltle/Tiltle';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
// 依赖 config 主题生成react 组件函数
const FeatureSet = (config) => {
    //嵌套table的封装调用
    let ExpandFeature = (props) => {
        return (<Expand config={config} isSlider={false} isUpdate={false}/>)
    }

    let OrderExpandFeature = (props) => {
        return (<OrderExpand config={config} isSlider={false} isUpdate={false}/>)
    }

    // 通用table封装调用
    let tableFeature = React.createClass({

        getInitialState: function() {
            return {
                columns: [],
                resultList: [],
                loading: false,
                updateFromShow: false,
                placeFromShow: false,
                updateFromItem: {},
                total: 0,
                pageSize: 10,
                size: config.size
                    ? config.size
                    : 'middle',
                isSlider: config.isSlider,
                isUpdate: config.isUpdate,
                isSelection: config.isSelection
            }
        },
        componentWillMount: function() {
            this.setState({
                loading: true,
                columns: this.dealConfigColumns(config.columns)
            });
        },
        componentDidMount: function() {
            const self = this;
            // 处理接口分页的逻辑
            if (config.pageData) {
                self.getpageData(1);
            } else { // 处理 前端分页的逻辑
                config.initData(function(list) {
                    self.setState({loading: false, resultList: list});
                });
            }
        },
        //获取数据
        getpageData: function(num) {
            const self = this
            self.setState({loading: true})
            config.pageData(num, function(list, info) {
                self.setState({
                    loading: false,
                    resultList: list,
                    total: info.total,
                    pageSize: info.nPageSize || 10,
                    // size:'small'
                })
            })
        },
        // 预处理配置显示中的 colums 数据 用于anted的table配置
        dealConfigColumns: function(lists) {
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
                                                <Popconfirm title={btn.popText} onConfirm={self.operateCallbacks.bind(self, record, btn)} onCancel={self.cancelDelete} okText="Yes" cancelText="No">
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
                } else if (!item.dataIndex) {
                    item.dataIndex = 'NORMAL_INDEX';
                    column.render = item.render || self.renderFunc[item.type];
                } else {
                    column.render = item.render || self.renderFunc[item.type] || ((text) => (<span>{text}</span>));
                }
                if (item.sort) {
                    column.sorter = item.sorter || ((a, b) => a[item.dataIndex] - b[item.dataIndex]);
                }
                columns.push(column);
            });
            return columns;
        },
        // columns 类型对应的通用痛render
        renderFunc: {
            link: (text) => (<span>
                <a href={text}>{text}</a>
            </span>),
            image: (url) => (<span>
                <img src={url}/>
            </span>)
        },

        handleSelect: function(selectedKeys, subtitle) {
            const self = this
            config.uProductCategoryUUID = selectedKeys[0]
            global.slidertitle = subtitle
            self.getpageData()
        },

        handleCreate: function(info) {
            const self = this;
            config.Create(info, function(item) {
                self.getpageData();
            })
        },
        //提交之后的操作
        handleUpdate: function(info) {
            console.log( '看看UPdate提交后的内容', info );
            const self = this;
            let result = Immutable.fromJS(self.state.resultList);
            let infoN = Immutable.fromJS(self.state.updateFromItem).merge(info).toJS();
            config.Update(infoN, function(item) {
                let resultList = result.map(function(v, i) {
                    if (v.get('key') == item.key) {
                        return Immutable.fromJS(item)
                    } else
                        return v;
                    }
                );
                // message.success( '更新成功!' );
                self.setState({
                    loading: false, updateFromShow: false,
                    // resultList: resultList.toJS()
                });
                self.getpageData();
            });
            /*if (info.hasOwnProperty('Image')) {
                config.UpdateImage(infoN, function(item) {
                    self.getpageData();
                    // message.success( '更新成功!' );
                });
            }*/
        },
        //更改设备所属车间
        handlePlace: function(info) {
            // console.log('看看UPdate提交后的内容',info);
            const self = this;
            let result = Immutable.fromJS(self.state.resultList);
            let infoN = Immutable.fromJS(self.state.updateFromItem).merge(info).toJS();
            config.Place(infoN, function(item) {
                let resultList = result.map(function(v, i) {
                    if (v.get('key') == item.key) {
                        return Immutable.fromJS(item)
                    } else {
                        return v
                    }
                })

                message.success('更新成功')

                self.setState({loading: false, updateFromShow: false, resultList: resultList.toJS()});
            });
        },
        //切换弹框显示
        hideUpdateForm: function() {
            this.setState({updateFromShow: false, placeFromShow: false, updateFromItem: {}})
        },
        // 搜索更新处理
        handleRetrieve: function(info) {
            const self = this;
            self.setState({loading: true});
            config.Retrieve(info, function(list) {
                self.setState({loading: false, resultList: list, total: list.length})
            })
        },
        //确认删除后的操作
        confirmDelete: function(item) {
            // message.success('Click on Yes');
            const self = this;
            let resultList;
            // let type = btn.type;
            let itemI = Immutable.fromJS(item);
            let result = Immutable.fromJS(self.state.resultList);
            this.setState({loading: true})
            config.Delete(itemI.toJS(), function() {
                resultList = result.filter(function(v, i) {
                    if (v.get('key') !== itemI.get('key')) {
                        return true;
                    }
                })
                message.success('删除成功');

                self.setState({loading: false, resultList: resultList.toJS()})
            })
        },
        // 取消删除
        cancelDelete: function() {
            message.error('Click on No');
        },
        // table 操作列回调处理
        operateCallbacks: function(item, btn) {
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

                    config.Delete(itemI.toJS(), function() {
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
                    config.bind(itemI.toJS(), function(isSucce) {
                        isSucce
                            ? message.success('添加成功')
                            : message.error('添加失败')
                        self.setState({loading: false})
                    })
                }
            } else if (btn.callback) {
                btn.callback(item);
            }
        },

        render: function() {
            /* table勾选处理函数 */
            const rowSelection = {
                onChange: (selectedRowKeys, selectedRows) => {},
                getCheckboxProps: record => ({
                    disabled: record.name === 'Disabled User', // Column configuration not to be checked
                })
            };
            const self = this
            let table
            let Slider

            if (config.pageData) {
                const pagination = {
                    total: this.state.total,
                    pageSize: this.state.pageSize,
                    onChange: function(num) {
                        self.setState({loading: true})
                        self.getpageData(num)
                    }
                }
                table = <Table rowSelection={this.state.isSelection
                        ? rowSelection
                        : null} dataSource={this.state.resultList} columns={this.state.columns} loading={this.state.loading} pagination={pagination} size={this.state.size}/>;
            } else {
                table = <Table rowSelection={this.state.isSelection
                        ? rowSelection
                        : null} dataSource={this.state.resultList} columns={this.state.columns} loading={this.state.loading} size={this.state.size}/>;
            }

            return <div className={this.props.className}>
                {/* {Slider} */}
                <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        position: 'relative',
                        margin: '0.5% 0% 10px',
                        borderBottom: '1.6px solid #e8e8e8',
                        padding: '6px 0 6px'
                    }}>
                    {/* <span style={{flexGrow: '1'}}>
                        <Tiltle typeIcon={'table'} centent={'查询列表'}/>
                    </span> */}
                    <RForm RType={config.RType} submit={self.handleRetrieve}/>
                    <CForm CType={config.CType} submit={self.handleCreate}/>
                    <UForm UType={config.UType} submit={self.handleUpdate} isShow={this.state.updateFromShow} updateItem={this.state.updateFromItem} hideForm={this.hideUpdateForm}/> {/* <PForm UType={config.PType}  submit={self.handlePlace}  isShow={this.state.placeFromShow} updateItem={this.state.updateFromItem} hideForm={this.hideUpdateForm}/> */}
                </div>
                {table}
                <div style={{
                        clear: 'both'
                    }}></div>
            </div>
        }

    });
    // 图标类表格
    let graphFeature = React.createClass({

        getInitialState: function() {
            return {option: false}
        },

        componentDidMount: function() {

            const self = this;

            config.initData(function(option) {
                self.setState({option: option});
            });

        },

        render: function() {
            const self = this;
            const itemInfo = this.state.item;

            const operate = config.operate || [];

            return <div className={this.props.className}>
                {
                    this.state.option
                        ? <ReactEcharts option={this.state.option} style={config.EchartStyle} className='react_for_echarts'/>
                        : ''
                }
            </div>
        }
    });

    switch (config.type) {
        case 'tableList':
            return tableFeature;
            break;
        case 'OrderExpandTable':
            return OrderExpandFeature;
            break;
        case 'graphList':
            return graphFeature;
            break;
        case 'Expandtable':
            return ExpandFeature;
            break;
        default:
            return tableFeature;
            break;
    }
}

export default FeatureSet;
