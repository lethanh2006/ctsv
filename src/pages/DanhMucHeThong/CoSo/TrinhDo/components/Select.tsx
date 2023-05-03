import { Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectTrinhDo = (props: {
  value?: string;
  onChange?: (id: string) => void;
  multiple?: boolean;
  allowClear?: boolean;
  placeholder?: string;
  hasDefault?: boolean;
}) => {
  const { value, onChange, multiple, allowClear, placeholder, hasDefault } = props;
  const { danhSach, getAllModel } = useModel('danhmuc.trinhdo');

  useEffect(() => {
    getAllModel().then((data) => {
      // Nếu chưa chọn giá trị và (sau khi thêm mới hoặc data chỉ có 1 phần tử)
      // Thì chọn phần tử đầu tiên
      if (hasDefault && data.length === 1 && !!onChange) onChange(data[0]._id);
    });
  }, []);

  return (
    <Select
      value={value}
      allowClear={allowClear}
      onChange={onChange}
      mode={multiple ? 'multiple' : undefined}
      options={danhSach.map((item) => ({
        key: item._id,
        value: item._id,
        label: `${item.dmTrinhDo.ten} (${item.ma})`,
      }))}
      showSearch
      optionFilterProp="label"
      placeholder={placeholder ?? 'Chọn trình độ đào tạo'}
      style={{ width: '100%' }}
    />
  );
};

export default SelectTrinhDo;
