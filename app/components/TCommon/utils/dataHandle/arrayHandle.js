/**
 * @file 功能文件
 * @author 白航铭<gjeunney@163.com>
 */
// 自定义的配置数据
// 处理时间格式数据
// 处理自定义链接参数数据
import _ from 'lodash';

export default {
    _topfClone: function (objects) {
        var shallow = _.clone(objects);
        return shallow
    },
    _topfSortBy: function (list, key) {
       list = _.sortBy(list, key)
       return list
    },

    _topfPluck: function (list, key) {
       list = _.pluck(list, key)
       return list
    },
    _topfOrderBy: function(list, array, order){
       list = _.orderBy(list, array, order)
       return list
    }
}
