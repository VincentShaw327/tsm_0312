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
import ReactSVG from 'react-svg'

import FeatureSetConfig from "./FeatureSetConfig";
import {DoPost} from '../../server';
/***  自定义组件库  ***/
import {DoTopgo, DoToparrived} from './ProgressHandler';

const FormItem = Form.Item;

let self
let targeta

export default class App extends Component {

	constructor(props) {
		super(props)

		this.config = this.props.config

		this.state = {
			data: this.config.resultList || [],
			size: this.config.size
				? this.config.size
				: 'middle', //table尺寸发小
			visible: false,
			serverUrl: 'http://demo.sc.mes.top-link.me/service/Handler_Bom_V1.ashx',
			loading: false,
			Version: '',
			tableKey: 10000,
			target: [],
			resultList: [],
			bordered: false
		};

		self = this;
	}

	render() {

		const pagination = {
			total: self.config.total,
			pageSize: self.config.pageSize,
			onChange: function(num) {
				self.setState({loading: true})
				self.getpageData(num)
			}
		}

		return (
			<div>
				<div style={{
					display: 'flex',
					alignItems: 'center',
					position: 'relative',
					margin: '0.5% 0% 10px',
					borderBottom: '1.6px solid #e8e8e8',
					padding: '12px 0 6px',
					justifyContent: 'space-between'
				}}>
					<RForm RType={self.config.RType} submit={self.handleRetrieve}/>
					<CForm CType={self.config.CType} submit={self.handleCreate}/>
				</div>

				<Table {...this.state}
                        expandedRowRender={self.expandedRowRender}
                        loading={this.state.loading}
                        columns={self.config.columns}
                        pagination={pagination}
                        dataSource={self.state.resultList}/>
			</div>
		)
	}

	componentWillMount() {
		DoTopgo()

		this.setState({loading: true});
	}

	componentDidMount() {
		const self = this
		DoToparrived()
		// 处理接口分页的逻辑
		if (self.config.pageData) {
			self.getpageData(1);
		} else { // 处理 前端分页的逻辑
			self.config.initData(function(list) {
				self.setState({loading: false, resultList: list})
			})
		}
	}

	/** 初始化数据 **/
	getpageData = (num) => {
		const self = this
		self.setState({loading: true})

		self.config.pageData(num, function(list, info) {
			self.setState({
				loading: false,
				resultList: list,
				total: info.total,
				pageSize: info.nPageSize || 10
			})
			self.cacheData = list.map(item => ({
				...item
			}));
		})
	}

	saveFormRef = (form) => {
		this.form = form;
	}

	handleCreate = (info) => {

		const self = this;
		self.config.Create(info, function(item){
		  // 初级接口的坑
		  if(!item){
			self.config.pageData(1, function(list, info) {
			  self.setState({
				  loading: false,
				  resultList: list
			  })
			})
			return
		  }
		  let lists = self.state.resultList;

		  self.state.resultList.unshift(item);

		  let result = Immutable.fromJS(self.state.resultList)

		  let resultList = result.map( function(v, i) {
			if (v.get('key') == item.key) {
			  return Immutable.fromJS(item)
			} else {
			  return v
			}
		  })
		  self.setState({
			loading: false,
			resultList: resultList.toJS()
		  })
		})
	}

	handleRetrieve = () => {}

	handleChange = (value, key, column) => {

		const newData = [...this.state.resultList];
		const target = self.findtarget(key, newData)
		if (target) {
			target[column] = value;
			this.setState({resultList: newData});
		}
	}

	expandedRowRender = (target) => {

        let sublist = []
        let pagination = {}
		let subTable = <div>没有物料</div>
		// url:"http://localhost:52215/tmes.sc201.www/service/Handler_Bom_V1.ashx",
		// 初始化页面的数据 回调函数传入 items 列表
		var dat = {
			PageIndex: 0,
			PageSize: -1,
			ProductModelUUID: 12,
			KeyWord: ""
		}

		const subcolumns = [
			{
				title: "名称",
				dataIndex: "Name",
				type: "string"
			}, {
				title: "编号",
				dataIndex: "ID",
				type: "string"
			}, {
				title: "版本",
				dataIndex: "Version",
				type: "string"
			}, {
				title: "型号编号",
				dataIndex: "ProductModelID",
				type: "string"
			}, {
				title: "产品名称",
				dataIndex: "ProductModelName",
				type: "string"
			}, {
				title: "描述",
				dataIndex: "Desc",
				type: "string"
			}, {
				title: "备注",
				dataIndex: "Note",
				type: "string"
			}, {
				title: "修改时间",
				dataIndex: "UpdateDateTime",
				type: "string"
			}
		]

		if(target.Type == 0 ){
			return (<span> 原始基础物料下没有子物料.... </span>)
		}

		DoPost('http://demo.sc.mes.top-link.me/service/Handler_Bom_V1.ashx', "ListActive", dat, function(res) {

			var Ui_list = res.obj.objectlist || [];
			var totalcount = res.obj.totalcount;
			console.log(Ui_list.length)
			if(Ui_list.length > 0){
				Ui_list.forEach(function(item, index) {
					sublist.push({
						key: index,
						UUID: item.UUID,
						ProductModelUUID: item.ProductModelUUID,
						Name: item.Name,
						ID: item.ID,
						Version: item.Version,
						ProductModelID: item.ProductModelID,
						ProductModelSN: item.ProductModelSN,
						ProductModelName: item.ProductModelName,
						Desc: item.Desc,
						Note: item.Note,
						UpdateDateTime: item.UpdateDateTime,
						Status: item.Status
					})
				})
	            subTable = <Table columns={subcolumns} size={'small'} dataSource={sublist} pagination={pagination}/>
			} else {
				console.log('-------------sublist-----------------', sublist)
				subTable = <span> 该半成品下没有子物料.... </span>
			}

            pagination = {
				total: totalcount,
				nPageSize: 8
			}
		}, function(error) {
			message.info(error);
			return (<div> 查询失败.... </div>)
		}, false)


		return (
			<div>
				{subTable}
			</div>
		)
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
