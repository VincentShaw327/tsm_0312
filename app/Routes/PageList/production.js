/*
**生产管理模块
*/
export const TManufactureTask={
    path:'/manufacture_task',
    component:( location, cb ) => {
        require.ensure( [], ( require ) => {
            cb( null, require( '../../pages/TManufacture/TOrderScheduling' )
                .default )
        }, 'TManufactureTask' )
    }
}
export const TaskDispatch={
    path:'/task_dispatch',
    component:( location, cb ) => {
        require.ensure( [], ( require ) => {
            cb( null, require( '../../pages/TManufacture/TManufactureTaskDispatch' )
                .default )
        }, 'TaskDispatch' )
    }
}
export const TaskMonitor={
    path:'/task_monitor',
    component:( location, cb ) => {
        require.ensure( [], ( require ) => {
            cb( null, require( '../../pages/TManufacture/TaskMonitor' )
                .default )
        }, 'TaskMonitor' )
    }
}
