import { List, useTable } from '@refinedev/antd';
import { HttpError } from '@refinedev/core';
import { Progress, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React, { useMemo } from 'react';

type FeedbackSummaryListItem = {
  periode?: string;
  controlSystem?: string;
  totalFeedback?: number;
  issueOpen?: number;
  issueClosed?: number;
  progress?: number;
};

export const FeedbackSummaryList: React.FC = () => {
  const { tableProps } = useTable<FeedbackSummaryListItem, HttpError>({
    syncWithLocation: true,
  });

  const columns: ColumnsType<FeedbackSummaryListItem> = useMemo(
    () => [
      {
        title: 'No.',
        dataIndex: 'index',
        render: (_: unknown, __: FeedbackSummaryListItem, index: number) =>
          index + 1,
      },
      {
        dataIndex: 'periode',
        title: 'Periode',
        render: (value?: string) => value || '-',
      },
      {
        dataIndex: 'controlSystem',
        title: 'Control System',
        render: (value?: string) => value || '-',
      },
      {
        dataIndex: 'totalFeedback',
        title: 'Total Feedback',
        render: (value?: number) => value ?? 0,
      },
      {
        dataIndex: 'issueOpen',
        title: 'Issue Open',
        render: (value?: number) => value ?? 0,
      },
      {
        dataIndex: 'issueClosed',
        title: 'Issue Closed',
        render: (value?: number) => value ?? 0,
      },
      {
        dataIndex: 'progress',
        title: 'Progress',
        render: (value?: number) => (
          <Progress
            percent={Number(value ?? 0)}
            size="small"
            style={{ minWidth: 120 }}
          />
        ),
      },
    ],
    [],
  );

  return (
    <List title="Feedback Summary">
      <Table
        {...tableProps}
        rowKey={(record) => `${record.periode ?? ''}-${record.controlSystem ?? ''}`}
        columns={columns}
        locale={{
          emptyText: 'No data.',
        }}
      />
    </List>
  );
};
