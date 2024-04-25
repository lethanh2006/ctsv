import { EOperatorType } from '@/components/Table/constant';
import { Select, Spin } from 'antd';
import _ from 'lodash';
import { useEffect } from 'react';
import { useModel } from 'umi';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectLopHanhChinhDebounce = (props: {
	value?: string;
	onChange?: any;
	multiple?: boolean;
	disabled?: boolean;
	selectTen?: boolean;
	readOnly?: boolean;
}) => {
	const { value, onChange, multiple, disabled, selectTen, readOnly } = props;
	const { danhSach, getModel, setFilters, filters, loading } = useModel('daotaov2.namhoc.lophanhchinh');

	useEffect(() => {
		getModel();
	}, [filters]);

	const searchDebounceLopHanhChinh = _.debounce((val) => {
		setFilters([{ active: true, field: 'ten', values: [val], operator: EOperatorType.CONTAIN }]);
	}, 800);

	return (
		<Select
			style={{ pointerEvents: readOnly ? 'none' : undefined }}
			removeIcon={readOnly ? null : undefined}
			mode={multiple ? 'multiple' : undefined}
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
			optionFilterProp='label'
			placeholder='Tìm kiếm lớp hành chính...'
		/>
	);
};

export default SelectLopHanhChinhDebounce;
