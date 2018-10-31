import React, {PureComponent, Fragment} from 'react';
import {Table, Alert} from 'antd';
import styles from './index.less';

class SimpleTable extends PureComponent {
    constructor(props) {
        super(props);
        const {columns} = props;

        this.state = {};
    }

    componentWillReceiveProps(nextProps) {}

    handleTableChange = (pagination, filters, sorter) => {
        this.props.onChange(pagination, filters, sorter);
    }

    render() {
        const {selectedRowKeys, needTotalList} = this.state;
        const {
            expandedRowRender,
            rowSelection,
            data: {
                list,
                pagination
            },
            loading,
            columns,
            isHaveSelect,
            bordered,
            size = 'middle',
            scroll
        } = this.props;

        const paginationProps = {
            showSizeChanger: true,
            showQuickJumper: true,
            hideOnSinglePage:true,
            ...pagination
        };

        return (<div className={styles.standardTable}>
            <Table
                expandedRowRender={expandedRowRender}
                rowSelection={rowSelection}
                loading={loading}
                rowKey={record => record.key}
                dataSource={list}
                columns={columns}
                pagination={paginationProps}
                bordered={bordered}
                size={size}
                onChange={this.handleTableChange}
                scroll={scroll}/>
        </div>);
    }
}

export default SimpleTable;
