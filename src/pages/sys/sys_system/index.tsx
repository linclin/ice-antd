import { definePageConfig } from 'ice';
import { Modal, message } from 'antd';
import React, { useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { GetSystems, DeleteSystemById } from '@/services/sys/sys_system';
import CreateSystem from './components/CreateSystem';
import UpdateSystem from './components/UpdateSystem';
import { ProFormColumnsType } from '@ant-design/pro-form';
import type { SysSystem } from '@/interfaces/sys';
import type { Req } from '@/interfaces/resp';
import { RemoveEmptyKeys } from '@/utils/obj';

const TableList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<SysSystem>(); 
  const [messageApi, contextHolder] = message.useMessage();
  const columns: Array<ProColumns<SysSystem>> = [
    {
      title: 'AppId',
      dataIndex: 'AppId',
      tooltip: '请求AppId',
      copyable: true,
      sorter: true,
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
    },
    {
      title: '来源IP',
      dataIndex: 'IP',
    },
    {
      title: '操作人',
      dataIndex: 'Operator',
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
            key="config"
            reload={actionRef.current?.reload}
            columns={columns as ProFormColumnsType<SysSystem, 'text'>[]}
            data={record}
          />,
          <a style={{ marginLeft: 8 }} onClick={() => handleDelete(record)}>删除</a>
        </>,
      ],
    },
  ];
  const handleDelete = (record: SysSystem) => {
    Modal.confirm({
      title: `确认删除${record.AppId}?`,
      onOk: async () => {
        try {
          await DeleteSystemById(record.ID);
          messageApi.success(`${record.AppId}删除成功`);
          actionRef.current?.reload();
        } catch (error) {
          messageApi.error(`${record.AppId}删除失败:${error}`);
        }
      },
    });
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
        dateFormatter={(value, valueType) => {
          return value.format('YYYY-MM-DD HH:mm:ss');
        }}
        options={{
          setting: {
            listsHeight: 400,
          },
        }}
        // rowSelection={{
        //   onChange: (_, selectedRows) => {
        //     setSelectedRows(selectedRows);
        //   },
        // }}
        pagination={{
          pageSize: 10,
        }}
        toolBarRender={() => [
          <CreateSystem key="create" reload={actionRef.current?.reload} columns={columns as ProFormColumnsType<SysSystem, 'text'>[]} />,
        ]}
      />
      {/* {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              {'已选择'}
              <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{'项'}
            </div>
          }
        >
          <Button
            loading={loading}
            onClick={() => {
              handleRemove(selectedRowsState);
            }}
          >
            {'批量删除'}
          </Button>
        </FooterToolbar>
      )} */}
    </PageContainer>
  );
};

export default TableList;

export const pageConfig = definePageConfig(() => {
  return {
    auth: ['admin'],
  };
});
