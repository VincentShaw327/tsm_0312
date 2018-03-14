import React, {Component} from 'react';

export default class temp extends Component{

  constructor(props) {
    super(props)
    this.state = {
      title: props.title,
    }
  }

  render(){
    return(
      <p >this is template</p>
    )
  }
}
