import { Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectKhoaSinhVien = (props: {
  value?: string;
  onChange?: (val: string) => void;
  multiple?: boolean;
  condition?: any;
  allowClear?: boolean;
  disabled?: boolean;
}) => {
  const { value, onChange, multiple, condition, allowClear, disabled } = props;
  const { danhSach, getAllModel, visibleForm } = useModel('daotao.khoasinhvien');

  useEffect(() => {
    if (!visibleForm) getAllModel(false, undefined, condition);
  }, [visibleForm, JSON.stringify(condition)]);

  return (
    <Select
      mode={multiple ? 'multiple' : undefined}
      value={value}
      onChange={onChange}
      disabled={disabled}
      options={danhSach.map((item) => ({
        key: item._id,
        value: item._id,
        label: item.ten,
      }))}
      showSearch
      optionFilterProp="label"
      placeholder="Chọn khóa sinh viên"
      allowClear={allowClear ?? false}
      style={{ width: '100%' }}
    />
  );
};

export default SelectKhoaSinhVien;
