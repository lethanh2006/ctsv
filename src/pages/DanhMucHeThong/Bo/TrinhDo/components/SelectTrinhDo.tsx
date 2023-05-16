import { Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectTrinhDo = (props: { value?: string; onChange?: any; multiple?: boolean }) => {
  const { value, onChange, multiple } = props;
  const { danhSach, getAllModel } = useModel('danhmuc.dmtrinhdo');

  useEffect(() => {
    getAllModel();
  }, []);

  return (
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
      placeholder="Chọn trình độ đào tạo của bộ"
    />
  );
};

export default SelectTrinhDo;
