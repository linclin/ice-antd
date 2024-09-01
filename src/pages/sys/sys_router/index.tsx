import { definePageConfig } from 'ice';
import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React, { useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { GetRouters } from '@/services/sys/sys_router';

interface SysRouter {
  ID: number;
  Name: string;
  SystemName: string;
  Group: string;
  HttpMethod: string;
  AbsolutePath: string;
  CreatedAt: string;
  UpdatedAt: string;
}

const columns: Array<ProColumns<SysRouter>> = [
  {
    title: '接口名称',
    dataIndex: 'Name',
    width: 120,
  },
  {
    title: '路由分组',
    dataIndex: 'Group',
  },
  {
    title: 'Http方法',
    dataIndex: 'HttpMethod',
    width: 200,
  },

  {
    title: '路径',
    dataIndex: 'AbsolutePath',
  },
  {
    title: '方法',
    dataIndex: 'HandlerName',
  },
  {
    title: '创建时间',
    dataIndex: 'CreatedAt',
    hideInForm: true,
    valueType: 'datetime',
  },
  {
    title: '更新时间',
    dataIndex: 'UpdatedAt',
    hideInForm: true,
    valueType: 'datetime',
  },
  {
    title: '操作',
    valueType: 'option',
    key: 'option',
    width: 200,
    render: (text, record, _, action) => [
      <a
        key="editable"
        onClick={() => {
          action?.startEditable?.(record.ID);
        }}
      >
        编辑
      </a>,
      <a href={record.url} target="_blank" rel="noopener noreferrer" key="view">
        查看
      </a>,
    ],
  },
];

const TableList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  return (
    <PageContainer>
      <ProTable<SysRouter>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={(params, sort, filter) => {
          const offset = (params.current - 1) * params.pageSize;
          const filteredParams = { ...params };
          delete filteredParams.current;
          delete filteredParams.pageSize;
          const data = { filter: { ...filteredParams }, limit: params.pageSize, offset: offset, select: [], sort: [] };
          console.log(data);
          return GetRouters(data);
        }}
        editable={{
          type: 'multiple',
        }}
        columnsState={{
          persistenceKey: 'pro-table-singe-demos',
          persistenceType: 'localStorage',
          onChange(value) {
            console.log('value: ', value);
          },
        }}
        rowKey="ID"
        search={{
          labelWidth: 'auto',
        }}
        options={{
          setting: {
            listsHeight: 400,
          },
        }}
        // form={{
        //   // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
        //   syncToUrl: (values, type) => {
        //     if (type === 'get') {
        //       return {
        //         ...values,
        //         created_at: [values.startTime, values.endTime],
        //       };
        //     }
        //     return values;
        //   },
        // }}
        pagination={{
          pageSize: 1,
        }}
        dateFormatter="string"
        toolBarRender={() => [
          <Button key="button" icon={<PlusOutlined />} type="primary">
            新建
          </Button>,
        ]}
      />
    </PageContainer>
  );
};

export default TableList;

export const pageConfig = definePageConfig(() => {
  return {
    auth: ['admin'],
  };
});
