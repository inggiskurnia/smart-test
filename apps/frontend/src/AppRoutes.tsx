import { ThemedLayoutV2, ThemedSiderV2 } from '@refinedev/antd';
import { Authenticated } from '@refinedev/core';
import { CatchAllNavigate } from '@refinedev/react-router';
import { Navigate, Outlet, Route, Routes } from 'react-router';
import { Header } from './components';
import { FeedbackDetailList } from './pages/feedback-detail/list';
import { FeedbackDetailCreate } from './pages/feedback-detail/create';
import { FeedbackDetailUpdate } from './pages/feedback-detail/update';
import { FeedbackDetailShow } from './pages/feedback-detail/show';
import { FeedbackSummaryList } from './pages/feedback-summary/list';
import { FeedbackDashboardList } from './pages/feedback-dashboard/list';

type AppRoutesProps = {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
};

export const AppRoutes = ({ collapsed, setCollapsed }: AppRoutesProps) => {
  return (
    <Routes>
      <Route
        element={
          <Authenticated
            key="auth-inner"
            fallback={<CatchAllNavigate to="login" />}
          >
            <ThemedLayoutV2
              Header={Header}
              Sider={() => (
                <ThemedSiderV2
                  Title={() => (
                    <div
                      style={{
                        display: 'flex',
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '8px',
                        fontWeight: 700,
                        fontSize: collapsed ? 12 : 18,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {collapsed ? 'FA' : 'Feedback App'}
                    </div>
                  )}
                  fixed
                />
              )}
              onSiderCollapsed={(value) => setCollapsed(value)}
            >
              <Outlet />
            </ThemedLayoutV2>
          </Authenticated>
        }
      >
        <Route path="/">
          <Route index element={<Navigate to="/feedback-detail" replace />} />

          <Route path="feedback-detail">
            <Route index element={<FeedbackDetailList />} />
            <Route path="create" element={<FeedbackDetailCreate />} />
            <Route path="show/:id" element={<FeedbackDetailShow />} />
            <Route path="edit/:id" element={<FeedbackDetailUpdate />} />
          </Route>

          <Route path="feedback-summary">
            <Route index element={<FeedbackSummaryList />} />
          </Route>

          <Route path="feedback-dashboard">
            <Route index element={<FeedbackDashboardList />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
};
