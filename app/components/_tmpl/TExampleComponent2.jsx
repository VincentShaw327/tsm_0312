// 我们知道，当组件的props或者state发生变化的时候：
// React会对组件当前的Props和State分别与nextProps和nextState进行比较，当发现变化时，
// 就会对当前组件以及子组件进行重新渲染，否则就不渲染。
// 有时候为了避免组件进行不必要的重新渲染，我们通过定义shouldComponentUpdate来优化性能。
// 例如如下代码：

class CounterButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {count: 1};
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.color !== nextProps.color) {
      return true;
    }
    if (this.state.count !== nextState.count) {
      return true;
    }
    return false;
  }

  render() {
    return (
      <button
        color={this.props.color}
        onClick={() => this.setState(state => ({count: state.count + 1}))}>
        Count: {this.state.count}
      </button>
    );
  }
}
// shouldComponentUpdate通过判断props.color和state.count
// 是否发生变化来决定需不需要重新渲染组件，
// 当然有时候这种简单的判断，显得有些多余和样板化，
// 于是React就提供了PureComponent来自动帮我们做这件事，
//这样就不需要手动来写shouldComponentUpdate了：

class CounterButton extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {count: 1};
  }

  render() {
    return (
      <button
        color={this.props.color}
        onClick={() => this.setState(state => ({count: state.count + 1}))}>
        Count: {this.state.count}
      </button>
    );
  }
}
// 大多数情况下， 我们使用PureComponent能够简化我们的代码，并且提高性能，
// 但是PureComponent的自动为我们添加的shouldComponentUpate函数，
// 只是对props和state进行浅比较(shadow comparison)，
// 当props或者state本身是嵌套对象或数组等时，浅比较并不能得到预期的结果，
// 这会导致实际的props和state发生了变化，但组件却没有更新的问题，
// 例如下面代码有一个ListOfWords组件来将单词数组拼接成逗号分隔的句子，
// 它有一个父组件WordAdder让你点击按钮为单词数组添加单词，但他并不能正常工作：
