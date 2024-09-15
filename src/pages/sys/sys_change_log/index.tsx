import { definePageConfig } from 'ice';
import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React, { useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { GetChangeLog } from '@/services/sys/sys_change_log';
import type { ChangeLog } from '@/interfaces/sys';
import type { Req } from '@/interfaces/resp';
import { RemoveEmptyKeys } from '@/utils/obj';

const columns: Array<ProColumns<ChangeLog>> = [
  {
    title: '动作',
    dataIndex: 'Action',
  },
  {
    title: '数据表',
    dataIndex: 'ObjectType',
  },
  {
    title: '主键',
    dataIndex: 'ObjectID',
  },
  {
    title: '修改内容',
    dataIndex: 'RawObject',
  },
  {
    title: '标签',
    dataIndex: 'RawMeta',
  },
  {
    title: '数据对比',
    dataIndex: 'RawDiff',
  },
  {
    title: '操作源',
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
          const currentPage = params.current !== undefined ? params.current : 1;
          const apiOffset = (currentPage - 1) * 10;
          const filteredParams = RemoveEmptyKeys(params);
          delete filteredParams.current;
          delete filteredParams.pageSize;
          const apiSort: string[] = [];
          Object.entries(sort).forEach(([key, value]) => {
            if (value === 'descend') {
              apiSort.push(`-${key}`);
            } else {
              apiSort.push(`${key}`);
            }
          });
          const data: Req = { filter: { ...filteredParams }, limit: params.pageSize, offset: apiOffset, sort: apiSort };
          return GetChangeLog(data);
        }}
        editable={{
          type: 'multiple',
        }}
        columnsState={{
          persistenceKey: 'SysReqApiLog',
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
    auth: ['group_admin'],
  };
});
