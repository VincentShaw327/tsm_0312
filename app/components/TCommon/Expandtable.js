import React, { Component } from 'react'
import connect from 'mqtt';
// import {Grid,Clearfix,ProgressBar,Popover,OverlayTrigger,popoverBottom,Label} from 'react-bootstrap'
import {Button,Icon,Table,Popconfirm,message,Alert} from 'antd';
// import { Link } from 'dva/router'
import Immutable from 'immutable';
// import ReactSVG from 'react-svg';
/**************************************************/
// import CFormItem from '../common/CreateFormItem';
// import CTextItem from '../common/CreateTextItem';
// 搜索查询栏form 创建新item-form 更新form
import UForm from './UpdateForm';
import CForm from './CreateForm';
import RForm from './RetrieveForm';
// const client = connect( 'mqtt://iec.topstarltd.com:9011' );
// const client = connect('mqtt://ice.top-link.me:9011');

let self
export default class APP extends Component {

	constructor( props ) {
		super( props )
		this.state = {
			columns: [],
			subcolumns: [],
			resultList: [],
			selectedRow:[],
			selectedRowKeys:[],
			filteredInfo: null,
		    sortedInfo: null,
			loading: false,
			updateFromShow: false,
			updateFromItem: {},
			total: 0,
			pageSize: 30,
			isSelection: this.props.config.isSelection,
			isSlider: this.props.isSlider,
			isUpdate: this.props.isUpdate,
			config: this.props.config
		}
        this.config=this.props.config
		self = this;
	}

	componentWillMount() {
		this.setState( {
			loading: true,
			columns: this.dealConfigColumns( this.props.config.columns ),
			// subcolumns: this.dealConfigSubColumns( this.props.config.subcolumns )
		} )
	}

	componentDidMount() {
		const self = this;

		// 处理接口分页的逻辑
		if ( self.state.config.pageData ) {
			self.getpageData( 1 );
		} else { // 处理 前端分页的逻辑
			self.state.config.initData( function ( list ) {
				self.setState( {
					loading: false,
					resultList: list
				} );
			} );
		}
	}

	componentWillUnmount() {
		// client.end() //关闭mqtt连接, 释放服务器资源
	}

	renderFunc = {
		link: ( text ) => (
			<span>
                <a href={text}>{text}</a>
            </span> ),
		image: ( url ) => (
			<span>
                <img src={url} />
            </span> )
	}

	// 预处理配置显示中的 colums 数据 用于anted的table配置
	dealConfigColumns = ( lists ) => {

		const self = this;

		let columns = [];
		lists.forEach( ( item ) => {
			let column = {
				title: item.title,
				dataIndex: item.dataIndex,
				key: item.dataIndex,
				width: item.width
			}

			if ( item.type === 'operate' ) {
				// 兼容单一形式与数组形式
				let btns = Array.isArray( item.btns ) ? item.btns : [ item.btns ];

				// 处理表单 操作 栏目以及回调函数
				column.render = item.render || function ( txt, record ) {
					return <span>
                          {
                              btns.map(function(btn,i) {
                                  if( btn.text ){
                                      if(btn.havePopconfirm){
                                          return (
                                              <span key={i}>
                                              <Popconfirm title={btn.popText} onConfirm={self.operateCallbacks.bind(self, record, btn)} onCancel={self.cancelDelete} okText="Yes" cancelText="No">
                                                <a href="#">{btn.text}</a>
                                              </Popconfirm>
                                                {/* <a href="javascript:void 0;" onClick={self.operateCallbacks.bind(self, record, btn)}>{btn.text}</a> */}
                                                {i!==btns.length-1?<span className="ant-divider"></span>:''}
                                              </span>

                                          );
                                      }
                                      return (
                                          <span key={i}>
                                              <a href="javascript:void 0;" onClick={self.operateCallbacks.bind(self, record, btn)}>{btn.text}</a>
                                                {i!==btns.length-1?<span className="ant-divider"></span>:''}
                                          </span>
                                      );
                                  }else if( btn.render ){
                                      return (
                                          <span key={i}>
                                              {btn.render(txt, record)}
                                              {i!==btns.length-1?<span className="ant-divider"></span>:''}
                                          </span>
                                      );
                                  }
                              })
                          }
                          </span>
				};
			} else if ( !item.dataIndex ) {
				item.dataIndex = 'NORMAL_INDEX';
				column.render = item.render || self.renderFunc[ item.type ];
			} else {
				column.render = item.render || self.renderFunc[ item.type ] || ( ( text ) => ( <span>{text}</span> ) );
			}

			if ( item.type === 'sort' ) {
				column.sorter = item.sorter || ( ( a, b ) => a[ item.dataIndex ] - b[ item.dataIndex ] );
			}

			if ( item.type === 'filter' ) {
				column.filters = item.filters || [
			        { text: 'HDMI接口', value: 'HDMI接口' },
			        { text: 'USB接口', value: 'USB接口' },
			      ];
				column.onFilter=column.onFilter||((value, record) => record.productName.includes(value));
			}

			columns.push( column );

		} );

		return columns;


	}
    //
	dealConfigSubColumns = ( record, lists ) => {

		const self = this;
		let data = [
			{
				key: 0,
				BName: '金属外壳',
				materielType: '金属',
				BNum: 'M01',
				color: '绿色',
				colorNum: 'SF07',
				materielName: 'PS聚苯乙烯',
				materielNum: 'PS-101',
				planQuantity: '2000',
				peopleNum: '2',
				status: '生产中',
			},
			{
				key: 1,
				BName: '金属插针',
				materielType: '金属',
				BNum: 'M01',
				color: '绿色',
				colorNum: 'SF07',
				materielName: 'PS聚苯乙烯',
				materielNum: 'PS-101',
				planQuantity: '2000',
				peopleNum: '2',
				status: '生产中',
			},
			{
				key: 2,
				BName: '塑料本体',
				materielType: '塑料',
				BNum: 'M01',
				color: '绿色',
				colorNum: 'SF07',
				materielName: 'PS聚苯乙烯',
				materielNum: 'PS-101',
				planQuantity: '2000',
				peopleNum: '3',
				status: '生产中',
			},
		];

		let columns = [];
		this.props.config.subcolumns.forEach( ( item ) => {
			let column = {
				title: item.title,
				dataIndex: item.dataIndex,
				key: item.dataIndex,
				width: item.width
			}

			if ( item.type === 'operate' ) {
				// 兼容单一形式与数组形式
				let btns = Array.isArray( item.btns ) ? item.btns : [ item.btns ];

				// 处理表单 操作 栏目以及回调函数
				column.render = item.render || function ( txt, record ) {
					return <span>
                          {
                              btns.map(function(btn,i) {
                                  if( btn.text ){
                                      if(btn.havePopconfirm){
                                          return (
                                              <span key={i}>
                                              <Popconfirm title={btn.popText} onConfirm={self.operateSubCallbacks.bind(self, record, btn)} onCancel={self.cancelDelete} okText="Yes" cancelText="No">
                                                <a href="#">{btn.text}</a>
                                              </Popconfirm>
                                                {/* <a href="javascript:void 0;" onClick={self.operateCallbacks.bind(self, record, btn)}>{btn.text}</a> */}
                                                {i!==btns.length-1?<span className="ant-divider"></span>:''}
                                              </span>

                                          );
                                      }
                                      return (
                                          <span key={i}>
                                              <a href="javascript:void 0;" onClick={self.operateSubCallbacks.bind(self, record, btn)}>{btn.text}</a>
                                                {i!==btns.length-1?<span className="ant-divider"></span>:''}
                                          </span>
                                      );
                                  }else if( btn.render ){
                                      return (
                                          <span key={i}>
                                              {btn.render(txt, record)}
                                              {i!==btns.length-1?<span className="ant-divider"></span>:''}
                                          </span>
                                      );
                                  }
                              })
                          }
                          </span>
				};
			} else if ( !item.dataIndex ) {
				item.dataIndex = 'NORMAL_INDEX';
				column.render = item.render || self.renderFunc[ item.type ];
			} else {
				column.render = item.render || self.renderFunc[ item.type ] || ( ( text ) => ( <span>{text}</span> ) );
			}

			if ( item.sort ) {
				column.sorter = item.sorter || ( ( a, b ) => a[ item.dataIndex ] - b[ item.dataIndex ] );
			}
			columns.push( column );

		} );

		// return columns;
		return ( <Table columns = { columns } dataSource = { data } pagination = { false }/>);
	}
    // 取消删除
    cancelDelete() {
        message.error( 'Click on No' );
    }
    // table 操作列回调处理
    operateCallbacks ( item, btn ) {
        const self = this;

        if ( btn.type ) {
            // console.log("操作列回调处理item",item);
            let resultList;
            let type = btn.type;
            let itemI = Immutable.fromJS( item );
            let result = Immutable.fromJS( self.state.resultList );

            // table 操作栏目通用设定为 更新与删除 两项
            if ( type === 'update' ) {
                this.setState( {
                    updateFromShow: true,
                    updateFromItem: itemI.toJS()
                } );
            } else if ( type === 'place' ) {
                this.setState( {
                    isPlace: true,
                    updateFromShow: true,
                    updateFromItem: itemI.toJS()
                } );
            } else if ( type === 'delete' ) {
                this.setState( {
                    loading: true
                } )

                this.config.Delete( itemI.toJS(), function () {
                    resultList = result.filter( function ( v, i ) {
                        if ( v.get( 'key' ) !== itemI.get( 'key' ) ) {
                            return true;
                        }
                    } )
                    message.success( '删除成功' );

                    self.setState( {
                        loading: false,
                        resultList: resultList.toJS()
                    } )
                } )
            }else if(type=='split'){
                this.config.Split();
            }
        }
        else if ( btn.callback ) {
            btn.callback( item );
        }
    }
    //
	operateSubCallbacks ( item, btn ) {
        const self = this;

        if ( btn.type ) {
            // console.log("操作列回调处理item",item);
            let resultList;
            let type = btn.type;
            let itemI = Immutable.fromJS( item );
            let result = Immutable.fromJS( self.state.resultList );

            // table 操作栏目通用设定为 更新与删除 两项
            if ( type === 'update' ) {
                this.setState( {
                    updateFromShow: true,
                    updateFromItem: itemI.toJS()
                } );
            } else if ( type === 'place' ) {
                this.setState( {
                    isPlace: true,
                    updateFromShow: true,
                    updateFromItem: itemI.toJS()
                } );
            } else if ( type === 'delete' ) {
                this.setState( {
                    loading: true
	            } )

                this.config.Delete( itemI.toJS(), function () {
                    resultList = result.filter( function ( v, i ) {
                        if ( v.get( 'key' ) !== itemI.get( 'key' ) ) {
                            return true;
                        }
                    } )
                    message.success( '删除成功' );

                    self.setState( {
                        loading: false,
                        // resultList: resultList.toJS()
                    } )
                } )
            }else if(type=='split'){
                this.config.Split();
            }
        } else if ( btn.callback ) {
            btn.callback( item );
        }
    }
    //查询回调
	handleRetrieve = ( info ) => {
		const self = this;
		self.setState( {
			loading: true
		} )

		self.state.config.Retrieve( info, function ( list ) {
			self.setState( {
				loading: false,
				resultList: list
			} )
		} )
	}

	getpageData = ( num ) => {
		const self = this
		self.setState( {
			loading: true
		} )

		self.state.config.pageData( num, function ( list, info ) {
			self.setState( {
				loading: false,
				resultList: list,
				total: info.total,
				pageSize: info.nPageSize || 10,
			} )
		} )
	}

    handleExpand(e1,e2){
        message.info('展开了表格');
        console.log(e1,e2);
    }
    //
	handleCreate ( info ) {
		const self = this;
		this.config.Create( info, function ( item ) {
			// 初级接口的坑
			if ( !item ) {
				this.config.initData( function ( list ) {
					self.setState( {
						loading: false,
						resultList: list
					} )
				} )
				return
			}

			let lists = self.state.resultList;

			self.state.resultList.unshift( item );

			let result = Immutable.fromJS( self.state.resultList )

			let resultList = result.map( function ( v, i ) {
				if ( v.get( 'key' ) == item.key ) {
					return Immutable.fromJS( item )
				} else {
					return v
				}
			} )
			self.setState( {
				loading: false,
				resultList: resultList.toJS()
			} )
		} )
	}
	//提交之后的操作
	handleUpdate( info ) {
		// alert('handleupdate');
		console.log( '看看UPdate提交后的内容', info )
		const self = this;
		let result = Immutable.fromJS( self.state.resultList );
		let infoN = Immutable.fromJS( self.state.updateFromItem ).merge( info ).toJS();
		this.config.Update( infoN, function ( item ) {
			let resultList = result.map( function ( v, i ) {
				if ( v.get( 'key' ) == item.key ) {
					return Immutable.fromJS( item )
				} else {
					return v
				}
			} );
			message.success( '更新成功!' );
			self.setState( {
				loading: false,
				updateFromShow: false,
				resultList: resultList.toJS()
			} );
		} );
	}

	//切换弹框显示
    hideUpdateForm() {
        this.setState( {
            updateFromShow: false,
            updateFromItem: {}
        } )
    }

	clearSelectedRow(){
		// alert('Clicked!');
		let clear=()=>{
			let row=this.state.selectedRow;
			while(row&&row.length>0){row.shift();console.log('sss');}
			return;
		}
		this.setState({selectedRow:clear,selectedRowKeys:0});
		// console.log("box-table=",this.refs.box_table);
	}

	render() {
		const { selectedRowKeys } = this.state;
		// let { sortedInfo, filteredInfo } = this.state;
		const rowSelection = {
		  onChange: (selectedRowKeys, selectedRows) => {
		    // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
			this.setState({selectedRow:selectedRows,selectedRowKeys});
			// console.log('selectedRow: ', this.state.selectedRow);
		  },
			selectedRowKeys,
			// selectedRowKeys:this.state.selectedRow,
			// selections:[true,true,true],
		  getCheckboxProps: record => ({
		    disabled: record.name === 'Disabled User', // Column configuration not to be checked
		  }),
		};

		const AlertMessage=(<div><span>已选择<a style={{fontSize:15,color:'red'}}>{this.state.selectedRow.length}</a>项</span><a style={{marginLeft:20}} onClick={this.clearSelectedRow.bind(this)}>清除</a></div>);

		let table
		let Slider
		if ( self.state.config.pageData ) {
			const pagination = {
				total: this.state.total,
				pageSize: this.state.pageSize,
				onChange: function ( num ) {
					self.setState( {
						loading: true
					} )
					self.getpageData( num )
				}
			}
			table = <Table className="components-table-demo-nested"
                        expandedRowRender={this.dealConfigSubColumns.bind(this)}
						rowSelection={this.state.isSelection?rowSelection:null}
                        dataSource={this.state.resultList}
                        columns={this.state.columns}
                        loading={this.state.loading}
                        pagination={pagination}
						bordered={true}
                        // onExpand={this.handleExpand}
                        />;

		} else {
			table = <Table  dataSource={this.state.resultList}
							rowSelection={this.state.isSelection?rowSelection:null}
 						    columns={this.state.columns}
 							loading={this.state.loading} />;
		}

		return <div className={this.props.className} >
              { Slider }
              <div style={{ flex: 7 }}>
				<div style={{marginBottom:20}}>
	                <RForm RType={self.state.config.RType} submit={self.handleRetrieve} />
	                <CForm CType={self.state.config.CType} submit={self.handleCreate} />
				</div>
                <UForm UType={self.state.config.UType} submit={self.handleUpdate} isShow={this.state.updateFromShow} updateItem={this.state.updateFromItem} hideForm={this.hideUpdateForm.bind(this)}/>
				<div style={{marginBottom:20}}>
					{this.state.selectedRow.length?<Button>批量操作</Button>:''}
				</div>
				<Alert message={AlertMessage} type="info" showIcon />
				<div style={{marginTop:20}}>
	                {table}
				</div>
              </div>
            </div>
	}
}
