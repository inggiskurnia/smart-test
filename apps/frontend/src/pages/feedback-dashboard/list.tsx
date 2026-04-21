import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  FileTextOutlined,
  RiseOutlined,
} from '@ant-design/icons';
import { Card, Col, Progress, Row, Spin, Statistic, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import axiosInstance from '../../lib/axios';

const { Text, Title } = Typography;

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

export const FeedbackDashboardList: React.FC = () => {
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

  return (
    <div>
      <Title level={3} style={{ marginTop: 0 }}>
        Feedback Dashboard
      </Title>

      <Spin spinning={loading}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Total Feedback"
                value={dashboard.totalFeedback}
                prefix={<FileTextOutlined />}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Issue Open"
                value={dashboard.issueOpen}
                prefix={<ExclamationCircleOutlined />}
                valueStyle={{ color: '#fa8c16' }}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Issue Close"
                value={dashboard.issueClose}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Average Progress"
                value={dashboard.averageProgress}
                suffix="%"
                prefix={<RiseOutlined />}
                valueStyle={{ color: '#1677ff' }}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col xs={24} lg={12}>
            <Card title="Feedback Completion">
              <Progress
                type="dashboard"
                percent={closedRate}
                size={220}
                format={(percent) => (
                  <span style={{ fontSize: 18 }}>{percent}% Closed</span>
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
            <Card title="Open Issue Ratio">
              <Progress
                type="dashboard"
                percent={openRate}
                size={220}
                status={dashboard.issueOpen > 0 ? 'exception' : 'success'}
                format={(percent) => (
                  <span style={{ fontSize: 18 }}>{percent}% Open</span>
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
      </Spin>
    </div>
  );
};
