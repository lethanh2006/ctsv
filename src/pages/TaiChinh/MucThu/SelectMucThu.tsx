import { Select } from 'antd';
import { useModel } from 'umi';
import { useEffect } from 'react';
import { tienVietNam } from '@/utils/utils';

/**
 * Secect Chức vụ để cho vào FormItem
 */
const SelectMucThu = (props: {
	value?: string | null;
	onChange?: (val: string | null) => void;
	multiple?: boolean;
	hasCreate?: boolean;
	idKhoanThu?: string;
}) => {
	const { value, onChange, multiple, idKhoanThu } = props;
	const { danhSach, getAllModel, visibleForm, setDanhSach } = useModel('taichinh.mucthu');
	useEffect(() => {
		if (!visibleForm && idKhoanThu) getAllModel(undefined, undefined, { product: idKhoanThu });

		return () => {
			setDanhSach([]);
		};
	}, [visibleForm, idKhoanThu]);
	return (
		<Select
			notFoundContent={'Vui lòng chọn khoản thu'}
			mode={multiple ? 'multiple' : undefined}
			value={value}
			onChange={onChange}
			options={danhSach?.map((item) => ({
				key: item._id,
				value: item._id,
				label: `${item.name} (${tienVietNam(item.unitAmount)})`,
			}))}
			showSearch
			optionFilterProp='label'
			placeholder='Chọn mức thu'
		/>
	);
};

export default SelectMucThu;
