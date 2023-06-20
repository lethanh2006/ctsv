import { Select } from 'antd';
import React, { useEffect } from 'react';
import { useModel } from 'umi';

/**
 * Select để cho vào FormItem
 */
const SelectMauKhaoSat = (props: {
  value?: string;
  onChange?: (id: string) => void;
  multiple?: boolean;
  allowClear?: boolean;
  placeholder?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
}) => {
  const { value, onChange, multiple, allowClear, placeholder, style, disabled } = props;
  const { danhSach, getAllModel, visibleForm } = useModel('tienich.bieumau');

  useEffect(() => {
    if (!visibleForm) getAllModel();
  }, [visibleForm]);

  return (
    <Select
      mode={multiple ? 'multiple' : undefined}
      allowClear={allowClear}
      value={value}
      disabled={disabled}
      onChange={onChange}
      options={danhSach.map((item) => ({
        key: item._id,
        value: item._id,
        label: item.tieuDe,
      }))}
      showSearch
      optionFilterProp="label"
      placeholder={placeholder ?? 'Chọn biểu mẫu khảo sát'}
      style={{ width: '100%', ...style }}
    />
  );
};

export default SelectMauKhaoSat;
