import rules from '@/utils/rules';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, Select, Checkbox, Row, Col } from 'antd';
import { useState } from 'react';
import SingleChoice from './QuestionType/SingleChoice';
import GridChoice from './QuestionType/GridChoice';
import NumericRange from './QuestionType/NumericChoice';
import { useModel } from 'umi';
import { ELoaiCauHoi } from '@/services/TienIch/constant';

const BlockQuestion = (props: { index: number; block: number }) => {
  const { record } = useModel('tienich.bieumau');
  const [questionType, setQuestionType] = useState<string>(
    record?.danhSachKhoi?.[props.block]?.danhSachCauHoi?.[props.index]?.loai ?? 'SingleChoice',
  );
  return (
    <>
      <Row gutter={[12, 0]}>
        <Col md={12} lg={16}>
          <Form.Item
            name={[props.index, 'noiDungCauHoi']}
            label="Nội dung câu hỏi"
            rules={[...rules.required]}
          >
            <Input placeholder="Nội dung câu hỏi" />
          </Form.Item>
        </Col>
        <Col md={12} lg={8}>
          <Form.Item
            name={[props.index, 'loai']}
            label="Loại"
            rules={[...rules.required]}
            initialValue={questionType}
          >
            <Select
              onChange={(val: string) => setQuestionType(val)}
              placeholder="Chọn loại câu hỏi"
              options={Object.entries(ELoaiCauHoi).map(([value, label]) => ({
                key: value,
                value,
                label,
              }))}
            />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item valuePropName="checked" name={[props.index, 'batBuoc']}>
        <Checkbox>Bắt buộc</Checkbox>
      </Form.Item>

      {['SingleChoice', 'MultipleChoice'].includes(questionType) && (
        <Form.List
          name={[props.index, 'luaChon']}
          rules={[
            {
              validator: async (_, names) => {
                if (!names || names.length < 1) {
                  return Promise.reject(new Error('Ít nhất 1 đáp án'));
                }
                return '';
              },
            },
          ]}
        >
          {(fields, { add, remove }, { errors }) => (
            <>
              {fields.map((field, index) => (
                <SingleChoice
                  index={index}
                  remove={remove}
                  fieldName={field.name}
                  key={field.key}
                />
              ))}
              <Form.ErrorList errors={errors} />
              <Button onClick={() => add()} icon={<PlusOutlined />} size="small" type="primary">
                Thêm đáp án
              </Button>
            </>
          )}
        </Form.List>
      )}

      {/* {questionType === 'SingleChoice' && (
        <Form.Item valuePropName="checked" name={[props.index, 'cauTraLoiKhac']}>
          <Checkbox>Câu trả lời khác</Checkbox>
        </Form.Item>
      )} */}

      {['GridSingleChoice', 'GridMultipleChoice'].includes(questionType) && (
        <GridChoice name={props.index} />
      )}
      {questionType === 'NumericRange' && <NumericRange index={props.index} />}
    </>
  );
};

export default BlockQuestion;
