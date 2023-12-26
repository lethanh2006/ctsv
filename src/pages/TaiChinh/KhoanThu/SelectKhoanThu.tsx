import { Select } from 'antd';
import { useModel } from 'umi';
import { useEffect } from 'react';

/**
 * Select khoản thu để cho vào FormItem
 */
const SelectKhoanThu = (props: {
	value?: string | null;
	onChange?: (val: string | null) => void;
	multiple?: boolean;
	hasCreate?: boolean;
	idNguonThu?: string;
}) => {
	const { value, onChange, multiple, hasCreate, idNguonThu } = props;
	const { danhSach, getAllModel, visibleForm,setDanhSach } = useModel('taichinh.khoanthu');
	useEffect(() => {
		if (!visibleForm && idNguonThu) getAllModel(undefined, undefined, { nguonThu: idNguonThu });

    return(()=>{
      setDanhSach([])
    })
	}, [visibleForm, idNguonThu]);
	return (


				<Select
          notFoundContent={'Vui lòng chọn nguồn thu'}
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
					placeholder='Chọn khoản thu'
				/>


	);
};

export default SelectKhoanThu;
