import FormDanhMucChung from '@/pages/DanhMuc/Chung/components/Form';
import type { ELoaiDanhMucChung } from '@/services/QuyTrinhDong/DanhMuc/constants';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Modal, Popover, Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const SelectDanhMuc = (props: {
	value?: string;
	onChange?: any;
	hasCreate?: boolean;
	multiple?: boolean;
	disabled?: boolean;
	condition?: any;
	maModule: ELoaiDanhMucChung;
}) => {
	const { value, onChange, hasCreate, multiple, disabled, condition } = props;
	const { danhSach, getAllModel, setVisibleForm, visibleForm, setEdit, setRecord } = useModel('quytrinh.danhmuc');

	useEffect(() => {
		if (!visibleForm && !danhSach.length) getAllModel(false, undefined, { ...condition, maModule: props.maModule });
	}, [visibleForm, JSON.stringify(condition)]);

	const onAddNew = () => {
		setRecord(undefined);
		setEdit(false);
		setVisibleForm(true);
	};

	return (
		<div style={{ display: 'flex', gap: 8 }}>
			<div className={hasCreate !== false ? 'width-select-custom' : 'fullWidth'}>
				<Select
					mode={multiple ? 'multiple' : undefined}
					value={value}
					disabled={disabled}
					onChange={onChange}
					showSearch
					options={danhSach.map((item) => ({
						label: (
							<Popover
								placement='left'
								content={
									<div>
										{item.danhSachGiaTri.map((giaTri) => (
											<div key={giaTri?.value}>- {giaTri?.value}</div>
										))}
									</div>
								}
							>
								{item.maDanhMuc}
							</Popover>
						),
						value: item.maDanhMuc,
					}))}
					placeholder='Danh mục'
				/>
			</div>

			{hasCreate !== false ? (
				<>
					<Button icon={<PlusOutlined />} onClick={onAddNew} />
					<Modal visible={visibleForm} bodyStyle={{ padding: 0 }} footer={null} onCancel={() => setVisibleForm(false)}>
						<FormDanhMucChung getData={() => getAllModel(false, undefined, condition)} maModule={props.maModule} />
					</Modal>
				</>
			) : null}
		</div>
	);
};

export default SelectDanhMuc;
