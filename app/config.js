export default (() => {
  window.gconfig = {};
  +(function (global) {
    // 本地开发打开的路径以及端口
    // global.linkUrl = 'http://localhost:3001';
    global.linkUrl = 'http://122.239.140.82:20080';
    // global.linkUrl = 'http://192.168.1.250';
    if (process.env.NODE_ENV === 'production') { // 生产环境用不同的接口地址
      // global.linkUrl = 'http://localhost:3000';
      global.linkUrl = 'http://192.168.1.250';
    }
    global.isDemo_dev=false;
    // 系统一二级菜单
    global.nav = [
      {
        name: '系统主页',
        icon: 'home',
        url: 'THome',
        key: 'THome',
      },
      /*{
        name: '组织架构',
        icon: 'org-structure',
        url: '',
        key: 'TOrg_Structure',
        children: [
          {
            name: '车间信息', key: 'TOrg_workshop',url:'TOrg_workshop'
          },
          {
            name: '工作中心', key: 'TOrg_WorkCenter',url:'TOrg_WorkCenter'
          },
        ],
      },
      {
        name: '基础数据',
        icon: 'basic-data',
        url: '',
        key: 'TBasic_Data',
        children: [
          {
            name: '车间类别', key: 'TBas_Type_Workshop',url:'TBas_Type_Workshop'
          },
          {
            name: '物料类别', key: 'TBas_Type_Mtrl',url:'TBas_Type_Mtrl'
          },
          {
            name: '设备类别', key: 'TBas_Type_Dev',url:'TBas_Type_Dev'
          },
          {
            name: '工作中心类别', key: 'TBas_Type_WorkCenter',url:'TBas_Type_WorkCenter'
          },
        ],
      },*/
      {
        name: '车间监控',
        icon: 'laptop',
        url: '',
        key: 'TScada',
        children: [
          {
            name:'自动化装配车间一', key: 'scada1',url:'scada1'
          },
          {
            name:'自动化装配车间二', key: 'scada2',url:'scada2'
          },
          {
            name:'注塑车间', key: 'scada3',url:'scada3'
          },
          {
            name:'冲压车间', key: 'scada4',url:'scada4'
          },
        ],
      },
      {
        name: '生产管理',
        icon: 'file-excel',
        url: '',
        key: 'TManufacture',
        children: [
          {
            name:'订单排程', key: 'manufacture_task',url:'manufacture_task'
          },
          {
            name:'生产工单管理', key: 'task_dispatch',url:'task_dispatch'
          },
          /*{
            name:'工单生产监控', key: 'task_monitor',url:'task_monitor'
          },*/
          // {
          //   name:'物料需求计划', key: 'materialReq',url:'materialReq'
          // },
        ],
      },
      {
        name: '车间管理',
        icon: 'shop',
        url: '',
        key: 'TWorkshop',
        children: [
          {
            name:'车间类别', key: 'workshop_type',url:'TWorkshopType',
          },
          {
            name:'车间列表', key: 'workshop_list',url:'TWorkshopList',
          },
        ],
      },
      {
        name: '设备管理',
        icon: 'tool',
        url: '',
        key: 'TDevice',
        children: [
          {
            name:'设备类别', key: 'device_type',url:'TDeviceType',
          },
          {
            name:'设备型号', key: 'TDeviceModel',url:'TDeviceModel',
          },
          {
            name:'设备列表', key: 'TDeviceList',url:'TDeviceList',
          },
          /*{
            name:'设备维保', key: 'TDev_Maintain',url:'',
            children:[
                {
                    name:'维保方案', key: 'TMt_Plan',url:'TMt_Plan',
                },
                {
                    name:'方案绑定', key: 'TPlan_Bind',url:'TPlan_Bind',
                },
                {
                    name:'维保任务', key: 'TMt_Task',url:'TMt_Task',
                },
                {
                    name:'维保分析', key: 'TMt_analysis',url:'TMt_analysis',
                },

            ]
          },*/
        ],
      },
      {
        name: '工作中心',
        icon: 'shop',
        url: '',
        key: 'TWorkcenter',
        children: [
          {
              name:'工作中心类别', key: 'workcenter_type',url:'workcenter_type',
          },
          {
              name:'工作中心', key: 'workcenter_list',url:'workcenter_list',
          },
        ],
      },
      {
        name: '模具管理',
        icon: 'hdd',
        url: '',
        key: 'TMould',
        children: [
          {
            name:'模具型号', key: 'mould_model',url:'mould_model',
          },
          {
            name:'模具列表', key: 'mould_list',url:'mould_list',
          },
        ],
      },
      {
        name: '报表中心',
        icon: 'area-chart',
        url: '',
        key: 'TReport',
        children: [
          {
            name:'车间设备状态', key: 'dev_state_report',url:'dev_state_report',
          },
          {
            name:'设备综合效率', key: 'oee_report',url:'oee_report',
          },
          {
            name:'生产报表', key: 'production_report',url:'production_report',
          },
          {
            name:'产量趋势', key: 'yield_trend_report',url:'yield_trend_report',
          },
        ],
      },
      {
        name: '系统设置',
        icon: 'setting',
        url: '',
        key: 'TSystemSetting',
        children: [
          /*{
            name:'用户列表', key: 'user_list',url:'user_list',
          },
          {
            name:'权限列表', key: 'auth_list',url:'auth_list',
          },
          {
            name:'权限组', key: 'auth_group_list',url:'auth_group_list',
          },*/
          {
            name:'终端管理', key: 'data_terminal',url:'data_terminal',
          },
        ],
      },
    ];
  }(window.gconfig));
})()

export const prefix = global.gconfig.linkUrl
export const suffix = '.json'
