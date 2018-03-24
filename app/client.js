import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
// import { Provider } from 'react-redux'
// import './config'
// import './index.less'
// import Routes from './routes'
// import configure from './store/configureStore'

import { Router, Route, IndexRoute } from 'react-router'
import hashHistory from './history'
// import App from './base'
import App1 from './base1/TIndexPage'
import './index.less'

// import Welcome from './pages/welcome'
// 表格列表
/*const table = ( location, cb ) => {
    require.ensure( [], ( require ) => {
        cb( null, require( './pages/menu/table' )
            .default )
    }, 'table' )
}
// 图表
const echarts = ( location, cb ) => {
    require.ensure( [], ( require ) => {
        cb( null, require( './pages/menu/echarts' )
            .default )
    }, 'echarts' )
}
// 登录*/
const Login = ( location, cb ) => {
    require.ensure( [], ( require ) => {
        cb( null, require( './pages/login' )
            .default )
    }, 'login' )
}
// 注册
const Register = ( location, cb ) => {
    require.ensure( [], ( require ) => {
        cb( null, require( './pages/register' )
            .default )
    }, 'register' )
}
// 测试
/*const chat = ( location, cb ) => {
    require.ensure( [], ( require ) => {
        cb( null, require( './pages/chat' )
            .default )
    }, 'chat' )
}

// 编辑器
const editor = ( location, cb ) => {
    require.ensure( [], ( require ) => {
        cb( null, require( './pages/menu/editor' )
            .default )
    }, 'editor' )
}

/* 进入路由的判断 */
function isLogin( nextState, replaceState ) {
    const token = sessionStorage.getItem( 'token' )
    if ( !token ) {
        replaceState( '/login' )
        // hashHistory.push('/login')
    }
}

// const store = configure( { config: global.gconfig } )

/*ReactDOM.render(
  <Provider store={store}>
    <Routes />
  </Provider>,
  document.getElementById('root'),
)*/


// 工作中心
const TWorkCenterDetail = ( location, cb ) => {
    require.ensure( [], ( require ) => {
        cb( null, require( './pages/TFactory/TWorkCenterDetail' )
            .default )
    }, 'TWorkCenterDetail' )
}
//BOM详情
const TBomDetail = ( location, cb ) => {
    require.ensure( [], ( require ) => {
        cb( null, require( './pages/TBom/TBomDetail' )
            .default )
    }, 'TBomDetail' )
}

//用户详情
const TUserDetails = ( location, cb ) => {
    require.ensure( [], ( require ) => {
        cb( null, require( './pages/TUser/TUserDetails' )
            .default )
    }, 'TUserDetails' )
}
//权限详情
const TUserAuthDetail = ( location, cb ) => {
    require.ensure( [], ( require ) => {
        cb( null, require( './pages/TUser/TUserAuthDetail' )
            .default )
    }, 'TUserAuthDetail' )
}

// console.log('TWorkCenterDetail',TWorkCenterDetail);
// onEnter={isLogin}
const routes = (
    <Router history={hashHistory}>
      <Route path="/" component={App1} >
        {/* <IndexRoute component={Welcome} /> */}
        {/* <Route path="/table" getComponent={table} /> */}
        {/* <Route path="/echarts" getComponent={echarts} /> */}
        {/* <Route path="/editor" getComponent={editor} /> */}
        {/* <Route path="/chat" getComponent={chat} /> */}
        {/* <Route path="/monitor1" getComponent={monitor1} />
        <Route path="/monitor2" getComponent={monitor2} />
        <Route path="/TManufactureOrder" getComponent={TManufactureOrder} />
        <Route path="/TOrderScheduling" getComponent={TOrderScheduling} />
        <Route path="/TManufactureTaskDispatch" getComponent={TManufactureTaskDispatch} />
        <Route path="/TWorkShopType" getComponent={TWorkShopType} />
        <Route path="/TWorkShopList" getComponent={TWorkShopList} />
        <Route path="/TWorkCenterType" getComponent={TWorkCenterType} />
        <Route path="/TWorkCenter" getComponent={TWorkCenter} />
        <Route path="/TDeviceType" getComponent={TDeviceType} />
        <Route path="/TDeviceModel" getComponent={TDeviceModel} />
        <Route path="/TDeviceList" getComponent={TDeviceList} />
        <Route path="/TMouldModel" getComponent={TMouldModel} />
        <Route path="/TMouldList" getComponent={TMouldList} />
        <Route path="/TMaterialType" getComponent={TMaterialType} />
        <Route path="/TMaterialModel" getComponent={TMaterialModel} />
        <Route path="/TProductModel" getComponent={TProductModel} />
        <Route path="/TBomList" getComponent={TBomList} />
        <Route path="/TUserList" getComponent={TUserList} />
        <Route path="/TUserAuthList" getComponent={TUserAuthList} />
        <Route path="/TWarningConfig" getComponent={TWarningConfig} />
        <Route path="/TWarningHistory" getComponent={TWarningHistory} /> */}
        <Route path="/TWorkCenterDetail" getComponent={TWorkCenterDetail} />
        <Route path="/TBomDetail" getComponent={TBomDetail} />
        <Route path="/TUserDetails" getComponent={TUserDetails} />
        <Route path="/TUserAuthDetail" getComponent={TUserAuthDetail} />
      </Route>
      <Route path="/login" getComponent={Login} />
      <Route path="/register" getComponent={Register} />
    </Router>
)

ReactDOM.render(
    routes,
    document.getElementById( 'root' ),
)
