import { definePageConfig } from 'ice';
import { Row } from 'antd';

export default function Dashboard() {
  return (
    <Row gutter={[16, 16]}>
      主页
    </Row>
  );
}

export const pageConfig = definePageConfig(() => {
  return {
    auth: ['admin', 'user'],
  };
});
