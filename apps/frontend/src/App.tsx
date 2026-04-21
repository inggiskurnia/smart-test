import { useNotificationProvider } from '@refinedev/antd';
import '@refinedev/antd/dist/reset.css';
import { Refine } from '@refinedev/core';
import routerBindings, {
  DocumentTitleHandler,
  UnsavedChangesNotifier,
} from '@refinedev/react-router';
import { App as AntdApp } from 'antd';
import { useState } from 'react';
import { BrowserRouter } from 'react-router';
import { AppRoutes } from './AppRoutes';
import { ColorModeContextProvider } from './contexts/color-mode';
import { customDataProvider } from './dataProvider';
import resourceApps from './resources';

function App() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <BrowserRouter>
      <ColorModeContextProvider>
        <AntdApp>
          <Refine
            dataProvider={customDataProvider}
            notificationProvider={useNotificationProvider}
            routerProvider={routerBindings}
            options={{
              syncWithLocation: true,
              warnWhenUnsavedChanges: true,
              useNewQueryKeys: true,
              projectId: '0TNGeU-bEXGre-sSTtrd',
            }}
            resources={resourceApps}
          >
            <AppRoutes collapsed={collapsed} setCollapsed={setCollapsed} />
            <UnsavedChangesNotifier />
            <DocumentTitleHandler
              handler={() => {
                return 'Feedback App';
              }}
            />
          </Refine>
        </AntdApp>
      </ColorModeContextProvider>
    </BrowserRouter>
  );
}

export default App;
