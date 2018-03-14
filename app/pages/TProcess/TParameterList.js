/**
 *这是设备列表页
 *添加日期:2017.12.06
 *添加人:shaw
 **/
/******引入ant或其他第三方依赖文件*******************/
import React, { Component } from 'react';
import Mock from 'mockjs';
import { Collapse,Row,Col,Table,Form,Button,Input ,Pagination } from 'antd';
const FormItem = Form.Item;
const Panel = Collapse.Panel;

let seft

export default class DeviceList extends Component {

    constructor( props ) {
        super( props )
        this.state = {
            showModal: this.props.showModal,
            dataList:[]
        }
        seft = this;
    }

    componentWillMount(){
        let Random = Mock.Random;
        let machineType=['挤塑机','拉线机','绞线机','绕包机'],
            maintainType=['日常保养','一级保养','二级保养'];
        const template={
            obj:{
                'objectlist|15':[
                    {
                        'id|+1': 1,
                        'key|+1':1,
                        'mName|+1':1,
                        'task':`@pick(${machineType})`,
                        'machineType':`@pick(${machineType})`,
                        'maintainType':`@pick(${maintainType})`,
                        'charger':'@cname',
                        'chargerNum':'@natural(1, 8)',
                        'age':'@natural(18, 45)',
                        'department':`@pick(['生产部','设备部','维修部'])`,
                        // 'cycle':'@natural(1, 5)',
                        'cycle':function(){
                            if(this.maintainType=='日常保养') return '1'
                            else if(this.maintainType=='一级保养') return '2'
                            else if(this.maintainType=='二级保养') return '3'
                        },
                        // 'unit':`@pick(['日','周','月','季','半年','年'])`,
                        'unit':function(){
                            if(this.maintainType=='日常保养') return '日'
                            else if(this.maintainType=='一级保养') return '周'
                            else if(this.maintainType=='二级保养') return '月'
                        },
                        'effectiveTime':'@natural(24, 100)',
                        typeIndex:'1',
                    },
                ]
            },
        }
        const  dailyReport= Mock.mock( template);
        console.log('dailyReport',dailyReport);
        this.setState({
            // dataList:JSON.parse(Jlist).list
            dataList:dailyReport.obj.objectlist
        })
    }
    componentDidMount(){

    }


    render() {
        let Random = Mock.Random;
        const text = `
          A dog is a type of domesticated animal.
          Known for its loyalty and faithfulness,
          it can be found as a welcome guest in many households across the world.
        `;
        const dom=(<Row gutter={16}>
                      <Col className="gutter-row" span={6}>
                        <div className="gutter-box">挤压成型生产工艺参数</div>
                      </Col>
                      <Col className="gutter-row" span={6}>
                        <div className="gutter-box">{Random.cname()}</div>
                      </Col>
                      <Col className="gutter-row" span={6}>
                        <div className="gutter-box">12mm 6芯电缆</div>
                      </Col>
                      <Col className="gutter-row" span={6}>
                        <div className="gutter-box">v3.012</div>
                      </Col>
                    </Row>)
        const renderContent = (value, row, index) => {
            const obj = {
                children: value,
                props: {},
            };
            if ( index === 1 ) {
                obj.props.colSpan = 0;
            }
            if ( index === 3&&index === 4 ) {
                obj.props.rowSpan = 0;
            }
            return obj;
        };
        const renderContent1 = (value, row, index) => {
            const obj = {
                children: value,
                props: {},
            };
            if ( index === 1||index === 6||index === 9||index == 18) {
                obj.props.colSpan = 0;
            }
            if ( index === 3&&index === 4 ) {
                obj.props.rowSpan = 0;
            }
            return obj;
        };
        const columns = [
            {
                title: '序号',
                dataIndex: 'number',
                width:50
                // render: renderContent,
            },
            {
                title: '机台品牌',
                dataIndex: 'item2',
                render: ( value, row, index ) => {
                    console.log('索引值',index);
                    const obj = {
                      children: <span >{value}</span>,
                      props: {},
                    };
                    if ( index == 1||index == 6||index == 9||index == 18) {
                        obj.props.colSpan=6;
                        obj.children=(<div style={{textAlign:'center',fontSize:25}}><span>{value}</span></div>)
                    }
                    else if(index == 2||index == 19){
                        obj.props.rowSpan=4;
                    }
                    else if(index == 15){
                        obj.props.rowSpan=3;
                    }
                    else if(index == 3||index == 4||index == 5||index == 16||index == 17||index == 20||index == 21||index == 22){
                        obj.props.rowSpan=0;
                    }
                    return obj;
                },
            },
            {
                title: '机台编号',
                dataIndex: 'item3',
                render: renderContent1,
            },
            {
                title: '产品名称',
                // colSpan: 2,
                dataIndex: 'item4',
                render: renderContent1,
                /*render: ( value, row, index ) => {
                    const obj = {
                        children: value,
                        props: {},
                    };
                    if ( index === 2 ) {
                        obj.props.rowSpan = 2;
                    }
                    // These two are merged into above cell
                    if ( index === 3 ) {
                        obj.props.rowSpan = 0;
                    }
                    if ( index === 4 ) {
                        obj.props.colSpan = 0;
                    }
                    return obj;
                },*/
            },
            {
                title: '原料名称',
                // colSpan: 0,
                dataIndex: 'item5',
                render: renderContent1,
            },
            {
                title: '模具编号',
                dataIndex: 'item6',
                render: renderContent1,
            },
            {
                title: '操作',
                dataIndex: 'item7',
                render: renderContent1,
            }
        ];
        const parameter = [
            {
                key: '1',
                number: '1',
                item2: 'John Brown',
                item3: 32,
                item4: '0571-22098909',
                item5: 18889898989,
                item6: 'New York No. 1 Lake Park',
            },
            {
                key: '2',
                number: '2',
                item2: '周边设备区',
                item3: 32,
                item4: '0571-22098909',
                item5: 18889898989,
                item6: 'New York No. 1 Lake Park',
            },
            {
                key: '3',
                number: '3',
                item2: '周边设备',
                item3: '模温',
                item4: '烘料温度',
                item5: '冷却时间',
                item6: '室内温度',
            },
            {
                key: '4',
                number: '4',
                item2: 'London No. 2 Lake Park',
                item3: '100 ℃',
                item4: '70 ℃',
                item5: '10s',
                item6: '35±10 ℃'
            },
            {
                key: '5',
                number: '5',
                item2: 'Jake White',
                item3: '水温',
                item4: '烘料时间',
                item5: '周期时间',
                item6: '室内湿度',
            },
            {
                key: '6',
                number: '6',
                item2: 'London No. 2 Lake Park',
                item3: '100 ℃',
                item4: '4s',
                item5: '4s',
                item6: '35±10 ℃'
            },
            {
                key: '7',
                number: '7',
                item2: '温度区',
                item3: 18,
                item4: '0575-22098909',
                item5: 18900010002,
                item6: 'Dublin No. 2 Lake Park',
            },
            {
                key: '8',
                number: '8',
                item2: '机身一段',
                item3: '机身二段',
                item4: '机身三段',
                item5: '机劲',
                item6: '口模',
            },
            {
                key: '9',
                number: '9',
                item2: '165±10 ℃',
                item3: '195±10 ℃',
                item4: '190±10 ℃',
                item5: '250±5 ℃',
                item6: '245±10 ℃',
                item7: '90±10 ℃',
                item8: '165±10 ℃',
            },
            {
                key: '10',
                number: '10',
                item2: '成型工艺',
                item3: 18,
                item4: '0575-22098909',
                item5: 18900010002,
                item6: 'Dublin No. 2 Lake Park',
                item7: 'Dublin No. 2 Lake Park',
                item8: 'Dublin No. 2 Lake Park',
            },
            {
                key: '11',
                number: '11',
                item2: '循环时间监控',
                item3: '保压时间(s)',
                item4: '螺杆退回(mm)',
                item5: '关机延时(s)',
                item6: '保压压力(bar)',
                item7: '预塑停止(mm)',
                item8: '暂停时间(s)',
            },
            {
                key: '12',
                number: '12',
                item2: 'Jake White',
                item3: 18,
                item4: '0575-22098909',
                item5: 18900010002,
                item6: 'Dublin No. 2 Lake Park',
                item7: 'Dublin No. 2 Lake Park',
                item8: 'Dublin No. 2 Lake Park',
            },
            {
                key: '13',
                number: '13',
                item2: '冷却时间(s)',
                item3: '余料量(mm)',
                item4: '注射压力(bar)',
                item5: '预塑延迟(s)',
                item6: '切换行程',
                item7: '注射速度(mm/s)',
                item8: '转速(U/min)',
            },
            {
                key: '14',
                number: '14',
                item2: 'Jake White',
                item3: 18,
                item4: '0575-22098909',
                item5: 18900010002,
                item6: 'Dublin No. 2 Lake Park',
                item7: 'Dublin No. 2 Lake Park',
                item8: 'Dublin No. 2 Lake Park',
            },
            {
                key: '15',
                number: '15',
                item2: '切换时间(s)',
                item3: '',
                item4: '保压释放',
                item5: 18900010002,
                item6: 'Dublin No. 2 Lake Park',
                item7: 'Dublin No. 2 Lake Park',
                item8: 'Dublin No. 2 Lake Park',
            },
            {
                key: '16',
                number: '16',
                item2: '多级注射',
                item3: '速度(mm/s)',
                item4: '--',
                item5: '--',
                item6: '--',
                item7: '--',
                item8: '--',
            },
            {
                key: '17',
                number: '17',
                item2: 'Jake White',
                item3: '行程(mm)',
                item4: '--',
                item5: '--',
                item6: '--',
                item7: '--',
                item8: '--',
            },
            {
                key: '18',
                number: '18',
                item2: 'Jake White',
                item3: '阶段',
                item4: '--',
                item5: '--',
                item6: '--',
                item7: '--',
                item8: '--',
            },
            {
                key: '19',
                number: '19',
                item2: '模具设置',
                item3: 18,
                item4: '0575-22098909',
                item5: 18900010002,
                item6: 'Dublin No. 2 Lake Park',
                item7: 'Dublin No. 2 Lake Park',
                item8: 'Dublin No. 2 Lake Park',
            },
            {
                key: '20',
                number: '20',
                item2: '顶出设置',
                item3: '顶出延迟',
                item4: '顶出压力',
                item5: '顶出-V1(%)',
                item6: '顶出-V2(%)',
                item7: 'Dublin No. 2 Lake Park',
                item8: 'Dublin No. 2 Lake Park',
            },
            {
                key: '21',
                number: '21',
                item2: 'Jake White',
                item3: 18,
                item4: '0575-22098909',
                item5: 18900010002,
                item6: 'Dublin No. 2 Lake Park',
                item7: 'Dublin No. 2 Lake Park',
                item8: 'Dublin No. 2 Lake Park',
            },
            {
                key: '22',
                number: '22',
                item2: 'Jake White',
                item3: 18,
                item4: '0575-22098909',
                item5: 18900010002,
                item6: 'Dublin No. 2 Lake Park',
                item7: 'Dublin No. 2 Lake Park',
                item8: 'Dublin No. 2 Lake Park',
            },
            {
                key: '23',
                number: '23',
                item2: 'Jake White',
                item3: 18,
                item4: '0575-22098909',
                item5: 18900010002,
                item6: 'Dublin No. 2 Lake Park',
                item7: 'Dublin No. 2 Lake Park',
                item8: 'Dublin No. 2 Lake Park',
            },
            {
                key: '23',
                number: '23',
                item2: 'Jake White',
                item3: 18,
                item4: '0575-22098909',
                item5: 18900010002,
                item6: 'Dublin No. 2 Lake Park',
                item7: 'Dublin No. 2 Lake Park',
                item8: 'Dublin No. 2 Lake Park',
            },
        ];

        return (
            <div>
                <div className="search" style={{marginBottom:15}}>
                    <Form layout="inline" >

                        <FormItem key="1" label={'搜索内容'}>
                            <Input placeholder={'请输入搜索内容' } />
                        </FormItem>
                        <FormItem key="2">
                            <Button type="primary"  icon="search" >查询</Button>
                        </FormItem>
                        <FormItem key="3">
                            <Button type="primary" icon="plus-circle-o">添加</Button>
                        </FormItem>
                    </Form>
                </div>
                <div style={{border:'1px solid #cdcdcd',borderBottom:0,fontSize:26}}>
                    <Row gutter={16}>
                        <Col className="gutter-row" span={6}>
                            <div className="gutter-box" style={{marginLeft:32}}>参数类别</div>
                        </Col>
                        <Col className="gutter-row" span={6}>
                            <div className="gutter-box">参数维护人</div>
                        </Col>
                        <Col className="gutter-row" span={6}>
                            <div className="gutter-box">产品名称</div>
                        </Col>
                        <Col className="gutter-row" span={6}>
                            <div className="gutter-box">版本号</div>
                        </Col>
                    </Row>
                </div>
                <Collapse accordion>
                  <Panel header={dom} key="1">
                        <Table
                            columns={columns}
                            dataSource={parameter}
                            bordered
                            pagination={false}
                            size='small'
                            title={(e)=>(<div><span style={{fontSize:28,fontWeight:'bold'}}>挤压成型生产条件参数表</span></div>)} />
                  </Panel>
                  <Panel header={dom} key="2">
                      <Table
                          columns={columns}
                          dataSource={parameter}
                          bordered
                          pagination={false}
                          size='small'
                          title={(e)=>(<div><span style={{fontSize:28,fontWeight:'bold'}}>挤压成型生产条件参数表</span></div>)} />
                  </Panel>
                  <Panel header={dom} key="3">
                      <Table
                          columns={columns}
                          dataSource={parameter}
                          bordered
                          pagination={false}
                          size='small'
                          title={(e)=>(<div><span style={{fontSize:28,fontWeight:'bold'}}>挤压成型生产条件参数表</span></div>)} />
                  </Panel>
                  <Panel header={dom} key="4">
                      <Table
                          columns={columns}
                          dataSource={parameter}
                          bordered
                          pagination={false}
                          size='small'
                          title={(e)=>(<div><span style={{fontSize:28,fontWeight:'bold'}}>挤压成型生产条件参数表</span></div>)} />
                  </Panel>
                  <Panel header={dom} key="5">
                      <Table
                          columns={columns}
                          dataSource={parameter}
                          bordered
                          pagination={false}
                          size='small'
                          title={(e)=>(<div><span style={{fontSize:28,fontWeight:'bold'}}>挤压成型生产条件参数表</span></div>)} />
                  </Panel>
                  <Panel header={dom} key="6">
                      <Table
                          columns={columns}
                          dataSource={parameter}
                          bordered
                          pagination={false}
                          size='small'
                          title={(e)=>(<div><span style={{fontSize:28,fontWeight:'bold'}}>挤压成型生产条件参数表</span></div>)} />
                  </Panel>
                  <Panel header={dom} key="7">
                      <Table
                          columns={columns}
                          dataSource={parameter}
                          bordered
                          pagination={false}
                          size='small'
                          title={(e)=>(<div><span style={{fontSize:28,fontWeight:'bold'}}>挤压成型生产条件参数表</span></div>)} />
                  </Panel>
                  <Panel header={dom} key="8">
                      <Table
                          columns={columns}
                          dataSource={parameter}
                          bordered
                          pagination={false}
                          size='small'
                          title={(e)=>(<div><span style={{fontSize:28,fontWeight:'bold'}}>挤压成型生产条件参数表</span></div>)} />
                  </Panel>
                  <Panel header={dom} key="9">
                      <Table
                          columns={columns}
                          dataSource={parameter}
                          bordered
                          pagination={false}
                          size='small'
                          title={(e)=>(<div><span style={{fontSize:28,fontWeight:'bold'}}>挤压成型生产条件参数表</span></div>)} />
                  </Panel>
                  <Panel header={dom} key="10">
                      <Table
                          columns={columns}
                          dataSource={parameter}
                          bordered
                          pagination={false}
                          size='small'
                          title={(e)=>(<div><span style={{fontSize:28,fontWeight:'bold'}}>挤压成型生产条件参数表</span></div>)} />
                  </Panel>
                </Collapse>
                {/* <table border="1">
                  <thead>
                    <tr>
                      <th>Month</th>
                      <th>Savings</th>
                    </tr>
                  </thead>
                  <tbody>
                      <tr>
                          <td>January</td>
                          <td>$100</td>
                          <td>$100</td>
                          <td>$100</td>
                          <td>$100</td>
                      </tr>
                      <tr>
                          <td>February</td>
                          <td>$80</td>
                      </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td>Sum</td>
                      <td>$180</td>
                    </tr>
                  </tfoot>
                </table> */}

                <Pagination style={{float:'right',marginTop:15}} size="small" total={15} />
            </div>
        )
    }
}
