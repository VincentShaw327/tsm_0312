/*
**物料管理
*/
export const MaterialModel={
    path:'/material_model',
    component:( location, cb ) => {
        require.ensure( [], ( require ) => {
            cb( null, require( '../../pages/TWms/TMaterialModel' )
                .default )
        }, 'MaterialModel' )
    }
}

export const ProductModel={
    path:'/product_model',
    component:( location, cb ) => {
        require.ensure( [], ( require ) => {
            cb( null, require( '../../pages/TProduct/TProductModel' )
                .default )
        }, 'ProductModel' )
    }
}

export const BomManagement={
    path:'/bom_list',
    component:( location, cb ) => {
        require.ensure( [], ( require ) => {
            cb( null, require( '../../pages/TBom/TBomList' )
                .default )
        }, 'BomManagement' )
    }
}
