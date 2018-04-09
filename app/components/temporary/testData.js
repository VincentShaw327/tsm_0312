

rules: [
    {required: true,message: '请输入计划产量'},//
    {pattern:/^[0-9]+.?[0-9]*$/,message: '产量必须是数字'},//
    {pattern: /^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/,message: '请输入正确的手机号'},//
    {pattern:/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,message: '请输入正确的邮箱地址'},
    {type: 'array',message: '***必须为数组'},
]

//mqtt推送测试数据
{
    "dataList": [
        {
            "machine_id": "HDMI-STATION-001",
            "data": {
                "machine_id": "HDMI-STATION-001",
                "run_status": 0,
                "prod_count": 234,
                "prod_rate": 35,
                "rej_count": 1,
                "rej_rate": 1,
                "alarm": 0
            },
            "task": {
                "task_no": "T201470812554",
                "task_name": "AV音视频端子",
                "task_progress": 90,
                "task_finish": "15682/20000",
                "task_finishtime": "2017-09-03 10:15:33"
            }
        },
        {
            "machine_id": "HDMI-STATION-002",
            "data": {
                "machine_id": "HDMI-STATION-002",
                "run_status": 1,
                "prod_count": 21,
                "prod_rate": 25,
                "rej_count": 1,
                "rej_rate": 1,
                "alarm": 0
            },
            "task": {
                "task_no": "T201470812554",
                "task_name": "AV音视频端子",
                "task_progress": 90,
                "task_finish": "15682/20000",
                "task_finishtime": "2017-09-03 10:15:33"
            }
        },
        {
            "machine_id": "HDMI-STATION-003",
            "data": {
                "machine_id": "HDMI-STATION-002",
                "run_status": 1,
                "prod_count": 21,
                "prod_rate": 25,
                "rej_count": 1,
                "rej_rate": 1,
                "alarm": 0
            },
            "task": {
                "task_no": "T201470812554",
                "task_name": "AV音视频端子",
                "task_progress": 90,
                "task_finish": "15682/20000",
                "task_finishtime": "2017-09-03 10:15:33"
            }
        },
        {
            "machine_id": "HDMI-STATION-004",
            "data": {
                "machine_id": "HDMI-STATION-002",
                "run_status": 1,
                "prod_count": 21,
                "prod_rate": 25,
                "rej_count": 1,
                "rej_rate": 1,
                "alarm": 0
            },
            "task": {
                "task_no": "T201470812554",
                "task_name": "AV音视频端子",
                "task_progress": 90,
                "task_finish": "15682/20000",
                "task_finishtime": "2017-09-03 10:15:33"
            }
        },
        {
            "machine_id": "HDMI-STATION-005",
            "data": {
                "machine_id": "HDMI-STATION-002",
                "run_status": 1,
                "prod_count": 21,
                "prod_rate": 25,
                "rej_count": 1,
                "rej_rate": 1,
                "alarm": 0
            },
            "task": {
                "task_no": "T201470812554",
                "task_name": "AV音视频端子",
                "task_progress": 90,
                "task_finish": "15682/20000",
                "task_finishtime": "2017-09-03 10:15:33"
            }
        },
        {
            "machine_id": "HDMI-STATION-006",
            "data": {
                "machine_id": "HDMI-STATION-002",
                "run_status": 1,
                "prod_count": 21,
                "prod_rate": 25,
                "rej_count": 1,
                "rej_rate": 1,
                "alarm": 0
            },
            "task": {
                "task_no": "T201470812554",
                "task_name": "AV音视频端子",
                "task_progress": 90,
                "task_finish": "15682/20000",
                "task_finishtime": "2017-09-03 10:15:33"
            }
        },
        {
            "machine_id": "HDMI-STATION-007",
            "data": {
                "machine_id": "HDMI-STATION-002",
                "run_status": 1,
                "prod_count": 21,
                "prod_rate": 25,
                "rej_count": 1,
                "rej_rate": 1,
                "alarm": 0
            },
            "task": {
                "task_no": "T201470812554",
                "task_name": "AV音视频端子",
                "task_progress": 90,
                "task_finish": "15682/20000",
                "task_finishtime": "2017-09-03 10:15:33"
            }
        },
        {
            "machine_id": "HDMI-STATION-008",
            "data": {
                "machine_id": "HDMI-STATION-002",
                "run_status": 1,
                "prod_count": 21,
                "prod_rate": 25,
                "rej_count": 1,
                "rej_rate": 1,
                "alarm": 0
            },
            "task": {
                "task_no": "T201470812554",
                "task_name": "AV音视频端子",
                "task_progress": 90,
                "task_finish": "15682/20000",
                "task_finishtime": "2017-09-03 10:15:33"
            }
        },
        {
            "machine_id": "HDMI-STATION-009",
            "data": {
                "machine_id": "HDMI-STATION-002",
                "run_status": 1,
                "prod_count": 21,
                "prod_rate": 25,
                "rej_count": 1,
                "rej_rate": 1,
                "alarm": 0
            },
            "task": {
                "task_no": "T201470812554",
                "task_name": "AV音视频端子",
                "task_progress": 90,
                "task_finish": "15682/20000",
                "task_finishtime": "2017-09-03 10:15:33"
            }
        },
        {
            "machine_id": "HDMI-STATION-010",
            "data": {
                "machine_id": "HDMI-STATION-002",
                "run_status": 1,
                "prod_count": 21,
                "prod_rate": 25,
                "rej_count": 1,
                "rej_rate": 1,
                "alarm": 0
            },
            "task": {
                "task_no": "T201470812554",
                "task_name": "AV音视频端子",
                "task_progress": 90,
                "task_finish": "15682/20000",
                "task_finishtime": "2017-09-03 10:15:33"
            }
        },
    ]
}


//mqtt推送测试数据2
{"dataList":[{"machine_id":"HDMI-STATION-001","data":{"machine_id":"HDMI-STATION-001","run_status":1,"prod_count":234,"prod_rate":35,"rej_count":1,"rej_rate":1,"alarm":0},"task":{"task_no":"T201470812554","task_name":"AV音视频端子","task_progress":90,"task_finish":"15682/20000","task_finishtime":"2017-09-03 10:15:33"}},{"machine_id":"HDMI-STATION-002","data":{"machine_id":"HDMI-STATION-002","run_status":1,"prod_count":21,"prod_rate":25,"rej_count":1,"rej_rate":1,"alarm":0},"task":{"task_no":"T201470812554","task_name":"AV音视频端子","task_progress":90,"task_finish":"15682/20000","task_finishtime":"2017-09-03 10:15:33"}},{"machine_id":"HDMI-STATION-003","data":{"machine_id":"HDMI-STATION-003","run_status":1,"prod_count":21,"prod_rate":25,"rej_count":1,"rej_rate":1,"alarm":0},"task":{"task_no":"T201470812554","task_name":"AV音视频端子","task_progress":90,"task_finish":"15682/20000","task_finishtime":"2017-09-03 10:15:33"}},{"machine_id":"HDMI-STATION-004","data":{"machine_id":"HDMI-STATION-002","run_status":1,"prod_count":21,"prod_rate":25,"rej_count":1,"rej_rate":1,"alarm":0},"task":{"task_no":"T201470812554","task_name":"AV音视频端子","task_progress":90,"task_finish":"15682/20000","task_finishtime":"2017-09-03 10:15:33"}},{"machine_id":"HDMI-STATION-005","data":{"machine_id":"HDMI-STATION-002","run_status":1,"prod_count":21,"prod_rate":25,"rej_count":1,"rej_rate":1,"alarm":0},"task":{"task_no":"T201470812554","task_name":"AV音视频端子","task_progress":90,"task_finish":"15682/20000","task_finishtime":"2017-09-03 10:15:33"}},{"machine_id":"HDMI-STATION-006","data":{"machine_id":"HDMI-STATION-002","run_status":1,"prod_count":21,"prod_rate":25,"rej_count":1,"rej_rate":1,"alarm":0},"task":{"task_no":"T201470812554","task_name":"AV音视频端子","task_progress":90,"task_finish":"15682/20000","task_finishtime":"2017-09-03 10:15:33"}},{"machine_id":"HDMI-STATION-007","data":{"machine_id":"HDMI-STATION-002","run_status":1,"prod_count":21,"prod_rate":25,"rej_count":1,"rej_rate":1,"alarm":0},"task":{"task_no":"T201470812554","task_name":"AV音视频端子","task_progress":90,"task_finish":"15682/20000","task_finishtime":"2017-09-03 10:15:33"}},{"machine_id":"HDMI-STATION-008","data":{"machine_id":"HDMI-STATION-002","run_status":1,"prod_count":21,"prod_rate":25,"rej_count":1,"rej_rate":1,"alarm":0},"task":{"task_no":"T201470812554","task_name":"AV音视频端子","task_progress":90,"task_finish":"15682/20000","task_finishtime":"2017-09-03 10:15:33"}},{"machine_id":"HDMI-STATION-009","data":{"machine_id":"HDMI-STATION-002","run_status":1,"prod_count":21,"prod_rate":25,"rej_count":1,"rej_rate":1,"alarm":0},"task":{"task_no":"T201470812554","task_name":"AV音视频端子","task_progress":90,"task_finish":"15682/20000","task_finishtime":"2017-09-03 10:15:33"}},{"machine_id":"HDMI-STATION-010","data":{"machine_id":"HDMI-STATION-002","run_status":1,"prod_count":21,"prod_rate":25,"rej_count":1,"rej_rate":1,"alarm":0},"task":{"task_no":"T201470812554","task_name":"AV音视频端子","task_progress":90,"task_finish":"15682/20000","task_finishtime":"2017-09-03 10:15:33"}}]}
