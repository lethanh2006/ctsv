import { Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectHinhThuc = (props: {
  value?: string;
  onChange?: (id: string) => void;
  multiple?: boolean;
  allowClear?: boolean;
  placeholder?: string;
}) => {
  const { value, onChange, multiple, allowClear, placeholder } = props;
  const { danhSach, getAllModel, visibleForm } = useModel('danhmuc.hinhthucdaotao');

  useEffect(() => {
    if (!visibleForm) getAllModel();
  }, [visibleForm]);

  return (
    <Select
      mode={multiple ? 'multiple' : undefined}
      allowClear={allowClear}
      value={value}
      onChange={onChange}
      options={danhSach.map((item) => ({
        key: item._id,
        value: item._id,
        label: `${item?.danhMucHTDT?.ten} (${item?.danhMucHTDT?.ma})`,
      }))}
      showSearch
      optionFilterProp="label"
      placeholder={placeholder ?? 'Chọn hình thức đào tạo cơ sở'}
      style={{ width: '100%' }}
    />
  );
};

export default SelectHinhThuc;
