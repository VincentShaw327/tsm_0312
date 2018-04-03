import React, {Component} from 'react';


const titleStyle={
  borderBottom:'solid 2px #bbbdb8',
  margin:'10px 0',
  fontSize:25
}



export default class PageTitle extends Component{

  constructor(props) {
    super(props)
    this.state = {
      title: props.title,
    }
  }

  render(){
    return(
      <p style={titleStyle}>{this.props.title}</p>
    )
  }
}
