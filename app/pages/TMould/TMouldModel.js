/**
 *这是模具型号页
 *添加日期:2017.12.06
 *添加人:shaw
 **/
import React, { Component } from 'react'
import { hashHistory, Link } from 'react-router'
import { Button, Icon,Popover,message } from 'antd';
import FeatureSetConfig from '../../components/TCommon/tableConfig';
import { TPostData,urlBase } from '../../utils/TAjax';
let seft

export default class MouldModel extends Component {

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
             *1.type:表格类型
             *2.isSelection:table是否带勾选
             *3.url:查询的url
             *4.columns:table的表头参数
             *5.CType:create创建modal的数据项
             *6.UType:update更新modal的数据项
             *7.RType:查询的数据项
             * **/
            /*==配置参数=======================================*/
            //table类型
            type: 'tableFeature',
            //待处理
            uProductUUID: 0,
            //请求url
            url: '/api/TMold/mold_model',
            // url: this.props.server.url+'Handler_MoldModel_V1.ashx',
            // url: 'http://demo.sc.mes.top-link.me/service/Handler_MoldModel_V1.ashx',
            //table表格是否是可勾选
            isSelection: false,
            //table表格表头参数
            columns: [
                {
                    title: '序号',
                    dataIndex: 'key',
                    type: 'string'
                },
                {
                  title: '图片',
                  dataIndex: 'Image',
                  render:(e,record)=>{
                      const content = (
                          <div>
                            <img width="300"  src={urlBase+e}/>
                          </div>
                        );
                      return (
                          <Popover placement="right"  content={content} trigger="hover">
                            {/* <Button>Right</Button> */}
                            <img height='50' src={urlBase+e}/>
                          </Popover>
                        )
                  }
                }, {
                    title: '名称',
                    dataIndex: 'strMoldModelName',
                    type: 'string'
                }, {
                    title: '编号',
                    dataIndex: 'strMoldModelID',
                    type: 'string'
                }, {
                    title: '规格 （材料/尺寸(注塑：周期)/步距）',
                    dataIndex: 'strMoldModelSize',
                    type: 'string'
                },{
                    title: '穴数',
                    dataIndex: 'strCavity',
                    type: 'string'
                },{
                    title: '备注',
                    dataIndex: 'strMoldModelNote',
                    type: 'string'
                }, {
                    title: '修改时间',
                    dataIndex: 'UpdateDateTime',
                    type: 'string'
                }, {
                    title: '操作',
                    dataIndex: 'operate',
                    type: 'operate', // 操作的类型必须为 operate
                    btns: [
                        {
                            text: '修改',
                            type: 'edit',
                            icon: 'edit'
                        },
                        {
                            text: '删除',
                            type: 'delete',
                            icon: 'delete',
                            havePopconfirm: true,
                            popText: '确定要删除此记录吗?'
                        }
                    ]
                }
            ],
            //更新弹框数据项
            UType: [
                {
                    name: 'strMoldModelName',
                    label: '名称',
                    type: 'string',
                    placeholder: '请输入型号',
                    rules: [{ required: true, message: '请输入型号' }]
                }, {
                    name: 'strMoldModelID',
                    label: '编号',
                    type: 'string',
                    placeholder: '请输入编号',
                    rules: [{ required: true, message: '请输入编号' }]
                }, {
                    name: 'strMoldModelSize',
                    label: '尺寸',
                    type: 'string',
                    placeholder: '尺寸',
                    rules: [{ required: true, message: '请输入尺寸' }]
                },{
                    name: 'strCavity',
                    label: '穴数',
                    type: 'string',
                    placeholder: '请输入模具穴数',
                    rules: [{ required: true,  message: '模具穴数不能为空' }]
                },/* {
                    name: 'strMoldModelDesc',
                    label: '描述',
                    type: 'string',
                    placeholder: '请输入描述'
                },*/ {
                    name: 'strMoldModelNote',
                    label: '备注',
                    type: 'string',
                    placeholder: '请输入备注'
                }, {
                  name: 'Image',
                  label: '图片',
                  type: 'antUpload',
                  url: '/api/tupload/do',
                },
            ],
            //添加的弹出框菜单
            CType: [
                {
                    name: 'strMoldModelName',
                    label: '名称',
                    type: 'string',
                    placeholder: '请输入名称',
                    rules: [{ required: true, message: '请输入名称' }]
                },
                {
                    name: 'strMoldModelID',
                    label: '编号',
                    type: 'string',
                    placeholder: '请输入编号',
                    rules: [{ required: true,  message: '请输入编号' }]
                },
                {
                    name: 'strCavity',
                    label: '穴数',
                    type: 'string',
                    placeholder: '请输入模具穴数',
                    rules: [{ required: true,  message: '模具穴数不能为空' }]
                },
                {
                  name: 'Image',
                  label: '图片',
                  type: 'antUpload',
                  url: '/api/tupload/do',
                },
            ],
            //查询的数据项
            RType: [
                {
                    name: 'keyWord',
                    label: '搜索内容',
                    type: 'string',
                    placeholder: '请输入搜索内容'
                }
            ],

            /*==回调函数=======================================*/
            // 初始化页面的数据 回调函数传入 items 列表
            pageData: function(num, callback) {
                const dat = {
                    nPageIndex: 0,
                    nPageSize: -1
                }
                TPostData(this.url, "ListActive", dat, function(res) {
                    var list = [];
                    console.log("查询到模具型号列表", res);
                    var moldModel_list = res.obj.objectlist || [];
                    var totalCount = res.obj.totalcount;
                    moldModel_list.forEach(function(item, index) {
                        list.push({
                            key: index,
                            UUID: item.UUID,
                            // ModelUUID:item.ModelUUID,
                            strMoldModelID: item.ID,
                            strMoldModelName: item.Name,
                            strMoldModelSize: item.Size,
                            strMoldModelDesc: item.Desc,
                            strMoldModelNote: item.Note,
                            UpdateDateTime:item.UpdateDateTime,
                            strCavity:item.Cavity,
                            Image:item.Image
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
            //添加数据后的操作回调
            Create: function(data, callback) {
                let dat = {
                    key: '1000',
                    ID: data.strMoldModelID,
                    Name: data.strMoldModelName,
                    Cavity:data.strCavity,
                    Path:data.Image
                }
                // console.log("设备创建后的字段",data);
                TPostData(this.url, "Add", dat, function(res) {
                    //这块请求更新数据 成功回调
                    callback(dat);
                })
            },
            //信息更新
            Update: function(data, callback) {
                // console.log("看看MoldModel---UPDATE data",data);
                let dat = {
                    UUID: data.UUID,
                    ID: data.strMoldModelID,
                    Name: data.strMoldModelName,
                    Size: data.strMoldModelSize,
                    Cavity:data.strCavity,
                    Path : data.Image,
                    // Desc: data.strMoldModelDesc,
                    Desc: "-",
                    Note: data.strMoldModelNote,
                }

                TPostData(this.url, "Update", dat, function(res) {
                    //这块请求更新数据 成功回调
                    callback(data);
                })
            },

            /*UpdateImage: function(data, callback) {
                // console.log("看看MoldModel---UPDATE data",data);
                let dat={
                    UUID : data.UUID,
                    Path : data.Image
                }

                TPostData(this.url, "UpdateImage", dat,
                    function(res) {
                        console.log('路径设置成功',res);
                        callback(data);
                    },
                    function(error) {
                        message.info(error);
                    }
                )
            },*/
            // 删除操作
            Delete: function(data, callback) {
                var dat = {
                    UUID: data.UUID,
                    // Status: 0
                }
                // console.log("看看data",data);
                TPostData(this.url, "Inactive", dat, function(res) {
                    //这块请求更新数据 成功回调
                    callback(data);
                })
            },
            // 查询操作回调
            Retrieve: function(data, callback) {
                const dat = {
                    nPageIndex: 0,
                    nPageSize: -1,
                    KeyWord: data.keyWord
                }
                TPostData(this.url, "ListActive", dat, function(res) {
                    var list = [];
                    // console.log("查询到模具型号列表", res);
                    var moldModel_list = res.obj.objectlist || [];
                    var totalCount = res.obj.totalcount;
                    moldModel_list.forEach(function(item, index) {
                        list.push({
                            key: index,
                            UUID: item.UUID,
                            // ModelUUID:item.ModelUUID,
                            strMoldModelID: item.ID,
                            strMoldModelName: item.Name,
                            strMoldModelSize: item.Size,
                            strMoldModelDesc: item.Desc,
                            strMoldModelNote: item.Note,
                            UpdateDateTime:item.UpdateDateTime,
                            uploadImg:item.Image
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
               {/* <PageTitle title = { '模具型号' }/> */}
               <Feature />
            </div>
        )
    }
}
