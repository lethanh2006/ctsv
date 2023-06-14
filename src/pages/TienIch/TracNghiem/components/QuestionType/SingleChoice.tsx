import rules from '@/utils/rules';
import { MinusCircleOutlined } from '@ant-design/icons';
import { Checkbox, Col, Form, Input, Row } from 'antd';
import { useModel } from 'umi';
import styles from '../block.css';
import * as _ from 'lodash';

const SingleChoice = (props: {
  index: number;
  question?: number;
  block?: number;
  type?: string;
  remove: (index: number | number[]) => void;
  fieldName: number;
}) => {
  const { formCauHinhBieuMau } = useModel('bieumau');

  const onCheckCorrectChange = (val: boolean) => {
    if (val === true) {
      const listName = [
        'danhSachKhoi',
        props.block as number,
        'danhSachCauHoi',
        props.question as number,
        'luaChon',
      ];
      const fieldValues = formCauHinhBieuMau.getFieldsValue();
      const listOptions: BieuMau.LuaChon[] = formCauHinhBieuMau.getFieldValue(listName);
      const newListOptions = listOptions.map((value, index) => {
        if (value) {
          value.dung = index === props.index;
        }
        return value;
      });
      _.set(fieldValues, listName, newListOptions);
      formCauHinhBieuMau.setFieldsValue(fieldValues);
    }
  };

  return (
    <Form.Item style={{ marginBottom: 0 }}>
      <Row>
        <Col sm={22}>
          <Form.Item
            style={{ marginBottom: 5 }}
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

          <Form.Item name={[props.index, 'dung']} style={{ marginTop: 0 }} valuePropName="checked">
            <Checkbox onChange={(e) => onCheckCorrectChange(e.target.checked)}>Đúng</Checkbox>
          </Form.Item>
        </Col>
        <Col sm={2}>
          <MinusCircleOutlined
            className={styles.deleteAnswer}
            onClick={() => props.remove(props.fieldName)}
          />
        </Col>
      </Row>
    </Form.Item>
  );
};

export default SingleChoice;
