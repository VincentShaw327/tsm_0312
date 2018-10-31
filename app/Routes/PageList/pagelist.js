
//
export const THome={
    path:'/THome',
    component:( location, cb ) => {
        require.ensure( [], ( require ) => {
            cb( null, require( './pages/THome/THome' )
                .default )
        }, 'THome' )
    }
}

//
export const TWorkShopList={
    path:'/TOrg_workshop',
    component:( location, cb ) => {
        require.ensure( [], ( require ) => {
            cb( null, require( './pages/TFactory/TWorkShopList' )
                .default )
        }, 'TWorkShopList' )
    }
}

//
export const TWorkCenter={
    path:'/TOrg_WorkCenter',
    component:( location, cb ) => {
        require.ensure( [], ( require ) => {
            cb( null, require( './pages/TFactory/TWorkCenter' )
                .default )
        }, 'TWorkCenter' )
    },
    children:{
        path:'/TWorkCenterDetail',
        component:( location, cb ) => {
            require.ensure( [], ( require ) => {
                cb( null, require( './pages/TFactory/TWorkCenterDetail' )
                    .default )
            }, 'TWorkCenterDetail' )
        }
    }
}

//
export const TFactoryType={
    path:'/TBas_Type_Factory',
    component:( location, cb ) => {
        require.ensure( [], ( require ) => {
            cb( null, require( './pages/TBasicData/TFactoryType' )
                .default )
        }, 'TFactoryType' )
    }
}

//
export const TWorkShopType={
    path:'/TBas_Type_Workshop',
    component:( location, cb ) => {
        require.ensure( [], ( require ) => {
            cb( null, require( './pages/TBasicData/TWorkShopType' )
                .default )
        }, 'TWorkShopType' )
    }
}
//
export const TMaterialType={
    path:'/TBas_Type_Mtrl',
    component:( location, cb ) => {
        require.ensure( [], ( require ) => {
            cb( null, require( './pages/TBasicData/TMaterialType' )
                .default )
        }, 'TMaterialType' )
    }
}

//
export const TDeviceType={
    path:'/TBas_Type_Dev',
    component:( location, cb ) => {
        require.ensure( [], ( require ) => {
            cb( null, require( './pages/TBasicData/TDeviceType' )
                .default )
        }, 'TDeviceType' )
    }
}

//
export const TWorkCenterType={
    path:'/TBas_Type_WorkCenter',
    component:( location, cb ) => {
        require.ensure( [], ( require ) => {
            cb( null, require( './pages/TBasicData/TWorkCenterType' )
                .default )
        }, 'TWorkCenterType' )
    }
}

//
export const TAlarmType={
    path:'/TBas_Type_Alarm',
    component:( location, cb ) => {
        require.ensure( [], ( require ) => {
            cb( null, require( './pages/TBasicData/TAlarmType' )
                .default )
        }, 'TAlarmType' )
    }
}
//
export const TDefectiveType={
    path:'/TBas_Type_Rejects',
    component:( location, cb ) => {
        require.ensure( [], ( require ) => {
            cb( null, require( './pages/TBasicData/TDefectiveType' )
                .default )
        }, 'TDefectiveType' )
    }
}

/*
****************
*车间监控模块*/
export const TWorkshop1={
    path:'/scada1',
    component:( location, cb ) => {
        require.ensure( [], ( require ) => {
            cb( null, require( './pages/TScada/TScadaWorkShop_Auto' )
                .default )
        }, 'TWorkshop1' )
    }
}
export const TWorkshop2={
    path:'/scada2',
    component:( location, cb ) => {
        require.ensure( [], ( require ) => {
            cb( null, require( './pages/TScada/TScadaWorkShop_Auto2' )
                .default )
        }, 'TWorkshop2' )
    }
}
export const TWorkshop3={
    path:'/scada3',
    component:( location, cb ) => {
        require.ensure( [], ( require ) => {
            cb( null, require( './pages/TScada/TScadaInjectionWorkshop' )
                .default )
        }, 'TWorkshop3' )
    }
}
export const TWorkshop4={
    path:'/scada4',
    component:( location, cb ) => {
        require.ensure( [], ( require ) => {
            cb( null, require( './pages/TScada/TScadaPunchingworkshop' )
                .default )
        }, 'TWorkshop4' )
    }
}

/*
**生产管理模块
*/
export const TManufactureTask={
    path:'/manufacture_task',
    component:( location, cb ) => {
        require.ensure( [], ( require ) => {
            cb( null, require( './pages/TManufacture/TOrderScheduling' )
                .default )
        }, 'TManufactureTask' )
    }
}
export const TaskDispatch={
    path:'/task_dispatch',
    component:( location, cb ) => {
        require.ensure( [], ( require ) => {
            cb( null, require( './pages/TManufacture/TManufactureTaskDispatch' )
                .default )
        }, 'TaskDispatch' )
    }
}
export const TaskMonitor={
    path:'/task_monitor',
    component:( location, cb ) => {
        require.ensure( [], ( require ) => {
            cb( null, require( './pages/TManufacture/TaskMonitor' )
                .default )
        }, 'TaskMonitor' )
    }
}

/*
**生产报表模块
*/
export const DevStateReport={
    path:'/dev_state_report',
    component:( location, cb ) => {
        require.ensure( [], ( require ) => {
            cb( null, require( './pages/TReport/TStateTimeOverview' )
                .default )
        }, 'DevStateReport' )
    }
}

export const ProductionTracking={
    path:'/production_tracking',
    component:( location, cb ) => {
        require.ensure( [], ( require ) => {
            cb( null, require( './pages/TReport/TLossTimeReport' )
                .default )
        }, 'ProductionTracking' )
    }
}

export const ProductionReport={
    path:'/production_report',
    component:( location, cb ) => {
        require.ensure( [], ( require ) => {
            cb( null, require( './pages/TReport/TProductionReport' )
                .default )
        }, 'ProductionReport' )
    }
}

export const TOEEAnalysis={
    path:'/oee_analysis_report',
    component:( location, cb ) => {
        require.ensure( [], ( require ) => {
            cb( null, require( './pages/TReport/TOEEAnalysis' )
                .default )
        }, 'TOEEAnalysis' )
    }
}

/**
**模具管理模块
*/
export const MoldManagement={
    path:'/mould_model',
    component:( location, cb ) => {
        require.ensure( [], ( require ) => {
            cb( null, require( './pages/TMould/TMouldModel' )
                .default )
        }, 'MoldManagement' )
    }
}

export const MoldList={
    path:'/mould_list',
    component:( location, cb ) => {
        require.ensure( [], ( require ) => {
            cb( null, require( './pages/TMould/TMouldList' )
                .default )
        }, 'MoldList' )
    }
}

/*
**物料管理
*/
export const MaterialModel={
    path:'/material_model',
    component:( location, cb ) => {
        require.ensure( [], ( require ) => {
            cb( null, require( './pages/TWms/TMaterialModel' )
                .default )
        }, 'MaterialModel' )
    }
}
export const ProductModel={
    path:'/product_model',
    component:( location, cb ) => {
        require.ensure( [], ( require ) => {
            cb( null, require( './pages/TProduct/TProductModel' )
                .default )
        }, 'ProductModel' )
    }
}

export const BomManagement={
    path:'/bom_list',
    component:( location, cb ) => {
        require.ensure( [], ( require ) => {
            cb( null, require( './pages/TBom/TBomList' )
                .default )
        }, 'BomManagement' )
    }
}

/*
*系统设置
*/
export const userList={
    path:'/user_list',
    component:( location, cb ) => {
        require.ensure( [], ( require ) => {
            cb( null, require( './pages/TUser/TUserList' )
                .default )
        }, 'userList' )
    }
}

export const AuthList={
    path:'/auth_list',
    component:( location, cb ) => {
        require.ensure( [], ( require ) => {
            cb( null, require( './pages/TUser/TAuthList' )
                .default )
        }, 'AuthList' )
    }
}

export const AuthGroup={
    path:'/auth_group_list',
    component:( location, cb ) => {
        require.ensure( [], ( require ) => {
            cb( null, require( './pages/TUser/TAuthGroupList' )
                .default )
        }, 'AuthGroup' )
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
