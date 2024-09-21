import React from 'react';
import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-layout';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <DefaultFooter
      copyright={`${currentYear} 运营管理后台`}
      links={[
        {
          key: 'ice-antd',
          title: <GithubOutlined />,
          href: 'https://github.com/linclin/ice-antd',
          blankTarget: true,
        },
        {
          key: 'ice-antd-github',
          title: 'ice-antd前端框架',
          href: 'https://github.com/linclin/ice-antd',
          blankTarget: true,
        },
        {
          key: 'go-gin-rest-api',
          title: <GithubOutlined />,
          href: 'https://github.com/linclin/go-gin-rest-api',
          blankTarget: true,
        },
        {
          key: 'go-gin-rest-api-github',
          title: 'go-gin-rest-api后台框架',
          href: 'https://github.com/linclin/go-gin-rest-api',
          blankTarget: true,
        },
      ]}
    />
  );
};

export default Footer;
