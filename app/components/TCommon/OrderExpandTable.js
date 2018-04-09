import React, { Component } from 'react';
import { Button, Icon, Breadcrumb, Badge, Dropdown, Table, Popconfirm, message, Alert,Tooltip } from 'antd';
import Immutable from 'immutable';
// import ReactSVG from 'react-svg';
/**************************************************/
// 搜索查询栏form 创建新item-form 更新form
import UForm from './UpdateForm';
import USubForm from './UpdateForm';
import SForm from './UpdateForm';
import BSForm from './UpdateForm';
// import USubForm from './UpdateSubForm';
import CForm from './CreateForm';
import RForm from './RetrieveForm';
import Tiltle from './Tiltle/Tiltle';

let self
export default class APP extends Component {

  constructor( props ) {
    super( props )
    this.state = {
      columns: [],
      subcolumns: [],
      resultList: [],
      selectedRow: [],
      selectedRowKeys: [],
      selectedProductID: -1,
      lotListData:[],
      filteredInfo: null,
      sortedInfo: null,
      loading: false,
      updateFromShow: false,
      updateSubFromShow: false,
      schedulFormShow: false,
      schedulBSFromShow: false,
      updateFromItem: {},
      updateSubFromItem: {},
      total: 0,
      pageSize: 30,
      isSelection: this.props.config.isSelection,
      showBorder: this.props.config.showBorder,
      pageTitle: this.props.config.pageTitle,
      tableSize: this.props.config.size ? this.props.config.size : 'middle',
      subTableSize: this.props.config.subSize ? this.props.config.subSize : 'small',
      isSlider: this.props.isSlider,
      isUpdate: this.props.isUpdate,
      config: this.props.config
    }
    this.config = this.props.config;
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
      self.getpageData();
    } else { // 处理 前端分页的逻辑
      self.state.config.initData( function ( list ) {
        self.setState( {
          loading: false,
          resultList: list
        } );
      } );
    }
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

      if ( item.type === 'operate' && item.btns ) {
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
                                              <Popconfirm title={btn.popText} onConfirm={self.operateCallbacks.bind(self, record, btn)} onCancel={self.popCancel} okText="Yes" cancelText="No">
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
      } else if ( item.type === 'operate' && item.multipleType === 'orderList' ) {
            column.render = item.render || function ( txt, record ) {
                // dynamicColumns(txt, record);
                if ( record.Status == 1||record.Status == 2 ) {
                    return (<span>
                                {/* <Popconfirm title={"拆分"} onConfirm={self.operateOrderCallbacks.bind(self, record, 'split')} onCancel={self.popCancel} okText="Yes" cancelText="No">
                                  <a href="#">拆分</a>
                                </Popconfirm>
                                <span className="ant-divider"></span> */}
                                {/* <Tooltip placement="right" title="重启">
                                </Tooltip>
                                <Popconfirm title={"取消"} onConfirm={self.operateOrderCallbacks.bind(self, record, 'cancelOrder')} onCancel={self.popCancel} okText="Yes" cancelText="No">
                                </Popconfirm> */}

                                <Tooltip placement="right" title="编辑">
                                    {/* <a href="#" href="javascript:void 0;" onConfirm={self.operateOrderCallbacks.bind(self, record, 'update')} onCancel={self.popCancel}>编辑</a> */}
                                    <Button onClick={self.operateOrderCallbacks.bind(self, record, 'update')} size={'small'} icon="edit" ></Button>
                                </Tooltip>
                                <span className="ant-divider"></span>
                                <Popconfirm title={"取消后不可恢复,确定取消?"} onConfirm={self.operateOrderCallbacks.bind(self, record, 'cancelOrder')} onCancel={self.popCancel} okText="Yes" cancelText="No">
                                    <Tooltip placement="right" title="取消">
                                        <Button size={'small'} icon="close" ></Button>
                                    </Tooltip>
                                </Popconfirm>
                                <span className="ant-divider"></span>
                                <Popconfirm title={"确定要暂停订单吗?"} onConfirm={self.operateOrderCallbacks.bind(self, record, 'pauseOrder')} onCancel={self.popCancel} okText="Yes" cancelText="No">
                                    <Tooltip placement="right" title="暂停">
                                        <Button size={'small'} icon="pause" ></Button>
                                    </Tooltip>
                                </Popconfirm>
                            </span>)
                } else if (  record.Status == 3 ) {
                    return <span>
                           </span>
                } else if ( record.Status == 2||record.Status == 0 ) {
                    return (<span>
                                <Popconfirm title={"拆分"} onConfirm={self.operateOrderCallbacks.bind(self, record, 'cancelSplit')} onCancel={self.popCancel} okText="Yes" cancelText="No">
                                {/* <a href="#" href="javascript:void 0;">取消拆分</a> */}
                                <Button size={'small'} icon="edit" disabled></Button>
                                {/* <span className="ant-divider"></span>
                                <Button size={'small'} icon="close" disabled></Button> */}
                                </Popconfirm>
                            </span>)
                } else if ( record.Status == 6 ) {
                    return (<span>
                                <Popconfirm title={"确定要重启订单吗?"} onConfirm={self.operateOrderCallbacks.bind(self, record, 'restartOrder')} onCancel={self.popCancel} okText="Yes" cancelText="No">
                                <Tooltip placement="right" title="重启">
                                    <Button size={'small'} icon="caret-right"></Button>
                                    {/* <a href="javascript:void 0;" > { btn.icon ? <Icon type={btn.icon} /> : btn.text } </a> */}
                                </Tooltip>
                                </Popconfirm>
                                {/* <span className="ant-divider"></span> */}
                            </span>)
                }
            }
      } else if ( item.type === 'operate' && item.multipleType === 'Scheduling' ) {
            column.render = item.render || function ( txt, record ) {
            let Btn1=record.strStatus==1?<Button onClick={self.operateOrderCallbacks.bind(self, record, 'update')} size={'small'} icon="edit" ></Button>:<Button disabled size={'small'} icon="edit" ></Button>,
                Btn2=record.strStatus==1?<Button onClick={self.operateOrderCallbacks.bind(self, record, 'scheduling')} size={'small'} icon="calendar" ></Button>:<Button disabled size={'small'} icon="calendar" ></Button>;

                return <span>
                            {/* <a href="#" href="javascript:void 0;" onClick={self.operateOrderCallbacks.bind(self, record, 'update')}>编辑</a>
                            <span className="ant-divider"></span>
                            <a href="#" href="javascript:void 0;" onClick={self.operateOrderCallbacks.bind(self, record, 'scheduling')}>排程</a> */}

                            <Tooltip placement="right" title="编辑">
                                {Btn1}
                            </Tooltip>
                            <span className="ant-divider"></span>
                            <Tooltip placement="right" title="排程">
                                {Btn2}
                            </Tooltip>
                        </span>
            }
      } else if ( item.type === 'operate' && item.multipleType === 'dispatch' ){
        column.render = item.render || function ( txt, record ) {
            let Btn1=record.Status==1?<Button onClick={self.operateOrderCallbacks.bind(self, record, 'deliver')} size={'small'} icon="schedule" ></Button>:<Button disabled size={'small'} icon="schedule" ></Button>;

                return (<span ><Tooltip placement="right" title="派工">{Btn1}</Tooltip></span>)
        }
      }else {
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
        column.onFilter = column.onFilter || ( ( value, record ) => record.productName.includes( value ) );
      }

      columns.push( column );

    } );

    return columns;

  }
  //
  dealConfigSubColumns = ( record, lists ) => {
    const self = this;
    // let lotListData = [];
    let lotListData=this.state.lotListData;
    let columns = [];
    this.config.subcolumns.forEach( ( item ) => {
        let column = {
            title: item.title,
            dataIndex: item.dataIndex,
            key: item.dataIndex,
            width: item.width
        }

      if ( item.type === 'operate'&& item.btns ) {
            let btns = Array.isArray( item.btns ) ? item.btns : [ item.btns ];
            column.render = item.render || function ( txt, record ) {
                return (<span>
                        {
                            btns.map(function(btn,i) {
                                if( btn.text ){
                                    if(btn.hasOwnProperty('popText')){
                                        return (
                                            <span key={i}>
                                                <Popconfirm title={btn.popText} onConfirm={self.operateCallbacks.bind(self, record, btn)} onCancel={self.cancelDelete} okText="Yes" cancelText="No">
                                                    <Tooltip placement="right" title={btn.text}>
                                                        <a href="javascript:void 0;" > { btn.icon ? <Icon type={btn.icon} /> : btn.text } </a>
                                                    </Tooltip>
                                                </Popconfirm>
                                                {i!==btns.length-1?<span className="ant-divider"></span>:''}
                                            </span>
                                        );
                                    }
                                    return (
                                        <span key={i}>
                                            <Tooltip placement="right" title={btn.text}>
                                                    <a href="javascript:void 0;" onClick={self.operateSubCallbacks.bind(self, record, btn)}> { btn.icon ? <Icon type={btn.icon} /> : btn.text } </a>
                                                    {i!==btns.length-1?<span className="ant-divider"></span>:''}
                                            </Tooltip>
                                        </span>
                                    );
                                }
                                else if( btn.render ){
                                    return (
                                        <span key={i}>
                                          {btn.render(txt, record)}
                                          {i!==btns.length-1?<span className="ant-divider"></span>:''}
                                        </span>
                                    );
                                }
                            })
                        }
                     </span>)
            };
      }
      else if ( item.type === 'operate' && item.multipleType === 'dispatch' ){
        column.render = item.render || function ( txt, record ) {
            // console.log('record',record);
            let Btn1=record.Status==1?<Button onClick={self.operateOrderCallbacks.bind(self, record, 'deliver')} size={'small'} icon="edit" ></Button>:<Button onClick={self.operateOrderCallbacks.bind(self, record, 'deliver')} disabled size={'small'} icon="edit" ></Button>;

                return (<span ><Tooltip placement="right" title="派工">{Btn1}</Tooltip></span>)
        }
      }else {
        column.render = item.render || self.renderFunc[ item.type ] || ( ( text ) => ( <span>{text}</span> ) );
      }
      columns.push( column );

    } );
    this.config.expandedRowData( record, ( LotList ) => {
      // console.log( 'lotlist is :', LotList );
      lotListData = LotList;
    } )
    return ( <Table columns = { columns } dataSource = { lotListData } bordered={false} pagination = { false } size={this.state.subTableSize} /> );

  }
  // 取消删除
  popCancel() {
    message.error( 'Click on No' );
  }
  // table 操作列回调处理
  operateCallbacks( item, btn ) {
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
      } else if ( type == 'split' ) {
        this.config.Split();
      }
    } else if ( btn.callback ) {
      btn.callback( item );
    }
  }
  //
  operateSubCallbacks( item, btn ) {
    const self = this;

    if ( btn.type ) {
      let resultList;
      let type = btn.type?btn.type:btn;
      let itemI = Immutable.fromJS( item );
      let result = Immutable.fromJS( self.state.resultList );

      // table 操作栏目通用设定为 更新与删除 两项
      if ( type === 'update' ) {
        // console.log( "操作列回调处理item", item );

        this.setState( {
          updateSubFromShow: true,
          updateSubFromItem: itemI.toJS()
        } );
      }
      else if ( type === 'delete' ) {
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
      }
      else if(type === 'deliver'){
        this.setState( {
          updateSubFromShow: true,
          updateSubFromItem: itemI.toJS()
        } );
      }
    } else if ( btn.callback ) {
      btn.callback( item );
    }
  }

  operateOrderCallbacks( item, type ) {
    const self = this;

    if ( type ) {
      // console.log("操作列回调处理item",item);
      let resultList;
      // let type = btn.type;
      let itemI = Immutable.fromJS( item );
      let result = Immutable.fromJS( self.state.resultList );

      // table 操作栏目通用设定为 更新与删除 两项
      if ( type === 'update' ) {
        this.setState( {
          updateFromShow: true,
          updateFromItem: itemI.toJS()
        } );
      } else if ( type === 'scheduling' ) {
        this.setState( {
          schedulFromShow: true,
          updateFromItem: itemI.toJS()
        } );
      } else if ( type === 'cancelSplit' ) {
        this.config.cancelSplit( item, ( res ) => {
          message.success( '更新成功!' );
          self.getpageData();
        } );
      } else if ( type == 'split' ) {
        this.config.Split( item, ( res ) => {
          message.success( '更新成功!' );
          self.getpageData();
        } );
      } else if ( type === 'cancelOrder' ) {
        this.config.cancelOrder( item, ( res ) => {
          message.success( '更新成功!' );
          self.getpageData();
        } );
      } else if ( type === 'pauseOrder' ) {
        this.config.pauseOrder( item, ( res ) => {
          message.success( '更新成功!' );
          self.getpageData();
        } );
      } else if ( type === 'restartOrder' ) {
        this.config.restartOrder( item, ( res ) => {
          message.success( '更新成功!' );
          self.getpageData();
        } );
      }
      else if(type === 'deliver'){
            this.setState( {
                updateSubFromShow: true,
                updateSubFromItem: itemI.toJS()
            } );
      }
    }
    /*else if ( btn.callback ) {
      btn.callback( item );
    }*/
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

  handleExpand( e1, e2 ) {
    message.info( '展开了表格' );
    console.log( e1, e2 );
  }
  //
  handleCreate( info ) {
    const self = this;
    self.config.Create( info, function ( item ) {
      // 初级接口的坑
      /*if ( !item ) {
        config.initData( function ( list ) {
          self.setState( {
            loading: false,
            resultList: list
          } )
        } )
        return
      }*/
      message.success( '创建成功!' );
      self.getpageData();

     /* let lists = self.state.resultList;

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
      } )*/

    } )
  }
  //提交之后的操作
  handleUpdate( info ) {
    // alert('handleupdate');
    // console.log( '看看UPdate提交后的内容', info );
    // const self = this;
    let result = Immutable.fromJS( this.state.resultList );
    let infoN = Immutable.fromJS( this.state.updateFromItem )
      .merge( info )
      .toJS();
    this.config.Update( infoN, ( item ) => {
      let resultList = result.map( function ( v, i ) {
        if ( v.get( 'key' ) == item.key ) {
          return Immutable.fromJS( item )
        } else {
          return v
        }
      } );
      message.success( '更新成功!' );
      this.setState( {
        loading: false,
        updateFromShow: false,
        resultList: resultList.toJS()
      } );
    } );
  }

  handleSubUpdate( info ) {
    // const self = this;
    let infoN = Immutable.fromJS( this.state.updateSubFromItem )
      .merge( info )
      .toJS();
    this.config.SubUpdate( infoN, () => {
      message.success( '更新成功!' );
      self.getpageData();

      /*this.setState( {
        loading: false,
        updateSubFromShow: false,
        updateSubFromItem: {},
      } );*/
    } )
  }

  handleSchedul( info ) {
    // console.log( '看看formItemData', this.state.updateFromItem );
    let infoN = Immutable.fromJS( this.state.updateFromItem )
      .merge( info )
      .toJS();
    this.config.Schedul( infoN, () => {
      message.success( '更新成功!' );
      self.getpageData();

      /*this.setState( {
          loading: false,
          updateSubFromShow: false,
          schedulFromShow:false,
          updateFromItem: {},
      } );*/
    } )
  }

  //切换弹框显示
  hideUpdateForm() {
    this.setState( {
      updateFromShow: false,
      updateSubFromShow: false,
      schedulFromShow: false,
      schedulBSFromShow: false,
      updateFromItem: {},
      updateSubFromItem: {}
    } )
  }

  showBSForm() {
    this.config.BSType.forEach( ( item, index ) => {
        let sum = 0;
        if ( item.type == 'multipleSelect' ) {
            item.defaultValue = [];
            this.state.selectedRow.forEach( ( e ) => {
                item.defaultValue.push( e.UUID.toString() );
            } )
        }
        if ( item.name == 'Number' ) {
            this.state.selectedRow.forEach( ( e ) => {
                sum += e.strPlanNumber;
            } )
            item.defaultValue = sum.toString();
        }
    } )
    // console.log('this.state.selectedRow',this.state.selectedRow);
    this.setState( {
        schedulBSFromShow: true,
    } )
  }

  clearSelectedRow() {
    // alert('Clicked!');
    let clear = () => {
      let row = this.state.selectedRow;
      while ( row && row.length > 0 ) {
        row.shift();
        // console.log( 'sss' );
      }
      return;
    }
    this.setState( { selectedRow: clear, selectedRowKeys: [], selectedProductID: -1 } );
    // console.log("box-table=",this.refs.box_table);
  }

  render() {
    const { selectedRowKeys } = this.state;
    let isDisableBTN = this.state.selectedRow.length ? false : true;
    // let { sortedInfo, filteredInfo } = this.state;
    const rowSelection = {
      onChange: ( selectedRowKeys, selectedRows ) => {
        // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        if ( selectedRows.length )
          this.setState( { selectedRow: selectedRows, selectedRowKeys, selectedProductID: selectedRows[ 0 ].ProductModelUUID } );
        else
          this.setState( { selectedRow: selectedRows, selectedRowKeys, selectedProductID: -1 } );
        // console.log('selectedRow: ', this.state.selectedRow);
      },
      selectedRowKeys,
      // selectedRowKeys:this.state.selectedRow,
      // selections:[true,true,true],
      getCheckboxProps: ( record, e2, e3 ) => {
        // console.log('Disabled User',record);
        // console.log('this.state.selectedProductID',this.state.selectedProductID);
        if ( this.state.selectedProductID == -1 )
          return ( { disabled: record.strStatus !== 1 } );
        return ( { disabled: (record.ProductModelUUID !== this.state.selectedProductID||record.strStatus!==1) } );
      },
    };

    const AlertMessage = ( <div><span>已选择<a style={{fontSize:15,color:'red'}}>{this.state.selectedRow.length}</a>项</span><a style={{marginLeft:20}} onClick={this.clearSelectedRow.bind(this)}>清除</a></div> );

    let table,showBatchPro
    if ( this.config.isExpand ) {
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
                        bordered={this.state.showBorder}
                        hideDefaultSelections={true}
                        size={this.state.tableSize}
                        scroll={{ x:1500 }}
                        // onExpand={this.handleExpand}
                        />;

    } else {
      table = <Table    dataSource={this.state.resultList}
                        rowSelection={this.state.isSelection?rowSelection:null}
                        columns={this.state.columns}
                        bordered={this.state.showBorder}
                        size={this.state.tableSize}
                        loading={this.state.loading} />;
    }
    return <div className={this.props.className} >
                <div style={{ position: 'relative', margin: '0.5% 0% 10px', borderBottom: '1.6px solid #e8e8e8', padding: '6px 0 6px'}}>
                    <div style={{display:'flex', alignItems: 'center', position: 'relative', }}>
                        <span style={{ flexGrow: '1' }}><Tiltle typeIcon={'table'} centent={this.state.pageTitle}/></span>
                        <RForm RType={self.state.config.RType} submit={self.handleRetrieve} />
                        <CForm CType={self.state.config.CType} submit={self.handleCreate.bind(this)} />
                        <UForm UType={self.state.config.UType} submit={self.handleUpdate.bind(this)} isShow={this.state.updateFromShow} updateItem={this.state.updateFromItem} hideForm={this.hideUpdateForm.bind(this)}/>
                        <SForm UType={self.state.config.SType}
                            submit={this.handleSchedul.bind(this)}
                            isShow={this.state.schedulFromShow}
                            updateItem={this.state.updateFromItem}
                            hideForm={this.hideUpdateForm.bind(this)}/>
                        <BSForm UType={self.state.config.BSType}
                                submit={this.handleSchedul.bind(this)}
                                isShow={this.state.schedulBSFromShow}
                                updateItem={this.state.updateFromItem}
                                hideForm={this.hideUpdateForm.bind(this)}/>
                        <USubForm UType={self.state.config.USubType} submit={self.handleSubUpdate.bind(this)}
                            isShow={this.state.updateSubFromShow}
                            updateItem={this.state.updateSubFromItem}
                            hideForm={this.hideUpdateForm.bind(this)}/>
                        {
                            this.config.isSelection?
                            <div style={{display:'flex',}}>
                                <Button disabled={isDisableBTN} onClick={this.showBSForm.bind(this)}>批量排程</Button>
                                <Button disabled={isDisableBTN} type="primary" onClick={this.clearSelectedRow.bind(this)} style={{marginLeft:20}}>清除</Button>
                            </div>:null
                        }
                    </div>
                </div>
                { this.config.isSelection?<Alert  message={AlertMessage} type="info" showIcon />:'' }
                <div style={{marginTop:20}}>
                    {table}
                </div>
            </div>
  }
}
