/**
 *这是冲压车间监控页
 *添加日期:2018.03.07
 **/
/******引入ant或其他第三方依赖文件*******************/
import React, { Component } from 'react'
import {Card,Row,Col,Divider,Tooltip,Icon ,Tag,List,Form,Tabs } from 'antd';
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
import { TPostData } from '../utils/TAjax';
import numeral from 'numeral';
import moment from 'moment';

//运动的图表
import ActiveChart from './ant-design-pro/ActiveChart'
//图标列表
import AvatarList from './ant-design-pro/AvatarList'

import {  yuan,
  Bar,
  Pie,
  Gauge,
  Radar,
  MiniBar,
  MiniArea,
  MiniProgress,
  ChartCard,
  Field,
  WaterWave,
  TagCloud,
  TimelineChart, } from './ant-design-pro/Charts';

import Trend from './ant-design-pro/Trend';
import CountDown from './ant-design-pro/CountDown';
import Ellipsis from './ant-design-pro/Ellipsis';
import DescriptionList from './ant-design-pro/DescriptionList';
import FUpload from './TUploader/FileUploader';
// import FileUpload from './TUploader';
import PageHeaderLayout from '../base/PageHeaderLayout';

const { Description } = DescriptionList;

export default class TTechnicalSupport extends Component {
    constructor( props ) {
        super( props )
        //组件外的指针.
        this.state = {

        }
        this.url='/api/TUser/auth';
    }

    render(){

        const formItemLayout = {
            labelCol: {
              xs: { span: 24 },
              sm: { span: 2 },
            },
            wrapperCol: {
              xs: { span: 24 },
              sm: { span: 22 },
            },
          };

        const data = [
            {
              title: '运动的图表',
              content:()=>(<ActiveChart />)
            },
            {
              title: '迷你饼状图',
              content:()=>( <Pie percent={28} subTitle="中式快餐" total="28%" height={140} />)
            },
            {
              title: '迷你进度条',
              content:()=>( <MiniProgress percent={78} strokeWidth={8} target={80} />)
            },
            {
              title: '仪表盘',
              content:()=><Gauge title="核销率"
                  height={184} percent={87}/>
            },
            {
              title: '图标列表',
              content:()=>(<AvatarList size="mini">
                <AvatarList.Item tips="Jake" src="https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png" />
                <AvatarList.Item tips="Andy" src="https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png" />
                <AvatarList.Item tips="Niko" src="https://gw.alipayobjects.com/zos/rmsportal/kZzEzemZyKLKFsojXItE.png" />
              </AvatarList>)
            },
            {
              title: '图标卡，销售额',
              content:()=>(      <ChartCard
                      title="销售额"
                      action={<Tooltip title="指标说明"><Icon type="info-circle-o" /></Tooltip>}
                      total={yuan(126560)}
                      footer={<Field label="日均销售额" value={numeral(12423).format('0,0')} />}
                      contentHeight={56}
                    >
                      <span>
                        周同比
                        <Trend flag="up" style={{ marginLeft: 8, color: 'rgba(0,0,0,.85)' }}>12%</Trend>
                      </span>
                      <span style={{ marginLeft: 16 }}>
                        日环比
                        <Trend flag="down" style={{ marginLeft: 8, color: 'rgba(0,0,0,.85)' }}>11%</Trend>
                      </span>
                    </ChartCard>)
            },
            {
              title: '柱状图',
              content:()=>{
                  const salesData = [];
                  for (let i = 0; i < 12; i += 1) {
                    salesData.push({
                      x: `${i + 1}月`,
                      y: Math.floor(Math.random() * 1000) + 200,
                    });
                  }
                return <Bar
                    height={200}
                    title="销售额趋势"
                    data={salesData}
                  />
              }
            },
            {
              title: '迷你区域图',
              content:()=>{
                  const visitData = [];
                  const beginDay = new Date().getTime();
                  for (let i = 0; i < 20; i += 1) {
                    visitData.push({
                      x: moment(new Date(beginDay + (1000 * 60 * 60 * 24 * i))).format('YYYY-MM-DD'),
                      y: Math.floor(Math.random() * 100) + 10,
                    });
                  }
                return   <MiniArea
                    line
                    color="#cceafe"
                    height={45}
                    data={visitData}
                  />
              }
            },
            {
              title: '迷你柱状图',
              content:()=>{
                  const visitData = [];
                  const beginDay = new Date().getTime();
                  for (let i = 0; i < 20; i += 1) {
                    visitData.push({
                      x: moment(new Date(beginDay + (1000 * 60 * 60 * 24 * i))).format('YYYY-MM-DD'),
                      y: Math.floor(Math.random() * 100) + 10,
                    });
                  }
                return   <MiniBar
                  height={45}
                  data={visitData}
                />
              }
            },
            {
              title: '饼状图',
              content:()=>{
                  const salesPieData = [
                    {
                      x: '家用电器',
                      y: 4544,
                    },
                    {
                      x: '食用酒水',
                      y: 3321,
                    },
                    {
                      x: '个护健康',
                      y: 3113,
                    },
                    {
                      x: '服饰箱包',
                      y: 2341,
                    },
                    {
                      x: '母婴产品',
                      y: 1231,
                    },
                    {
                      x: '其他',
                      y: 1231,
                    },
                  ];
                return     <Pie
                    hasLegend
                    title="销售额"
                    subTitle="销售额"
                    total={yuan(salesPieData.reduce((pre, now) => now.y + pre, 0))}
                    data={salesPieData}
                    valueFormat={val => yuan(val)}
                    height={294}
                  />
              }
            },
            {
              title: '雷达图',
              content:()=>{
                  const radarOriginData = [
                    {
                      name: '个人',
                      ref: 10,
                      koubei: 8,
                      output: 4,
                      contribute: 5,
                      hot: 7,
                    },
                    {
                      name: '团队',
                      ref: 3,
                      koubei: 9,
                      output: 6,
                      contribute: 3,
                      hot: 1,
                    },
                    {
                      name: '部门',
                      ref: 4,
                      koubei: 1,
                      output: 6,
                      contribute: 5,
                      hot: 7,
                    },
                  ];
                  const radarData = [];
                  const radarTitleMap = {
                    ref: '引用',
                    koubei: '口碑',
                    output: '产量',
                    contribute: '贡献',
                    hot: '热度',
                  };
                  radarOriginData.forEach((item) => {
                    Object.keys(item).forEach((key) => {
                      if (key !== 'name') {
                        radarData.push({
                          name: item.name,
                          label: radarTitleMap[key],
                          value: item[key],
                        });
                      }
                    });
                  });

                return  <ChartCard title="数据比例">
                          <Radar
                            hasLegend
                            height={286}
                            data={radarData}
                          />
                        </ChartCard>
              }
            },
            {
              title: '带有时间轴的图表',
              content:()=>{
                  const chartData = [];
                  for (let i = 0; i < 20; i += 1) {
                    chartData.push({
                      x: (new Date().getTime()) + (1000 * 60 * 30 * i),
                      y1: Math.floor(Math.random() * 100) + 1000,
                      y2: Math.floor(Math.random() * 100) + 10,
                    });
                  }

                return   <TimelineChart
                            height={200}
                            data={chartData}
                            titleMap={{ y1: '客流量', y2: '支付笔数' }}
                          />
              }
            },
            {
              title: '水波图',
              content:()=><WaterWave
                    height={161}
                    title="补贴资金剩余"
                    percent={34}
                  />
            },
            {
              title: '标签云',
              content:()=>{
                  const tags = [];
                  for (let i = 0; i < 50; i += 1) {
                    tags.push({
                      name: `TagClout-Title-${i}`,
                      value: Math.floor((Math.random() * 50)) + 20,
                    });
                  }

                return    <TagCloud
                            data={tags}
                            height={200}
                          />
              }
            },
            {
              title: '简单的倒计时组件使用',
              content:()=>{
                const targetTime = new Date().getTime() + 3900000;
                return  <CountDown style={{ fontSize: 20 }} target={targetTime} />
              }
            }
        ];

        const data2 = [
            {
              title: '基本描述列表。',
              content:()=>{
                return  <DescriptionList size="large" title="title">
                  <Description term="Firefox">
                    A free, open source, cross-platform,
                    graphical web browser developed by the
                    Mozilla Corporation and hundreds of
                    volunteers.
                  </Description>
                  <Description term="Firefox">
                    A free, open source, cross-platform,
                    graphical web browser developed by the
                    Mozilla Corporation and hundreds of
                    volunteers.
                  </Description>
                  <Description term="Firefox">
                    A free, open source, cross-platform,
                    graphical web browser developed by the
                    Mozilla Corporation and hundreds of
                    volunteers.
                  </Description>
                </DescriptionList>
              }
            },
            {
              title: '垂直布局。',
              content:()=>{
                return    <DescriptionList size="large" title="title" layout="vertical">
                    <Description term="Firefox">
                      A free, open source, cross-platform,
                      graphical web browser developed by the
                      Mozilla Corporation and hundreds of
                      volunteers.
                    </Description>
                    <Description term="Firefox">
                      A free, open source, cross-platform,
                      graphical web browser developed by the
                      Mozilla Corporation and hundreds of
                      volunteers.
                    </Description>
                    <Description term="Firefox">
                      A free, open source, cross-platform,
                      graphical web browser developed by the
                      Mozilla Corporation and hundreds of
                      volunteers.
                    </Description>
                  </DescriptionList>
              }
            },
            {
              title: '垂直布局。',
              content:()=>{
                const article = <p>There were injuries alleged in three <a href="#cover">cases in 2015</a>, and a fourth incident in September, according to the safety recall report. After meeting with US regulators in October, the firm decided to issue a voluntary recall.</p>;
                return   <div style={{ width: 200 }}>
                  <Ellipsis tooltip lines={3}>{article}</Ellipsis>
                </div>
              }
            },
        ];

        const bcList11 = [{
          title:"首页",
          href: '/',
          }, {
          title: '车间管理',
          href: '/',
          }, {
          title: '工作中心',
          }];

        return(
            <div>
                <PageHeaderLayout
                    title={"DEMO"}
                    // action={showDetal?HeadAction:''}
                    // content={showDetal?HeadContent:''}
                    // BreadcrumbList={bcList11}
                    wrapperClassName="pageContent">
                        <div className="cardContent">
                            <Tabs defaultActiveKey="1" >
                                <TabPane tab="选项卡一" key="1">
                                    <List
                                        grid={{ gutter: 16, column: 4 }}
                                        dataSource={data}
                                        renderItem={item => (
                                            <List.Item>
                                                <Card title={item.title}>{item.content()}</Card>
                                            </List.Item>
                                        )}
                                    />
                                </TabPane>
                                <TabPane tab="选项卡二" key="2">
                                    <List
                                        grid={{ gutter: 16, column: 1 }}
                                        dataSource={data2}
                                        renderItem={item => (
                                            <List.Item>
                                                <Card title={item.title}>{item.content()}</Card>
                                            </List.Item>
                                        )}
                                    />
                                </TabPane>
                                <TabPane tab="选项卡三" key="3">选项卡三内容
                                    <div >
                                        <FUpload />
                                    </div>
                                </TabPane>
                            </Tabs>
                        </div>
                </PageHeaderLayout>
            </div>
        )
    }
}
