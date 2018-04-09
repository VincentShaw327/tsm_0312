
// 参考:https://www.cnblogs.com/Unknw/p/6431375.html

// 因为ES6对类和继承有语法级别的支持，
// 所以用ES6创建组件的方式更加优雅，
// 下面是示例：

import React from 'react';
import PropTypes from 'prop-types';
class Greeting extends React.Component {

  constructor(props) {
    super(props);
    this.state = {count: props.initialCount};
    this.handleClick = this.handleClick.bind(this);
  }

  //static defaultProps = {
  //  name: 'Mary'  //定义defaultprops的另一种方式
  //}

  //static propTypes = {
    //name: React.PropTypes.string
  //}

  handleClick() {
    //点击事件的处理函数
  }

  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}

Greeting.propTypes = {
  name: React.PropTypes.string
};

Greeting.defaultProps = {
  name: 'Mary'
};
export default Greating;


// 可以看到Greeting继承自React.component,在构造函数中，
// 通过super()来调用父类的构造函数，
// 同时我们看到组件的state是通过在构造函数中对this.state进行赋值实现，
// 而组件的props是在类Greeting上创建的属性，
// 如果你对类的属性和对象的属性的区别有所了解的话，大概能理解为什么会这么做。
//对于组件来说，组件的props是父组件通过调用子组件向子组件传递的，
//子组件内部不应该对props进行修改，它更像是所有子组件实例共享的状态，
//不会因为子组件内部操作而改变，因此将props定义为类Greeting的属性更为合理，
//而在面向对象的语法中类的属性通常被称作静态(static)属性，
//这也是为什么props还可以像上面注释掉的方式来定义。
//对于Greeting类的一个实例对象的state，它是组件对象内部维持的状态，
//通过用户操作会修改这些状态，每个实例的state也可能不同，彼此间不互相影响，
//因此通过this.state来设置。

//用这种方式创建组件时，React并没有对内部的函数，进行this绑定，
//所以如果你想让函数在回调中保持正确的this，
//就要手动对需要的函数进行this绑定，如上面的handleClick，
//在构造函数中对this 进行了绑定。
