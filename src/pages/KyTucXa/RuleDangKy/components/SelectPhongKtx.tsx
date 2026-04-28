import { Select } from 'antd';
import React, { useEffect } from 'react';
import { useModel } from 'umi';

/**
 * Select Phòng KTX để cho vào FormItem
 */
const SelectPhongKTX = (props: {
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
	const { danhSach, getModel, setRecord, loading } = useModel('kytucxa.phong');

	useEffect(() => {
		getModel(condition).then(() => {
			if (!isSetRecord) setRecord(undefined);
		});
	}, [JSON.stringify(condition)]);

	return (
		<Select
			mode={multiple ? 'multiple' : undefined}
			value={value}
			onChange={onChange}
			options={danhSach.map((item) => ({
				key: item._id,
				value: item.ma,
				label: `${item.ten}`,
			}))}
			showSearch
			optionFilterProp='label'
			placeholder='Chọn phòng ký túc xá'
			allowClear={allowClear ?? false}
			style={{ width: '100%', ...style }}
			loading={loading}
		/>
	);
};

export default SelectPhongKTX;
