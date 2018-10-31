const tableList = require('./datas/tableList');
const mt_planlist = require('./datas/mt_planlist');
const wc_List01 = require('./datas/workcenterList01');
const wc_List02 = require('./datas/workcenterList02');
const wc_List03 = require('./datas/workcenterList03');
const wc_List04 = require('./datas/workcenterList04');
const TFactoryType = require('./datas/factoryType');
const TWorkshopType = require('./datas/workshopType');
const TMtrlType = require('./datas/mtrlType');
const TMtrlModel = require('./datas/mtrlModel');
const TDeviceType = require('./datas/deviceType');
const TAreaType = require('./datas/areaType');
const TAlarmType = require('./datas/alarmType');
const TDefectiveType = require('./datas/defectiveType');
const TWorkCenterType = require('./datas/workcenterType');
const TWorkCenterList = require('./datas/workcenterList');
const TWorkShopList = require('./datas/workshopList');
const TOrderList = require('./datas/orderlist');
const TTaskList = require('./datas/taskList');
const TTaskMonitor = require('./datas/taskMonitor');
const TDeviceModel = require('./datas/deviceModel');
const TDeviceList = require('./datas/deviceList');
const TMoldModel = require('./datas/moldModel');
const TMoldList = require('./datas/moldlist');
const TProductModel = require('./datas/productModel');
const TBOMList = require('./datas/bomList');
const TUserList = require('./datas/userList');
const TAuthList = require('./datas/authList');
const TAuthGroupList = require('./datas/authGroupList');
const TDATerminalList = require('./datas/TDATerminalList');

const prefix = '.json'

module.exports = {
  // [`/tableList${prefix}`]: tableList,
  [`/tableList`]: tableList,
  [`/mt_planlist`]: mt_planlist,
  [`/wc_list01`]: wc_List01,
  [`/wc_list02`]: wc_List02,
  [`/wc_list03`]: wc_List03,
  [`/wc_list04`]: wc_List04,
  [`/factory_type`]: TFactoryType,
  [`/workshop_type`]: TWorkshopType,
  [`/mtrl_type`]: TMtrlType,
  [`/api/TWms/material_model`]: TMtrlModel,
  [`/area_type`]: TAreaType,
  [`/alarm_type`]: TAlarmType,
  [`/defe_type`]: TDefectiveType,
  [`/workcenter_type`]: TWorkCenterType,
  [`/api/TProcess/workcenter`]: TWorkCenterList,
  [`/workshop_list`]: TWorkShopList,
  [`/api/tmanufacture/manufacture/ListProductOrder`]: TOrderList,
  [`/api/tmanufacture/manufacture/ListWorkOrder`]: TTaskList,
  [`/api/tmanufacture/manufacture/taskMonitor`]: TTaskMonitor,
  [`/device_type`]: TDeviceType,
  ['/api/TDevice/device_model']: TDeviceModel,
  ['/api/TDevice/device']: TDeviceList,
  ['/api/TMold/mold_model']: TMoldModel,
  ['/api/TMold/mold']: TMoldList,
  ['/api/TProduct/product_model']: TProductModel,
  ['/api/TBom/bom']: TBOMList,
  ['/api/TUser/account']: TUserList,
  ['/api/TUser/auth']: TAuthList,
  ['/api/TUser/group']: TAuthGroupList,
  ['/api/TIot/dau']: TDATerminalList,
  // ['/api/TBom/bom']: TBOMList,
}
