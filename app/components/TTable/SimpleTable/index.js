import React, { PureComponent, Fragment } from 'react';
import { Table, Alert } from 'antd';
import styles from './index.less';


class SimpleTable extends PureComponent {
  constructor(props) {
    super(props);
    const { columns } = props;

    this.state = {
    };
  }

  componentWillReceiveProps(nextProps) {

  }

  handleTableChange = (pagination, filters, sorter) => {
    this.props.onChange(pagination, filters, sorter);
  }

  render() {
    const { selectedRowKeys, needTotalList } = this.state;
    const { data: { list, pagination }, loading, columns,isHaveSelect } = this.props;

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
    };

    return (
      <div className={styles.standardTable}>
        <Table
          loading={loading}
          rowKey={record => record.key}
          dataSource={list}
          columns={columns}
          pagination={paginationProps}
          // onChange={this.handleTableChange}
        />
      </div>
    );
  }
}

export default SimpleTable;
