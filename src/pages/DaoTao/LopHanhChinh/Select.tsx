import { Select, Spin } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import _ from 'lodash';
import { EOperatorType } from '@/components/Table/constant';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectLopHanhChinhDebounce = (props: {
  value?: string;
  onChange?: any;
  multiple?: boolean;
  mode?: 'multiple' | 'tags' | undefined;
  disabled?: boolean;
  selectTen?: boolean;
}) => {
  const { value, onChange, multiple, disabled, selectTen,mode } = props;
  const { danhSach, getModel, setFilters, filters, loading } = useModel('daotao.lophanhchinh');

  useEffect(() => {
    getModel();
  }, [filters]);

  const searchDebounceLopHanhChinh = _.debounce((val) => {
    setFilters([{ active: true, field: 'ten', values: [val], operator: EOperatorType.CONTAIN }]);
  }, 800);

  return (
    <Select
      mode={mode?mode:multiple ? 'multiple' : undefined}
      value={value}
      onChange={onChange}
      disabled={disabled}
      notFoundContent={loading ? <Spin spinning={true} /> : undefined}
      onSearch={(val) => searchDebounceLopHanhChinh(val)}
      options={danhSach.map((item) => ({
        key: item._id,
        value: selectTen ? item.ten : item._id,
        label: `${item.ten}`,
      }))}
      showSearch
      optionFilterProp="label"
      placeholder="Tìm kiếm lớp hành chính..."
    />
  );
};

export default SelectLopHanhChinhDebounce;
