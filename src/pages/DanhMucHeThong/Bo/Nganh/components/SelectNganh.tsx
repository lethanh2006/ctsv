import { Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectNganh = (props: { value?: string; onChange?: any; multiple?: boolean }) => {
  const { value, onChange, multiple } = props;
  const { danhSach, getAllModel, visibleForm } = useModel('danhmuc.dmnganh');

  useEffect(() => {
    if (!visibleForm) getAllModel();
  }, [visibleForm]);

  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <Select
        mode={multiple ? 'multiple' : undefined}
        value={value}
        onChange={onChange}
        options={danhSach.map((item) => ({
          key: item._id,
          value: item._id,
          label: `${item.ten} - ${item.ma}`,
        }))}
        showSearch
        optionFilterProp="label"
        placeholder="Chọn ngành đào tạo theo bộ"
      />
    </div>
  );
};

export default SelectNganh;
