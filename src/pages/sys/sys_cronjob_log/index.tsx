import { definePageConfig } from 'ice';
import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React, { useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { GetCronjobLog } from '@/services/sys/sys_cronjob_log';

interface SysCronjobLog {
  ID: number;
  CronMethod: string;
  CronParam: string;
  StartTime: string;
  EndTime: string;
  ExecTime: string;
  Status: string;
  ErrMsg: string;
}

const columns: Array<ProColumns<SysCronjobLog>> = [
  {
    title: '任务名称',
    dataIndex: 'CronMethod',
    width: 120,
  },
  {
    title: '任务参数',
    dataIndex: 'CronParam',
  },
  {
    title: '开始时间',
    dataIndex: 'StartTime',
    width: 200,
  },

  {
    title: '结束时间',
    dataIndex: 'EndTime',
  },
  {
    title: '执行时间(秒)',
    dataIndex: 'ExecTime',
  },
  {
    title: '执行状态',
    dataIndex: 'Status',
    hideInForm: true,
  },
  {
    title: '错误信息',
    dataIndex: 'ErrMsg',
    hideInForm: true,
  },
];

const TableList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  return (
    <PageContainer>
      <ProTable<SysCronjobLog>
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
          return GetCronjobLog(data);
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
