import { Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectDonVi = (props: {
	value?: string;
	onChange?: (val: string) => void;
	multiple?: boolean;
	disabled?: boolean;
	style?: React.CSSProperties;
	allowClear?: boolean;
	placeholder?: string;
	selectMa?: boolean;
	readOnly?: boolean;
}) => {
	const { value, onChange, multiple, disabled, style, allowClear, placeholder, selectMa, readOnly } = props;
	const { danhSach, getAllModel } = useModel('tochucnhansu.donvi');

	useEffect(() => {
		// Fix cứng khoa
		getAllModel(false, undefined, undefined);
	}, []);

	return (
		<Select
			mode={multiple ? 'multiple' : undefined}
			value={value}
			allowClear={allowClear}
			onChange={onChange}
			disabled={disabled}
			options={danhSach.map((item) => ({
				key: item._id,
				value: selectMa ? item.maDonVi : item._id,
				label: `${item.ten} (${item.maDonVi})`,
			}))}
			removeIcon={readOnly ? null : undefined}
			showSearch
			optionFilterProp='label'
			placeholder={placeholder || 'Chọn đơn vị'}
			style={{ width: '100%', ...style, pointerEvents: readOnly ? 'none' : undefined }}
		/>
	);
};

export default SelectDonVi;
