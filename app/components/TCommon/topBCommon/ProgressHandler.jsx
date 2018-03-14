/**
 * @file 功能文件
 * @author 白航铭<gjeunney@163.com>
 */
// 自定义的配置数据
// 处理时间格式数据
// 处理自定义链接参数数据



export default {
   DoTopgo: function () {
       NProgress.start()
   },

   DoTopinc: function () {
       NProgress.inc()
   },

   DoToparrived: function () {
       setTimeout("NProgress.done()", 1000 )
   }
};
