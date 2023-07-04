import { TenVaiTroBieuMau, EVaiTroBieuMau } from '@/services/TienIch/constant';
import { Space, Tag } from 'antd';
import _ from 'lodash';
const { CheckableTag } = Tag;

const GroupTagVaiTro = (props: {
  value?: EVaiTroBieuMau[];
  onChange?: (arr: EVaiTroBieuMau[]) => void;
  listVaiTro?: EVaiTroBieuMau[];
}) => {
  const { value, onChange } = props;
  const listVaiTro = props.listVaiTro ?? Object.values(EVaiTroBieuMau);

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
      {listVaiTro.map((item) => (
        <CheckableTag
          key={item}
          checked={value?.includes(item) || false}
          onChange={(checked) => handleChange(item, checked)}
        >
          {TenVaiTroBieuMau[item]}
        </CheckableTag>
      ))}
    </Space>
  );
};

export default GroupTagVaiTro;
