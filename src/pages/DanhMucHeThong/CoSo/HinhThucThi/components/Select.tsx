import { PlusOutlined } from '@ant-design/icons';
import { Button, Modal, Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import FormNganh from './Form';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectHinhThucThi = (props: {
  value?: string;
  onChange?: (id: string) => void;
  hasCreate?: boolean;
  multiple?: boolean;
  allowClear?: boolean;
  placeholder?: string;
}) => {
  const { value, onChange, hasCreate, multiple, allowClear, placeholder } = props;
  const { danhSach, getAllModel, setVisibleForm, visibleForm, setEdit, setRecord } =
    useModel('danhmuc.hinhthucthi');

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
          allowClear={allowClear}
          value={value}
          onChange={onChange}
          options={danhSach.map((item) => ({
            key: item._id,
            value: item._id,
            label: item?.ten,
          }))}
          showSearch
          optionFilterProp="label"
          placeholder={placeholder ?? 'Chọn hình thức thi'}
        />
      </div>

      {hasCreate !== false ? <Button icon={<PlusOutlined />} onClick={onAddNew} /> : null}

      <Modal
        visible={visibleForm}
        bodyStyle={{ padding: 0 }}
        footer={null}
        onCancel={() => setVisibleForm(false)}
      >
        <FormNganh title="Hình thức thi" />
      </Modal>
    </div>
  );
};

export default SelectHinhThucThi;
