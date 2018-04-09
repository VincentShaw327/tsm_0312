/**
 *这是排程操作页
 *添加日期:2017.12
 *添加人:shaw
 **/
/******引入ant或其他第三方依赖文件*******************/
import React, { Component } from 'react'
import { Table, Tabs, Button, Radio, Icon, Menu, Modal, Popconfirm, Dropdown,message } from 'antd'
import ReactGantt from 'gantt-for-react';
/******引入自定义的依赖文件*******************/
// import FeatureSetConfig from '../tableConfig';
// import config from '../../config';
// import { DoPost, HandleCreateform } from '../../server'

export default class app extends Component {

	constructor( props ) {
		super( props );
		this.state = {
			viewMode: 'Day',
			ganttTask: this.tasks(),
			scrollOffsets: {
				'Quarter Day': 10,
				'Half Day': 4,
				'Day': 10,
				'Week': 2,
				'Month': 1
			}
		}
	}
	tasks() {
		let names = [
	      [ "任务一", [ 0, 7 ] ],
	      [ "任务二", [ 1, 4 ] ],
	      [ "任务三", [ 3, 6 ] ],
	      [ "任务四", [ 7, 17 ] ],
	      [ "任务五", [ 8, 9 ] ],
	      [ "任务六", [ 10, 10 ] ]
	    ];

		let tasks = names.map( function ( name, i ) {
			let today = new Date();
			let start = new Date( today.getFullYear(), today.getMonth(), today.getDate() );
			let end = new Date( today.getFullYear(), today.getMonth(), today.getDate() );
			start.setDate( today.getDate() + name[ 1 ][ 0 ] );
			end.setDate( today.getDate() + name[ 1 ][ 1 ] );
			return {
				start: start,
				end: end,
				name: name[ 0 ],
				id: "Task " + i,
				progress: parseInt( Math.random() * 100, 10 )
			}
		} );
		// tasks[ 1 ].dependencies = "Task 0";
		// tasks[ 2 ].dependencies = "Task 1, Task 0";
		// tasks[ 3 ].dependencies = "Task 2";
		// tasks[ 5 ].dependencies = "Task 4";

		// tasks[ 0 ].custom_class = "bar-milestone";
		tasks[ 0 ].progress = 60;
		return tasks;
	}


	Clicked(task) {
		console.log(task);
		// message.info('点击了任务');
	}

	DateChanged(task, start, end) {
		console.log(task, start, end);
		// message.info('改变了日期!');
	}

	ProgressChanged(task, progress) {
		console.log(task, progress);
		// message.info('改变了进度!');
	}

	ViewChanged(mode) {
		console.log(mode);
		// message.info('改变了显示模式!');
	}

	customPopupHtml( task ) {
		const end_date = task._end.format( 'MMM D' );
		return `
          <div class="details-container">
            <h5>${task.name}</h5>
            <p>Expected to finish by ${end_date}</p>
            <p>${task.progress}% completed!</p>
          </div>
        `;
	}

	handleModelChange(e){
		this.setState({viewMode:e.target.value});
	}

	render() {

		let ganttTask = [ {
				id: 'Task 1',
				name: 'Redesign website',
				start: '2017-12-28',
				end: '2017-12-31',
				progress: 40,
				dependencies: 'Task 2, Task 3'
			},
			{
				id: 'Task 1',
				name: 'Redesign website',
				start: '2017-12-28',
				end: '2017-12-31',
				progress: 40,
				dependencies: 'Task 2, Task 3'
			},
			{
				id: 'Task 1',
				name: 'Redesign website',
				start: '2017-12-28',
				end: '2017-12-31',
				progress: 40,
				dependencies: 'Task 2, Task 3'
			},
			{
				id: 'Task 1',
				name: 'Redesign website',
				start: '2017-12-28',
				end: '2017-12-31',
				progress: 40,
				dependencies: 'Task 2, Task 3'
			},
			{
				id: 'Task 1',
				name: 'Redesign website',
				start: '2017-12-28',
				end: '2017-12-31',
				progress: 40,
				dependencies: 'Task 2, Task 3'
			},
			{
				id: 'Task 1',
				name: 'Redesign website',
				start: '2017-12-28',
				end: '2017-12-31',
				progress: 40,
				dependencies: 'Task 2, Task 3'
			}
		]

		return (
			<div style={{marginBottom:20}}>
				<div style={{border:'1px solid ',padding:12,borderRadius:8,backgroundColor:'#c8f1dc'}}>
					<div>显示模式:
						<Radio.Group  onChange={this.handleModelChange.bind(this)}>
				          <Radio.Button value="Quarter Day">Quarter Day</Radio.Button>
				          <Radio.Button value="Half Day">Half Day</Radio.Button>
				          <Radio.Button value="Day">Day</Radio.Button>
						  <Radio.Button value="Week">Week</Radio.Button>
						  <Radio.Button value="Month">Month</Radio.Button>
				        </Radio.Group>
					</div>
					<div style={{overflow: 'auto',border:'solid 1px #a29090',backgroundColor:'white'}}>
		                <ReactGantt
							tasks={this.state.ganttTask}
		                	viewMode={this.state.viewMode}
		                    customPopupHtml={this.customPopupHtml}
		                    scrollOffsets={this.state.scrollOffsets}
		                    onClick={this.Clicked}
		                    onDateChange={this.DateChanged}
		                    onProgressChange={this.ProgressChanged}
		                    onViewChange={this.ViewChanged}
		                     />
		            </div>
				</div>
			</div>
		)
	}
}
