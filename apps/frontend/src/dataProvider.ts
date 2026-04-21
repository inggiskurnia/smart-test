import { DataProvider } from '@refinedev/core';
import axiosInstance from './lib/axios';

export const customDataProvider: DataProvider = {
  getList: async ({ resource, pagination, sorters, filters }) => {
    const { current = 1, pageSize = 10 } = pagination ?? {};
    const query: Record<string, any> = {};

    if (pagination?.mode !== 'off') {
      query.page = current;
      query.size = pageSize;
    }

    // Filters
    if (filters?.length) {
      filters.forEach((filter) => {
        if ('field' in filter && 'operator' in filter) {
          const { field, operator, value } = filter;

          if (value === null || value === undefined || value === '') return;

          if (operator === 'contains') {
            query[`${field}_like`] = value;
          } else {
            query[field] = value;
          }
        }
      });
    }

    if (sorters?.length) {
      const sorter = sorters[0];
      query.sort = sorter.field;
      query.order = sorter.order?.toUpperCase();
    }

    const response = await axiosInstance.get(resource, {
      params: query,
    });

    const meta = response.data?.meta;

    const total = meta?.totalItems ?? 0;

    return {
      data: response.data?.data ?? [],
      total,
    };
  },

  getOne: async ({ resource, id, meta }) => {
    const url = meta?.customUrl ?? `${resource}/${id}`;
    const res = await axiosInstance.get(url);

    return { data: res.data };
  },

  create: async ({ resource, variables, meta }) => {
    const response = await axiosInstance.post(`${resource}`, variables);
    return {
      data: response.data,
    };
  },
  update: async ({ resource, id, variables, meta }) => {
    if (meta?.endpoint) {
      const response = await axiosInstance.put(meta.endpoint, variables);
      return {
        data: response.data,
      };
    }

    const response = await axiosInstance.put(`${resource}/${id}`, variables);
    return {
      data: response.data,
    };
  },
  deleteOne: async ({ resource, id, meta }) => {
    const response = await axiosInstance.delete(`${resource}/${id}`);
    return {
      data: response.data,
    };
  },
  getMany: async ({ resource, ids, meta }) => {
    const response = await axiosInstance.get(`${resource}`, {
      params: {
        ids,
      },
      paramsSerializer: (params) => {
        const query = new URLSearchParams();
        params.ids.forEach((id: string | number) => {
          query.append('ids[]', id.toString());
        });
        return query.toString();
      },
    });

    return {
      data: response.data,
    };
  },

  getApiUrl: () => '',
};
