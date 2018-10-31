/*
**生产报表模块
*/


export const DevStateReport={
    path:'/dev_state_report',
    component:( location, cb ) => {
        require.ensure( [], ( require ) => {
            cb( null, require( '../../pages/TReport/Dev_running_record' )
                .default )
        }, 'DevStateReport' )
    }
}

export const ProductionTracking={
    path:'/production_tracking',
    component:( location, cb ) => {
        require.ensure( [], ( require ) => {
            cb( null, require( '../../pages/TReport/TLossTimeReport' )
                .default )
        }, 'ProductionTracking' )
    }
}

export const ProductionReport={
    path:'/production_report',
    component:( location, cb ) => {
        require.ensure( [], ( require ) => {
            cb( null, require( '../../pages/TReport/TProductionReport' )
                .default )
        }, 'ProductionReport' )
    }
}

export const TOEEAnalysis={
    path:'/oee_analysis_report',
    component:( location, cb ) => {
        require.ensure( [], ( require ) => {
            cb( null, require( '../../pages/TReport/TOEEAnalysis' )
                .default )
        }, 'TOEEAnalysis' )
    }
}

export const TOEEReport={
    path:'/oee_report',
    component:( location, cb ) => {
        require.ensure( [], ( require ) => {
            cb( null, require( '../../pages/TReport/TOEEAnalysis' )
                .default )
        }, 'TOEEReport' )
    }
}

export const TYieldTrendReport={
    path:'/yield_trend_report',
    component:( location, cb ) => {
        require.ensure( [], ( require ) => {
            cb( null, require( '../../pages/TReport/pro_trend_Chart' )
                .default )
        }, 'TYieldTrendReport' )
    }
}
