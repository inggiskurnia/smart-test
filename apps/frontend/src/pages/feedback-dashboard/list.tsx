import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  FileTextOutlined,
  RiseOutlined,
} from '@ant-design/icons';
import {
  Card,
  Col,
  Progress,
  Row,
  Space,
  Spin,
  Statistic,
  Typography,
  theme,
} from 'antd';
import React, { useEffect, useState } from 'react';
import axiosInstance from '../../lib/axios';

const { Text, Title } = Typography;
const { useToken } = theme;

type FeedbackDashboard = {
  totalFeedback: number;
  issueOpen: number;
  issueClose: number;
  averageProgress: number;
};

const defaultDashboard: FeedbackDashboard = {
  totalFeedback: 0,
  issueOpen: 0,
  issueClose: 0,
  averageProgress: 0,
};

const clampPercent = (value: number) => Math.max(0, Math.min(100, value));

export const FeedbackDashboardList: React.FC = () => {
  const { token } = useToken();
  const [dashboard, setDashboard] =
    useState<FeedbackDashboard>(defaultDashboard);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);

      try {
        const response = await axiosInstance.get('/feedback-dashboard');
        setDashboard(response.data?.data ?? defaultDashboard);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const closedRate =
    dashboard.totalFeedback > 0
      ? Math.round((dashboard.issueClose / dashboard.totalFeedback) * 100)
      : 0;
  const openRate =
    dashboard.totalFeedback > 0
      ? Math.round((dashboard.issueOpen / dashboard.totalFeedback) * 100)
      : 0;
  const averageProgress = clampPercent(Math.round(dashboard.averageProgress));

  const cardStyle: React.CSSProperties = {
    height: '100%',
    borderRadius: 8,
    borderColor: token.colorBorderSecondary,
    boxShadow: token.boxShadowTertiary,
  };

  const metricCards: Array<{
    title: string;
    value: number;
    icon: React.ReactNode;
    color: string;
    background: string;
    suffix?: string;
  }> = [
    {
      title: 'Total Feedback',
      value: dashboard.totalFeedback,
      icon: <FileTextOutlined />,
      color: token.colorPrimary,
      background: token.colorPrimaryBg,
    },
    {
      title: 'Open Issues',
      value: dashboard.issueOpen,
      icon: <ExclamationCircleOutlined />,
      color: token.colorWarning,
      background: token.colorWarningBg,
    },
    {
      title: 'Closed Issues',
      value: dashboard.issueClose,
      icon: <CheckCircleOutlined />,
      color: token.colorSuccess,
      background: token.colorSuccessBg,
    },
    {
      title: 'Average Progress',
      value: averageProgress,
      icon: <RiseOutlined />,
      color: token.colorInfo,
      background: token.colorInfoBg,
      suffix: '%',
    },
  ];

  return (
    <div style={{ display: 'grid', gap: 20 }}>
      <div>
        <Title level={3} style={{ margin: 0 }}>
          Feedback Dashboard
        </Title>
        <Text type="secondary">
          Current feedback volume, issue status, and progress overview.
        </Text>
      </div>

      <Spin spinning={loading}>
        <div style={{ display: 'grid', gap: 20 }}>
          <Row gutter={[16, 16]}>
            {metricCards.map((item) => (
              <Col key={item.title} xs={24} sm={12} lg={6}>
                <Card style={cardStyle} bodyStyle={{ padding: 20 }}>
                  <Space align="start" style={{ width: '100%' }} size={14}>
                    <div
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: 8,
                        display: 'grid',
                        placeItems: 'center',
                        color: item.color,
                        background: item.background,
                        fontSize: 20,
                        flex: '0 0 auto',
                      }}
                    >
                      {item.icon}
                    </div>
                    <Statistic
                      title={item.title}
                      value={item.value}
                      suffix={item.suffix}
                      valueStyle={{
                        color: token.colorTextHeading,
                        fontSize: 28,
                        lineHeight: 1.15,
                      }}
                    />
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Card
                title="Feedback Completion"
                style={cardStyle}
                bodyStyle={{ padding: 24, textAlign: 'center' }}
              >
                <Progress
                  type="dashboard"
                  percent={closedRate}
                  size={220}
                  strokeColor={token.colorSuccess}
                  trailColor={token.colorFillSecondary}
                  format={(percent) => (
                    <span
                      style={{
                        color: token.colorTextHeading,
                        fontSize: 18,
                        fontWeight: 600,
                      }}
                    >
                      {percent}% Closed
                    </span>
                  )}
                />
                <div style={{ marginTop: 16 }}>
                  <Text type="secondary">
                    {dashboard.issueClose} of {dashboard.totalFeedback} feedback
                    items are closed.
                  </Text>
                </div>
              </Card>
            </Col>

            <Col xs={24} lg={12}>
              <Card
                title="Open Issue Ratio"
                style={cardStyle}
                bodyStyle={{ padding: 24, textAlign: 'center' }}
              >
                <Progress
                  type="dashboard"
                  percent={openRate}
                  size={220}
                  status={dashboard.issueOpen > 0 ? 'exception' : 'success'}
                  strokeColor={
                    dashboard.issueOpen > 0
                      ? token.colorWarning
                      : token.colorSuccess
                  }
                  trailColor={token.colorFillSecondary}
                  format={(percent) => (
                    <span
                      style={{
                        color: token.colorTextHeading,
                        fontSize: 18,
                        fontWeight: 600,
                      }}
                    >
                      {percent}% Open
                    </span>
                  )}
                />
                <div style={{ marginTop: 16 }}>
                  <Text type="secondary">
                    {dashboard.issueOpen} open issues need follow-up.
                  </Text>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </Spin>
    </div>
  );
};
