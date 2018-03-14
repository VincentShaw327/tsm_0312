/**
 *这是BOM详情
 *添加日期:2018.03.06
 *添加人:shaw
 **/
import React, { Component } from 'react';
import {Icon,Row,Col,Divider} from 'antd';
import FeatureSetConfig from '../../components/TCommon/shawCommon/tableConfig';
import Tiltle from '../../components/TCommon/shawCommon/Tiltle/Tiltle';
import { _topfOrderBy } from '../../components/TCommon/shawCommon/utils/dataHandle/arrayHandle';
import { TPostData } from '../../utils/TAjax';
// import FeatureSetConfig from '../topBCommon/FeatureSetConfig';

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
            bom: {},
            loading: false
        }
        this.url='/api/TBom/bom';
        self = this;
    }

    componentWillMount() {

        const config = {
            type: 'Expandtable',
            size: 'middle',
            total: 0,
            pageSize: 10,
            url:'/api/TBom/bom',

            columns: [
                {
                    title: '类型',
                    dataIndex: 'TypeName',
                    key: 'TypeName',
                    render: ( text, record ) => {
                        if ( record.Type == 0 ) {
                            return <span> {text} </span>
                        }
                    }
                }, {
                    title: '物料型号名称',
                    dataIndex: 'MtrlModelName',
                    key: 'MtrlModelName'
                }, {
                    title: '使用量',
                    dataIndex: 'UsedNumber',
                    key: 'UsedNumber'
                }, {
                    title: '固定损耗量',
                    dataIndex: 'ConstLossNumber',
                    key: 'ConstLossNumber'
                }, {
                    title: '损耗率',
                    dataIndex: 'LossRate',
                    key: 'LossRate'
                }, {
                    title: '单位',
                    dataIndex: 'Unit',
                    key: 'Unit'
                }
            ],

            CType: [
                {
                    name: 'MtrlModelName',
                    label: '料号名称',
                    type: 'string',
                    placeholder: '请输入料号名称',
                    rules: [
                        {
                            required: true,
                            min: 2,
                            message: '名称至少为 2 个字符'
                        }
                    ]
                }, {
                    name: 'ConstLossNumber',
                    label: '固定损耗量',
                    type: 'string',
                    placeholder: '请输入使用量',
                    rules: [
                        {
                            required: true,
                            min: 2,
                            message: '名称至少为 2 个字符'
                        }
                    ]
                }, {
                    name: 'UsedNumber',
                    label: '使用量',
                    type: 'string',
                    placeholder: '请输入使用量',
                    rules: [
                        {
                            required: true,
                            min: 2,
                            message: '名称至少为 2 个字符'
                        }
                    ]
                }, {
                    name: 'LossRate',
                    label: '损耗率',
                    type: 'string',
                    placeholder: '请输入使用量',
                    rules: [
                        {
                            required: true,
                            min: 2,
                            message: '名称至少为 2 个字符'
                        }
                    ]
                }, {
                    name: 'Unit',
                    label: '单位',
                    type: 'string',
                    placeholder: '请输入单位',
                    rules: [
                        {
                            required: true,
                            min: 2,
                            message: '名称至少为 2 个字符'
                        }
                    ]
                }, {
                    name: 'MtrlType',
                    label: '物料类型',
                    type: 'radio',
                    placeholder: '请输入使用量',
                    defaultValue: '0',
                    options: [
                        {
                            key: 0,
                            value: '0',
                            text: '基本物料'
                        }, {
                            key: 1,
                            value: '1',
                            text: '半成品'
                        }
                    ]
                }
            ],
            // 初始化页面的数据 回调函数传入 items 列表
            pageData: function ( num, callback ) {
                var bomQueryParams = {
                    "UUID": self.state.UUID ? self.state.UUID : '1'
                }
                TPostData( this.url, "GetDefine", bomQueryParams, function ( res ) {
                    var list = [];
                    var orderlist = []
                    var Ui_list = res.obj.objectlist || [];
                    console.log('查询到bom列:',res);
                    var totalcount = res.obj.objectlist.length;
                    Ui_list.forEach( function ( item, index ) {
                        list.push( {
                            key: item.MtrlModelUUID,
                            UUID: item.UUID,
                            BomUUID: item.BomUUID,
                            Type: item.Type,
                            TypeName: ( item.Type == 0 ) ? "物料" : "中间产品",
                            ReplaceToUUID: item.ReplaceToUUID,
                            MtrlModelUUID: item.MtrlModelUUID,
                            Unit: item.Unit,
                            UsedNumber: item.UsedNumber,
                            LossRate: item.LossRate,
                            ConstLossNumber: item.ConstLossNumber,
                            UpdateDateTime: item.UpdateDateTime,
                            Status: item.Status,
                            MtrlModelID: item.MtrlModelID, //物料型号编码
                            MtrlModelName: item.MtrlModelName, //物料型号名称
                        } )
                    } )

                    orderlist = _topfOrderBy( list, [ 'key' ], [ 'desc' ] )
                    creatKeyWord = parseInt( orderlist[ 0 ].key )
                    const pagination = {
                        ...self.state.pagination
                    }
                    console.log( 'orderlist====================', orderlist )
                    pagination.total = totalcount;
                    callback( list, {
                        total: pagination.total,
                        nPageSize: 10
                    } )
                }, function ( error ) {
                    message.info( error );
                }, false )
            },

            Create: function ( data, callback ) {
                creatKeyWord++;
                let keyWord = creatKeyWord;
                let dat = {
                    key: keyWord,
                    UUID: self.state.UUID ? self.state.UUID : '1', //UUID
                    MtrlType: data.MtrlType, //物料类型
                    MtrlModelUUID: data.MtrlModelUUID, //物料型号UUID
                    Unit: data.Unit, //物料计量单位
                    UsedNumber: data.UsedNumber,
                    MtrlModelName: data.MtrlModelName,
                    ConstLossNumber: data.ConstLossNumber,
                    LossRate: data.LossRate //使用量
                }
                // console.log( 'dat================', dat );
                TPostData( this.url, "AddItem", dat, function ( res ) {
                    //这块请求更新数据 成功回调
                    callback( dat );
                } )
            }

        }
        this.feature = FeatureSetConfig( config );
    }

    componentDidMount() {

        TPostData( this.url,"GetDetail", { "UUID": '1' },
             ( result )=> {
                if ( result.err == 0 ) {
                    this.setState( {
                        bom: result.obj
                    } )
                }
            },
            ( result )=> {
                console.log( "后台数据读取失败！" );
            },
            false
        )

    }

    render() {
        let Feature=this.feature;
        return (
            <div>
                <div style={{ marginBottom: '1%' }}>
                    <Divider style={{ marginTop: '5px', marginBottom: '-16px'}}><Tiltle typeIcon={'profile'} centent={'BOM详情'} /></Divider>
                    <Row style={{padding: '2% 1% 1% 1%', border: 'solid 1px #f0f2f5', borderRadius: '3px', marginTottom: '2%', borderTop: 'solid 0px'}}>
                        <Row gutter={24}>
                            <Col span="3" label="Bom编码"><h5>Bom编码：</h5></Col>
                            <Col span="5"><h5>{self.state.bom.ID}</h5></Col>
                            <Col span="3" label="Bom名称"><h5>Bom名称：</h5></Col>
                            <Col span="5"><h5>{self.state.bom.Name}</h5></Col>
                            <Col span="3" label="Bom版本"><h5>Bom版本：</h5></Col>
                            <Col span="5"><h5>{self.state.bom.Version}</h5></Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span="3" label="产品型号编号"><h5>产品型号编码：</h5></Col>
                            <Col span="5"><h5>{self.state.bom.ProductModelID}</h5></Col>
                            <Col span="3" label="产品型号"><h5>产品型号：</h5></Col>
                            <Col span="5"><h5>{self.state.bom.ProductModelName}</h5></Col>
                            <Col span="3" label=""></Col>
                            <Col span="5"></Col>
                        </Row>
                    </Row>
                </div>
                <div>
                    <Divider style={{ marginTop: '5px', marginBottom: '-24px' }}><Tiltle typeIcon={'table'} centent={'物料列表'} /></Divider>
                    <div style={{ marginBottom: '1%', padding: '0% 1% 1% 1%', border: 'solid 1px #f0f2f5', borderRadius: '3px', marginTottom: '2%', borderTop: 'solid 0px' }}>
                        <Feature/>
                    </div>
                </div>
            </div>
        )
    }
}
