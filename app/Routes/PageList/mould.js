export const MoldManagement={
    path:'/mould_model',
    component:( location, cb ) => {
        require.ensure( [], ( require ) => {
            cb( null, require( '../../pages/TMould/TMouldModel' )
                .default )
        }, 'MoldManagement' )
    }
}

export const MoldList={
    path:'/mould_list',
    component:( location, cb ) => {
        require.ensure( [], ( require ) => {
            cb( null, require( '../../pages/TMould/TMouldList' )
                .default )
        }, 'MoldList' )
    }
}
