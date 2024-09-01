import { definePageConfig } from 'ice';
import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React, { useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { GetApiLog } from '@/services/sys/sys_api_log';

interface SysApiLog {
  ID: number;
  RequestId: string;
  RequestMethod: string;
  RequestURI: string;
  RequestBody: string;
  StatusCode: string;
  RespBody: string;
  ClientIP: string;
  StartTime: string;
  ExecTime: string;
}

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
    hideInForm: true,
    valueType: 'datetime',
  },
  {
    title: '执行时间',
    dataIndex: 'ExecTime',
    hideInForm: true,
    valueType: 'datetime',
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
          const offset = (params.current - 1) * params.pageSize;
          const filteredParams = { ...params };
          delete filteredParams.current;
          delete filteredParams.pageSize;
          const data = { filter: { ...filteredParams }, limit: params.pageSize, offset: offset, select: [], sort: [] };
          console.log(data);
          return GetApiLog(data);
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
