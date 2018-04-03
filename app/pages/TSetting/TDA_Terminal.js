/**
 *这是用户详情页
 *添加日期:2018.03.06
 *添加人:shaw
 **/

import React, {Component} from 'react';
import {
    Table,
    Button,
    Icon,
    Row,
    Col,
    message,
    Divider,
    Tag,
    Input,
    Popconfirm
} from 'antd';
import {TPostData, urlBase} from '../../utils/TAjax';
import avatarPic from '../../images/men01.jpg';
import { CModal } from '../../components/TModal';

const EditableCell = ({editable, value, onChange}) => (<div>
    {
        editable
            ? <Input style={{
                        margin: '-5px 0'
                    }} value={value} onChange={e => onChange(e.target.value)}/>
            : value
    }
</div>);

export default class TDA_Terminal extends Component {
    constructor(props) {
        super(props)
        //组件外的指针.
        const {location} = this.props
        this.state = {
            terminalList: [],
            CModalShow:false,
        }
        this.url = '/api/TIot/dau';
    }

    componentWillMount() {
        this.getTerminalList();
    }

    componentDidMount() {}

    getTerminalList() {
        var dat = {
            PageIndex: 0,
            PageSize: -1,
            KeyWord: ""
        }
        //用户组列表.
        TPostData(this.url, "ListActive", dat, (res) => {
            var list = [];
            var Ui_list = res.obj.objectlist || [];
            console.log("查询到终端列表:", res);
            var totalcount = res.obj.totalcount;
            Ui_list.forEach((item, index) => {
                list.push({
                    key: index,
                    ActiveDateTimeB_UTC: item.ActiveDateTimeB_UTC.slice(0, 10),
                    ActiveDateTimeE_UTC: item.ActiveDateTimeE_UTC,
                    Address: item.Address,
                    AppUUID: item.AppUUID,
                    BornDateTime_UTC: item.BornDateTime_UTC.slice(0, 10),
                    GpsAltitude: item.GpsAltitude,
                    GpsLatitude: item.GpsLatitude,
                    GpsLongitude: item.GpsLongitude,
                    ID: item.ID,
                    IMEI: item.IMEI,
                    LocationUUID: item.LocationUUID,
                    MapAltitude: item.MapAltitude,
                    MapLatitude: item.MapLatitude,
                    MapLongitude: item.MapLongitude,
                    Note: item.Note,
                    ProductUUID: item.ProductUUID,
                    SN: item.SN,
                    SimCardNo: item.SimCardNo,
                    Status: item.Status,
                    UUID: item.UUID,
                    UpdateDateTime_UTC: item.UpdateDateTime_UTC
                })
            });
            this.setState({terminalList: list})
        }, (error) => {
            message.info(error);
        })
    }

    renderColumns(text, record, column) {
        return (<EditableCell editable={record.editable} value={text} onChange={value => this.handleChange(value, record.key, column)}/>);
    }

    handleChange(value, key, column) {
        /*  const newData = [...this.state.data];
          const target = newData.filter(item => key === item.key)[0];
          if (target) {
            target[column] = value;
            this.setState({ data: newData });
          }*/

        const newData = [...this.state.terminalList];
        const target = newData.filter(item => key === item.key)[0];
        if (target) {
            target[column] = value;
            this.setState({data: newData});
        }
    }

    handleCreat(data){
        console.log('data',data);
        let dat = {
            ID: data.ID, //订单编号
        }
        TPostData(this.url, "Add", dat,
            ( res )=> {
                message.success("创建新终端成功！");
                this.getTerminalList();
            },
            (err)=>{
                message.error("创建新终端失败！");
            }
        )
    }

    edit(key) {
        const newData = [...this.state.terminalList];
        const target = newData.filter(item => key === item.key)[0];
        if (target) {
            target.editable = true;
            this.setState({data: newData});
        }
    }

    save(key) {
        const newData = [...this.state.terminalList];
        const target = newData.filter(item => key === item.key)[0];
        if (target) {
            delete target.editable;
            this.setState({data: newData});
            // this.cacheData = newData.map(item => ({ ...item }));
            console.log("要保存的の是：", target);
            let data = {
                UUID: target.UUID, //采集单元UUID
                ID: target.ID, //采集单元编号
                IMEI:parseInt(target.IMEI) , //IMEI
                SN: target.SN, //序列号
                Note: "-" //备注
            }
            TPostData(this.url, "Update", data,
                (res) => {
                    message.success("更新终端信息成功！");
                    // this.setState({terminalList: list})
                },
                (error) => {
                    message.info(error);
                }
            )
        }
    }

    cancel(key) {
        const newData = [...this.state.terminalList];
        const target = newData.filter(item => key === item.key)[0];
        if (target) {
            // Object.assign(target, this.cacheData.filter(item => key === item.key)[0]);
            delete target.editable;
            this.setState({data: newData});
        }
    }

    delete(record){
        let data = {
            UUID: record.UUID, //采集单元UUID
        }
        TPostData(this.url, "Inactive", data,
            (res) => {
                message.success("删除终端成功！");
                this.getTerminalList();
            },
            (error) => {
                message.info(error);
            }
        )
    }

    toggleCModalShow(){
        this.setState({CModalShow:!this.state.CModalShow});
    }

    render() {
        const columns = [
            {
                title: '编号',
                dataIndex: 'ID',
                type: 'string',
                render: (text, record) => this.renderColumns(text, record, 'ID')
            }, {
                title: 'IMEI',
                dataIndex: 'IMEI',
                type: 'string',
                render: (text, record) => this.renderColumns(text, record, 'IMEI')
            }, {
                title: '序列号',
                dataIndex: 'SN',
                type: 'string',
                render: (text, record) => this.renderColumns(text, record, 'SN')
            }, {
                title: 'SimCard号',
                dataIndex: 'SimCardNo',
                type: 'string',
                // render: (text, record) => this.renderColumns(text, record, 'SimCardNo'),
            }, {
                title: '出厂日期',
                dataIndex: 'BornDateTime_UTC',
                type: 'string',
                // render: (text, record) => this.renderColumns(text, record, 'BornDateTime_UTC'),
            }, {
                title: '激活日期',
                dataIndex: 'ActiveDateTimeB_UTC',
                type: 'string',
                // render: (text, record) => this.renderColumns(text, record, 'ActiveDateTimeB_UTC'),
            }, {
                title: '操作',
                dataIndex: 'UUID',
                width: 150,
                render: (text, record) => {
                    const {editable} = record;
                    return (<div className="editable-row-operations">
                        {
                            editable
                                ? <span>
                                        <a onClick={() => this.save(record.key)}>保存</a>
                                        <span className="ant-divider"></span>
                                    <Popconfirm title="确定取消?" onConfirm={() => this.cancel(record.key)}>
                                            <a>取消</a>
                                        </Popconfirm>
                                </span>
                                : <a onClick={() => this.edit(record.key)}>编辑</a>
                        }
                        <span className="ant-divider"></span>
                    <Popconfirm title="确定要删除?" onConfirm={() => this.delete(record)}>
                            <a>删除</a>
                        </Popconfirm>
                        <span className="ant-divider"></span>
                        <a>详情</a>
                    </div>);
                }
            }
        ];

        const CFormItem=[
            {
                name: 'ID',
                label: '终端编号',
                type: 'string',
                placeholder: '请输入终端编号',
                rules: [{required: true,message: '终端编号不能为空'}]
            }
        ];

        return (
            <div>
                <Button type="primary" icon="plus" onClick={this.toggleCModalShow.bind(this)}>添加</Button>
                <Divider/>
                <Table
                    size='small'
                    dataSource={this.state.terminalList}
                    columns={columns}
                    title={()=><span>终端列表</span>}
                    bordered={true}/>
                <CModal
                    FormItem={CFormItem}
                    submit={this.handleCreat.bind(this)}
                    isShow={this.state.CModalShow}
                    hideForm={this.toggleCModalShow.bind(this)}
                />
        </div>
        )
    }
}
