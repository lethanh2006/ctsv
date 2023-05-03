import { EOperatorType } from '@/components/Table/constant';
import { Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectChuyenNganh = (props: {
  value?: string;
  onChange?: (val: string) => void;
  multiple?: boolean;
  allowClear?: boolean;
  disabled?: boolean;
  nganhId?: string;
}) => {
  const { value, onChange, multiple, allowClear, disabled, nganhId } = props;
  const { danhSach, getAllModel, visibleForm } = useModel('danhmuc.nganhdaotao');

  useEffect(() => {
    if (!visibleForm)
      getAllModel(false, undefined, undefined, [
        {
          field: 'parentId',
          operator: !!nganhId ? EOperatorType.EQUAL : EOperatorType.NOT_NULL,
          values: [nganhId ?? ''],
          active: true,
        },
      ]);
  }, [visibleForm]);

  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <Select
        mode={multiple ? 'multiple' : undefined}
        disabled={disabled}
        value={value}
        onChange={onChange}
        options={danhSach.map((item) => ({
          key: item._id,
          value: item._id,
          label: `${item.ten} - ${item.parent?.ten ?? ''}`,
        }))}
        showSearch
        optionFilterProp="label"
        placeholder="Chọn chuyên ngành đào tạo"
        allowClear={allowClear ?? false}
      />
    </div>
  );
};

export default SelectChuyenNganh;
