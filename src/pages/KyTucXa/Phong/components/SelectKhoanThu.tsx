import { Select } from 'antd';
import React, { useEffect } from 'react';
import { useModel } from 'umi';

/**
 * Select Khoản thu để cho vào FormItem
 */
const SelectKhoanThu = (props: {
	value?: string;
	onChange?: (id: string) => void;
	multiple?: boolean;
	condition?: any;
	allowClear?: boolean;
	style?: React.CSSProperties;
	isSetRecord?: boolean;
	selectMa?: boolean;
}) => {
	const { value, onChange, multiple, condition, allowClear, style, isSetRecord } = props;
	const { danhSach, getAllModel, setRecord, loading } = useModel('kytucxa.khoanthu');

	useEffect(() => {
		getAllModel(isSetRecord, undefined, condition).then(() => {
			if (!isSetRecord) setRecord(undefined);
		});
	}, [JSON.stringify(condition)]);

	return (
		<Select
			mode={multiple ? 'multiple' : undefined}
			value={value}
			onChange={onChange}
			options={danhSach.map((item) => ({
				key: item.maMucThu,
				value: item.maMucThu,
				label: `${item.ten} - ${item.unitAmount?.toLocaleString('vi-VN')} ${item.currency}`,
			}))}
			showSearch
			optionFilterProp='label'
			placeholder='Chọn khoản thu'
			allowClear={allowClear ?? false}
			style={{ width: '100%', ...style }}
			loading={loading}
		/>
	);
};

export default SelectKhoanThu;
