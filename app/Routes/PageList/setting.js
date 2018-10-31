/*
*系统设置
*/
export const userList={
    path:'/user_list',
    component:( location, cb ) => {
        require.ensure( [], ( require ) => {
            cb( null, require( '../../pages/TUser/TUserList' )
                .default )
        }, 'userList' )
    }
}

export const AuthList={
    path:'/auth_list',
    component:( location, cb ) => {
        require.ensure( [], ( require ) => {
            cb( null, require( '../../pages/TUser/TAuthList' )
                .default )
        }, 'AuthList' )
    }
}

export const AuthGroup={
    path:'/auth_group_list',
    component:( location, cb ) => {
        require.ensure( [], ( require ) => {
            cb( null, require( '../../pages/TUser/TAuthGroupList' )
                .default )
        }, 'AuthGroup' )
    }
}

export const TDA_Terminal={
    path:'/data_terminal',
    component:( location, cb ) => {
        require.ensure( [], ( require ) => {
            cb( null, require( '../../pages/TSetting/TDA_Terminal' )
                .default )
        }, 'TDA_Terminal' )
    }
}
