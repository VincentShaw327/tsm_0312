//
export const TFactoryType={
    path:'/TBas_Type_Factory',
    component:( location, cb ) => {
        require.ensure( [], ( require ) => {
            cb( null, require( '../../pages/TBasicData/TFactoryType' )
                .default )
        }, 'TFactoryType' )
    }
}
//
export const TWorkShopType={
    path:'workshop_type',
    component:( location, cb ) => {
        require.ensure( [], ( require ) => {
            cb( null, require( '../../pages/TBasicData/TWorkShopType' )
                .default )
        }, 'TWorkShopType' )
    }
}
//
export const TMaterialType={
    path:'/TBas_Type_Mtrl',
    component:( location, cb ) => {
        require.ensure( [], ( require ) => {
            cb( null, require( '../../pages/TBasicData/TMaterialType' )
                .default )
        }, 'TMaterialType' )
    }
}

//
export const TDeviceType={
    path:'/device_type',
    component:( location, cb ) => {
        require.ensure( [], ( require ) => {
            cb( null, require( '../../pages/TDevice/TDeviceType' )
                .default )
        }, 'TDeviceType' )
    }
}

//
export const TWorkCenterType={
    path:'/TBas_Type_WorkCenter',
    component:( location, cb ) => {
        require.ensure( [], ( require ) => {
            cb( null, require( '../../pages/TBasicData/TWorkCenterType' )
                .default )
        }, 'TWorkCenterType' )
    }
}

//
export const TAlarmType={
    path:'/TBas_Type_Alarm',
    component:( location, cb ) => {
        require.ensure( [], ( require ) => {
            cb( null, require( '../../pages/TBasicData/TAlarmType' )
                .default )
        }, 'TAlarmType' )
    }
}
//
export const TDefectiveType={
    path:'/TBas_Type_Rejects',
    component:( location, cb ) => {
        require.ensure( [], ( require ) => {
            cb( null, require( '../../pages/TBasicData/TDefectiveType' )
                .default )
        }, 'TDefectiveType' )
    }
}
