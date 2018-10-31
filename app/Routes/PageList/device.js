//
export const TDeviceType={
    path:'/TBas_Type_Dev',
    component:( location, cb ) => {
        require.ensure( [], ( require ) => {
            cb( null, require( '../../pages/TBasicData/TDeviceType' )
                .default )
        }, 'TDeviceType' )
    }
}
// 设备列表
export const TDeviceModel={
    path:'/TDeviceModel',
    component:( location, cb ) => {
        require.ensure( [], ( require ) => {
            cb( null, require( '../../pages/TDevice/TDeviceModel' )
                .default )
        }, 'TDeviceModel' )
    }
}
// 设备列表
export const TDeviceList={
    path:'/TDeviceList',
    component:( location, cb ) => {
        require.ensure( [], ( require ) => {
            cb( null, require( '../../pages/TDevice/TDeviceList' )
                .default )
        }, 'TDeviceType' )
    }
}
