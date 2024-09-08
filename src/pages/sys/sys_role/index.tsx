import { definePageConfig } from 'ice';
import { Modal, message } from 'antd';
import React, { useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { ProFormColumnsType } from '@ant-design/pro-form';
import { GetRoles, DeleteRoleById } from '@/services/sys/sys_role';
import type { SysRole } from '@/interfaces/sys';
import type { Req, Resp } from '@/interfaces/resp';
import { RemoveEmptyKeys } from '@/utils/obj';
import CreateRole from './components/CreateRole';
import UpdateRole from './components/UpdateRole';
import ListRolePerm from './components/ListRolePerm';

const TableList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [messageApi, contextHolder] = message.useMessage();
  const [openPerm, setopenPerm] = useState(false);
  const [currentRow, setCurrentRow] = useState<SysRole>();
  const columns: Array<ProColumns<SysRole>> = [
    {
      title: '角色',
      dataIndex: 'Name',
      formItemProps: (form, { rowIndex }) => {
        return {
          rules:
            rowIndex > 1 ? [{ required: true, message: '此项为必填项' }] : [],
        };
      },
    },
    {
      title: '关键词',
      dataIndex: 'Keyword',
      formItemProps: (form, { rowIndex }) => {
        return {
          rules:
            rowIndex > 1 ? [{ required: true, message: '此项为必填项' }] : [],
        };
      },
    },
    {
      title: '说明',
      dataIndex: 'Desc',
      search: false,
    },
    {
      title: '状态',
      dataIndex: 'Status',
      valueEnum: {
        1: {
          text: '正常',
        },
        2: {
          text: '禁止',
        },
      },
      hideInForm: true,
      formItemProps: (form, { rowIndex }) => {
        return {
          rules:
            rowIndex > 1 ? [{ required: true, message: '此项为必填项' }] : [],
        };
      },
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
      width: 200,
      render: (text, record, _, action) => [
        <>
          <UpdateRole
            key={record.ID}
            reload={actionRef.current?.reload}
            columns={columns as ProFormColumnsType<SysRole, 'text'>[]}
            data={record}
          />
          <a style={{ marginLeft: 8 }} onClick={() => handleDelete(record)}>删除</a>
          <a style={{ marginLeft: 8 }} onClick={() => { setopenPerm(true); setCurrentRow(record); }}>授权</a>
        </>,
      ],
    },
  ];
  const handleDelete = (record: SysRole) => {
    Modal.confirm({
      title: `确认删除${record.ID}?`,
      onOk: async () => {
        DeleteRoleById(record.ID).then((res: Resp) => {
          if (res.success === false) {
            messageApi.error(`${record.Name}删除失败:${res.msg}`);
         } else {
            messageApi.success(`${record.Name}删除成功`);
            actionRef.current?.reload();
         }
        }).catch((error) => {
            messageApi.error(`${record.Name}删除请求错误:${error}`);
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
      <ProTable<SysRole>
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
          return GetRoles(data);
        }}
        editable={{
          type: 'multiple',
        }}
        columnsState={{
          persistenceKey: 'SysRole',
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
        pagination={{
          pageSize: 10,
        }}
        dateFormatter="string"
        toolBarRender={() => [
          <CreateRole key="create" reload={actionRef.current?.reload} columns={columns as ProFormColumnsType<SysRole, 'text'>[]} />,
        ]}
      />
      <Modal title="角色用户和权限" width="680" open={openPerm} onOk={handleOk} onCancel={handleCancel} footer={null}>
        <ListRolePerm key={currentRow?.ID} sysRole={currentRow} />
      </Modal>
    </PageContainer>
  );
};

export default TableList;

export const pageConfig = definePageConfig(() => {
  return {
    auth: ['admin'],
  };
});
