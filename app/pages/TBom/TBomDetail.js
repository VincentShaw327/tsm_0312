/**
 *这是BOM详情
 *添加日期:2018.03.06
 *添加人:shaw
 **/
import React, { Component } from 'react';
import {Icon,Input,Row,Col,Divider,Modal,Radio ,Table,Form,Button,Popconfirm,message,Select  } from 'antd';
import { TPostData } from 'utils/TAjax';
import { CModal } from 'components/TModal';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;

export default class TBomDetail extends Component {

    constructor( props ) {
        super( props )
        this.state = {
            UUID: props.UUID,
            UpdateUUID:0,
            bom: {},
            BMtrList:[],
            MtrModelList:[],
            ProductModelList:[],
            updateFromItem:{},
            loading:true,
            loading: false,
            CModalShow:false,
            UModalShow:false,
            Modalshow:false,
            EModalshow:false,
            isBaseMtrl:true,
            selectedItem:'0',
            MtrlTypeValue:'0',
            MtrlModelValue:'',
            ProModelValue:'',
            UsedNumberValue:0,
            UnitValue:''
        }
        this.url='/api/TBom/bom';
    }

    componentWillMount() {
        this.getBomDefine();
        this.getMtrModelList();
        this.getProModelList();
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
                        key: index,
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
                this.setState({BMtrList:list,loading:false});
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

    getProModelList(){
        const dat = {
            PageIndex : 0,
            PageSize : -1,
            TypeUUID : -1,
            KeyWord : ""
        }
        TPostData( '/api/TProduct/product_model', "ListActive", dat,
            ( res )=> {
              var list = [];
              console.log("查询到产品型号列表", res);
              var data_list = res.obj.objectlist || [];
              var totalcount = res.obj.totalcount;
              data_list.forEach(( item, index )=> {
                list.push( {
                  key:index,
                  value : item.UUID.toString(),
                  TypeUUID: item.TypeUUID,
                  Image:item.Image,
                  text:item.Name,
                  Status :1,
                  Note : "-",
                } )
              } )
              this.setState({ProductModelList:list});
            },
            ( error )=> {
              message.info( error );
            }
        )
    }

    toggleCModalShow=()=>{
        // this.setState({CModalShow:!this.state.CModalShow});
        this.setState(
            {
                Modalshow:!this.state.Modalshow,
                isBaseMtrl:true,
                MtrlTypeValue:0,
                MtrlModelValue:'',
                ProModelValue:'',
                UserNumberValue:0,
                UnitValue:'',
                LossRateValue:'',
                LossNumberValue:0
            }
        );
    }

    toggleEModalShow=(record)=>{
        console.log("record",record);
        this.setState(
            {
                EModalshow:!this.state.EModalshow,
                isBaseMtrl:record.MtrlType==0?true:false,
                UpdateUUID:record.UUID,
                MtrlTypeValue:record.MtrlType,
                MtrlModelValue:record.MtrlModelUUID&&record.MtrlModelUUID.toString(),
                ProModelValue:record.MtrlModelUUID&&record.MtrlModelUUID.toString(),
                UsedNumberValue:record.UsedNumber,
                UnitValue:record.Unit,
                LossRateValue:record.LossRate,
                LossNumberValue:record.ConstLossNumber
            }
        );
    }

    toggleUModalShow(record){
        console.log("更新前",record);
        this.setState({UModalShow:!this.state.UModalShow,updateFromItem:record});
    }

    handleCreat=(data)=>{
        console.log('data',data);
        const {MtrlType,MtrlModelUUID,ProModelUUID,Unit,UsedNumber}=data;
        let dat = {
            UUID:this.state.UUID,  //UUID
            MtrlType:MtrlType,  //物料类型
            MtrlModelUUID:MtrlType==0?MtrlModelUUID:ProModelUUID,     //物料型号UUID
            Unit:Unit,           //物料计量单位
            UsedNumber:UsedNumber
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

    handleUpdate=(data)=>{
        const {updateFromItem,UpdateUUID}=this.state;
        const {MtrlType,MtrlModelUUID,ProModelUUID,Unit,UsedNumber,LossRate,ConstLossNumber}=data;

        let dat = {
            ItemUUID:UpdateUUID,                                                    //Bom物料定义UUID
            MtrlType:MtrlType,                                                         //物料类型
            MtrlModelUUID:MtrlType==0?MtrlModelUUID:ProModelUUID,     //物料型号UUID
            // MtrlModelUUID:MtrlModelUUID,                                              //物料型号UUID
            Unit:Unit,                                                              //物料计量单位
            UsedNumber:UsedNumber,                                               //使用量
            LossRate : LossRate,                                                      //损耗率
            ConstLossNumber : ConstLossNumber
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

    toggleItem=(e)=>{
        console.log('toggleItem',e);
        this.setState({selectedItem:e.target.value});
    }

    addBomItem=()=>{
        // validateFields
        // getFieldsValue
        this.props.form.validateFields(
            [
                'MtrlType',
                'MtrlModelUUID',
                'ProModelUUID',
                'UsedNumber',
                'Unit'
            ],
            ( errors, values ) => {
            console.log('收到表单值：', values);
            let subValue = {};
            if ( !!errors ) {
                console.log( 'Errors in form!!!' );
                message.error( '添加失败' )
                return;
            } else {
                this.handleCreat( values );
                this.toggleCModalShow();
                this.props.form.resetFields();
                // message.success('添加成功');
            }
        } );
    }

    editBomItem=()=>{
        this.props.form.validateFields( ( errors, values ) => {
            console.log('收到表单值：', values);
            let subValue = {};
            if ( !!errors ) {
                console.log( 'Errors in form!!!' );
                message.error( '添加失败' )
                return;
            } else {
                this.handleUpdate( values );
                this.setState({EModalshow:!this.state.EModalshow});
                this.props.form.resetFields();
                // message.success('添加成功');
            }
        } );
    }

    toggleMtrlType=(e)=>{
        // console.log("toggleMtrlType",e);
        let value=e.target.value;
        this.setState({isBaseMtrl:value==0?true:false});
    }

    resetField=()=>{
        this.props.form.resetFields();
        this.setState({
            EModalshow:false,
            Modalshow:false,
            // isBaseMtrl:false
        });
    }

    render() {
        const {detailMessage,form:{getFieldDecorator},}=this.props;
        const {
            BMtrList,
            MtrModelList,
            ProductModelList,
            MtrlTypeValue,
            MtrlModelValue,
            ProModelValue,
            UsedNumberValue,
            UnitValue,
            LossRateValue,
            LossNumberValue,
            isBaseMtrl
        }=this.state;

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
                                <a href="#" onClick={this.toggleEModalShow.bind(this,record)}>编辑</a>
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
                toggleItem:this.toggleItem,
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
                currentItem:'0',
                selectedItem:this.state.selectedItem,
                rules: [{required: true,message: '物料名称不能为空'}],
                options:this.state.MtrModelList
            },
            {
                name: 'productModelUUID',
                label: '产品型号',
                type: 'select',
                placeholder: '请选择产品型号',
                currentItem:'1',
                selectedItem:this.state.selectedItem,
                rules: [{required: true,message: '产品型号不能为空'}],
                options:this.state.ProductModelList
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

        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 },
        };

        return (
            <div className="cardContent">
                {/* <div style={{marginTop:25,height:150, border:'solid 0px #bbbbbb',borderRadius:6,paddingLeft:8}}>
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
                </div> */}
                <div style={{margin:"20px 0"}}>
                    <Button
                        type="primary"
                        icon="plus"
                        // onClick={this.toggleCModalShow.bind(this)}>
                        onClick={this.toggleCModalShow.bind(this)}>
                        添加
                    </Button>
                </div>
                <div>
                    <Table
                        loading={this.state.loading}
                        size={"small"}
                        rowKey={record => record.key}
                        title={()=><span style={{fontSize:25}}>物料清单</span>}
                        dataSource={BMtrList}
                        columns={columns}/>
                </div>
                <Modal
                    title="新建对象"
                    visible={this.state.Modalshow}
                    onOk={this.addBomItem}
                    onCancel={this.toggleCModalShow}>
                        <Form layout="horizontal">
                            <FormItem
                                label="物料类型"
                                key="MtrlType"
                                {...formItemLayout}>
                                {
                                    getFieldDecorator("MtrlType", {rules:[{required: true,message: '请选择物料类型'}], initialValue: MtrlTypeValue })(
                                    <RadioGroup onChange={this.toggleMtrlType}>
                                        <Radio key="0" value={0}>基础物料</Radio>
                                        <Radio key="1" value={1}>半成品物料</Radio>
                                    </RadioGroup>
                                )}
                            </FormItem>
                            <FormItem
                                label="物料型号"
                                key="MtrlModel"
                                {...formItemLayout}>
                                {
                                    getFieldDecorator("MtrlModelUUID", {rules:!isBaseMtrl?[]:[{required: true,message: '请选择物料型号'}], initialValue: MtrlModelValue })(
                                    <Select disabled={!isBaseMtrl}>
                                        {
                                            MtrModelList.map(function(item, i,arr){
                                                return <Option key={i} value={item.value}>{item.text || item.value}</Option>
                                            })
                                        }
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem
                                label="产品型号"
                                key="ProModel"
                                {...formItemLayout}>
                                {
                                    getFieldDecorator("ProModelUUID", {rules:isBaseMtrl?[]:[{required: true,message: '请选择产品型号'}], initialValue: ProModelValue })(
                                    <Select disabled={isBaseMtrl}>
                                        {
                                            ProductModelList.map(function(item, i,arr){
                                                return <Option key={i} value={item.value}>{item.text || item.value}</Option>
                                            })
                                        }
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem
                                label="使用量"
                                key="UserNumber"
                                {...formItemLayout}>
                                {
                                    getFieldDecorator("UsedNumber", {rules:[{required: true,message: '请输入使用量'}], initialValue: UsedNumberValue })
                                    (<Input placeholder={"请输入使用量"} />)
                                }
                            </FormItem>
                            <FormItem
                                label="单位"
                                key="Unit"
                                {...formItemLayout}>
                                {
                                    getFieldDecorator("Unit", {rules:[{required: true,message: '请输入单位'}], initialValue: UnitValue })
                                    (<Input placeholder={"请输入物料单位"} />)
                                }
                            </FormItem>
                        </Form>
                </Modal>
                <Modal
                    title="编辑对象"
                    visible={this.state.EModalshow}
                    onOk={this.editBomItem}
                    onCancel={this.resetField}>
                        <Form layout="horizontal">
                            <FormItem
                                label="物料类型"
                                key="MtrlType"
                                {...formItemLayout}>
                                {
                                    getFieldDecorator("MtrlType", {rules:[{required: true,message: '请选择物料类型'}], initialValue: MtrlTypeValue })(
                                    <RadioGroup onChange={this.toggleMtrlType}>
                                        <Radio key="0" value={0}>基础物料</Radio>
                                        <Radio key="1" value={1}>半成品物料</Radio>
                                    </RadioGroup>
                                )}
                            </FormItem>
                            <FormItem
                                label="物料型号"
                                key="MtrlModel"
                                {...formItemLayout}>
                                {
                                    getFieldDecorator("MtrlModelUUID", {rules:!isBaseMtrl?[]:[{required: true,message: '请选择物料型号'}], initialValue: MtrlModelValue })(
                                    <Select disabled={!isBaseMtrl}>
                                        {
                                            MtrModelList.map(function(item, i,arr){
                                                return <Option key={i} value={item.value}>{item.text || item.value}</Option>
                                            })
                                        }
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem
                                label="产品型号"
                                key="ProModel"
                                {...formItemLayout}>
                                {
                                    getFieldDecorator("ProModelUUID", {rules:isBaseMtrl?[]:[{required: true,message: '请选择产品型号'}], initialValue: ProModelValue })(
                                    <Select disabled={isBaseMtrl}>
                                        {
                                            ProductModelList.map(function(item, i,arr){
                                                return <Option key={i} value={item.value}>{item.text || item.value}</Option>
                                            })
                                        }
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem
                                label="使用量"
                                key="UserNumber"
                                {...formItemLayout}>
                                {
                                    getFieldDecorator("UsedNumber", {rules:[{required: true,message: '使用量不能为空'}], initialValue: UsedNumberValue })
                                    (<Input placeholder={"请输入使用量"} />)
                                }
                            </FormItem>
                            <FormItem
                                label="单位"
                                key="Unit"
                                {...formItemLayout}>
                                {
                                    getFieldDecorator("Unit", {rules:[{required: true,message: '单位不能为空'}], initialValue: UnitValue })
                                    (<Input placeholder={"请输入物料单位"} />)
                                }
                            </FormItem>
                            <FormItem
                                label="损耗率"
                                key="LossRate"
                                {...formItemLayout}>
                                {
                                    getFieldDecorator("LossRate", {rules:[{required: true,message: '损耗率不能为空！'}], initialValue: LossRateValue })
                                    (<Input placeholder={"请输入损耗率"} />)
                                }
                            </FormItem>
                            <FormItem
                                label="固定损耗率"
                                key="LossNumber"
                                {...formItemLayout}>
                                {
                                    getFieldDecorator("ConstLossNumber", {rules:[{required: true,message: '固定损耗不能为空！'}], initialValue: LossNumberValue })
                                    (<Input placeholder={"请输入固定损耗率"} />)
                                }
                            </FormItem>
                        </Form>
                </Modal>
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
TBomDetail = Form.create()(TBomDetail)
