import { PlusOutlined } from '@ant-design/icons';
import { Button, Modal, Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import FormNhomNganh from './Form';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectNhomNganh = (props: {
  value?: string;
  onChange?: any;
  hasCreate?: boolean;
  multiple?: boolean;
}) => {
  const { value, onChange, hasCreate, multiple } = props;
  const { danhSach, getAllModel, setVisibleForm, visibleForm, setEdit, setRecord } =
    useModel('danhmuc.dmnhomnganh');

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
          value={value}
          onChange={onChange}
          mode={multiple ? 'multiple' : undefined}
          options={danhSach.map((item) => ({
            key: item._id,
            value: item._id,
            label: `${item.ten} (${item.ma})`,
          }))}
          showSearch
          optionFilterProp="label"
          placeholder="Chọn nhóm ngành đào tạo"
        />
      </div>

      {hasCreate !== false ? <Button icon={<PlusOutlined />} onClick={onAddNew} /> : null}

      <Modal
        visible={visibleForm}
        bodyStyle={{ padding: 0 }}
        footer={null}
        onCancel={() => setVisibleForm(false)}
      >
        <FormNhomNganh title="Nhóm ngành đào tạo" />
      </Modal>
    </div>
  );
};

export default SelectNhomNganh;
