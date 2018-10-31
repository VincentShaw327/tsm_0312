
export const ProcessList={
    path:'/process',
    component:( location, cb ) => {
        require.ensure( [], ( require ) => {
            cb( null, require( '../../pages/TProcess/TProcessList' )
                .default )
        }, 'AuthList' )
    },
    /*children:{
        path:'/process_detail',
        component:( location, cb ) => {
            require.ensure( [], ( require ) => {
                cb( null, require( '../../pages/TProcess/TProcessDetail' )
                    .default )
            }, 'TProcessDetail' )
        }
    }*/
}

export const CraftsList={
    path:'/crafts',
    component:( location, cb ) => {
        require.ensure( [], ( require ) => {
            cb( null, require( '../../pages/TProcess/TCraftsList' )
                .default )
        }, 'AuthList' )
    }
}

export const WorkCenterType={
    path:'/workcenter_type',
    component:( location, cb ) => {
        require.ensure( [], ( require ) => {
            cb( null, require( '../../pages/TProcess/TWorkCenterType' )
                .default )
        }, 'AuthList' )
    }
}

export const WorkCenterList={
    path:'/workcenter_list',
    component:( location, cb ) => {
        require.ensure( [], ( require ) => {
            cb( null, require( '../../pages/TProcess/TWorkCenter' )
                .default )
        }, 'AuthList' )
    }
}
