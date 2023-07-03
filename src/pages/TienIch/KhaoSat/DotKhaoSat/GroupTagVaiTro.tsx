import { TenVaiTroBieuMau, type EVaiTroBieuMau } from '@/services/TienIch/constant';
import { Space, Tag } from 'antd';
import _ from 'lodash';
const { CheckableTag } = Tag;

const GroupTagVaiTro = (props: {
  value?: EVaiTroBieuMau[];
  onChange?: (arr: EVaiTroBieuMau[]) => void;
}) => {
  const { value, onChange } = props;

  const handleChange = (val: EVaiTroBieuMau, checked: boolean) => {
    if (!checked) {
      const newVal = value?.filter((i) => i !== val) ?? [];
      if (onChange) onChange(newVal);
    } else {
      const find = value?.find((i) => i === val);
      if (!find && onChange) {
        const newVal = [...(value ?? []), val];
        onChange(newVal);
      }
    }
  };

  return (
    <Space wrap size={8} className="lich-tuan-list">
      {Object.entries(TenVaiTroBieuMau).map(([val, label]) => (
        <CheckableTag
          key={val}
          checked={value?.includes(val as EVaiTroBieuMau) || false}
          onChange={(checked) => handleChange(val as EVaiTroBieuMau, checked)}
        >
          {label}
        </CheckableTag>
      ))}
    </Space>
  );
};

export default GroupTagVaiTro;
