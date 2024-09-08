import { definePageConfig } from 'ice';
import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React, { useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { GetApiLog } from '@/services/sys/sys_api_log';
import type { SysApiLog } from '@/interfaces/sys';
import type { Req } from '@/interfaces/resp';
import { RemoveEmptyKeys } from '@/utils/obj';

const columns: Array<ProColumns<SysApiLog>> = [
  {
    title: '请求ID',
    dataIndex: 'RequestId',
  },
  {
    title: '请求方法',
    dataIndex: 'RequestMethod',
  },
  {
    title: '请求路径',
    dataIndex: 'RequestURI',
  },

  {
    title: '请求体',
    dataIndex: 'RequestBody',
  },
  {
    title: '状态码',
    dataIndex: 'StatusCode',
  },
  {
    title: '返回体',
    dataIndex: 'RespBody',
  },
  {
    title: '客户端',
    dataIndex: 'ClientIP',
  },
  {
    title: '创建时间',
    dataIndex: 'StartTime',
    valueType: 'dateTime',
  },
  {
    title: '执行时间',
    dataIndex: 'ExecTime',
  },
];

const TableList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  return (
    <PageContainer>
      <ProTable<SysApiLog>
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
          return GetApiLog(data);
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
    auth: ['admin'],
  };
});
