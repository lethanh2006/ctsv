import SelectSinhVienDebounce from '@/pages/DaoTaoV2/SinhVien/component/Select';
import TableSelectUser from '@/pages/ThongBao/components/TableSelect';
import { EVaiTroKhaoSat } from '@/services/ThongBao/constant';
import { ImportOutlined } from '@ant-design/icons';
import { Button, Card, Form, Modal, type FormInstance } from 'antd';
import { useEffect, useState } from 'react';

const SinhVienDangKySection = (props: { form: FormInstance; dotId?: string; visible?: boolean }) => {
	const { form, visible } = props;
	const [visibleSelect, setVisibleSelect] = useState(false);
	const [selectedUsers, setSelectedUsers] = useState<any[]>([]);

	useEffect(() => {
		if (visible) {
			setSelectedUsers([]);
		}
	}, [visible]);

	return (
		<Card title={'Danh sách sinh viên đăng ký KTX'} className='form-card' style={{ marginTop: 12 }}>
			<Form.Item name='danhSach' label='Chọn sinh viên' help='Chọn nhiều sinh viên (tìm theo họ tên hoặc mã)'>
				<SelectSinhVienDebounce multiple selectMa />
			</Form.Item>

			<div style={{ marginTop: 8 }}>
				<Button onClick={() => setVisibleSelect(true)} icon={<ImportOutlined />} style={{ width: '100%' }}>
					Nhập danh sách sinh viên
				</Button>
			</div>

			<Modal
				open={visibleSelect}
				onCancel={() => setVisibleSelect(false)}
				title={'Chọn/nhập danh sách sinh viên'}
				width={900}
				footer={null}
				destroyOnClose
			>
				<TableSelectUser
					type={EVaiTroKhaoSat.SINH_VIEN}
					selectedUsers={selectedUsers}
					setSelectedUsers={(val: any) => setSelectedUsers(val)}
				/>
				<div style={{ textAlign: 'right', marginTop: 12 }}>
					<Button
						onClick={() => {
							const codes = (selectedUsers ?? []).map((u: any) => u.code).filter(Boolean);
							form.setFieldsValue({ danhSach: codes });
							setVisibleSelect(false);
						}}
						type='primary'
					>
						Chọn xong
					</Button>
				</div>
			</Modal>
		</Card>
	);
};

export default SinhVienDangKySection;
