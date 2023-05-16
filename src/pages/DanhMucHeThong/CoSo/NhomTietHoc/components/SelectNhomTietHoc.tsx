import { PlusOutlined } from '@ant-design/icons';
import { Button, Modal, Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import Form from './Form';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectNhomTietHoc = (props: {
  value?: string;
  onChange?: any;
  hasCreate?: boolean;
  multiple?: boolean;
  disabled?: boolean;
}) => {
  const { value, onChange, hasCreate, multiple, disabled } = props;
  const { danhSach, getAllModel, setVisibleForm, visibleForm, setEdit, setRecord } =
    useModel('danhmuc.nhomtiethoc');

  useEffect(() => {
    if (!visibleForm) getAllModel();
  }, [visibleForm]);

  const onAddNew = () => {
    setRecord(undefined);
    setEdit(false);
    setVisibleForm(true);
  };

  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <div className={hasCreate !== false ? 'width-select-custom' : 'fullWidth'}>
        <Select
          mode={multiple ? 'multiple' : undefined}
          value={value}
          onChange={onChange}
          disabled={disabled}
          options={danhSach.map((item) => ({
            key: item._id,
            value: item._id,
            label: `${item.ten} (${item.ma})`,
          }))}
          showSearch
          optionFilterProp="label"
          placeholder="Chọn nhóm tiết học"
        />
      </div>

      {hasCreate !== false ? <Button icon={<PlusOutlined />} onClick={onAddNew} /> : null}

      <Modal
        visible={visibleForm}
        bodyStyle={{ padding: 0 }}
        footer={null}
        onCancel={() => setVisibleForm(false)}
      >
        <Form />
      </Modal>
    </div>
  );
};

export default SelectNhomTietHoc;
