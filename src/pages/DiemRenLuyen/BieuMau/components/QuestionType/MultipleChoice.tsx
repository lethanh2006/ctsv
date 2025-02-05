import rules from '@/utils/rules';
import { DeleteOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';

const MultipleChoice = (props: {
  index: number;
  remove: (index: number | number[]) => void;
  fieldName: number;
}) => {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <div className="width-select-custom">
        <Form.Item
          name={[props.index, 'noiDung']}
          rules={[...rules.required]}
          label={`Lựa chọn ${props.index + 1}`}
        >
          <Input placeholder={`Nội dung câu trả lời ${props.index + 1}`} />
        </Form.Item>
      </div>
      <Button
        danger
        type="link"
        title="Xóa đáp án"
        icon={<DeleteOutlined />}
        onClick={() => props.remove(props.fieldName)}
      />
    </div>
  );
};

export default MultipleChoice;
