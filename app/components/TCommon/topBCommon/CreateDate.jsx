import React from 'react';
import { Menu, Icon, DatePicker } from 'antd';
import { Link } from 'dva/router';
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;

function CreateDate(props){

    switch (props.dataType) {
        case 'isWeek':
            return <WeekPicker placeholder="请选择周次" />
            break;
        case 'isMonth':
            return <MonthPicker placeholder="请选择月份" />
            break;
        case 'isYear':
            return <RangePicker placeholder="请选择年份" />
            break;
        default:
            return <DatePicker showTime format="YYYY-MM-DD hh:mm:ss" />
    }
}

export default CreateDate
