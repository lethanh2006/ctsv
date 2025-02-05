import { Select } from 'antd';
import React, { useEffect } from 'react';
import { useModel } from 'umi';
import { ELoaiBieuMau } from '@/services/KhaoSat/constant';

/**
 * Select để cho vào FormItem
 */
const SelectMauDiemRenLuyen = (props: {
	value?: string;
	onChange?: (id: string) => void;
	multiple?: boolean;
	allowClear?: boolean;
	placeholder?: string;
	style?: React.CSSProperties;
	disabled?: boolean;
	loai?: ELoaiBieuMau;
}) => {
	const { value, onChange, multiple, allowClear, placeholder, style, disabled, loai } = props;
	const { danhSach, getAllModel, visibleForm } = useModel('khaosat.bieumau');

	useEffect(() => {
		if (!visibleForm) getAllModel(undefined, undefined, { loai: loai, kichHoat: true });
	}, [visibleForm, loai]);

	return (
		<Select
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
			placeholder={placeholder ?? 'Chọn biểu mẫu điểm rèn luyện'}
			style={{ width: '100%', ...style }}
		/>
	);
};

export default SelectMauDiemRenLuyen;
