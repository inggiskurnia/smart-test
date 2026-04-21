import {
  BarChartOutlined,
  DashboardOutlined,
  FileExclamationOutlined,
} from '@ant-design/icons';
import { ResourceProps } from '@refinedev/core';

export const feedbackResources: ResourceProps[] = [
  {
    name: 'feedback-dashboard',
    list: '/feedback-dashboard',
    icon: <DashboardOutlined />,
    meta: {
      label: 'Feedback Dashboard',
    },
  },
  {
    name: 'feedback-detail',
    list: '/feedback-detail',
    create: '/feedback-detail/create',
    edit: '/feedback-detail/edit/:id',
    show: '/feedback-detail/show/:id',
    icon: <FileExclamationOutlined />,
    meta: {
      canDelete: true,
      label: 'Feedback Detail',
    },
  },
  {
    name: 'feedback-summary',
    list: '/feedback-summary',
    icon: <BarChartOutlined />,
    meta: {
      label: 'Feedback Summary',
    },
  },
];
