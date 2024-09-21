import React from 'react';
import { ProFormColumnsType } from '@ant-design/pro-form';
import { BetaSchemaForm, ActionType } from '@ant-design/pro-components';
import { message } from 'antd';
import type { SysRole } from '@/interfaces/sys';
import type { Resp } from '@/interfaces/resp';
import { UpdateRoleById } from '@/services/sys/sys_role';

interface UpdateFormProps {
  reload?: ActionType['reload'];
  columns?: ProFormColumnsType<SysRole, 'text'>[];
  data: SysRole;
}

const UpdateForm: React.FC <UpdateFormProps> = (props) => {
  const { reload, columns, data } = props;
  const [messageApi, contextHolder] = message.useMessage();
  const handleUpdate = (record: SysRole) => {
    UpdateRoleById(data.ID, record).then((res: Resp) => {
       if (res.success === false) {
         messageApi.error(`${record.Name}修改失败:${res.msg}`);
      } else {
         messageApi.success(`${record.Name}修改成功`);
         reload?.();
      }
  }).catch((error) => {
    messageApi.error(`${record.Name}修改请求错误:${error}`);
  });
};
  return (
    <>
      {contextHolder}
      <BetaSchemaForm<SysRole>
        trigger={<a>编辑</a>}
        layoutType="ModalForm"
        initialValues={data}
        onFinish={async (values) => {
          await handleUpdate(values);
          return true;
        }}
        columns={columns !== undefined ? columns : []}
      />
    </>
  );
};

export default UpdateForm;
