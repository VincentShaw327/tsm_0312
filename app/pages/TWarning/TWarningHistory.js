/**
 *这是报警历史页
 *添加日期:2018.03.03
 *添加人:shaw
 **/
import React, { Component } from 'react'
import { hashHistory, Link } from 'react-router'
import { Table, Menu, Icon, Badge, Dropdown,Popover,message,Divider,Popconfirm } from 'antd';
import { TPostData } from '../../utils/TAjax';
import SimpleTable from 'components/TTable/SimpleTable';
import { CreateModal,UpdateModal } from 'components/TModal';
import {SimpleQForm,StandardQForm } from 'components/TForm';


export default class TWarningHistory extends Component {

    constructor( props ) {
        super( props )
        this.state = {
            tableDataList:[],
            DevModelList:[],
            updateFromItem:{},
            total:0,
            current:1,
            pageSize:10,
            UModalShow:false,
            loading:true,
            DeviceUUID:-1
        }
        this.url='/api/TWarning/warning';
    }

    componentWillMount(){
        this.getDeviceModel();
        this.getTableList();

    }

    getTableList(que){
        const {current,pageSize,DeviceUUID,keyWord}=this.state;
        const dat = {
            PageIndex : current-1,       //分页：页序号，不分页时设为0
            PageSize:pageSize,   //分页：每页记录数，不分页时设为-1
            DeviceUUID: DeviceUUID, //设备型号UUID
            KeyWord :keyWord,
        }

        TPostData( this.url, "List", dat,
            (res) => {
                var list = [];
                console.log("查询到报警配置列表", res);
                var data_list = res.obj.objectlist || [];
                var totalcount = res.obj.totalcount;
                data_list.forEach((item, index)=> {
                    list.push( {
                        key: index,
                        WarnItemUUID: item.WarnItemUUID,
                        DeviceNumber: item.DeviceNumber?item.DeviceNumber:"-",
                        DeviceModel: item.DeviceModel?item.DeviceModel:"-",
                        WarnCode: item.WarnCode,
                        MatchType: item.MatchType,
                        WarnItemID: item.WarnItemID,
                        WarnItemName: item.WarnItemName,
                        WarnItemDesc: item.WarnItemDesc,
                        StartDateTime:item.StartDateTime,
                        EndDateTime:item.EndDateTime
                    } )
                })
                this.setState({ tableDataList: list, total: totalcount, loading: false });
            },
            ( error )=> {
              message.info( error );
            }
        )

    }

    getDeviceModel(){

        TPostData('/api/TDevice/device_model', 'ListActive',{PageIndex: 0,PageSize: -1,TypeUUID: -1,CategoryUUID: -1,VendorUUID: -1},
            ( res )=> {
                console.log("设备型号列表：",res);
                var Ui_list = res.obj.objectlist || [],
                    list=[];
                Ui_list.forEach( function ( item, index ) {
                    list.push( { key: index, value: item.UUID.toString(), text: item.Name } )
                } );
                this.setState({DevModelList:list});
            },
            ( error )=> {
                message.info( error );
            },
        );

    }

    handleQuery=(data)=>{
        const {keyWord,DeviceUUID}=data;
        this.setState({keyWord,DeviceUUID},()=>{
            this.getTableList();
        });
    }

    handleTableChange=(pagination)=>{
        // console.log('pagination',pagination);
        const {current,pageSize}=pagination;
        this.setState({current,pageSize},()=>{

            this.getTableList();
        });
    }


    render() {
        const {tableDataList,DevModelList,loading,current,total,pageSize,updateFromItem,UModalShow}=this.state;
        let Data={
            list:tableDataList,
            pagination:{total,current,pageSize}
        };

        //table表格表头参数
        const Tcolumns= [
            {
                title: '序号',
                dataIndex: 'key',
                type: 'string'
            },
            {
                title: '报警内容',
                dataIndex: 'WarnItemName',
                type: 'string',
                // sorter: (a, b) => a.Name.length - b.Name.length
            },
            {
                title: '报警码',
                dataIndex: 'WarnItemID',
                type: 'string',
                // sorter: (a, b) => a.Name.length - b.Name.length
            },
            {
                title: '设备型号',
                dataIndex: 'DeviceModel',
                type: 'string'
            },
            {
                title: '设备编号',
                dataIndex: 'DeviceNumber',
                type: 'string'
            },
            {
                title: '匹配类型',
                dataIndex: 'MatchType',
                type: 'string',
                render:(item,arr)=>{
                    if(item==0)return (<span>按Bit匹配</span>)
                    else if(item==1)return (<span>按码值匹配</span>)
                }
            },
            {
                title: '报警时间',
                dataIndex: 'StartDateTime',
                type: 'string'
            },
            {
                title: '解除时间',
                dataIndex: 'EndDateTime',
                type: 'string'
            },
        ];
        //查询的数据项
        const RFormItem= [
            {
                name: 'KeyWord',
                label: '搜索内容',
                type: 'string',
                placeholder: '请输入搜索内容'
            },
            {
                name: 'DeviceUUID',
                label: '设备型号',
                type: 'select',
                hasAllButtom: true,
                defaultValue: '-1',
                width: 200,
                options: DevModelList
            }
        ];

        return (
            <div className="cardContent">
                <SimpleQForm
                    FormItem={RFormItem}
                    submit={this.handleQuery}
                    />
                <Divider />
                <SimpleTable
                    loading={loading}
                    data={Data}
                    columns={Tcolumns}
                    isHaveSelect={false}
                    onChange={this.handleTableChange}
                />
            </div>
        )
    }
}
