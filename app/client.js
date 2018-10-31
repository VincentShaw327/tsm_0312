import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { Router, Route } from 'react-router';
import { Provider } from 'react-redux'
import hashHistory from './history';
import App1 from './base/TIndexPage';
// import Routes from './routes'
import Routes from './Routes/routes'
import './index.less';
import configure from './store/configureStore'

const store = configure({ config: global.gconfig })

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


/* 进入路由的判断 */
function isLogin( nextState, replaceState ) {
    const token = sessionStorage.getItem( 'token' )
    if ( !token ) {
        replaceState( '/login' )
    }
}



// BOM详情
const TBomDetail = ( location, cb ) => {
    require.ensure( [], ( require ) => {
        cb( null, require( './pages/TBom/TBomDetail' )
            .default )
    }, 'TBomDetail' )
}

// 用户详情
const TUserDetails = ( location, cb ) => {
    require.ensure( [], ( require ) => {
        cb( null, require( './pages/TUser/TUserDetails' )
            .default )
    }, 'TUserDetails' )
}
// 权限详情
const TUserAuthDetail = ( location, cb ) => {
    require.ensure( [], ( require ) => {
        cb( null, require( './pages/TUser/TUserAuthDetail' )
            .default )
    }, 'TUserAuthDetail' )
}
// onEnter={isLogin}


// console.log('Routes',Routes())
ReactDOM.render(
    <Provider store={store}>
        <Routes />
    </Provider>,
    // routes,
    document.getElementById( 'root' ),
)
