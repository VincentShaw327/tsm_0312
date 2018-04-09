//上面我们提到的创建组件的方式，都是用来创建包含状态和用户交互的复杂组件，
//当组件本身只是用来展示，所有数据都是通过props传入的时候，
//我们便可以使用Stateless Functional Component来快速创建组件。
//例如下面代码所示:

import React from 'react';
import PropTypes from 'prop-types';
const TStateLessComponent = ({
  day,
  increment
}) => {
  return (
    <div>
      <button onClick={increment}>Today is {day}</button>
    </div>
  )
}

TStateLessComponent.propTypes = {
  day: PropTypes.string.isRequired,
  increment: PropTypes.func.isRequired,
}

//这种组件，没有自身的状态，相同的props输入，必然会获得完全相同的组件展示。
//因为不需要关心组件的一些生命周期函数和渲染的钩子，
//所以不用继承自Component显得更简洁。
