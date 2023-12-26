import { Select } from 'antd';
import { useModel } from 'umi';
import { useEffect } from 'react';

/**
 * Secect Chức vụ để cho vào FormItem
 */
const SelectNguonThu = (props: {
	value?: string | null;
	onChange?: (val: string | null) => void;
	multiple?: boolean;
	hasCreate?: boolean;
}) => {
	const { value, onChange, multiple, hasCreate } = props;
	const { danhSach, getAllModel, visibleForm, setDanhSach } = useModel('taichinh.nguonthu');
	useEffect(() => {
		if (!visibleForm) getAllModel();
		return () => {
			setDanhSach([]);
		};
	}, [visibleForm]);
	return (

				<Select
					mode={multiple ? 'multiple' : undefined}
					value={value}
					onChange={onChange}
					options={danhSach?.map((item) => ({
						key: item._id,
						value: item._id,
						label: `${item.name}`,
					}))}
					showSearch
					optionFilterProp='label'
					placeholder='Chọn nguồn thu'
				/>


	);
};

export default SelectNguonThu;
