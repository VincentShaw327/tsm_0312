import React, {Component} from 'react'
import './stateBottom.less'


export default class StateBotton extends Component {
    // state = {  }
    constructor(props) {
        super(props)
        this.state = {
            currentState: this.props.state,
            content: this.props.content,
            Name:'',
            Txt:''
        }
        // self = this;
    }

    render() {
        const {stateType,state,content}=this.props;
        let stateName='',
        contentTxt='';
        let orderStyle={
            padding:'5% 15%',
            borderRadius:8
        };
        let task={
            padding:'3% 10%',
            borderRadius:8
        };
        let workOrder={
            padding:'5% 15%',
            borderRadius:8
        };
        let statusStyle={};
        if(stateType&&state!='undefined'&&stateType=='order'){
            statusStyle=orderStyle;
            switch (state) {

                case 0:
                    stateName='freezing';
                    contentTxt='冻结中';
                    break;
                case 1:
                    stateName='active';
                    contentTxt='活跃中';
                    break;
                case 2:
                    stateName='splited';
                    contentTxt='已拆分';
                    break;
                case 3:
                    stateName='scheduled';
                    contentTxt='已排程';
                    break;
                case 4:
                    stateName='producing';
                    contentTxt='生产中';
                    break;
                case 5:
                    stateName='completed';
                    contentTxt='已完成';
                    break;
                case 6:
                    stateName='pause';
                    contentTxt='暂停中';
                    break;
                default:
                    stateName='active';
                    contentTxt='其它状态';
                    break;
            }
        }
        else if(stateType&&state!='undefined'&&stateType=='task'){
            statusStyle=task;

            switch (state) {

                case 0:
                    stateName='freezing';
                    contentTxt='冻结中';
                    break;
                case 1:
                    stateName='active';
                    contentTxt='未排产';
                    break;
                case 2:
                    stateName='splited';
                    contentTxt='已排产';
                    break;
                case 3:
                    stateName='scheduled';
                    contentTxt='已派工';
                    break;
                case 4:
                    stateName='producing';
                    contentTxt='生产中';
                    break;
                case 5:
                    stateName='completed';
                    contentTxt='已完成';
                    break;
                case 6:
                    stateName='pause';
                    contentTxt='暂停中';
                    break;
                default:
                    stateName='active';
                    contentTxt='其它状态';
                    break;
            }
        }
        else if(stateType&&state!='undefined'&&stateType=='workOrder'){
            statusStyle=workOrder;
            switch (state) {

                case 0:
                    stateName='freezing';
                    contentTxt='冻结中';
                    break;
                case 1:
                    stateName='active';
                    contentTxt='未派工';
                    break;
                case 2:
                    stateName='splited';
                    contentTxt='已派工';
                    break;
                case 3:
                    stateName='scheduled';
                    contentTxt='已派工';
                    break;
                case 4:
                    stateName='producing';
                    contentTxt='生产中';
                    break;
                case 5:
                    stateName='completed';
                    contentTxt='已完成';
                    break;
                case 6:
                    stateName='pause';
                    contentTxt='暂停中';
                    break;
                default:
                    stateName='active';
                    contentTxt='其它状态';
                    break;
            }
        }

        //this.setState({Name:stateName,Txt:contentTxt});
        return (
            <div className="statebottom" style={{color: '#f8f1f1',fontWeight: 'bolder',fontSize: 12}}>
                <span className={stateName} style={statusStyle}>
                    {contentTxt}
                </span>
            </div>
        );
    }
}
