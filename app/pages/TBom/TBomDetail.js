/**
 *这是BOM详情
 *添加日期:2018.03.06
 *添加人:shaw
 **/
import React, { Component } from 'react';
import {Icon,Row,Col,Divider,Table,Button,Popconfirm,message } from 'antd';
// import FeatureSetConfig from '../../components/TCommon/tableConfig';
import Tiltle from '../../components/TCommon/Tiltle/Tiltle';
import { _topfOrderBy } from '../../components/TCommon/utils/dataHandle/arrayHandle';
import { TPostData } from '../../utils/TAjax';
import { CModal } from '../../components/TModal';

//作用域
let self
let creatKeyWord;
//工作中心类型下拉框
let MtrlTpList = []
//车间数据下拉
let MtrlTpWorkshopList = []

export default class TBomDetail extends Component {

    constructor( props ) {
        super( props )
        this.state = {
            UUID: props.UUID,
            bom: {},
            BMtrList:[],
            MtrModelList:[],
            updateFromItem:{},
            loading: false,
            CModalShow:false,
            UModalShow:false,
        }
        this.url='/api/TBom/bom';
        self = this;
    }

    componentWillMount() {
        this.getBomDefine();
        this.getMtrModelList();
    }

    componentDidMount() {

    }

    getBomDefine(){
        let obj = {
            "UUID": this.props.UUID ? this.props.UUID : '1'
        }
        TPostData( this.url, "GetDefine", obj,
            ( res )=> {
                console.log('查询到物料列表:',res);

                var list = [];
                var Ui_list = res.obj.objectlist || [];
                Ui_list.forEach( function ( item, index ) {
                    list.push( {
                        key: item.MtrlModelUUID,
                        UUID: item.UUID,
                        BomUUID: item.BomUUID,
                        ReplaceToUUID: item.ReplaceToUUID,
                        MtrlModelUUID: item.MtrlModelUUID,
                        MtrlName: item.MtrlName, //物料型号名称
                        MtrlID: item.MtrlID, //物料型号编码
                        MtrlType: item.Type,
                        // TypeName: ( item.Type == 0 ) ? "物料" : "中间产品",
                        Unit: item.Unit,
                        UsedNumber: item.UsedNumber,
                        LossRate: item.LossRate,
                        ConstLossNumber: item.ConstLossNumber,
                        UpdateDateTime: item.UpdateDateTime,
                        Status: item.Status,
                    } )
                } )
                this.setState({BMtrList:list});
            },
            ( error )=> {
                message.info( error );
            }
        )
    }

    getMtrModelList(){
        const dat = {
            PageIndex: 0,
            PageSize: -1,
            TypeUUID: -1, //保留字段，取值设为-1
            KeyWord: ""
        }
        TPostData('/api/TWms/material_model', "ListActive", dat,
            ( res )=> {
                console.log('查询到物料型号:',res);
                var list = [];
                var Ui_list = res.obj.objectlist || [];
                Ui_list.forEach( function ( item, index ) {
                    list.push( {
                        key: index,
                        value: item.UUID.toString(),
                        TypeUUID: item.TypeUUID,
                        Image: item.Image,
                        text: item.Name,
                        Number: item.ID,
                        TypeName: item.TypeName,
                        Desc: item.Desc,
                        UpdateDateTime: item.UpdateDateTime,
                        Status: 1,
                        TypeID: "-",
                        Note: "-",
                    } )
                } )
                this.setState({MtrModelList:list});
            },
            ( error )=> {
                message.info( error );
            }
        )
    }

    toggleCModalShow(){
        this.setState({CModalShow:!this.state.CModalShow});
    }

    toggleUModalShow(record){
        console.log("更新前",record);
        this.setState({UModalShow:!this.state.UModalShow,updateFromItem:record});
    }

    handleCreat(data){
        console.log('data',data);
        let dat = {
            UUID:this.state.UUID,  //UUID
            MtrlType:data.MtrlType,  //物料类型
            MtrlModelUUID:data.MtrlModelUUID,     //物料型号UUID
            Unit:data.Unit,           //物料计量单位
            UsedNumber:data.UsedNumber
        }
        TPostData(this.url, "AddItem", dat,
            ( res )=> {
                message.success("添加成功！")
                this.getBomDefine();
            },
            (err)=>{
                message.error("添加失败！")
            }
        )
    }

    handleUpdate(data){
        const {updateFromItem}=this.state;
        let dat = {
            ItemUUID:updateFromItem.UUID,                                                    //Bom物料定义UUID
            MtrlType:data.MtrlType,                                                         //物料类型
            MtrlModelUUID:data.MtrlModelUUID,                                              //物料型号UUID
            Unit:data.Unit,                                                              //物料计量单位
            UsedNumber:data.UsedNumber,                                               //使用量
            LossRate : data.LossRate,                                                      //损耗率
            ConstLossNumber : data.ConstLossNumber
        }
        console.log('data',data);
        console.log('updateFromItem',updateFromItem);
        TPostData(this.url, "UpdateItem", dat,
            ( res )=> {
                message.success("更新成功！");
                this.getBomDefine();
            },
            (err)=>{
                message.error("更新失败！");
            }
        )
    }

    deleteMaterial(record){
        let dat = {
            ItemUUID:record.UUID,                                                    //Bom物料定义UUID
        }
        console.log('deleteData',record);
        TPostData(this.url, "RemoveItem", dat,
            ( res )=> {
                message.success("删除成功！");
                this.getBomDefine();
            },
            (err)=>{
                message.error("删除失败！");
            }
        )
    }

    render() {
        const {detailMessage}=this.props;
        const {BMtrList}=this.state;

        const columns= [
            {
                title: '物料名称',
                dataIndex: 'MtrlName',
                key: 'MtrlName'
            },
            {
                title: '物料编号',
                dataIndex: 'MtrlID',
                key: 'MtrlID'
            },
            {
                title: '物料类型',
                dataIndex: 'MtrlType',
                key: 'MtrlType',
                render: ( Type, record ) => {
                    let txt='';
                    txt=Type == 0?"原始物料":"半成品物料";
                    return <span> {txt} </span>
                }
            },
            {
                title: '单位',
                dataIndex: 'Unit',
                key: 'Unit'
            },
            {
                title: '使用量',
                dataIndex: 'UsedNumber',
                key: 'UsedNumber'
            },
            {
                title: '损耗率',
                dataIndex: 'LossRate',
                key: 'LossRate'
            },
            {
                title: '固定损耗量',
                dataIndex: 'ConstLossNumber',
                key: 'ConstLossNumber'
            },
            {
                title: '操作',
                dataIndex: 'UUID',
                key: 'operate',
                render:(UUID,record)=>{
                    return  <span>
                                <a href="#" onClick={this.toggleUModalShow.bind(this,record)}>编辑</a>
                                <span className="ant-divider"></span>
                                <Popconfirm
                                    placement="topLeft"
                                    title="确定删除此物料？"
                                    onConfirm={this.deleteMaterial.bind(this,record)}
                                    okText="确定" cancelText="取消">
                                    <a href="#">删除</a>
                                </Popconfirm>
                            </span>
                }
            }
        ];

        const CFormItem= [
            {
                name: 'MtrlType',
                label: '物料类型',
                type: 'radio',
                placeholder: '请输入使用量',
                rules: [{required: true,message: '请选择物料类型'}],
                defaultValue: '0',
                options: [
                    {key: 0,value: '0',text: '基本物料'},
                    {key: 1,value: '1',text: '半成品'}
                ]
            },
            {
                name: 'MtrlModelUUID',
                label: '物料型号',
                type: 'select',
                placeholder: '请输入物料名称',
                rules: [{required: true,message: '物料名称不能为空'}],
                options:this.state.MtrModelList
            },
            /*{
                name: 'ConstLossNumber',
                label: '固定损耗量',
                type: 'string',
                placeholder: '请输入固定损耗量',
                rules: [{required: true,message: '固定损耗量不能为空'}]
            },
            {
                name: 'LossRate',
                label: '损耗率',
                type: 'string',
                placeholder: '请输入使用量',
                rules: [{required: true,message: '使用量不能为空'}]
            },*/
            {
                name: 'UsedNumber',
                label: '使用量',
                type: 'string',
                placeholder: '请输入使用量',
                rules: [{required: true,message: '使用量不能为空'}]
            },
            {
                name: 'Unit',
                label: '单位',
                type: 'string',
                placeholder: '请输入单位',
                rules: [{required: true,message: '单位不能为空'}]
            }
        ];

        const UFormItem= [
            {
                name: 'MtrlType',
                label: '物料类型',
                type: 'radio',
                placeholder: '请输入使用量',
                rules: [{required: true,message: '请选择物料类型'}],
                // defaultValue: '0',
                options: [
                    {key: 0,value: '0',text: '基本物料'},
                    {key: 1,value: '1',text: '半成品'}
                ]
            },
            {
                name: 'MtrlModelUUID',
                label: '物料型号',
                type: 'select',
                placeholder: '请输入物料名称',
                rules: [{required: true,message: '物料名称不能为空'}],
                options:this.state.MtrModelList
            },
            {
                name: 'ConstLossNumber',
                label: '固定损耗量',
                type: 'string',
                placeholder: '请输入固定损耗量',
                rules: [{required: true,message: '固定损耗量不能为空'}]
            },
            {
                name: 'UsedNumber',
                label: '使用量',
                type: 'string',
                placeholder: '请输入使用量',
                rules: [{required: true,message: '使用量不能为空'}]
            },
            {
                name: 'LossRate',
                label: '损耗率',
                type: 'string',
                placeholder: '请输入使用量',
                rules: [{required: true,message: '使用量不能为空'}]
            },
            {
                name: 'Unit',
                label: '单位',
                type: 'string',
                placeholder: '请输入单位',
                rules: [{required: true,message: '单位不能为空'}]
            }
        ];

        return (
            <div>
                <div style={{marginTop:25,height:150, border:'solid 0px #bbbbbb',borderRadius:6,paddingLeft:8}}>
                    <Row  type="flex" justify="start" align="middle">
                        <Col span={8}>
                            <div style={{
                                    fontSize:16,
                                    display:'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-evenly',
                                    height: 150}}>
                                <p>名称：<span>{detailMessage.Name}</span></p>
                                <p>编号：<span>{detailMessage.ID}</span></p>
                                <p>版本：<span>{detailMessage.Version}</span></p>
                            </div>
                        </Col>
                        <Col span={6}>
                            <div style={{
                                    fontSize:16,
                                    display:'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-evenly',
                                    height: 150}}>
                                <p>产品型号：{detailMessage.ProductModelName}</p>
                                <p>产品序列号：{detailMessage.ProductModelSN}</p>
                                <p>备注：{detailMessage.Note}</p>
                            </div>
                        </Col>
                    </Row>
                </div>
                <div style={{margin:"20px 0"}}>
                    <Button
                        type="primary"
                        icon="plus"
                        onClick={this.toggleCModalShow.bind(this)}>
                        添加
                    </Button>
                </div>
                <div>
                    <Table
                        size={"small"}
                        title={()=><span style={{fontSize:25}}>物料清单</span>}
                        dataSource={BMtrList}
                        columns={columns}/>
                </div>
                <CModal
                    FormItem={CFormItem}
                    submit={this.handleCreat.bind(this)}
                    isShow={this.state.CModalShow}
                    hideForm={this.toggleCModalShow.bind(this)}
                />
                <CModal
                    FormItem={UFormItem}
                    updateItem={this.state.updateFromItem}
                    submit={this.handleUpdate.bind(this)}
                    isShow={this.state.UModalShow}
                    hideForm={this.toggleUModalShow.bind(this)}
                />
            </div>
        )
    }
}
