// 自动组装车间一监控*/
const monitor1 = ( location, cb ) => {
    require.ensure( [], ( require ) => {
        cb( null, require( './pages/TScada/TScadaWorkShop_Auto' )
            .default )
    }, 'monitor1' )
}
// 自动组装车间二监控
const monitor2 = ( location, cb ) => {
    require.ensure( [], ( require ) => {
        cb( null, require( './pages/TScada/TScadaWorkShop_Auto2' )
            .default )
    }, 'monitor2' )
}
//订单管理
const TManufactureOrder = ( location, cb ) => {
    require.ensure( [], ( require ) => {
        cb( null, require( './pages/TManufacture/TManufactureOrder' )
            .default )
    }, 'TManufactureOrder' )
}
// const TManufactureOrder = require( './pages/TManufacture/TManufactureOrder' );
//订单排程
const TOrderScheduling = ( location, cb ) => {
    require.ensure( [], ( require ) => {
        cb( null, require( './pages/TManufacture/TOrderScheduling' )
            .default )
    }, 'TOrderScheduling' )
}
// const TOrderScheduling = require( './pages/TManufacture/TOrderScheduling' );

// 生产派工
const TManufactureTaskDispatch = ( location, cb ) => {
    require.ensure( [], ( require ) => {
        cb( null, require( './pages/TManufacture/TManufactureTaskDispatch' )
            .default )
    }, 'TProductiveLabor' )
}
//车间类别
const TWorkShopType = ( location, cb ) => {
    require.ensure( [], ( require ) => {
        cb( null, require( './pages/TFactory/TWorkShopType' )
            .default )
    }, 'TWorkShopType' )
}
//车间列表
const TWorkShopList = ( location, cb ) => {
    require.ensure( [], ( require ) => {
        cb( null, require( './pages/TFactory/TWorkShopList' )
            .default )
    }, 'TWorkShopList' )
}
// 工作中心类别
const TWorkCenterType = ( location, cb ) => {
    require.ensure( [], ( require ) => {
        cb( null, require( './pages/TFactory/TWorkCenterType' )
            .default )
    }, 'TWorkCenterType' )
}
// 工作中心
const TWorkCenter = ( location, cb ) => {
    require.ensure( [], ( require ) => {
        cb( null, require( './pages/TFactory/TWorkCenter' )
            .default )
    }, 'TWorkCenter' )
}
// 设备类别
const TDeviceType = ( location, cb ) => {
    require.ensure( [], ( require ) => {
        cb( null, require( './pages/TDevice/TDeviceType' )
            .default )
    }, 'TDeviceType' )
}
// 设备型号
const TDeviceModel = ( location, cb ) => {
    require.ensure( [], ( require ) => {
        cb( null, require( './pages/TDevice/TDeviceModel' )
            .default )
    }, 'TDeviceModel' )
}
// 设备列表
const TDeviceList = ( location, cb ) => {
    require.ensure( [], ( require ) => {
        cb( null, require( './pages/TDevice/TDeviceList' )
            .default )
    }, 'TDeviceList' )
}
// 模具型号
const TMouldModel = ( location, cb ) => {
    require.ensure( [], ( require ) => {
        cb( null, require( './pages/TMould/TMouldModel' )
            .default )
    }, 'TMouldModel' )
}
// 模具列表
const TMouldList = ( location, cb ) => {
    require.ensure( [], ( require ) => {
        cb( null, require( './pages/TMould/TMouldList' )
            .default )
    }, 'TMouldList' )
}
// 物料类别
const TMaterialType = ( location, cb ) => {
    require.ensure( [], ( require ) => {
        cb( null, require( './pages/TWms/TMaterialType' )
            .default )
    }, 'TMaterialType' )
}
// 物料型号
const TMaterialModel = ( location, cb ) => {
    require.ensure( [], ( require ) => {
        cb( null, require( './pages/TWms/TMaterialModel' )
            .default )
    }, 'TMaterialModel' )
}
//产品型号
const TProductModel = ( location, cb ) => {
    require.ensure( [], ( require ) => {
        cb( null, require( './pages/TProduct/TProductModel' )
            .default )
    }, 'TProductModel' )
}
//BOM管理
const TBomList = ( location, cb ) => {
    require.ensure( [], ( require ) => {
        cb( null, require( './pages/TBom/TBomList' )
            .default )
    }, 'TBomList' )
}
//用户管理
const TUserList = ( location, cb ) => {
    require.ensure( [], ( require ) => {
        cb( null, require( './pages/TUser/TUserList' )
            .default )
    }, 'TUserList' )
}
//权限组
const TUserAuthList = ( location, cb ) => {
    require.ensure( [], ( require ) => {
        cb( null, require( './pages/TUser/TUserAuthList' )
            .default )
    }, 'TUserAuthList' )
}
//报警配置
const TWarningConfig = ( location, cb ) => {
    require.ensure( [], ( require ) => {
        cb( null, require( './pages/TWarning/TWarningConfig' )
            .default )
    }, 'TWarningConfig' )
}
//报警历史
const TWarningHistory = ( location, cb ) => {
    require.ensure( [], ( require ) => {
        cb( null, require( './pages/TWarning/TWarningHistory' )
            .default )
    }, 'TWarningHistory' )
}
export default{
    TManufactureOrder,
    TOrderScheduling
}
