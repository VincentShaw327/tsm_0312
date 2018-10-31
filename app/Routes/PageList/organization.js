//
export const TWorkShopList={
    path:'/workshop_list',
    component:( location, cb ) => {
        require.ensure( [], ( require ) => {
            cb( null, require( '../../pages/TFactory/TWorkShopList' )
                .default )
        }, 'TWorkShopList' )
    }
}

//
export const TWorkCenter={
    path:'/TOrg_WorkCenter',
    component:( location, cb ) => {
        require.ensure( [], ( require ) => {
            cb( null, require( '../../pages/TProcess/TWorkCenter' )
                .default )
        }, 'TWorkCenter' )
    },
    children:{
        path:'/TWorkCenterDetail',
        component:( location, cb ) => {
            require.ensure( [], ( require ) => {
                cb( null, require( '../../pages/TProcess/TWorkCenterDetail' )
                    .default )
            }, 'TWorkCenterDetail' )
        }
    }
}
