import { Select, Spin } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import { EOperatorType } from '@/components/Table/constant';
import _ from 'lodash';
import { ELoaiLopHocPhan } from '@/services/DaoTao/constant';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectLopHocPhanDebounce = (props: {
  value?: string;
  onChange?: any;
  multiple?: boolean;
  mode?: 'multiple' | 'tags' | undefined;
  disabled?: boolean;
  selectTen?: boolean;
}) => {
  const { value, onChange, multiple, disabled, selectTen, mode } = props;
  const { danhSach, filters, setFilters, getModel, loading } = useModel('daotao.lophocphan');

  useEffect(() => {
    getModel({ loai: ELoaiLopHocPhan.CHINH });
  }, [filters]);

  const searchDebounceLopHocPhan = _.debounce((val) => {
    setFilters([{ active: true, field: 'ten', values: [val], operator: EOperatorType.CONTAIN }]);
  }, 800);
  console.log('danh sach lop',danhSach)
  return (
    <Select
      mode={mode ? mode : multiple ? 'multiple' : undefined}
      value={value}
      onChange={onChange}
      disabled={disabled}
      notFoundContent={loading ? <Spin spinning={true} /> : undefined}
      onSearch={(val) => searchDebounceLopHocPhan(val)}
      options={danhSach.map((item) => ({
        key: item._id,
        value: selectTen ? item.ten : item._id,
        label: item.ten,
      }))}
      showSearch
      optionFilterProp="label"
      placeholder="Tìm kiếm lớp học phần..."
    />
  );
};

export default SelectLopHocPhanDebounce;
