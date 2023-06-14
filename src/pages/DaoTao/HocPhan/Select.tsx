import { Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectHocPhan = (props: {
  value?: string;
  onChange?: (hocPhanId: string) => void;
  multiple?: boolean;
  disabled?: boolean;
  allowClear?: boolean;
  loadData?: boolean;
  selectMa?: boolean;
  style?: React.CSSProperties;
  condition?: { donVi?: string };
  selectAll?: boolean;
}) => {
  const {
    value,
    onChange,
    multiple,
    allowClear,
    loadData,
    selectMa,
    disabled,
    style,
    condition,
    selectAll,
  } = props;
  const { danhSach, getAllModel } = useModel('daotao.hocphan');

  useEffect(() => {
    if (loadData !== false)
      getAllModel(false, undefined, { ...condition, active: !selectAll ? true : undefined });
  }, [loadData, JSON.stringify(condition)]);

  return (
    <Select
      mode={multiple ? 'multiple' : undefined}
      disabled={disabled}
      value={value}
      onChange={onChange}
      options={danhSach.map((item) => ({
        key: item._id,
        value: selectMa ? item.ma : item._id,
        label: `${item.ten} (${item.ma})`,
      }))}
      showSearch
      optionFilterProp="label"
      placeholder="Chọn học phần"
      style={{ width: '100%', ...style }}
      allowClear={allowClear ?? false}
    />
  );
};

export default SelectHocPhan;
