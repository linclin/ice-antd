import { definePageConfig } from 'ice';
import React, { useRef, useState } from 'react';
import { EditableProTable } from '@ant-design/pro-components';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { Modal, message, Divider } from 'antd';
import type { SysRole, SysRolePermission } from '@/interfaces/sys';
import type { Resp } from '@/interfaces/resp';
import { GetRolePermById, CreateRolePerm, DeleteRolePermById } from '@/services/sys/sys_role';
import ListRoleUser from './ListRoleUser';

interface ListRolePermProps {
  sysRole: SysRole | undefined;
}
const TableList: React.FC <ListRolePermProps> = (props) => {
  const { sysRole } = props;
  const actionRef = useRef<ActionType>();
  const [messageApi, contextHolder] = message.useMessage();
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const columns: Array<ProColumns<SysRolePermission>> = [
    {
      title: '角色',
      dataIndex: 'Role',
      formItemProps: (form, { rowIndex }) => {
        return {
          rules:
            rowIndex > 1 ? [{ required: true, message: '此项为必填项' }] : [],
        };
      },
    },
    {
      title: '操作对象',
      dataIndex: 'Obj',
      formItemProps: (form, { rowIndex }) => {
        return {
          rules:
            rowIndex > 1 ? [{ required: true, message: '此项为必填项' }] : [],
        };
      },
    },
    {
      title: '操作对象1',
      dataIndex: 'Obj1',
      formItemProps: (form, { rowIndex }) => {
        return {
          rules:
            rowIndex > 1 ? [{ required: true, message: '此项为必填项' }] : [],
        };
      },
    },
    {
      title: '操作对象2',
      dataIndex: 'Obj2',
      formItemProps: (form, { rowIndex }) => {
        return {
          rules:
            rowIndex > 1 ? [{ required: true, message: '此项为必填项' }] : [],
        };
      },
    },
    {
      title: '执行动作',
      dataIndex: 'Action',
      formItemProps: (form, { rowIndex }) => {
        return {
          rules:
            rowIndex > 1 ? [{ required: true, message: '此项为必填项' }] : [],
        };
      },
    },
    {
      title: '授权策略',
      dataIndex: 'Eft',
      valueEnum: {
        allow: {
          text: '允许',
          status: 'allow',
        },
        deny: {
          text: '拒绝',
          status: 'deny',
        },
      },
      formItemProps: (form, { rowIndex }) => {
        return {
          rules:
            rowIndex > 1 ? [{ required: true, message: '此项为必填项' }] : [],
        };
      },
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      width: 100,
      render: (text, record, _, action) => [
        <>
          <a style={{ marginLeft: 8 }} onClick={() => handleDelete(record)}>删除</a>
        </>,
      ],
    },
  ];
  const handleDelete = (record: SysRolePermission) => {
    Modal.confirm({
      title: `确认删除${record.ID}?`,
      onOk: async () => {
        DeleteRolePermById(sysRole?.ID, record).then((res: Resp) => {
          if (res.success === false) {
            messageApi.error(`${record.ID}删除失败:${res.msg}`);
         } else {
            messageApi.success(`${record.ID}删除成功`);
            actionRef.current?.reload();
         }
        }).catch((error) => {
            messageApi.error(`${record.ID}删除请求错误:${error}`);
        });
      },
    });
  };

  const handleSave = (ID: number, record: SysRolePermission) => {
    CreateRolePerm(ID, record).then((res: Resp) => {
      if (res.success === false) {
          messageApi.error(`${ID}新增失败:${res.msg}`);
      } else {
          messageApi.success(`${ID}新增成功`);
          actionRef.current?.reload();
      }
      }).catch((error) => {
          messageApi.error(`${ID}新增请求错误:${error}`);
      });
  };

  return (
    <>
      {contextHolder}
      <ListRoleUser
        key={sysRole?.ID}
        sysRole={sysRole}
      />
      <Divider />
      <EditableProTable<SysRolePermission>
        headerTitle="角色权限"
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={() => {
          if (sysRole && sysRole.ID) {
              return GetRolePermById(sysRole.ID);
          } else {
              messageApi.error('数据未定义或ID不存在');
              return Promise.resolve({ data: [], success: true });
          }
        }}
        rowKey="ID"
        recordCreatorProps={{
          creatorButtonText: '新增权限',
          record: (index) => {
            if (sysRole && sysRole.ID) {
              return { ID: index + 1, Role: sysRole.Name} as SysRolePermission;
            } else {
              return { ID: index + 1 } as SysRolePermission;
            }
          },
        }}
        editable={{
          type: 'multiple',
          editableKeys,
          onSave: async (rowKey, data, row) => {
            handleSave(sysRole?.ID, data);
          },
          onChange: setEditableRowKeys,
        }}
      />
    </>
  );
};

export default TableList;

export const pageConfig = definePageConfig(() => {
  return {
    auth: ['admin'],
  };
});
