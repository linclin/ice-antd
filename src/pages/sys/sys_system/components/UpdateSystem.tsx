import React from 'react';
import { ProFormColumnsType } from '@ant-design/pro-form';
import { BetaSchemaForm, ActionType } from '@ant-design/pro-components';
import { message } from 'antd';
import type { SysSystem } from '@/interfaces/sys';
import type { Resp } from '@/interfaces/resp';
import { UpdateSystemById } from '@/services/sys/sys_system';

interface UpdateFormProps {
  reload?: ActionType['reload'];
  columns?: ProFormColumnsType<SysSystem, 'text'>[];
  data: SysSystem;
}

const UpdateForm: React.FC <UpdateFormProps> = (props) => {
  const { reload, columns, data } = props;
  const [messageApi, contextHolder] = message.useMessage();
  const handleUpdate = (record: SysSystem) => {
    UpdateSystemById(data.ID, record).then((res: Resp) => {
       if (res.success === false) {
         messageApi.error(`${record.AppId}修改失败:${res.msg}`);
      } else {
         messageApi.success(`${record.AppId}修改成功`);
         reload?.();
      }
  }).catch((error) => {
    messageApi.error(`${record.AppId}修改请求错误:${error}`);
  });
};
  return (
    <>
      {contextHolder}
      <BetaSchemaForm<SysSystem>
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
