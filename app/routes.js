import React from 'react'
import { Router, Route, IndexRoute } from 'react-router'
import hashHistory from './history'
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
// import App from './base'
import App from './base/TIndexPage';
import * as pageList from './pagelist'

console.log("pageList", pageList)
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

//
const THome = ( location, cb ) => {
    require.ensure( [], ( require ) => {
        cb( null, require( './pages/THome/THome' )
            .default )
    }, 'THome' )
}
//
const TWorkShopList = ( location, cb ) => {
    require.ensure( [], ( require ) => {
        cb( null, require( './pages/TFactory/TWorkShopList' )
            .default )
    }, 'TWorkShopList' )
}
//
const TWorkCenter = ( location, cb ) => {
    require.ensure( [], ( require ) => {
        cb( null, require( './pages/TFactory/TWorkCenter' )
            .default )
    }, 'TWorkCenter' )
}
//
const TFactoryType = ( location, cb ) => {
    require.ensure( [], ( require ) => {
        cb( null, require( './pages/TBasicData/TFactoryType' )
            .default )
    }, 'TFactoryType' )
}
//
const TWorkShopType = ( location, cb ) => {
    require.ensure( [], ( require ) => {
        cb( null, require( './pages/TBasicData/TWorkShopType' )
            .default )
    }, 'TWorkShopType' )
}
//
const TMaterialType = ( location, cb ) => {
    require.ensure( [], ( require ) => {
        cb( null, require( './pages/TBasicData/TMaterialType' )
            .default )
    }, 'TMaterialType' )
}

//
const TDeviceType = ( location, cb ) => {
    require.ensure( [], ( require ) => {
        cb( null, require( './pages/TBasicData/TDeviceType' )
            .default )
    }, 'TDeviceType' )
}
//
const TWorkCenterType = ( location, cb ) => {
    require.ensure( [], ( require ) => {
        cb( null, require( './pages/TBasicData/TWorkCenterType' )
            .default )
    }, 'TWorkCenterType' )
}
//
const TAlarmType = ( location, cb ) => {
    require.ensure( [], ( require ) => {
        cb( null, require( './pages/TBasicData/TAlarmType' )
            .default )
    }, 'TAlarmType' )
}
//
const TDefectiveType = ( location, cb ) => {
    require.ensure( [], ( require ) => {
        cb( null, require( './pages/TBasicData/TDefectiveType' )
            .default )
    }, 'TDefectiveType' )
}


// 工作中心
const TWorkCenterDetail = ( location, cb ) => {
    require.ensure( [], ( require ) => {
        cb( null, require( './pages/TFactory/TWorkCenterDetail' )
            .default )
    }, 'TWorkCenterDetail' )
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

export default () => (
    <LocaleProvider locale={zhCN}>
        <Router history={hashHistory}>
            <Route path="/" onEnter={isLogin} component={App}>
                <IndexRoute getComponent={THome} />
                {/* <Route path="/THome" getComponent={THome} />
                <Route path="/TOrg_workshop" getComponent={TWorkShopList} />
                <Route path="/TOrg_WorkCenter" getComponent={TWorkCenter} />
                <Route path="/TBas_Type_Factory" getComponent={TFactoryType} />
                <Route path="/TBas_Type_Workshop" getComponent={TWorkShopType} />
                <Route path="/TBas_Type_Mtrl" getComponent={TMaterialType} />
                <Route path="/TBas_Type_Dev" getComponent={TDeviceType} />
                <Route path="/TBas_Type_WorkCenter" getComponent={TWorkCenterType} />
                <Route path="/TBas_Type_Alarm" getComponent={TAlarmType} />
                <Route path="/TBas_Type_Rejects" getComponent={TDefectiveType} />

                <Route path="/TWorkCenterDetail" getComponent={TWorkCenterDetail} />
                <Route path="/TBomDetail" getComponent={TBomDetail} />
                <Route path="/TUserDetails" getComponent={TUserDetails} />
                <Route path="/TUserAuthDetail" getComponent={TUserAuthDetail} /> */}
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
