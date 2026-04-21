import {
  CreateButton,
  DeleteButton,
  EditButton,
  List,
  ShowButton,
  useTable,
} from '@refinedev/antd';
import { CrudFilters, HttpError } from '@refinedev/core';
import { Progress, Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React, { useMemo } from 'react';

type FeedbackDetailListItem = {
  id?: string;
  periode?: number;
  controlSystem?: string;
  equipment?: string;
  problem?: string;
  solusi?: string;
  status?: 'OPEN' | 'CLOSE';
  progress?: number;
};

type FeedbackDetailFilter = {
  search?: string;
};

const getStatusColor = (status?: string) => {
  if (status === 'OPEN') return 'green';
  if (status === 'CLOSE') return 'red';
  return 'default';
};

export const FeedbackDetailList: React.FC = () => {
  const { tableProps } = useTable<
    FeedbackDetailListItem,
    HttpError,
    FeedbackDetailFilter
  >({
    syncWithLocation: true,
    onSearch: (params) => {
      const filters: CrudFilters = [];
      const { search } = params;

      filters.push({
        field: 'search',
        operator: 'eq',
        value: search,
      });

      return filters;
    },
  });

  const columns: ColumnsType<FeedbackDetailListItem> = useMemo(
    () => [
      {
        title: 'No.',
        dataIndex: 'index',
        render: (_: unknown, __: FeedbackDetailListItem, index: number) =>
          index + 1,
      },
      {
        dataIndex: 'periode',
        title: 'Periode',
        render: (text?: number) => text ?? '-',
      },
      {
        dataIndex: 'controlSystem',
        title: 'Control System',
        render: (text?: string) => text || '-',
      },
      {
        dataIndex: 'equipment',
        title: 'Equipment',
        render: (text?: string) => text || '-',
      },
      {
        dataIndex: 'problem',
        title: 'Problem',
        ellipsis: true,
        render: (text?: string) => text || '-',
      },
      {
        dataIndex: 'solusi',
        title: 'Solusi',
        ellipsis: true,
        render: (text?: string) => text || '-',
      },
      {
        dataIndex: 'status',
        title: 'Status',
        render: (status?: string) => (
          <Tag color={getStatusColor(status)}>{status || '-'}</Tag>
        ),
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
      {
        dataIndex: 'actions',
        title: 'Actions',
        render: (_: unknown, record) => (
          <Space>
            <ShowButton size="small" recordItemId={record.id} hideText />
            <EditButton size="small" recordItemId={record.id} hideText />
            <DeleteButton size="small" recordItemId={record.id} hideText />
          </Space>
        ),
      },
    ],
    [],
  );

  return (
    <List
      title="Feedback Detail"
      headerButtons={<CreateButton>Create</CreateButton>}
    >
      <Table
        {...tableProps}
        rowKey={(record) => record.id ?? ''}
        columns={columns}
        locale={{
          emptyText: 'No data.',
        }}
      />
    </List>
  );
};
