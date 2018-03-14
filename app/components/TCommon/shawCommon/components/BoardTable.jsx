import React, {Component} from 'react'
import { Row, Col } from 'antd';
import PropTypes from 'prop-types';

//自定义组件


export default class BoardTable extends Component {

    constructor(props) {
        super(props)
        this.state = {
            thead:'',
            defaultWidth:0,
            renderDom:[]
        }
    }
    componentWillMount(){
        let Width=Math.floor(24/this.props.columns.length);
        this.setState({defaultWidth:Width});
    }

    tableHead(column){
        let defaultWidth=this.state.defaultWidth;
        let headFontsize=this.props.HeadFontsize?this.props.HeadFontsize:25;
        // console.log('column',defaultWidth);
        return(<div>
            <Row gutter={16} style={{color:'white',background:'#0c5f9c',marginBottom:5,padding:8,borderRadius:6,fontSize:`${headFontsize}`}}>
                {
                    column.map((item,index)=>{
                        /*if(item.hasOwnProperty('render')){
                            let dom=item.render(index);
                            console.log(dom)
                            this.state.renderDom.push(dom);
                        }*/
                        return(
                            <Col key={index} span={item.width?item.width:defaultWidth}>
                                <span>{item.title}</span>
                            </Col>
                        )
                    })
                }
            </Row>
        </div>)
    }
    tableBody(data){
        let defaultWidth=this.state.defaultWidth;
        let bodyFontsize=this.props.BodyFontsize?this.props.BodyFontsize:25;
        // let defaultWidth=Math.floor(24/data.length);

        let dataName='';
        let columns=this.props.columns;
        return(
            <div style={{fontSize:`${bodyFontsize}`}}>
                {
                    data.map((item,index)=>{
                        // console.log('column',item);
                        let bgColor='#2f9eeb';
                        /*bgColor=item.status==0?'red':'#2f9eeb';
                        bgColor=item.status==1?'#2f9eeb':'white';
                        bgColor=item.status==2?'#c6c614':'white';*/
                        if(item.status==0)bgColor='red';
                        if(item.status==1)bgColor='#2f9eeb';
                        if(item.status==2)bgColor='#c6c614';
                        return(
                            <Row key ={index}  style={{border:'solid 1px #efefef',color:'white',background:`${bgColor}`, marginBottom:15,padding:8,borderRadius:6,'box-shadow':'#4489e1 0px 0px 6px 3px'}}>
                                {
                                    columns.map((ele,subIndex)=>{
                                        dataName=ele.dataIndex;
                                        // console.log('dataName',dataName);
                                        let renderDom=''
                                        if(ele.hasOwnProperty('render')){
                                            renderDom=ele.render(item);
                                            return(
                                                <Col key={subIndex} span={ele.width?ele.width:defaultWidth}>
                                                    {renderDom}
                                                </Col>
                                            )
                                        }
                                        else if (item.hasOwnProperty(dataName)) {
                                            return(
                                                <Col key={subIndex} span={ele.width?ele.width:defaultWidth}>
                                                    <span>{item[dataName]}</span>
                                                </Col>
                                            )
                                        }
                                    })
                                }
                            </Row>
                        )
                    })
                }
            </div>
        )
    }

    render() {
        let thead=this.tableHead(this.props.columns);
        let tbody=this.tableBody(this.props.data);
        return  (
            <div>
                {thead}
                {tbody}
            </div>
        )
    }
}

BoardTable.propTypes = {
  name: PropTypes.string,
  dataSource: PropTypes.array,
  columns: PropTypes.array,
  prefixCls: PropTypes.string,
  useFixedHeader: PropTypes.bool,
  rowSelection: PropTypes.object,
  className: PropTypes.string,
  size: PropTypes.string,
  loading: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object,
  ]),
  bordered: PropTypes.bool,
  onChange: PropTypes.func,
  locale: PropTypes.object,
  dropdownPrefixCls: PropTypes.string,
};
