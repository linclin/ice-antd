import { ProFormColumnsType } from '@ant-design/pro-form';
import { PlusOutlined } from '@ant-design/icons';
import { BetaSchemaForm, ActionType } from '@ant-design/pro-components';
import { Button, message } from 'antd';
import type { SysSystem } from '@/interfaces/sys';
import type { Resp } from '@/interfaces/resp';
import { CreateSystem } from '@/services/sys/sys_system';

interface CreateFormProps {
  reload?: ActionType['reload'];
  columns?: ProFormColumnsType<SysSystem>[];
}

const CreateForm: React.FC <CreateFormProps> = (props) => {
  const { reload, columns } = props;
  const [messageApi, contextHolder] = message.useMessage();
  const handleCreate = (record: SysSystem) => {
    CreateSystem(record).then((res: Resp) => {
       if (res.success === false) {
         messageApi.error(`${record.AppId}新增失败:${res.msg}`);
      } else {
         messageApi.success(`${record.AppId}新增成功`);
         reload?.();
      }
  }).catch((error) => {
    messageApi.error(`${record.AppId}新增请求错误:${error}`);
  });
};
  return (
    <>
      {contextHolder}
      <BetaSchemaForm<SysSystem>
        trigger={<Button type="primary" icon={<PlusOutlined />}>新增系统</Button>}
        layoutType="ModalForm"
        onFinish={async (values) => {
          await handleCreate(values);
          return true;
        }}
        columns={columns !== undefined ? columns : []}
      />
    </>
  );
};

export default CreateForm;
