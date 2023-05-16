import { Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectChuongTrinh = (props: {
  value?: string;
  onChange?: any;
  multiple?: boolean;
  disabled?: boolean;
}) => {
  const { value, onChange, multiple, disabled } = props;
  const { danhSach, getAllModel, visibleForm } = useModel('chuongtrinhdaotao.chuongtrinh');

  useEffect(() => {
    if (!visibleForm) getAllModel();
  }, [visibleForm]);

  return (
    <div style={{ display: 'flex', gap: 8 }}>
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
        placeholder="Chọn chương trình đào tạo cơ sở"
      />
    </div>
  );
};

export default SelectChuongTrinh;
