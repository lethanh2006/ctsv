import { EOperatorType } from '@/components/Table/constant';
import { Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectNganhCoSo = (props: {
  value?: string;
  onChange?: (val: string) => void;
  multiple?: boolean;
  allowClear?: boolean;
  hasDefault?: boolean;
}) => {
  const { value, onChange, multiple, allowClear, hasDefault } = props;
  const { danhSach, getAllModel, visibleForm } = useModel('danhmuc.nganhdaotao');

  useEffect(() => {
    if (!visibleForm)
      getAllModel(false, undefined, undefined, [
        {
          field: 'parentId',
          operator: EOperatorType.NULL,
          values: [''],
          active: true,
        },
      ]).then((data) => {
        // Nếu chưa chọn giá trị và (sau khi thêm mới hoặc data chỉ có 1 phần tử)
        // Thì chọn phần tử đầu tiên
        if (hasDefault && data.length === 1 && !!onChange) onChange(data[0]._id);
      });
  }, [visibleForm]);

  return (
    <Select
      mode={multiple ? 'multiple' : undefined}
      value={value}
      onChange={onChange}
      options={danhSach.map((item) => ({
        key: item._id,
        value: item._id,
        label: `${item.dmNganh?.ten} (${item.ma})`,
      }))}
      showSearch
      optionFilterProp="label"
      placeholder="Chọn ngành đào tạo"
      allowClear={allowClear ?? false}
      style={{ width: '100%' }}
    />
  );
};

export default SelectNganhCoSo;
