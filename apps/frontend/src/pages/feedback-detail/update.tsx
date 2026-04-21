import { Edit, useForm } from '@refinedev/antd';
import { Card, Flex, Form, Input, InputNumber, Select } from 'antd';
import React, { useEffect } from 'react';

const feedbackStatusOptions = [
  { label: 'Open', value: 'OPEN' },
  { label: 'Close', value: 'CLOSE' },
];

const controlSystemOptions = [
  { label: 'Application', value: 'Application' },
  { label: 'Network', value: 'Network' },
  { label: 'System', value: 'System' },
  { label: 'Security', value: 'Security' },
];

export const FeedbackDetailUpdate: React.FC = () => {
  const { formProps, saveButtonProps, queryResult } = useForm({
    errorNotification: false,
  });

  const form = formProps.form;
  const record = queryResult?.data?.data?.data;

  useEffect(() => {
    if (!record || !form) return;

    form.setFieldsValue({
      id: record.id,
      periode: record.periode,
      controlSystem: record.controlSystem,
      equipment: record.equipment,
      problem: record.problem,
      solusi: record.solusi,
      status: record.status,
      progress: record.progress,
    });
  }, [record, form]);

  const handleFinish = (values: any) => {
    return formProps?.onFinish?.({
      ...values,
      id: values.id ?? record?.id,
    });
  };

  return (
    <div>
      <Edit saveButtonProps={saveButtonProps}>
        <Form {...formProps} layout="vertical" onFinish={handleFinish}>
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>

          <Flex vertical gap="middle">
            <Card>
              <h3>Feedback Detail</h3>

              <Form.Item
                label="Periode"
                name="periode"
                rules={[{ required: true }]}
              >
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item
                label="Control System"
                name="controlSystem"
                rules={[{ required: true }]}
              >
                <Select options={controlSystemOptions} />
              </Form.Item>

              <Form.Item
                label="Equipment"
                name="equipment"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Problem"
                name="problem"
                rules={[{ required: true }]}
              >
                <Input.TextArea rows={4} />
              </Form.Item>

              <Form.Item
                label="Solusi"
                name="solusi"
                rules={[{ required: true }]}
              >
                <Input.TextArea rows={4} />
              </Form.Item>

              <Form.Item
                label="Status"
                name="status"
                rules={[{ required: true }]}
              >
                <Select options={feedbackStatusOptions} />
              </Form.Item>

              <Form.Item
                label="Progress"
                name="progress"
                rules={[{ required: true }]}
              >
                <InputNumber
                  min={0}
                  max={100}
                  addonAfter="%"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Card>
          </Flex>
        </Form>
      </Edit>
    </div>
  );
};
