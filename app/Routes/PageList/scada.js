/*
****************
*车间监控模块*/
export const TWorkshop1={
    path:'/scada1',
    component:( location, cb ) => {
        require.ensure( [], ( require ) => {
            cb( null, require( '../../pages/TScada/TScadaWorkShop_Auto' )
                .default )
        }, 'TWorkshop1' )
    }
}
export const TWorkshop2={
    path:'/scada2',
    component:( location, cb ) => {
        require.ensure( [], ( require ) => {
            cb( null, require( '../../pages/TScada/TScadaWorkShop_Auto2' )
                .default )
        }, 'TWorkshop2' )
    }
}
export const TWorkshop3={
    path:'/scada3',
    component:( location, cb ) => {
        require.ensure( [], ( require ) => {
            cb( null, require( '../../pages/TScada/TScadaInjectionWorkshop' )
                .default )
        }, 'TWorkshop3' )
    }
}
export const TWorkshop4={
    path:'/scada4',
    component:( location, cb ) => {
        require.ensure( [], ( require ) => {
            cb( null, require( '../../pages/TScada/TScadaPunchingworkshop' )
                .default )
        }, 'TWorkshop4' )
    }
}
