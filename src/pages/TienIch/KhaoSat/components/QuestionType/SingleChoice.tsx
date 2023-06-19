import rules from '@/utils/rules';
import { DeleteOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';

const SingleChoice = (props: {
  index: number;
  type?: string;
  remove: (index: number | number[]) => void;
  fieldName: number;
}) => {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <div className="width-select-custom">
        <Form.Item
          name={[props.index, 'noiDung']}
          rules={[...rules.required]}
          label={props.type !== 'grid' ? `Lựa chọn ${props.index + 1}` : false}
        >
          <Input
            placeholder={
              props.type !== 'grid' ? `Nội dung câu trả lời ${props.index + 1}` : 'Nhập nội dung'
            }
          />
        </Form.Item>
      </div>
      <Button
        danger
        type="link"
        title="Xóa đáp án"
        icon={<DeleteOutlined />}
        onClick={() => props.remove(props.fieldName)}
        style={{ marginBottom: 10 }}
      />
    </div>
  );
};

export default SingleChoice;
