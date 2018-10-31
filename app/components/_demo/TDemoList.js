import React,{Component} from 'react'
import {TPostData} from '../../utils/TAjax'

class TDemoList extends Component{
    constructor(props){
        super(props)
        this.state={
            datas:[]
        }
        this.TGetData=this.TGetData.bind(this)
    }


    TGetData()
    {
      let res = TPostData('./TDemoList.json',{"cid":2});
      this.setState({datas:res.obj});
    }

    render(){
        const datas=this.state.datas;
        return (
           <div>
                    <button onClick={this.TGetData.bind(this)}>测试</button>
                    <ul>
                  { datas.map((item,index)=>{
                      return <li key={index}>{item.name}</li>
                 })}
              </ul>
           </div>
        )
    }
}
export default TDemoList;
