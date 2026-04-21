import { Show } from '@refinedev/antd';
import { useShow } from '@refinedev/core';
import { Descriptions, Progress, Tag } from 'antd';
import React from 'react';

const getStatusColor = (status?: string) => {
  if (status === 'OPEN') return 'green';
  if (status === 'CLOSE') return 'red';
  return 'default';
};

export const FeedbackDetailShow: React.FC = () => {
  const { query } = useShow();
  const { data, isLoading } = query;
  const feedbackDetail = data?.data?.data;

  return (
    <Show isLoading={isLoading} title="Feedback Detail" canEdit>
      <Descriptions
        bordered
        column={1}
        size="middle"
        title="Feedback Detail"
      >
        <Descriptions.Item label="Periode">
          {feedbackDetail?.periode ?? '-'}
        </Descriptions.Item>
        <Descriptions.Item label="Control System">
          {feedbackDetail?.controlSystem ?? '-'}
        </Descriptions.Item>
        <Descriptions.Item label="Equipment">
          {feedbackDetail?.equipment ?? '-'}
        </Descriptions.Item>
        <Descriptions.Item label="Problem">
          {feedbackDetail?.problem ?? '-'}
        </Descriptions.Item>
        <Descriptions.Item label="Solusi">
          {feedbackDetail?.solusi ?? '-'}
        </Descriptions.Item>
        <Descriptions.Item label="Status">
          <Tag color={getStatusColor(feedbackDetail?.status)}>
            {feedbackDetail?.status ?? '-'}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Progress">
          <Progress
            percent={Number(feedbackDetail?.progress ?? 0)}
            style={{ maxWidth: 360 }}
          />
        </Descriptions.Item>
      </Descriptions>
    </Show>
  );
};
