import { PlusOutlined } from '@ant-design/icons';
import { Button, Modal, Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import FormNganh from './Form';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectKhoiKienThuc = (props: {
  value?: string;
  onChange?: (id: string) => void;
  hasCreate?: boolean;
  multiple?: boolean;
  allowClear?: boolean;
  disabled?: boolean;
  placeholder?: string;
  hasDefault?: boolean;
}) => {
  const { value, onChange, hasCreate, multiple, allowClear, placeholder, disabled, hasDefault } =
    props;
  const { danhSach, getAllModel, setVisibleForm, visibleForm, setEdit, setRecord } =
    useModel('danhmuc.khoikienthuc');

  useEffect(() => {
    if (!visibleForm)
      getAllModel().then((data) => {
        // Nếu chưa chọn giá trị và (sau khi thêm mới hoặc data chỉ có 1 phần tử)
        // Thì chọn phần tử đầu tiên
        if (hasDefault && data.length === 1 && !!onChange) onChange(data[0]._id);
      });
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
          disabled={disabled}
          allowClear={allowClear}
          value={value}
          onChange={onChange}
          options={danhSach.map((item) => ({
            key: item._id,
            value: item._id,
            label: `${item?.ten}`,
          }))}
          showSearch
          optionFilterProp="label"
          placeholder={placeholder ?? 'Chọn khối kiến thức'}
          style={{ width: '100%' }}
        />
      </div>

      {hasCreate !== false ? (
        <>
          <Button icon={<PlusOutlined />} onClick={onAddNew} />
          <Modal
            visible={visibleForm}
            bodyStyle={{ padding: 0 }}
            footer={null}
            onCancel={() => setVisibleForm(false)}
          >
            <FormNganh title="khối kiến thức" />
          </Modal>
        </>
      ) : null}
    </div>
  );
};

export default SelectKhoiKienThuc;
