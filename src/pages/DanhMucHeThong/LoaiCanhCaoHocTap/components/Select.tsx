import { PlusOutlined } from '@ant-design/icons';
import { Button, Modal, Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import Form from './Form';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectLoaiCanhCao = (props: {
  value?: string;
  onChange?: any;
  hasCreate?: boolean;
  multiple?: boolean;
}) => {
  const { value, onChange, hasCreate, multiple } = props;
  const { danhSach, getAllModel, setVisibleForm, visibleForm, setEdit, setRecord } = useModel(
    'danhmuc.loaicanhcaohoctap',
  );

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
          options={danhSach.map((item) => ({
            key: item._id,
            value: item._id,
            label: `${item.ten}`,
          }))}
          showSearch
          optionFilterProp="label"
          placeholder="Chọn loại cảnh cáo"
        />
      </div>

      {hasCreate !== false ? <Button icon={<PlusOutlined />} onClick={onAddNew} /> : null}

      <Modal
        visible={visibleForm}
        bodyStyle={{ padding: 0 }}
        footer={null}
        onCancel={() => setVisibleForm(false)}
      >
        <Form title="loại cảnh cáo" />
      </Modal>
    </div>
  );
};

export default SelectLoaiCanhCao;
