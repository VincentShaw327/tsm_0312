import React from 'react'
import { Router, Route, IndexRoute } from 'react-router'
import hashHistory from '../history'
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
// import App from './base'
import App from '../base/TIndexPage';
import * as pageList from './PageList'

console.log("pageList", pageList)
// 登录*/
const Login = ( location, cb ) => {
    require.ensure( [], ( require ) => {
        cb( null, require( '../pages/login' )
            .default )
    }, 'login' )
}
// 注册
const Register = ( location, cb ) => {
    require.ensure( [], ( require ) => {
        cb( null, require( '../pages/register' )
            .default )
    }, 'register' )
}

/* 进入路由的判断 */
function isLogin( nextState, replaceState ) {
    const token = sessionStorage.getItem( 'userinfo' )
    // const token = sessionStorage.getItem( 'token' )
    if ( !token ) {
        replaceState( '/login' )
    }
}
//
const THome = ( location, cb ) => {
    require.ensure( [], ( require ) => {
        cb( null, require( '../pages/THome/THome' )
            .default )
    }, 'THome' )
}


export default () => (
    <LocaleProvider locale={zhCN}>
        <Router history={hashHistory}>
            <Route path="/" onEnter={isLogin} component={App}>
                <IndexRoute getComponent={THome} />
                <Route path="/THome" getComponent={THome} />
                {
                    Object.values(pageList).map(function renderRoute(item,index){
                        if(item.hasOwnProperty('children')){
                            return  <Route
                                            key={item.path}
                                            path={item.path}
                                            getComponent={item.component}
                                            >
                                                {
                                                    renderRoute(item.children)
                                                }
                                    </Route>
                        }
                        else {
                            return <Route
                                key={item.path}
                                path={item.path}
                                getComponent={item.component}
                            />
                        }
                    })
                }
            </Route>
            <Route path="/login" getComponent={Login} />
            <Route path="/register" getComponent={Register} />
        </Router>
    </LocaleProvider>
)
// export default routes
