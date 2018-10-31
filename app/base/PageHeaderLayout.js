import React from 'react';
// import { Link } from 'dva/router';
import { hashHistory, Link } from 'react-router';
import PageHeader from 'components/ant-design-pro/PageHeader';
import styles from './PageHeaderLayout.less';
// "style-loader!css-loader!less-loader?modules"
// import styles from 'style-loader!less-loader!css-loader?modules./PageHeaderLayout.less';

export default ({ children, wrapperClassName, top, ...restProps,BreadcrumbList }) => (
  // <div style={{ margin: '-24px -24px 0' }} className={wrapperClassName}>
  <div  className={wrapperClassName}>
    {top}
    <PageHeader key="pageheader" {...restProps} breadcrumbList={BreadcrumbList} linkElement={Link} />
    {children ? <div className="content">{children}</div> : null}
  </div>
);
