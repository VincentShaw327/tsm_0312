/**
 *这是工作中心类别页
 *添加日期:2017.12.05
 *添加人:shaw
 **/
import React, { Component } from 'react';
import { Button, Icon,message } from 'antd';
import FeatureSetConfig from '../../components/TCommon/shawCommon/tableConfig';
import { TPostData } from '../../utils/TAjax';

let seft
export default class workstationType extends Component {

    constructor(props) {
        super(props)
        this.state = {
            server:this.props.server
        }
        seft = this;
    }

    componentWillMount(){
        const tableConfig = {
            /**
             *基础配置参数
             *1.type:表格类别
             *2.isSelection:table是否带勾选
             *3.url:查询的url
             *4.columns:table的表头参数
             *5.CType:create创建modal的数据项
             *6.UType:update更新modal的数据项
             *7.RType:查询的数据项
             * **/
            /*==配置参数=======================================*/
            //table类别
            type: 'tableFeature',
            //请求url
            url: '/api/TProcess/workcenter_type',
            // url: this.props.server.url+'Handler_WorkstationType_V1.ashx',
            // url: 'http://demo.sc.mes.top-link.me/service/Handler_WorkstationType_V1.ashx',
            //table表格表头配置参数
            columns: [
                {
                    title: '序号',
                    dataIndex: 'key',
                    type: 'string'
                },
                {
                    title: '名称',
                    dataIndex: 'Name',
                    // width:150,
                    type: 'string'
                }, /*{
                    title: '编号',
                    dataIndex: 'ID',
                    // width:150,
                    type: 'string'
                },*/ {
                    title: '描述',
                    dataIndex: 'Desc',
                    // width:150,
                    type: 'string'
                }, {
                    title: '备注',
                    dataIndex: 'Note',
                    // width:150,
                    type: 'string'
                },  {
                    title: '修改时间',
                    dataIndex: 'UpdateDateTime',
                    type: 'string'
                },{
                    title: '操作',
                    dataIndex: 'uMachineUUID',
                    type: 'operate', // 操作的类别必须为 operate
                    // width:80,
                    btns: [
                        {
                            text: '修改',
                            type: 'edit',
                            icon:'edit'
                        },
                        {
                            text: '删除',
                            type: 'delete',
                            icon:'delete',
                            havePopconfirm: true,
                            popText: '确定要删除此记录?'
                        }
                    ]
                }
            ],
            //更新弹框数据项
            UType: [
                {
                    name: 'Name',
                    label: '名称',
                    type: 'string',
                    placeholder: '请输入工作中心名称',
                    rules: [{ required: true, message: '请输入名称' }]
                },/* {
                    name: 'ID',
                    label: '编号',
                    type: 'string',
                    placeholder: '请输入编码',
                    rules: [{ required: true, message: '请输入编码' }]
                },*/ {
                    name: 'Desc',
                    label: '描述',
                    type: 'string',
                    placeholder: '请输入描述',
                    // rules: [{ required: true, message: '请输入工作中心编号,工作中心编号至少2个字符' }]
                }, {
                    name: 'Note',
                    label: '备注',
                    type: 'string',
                    placeholder: '请输入详情'
                }
            ],
            // 可设置的查询字段
            CType: [
                {
                    name: 'Name',
                    label: '名称',
                    type: 'string',
                    placeholder: '请输入名称',
                    rules: [{ required: true, message: '请输入名称' }]
                }/*,{
                    name: 'ID',
                    label: '编号',
                    type: 'string',
                    placeholder: '请输入编码',
                    rules: [{ required: true, message: '请输入编码' }]
                }*/
            ],
            //查询的数据项
            RType: [
                {
                    name: 'keyWord',
                    label: '搜索内容',
                    type: 'string',
                    placeholder: '请输入要搜索的内容'
                }
            ],
            /*==回调函数=======================================*/
            // 初始化页面的数据 回调函数传入 items 列表
            pageData: function(num, callback) {

                const dat = {
                    nPageIndex: 0,
                    nPageSize: -1,
                    KeyWord: ""
                }

                TPostData(this.url, "ListActive", dat, function(res) {
                    var list = [];
                    // console.log( "查询到工作学习类别", res );
                    var workstation_list = res.obj.objectlist || [];
                    var totalCount = res.obj.totalcount;
                    workstation_list.forEach(function(item, index) {
                        list.push({
                            key: index,
                            Name: item.Name,
                            ID: item.ID,
                            Desc: item.Desc,
                            Note: item.Note,
                            UUID: item.UUID,
                            UpdateDateTime:item.UpdateDateTime
                        })
                    })
                    callback(list, {
                        total: totalCount,
                        nPageSize: 10
                    })
                }, function(error) {
                    message.info(error);
                })
            },
            // 模拟添加数据的接口 回调
            Create: function(data, callback) {
                let dat = {
                    key: '1000',
                    // ID: data.ID,
                    ID: "-",
                    Name: data.Name
                }

                TPostData(this.url, "Add", dat, function(res) {
                    callback(dat);
                })
            },
            //客户信息修改
            Update: function(data, callback) {
                let dat = {
                    UUID: data.UUID,
                    Name: data.Name,
                    // ID: data.ID,
                    ID: "-",
                    Desc: data.Desc,
                    Note: data.Note,
                }

                TPostData(this.url, "Update", dat, function(res) {
                    //这块请求更新数据 成功回调
                    callback(data)
                })
            },
            // 删除操作
            Delete: function(data, callback) {
                var dat = {
                    UUID: data.UUID,
                    // Status: 0
                }
                TPostData(this.url, "Inactive", dat, function(res) {
                    //这块请求更新数据 成功回调
                    callback(data);
                })
            },
            // 创建项目所需的字段 与 更新项目所需的字段
            // rules 规范可见 https://github.com/yiminghe/async-validator
            // 查询操作回调
            Retrieve: function(data, callback) {
                const dat = {
                    nPageIndex: 0,
                    nPageSize: -1,
                    KeyWord: data.keyWord
                }

                TPostData(this.url, "ListActive", dat, function(res) {
                    var list = [];
                    // console.log("查询到工作学习类别", res);
                    var workstation_list = res.obj.objectlist || [];
                    var totalCount = res.obj.totalcount;
                    workstation_list.forEach(function(item, index) {
                        list.push({
                            key: index,
                            Name: item.Name,
                            ID: item.ID,
                            Desc: item.Desc,
                            Note: item.Note,
                            UUID: item.UUID,
                            UpdateDateTime:item.UpdateDateTime
                        })
                    })
                    callback(list, {
                        total: totalCount,
                        nPageSize: 10
                    })
                }, function(error) {
                    message.info(error);
                })
            },
        };
        this.feature = FeatureSetConfig(tableConfig);
    }
    render() {
        let Feature=this.feature;
        return (
          <div >
            <Feature/>
          </div>
        )
    }
}
