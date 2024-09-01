import { TableOutlined, WarningOutlined, FormOutlined, DashboardOutlined } from '@ant-design/icons';
import type { MenuDataItem } from '@ant-design/pro-layout';

const asideMenuConfig: MenuDataItem[] = [
  {
    name: '工作台',
    path: '/',
    icon: <DashboardOutlined />,
  },
  {
    name: '系统管理',
    icon: <WarningOutlined />,
    children: [
      {
        name: '调用系统',
        path: '/sys/sys_system',
        icon: <TableOutlined />,
      },
      {
        name: '用户权限',
        path: '/sys/sys_role',
        icon: <TableOutlined />,
      },
      {
        name: '接口访问日志',
        path: '/sys/sys_api_log',
        icon: <TableOutlined />,
      },
      {
        name: '外部接口日志',
        path: '/sys/sys_req_api_log',
        icon: <TableOutlined />,
      },
      {
        name: '数据变更日志',
        path: '/sys/sys_change_log',
        icon: <TableOutlined />,
      },
      {
        name: '定时任务日志',
        path: '/sys/sys_cronjob_log',
        icon: <TableOutlined />,
      },
      {
        name: '系统接口路由',
        path: '/sys/sys_router',
        icon: <TableOutlined />,
      },
    ],
  },
];

export { asideMenuConfig };
