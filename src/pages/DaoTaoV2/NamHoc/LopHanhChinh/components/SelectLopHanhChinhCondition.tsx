import type { LopHanhChinh } from '@/services/DaoTaoV2/NamHoc/LopHanhChinh/typings';
import { Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectLopHanhChinhCondition = (props: {
	value?: string;
	onChange?: (val: string) => void;
	multiple?: boolean;
	disabled?: boolean;
	style?: React.CSSProperties;
	isSetRecord?: boolean;
	condition?: Partial<LopHanhChinh.IRecord>;
	selectMa?: boolean;
	keyName?: string;
}) => {
	const { value, onChange, multiple, disabled, style, isSetRecord, condition, selectMa, keyName } = props;
	const { danhSach, getAllModel } = useModel('daotaov2.namhoc.lophanhchinh');

	useEffect(() => {
		getAllModel(!!isSetRecord, undefined, condition);
	}, [JSON.stringify(condition)]);

	return (
		<Select
			allowClear
			mode={multiple ? 'multiple' : undefined}
			value={value}
			onChange={onChange}
			disabled={disabled}
			options={danhSach.map((item: any) => ({
				key: item._id,
				value: selectMa ? item.ten : keyName ? item[keyName] : item._id,
				label: `${item.ten}`,
			}))}
			showSearch
			optionFilterProp='label'
			placeholder='Chọn lớp hành chính'
			style={{ width: '100%', ...style }}
		/>
	);
};

export default SelectLopHanhChinhCondition;
