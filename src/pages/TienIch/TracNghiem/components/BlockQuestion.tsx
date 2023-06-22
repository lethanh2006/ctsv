import rules from '@/utils/rules';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Row, Select } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';
import GridChoice from './QuestionType/GridChoice';
import NumericRange from './QuestionType/NumericChoice';
import SingleChoice from './QuestionType/SingleChoice';

const loaiCauHoi = [
  {
    value: 'SingleChoice',
    name: 'Chọn 1 đáp án',
  },
  // { value: 'MultipleChoice', name: 'Chọn nhiều đáp án' },

  // { value: 'GridSingleChoice', name: 'Dạng bảng (chọn một)' },
  // { value: 'GridMultipleChoice', name: 'Dạng bảng (chọn nhiều)' },
  // { value: 'NumericRange', name: 'Đánh giá (dạng số)' },
  // { value: 'Text', name: 'Câu trả lời Text' },
  // {
  //   value: 'UploadFile',
  //   name: 'Tải lên file',
  // },
];

const BlockQuestion = (props: { index: number; block: number }) => {
  const { record } = useModel('bieumau');
  const [questionType, setQuestionType] = useState<string>(
    record?.danhSachKhoi?.[props.block]?.danhSachCauHoi?.[props.index]?.loai ?? 'SingleChoice',
  );
  return (
    <>
      <Row gutter={[20, 0]}>
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
            initialValue={'SingleChoice'}
          >
            <Select
              onChange={(val: string) => setQuestionType(val)}
              placeholder="Chọn loại câu hỏi"
            >
              {loaiCauHoi.map((item) => (
                <Select.Option key={item.value} value={item.value}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>

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
          {(fields, { add, remove }, { errors }) => {
            return (
              <>
                {fields.map((field, index) => {
                  switch (questionType) {
                    case 'SingleChoice': {
                      return (
                        <SingleChoice
                          index={index}
                          question={props.index}
                          block={props.block}
                          remove={remove}
                          fieldName={field.name}
                        />
                      );
                    }
                    case 'MultipleChoice': {
                      // return (
                      //   <MultipleChoice index={index} remove={remove} fieldName={field.name} />
                      // );
                    }
                    default: {
                      return <div />;
                    }
                  }
                })}
                <Form.Item>
                  <Form.ErrorList errors={errors} />
                  <Button type="primary" onClick={() => add()} icon={<PlusOutlined />}>
                    Thêm đáp án
                  </Button>
                </Form.Item>
              </>
            );
          }}
        </Form.List>
      )}

      {/* {questionType === 'SingleChoice' && (
        <Form.Item valuePropName="checked" name={[props.index, 'cauTraLoiKhac']}>
          <Checkbox>Câu trả lời khác</Checkbox>
        </Form.Item>
      )} */}
      <Form.Item hidden initialValue={true} name={[props.index, 'batBuoc']} />

      {['GridSingleChoice', 'GridMultipleChoice'].includes(questionType) && (
        <GridChoice name={props.index} />
      )}
      {questionType === 'NumericRange' && <NumericRange index={props.index} />}
    </>
  );
};

export default BlockQuestion;
