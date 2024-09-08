import React, { useEffect, useRef, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import type { InputRef } from 'antd';
import { Input, Tag, message } from 'antd';
import type { Resp } from '@/interfaces/resp';
import type { SysRole } from '@/interfaces/sys';
import { GetRoleUsersById, CreateRoleUser, DeleteRoleUserById } from '@/services/sys/sys_role';

interface ListRoleUserProps {
    sysRole: SysRole | undefined;
  }
const tagInputStyle: React.CSSProperties = {
  width: 64,
  height: 24,
  marginInlineEnd: 12,
  verticalAlign: 'top',
};

const App: React.FC <ListRoleUserProps> = (props) => {
  const { sysRole } = props;
  const [messageApi, contextHolder] = message.useMessage();
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<InputRef>(null);
  const [data, setData] = useState<string[]>([]);
  useEffect(() => {
    GetRoleUsersById(sysRole?.ID).then((res: Resp) => {
        if (res.success === false) {
          messageApi.error(`${sysRole?.Name}查询用户失败:${res.msg}`);
       } else {
        setData(res.data);
       }
      }).catch((error) => {
          messageApi.error(`${sysRole?.Name}查询用户请求错误:${error}`);
      });
  }, []);


  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, [inputVisible]);

  const handleClose = (inputValue: string) => {
    DeleteRoleUserById(sysRole?.ID, [inputValue]).then((res: Resp) => {
        if (res.success === false) {
          messageApi.error(`${sysRole?.Name}删除用户失败:${res.msg}`);
       } else {
        const newData = data.filter((tag) => tag !== inputValue);
        setData(newData);
        messageApi.success(`${sysRole?.Name}删除用户成功:${inputValue}`);
        setInputVisible(false);
        setInputValue('');
       }
      }).catch((error) => {
          messageApi.error(`${sysRole?.Name}删除用户请求错误:${error}`);
    });
  };

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    if (typeof inputValue === 'string' && inputValue !== '') {
        CreateRoleUser(sysRole?.ID, [inputValue]).then((res: Resp) => {
            if (res.success === false) {
              messageApi.error(`${sysRole?.Name}添加用户失败:${res.msg}`);
           } else {
            setData([...data, inputValue]);
            messageApi.success(`${sysRole?.Name}添加用户成功:${inputValue}`);
            setInputVisible(false);
            setInputValue('');
           }
          }).catch((error) => {
              messageApi.error(`${sysRole?.Name}添加用户请求错误:${error}`);
        });
    }
  };

  const tagPlusStyle: React.CSSProperties = {
    height: 26,
    borderStyle: 'dashed',
  };

  return (
    <>
      {contextHolder}
      {data !== null && data.length > 0 && (data.map<React.ReactNode>((tag, index) => {
        const tagElem = (
          <Tag
            key={tag}
            color="green"
            closable
            style={{ userSelect: 'none', fontSize: 16 }}
            onClose={() => handleClose(tag)}
          >
            { tag }
          </Tag>
        );
        return tagElem;
      }))}
      {inputVisible ? (
        <Input
          ref={inputRef}
          type="text"
          size="small"
          style={tagInputStyle}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputConfirm}
          onPressEnter={handleInputConfirm}
        />
      ) : (
        <Tag style={tagPlusStyle} icon={<PlusOutlined />} onClick={showInput}>
          新增用户
        </Tag>
      )}
    </>
  );
};

export default App;