import { definePageConfig } from 'ice';
import React, { useRef, useState } from 'react';
import { EditableProTable } from '@ant-design/pro-components';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { Modal, message } from 'antd';
import type { SysSystem, SystemPermission } from '@/interfaces/sys';
import type { Resp } from '@/interfaces/resp';
import { GetSystemPermById, CreateSystemPerm, DeleteSystemPermById } from '@/services/sys/sys_system';

interface ListSystemPermProps {
   sysSystem: SysSystem | undefined;
}
const TableList: React.FC <ListSystemPermProps> = (props) => {
  const { sysSystem } = props;
  const actionRef = useRef<ActionType>();
  const [messageApi, contextHolder] = message.useMessage();
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const columns: Array<ProColumns<SystemPermission>> = [
    {
      title: 'AppId',
      dataIndex: 'AppId',
      formItemProps: (form, { rowIndex }) => {
        return {
          rules:
            rowIndex > 1 ? [{ required: true, message: '此项为必填项' }] : [],
        };
      },
    },
    {
      title: 'HTTP接口',
      dataIndex: 'AbsolutePath',
      formItemProps: (form, { rowIndex }) => {
        return {
          rules:
            rowIndex > 1 ? [{ required: true, message: '此项为必填项' }] : [],
        };
      },
    },
    {
      title: 'HTTP接口1',
      dataIndex: 'AbsolutePath1',
      formItemProps: (form, { rowIndex }) => {
        return {
          rules:
            rowIndex > 1 ? [{ required: true, message: '此项为必填项' }] : [],
        };
      },
    },
    {
      title: 'HTTP接口2',
      dataIndex: 'AbsolutePath2',
      formItemProps: (form, { rowIndex }) => {
        return {
          rules:
            rowIndex > 1 ? [{ required: true, message: '此项为必填项' }] : [],
        };
      },
    },
    {
      title: 'HTTP方法',
      dataIndex: 'HttpMethod',
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
  const handleDelete = (record: SystemPermission) => {
    Modal.confirm({
      title: `确认删除${record.ID}?`,
      onOk: async () => {
        DeleteSystemPermById(sysSystem?.ID, record).then((res: Resp) => {
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

  const handleSave = (ID: number, record: SystemPermission) => {
    CreateSystemPerm(ID, record).then((res: Resp) => {
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
      <EditableProTable<SystemPermission>
        headerTitle="系统权限"
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={() => {
          if (sysSystem && sysSystem.ID) {
              return GetSystemPermById(sysSystem.ID);
          } else {
              messageApi.error('数据未定义或ID不存在');
              return Promise.resolve({ data: [], success: true });
          }
        }}
        rowKey="ID"
        recordCreatorProps={{
          creatorButtonText: '新增权限',
          record: (index) => {
            if (sysSystem && sysSystem.ID) {
              return { ID: index + 1, AppId: sysSystem.AppId } as SystemPermission;
            } else {
              return { ID: index + 1 } as SystemPermission;
            }
          },
        }}
        editable={{
          type: 'multiple',
          editableKeys,
          onSave: async (rowKey, data, row) => {
            handleSave(sysSystem?.ID, data);
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
    auth: ['group_admin'],
  };
});
