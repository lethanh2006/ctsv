import { EOperatorType } from '@/components/Table/constant';
import { Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectKhoaNganh = (props: {
	value?: string;
	onChange?: any;
	multiple?: boolean;
	namHoc?: number;
	disabled?: boolean;
	selectMa?: boolean;
}) => {
	const { value, onChange, multiple, namHoc, disabled, selectMa } = props;
	const { danhSach, getAllModel, visibleForm } = useModel('daotao.khoanganh');

	useEffect(() => {
		if (!visibleForm)
			if (namHoc)
				getAllModel(false, { maKhoaSinhVien: 1 }, undefined, [
					{
						active: true,
						field: 'namBatDau',
						operator: EOperatorType.LESS_EQUAL,
						values: [namHoc],
					},
					{
						active: true,
						field: 'namKetThuc',
						operator: EOperatorType.GREAT_EQUAL,
						values: [namHoc],
					},
				]);
			else getAllModel(false, { maKhoaSinhVien: 1 });
	}, [visibleForm, namHoc]);

	return (
		<Select
			value={value}
			disabled={disabled}
			onChange={onChange}
			mode={multiple ? 'multiple' : undefined}
			options={danhSach.map((item) => ({
				key: item._id,
				value: selectMa ? item.ma : item._id,
				label: `${item?.ten} (${item.nganh?.ma})`,
			}))}
			showSearch
			showArrow
			optionFilterProp='label'
			placeholder='Chọn khóa ngành'
		/>
	);
};

export default SelectKhoaNganh;
