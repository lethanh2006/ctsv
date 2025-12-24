import { EOperatorType } from '@/components/Table/constant';
import type { BieuMau } from '@/services/TienIch/BieuMau/typings';
import { ELoaiBieuMau } from '@/services/TienIch/constant';
import { Select } from 'antd';
import React, { useEffect } from 'react';
import { useModel } from 'umi';

/**
 * Select để cho vào FormItem
 */
const SelectMauKhaoSat = (props: {
	value?: string;
	onChange?: (id: string) => void;
	multiple?: boolean;
	allowClear?: boolean;
	placeholder?: string;
	style?: React.CSSProperties;
	disabled?: boolean;
	condition?: Partial<BieuMau.Record>;
}) => {
	const { value, onChange, multiple, allowClear, placeholder, style, disabled, condition } = props;
	const { danhSach, getAllModel, visibleForm, loading } = useModel('tienich.bieumau');

	useEffect(() => {
		if (!visibleForm)
			getAllModel(undefined, undefined, condition, [
				{
					active: true,
					field: 'kichHoat',
					values: [true],
					operator: EOperatorType.EQUAL,
				},
				{
					active: true,
					field: 'loai',
					operator: EOperatorType.NOT_INCLUDE,
					values: [ELoaiBieuMau.TRAC_NGHIEM], //Lọc biểu mẫu liên quan đến giao bài tập phân hệ cán bộ
				},
				{
					active: true,
					field: 'khaoSatChaId',
					operator: EOperatorType.NULL, //Loại bỏ biểu mẫu tự sinh
				},
			]);
	}, [visibleForm, JSON.stringify(condition)]);

	return (
		<Select
			loading={loading}
			mode={multiple ? 'multiple' : undefined}
			allowClear={allowClear}
			value={value}
			disabled={disabled}
			onChange={onChange}
			options={danhSach.map((item) => ({
				key: item._id,
				value: item._id,
				label: item.tieuDe,
			}))}
			showSearch
			optionFilterProp='label'
			placeholder={placeholder ?? 'Chọn biểu mẫu khảo sát'}
			style={{ width: '100%', ...style }}
		/>
	);
};

export default SelectMauKhaoSat;
