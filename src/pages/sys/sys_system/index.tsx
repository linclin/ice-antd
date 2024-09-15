import { definePageConfig } from 'ice';
import { Modal, message } from 'antd';
import React, { useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { GetSystems, DeleteSystemById } from '@/services/sys/sys_system';
import CreateSystem from './components/CreateSystem';
import UpdateSystem from './components/UpdateSystem';
import ListSystemPerm from './components/ListSystemPerm';
import { ProFormColumnsType } from '@ant-design/pro-form';
import type { SysSystem } from '@/interfaces/sys';
import type { Req, Resp } from '@/interfaces/resp';
import { RemoveEmptyKeys } from '@/utils/obj';

const TableList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [messageApi, contextHolder] = message.useMessage();
  const [openPerm, setopenPerm] = useState(false);
  const [currentRow, setCurrentRow] = useState<SysSystem>();
  const columns: Array<ProColumns<SysSystem>> = [
    {
      title: 'AppId',
      dataIndex: 'AppId',
      tooltip: '请求AppId',
      copyable: true,
      sorter: true,
      editable: false,
    },
    {
      title: '系统',
      dataIndex: 'SystemName',
    },
    {
      title: 'AppSecret',
      dataIndex: 'AppSecret',
      tooltip: '请求AppSecret',
      search: false,
      copyable: true,
      editable: false,
    },
    {
      title: '来源IP',
      dataIndex: 'IP',
    },
    {
      title: '操作人',
      dataIndex: 'Operator',
      hideInForm: true,
    },
    {
      title: '创建时间',
      dataIndex: 'CreatedAt',
      hideInForm: true,
      valueType: 'dateTime',
    },
    {
      title: '更新时间',
      dataIndex: 'UpdatedAt',
      hideInForm: true,
      valueType: 'dateTime',
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      width: 100,
      render: (text, record, _, action) => [
        <>
          <UpdateSystem
            key={record.ID}
            reload={actionRef.current?.reload}
            columns={columns as ProFormColumnsType<SysSystem, 'text'>[]}
            data={record}
          />
          <a style={{ marginLeft: 8 }} onClick={() => handleDelete(record)}>删除</a>
          <a style={{ marginLeft: 8 }} onClick={() => { setopenPerm(true); setCurrentRow(record); }}>授权</a>
        </>,
      ],
    },
  ];
  const handleDelete = (record: SysSystem) => {
    Modal.confirm({
      title: `确认删除${record.AppId}?`,
      onOk: async () => {
        DeleteSystemById(record.ID).then((res: Resp) => {
          if (res.success === false) {
            messageApi.error(`${record.AppId}删除失败:${res.msg}`);
         } else {
            messageApi.success(`${record.AppId}删除成功`);
            actionRef.current?.reload();
         }
        }).catch((error) => {
            messageApi.error(`${record.AppId}删除请求错误:${error}`);
        });
      },
    });
  };
  const handleOk = () => {
    setopenPerm(false);
  };

  const handleCancel = () => {
    setopenPerm(false);
  };
  return (
    <PageContainer>
      {contextHolder}
      <ProTable<SysSystem>
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
          return GetSystems(data);
        }}
        columnsState={{
          persistenceKey: 'SysSystem',
          persistenceType: 'localStorage',
          onChange(value) {
            console.log('value: ', value);
          },
        }}
        rowKey="ID"
        search={{
          labelWidth: 'auto',
        }}
        dateFormatter={(value, valueType) => {
          return value.format('YYYY-MM-DD HH:mm:ss');
        }}
        options={{
          setting: {
            listsHeight: 400,
          },
        }}
        pagination={{
          pageSize: 10,
        }}
        toolBarRender={() => [
          <CreateSystem key="create" reload={actionRef.current?.reload} columns={columns as ProFormColumnsType<SysSystem, 'text'>[]} />,
        ]}
      />
      <Modal title="系统权限" width="680" open={openPerm} onOk={handleOk} onCancel={handleCancel} footer={null}>
        <ListSystemPerm key={currentRow?.ID} sysSystem={currentRow} />
      </Modal>
    </PageContainer>
  );
};

export default TableList;

export const pageConfig = definePageConfig(() => {
  return {
    auth: ['group_admin'],
  };
});
