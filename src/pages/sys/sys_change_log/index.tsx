import { definePageConfig } from 'ice';
import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React, { useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { GetChangeLog } from '@/services/sys/sys_change_log';

interface ChangeLog {
  ID: number;
  Action: string;
  ObjectID: string;
  ObjectType: string;
  RawObject: string;
  RawMeta: string;
  RawDiff: string;
  CreatedBy: string;
  Object: string;
  Meta: string;
}

const columns: Array<ProColumns<ChangeLog>> = [
  {
    title: 'Action',
    dataIndex: 'Action',
  },
  {
    title: 'ObjectID',
    dataIndex: 'ObjectID',
  },
  {
    title: 'ObjectType',
    dataIndex: 'ObjectType',
  },

  {
    title: 'RawObject',
    dataIndex: 'RawObject',
  },
  {
    title: 'RawMeta',
    dataIndex: 'RawMeta',
  },
  {
    title: 'RawDiff',
    dataIndex: 'RawDiff',
  },
  {
    title: 'CreatedBy',
    dataIndex: 'CreatedBy',
  },
  {
    title: 'Object',
    dataIndex: 'Object',
  },
  {
    title: 'Meta',
    dataIndex: 'Meta',
  },
];

const TableList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  return (
    <PageContainer>
      <ProTable<ChangeLog>
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
          return GetChangeLog(data);
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
          pageSize: 10,
        }}
        dateFormatter="string"
        toolBarRender={() => []}
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
