import { BulbOutlined } from '@ant-design/icons';
import type { RefineThemedLayoutV2HeaderProps } from '@refinedev/antd';
import { Layout as AntdLayout, Space, Switch, theme, Typography } from 'antd';
import React, { useContext } from 'react';
import { ColorModeContext } from '../../contexts/color-mode';

const { Text, Title } = Typography;
const { useToken } = theme;

export const Header: React.FC<RefineThemedLayoutV2HeaderProps> = ({
  sticky = true,
}) => {
  const { token } = useToken();
  const { mode, setMode } = useContext(ColorModeContext);

  const headerStyles: React.CSSProperties = {
    backgroundColor: token.colorBgElevated,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0px 24px',
    height: '64px',
    width: '100%',
    boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.1)',
  };

  if (sticky) {
    headerStyles.position = 'sticky';
    headerStyles.top = 0;
    headerStyles.zIndex = 1;
  }

  return (
    <AntdLayout.Header style={headerStyles}>
      <Title level={4} style={{ margin: 0 }}></Title>

      <Space
        align="center"
        style={{
          marginLeft: 'auto',
          justifyContent: 'flex-end',
        }}
      >
        <BulbOutlined />
        <Text>{mode === 'dark' ? 'Night Mode' : 'Light Mode'}</Text>
        <Switch
          checked={mode === 'dark'}
          checkedChildren="Night"
          unCheckedChildren="Light"
          onChange={() => setMode(mode === 'light' ? 'dark' : 'light')}
        />
      </Space>
    </AntdLayout.Header>
  );
};
