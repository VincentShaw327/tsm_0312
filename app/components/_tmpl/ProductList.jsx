import React from 'react';
import PropTypes from 'prop-types';
import { Table, Popconfirm, Button } from 'antd';

const ProductList = ({ onAdd, onDelete,  products }) => {
  const columns = [{
    title: 'Name',
    dataIndex: 'name',
  }, {
    title: 'Actions',
    render: (text, record) => {
      return (
        <div>
        <Popconfirm title="添加?" onConfirm={() => onAdd(record.id)}>
        <Button>增加</Button>
      </Popconfirm>

        <Popconfirm title="Delete?" onConfirm={() => onDelete(record.id)}>
          <Button>删除</Button>
        </Popconfirm>
        </div>
      );
    },
  }];
  return (
    <Table
      dataSource={products}
      columns={columns}
    />
  );
};

ProductList.propTypes = {
  onDelete: PropTypes.func.isRequired,
  products: PropTypes.array.isRequired,
};

export default ProductList;
